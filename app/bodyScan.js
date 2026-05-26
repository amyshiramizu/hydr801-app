'use client';
// MediaPipe-based body measurement pipeline. Runs entirely in the browser so
// raw photos never leave the device — only the numbers + a generated SVG
// silhouette + a downsized thumbnail get POSTed to the server.
//
// Pipeline:
//   1. PoseLandmarker  → 33 body landmarks (shoulders, hips, knees, ankles)
//   2. ImageSegmenter  → selfie mask, used to measure body widths/depths
//   3. Calibrate pixel → inch ratio from the segmentation mask's full height
//      vs. the height the patient entered
//   4. Combine front widths + side depths into ellipse circumferences
//   5. Body fat % via the US Navy method (needs neck/waist/hip + sex/height)
//
// MediaPipe assets are loaded from the jsdelivr/google CDN on first use; no
// model files live in this repo. Loader caches the tasks across scans.

const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm';
const POSE_MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';
const SEGMENTER_MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/1/selfie_segmenter.tflite';

let _tasksPromise = null;

export async function loadTasks() {
  if (_tasksPromise) return _tasksPromise;
  _tasksPromise = (async () => {
    const { FilesetResolver, PoseLandmarker, ImageSegmenter } = await import('@mediapipe/tasks-vision');
    const fileset = await FilesetResolver.forVisionTasks(WASM_URL);
    const [poseLandmarker, imageSegmenter] = await Promise.all([
      PoseLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: POSE_MODEL_URL, delegate: 'GPU' },
        runningMode: 'IMAGE',
        numPoses: 1,
        minPoseDetectionConfidence: 0.5,
        minPosePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      }),
      ImageSegmenter.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: SEGMENTER_MODEL_URL, delegate: 'GPU' },
        runningMode: 'IMAGE',
        outputCategoryMask: true,
        outputConfidenceMasks: false,
      }),
    ]);
    return { poseLandmarker, imageSegmenter };
  })().catch((err) => { _tasksPromise = null; throw err; });
  return _tasksPromise;
}

// Decode an image file into an off-screen <img> (used as input to MediaPipe).
function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
    img.src = url;
  });
}

// Render the image to a canvas (so we can read pixels for the segmentation
// mask alignment + later thumbnail generation).
function imageToCanvas(img, maxDim = 1024) {
  const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.round(img.naturalWidth * scale);
  const h = Math.round(img.naturalHeight * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);
  return { canvas, ctx, width: w, height: h };
}

// From the category mask, walk each row and record (leftEdge, rightEdge) of
// the body pixels. Returns a Uint16Array indexed by Y; 0xFFFF = no body.
function maskEdgesPerRow(maskU8, width, height) {
  const left = new Uint16Array(height).fill(0xFFFF);
  const right = new Uint16Array(height).fill(0);
  let hasAny = false;
  for (let y = 0; y < height; y++) {
    const rowStart = y * width;
    let l = 0xFFFF, r = 0;
    for (let x = 0; x < width; x++) {
      // selfie_segmenter: category 0 = person, 1 = background  (per model card)
      if (maskU8[rowStart + x] === 0) {
        if (x < l) l = x;
        if (x > r) r = x;
      }
    }
    left[y] = l; right[y] = r;
    if (l !== 0xFFFF) hasAny = true;
  }
  return hasAny ? { left, right } : null;
}

// Median across a small Y window — robust to single-row mask noise.
function widthAtY(edges, y, window = 5) {
  const ys = [];
  for (let dy = -window; dy <= window; dy++) {
    const yy = y + dy;
    if (yy < 0 || yy >= edges.left.length) continue;
    if (edges.left[yy] !== 0xFFFF) ys.push(edges.right[yy] - edges.left[yy]);
  }
  if (!ys.length) return null;
  ys.sort((a, b) => a - b);
  return ys[Math.floor(ys.length / 2)];
}

function maskExtent(edges) {
  let top = -1, bottom = -1;
  for (let y = 0; y < edges.left.length; y++) {
    if (edges.left[y] !== 0xFFFF) { top = y; break; }
  }
  for (let y = edges.left.length - 1; y >= 0; y--) {
    if (edges.left[y] !== 0xFFFF) { bottom = y; break; }
  }
  return { top, bottom, pixelHeight: bottom - top };
}

// Ramanujan's approximation for ellipse circumference. Inputs are the two
// semi-axes (half-widths in inches).
function ellipseCircumference(a, b) {
  if (a == null || b == null || a <= 0 || b <= 0) return null;
  const h = ((a - b) ** 2) / ((a + b) ** 2);
  return Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
}

// US Navy body-fat method (returns % body fat, or null if inputs missing).
//   male:   86.010·log10(waist − neck) − 70.041·log10(height) + 36.76
//   female: 163.205·log10(waist + hip − neck) − 97.684·log10(height) − 78.387
function navyBodyFat({ sex, heightIn, neckIn, waistIn, hipsIn }) {
  if (!heightIn || !neckIn || !waistIn) return null;
  const log10 = Math.log10 || ((x) => Math.log(x) / Math.LN10);
  if (sex === 'male') {
    const denom = waistIn - neckIn;
    if (denom <= 0) return null;
    return 86.010 * log10(denom) - 70.041 * log10(heightIn) + 36.76;
  }
  if (!hipsIn) return null;
  const denom = waistIn + hipsIn - neckIn;
  if (denom <= 0) return null;
  return 163.205 * log10(denom) - 97.684 * log10(heightIn) - 78.387;
}

// Build a clean stylized silhouette from the front mask. Outputs an SVG path
// at 200×400 — fits inline in the result card without serving the photo.
function silhouetteSvg(edges, width, height) {
  const { top, bottom } = maskExtent(edges);
  if (top < 0 || bottom <= top) return null;
  const targetH = 400, targetW = 200;
  const scaleY = targetH / (bottom - top);
  const sample = (y) => {
    const w = widthAtY(edges, y, 2);
    if (w == null) return null;
    const cx = (edges.left[y] + edges.right[y]) / 2;
    return { cx, half: w / 2 };
  };
  const allCx = [];
  for (let y = top; y <= bottom; y += 4) {
    const s = sample(y);
    if (s) allCx.push(s.cx);
  }
  const bodyCx = allCx.length ? allCx.reduce((a, b) => a + b, 0) / allCx.length : width / 2;
  const scaleX = (targetW * 0.42) / (Math.max(...allCx.map(cx => Math.abs(cx - bodyCx))) || 1);

  const right = [], left = [];
  for (let y = top; y <= bottom; y += 3) {
    const s = sample(y);
    if (!s) continue;
    const sy = ((y - top) * scaleY).toFixed(1);
    const halfPx = ((edges.right[y] - edges.left[y]) / 2) * scaleX;
    right.push(`${(targetW / 2 + halfPx).toFixed(1)},${sy}`);
    left.push(`${(targetW / 2 - halfPx).toFixed(1)},${sy}`);
  }
  const path = `M ${right.join(' L ')} L ${left.reverse().join(' L ')} Z`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${targetW} ${targetH}" width="${targetW}" height="${targetH}"><path d="${path}" fill="#4A6741" opacity="0.85"/></svg>`;
}

// Down-scale a canvas to a small JPEG data-URL for the provider thumbnail.
function canvasToThumbnail(canvas, maxDim = 200) {
  const scale = Math.min(1, maxDim / Math.max(canvas.width, canvas.height));
  const w = Math.max(1, Math.round(canvas.width * scale));
  const h = Math.max(1, Math.round(canvas.height * scale));
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  c.getContext('2d').drawImage(canvas, 0, 0, w, h);
  return c.toDataURL('image/jpeg', 0.7);
}

// Process a single (front or side) photo: returns landmarks, mask edges,
// thumbnail.
async function processOne(file, { poseLandmarker, imageSegmenter }) {
  const img = await loadImageFromFile(file);
  const { canvas, ctx, width, height } = imageToCanvas(img, 1024);
  const poseResult = poseLandmarker.detect(canvas);
  const segResult = imageSegmenter.segment(canvas);
  const landmarks = poseResult?.landmarks?.[0] || null;
  const worldLandmarks = poseResult?.worldLandmarks?.[0] || null;

  let edges = null;
  const mask = segResult?.categoryMask;
  if (mask) {
    const data = mask.getAsUint8Array();
    edges = maskEdgesPerRow(data, width, height);
    mask.close();
  }
  segResult?.confidenceMasks?.forEach((m) => m.close());

  return {
    width, height, landmarks, worldLandmarks, edges,
    thumbnail: canvasToThumbnail(canvas, 200),
  };
}

// Average pose-presence confidence across the visible landmarks of interest.
function poseConfidence(landmarks) {
  if (!landmarks) return 0;
  const keys = [11, 12, 23, 24, 25, 26, 27, 28];
  let sum = 0, n = 0;
  for (const k of keys) {
    const v = landmarks[k]?.visibility;
    if (Number.isFinite(v)) { sum += v; n++; }
  }
  return n ? sum / n : 0;
}

// Main entry: run both photos through MediaPipe, calibrate, produce
// measurements + silhouette + thumbnails.
export async function runBodyScan({ frontFile, sideFile, heightIn, weightLbs, sex }) {
  if (!frontFile || !sideFile) throw new Error('Need both front and side photos.');
  if (!heightIn || heightIn < 36 || heightIn > 96) throw new Error('Height (inches) is required.');

  const tasks = await loadTasks();
  const front = await processOne(frontFile, tasks);
  const side = await processOne(sideFile, tasks);

  if (!front.landmarks) throw new Error('Could not detect a person in the front photo. Stand back further and try again.');
  if (!side.landmarks) throw new Error('Could not detect a person in the side photo. Turn 90° and try again.');
  if (!front.edges || !side.edges) throw new Error('Could not isolate body outline. Use a plain background and good lighting.');

  // Calibrate: full-body mask height === heightIn.
  const frontExtent = maskExtent(front.edges);
  const sideExtent = maskExtent(side.edges);
  if (frontExtent.pixelHeight <= 0 || sideExtent.pixelHeight <= 0) {
    throw new Error('Could not measure your full height in the photo. Make sure your whole body is in frame.');
  }
  const pxPerInchFront = frontExtent.pixelHeight / heightIn;
  const pxPerInchSide = sideExtent.pixelHeight / heightIn;

  // Landmark Y in pixel space.
  const fy = (idx) => front.landmarks[idx].y * front.height;
  const sy = (idx) => side.landmarks[idx].y * side.height;

  // Reference Y positions (front photo).
  const shoulderY_f = (fy(11) + fy(12)) / 2;
  const hipY_f = (fy(23) + fy(24)) / 2;
  const ankleY_f = (fy(27) + fy(28)) / 2;
  const kneeY_f = (fy(25) + fy(26)) / 2;
  const noseY_f = fy(0);

  const shoulderY_s = (sy(11) + sy(12)) / 2;
  const hipY_s = (sy(23) + sy(24)) / 2;
  const kneeY_s = (sy(25) + sy(26)) / 2;
  const ankleY_s = (sy(27) + sy(28)) / 2;

  // Anatomical Y offsets (fraction of shoulder-to-hip distance).
  const torsoLen_f = hipY_f - shoulderY_f;
  const torsoLen_s = hipY_s - shoulderY_s;
  const chestY_f = shoulderY_f + 0.20 * torsoLen_f;
  const chestY_s = shoulderY_s + 0.20 * torsoLen_s;
  const waistY_f = shoulderY_f + 0.62 * torsoLen_f;
  const waistY_s = shoulderY_s + 0.62 * torsoLen_s;
  const upperThighY_f = hipY_f + 0.12 * (kneeY_f - hipY_f);
  const bicepY_f = fy(11) + 0.35 * (fy(13) - fy(11));   // shoulder→elbow
  const neckY_f = shoulderY_f - 0.45 * (shoulderY_f - noseY_f);

  // Read widths (front) / depths (side) from segmentation mask.
  const wPxFront = (y) => widthAtY(front.edges, Math.round(y), 4);
  const wPxSide  = (y) => widthAtY(side.edges,  Math.round(y), 4);

  // Front widths → inches (full body width = 2 × half-width).
  const shoulderWPx = wPxFront(shoulderY_f);
  const chestWPx = wPxFront(chestY_f);
  const waistWPx = wPxFront(waistY_f);
  const hipsWPx = wPxFront(hipY_f);
  const neckWPx = wPxFront(neckY_f);

  // Side depths → inches.
  const chestDPx = wPxSide(chestY_s);
  const waistDPx = wPxSide(waistY_s);
  const hipsDPx = wPxSide(hipY_s);
  const neckDPx = wPxSide(shoulderY_s - 0.45 * (shoulderY_s - sy(0)));

  const toIn = (px, scale) => (px != null ? px / scale : null);
  const shouldersIn = toIn(shoulderWPx, pxPerInchFront);
  const chestWidthIn = toIn(chestWPx, pxPerInchFront);
  const waistWidthIn = toIn(waistWPx, pxPerInchFront);
  const hipsWidthIn = toIn(hipsWPx, pxPerInchFront);
  const neckWidthIn = toIn(neckWPx, pxPerInchFront);

  const chestDepthIn = toIn(chestDPx, pxPerInchSide);
  const waistDepthIn = toIn(waistDPx, pxPerInchSide);
  const hipsDepthIn = toIn(hipsDPx, pxPerInchSide);
  const neckDepthIn = toIn(neckDPx, pxPerInchSide);

  // Circumferences via ellipse with (half-width, half-depth).
  const round1 = (v) => v != null && Number.isFinite(v) ? Math.round(v * 10) / 10 : null;
  const chestIn = round1(ellipseCircumference(chestWidthIn / 2, chestDepthIn / 2));
  const waistIn = round1(ellipseCircumference(waistWidthIn / 2, waistDepthIn / 2));
  const hipsIn = round1(ellipseCircumference(hipsWidthIn / 2, hipsDepthIn / 2));
  const neckIn = round1(ellipseCircumference(neckWidthIn / 2, neckDepthIn / 2));

  // Thigh: isolate one leg in the lower half of the mask at upperThighY.
  // Easier proxy — half the hip width × π × 0.6 (anatomical ratio).
  // For a slightly better number: at upperThighY, the mask spans both legs,
  // so half-width is roughly one thigh's width.
  const thighWPx = wPxFront(upperThighY_f);
  const thighWidthIn = toIn(thighWPx, pxPerInchFront);
  // depth of thigh ≈ width of thigh × 1.0 (roughly circular)
  const thighIn = round1(thighWidthIn != null
    ? ellipseCircumference(thighWidthIn / 4, thighWidthIn / 4)  // /4 because front shows both legs
    : null);

  // Arm: at bicepY, total mask width spans both arms + torso. Approximate
  // bicep with proportion of shoulder width.
  const armIn = round1(shouldersIn != null
    ? ellipseCircumference((shouldersIn * 0.16) / 2, (shouldersIn * 0.16) / 2)
    : null);

  // Inseam = pixel distance hip→ankle, scaled.
  const inseamIn = round1((ankleY_f - hipY_f) / pxPerInchFront);

  // Body fat via Navy method (needs neck/waist/hip + sex).
  const bodyFatPctEstimate = round1(navyBodyFat({
    sex, heightIn, neckIn, waistIn, hipsIn,
  }));
  const leanMassLbsEstimate = round1(
    weightLbs && bodyFatPctEstimate != null
      ? weightLbs * (1 - bodyFatPctEstimate / 100)
      : null
  );

  const silhouette = silhouetteSvg(front.edges, front.width, front.height);
  const poseConf = Math.round(((poseConfidence(front.landmarks) + poseConfidence(side.landmarks)) / 2) * 1000) / 1000;

  return {
    measurements: {
      chestIn, waistIn, hipsIn, thighIn, armIn, neckIn, shouldersIn: round1(shouldersIn), inseamIn,
    },
    bodyFatPctEstimate,
    leanMassLbsEstimate,
    silhouetteSvg: silhouette,
    thumbnailFront: front.thumbnail,
    thumbnailSide: side.thumbnail,
    poseConfidence: poseConf,
  };
}
