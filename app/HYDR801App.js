'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';

// App Component
export default function HYDR801App() {
  const [appMode, setAppMode] = useState('patient'); // 'patient' or 'provider'
  const [currentScreen, setCurrentScreen] = useState('home');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [user, setUser] = useState({
    id: 'patient_001',
    name: 'Sarah',
    email: 'sarah@email.com',
    fitnessAssessmentComplete: false,
    fitnessLevel: null,
    workoutPlan: null,
    equipment: [],
    // Meal planning
    mealPlanComplete: false,
    mealPlan: null,
    dietaryPreferences: null,
    // Progress & Engagement
    week: 1,
    startDate: '2024-12-01',
    currentStreak: 12,
    longestStreak: 14,
    totalPoints: 2450,
    level: 'Silver',
    badges: ['first_workout', 'protein_champion', 'hydration_hero', '7_day_streak'],
    weightLog: [
      { date: '2024-12-01', weight: 185 },
      { date: '2024-12-08', weight: 183.5 },
      { date: '2024-12-15', weight: 181.2 },
      { date: '2024-12-22', weight: 179.8 },
    ],
    // Daily goals
    waterGoal: 80,
    waterCurrent: 48,
    proteinGoal: 120,
    proteinCurrent: 65,
    fiberGoal: 25,
    fiberCurrent: 12,
    exerciseGoal: 30,
    exerciseCurrent: 20,
    // Weekly history
    weeklyHistory: [
      { week: 1, protein: 85, water: 90, exercise: 70, meals: 95 },
      { week: 2, protein: 92, water: 88, exercise: 80, meals: 90 },
      { week: 3, protein: 78, water: 95, exercise: 65, meals: 88 },
    ],
    // Provider notes
    providerNotes: [],
    nextAppointment: '2025-01-25',
    medicationDose: '0.5mg',
    medicationSchedule: 'Weekly - Sundays',
    injectionDay: 0, // 0 = Sunday, 1 = Monday, etc.
    // Injection tracking
    injectionLog: [
      { id: 1, type: 'glp1', date: '2024-12-01', dose: '0.25mg', notes: 'First injection, no issues', completed: true },
      { id: 2, type: 'lipoc', date: '2024-12-04', dose: 'standard', notes: '', completed: true },
      { id: 3, type: 'glp1', date: '2024-12-08', dose: '0.25mg', notes: 'Mild nausea', completed: true },
      { id: 4, type: 'lipoc', date: '2024-12-11', dose: 'standard', notes: '', completed: true },
      { id: 5, type: 'glp1', date: '2024-12-15', dose: '0.5mg', notes: 'Dose increase, tolerated well', completed: true },
      { id: 6, type: 'lipoc', date: '2024-12-18', dose: 'standard', notes: '', completed: true },
      { id: 7, type: 'glp1', date: '2024-12-22', dose: '0.5mg', notes: '', completed: true },
      { id: 8, type: 'glp1', date: '2024-12-29', dose: '0.5mg', notes: '', completed: false },
    ],
    // Scheduled injections (upcoming)
    scheduledInjections: [
      { id: 's1', type: 'glp1', date: '2025-01-05', dose: '0.5mg', completed: false },
      { id: 's2', type: 'lipoc', date: '2025-01-08', dose: 'standard', completed: false },
    ],
    glp1Supply: { currentDose: '0.5mg', refillDate: '2025-01-15', weeksRemaining: 3 },
    lipocSupply: { refillDate: '2025-01-20', injectionsRemaining: 8 },
    // Achievements
    achievements: {
      glp1Injections: 4,
      lipocInjections: 3,
      ivTherapySessions: 2,
      totalWeightLost: 5.2,
      longestStreak: 14,
      proteinGoalsMet: 18,
      hydrationGoalsMet: 21,
      workoutsCompleted: 8,
      referralsMade: 3,
      monthsOnProgram: 1,
    },
    earnedBadges: ['first_glp1', 'first_lipoc', 'first_iv', '5lb_lost', '7_day_streak', '14_day_streak', 'protein_week', 'hydration_week', 'first_referral'],
    // Loyalty Program
    referralCode: 'SARAH2024',
    loyaltyTier: 'Silver',
    totalSpent: 1850,
    lifetimeSpent: 2450,
    referralCount: 3,
    referralCredits: 60,
    loyaltyPoints: 2450,
    referralHistory: [
      { id: 1, name: 'Jessica M.', date: '2024-12-10', status: 'completed', credit: 20 },
      { id: 2, name: 'Amanda K.', date: '2024-12-18', status: 'completed', credit: 20 },
      { id: 3, name: 'Taylor R.', date: '2025-01-05', status: 'pending', credit: 20 },
    ],
    spendingHistory: [
      { id: 1, date: '2024-12-01', description: 'GLP-1 Initial Consult + Month 1', amount: 300 },
      { id: 2, date: '2024-12-15', description: 'Physique Boost IV', amount: 199 },
      { id: 3, date: '2025-01-01', description: 'GLP-1 Month 2 (0.5mg)', amount: 200 },
      { id: 4, date: '2025-01-10', description: 'Lipo-C Injections', amount: 20 },
      { id: 5, date: '2025-01-15', description: 'B12 Injection', amount: 15 },
    ],
  });
  const [activeModal, setActiveModal] = useState(null);

  // Mock patients for provider view
  const [patients] = useState([
    { ...user },
    {
      id: 'patient_002',
      name: 'Michael R.',
      email: 'michael@email.com',
      week: 6,
      currentStreak: 8,
      weightLog: [
        { date: '2024-11-15', weight: 220 },
        { date: '2024-11-22', weight: 217 },
        { date: '2024-11-29', weight: 214.5 },
        { date: '2024-12-06', weight: 212 },
        { date: '2024-12-13', weight: 210.2 },
        { date: '2024-12-20', weight: 208.5 },
      ],
      proteinCurrent: 85,
      proteinGoal: 120,
      waterCurrent: 56,
      waterGoal: 80,
      exerciseCurrent: 45,
      exerciseGoal: 45,
      fitnessLevel: 'intermediate',
      weeklyHistory: [
        { week: 4, protein: 90, water: 85, exercise: 95, meals: 88 },
        { week: 5, protein: 88, water: 82, exercise: 100, meals: 92 },
        { week: 6, protein: 71, water: 70, exercise: 100, meals: 75 },
      ],
      alerts: ['Low protein intake this week', 'Missed 2 meal logs'],
      nextAppointment: '2025-01-20',
      medicationDose: '1.0mg',
      injectionLog: [
        { id: 1, type: 'glp1', date: '2024-11-17', dose: '0.5mg', notes: '' },
        { id: 2, type: 'glp1', date: '2024-11-24', dose: '0.5mg', notes: '' },
        { id: 3, type: 'glp1', date: '2024-12-01', dose: '1.0mg', notes: 'Dose increase' },
        { id: 4, type: 'lipoc', date: '2024-12-03', dose: 'standard', notes: '' },
        { id: 5, type: 'glp1', date: '2024-12-08', dose: '1.0mg', notes: '' },
        { id: 6, type: 'lipoc', date: '2024-12-10', dose: 'standard', notes: '' },
        { id: 7, type: 'glp1', date: '2024-12-15', dose: '1.0mg', notes: '' },
      ],
      glp1Supply: { currentDose: '1.0mg', refillDate: '2025-01-10', weeksRemaining: 2 },
      lipocSupply: { refillDate: '2025-01-08', injectionsRemaining: 4 },
    },
    {
      id: 'patient_003',
      name: 'Jennifer L.',
      email: 'jennifer@email.com',
      week: 2,
      currentStreak: 14,
      weightLog: [
        { date: '2024-12-15', weight: 165 },
        { date: '2024-12-22', weight: 163.2 },
      ],
      proteinCurrent: 92,
      proteinGoal: 90,
      waterCurrent: 64,
      waterGoal: 64,
      exerciseCurrent: 25,
      exerciseGoal: 30,
      fitnessLevel: 'beginner',
      weeklyHistory: [
        { week: 1, protein: 98, water: 100, exercise: 90, meals: 100 },
        { week: 2, protein: 102, water: 100, exercise: 83, meals: 95 },
      ],
      alerts: [],
      nextAppointment: '2025-01-28',
      medicationDose: '0.25mg',
      injectionLog: [
        { id: 1, type: 'glp1', date: '2024-12-15', dose: '0.25mg', notes: 'First injection' },
        { id: 2, type: 'glp1', date: '2024-12-22', dose: '0.25mg', notes: '' },
      ],
      glp1Supply: { currentDose: '0.25mg', refillDate: '2025-02-01', weeksRemaining: 6 },
      lipocSupply: null,
    },
  ]);

  // Onboarding flow
  if (showOnboarding && appMode === 'patient') {
    return (
      <div style={styles.appContainer}>
        <style>{globalStyles}</style>
        <div style={styles.phoneFrame}>
          <OnboardingFlow onComplete={() => setShowOnboarding(false)} />
        </div>
      </div>
    );
  }

  const patientScreens = {
    home: <HomeScreen user={user} setUser={setUser} setActiveModal={setActiveModal} />,
    nutrition: <NutritionScreen user={user} setUser={setUser} />,
    fitness: <FitnessScreen user={user} setUser={setUser} />,
    education: <EducationScreen user={user} />,
    profile: <ProfileScreen user={user} setUser={setUser} />,
  };

  const providerScreens = {
    dashboard: <ProviderDashboard patients={patients} setCurrentScreen={setCurrentScreen} />,
    patients: <PatientListScreen patients={patients} setCurrentScreen={setCurrentScreen} />,
    payments: <PaymentsScreen />,
    messages: <MessagesScreen patients={patients} />,
    analytics: <AnalyticsScreen patients={patients} />,
    settings: <ProviderSettingsScreen />,
  };

  return (
    <div style={styles.appContainer}>
      <style>{globalStyles}</style>
      
      {/* Mode Toggle (for demo purposes) */}
      <div style={styles.modeToggle}>
        <button 
          style={{...styles.modeBtn, ...(appMode === 'patient' ? styles.modeBtnActive : {})}}
          onClick={() => { setAppMode('patient'); setCurrentScreen('home'); }}
        >
          👤 Patient View
        </button>
        <button 
          style={{...styles.modeBtn, ...(appMode === 'provider' ? styles.modeBtnActive : {})}}
          onClick={() => { setAppMode('provider'); setCurrentScreen('dashboard'); }}
        >
          🩺 Provider View
        </button>
      </div>
      
      <div style={styles.phoneFrame}>
        <div style={styles.screen}>
          {appMode === 'patient' ? patientScreens[currentScreen] : providerScreens[currentScreen]}
        </div>
        {appMode === 'patient' ? (
          <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
        ) : (
          <ProviderBottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
        )}
      </div>
      
      {activeModal && (
        <Modal activeModal={activeModal} setActiveModal={setActiveModal} />
      )}
    </div>
  );
}

// Global Styles
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&display=swap');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: 'DM Sans', sans-serif;
    background: #FAF9F7;
  }
  
  .progress-ring {
    transition: stroke-dashoffset 0.5s ease;
  }
  
  .card-hover {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .card-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.08);
  }
  
  .fade-in {
    animation: fadeIn 0.4s ease forwards;
  }
  
  .slide-up {
    animation: slideUp 0.5s ease forwards;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.8; }
  }
  
  @keyframes scanning {
    0% { top: 0; }
    50% { top: calc(100% - 4px); }
    100% { top: 0; }
  }
  
  @keyframes breathe {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  
  @keyframes confetti {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(-100px) rotate(720deg); opacity: 0; }
  }
  
  .pulse {
    animation: pulse 2s ease-in-out infinite;
  }
  
  .scanning-line {
    animation: scanning 2s ease-in-out infinite;
  }
  
  .breathe {
    animation: breathe 4s ease-in-out infinite;
  }
  
  .nav-item {
    transition: all 0.2s ease;
  }
  
  .nav-item:hover {
    transform: scale(1.05);
  }
  
  .btn-primary {
    background: linear-gradient(135deg, #4A6741 0%, #5B7B50 100%);
    transition: all 0.3s ease;
  }
  
  .btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(74, 103, 65, 0.3);
  }
  
  .progress-bar-fill {
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  ::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }
  
  video {
    transform: scaleX(-1);
  }
`;

// ==================== ONBOARDING FLOW ====================
function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: '',
      title: 'Welcome to HYDR801',
      subtitle: 'Your personalized GLP-1 wellness companion',
      description: 'We\'ll help you maximize your weight loss journey with AI-powered nutrition, fitness plans, and progress tracking.',
      image: (
        <img 
          src="/logo.png" 
          alt="HYDR801 Infusion & Wellness" 
          style={{ width: '180px', height: '180px', objectFit: 'contain' }}
        />
      )
    },
    {
      icon: '🍽️',
      title: 'Personalized Nutrition',
      subtitle: 'AI-powered meal plans for GLP-1 success',
      description: 'Get high-protein meal plans optimized for your medication, dietary preferences, and lifestyle.',
      image: (
        <svg width="200" height="160" viewBox="0 0 200 160" fill="none">
          <circle cx="100" cy="80" r="50" fill="#E8EDE6"/>
          <circle cx="70" cy="70" r="15" fill="#4A6741"/>
          <circle cx="130" cy="70" r="15" fill="#C4956A"/>
          <circle cx="100" cy="100" r="18" fill="#2AABB3"/>
          <text x="70" y="75" textAnchor="middle" fill="white" fontSize="14">🥩</text>
          <text x="130" y="75" textAnchor="middle" fill="white" fontSize="14">🥬</text>
          <text x="100" y="105" textAnchor="middle" fill="white" fontSize="16">💧</text>
        </svg>
      )
    },
    {
      icon: '💪',
      title: 'Smart Fitness Assessment',
      subtitle: 'Camera-powered exercise analysis',
      description: 'Our AI analyzes your movements to create workouts perfect for your fitness level and available equipment.',
      image: (
        <svg width="200" height="160" viewBox="0 0 200 160" fill="none">
          <rect x="60" y="30" width="80" height="100" rx="10" fill="#2D2D2D"/>
          <rect x="65" y="35" width="70" height="85" rx="5" fill="#3D3D4D"/>
          <circle cx="100" cy="75" r="25" stroke="#4A6741" strokeWidth="2" strokeDasharray="5 3"/>
          <circle cx="100" cy="65" r="8" fill="#4A6741"/>
          <path d="M90 85L100 75L110 85" stroke="#4A6741" strokeWidth="2"/>
          <path d="M85 95L100 105L115 95" stroke="#4A6741" strokeWidth="2"/>
        </svg>
      )
    },
    {
      icon: '📊',
      title: 'Track Your Progress',
      subtitle: 'See how far you\'ve come',
      description: 'Log meals, workouts, and weight. Earn badges, maintain streaks, and watch your transformation unfold.',
      image: (
        <svg width="200" height="160" viewBox="0 0 200 160" fill="none">
          <rect x="50" y="100" width="20" height="40" fill="#E8EDE6" rx="4"/>
          <rect x="80" y="80" width="20" height="60" fill="#C4956A" rx="4"/>
          <rect x="110" y="60" width="20" height="80" fill="#2AABB3" rx="4"/>
          <rect x="140" y="40" width="20" height="100" fill="#4A6741" rx="4"/>
          <path d="M50 90L80 70L110 50L150 30" stroke="#4A6741" strokeWidth="2" strokeDasharray="4 2"/>
          <circle cx="150" cy="30" r="6" fill="#4A6741"/>
        </svg>
      )
    },
    {
      icon: '🤝',
      title: 'Connected Care',
      subtitle: 'Your provider sees your progress',
      description: 'Your healthcare team can monitor your journey and provide personalized guidance along the way.',
      image: (
        <svg width="200" height="160" viewBox="0 0 200 160" fill="none">
          <circle cx="70" cy="70" r="30" fill="#E8EDE6"/>
          <circle cx="130" cy="70" r="30" fill="#E8EDE6"/>
          <circle cx="70" cy="60" r="12" fill="#4A6741"/>
          <path d="M58 85C58 78 63 75 70 75C77 75 82 78 82 85" stroke="#4A6741" strokeWidth="2"/>
          <circle cx="130" cy="60" r="12" fill="#2AABB3"/>
          <path d="M118 85C118 78 123 75 130 75C137 75 142 78 142 85" stroke="#2AABB3" strokeWidth="2"/>
          <path d="M95 70H105" stroke="#4A6741" strokeWidth="2" strokeLinecap="round"/>
          <path d="M100 65V75" stroke="#4A6741" strokeWidth="2" strokeLinecap="round"/>
          <text x="70" y="120" textAnchor="middle" fill="#6B6B6B" fontSize="10">You</text>
          <text x="130" y="120" textAnchor="middle" fill="#6B6B6B" fontSize="10">Provider</text>
        </svg>
      )
    }
  ];

  const currentStep = steps[step];

  return (
    <div style={styles.onboardingContainer} className="fade-in">
      {/* Progress dots */}
      <div style={styles.onboardingProgress}>
        {steps.map((_, idx) => (
          <div 
            key={idx} 
            style={{
              ...styles.onboardingDot,
              ...(idx <= step ? styles.onboardingDotActive : {})
            }} 
          />
        ))}
      </div>

      {/* Skip button */}
      {step < steps.length - 1 && (
        <button style={styles.skipButton} onClick={onComplete}>Skip</button>
      )}

      {/* Content */}
      <div style={styles.onboardingContent}>
        <div style={styles.onboardingImage}>
          {currentStep.image}
        </div>
        
        <span style={styles.onboardingIcon}>{currentStep.icon}</span>
        <h1 style={styles.onboardingTitle}>{currentStep.title}</h1>
        <p style={styles.onboardingSubtitle}>{currentStep.subtitle}</p>
        <p style={styles.onboardingDesc}>{currentStep.description}</p>
      </div>

      {/* Navigation */}
      <div style={styles.onboardingNav}>
        {step === steps.length - 1 ? (
          <button style={styles.primaryButton} className="btn-primary" onClick={onComplete}>
            Get Started
          </button>
        ) : (
          <button style={styles.primaryButton} className="btn-primary" onClick={() => setStep(step + 1)}>
            Continue
          </button>
        )}
      </div>
    </div>
  );
}

// ==================== PROVIDER DASHBOARD ====================
function ProviderDashboard({ patients, setCurrentScreen }) {
  const alerts = patients.flatMap(p => (p.alerts || []).map(a => ({ patient: p.name, alert: a })));
  const todayAppointments = patients.filter(p => p.nextAppointment === '2025-01-20');

  const avgCompliance = Math.round(
    patients.reduce((sum, p) => {
      const lastWeek = p.weeklyHistory?.[p.weeklyHistory.length - 1];
      if (lastWeek) {
        return sum + (lastWeek.protein + lastWeek.water + lastWeek.exercise + lastWeek.meals) / 4;
      }
      return sum;
    }, 0) / patients.length
  );

  return (
    <div style={styles.screenContent} className="fade-in">
      <header style={styles.providerHeader}>
        <div>
          <p style={styles.greeting}>Good morning,</p>
          <h1 style={styles.providerName}>Dr. Williams</h1>
        </div>
        <div style={styles.providerAvatar}>👩‍⚕️</div>
      </header>

      {/* Quick Stats */}
      <div style={styles.providerStatsRow}>
        <div style={styles.providerStat}>
          <span style={styles.providerStatValue}>{patients.length}</span>
          <span style={styles.providerStatLabel}>Active Patients</span>
        </div>
        <div style={styles.providerStat}>
          <span style={styles.providerStatValue}>{avgCompliance}%</span>
          <span style={styles.providerStatLabel}>Avg Compliance</span>
        </div>
        <div style={styles.providerStat}>
          <span style={styles.providerStatValue}>{alerts.length}</span>
          <span style={styles.providerStatLabel}>Alerts</span>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>âš ️ Patient Alerts</h3>
          <div style={styles.alertsList}>
            {alerts.map((alert, idx) => (
              <div key={idx} style={styles.alertCard}>
                <div style={styles.alertIcon}>!</div>
                <div style={styles.alertContent}>
                  <p style={styles.alertPatient}>{alert.patient}</p>
                  <p style={styles.alertText}>{alert.alert}</p>
                </div>
                <button style={styles.alertAction}>View</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Today's Schedule */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>📅 Today's Appointments</h3>
        {todayAppointments.length > 0 ? (
          <div style={styles.appointmentsList}>
            {todayAppointments.map((patient, idx) => (
              <div key={idx} style={styles.appointmentCard}>
                <div style={styles.appointmentTime}>10:00 AM</div>
                <div style={styles.appointmentInfo}>
                  <p style={styles.appointmentName}>{patient.name}</p>
                  <p style={styles.appointmentType}>Week {patient.week} Check-in</p>
                </div>
                <button style={styles.appointmentBtn}>Prep</button>
              </div>
            ))}
          </div>
        ) : (
          <p style={styles.noAppointments}>No appointments scheduled for today</p>
        )}
      </section>

      {/* Patient Overview */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>👥 Recent Patient Activity</h3>
          <button style={styles.viewAllBtn} onClick={() => setCurrentScreen('patients')}>View All</button>
        </div>
        <div style={styles.patientMiniList}>
          {patients.slice(0, 3).map((patient, idx) => (
            <PatientMiniCard key={idx} patient={patient} />
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Quick Actions</h3>
        <div style={styles.quickActionsGrid}>
          <div style={styles.quickActionCard}>
            <span style={styles.qaIcon}>📨</span>
            <span style={styles.qaLabel}>Send Reminder</span>
          </div>
          <div style={styles.quickActionCard}>
            <span style={styles.qaIcon}>📊</span>
            <span style={styles.qaLabel}>View Reports</span>
          </div>
          <div style={styles.quickActionCard}>
            <span style={styles.qaIcon}>💊</span>
            <span style={styles.qaLabel}>Adjust Dose</span>
          </div>
          <div style={styles.quickActionCard}>
            <span style={styles.qaIcon}>📝</span>
            <span style={styles.qaLabel}>Add Note</span>
          </div>
        </div>
      </section>
    </div>
  );
}

// Patient Mini Card for Dashboard
function PatientMiniCard({ patient }) {
  const lastWeek = patient.weeklyHistory?.[patient.weeklyHistory.length - 1];
  const compliance = lastWeek 
    ? Math.round((lastWeek.protein + lastWeek.water + lastWeek.exercise + lastWeek.meals) / 4)
    : 0;
  
  const weightLoss = patient.weightLog?.length >= 2
    ? (patient.weightLog[0].weight - patient.weightLog[patient.weightLog.length - 1].weight).toFixed(1)
    : 0;

  return (
    <div style={styles.patientMiniCard} className="card-hover">
      <div style={styles.pmcHeader}>
        <div style={styles.pmcAvatar}>{patient.name[0]}</div>
        <div style={styles.pmcInfo}>
          <p style={styles.pmcName}>{patient.name}</p>
          <p style={styles.pmcWeek}>Week {patient.week}</p>
        </div>
        {patient.alerts?.length > 0 && (
          <div style={styles.pmcAlertBadge}>{patient.alerts.length}</div>
        )}
      </div>
      <div style={styles.pmcStats}>
        <div style={styles.pmcStatItem}>
          <span style={styles.pmcStatValue}>{weightLoss} lbs</span>
          <span style={styles.pmcStatLabel}>Lost</span>
        </div>
        <div style={styles.pmcStatItem}>
          <span style={{...styles.pmcStatValue, color: compliance >= 80 ? '#4A6741' : '#C4956A'}}>{compliance}%</span>
          <span style={styles.pmcStatLabel}>Compliance</span>
        </div>
        <div style={styles.pmcStatItem}>
          <span style={styles.pmcStatValue}>{patient.currentStreak}</span>
          <span style={styles.pmcStatLabel}>Streak</span>
        </div>
      </div>
    </div>
  );
}

// Patient List Screen
function PatientListScreen({ patients, setCurrentScreen }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedPatient) {
    return (
      <PatientDetailScreen 
        patient={selectedPatient} 
        onBack={() => setSelectedPatient(null)} 
      />
    );
  }

  return (
    <div style={styles.screenContent} className="fade-in">
      <header style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Patients</h1>
        <p style={styles.pageSubtitle}>{patients.length} active patients</p>
      </header>

      <div style={styles.searchBar}>
        <span style={styles.searchIcon}>🔍</span>
        <input 
          type="text"
          placeholder="Search patients..."
          style={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={styles.patientList}>
        {filteredPatients.map((patient, idx) => {
          const lastWeek = patient.weeklyHistory?.[patient.weeklyHistory.length - 1];
          const compliance = lastWeek 
            ? Math.round((lastWeek.protein + lastWeek.water + lastWeek.exercise + lastWeek.meals) / 4)
            : 0;

          return (
            <div 
              key={idx} 
              style={styles.patientListCard} 
              className="card-hover"
              onClick={() => setSelectedPatient(patient)}
            >
              <div style={styles.plcAvatar}>{patient.name[0]}</div>
              <div style={styles.plcInfo}>
                <p style={styles.plcName}>{patient.name}</p>
                <p style={styles.plcMeta}>Week {patient.week} · {patient.medicationDose}</p>
              </div>
              <div style={styles.plcRight}>
                <div style={{
                  ...styles.plcCompliance,
                  background: compliance >= 80 ? '#E8EDE6' : '#FFF5F0',
                  color: compliance >= 80 ? '#4A6741' : '#C4956A'
                }}>
                  {compliance}%
                </div>
                {patient.alerts?.length > 0 && (
                  <span style={styles.plcAlert}>âš ️</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Patient Detail Screen
function PatientDetailScreen({ patient, onBack }) {
  const [activeTab, setActiveTab] = useState('overview');
  
  const weightLoss = patient.weightLog?.length >= 2
    ? (patient.weightLog[0].weight - patient.weightLog[patient.weightLog.length - 1].weight).toFixed(1)
    : 0;

  return (
    <div style={styles.screenContent} className="fade-in">
      <div style={styles.patientDetailHeader}>
        <button style={styles.backButton} onClick={onBack}>← Back</button>
      </div>

      <div style={styles.patientProfile}>
        <div style={styles.pdAvatar}>{patient.name[0]}</div>
        <h2 style={styles.pdName}>{patient.name}</h2>
        <p style={styles.pdMeta}>Week {patient.week} · {patient.medicationDose} weekly</p>
        
        {patient.alerts?.length > 0 && (
          <div style={styles.pdAlerts}>
            {patient.alerts.map((alert, idx) => (
              <div key={idx} style={styles.pdAlertItem}>âš ️ {alert}</div>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={styles.pdTabs}>
        {['overview', 'injections', 'payments', 'nutrition', 'fitness', 'weight'].map(tab => (
          <button
            key={tab}
            style={{...styles.pdTab, ...(activeTab === tab ? styles.pdTabActive : {})}}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="fade-in">
          {/* Key Metrics */}
          <div style={styles.pdMetricsGrid}>
            <div style={styles.pdMetricCard}>
              <span style={styles.pdMetricValue}>{weightLoss} lbs</span>
              <span style={styles.pdMetricLabel}>Total Lost</span>
            </div>
            <div style={styles.pdMetricCard}>
              <span style={styles.pdMetricValue}>{patient.currentStreak}</span>
              <span style={styles.pdMetricLabel}>Day Streak</span>
            </div>
            <div style={styles.pdMetricCard}>
              <span style={styles.pdMetricValue}>{Math.round((patient.proteinCurrent / patient.proteinGoal) * 100)}%</span>
              <span style={styles.pdMetricLabel}>Protein Today</span>
            </div>
            <div style={styles.pdMetricCard}>
              <span style={styles.pdMetricValue}>{Math.round((patient.exerciseCurrent / patient.exerciseGoal) * 100)}%</span>
              <span style={styles.pdMetricLabel}>Exercise Today</span>
            </div>
          </div>

          {/* Weekly Compliance Chart */}
          <div style={styles.pdChartCard}>
            <h4 style={styles.pdChartTitle}>Weekly Compliance Trend</h4>
            <div style={styles.pdChart}>
              {patient.weeklyHistory?.map((week, idx) => {
                const avg = Math.round((week.protein + week.water + week.exercise + week.meals) / 4);
                return (
                  <div key={idx} style={styles.pdChartBar}>
                    <div style={{
                      ...styles.pdChartBarFill,
                      height: `${avg}%`,
                      background: avg >= 80 ? '#4A6741' : avg >= 60 ? '#C4956A' : '#E57373'
                    }} />
                    <span style={styles.pdChartLabel}>W{week.week}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={styles.pdActions}>
            <button style={styles.pdActionBtn}>📨 Send Message</button>
            <button style={styles.pdActionBtn}>📝 Add Note</button>
            <button style={styles.pdActionBtn}>💊 Adjust Dose</button>
          </div>
        </div>
      )}

      {activeTab === 'injections' && (
        <div className="fade-in">
          {/* Injection Summary */}
          <div style={styles.providerInjectionSummary}>
            <div style={styles.providerInjectionCard}>
              <div style={styles.providerInjectionHeader}>
                <span style={styles.providerInjectionIcon}>💉</span>
                <span style={styles.providerInjectionLabel}>GLP-1</span>
              </div>
              <p style={styles.providerInjectionDose}>{patient.glp1Supply?.currentDose || patient.medicationDose}</p>
              <p style={styles.providerInjectionMeta}>
                {patient.injectionLog?.filter(i => i.type === 'glp1').length || 0} injections logged
              </p>
              {patient.glp1Supply?.weeksRemaining && (
                <p style={{
                  ...styles.providerSupplyStatus,
                  color: patient.glp1Supply.weeksRemaining <= 2 ? '#E57373' : '#4A6741'
                }}>
                  {patient.glp1Supply.weeksRemaining <= 2 ? '⚠️ ' : '✓ '}
                  {patient.glp1Supply.weeksRemaining} weeks supply
                </p>
              )}
            </div>
            <div style={styles.providerInjectionCard}>
              <div style={styles.providerInjectionHeader}>
                <span style={styles.providerInjectionIcon}>🧪</span>
                <span style={styles.providerInjectionLabel}>Lipo-C</span>
              </div>
              <p style={styles.providerInjectionDose}>Standard</p>
              <p style={styles.providerInjectionMeta}>
                {patient.injectionLog?.filter(i => i.type === 'lipoc').length || 0} injections logged
              </p>
              {patient.lipocSupply?.injectionsRemaining && (
                <p style={{
                  ...styles.providerSupplyStatus,
                  color: patient.lipocSupply.injectionsRemaining <= 4 ? '#E57373' : '#4A6741'
                }}>
                  {patient.lipocSupply.injectionsRemaining <= 4 ? '⚠️ ' : '✓ '}
                  {patient.lipocSupply.injectionsRemaining} left
                </p>
              )}
            </div>
          </div>

          {/* Injection History */}
          <div style={styles.providerInjectionHistory}>
            <h4 style={styles.providerInjectionHistoryTitle}>Recent Injection History</h4>
            {patient.injectionLog && patient.injectionLog.length > 0 ? (
              [...patient.injectionLog]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 10)
                .map((injection, idx) => (
                  <div key={idx} style={styles.providerInjectionItem}>
                    <div style={{
                      ...styles.providerInjectionDot,
                      background: injection.type === 'glp1' ? '#4A6741' : '#2AABB3'
                    }} />
                    <div style={styles.providerInjectionItemContent}>
                      <div style={styles.providerInjectionItemHeader}>
                        <span style={styles.providerInjectionItemType}>
                          {injection.type === 'glp1' ? 'GLP-1' : 'Lipo-C'}
                        </span>
                        <span style={styles.providerInjectionItemDose}>{injection.dose}</span>
                      </div>
                      <span style={styles.providerInjectionItemDate}>
                        {new Date(injection.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      {injection.notes && (
                        <p style={styles.providerInjectionItemNotes}>"{injection.notes}"</p>
                      )}
                    </div>
                  </div>
                ))
            ) : (
              <p style={styles.noInjectionData}>No injection data logged by patient</p>
            )}
          </div>

          {/* Reorder Actions */}
          <div style={styles.providerReorderSection}>
            <h4 style={styles.providerReorderTitle}>Supply Management</h4>
            <div style={styles.providerReorderActions}>
              <button style={styles.providerReorderBtn}>
                📦 Process GLP-1 Refill
              </button>
              <button style={styles.providerReorderBtn}>
                🧪 Process Lipo-C Refill
              </button>
              <button style={styles.providerAdjustDoseBtn}>
                📈 Adjust Dose
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <PatientPaymentHistory patientId={patient.id} />
      )}

      {activeTab === 'weight' && (
        <div className="fade-in">
          <div style={styles.pdWeightChart}>
            <h4 style={styles.pdChartTitle}>Weight Progress</h4>
            <div style={styles.weightChartContainer}>
              {patient.weightLog?.map((entry, idx) => {
                const maxWeight = Math.max(...patient.weightLog.map(e => e.weight));
                const minWeight = Math.min(...patient.weightLog.map(e => e.weight));
                const range = maxWeight - minWeight || 1;
                const height = ((entry.weight - minWeight) / range) * 80 + 20;
                
                return (
                  <div key={idx} style={styles.weightPoint}>
                    <div style={{...styles.weightBar, height: `${100 - height}%`}} />
                    <div style={styles.weightValue}>{entry.weight}</div>
                    <div style={styles.weightDate}>{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'nutrition' && (
        <div className="fade-in">
          <div style={styles.pdNutritionStats}>
            <div style={styles.nutritionStatCard}>
              <div style={styles.nutritionStatHeader}>
                <span>Protein</span>
                <span style={styles.nutritionPercent}>{Math.round((patient.proteinCurrent / patient.proteinGoal) * 100)}%</span>
              </div>
              <div style={styles.nutritionBar}>
                <div style={{...styles.nutritionBarFill, width: `${(patient.proteinCurrent / patient.proteinGoal) * 100}%`, background: '#4A6741'}} />
              </div>
              <p style={styles.nutritionMeta}>{patient.proteinCurrent}g / {patient.proteinGoal}g today</p>
            </div>
            
            <div style={styles.nutritionStatCard}>
              <div style={styles.nutritionStatHeader}>
                <span>Hydration</span>
                <span style={styles.nutritionPercent}>{Math.round((patient.waterCurrent / patient.waterGoal) * 100)}%</span>
              </div>
              <div style={styles.nutritionBar}>
                <div style={{...styles.nutritionBarFill, width: `${(patient.waterCurrent / patient.waterGoal) * 100}%`, background: '#2AABB3'}} />
              </div>
              <p style={styles.nutritionMeta}>{patient.waterCurrent}oz / {patient.waterGoal}oz today</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'fitness' && (
        <div className="fade-in">
          <div style={styles.pdFitnessInfo}>
            <div style={styles.fitnessInfoCard}>
              <span style={styles.fitnessInfoLabel}>Fitness Level</span>
              <span style={styles.fitnessInfoValue}>{patient.fitnessLevel || 'Not assessed'}</span>
            </div>
            <div style={styles.fitnessInfoCard}>
              <span style={styles.fitnessInfoLabel}>Exercise Today</span>
              <span style={styles.fitnessInfoValue}>{patient.exerciseCurrent} / {patient.exerciseGoal} min</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Patient Payment History Component
function PatientPaymentHistory({ patientId }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadPatientPayments();
  }, [patientId]);

  const loadPatientPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/payments?patient_id=${patientId}&limit=50`);
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
        
        // Calculate total paid
        const totalPaid = (data.payments || [])
          .filter(p => p.status === 'Paid')
          .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
        setTotal(totalPaid);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error loading patient payments:', err);
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    const num = parseFloat(val) || 0;
    return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getStatusStyle = (status) => {
    const baseStyle = {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '600',
    };
    
    switch(status) {
      case 'Paid':
        return { ...baseStyle, background: '#d4edda', color: '#155724' };
      case 'Sent':
        return { ...baseStyle, background: '#fff3cd', color: '#856404' };
      case 'Canceled':
        return { ...baseStyle, background: '#f8d7da', color: '#721c24' };
      case 'Refunded':
        return { ...baseStyle, background: '#ffe5cc', color: '#8B4000' };
      default:
        return { ...baseStyle, background: '#e2e3e5', color: '#383d41' };
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
        Loading payment history...
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        background: 'white',
        borderRadius: '12px',
        marginTop: '16px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>💳</div>
        <p style={{ color: '#666', fontSize: '14px' }}>No payment history</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Summary Card */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Total Paid</div>
        <div style={{ fontSize: '32px', fontWeight: '700', color: '#4A6741' }}>
          {formatCurrency(total)}
        </div>
        <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
          {payments.filter(p => p.status === 'Paid').length} transactions
        </div>
      </div>

      {/* Payment List */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <div style={{
          padding: '16px',
          borderBottom: '1px solid #f0f0f0',
          fontSize: '14px',
          fontWeight: '600',
          color: '#333'
        }}>
          Payment History
        </div>
        
        {payments.map((payment, idx) => (
          <div
            key={payment.id || idx}
            style={{
              padding: '16px',
              borderBottom: idx < payments.length - 1 ? '1px solid #f0f0f0' : 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '4px'
              }}>
                {payment.description || 'Payment'}
              </div>
              <div style={{ fontSize: '11px', color: '#999' }}>
                {payment.date}
              </div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: '15px',
                fontWeight: '700',
                color: payment.status === 'Paid' ? '#4A6741' : '#666',
                marginBottom: '4px'
              }}>
                {formatCurrency(payment.amount)}
              </div>
              <span style={getStatusStyle(payment.status)}>{payment.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Messages Screen
function MessagesScreen({ patients }) {
  const conversations = patients.map(p => ({
    patient: p,
    lastMessage: 'Thanks for the meal plan update!',
    time: '2h ago',
    unread: Math.random() > 0.7
  }));

  return (
    <div style={styles.screenContent} className="fade-in">
      <header style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Messages</h1>
        <p style={styles.pageSubtitle}>Patient communications</p>
      </header>

      <div style={styles.messagesList}>
        {conversations.map((conv, idx) => (
          <div key={idx} style={styles.messageCard} className="card-hover">
            <div style={styles.msgAvatar}>{conv.patient.name[0]}</div>
            <div style={styles.msgContent}>
              <div style={styles.msgHeader}>
                <span style={styles.msgName}>{conv.patient.name}</span>
                <span style={styles.msgTime}>{conv.time}</span>
              </div>
              <p style={styles.msgPreview}>{conv.lastMessage}</p>
            </div>
            {conv.unread && <div style={styles.msgUnread} />}
          </div>
        ))}
      </div>
    </div>
  );
}

// Analytics Screen
function AnalyticsScreen({ patients }) {
  const totalWeightLoss = patients.reduce((sum, p) => {
    if (p.weightLog?.length >= 2) {
      return sum + (p.weightLog[0].weight - p.weightLog[p.weightLog.length - 1].weight);
    }
    return sum;
  }, 0);

  const avgStreak = Math.round(patients.reduce((sum, p) => sum + (p.currentStreak || 0), 0) / patients.length);

  return (
    <div style={styles.screenContent} className="fade-in">
      <header style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Analytics</h1>
        <p style={styles.pageSubtitle}>Practice overview</p>
      </header>

      <div style={styles.analyticsGrid}>
        <div style={styles.analyticsCard}>
          <span style={styles.analyticsValue}>{totalWeightLoss.toFixed(1)}</span>
          <span style={styles.analyticsLabel}>Total lbs Lost</span>
          <span style={styles.analyticsSubtext}>All patients combined</span>
        </div>
        <div style={styles.analyticsCard}>
          <span style={styles.analyticsValue}>{avgStreak}</span>
          <span style={styles.analyticsLabel}>Avg Day Streak</span>
          <span style={styles.analyticsSubtext}>Patient engagement</span>
        </div>
        <div style={styles.analyticsCard}>
          <span style={styles.analyticsValue}>87%</span>
          <span style={styles.analyticsLabel}>Retention Rate</span>
          <span style={styles.analyticsSubtext}>Past 90 days</span>
        </div>
        <div style={styles.analyticsCard}>
          <span style={styles.analyticsValue}>4.8</span>
          <span style={styles.analyticsLabel}>Avg Rating</span>
          <span style={styles.analyticsSubtext}>Patient satisfaction</span>
        </div>
      </div>

      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Compliance by Category</h3>
        <div style={styles.complianceBreakdown}>
          {[
            { label: 'Protein Goals', value: 85, color: '#4A6741' },
            { label: 'Hydration', value: 78, color: '#2AABB3' },
            { label: 'Exercise', value: 72, color: '#9B7E9B' },
            { label: 'Meal Logging', value: 91, color: '#C4956A' },
          ].map((item, idx) => (
            <div key={idx} style={styles.complianceItem}>
              <div style={styles.complianceHeader}>
                <span style={styles.complianceLabel}>{item.label}</span>
                <span style={styles.complianceValue}>{item.value}%</span>
              </div>
              <div style={styles.complianceBar}>
                <div style={{...styles.complianceBarFill, width: `${item.value}%`, background: item.color}} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Provider Settings Screen
function ProviderSettingsScreen() {
  return (
    <div style={styles.screenContent} className="fade-in">
      <header style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Settings</h1>
        <p style={styles.pageSubtitle}>Provider preferences</p>
      </header>

      <div style={styles.settingsList}>
        {[
          { icon: '👤', label: 'Account Settings' },
          { icon: '🔔', label: 'Notification Preferences' },
          { icon: '📊', label: 'Default Patient Goals' },
          { icon: '📝', label: 'Note Templates' },
          { icon: '🔗', label: 'EHR Integration' },
          { icon: '👥', label: 'Team Members' },
          { icon: '❓', label: 'Help & Support' },
        ].map((item, idx) => (
          <div key={idx} style={styles.settingItem} className="card-hover">
            <span style={styles.settingIcon}>{item.icon}</span>
            <span style={styles.settingLabel}>{item.label}</span>
            <span style={styles.settingArrow}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== PAYMENTS SCREEN ====================
function PaymentsScreen() {
  const [payments, setPayments] = useState([]);
  const [dailySummaries, setDailySummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [needsMigration, setNeedsMigration] = useState(false);
  const [migrating, setMigrating] = useState(false);
  
  // Filters
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 25;
  
  // Sorting
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Modals
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Summary stats
  const [summaryStats, setSummaryStats] = useState({
    todayPaid: 0,
    todayCount: 0,
    weekPaid: 0,
    weekCount: 0,
    monthPaid: 0,
    monthCount: 0,
    outstanding: 0
  });

  useEffect(() => {
    loadPayments();
    loadDailySummaries();
  }, [dateFrom, dateTo, statusFilter, currentPage, sortBy, sortOrder]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
        sort_by: sortBy,
        sort_order: sortOrder,
      });
      
      if (dateFrom) params.append('date_from', dateFrom);
      if (dateTo) params.append('date_to', dateTo);
      if (statusFilter !== 'All') params.append('status', statusFilter);
      
      const res = await fetch(`/api/payments?${params}`);
      
      if (res.status === 404) {
        setNeedsMigration(true);
        setLoading(false);
        return;
      }
      
      const data = await res.json();
      setPayments(data.payments || []);
      setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
      
      // Calculate summary stats
      calculateSummaryStats(data.payments || []);
      
      setNeedsMigration(false);
      setLoading(false);
    } catch (err) {
      console.error('Error loading payments:', err);
      setNeedsMigration(true);
      setLoading(false);
    }
  };

  const loadDailySummaries = async () => {
    try {
      const params = new URLSearchParams({ days: 30 });
      const res = await fetch(`/api/payments-daily?${params}`);
      if (res.ok) {
        const data = await res.json();
        setDailySummaries(data.daily || []);
      }
    } catch (err) {
      console.error('Error loading daily summaries:', err);
    }
  };

  const calculateSummaryStats = (allPayments) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    let todayPaid = 0, todayCount = 0;
    let weekPaid = 0, weekCount = 0;
    let monthPaid = 0, monthCount = 0;
    let outstanding = 0;

    allPayments.forEach(p => {
      const pDate = new Date(p.date);
      const amount = parseFloat(p.amount) || 0;
      
      if (p.status === 'Paid') {
        if (pDate >= today) {
          todayPaid += amount;
          todayCount++;
        }
        if (pDate >= weekAgo) {
          weekPaid += amount;
          weekCount++;
        }
        if (pDate >= monthAgo) {
          monthPaid += amount;
          monthCount++;
        }
      } else if (p.status === 'Sent') {
        outstanding += amount;
      }
    });

    setSummaryStats({
      todayPaid,
      todayCount,
      weekPaid,
      weekCount,
      monthPaid,
      monthCount,
      outstanding
    });
  };

  const runMigration = async () => {
    try {
      setMigrating(true);
      const res = await fetch('/api/migrate-payments');
      if (res.ok) {
        setNeedsMigration(false);
        loadPayments();
        loadDailySummaries();
      }
    } catch (err) {
      console.error('Migration error:', err);
    } finally {
      setMigrating(false);
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const formatCurrency = (val) => {
    const num = parseFloat(val) || 0;
    return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getStatusStyle = (status) => {
    const baseStyle = {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
    };
    
    switch(status) {
      case 'Paid':
        return { ...baseStyle, background: '#d4edda', color: '#155724' };
      case 'Sent':
        return { ...baseStyle, background: '#fff3cd', color: '#856404' };
      case 'Canceled':
        return { ...baseStyle, background: '#f8d7da', color: '#721c24' };
      case 'Refunded':
        return { ...baseStyle, background: '#ffe5cc', color: '#8B4000' };
      default:
        return { ...baseStyle, background: '#e2e3e5', color: '#383d41' };
    }
  };

  const filteredPayments = payments.filter(p => {
    if (!searchQuery) return true;
    return p.patient_name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (needsMigration) {
    return (
      <div style={styles.screenContent} className="fade-in">
        <header style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>💰 Payments</h1>
          <p style={styles.pageSubtitle}>Payment tracking & reporting</p>
        </header>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center',
          marginTop: '40px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💳</div>
          <h3 style={{ fontSize: '20px', marginBottom: '12px', color: '#333' }}>Set Up Payments</h3>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            Initialize the payments system to start tracking transactions.
          </p>
          <button
            style={{
              ...styles.primaryButton,
              fontSize: '16px',
              padding: '12px 32px'
            }}
            onClick={runMigration}
            disabled={migrating}
          >
            {migrating ? 'Setting up...' : 'Initialize Payments'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.screenContent} className="fade-in">
      <header style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>💰 Payments</h1>
        <p style={styles.pageSubtitle}>Payment tracking & reporting</p>
      </header>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={styles.paymentsCard}>
          <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>Today</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#4A6741' }}>
            {formatCurrency(summaryStats.todayPaid)}
          </div>
          <div style={{ fontSize: '11px', color: '#999' }}>{summaryStats.todayCount} payments</div>
        </div>

        <div style={styles.paymentsCard}>
          <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>This Week</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#4A6741' }}>
            {formatCurrency(summaryStats.weekPaid)}
          </div>
          <div style={{ fontSize: '11px', color: '#999' }}>{summaryStats.weekCount} payments</div>
        </div>

        <div style={styles.paymentsCard}>
          <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>This Month</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#4A6741' }}>
            {formatCurrency(summaryStats.monthPaid)}
          </div>
          <div style={{ fontSize: '11px', color: '#999' }}>{summaryStats.monthCount} payments</div>
        </div>

        <div style={styles.paymentsCard}>
          <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>Outstanding</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#856404' }}>
            {formatCurrency(summaryStats.outstanding)}
          </div>
          <div style={{ fontSize: '11px', color: '#999' }}>Unpaid</div>
        </div>
      </div>

      {/* Daily Revenue Chart */}
      {dailySummaries.length > 0 && (
        <div style={{ ...styles.paymentsCard, marginBottom: '20px', padding: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#333' }}>
            Daily Revenue (Last 30 Days)
          </h3>
          <DailyRevenueChart data={dailySummaries} />
        </div>
      )}

      {/* Filters */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          marginBottom: '12px'
        }}>
          <div>
            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
              style={styles.paymentInput}
            />
          </div>
          
          <div>
            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
              style={styles.paymentInput}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              style={styles.paymentInput}
            >
              <option>All</option>
              <option>Paid</option>
              <option>Sent</option>
              <option>Canceled</option>
              <option>Refunded</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="Search patient name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ ...styles.paymentInput, flex: 1 }}
          />
          
          <button
            style={{
              ...styles.primaryButton,
              fontSize: '13px',
              padding: '8px 16px',
              whiteSpace: 'nowrap'
            }}
            onClick={() => setShowImportModal(true)}
          >
            📥 Import CSV
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        marginBottom: '16px'
      }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
            Loading payments...
          </div>
        ) : filteredPayments.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
            No payments found
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #e9ecef' }}>
                    <th style={styles.tableHeader} onClick={() => handleSort('date')}>
                      Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th style={styles.tableHeader} onClick={() => handleSort('patient_name')}>
                      Patient {sortBy === 'patient_name' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th style={styles.tableHeader}>Description</th>
                    <th style={styles.tableHeader} onClick={() => handleSort('status')}>
                      Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th style={styles.tableHeader} onClick={() => handleSort('amount')}>
                      Amount {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th style={styles.tableHeader}>Net</th>
                    <th style={styles.tableHeader}>Fees</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment, idx) => (
                    <tr
                      key={payment.id || idx}
                      style={{
                        borderBottom: '1px solid #f0f0f0',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedPayment(payment)}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#fafbfc'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                      <td style={styles.tableCell}>{payment.date}</td>
                      <td style={styles.tableCell}>{payment.patient_name || '—'}</td>
                      <td style={styles.tableCell}>{payment.description || '—'}</td>
                      <td style={styles.tableCell}>
                        <span style={getStatusStyle(payment.status)}>{payment.status}</span>
                      </td>
                      <td style={{ ...styles.tableCell, fontWeight: '600' }}>
                        {formatCurrency(payment.amount)}
                      </td>
                      <td style={styles.tableCell}>
                        {payment.net ? formatCurrency(payment.net) : '—'}
                      </td>
                      <td style={{ ...styles.tableCell, color: '#999' }}>
                        {payment.fees ? formatCurrency(payment.fees) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                padding: '16px',
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                borderTop: '1px solid #f0f0f0'
              }}>
                <button
                  style={styles.paginationBtn}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  ←
                </button>
                
                <span style={{ padding: '8px 16px', fontSize: '14px', color: '#666' }}>
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  style={styles.paginationBtn}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* CSV Import Modal */}
      {showImportModal && (
        <CSVImportModal
          onClose={() => setShowImportModal(false)}
          onImportComplete={() => {
            setShowImportModal(false);
            loadPayments();
            loadDailySummaries();
          }}
        />
      )}

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <PaymentDetailModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </div>
  );
}

// Daily Revenue Chart Component
function DailyRevenueChart({ data }) {
  const chartRef = useRef(null);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

  const maxAmount = Math.max(...data.map(d => parseFloat(d.total) || 0), 1);
  const chartHeight = 120;
  const barWidth = Math.max(8, Math.floor((300 - data.length * 2) / data.length));

  const formatCurrency = (val) => {
    const num = parseFloat(val) || 0;
    return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  return (
    <div style={{ position: 'relative' }}>
      <svg
        ref={chartRef}
        width="100%"
        height={chartHeight}
        style={{ display: 'block' }}
      >
        {data.map((day, idx) => {
          const amount = parseFloat(day.total) || 0;
          const barHeight = (amount / maxAmount) * (chartHeight - 20);
          const x = idx * (barWidth + 2);
          const y = chartHeight - barHeight;

          return (
            <rect
              key={idx}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={hoveredDay === idx ? '#6B8E63' : '#4A6741'}
              opacity={hoveredDay === idx ? 1 : 0.8}
              rx="2"
              onMouseEnter={(e) => {
                setHoveredDay(idx);
                const rect = e.target.getBoundingClientRect();
                setHoverPos({ x: rect.left, y: rect.top });
              }}
              onMouseLeave={() => setHoveredDay(null)}
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
            />
          );
        })}
      </svg>

      {hoveredDay !== null && (
        <div style={{
          position: 'absolute',
          top: '-40px',
          left: `${hoveredDay * (barWidth + 2)}px`,
          background: '#1a1a2e',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 10,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          <div style={{ fontWeight: '600' }}>{formatCurrency(data[hoveredDay].total)}</div>
          <div style={{ fontSize: '10px', opacity: 0.8 }}>{formatDate(data[hoveredDay].date)}</div>
        </div>
      )}
    </div>
  );
}

// CSV Import Modal
function CSVImportModal({ onClose, onImportComplete }) {
  const [csvText, setCsvText] = useState('');
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (evt) => setCsvText(evt.target.result);
      reader.readAsText(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => setCsvText(evt.target.result);
      reader.readAsText(file);
    }
  };

  const handleImport = async () => {
    if (!csvText.trim()) return;
    
    try {
      setImporting(true);
      const res = await fetch('/api/payments-import', {
        method: 'POST',
        headers: { 'Content-Type': 'text/csv' },
        body: csvText
      });
      
      const data = await res.json();
      setResult(data);
      
      if (data.imported > 0) {
        setTimeout(() => {
          onImportComplete();
        }, 2000);
      }
    } catch (err) {
      console.error('Import error:', err);
      setResult({ error: 'Import failed' });
    } finally {
      setImporting(false);
    }
  };

  const previewRows = csvText.split('\n').slice(0, 6);

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{ ...styles.modalContent, maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Import CSV</h2>
          <button onClick={onClose} style={styles.closeButton}>✕</button>
        </div>

        {!result ? (
          <>
            <div
              style={{
                border: isDragging ? '2px dashed #4A6741' : '2px dashed #ccc',
                borderRadius: '12px',
                padding: '32px',
                textAlign: 'center',
                marginBottom: '20px',
                background: isDragging ? '#f0f7ed' : '#fafafa',
                cursor: 'pointer'
              }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📄</div>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                Drag & drop CSV file here
              </p>
              <p style={{ fontSize: '12px', color: '#999' }}>or click to browse</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />
            </div>

            {csvText && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Preview (first 5 rows):</h3>
                  <div style={{
                    background: '#f8f9fa',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    overflowX: 'auto',
                    maxHeight: '200px'
                  }}>
                    {previewRows.map((row, idx) => (
                      <div key={idx} style={{ marginBottom: '4px', whiteSpace: 'nowrap' }}>
                        {row}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  style={{ ...styles.primaryButton, width: '100%' }}
                  onClick={handleImport}
                  disabled={importing}
                >
                  {importing ? 'Importing...' : 'Import Payments'}
                </button>
              </>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            {result.error ? (
              <>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#721c24' }}>Import Failed</h3>
                <p style={{ color: '#666' }}>{result.error}</p>
              </>
            ) : (
              <>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                <h3 style={{ fontSize: '18px', marginBottom: '16px', color: '#155724' }}>Import Complete</h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                  textAlign: 'left'
                }}>
                  <div style={styles.resultItem}>
                    <span style={styles.resultLabel}>Imported:</span>
                    <span style={styles.resultValue}>{result.imported || 0}</span>
                  </div>
                  <div style={styles.resultItem}>
                    <span style={styles.resultLabel}>Skipped:</span>
                    <span style={styles.resultValue}>{result.skipped || 0}</span>
                  </div>
                  <div style={styles.resultItem}>
                    <span style={styles.resultLabel}>Matched:</span>
                    <span style={styles.resultValue}>{result.matched || 0}</span>
                  </div>
                  <div style={styles.resultItem}>
                    <span style={styles.resultLabel}>Unmatched:</span>
                    <span style={styles.resultValue}>{result.unmatched || 0}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Payment Detail Modal
function PaymentDetailModal({ payment, onClose }) {
  const formatCurrency = (val) => {
    const num = parseFloat(val) || 0;
    return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{ ...styles.modalContent, maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Payment Details</h2>
          <button onClick={onClose} style={styles.closeButton}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={styles.detailLabel}>Patient</div>
            <div style={styles.detailValue}>{payment.patient_name || '—'}</div>
          </div>

          <div>
            <div style={styles.detailLabel}>Date</div>
            <div style={styles.detailValue}>{payment.date}</div>
          </div>

          <div>
            <div style={styles.detailLabel}>Description</div>
            <div style={styles.detailValue}>{payment.description || '—'}</div>
          </div>

          <div>
            <div style={styles.detailLabel}>Status</div>
            <div style={styles.detailValue}>
              <span style={{
                display: 'inline-block',
                padding: '6px 16px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                background: payment.status === 'Paid' ? '#d4edda' : 
                           payment.status === 'Sent' ? '#fff3cd' :
                           payment.status === 'Canceled' ? '#f8d7da' : '#ffe5cc',
                color: payment.status === 'Paid' ? '#155724' :
                       payment.status === 'Sent' ? '#856404' :
                       payment.status === 'Canceled' ? '#721c24' : '#8B4000'
              }}>
                {payment.status}
              </span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            padding: '16px',
            background: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <div>
              <div style={{ ...styles.detailLabel, fontSize: '11px' }}>Amount</div>
              <div style={{ ...styles.detailValue, fontSize: '18px', fontWeight: '700', color: '#4A6741' }}>
                {formatCurrency(payment.amount)}
              </div>
            </div>
            
            {payment.fees && (
              <div>
                <div style={{ ...styles.detailLabel, fontSize: '11px' }}>Fees</div>
                <div style={{ ...styles.detailValue, fontSize: '18px', fontWeight: '600', color: '#999' }}>
                  {formatCurrency(payment.fees)}
                </div>
              </div>
            )}
            
            {payment.net && (
              <div>
                <div style={{ ...styles.detailLabel, fontSize: '11px' }}>Net</div>
                <div style={{ ...styles.detailValue, fontSize: '18px', fontWeight: '700', color: '#333' }}>
                  {formatCurrency(payment.net)}
                </div>
              </div>
            )}
          </div>

          {payment.notes && (
            <div>
              <div style={styles.detailLabel}>Notes</div>
              <div style={{
                ...styles.detailValue,
                background: '#f8f9fa',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '13px'
              }}>
                {payment.notes}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Provider Bottom Nav
function ProviderBottomNav({ currentScreen, setCurrentScreen }) {
  const items = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'patients', icon: '👥', label: 'Patients' },
    { id: 'payments', icon: '💰', label: 'Payments' },
    { id: 'messages', icon: '💬', label: 'Messages' },
    { id: 'analytics', icon: '📊', label: 'Analytics' },
    { id: 'settings', icon: 'âš™️', label: 'Settings' },
  ];

  return (
    <nav style={styles.bottomNav}>
      {items.map(item => (
        <button
          key={item.id}
          style={{
            ...styles.navButton,
            color: currentScreen === item.id ? '#4A6741' : '#9B9B9B'
          }}
          onClick={() => setCurrentScreen(item.id)}
          className="nav-item"
        >
          <span style={{fontSize: '20px'}}>{item.icon}</span>
          <span style={styles.navLabel}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

// Home Screen
function HomeScreen({ user, setUser, setActiveModal }) {
  const [showInjectionTracker, setShowInjectionTracker] = useState(false);
  
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Week-specific tips and guidance
  const weeklyGuidance = {
    1: {
      title: 'Getting Started',
      tip: 'Take your injection at night to sleep through initial side effects. Keep meals small and stay hydrated.',
      icon: '🌱'
    },
    2: {
      title: 'Adjusting',
      tip: 'Your appetite may be decreasing. Focus on protein first at every meal and listen to your fullness cues.',
      icon: '🔄'
    },
    3: {
      title: 'Finding Your Rhythm',
      tip: 'Side effects should be improving. Establish consistent eating times and stay ahead of constipation.',
      icon: '⚡'
    },
    4: {
      title: 'Building Momentum',
      tip: 'You may notice early weight loss. Focus on protein (25-35g per meal) to preserve muscle mass.',
      icon: '📈'
    },
    default: {
      title: 'Keep Going Strong',
      tip: 'Stay consistent with your protein goals, hydration, and movement. Celebrate your progress!',
      icon: '💪'
    }
  };

  const currentGuidance = weeklyGuidance[user.week] || weeklyGuidance.default;

  if (showInjectionTracker) {
    return <InjectionTrackerScreen user={user} setUser={setUser} onBack={() => setShowInjectionTracker(false)} />;
  }

  return (
    <div style={styles.screenContent} className="fade-in">
      {/* Header */}
      <header style={styles.header}>
        <div>
          <p style={styles.greeting}>{greeting()},</p>
          <div style={styles.nameRow}>
            <h1 style={styles.userName}>{user.name}</h1>
            <span style={{
              ...styles.loyaltyBadgeSmall,
              background: user.loyaltyTier === 'Platinum' ? 'linear-gradient(135deg, #E8E8E8 0%, #A0A0A0 100%)' :
                         user.loyaltyTier === 'Gold' ? 'linear-gradient(135deg, #FFE55C 0%, #D4AF37 100%)' :
                         user.loyaltyTier === 'Silver' ? 'linear-gradient(135deg, #E8E8E8 0%, #A8A8A8 100%)' :
                         'linear-gradient(135deg, #D4A574 0%, #CD7F32 100%)'
            }}>
              <span style={{fontSize: '10px', marginRight: '4px'}}>
                {user.loyaltyTier === 'Platinum' ? '◆' : user.loyaltyTier === 'Gold' ? '✧' : user.loyaltyTier === 'Silver' ? '❖' : '✦'}
              </span>
              {user.loyaltyTier || 'Bronze'}
            </span>
          </div>
        </div>
        <div style={styles.weekBadge}>
          <span style={styles.weekLabel}>Week</span>
          <span style={styles.weekNumber}>{user.week}</span>
        </div>
      </header>

      {/* Calendar with Injection Tracking - TOP */}
      <HomeCalendar user={user} setUser={setUser} />

      {/* This Week's Guidance */}
      <div style={styles.weekGuidanceCard}>
        <div style={styles.weekGuidanceHeader}>
          <span style={styles.weekGuidanceIcon}>{currentGuidance.icon}</span>
          <div>
            <span style={styles.weekGuidanceLabel}>Week {user.week}</span>
            <h3 style={styles.weekGuidanceTitle}>{currentGuidance.title}</h3>
          </div>
        </div>
        <p style={styles.weekGuidanceTip}>{currentGuidance.tip}</p>
      </div>

      {/* Daily Goals */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Daily Goals</h3>
        <div style={styles.goalsGrid}>
          <GoalCard
            icon={<WaterIcon />}
            label="Hydration"
            current={user.waterCurrent}
            goal={user.waterGoal}
            unit="oz"
            color="#2AABB3"
            onIncrement={() => setUser({...user, waterCurrent: Math.min(user.waterCurrent + 8, user.waterGoal)})}
          />
          <GoalCard
            icon={<ProteinIcon />}
            label="Protein"
            current={user.proteinCurrent}
            goal={user.proteinGoal}
            unit="g"
            color="#4A6741"
            onIncrement={() => setUser({...user, proteinCurrent: Math.min(user.proteinCurrent + 10, user.proteinGoal)})}
          />
          <GoalCard
            icon={<FiberIcon />}
            label="Fiber"
            current={user.fiberCurrent}
            goal={user.fiberGoal}
            unit="g"
            color="#C4956A"
            onIncrement={() => setUser({...user, fiberCurrent: Math.min(user.fiberCurrent + 5, user.fiberGoal)})}
          />
          <GoalCard
            icon={<ExerciseIcon />}
            label="Movement"
            current={user.exerciseCurrent}
            goal={user.exerciseGoal}
            unit="min"
            color="#9B7E9B"
            onIncrement={() => setUser({...user, exerciseCurrent: Math.min(user.exerciseCurrent + 10, user.exerciseGoal)})}
          />
        </div>
      </section>

      {/* Quick Injection Status */}
      <section style={styles.section}>
        <div style={styles.injectionStatusCard} onClick={() => setShowInjectionTracker(true)}>
          <div style={styles.injectionStatusLeft}>
            <span style={styles.injectionStatusIcon}>💉</span>
            <div>
              <span style={styles.injectionStatusLabel}>Current Dose</span>
              <span style={styles.injectionStatusDose}>{user.medicationDose}</span>
            </div>
          </div>
          <div style={styles.injectionStatusRight}>
            <span style={styles.injectionStatusArrow}>→</span>
          </div>
        </div>
      </section>
    </div>
  );
}


// First 30 Days Journey Component
function First30DaysJourney({ currentWeek, onWeekSelect }) {
  const journeyWeeks = [
    { 
      id: 1, 
      title: 'Week 1: Getting Started',
      shortTitle: 'Getting Started',
      icon: '1️⃣',
      active: currentWeek === 1
    },
    { 
      id: 2, 
      title: 'Week 2: Adjusting',
      shortTitle: 'Adjusting',
      icon: '2️⃣',
      active: currentWeek === 2
    },
    { 
      id: 3, 
      title: 'Weeks 3-4: Finding Your Rhythm',
      shortTitle: 'Finding Your Rhythm',
      icon: '3️⃣',
      active: currentWeek >= 3 && currentWeek <= 4
    }
  ];

  return (
    <div style={styles.first30DaysContainer}>
      <div style={styles.first30DaysHeader}>
        <span style={styles.first30DaysIcon}>📅</span>
        <div>
          <h3 style={styles.first30DaysTitle}>Your First 30 Days</h3>
          <p style={styles.first30DaysSubtitle}>Week-by-week guidance for GLP-1 success</p>
        </div>
      </div>
      
      <div style={styles.journeyWeeksList}>
        {journeyWeeks.map((week) => (
          <div 
            key={week.id}
            style={{
              ...styles.journeyWeekCard,
              ...(week.active ? styles.journeyWeekCardActive : {})
            }}
            className="card-hover"
            onClick={() => onWeekSelect(week.id)}
          >
            <div style={{
              ...styles.journeyWeekIcon,
              ...(week.active ? styles.journeyWeekIconActive : {})
            }}>
              {week.icon}
            </div>
            <div style={styles.journeyWeekContent}>
              <p style={{
                ...styles.journeyWeekTitle,
                ...(week.active ? styles.journeyWeekTitleActive : {})
              }}>{week.shortTitle}</p>
              {week.active && (
                <span style={styles.journeyWeekCurrentBadge}>Current</span>
              )}
            </div>
            <span style={styles.journeyWeekArrow}>→</span>
          </div>
        ))}
      </div>

      {/* Success in Month 1 Card */}
      <div style={styles.successMonth1Card}>
        <div style={styles.successMonth1Header}>
          <span style={styles.successMonth1Icon}>🎯</span>
          <h4 style={styles.successMonth1Title}>Success in Month 1</h4>
        </div>
        
        <div style={styles.successMonth1Content}>
          <div style={styles.successNotAbout}>
            <p style={styles.successSectionLabel}>IS NOT ABOUT:</p>
            <div style={styles.successListNot}>
              <p style={styles.successItemNot}>✗ Losing a specific amount of weight</p>
              <p style={styles.successItemNot}>✗ Having zero side effects</p>
              <p style={styles.successItemNot}>✗ Perfect eating</p>
              <p style={styles.successItemNot}>✗ Comparing your results to others</p>
            </div>
          </div>
          
          <div style={styles.successIsAbout}>
            <p style={styles.successSectionLabel}>IS ABOUT:</p>
            <div style={styles.successListIs}>
              <p style={styles.successItemIs}>✓ Learning your body's new signals</p>
              <p style={styles.successItemIs}>✓ Establishing sustainable habits</p>
              <p style={styles.successItemIs}>✓ Managing side effects effectively</p>
              <p style={styles.successItemIs}>✓ Building a foundation for long-term success</p>
            </div>
          </div>
        </div>
      </div>

      {/* When to Call Your Provider */}
      <div style={styles.callProviderCard}>
        <div style={styles.callProviderHeader}>
          <span style={styles.callProviderIcon}>⚠️</span>
          <h4 style={styles.callProviderTitle}>When to Call Your Provider</h4>
        </div>
        <div style={styles.callProviderList}>
          <p style={styles.callProviderItem}>• Severe or persistent vomiting</p>
          <p style={styles.callProviderItem}>• Unable to keep fluids down</p>
          <p style={styles.callProviderItem}>• Severe abdominal pain</p>
          <p style={styles.callProviderItem}>• Extreme fatigue</p>
          <p style={styles.callProviderItem}>• Severe headaches</p>
          <p style={styles.callProviderItem}>• Any concerning symptoms that worry you</p>
        </div>
        <a href="tel:801-917-4386" style={styles.callProviderButton}>
          📞 Call HYDR801: 801-917-4386
        </a>
      </div>
    </div>
  );
}

// Journey Week Detail Component
function JourneyWeekDetail({ week, onBack }) {
  const weekContent = {
    1: {
      title: 'Week 1: Getting Started',
      icon: '1️⃣',
      expectations: [
        'Minimal appetite suppression at first—medication takes time to build up',
        'Side effects may begin: nausea (especially 24-48 hours after injection), fatigue, headaches',
        'Potential constipation or diarrhea'
      ],
      tips: [
        { text: 'Take your injection at night to sleep through initial side effects', checked: true },
        { text: 'Keep meals simple but nutritious', checked: true },
        { text: 'Stay well hydrated', checked: true },
        { text: 'Consider taking an acid reducer before bedtime if experiencing reflux', checked: true }
      ]
    },
    2: {
      title: 'Week 2: Adjusting',
      icon: '2️⃣',
      expectations: [
        'Slightly decreased appetite',
        'Early satiety (feeling full faster)',
        'Better control around food choices',
        'Side effects may still be present but potentially improving'
      ],
      tips: [
        { text: 'Establish a regular eating schedule', checked: true },
        { text: 'Learn to recognize your new fullness cues', checked: true },
        { text: 'Get enough protein with each meal', checked: true },
        { text: 'Take it slow with meals—no rushing', checked: true }
      ]
    },
    3: {
      title: 'Weeks 3-4: Finding Your Rhythm',
      icon: '3️⃣',
      expectations: [
        'More consistent appetite suppression',
        'Better management of side effects',
        'Possible initial weight loss (though this varies greatly)',
        'More stable energy levels'
      ],
      tips: [
        { text: 'Eat regular meals even if not hungry', checked: true },
        { text: 'Focus on protein and fiber', checked: true },
        { text: 'Stay ahead of constipation', checked: true },
        { text: 'Regular hydration', checked: true },
        { text: 'Gentle movement if you feel up to it', checked: true }
      ]
    }
  };

  const content = weekContent[week];

  return (
    <div style={styles.screenContent} className="fade-in">
      <button style={styles.backButton} onClick={onBack}>← Back</button>
      
      <div style={styles.journeyDetailHeader}>
        <div style={styles.journeyDetailIcon}>{content.icon}</div>
        <h1 style={styles.journeyDetailTitle}>{content.title}</h1>
      </div>

      <div style={styles.journeyDetailSection}>
        <h3 style={styles.journeyDetailSectionTitle}>WHAT TO EXPECT</h3>
        <div style={styles.journeyDetailCard}>
          {content.expectations.map((item, idx) => (
            <div key={idx} style={styles.journeyExpectationItem}>
              <span style={styles.journeyExpectationBullet}>•</span>
              <p style={styles.journeyExpectationText}>{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.journeyDetailSection}>
        <h3 style={styles.journeyDetailSectionTitle}>TIPS FOR SUCCESS</h3>
        <div style={styles.journeyDetailCard}>
          {content.tips.map((tip, idx) => (
            <div key={idx} style={styles.journeyTipItem}>
              <span style={styles.journeyTipCheck}>✓</span>
              <p style={styles.journeyTipText}>{tip.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick reminder about provider */}
      <div style={styles.journeyProviderReminder}>
        <span style={styles.journeyProviderIcon}>💬</span>
        <p style={styles.journeyProviderText}>
          Questions or concerns? Your HYDR801 team is here to help.
        </p>
        <a href="tel:801-917-4386" style={styles.journeyProviderLink}>
          Call 801-917-4386
        </a>
      </div>
    </div>
  );
}

// Home Calendar Component - Integrated tracking calendar
function HomeCalendar({ user, setUser }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showInjectionModal, setShowInjectionModal] = useState(false);
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayNamesFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Get calendar days for current month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Previous month's trailing days
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({ 
        day: prevMonthDays - i, 
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthDays - i)
      });
    }
    
    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ 
        day: i, 
        isCurrentMonth: true,
        date: new Date(year, month, i)
      });
    }
    
    // Next month's leading days (limit to 35 or 42 total)
    const totalNeeded = days.length > 35 ? 42 : 35;
    const remainingDays = totalNeeded - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ 
        day: i, 
        isCurrentMonth: false,
        date: new Date(year, month + 1, i)
      });
    }
    
    return days;
  };

  // Check if a date is a scheduled injection day (based on user's preferred day)
  const isScheduledInjectionDay = (date) => {
    return date.getDay() === (user.injectionDay || 0);
  };

  // Check if injection is completed for this date
  const isInjectionCompleted = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return user.injectionLog?.some(inj => inj.date === dateStr && inj.type === 'glp1' && inj.completed);
  };

  // Check if a date has weight data
  const hasWeightData = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return user.weightLog?.some(w => w.date === dateStr);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const goToPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Handle clicking on any day to log injection
  const handleDayClick = (dayInfo) => {
    if (dayInfo.isCurrentMonth) {
      setSelectedDate(dayInfo.date);
      setShowInjectionModal(true);
    }
  };

  // Toggle injection completion
  const toggleInjectionComplete = () => {
    if (!selectedDate) return;
    
    const dateStr = selectedDate.toISOString().split('T')[0];
    const existingLog = user.injectionLog?.find(inj => inj.date === dateStr && inj.type === 'glp1');
    
    if (existingLog) {
      // Toggle the completion status
      const updatedLog = user.injectionLog.map(inj => 
        inj.date === dateStr && inj.type === 'glp1' 
          ? { ...inj, completed: !inj.completed }
          : inj
      );
      setUser({ ...user, injectionLog: updatedLog });
    } else {
      // Add new completed injection
      const newInjection = {
        id: Date.now(),
        type: 'glp1',
        date: dateStr,
        dose: user.medicationDose,
        notes: '',
        completed: true
      };
      setUser({ 
        ...user, 
        injectionLog: [...(user.injectionLog || []), newInjection]
      });
    }
    setShowInjectionModal(false);
  };

  // Change injection day preference
  const changeInjectionDay = (dayIndex) => {
    setUser({ ...user, injectionDay: dayIndex });
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <section style={styles.section}>
      <div style={styles.homeCalendarContainer}>
        {/* Calendar Header */}
        <div style={styles.homeCalHeader}>
          <div style={styles.homeCalTitleRow}>
            <span style={styles.homeCalIcon}>📅</span>
            <h3 style={styles.homeCalTitle}>Injection Tracker</h3>
          </div>
          <div style={styles.homeCalInjDayPicker}>
            <span style={styles.homeCalInjDayLabel}>Every</span>
            <select 
              style={styles.homeCalInjDaySelect}
              value={user.injectionDay || 0}
              onChange={(e) => changeInjectionDay(parseInt(e.target.value))}
            >
              {dayNamesFull.map((day, idx) => (
                <option key={idx} value={idx}>{day}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Month Navigation */}
        <div style={styles.homeCalMonthNav}>
          <button style={styles.homeCalNavBtn} onClick={goToPrevMonth}>‹</button>
          <span style={styles.homeCalMonthLabel}>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button style={styles.homeCalNavBtn} onClick={goToNextMonth}>›</button>
        </div>

        {/* Day Headers */}
        <div style={styles.homeCalDayHeaders}>
          {dayNames.map((day, idx) => (
            <div 
              key={day} 
              style={{
                ...styles.homeCalDayHeader,
                color: idx === (user.injectionDay || 0) ? '#4A6741' : '#9B9B9B',
                fontWeight: idx === (user.injectionDay || 0) ? '600' : '500'
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div style={styles.homeCalGrid}>
          {days.map((dayInfo, idx) => {
            const isInjDay = isScheduledInjectionDay(dayInfo.date);
            const isCompleted = isInjectionCompleted(dayInfo.date);
            const isTodayDate = isToday(dayInfo.date);
            const isPastDate = isPast(dayInfo.date);
            
            return (
              <div
                key={idx}
                style={{
                  ...styles.homeCalDay,
                  ...(dayInfo.isCurrentMonth ? {} : styles.homeCalDayOther),
                  ...(isTodayDate ? styles.homeCalDayToday : {}),
                  ...(isInjDay && dayInfo.isCurrentMonth ? styles.homeCalDayInjection : {}),
                  cursor: dayInfo.isCurrentMonth ? 'pointer' : 'default'
                }}
                onClick={() => handleDayClick(dayInfo)}
              >
                <span style={{
                  ...styles.homeCalDayNum,
                  ...(isInjDay && dayInfo.isCurrentMonth ? styles.homeCalDayNumInj : {})
                }}>{dayInfo.day}</span>
                
                {/* Green dot for completed injection */}
                {isCompleted && dayInfo.isCurrentMonth && (
                  <div style={styles.homeCalCompletedDot}>✓</div>
                )}
                
                {/* Injection indicator (needle icon) for scheduled but not completed */}
                {isInjDay && dayInfo.isCurrentMonth && !isCompleted && (
                  <div style={{
                    ...styles.homeCalInjIndicator,
                    opacity: isPastDate && !isTodayDate ? 0.4 : 1
                  }}>💉</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={styles.homeCalLegend}>
          <div style={styles.homeCalLegendItem}>
            <span style={styles.homeCalLegendDot}>💉</span>
            <span style={styles.homeCalLegendText}>Injection Day</span>
          </div>
          <div style={styles.homeCalLegendItem}>
            <span style={{...styles.homeCalLegendDotGreen}}>✓</span>
            <span style={styles.homeCalLegendText}>Completed</span>
          </div>
        </div>

        {/* Injection Modal */}
        {showInjectionModal && selectedDate && (
          <div style={styles.homeCalModal}>
            <div style={styles.homeCalModalContent}>
              <h4 style={styles.homeCalModalTitle}>
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h4>
              <p style={styles.homeCalModalDose}>
                💉 GLP-1 Injection • {user.medicationDose}
              </p>
              
              {isInjectionCompleted(selectedDate) ? (
                <>
                  <div style={styles.homeCalModalCompleted}>
                    <span style={styles.homeCalModalCompletedIcon}>✓</span>
                    <span>Injection Logged</span>
                  </div>
                  <button 
                    style={styles.homeCalModalBtnUndo}
                    onClick={toggleInjectionComplete}
                  >
                    Remove Log
                  </button>
                </>
              ) : (
                <button 
                  style={styles.homeCalModalBtn}
                  onClick={toggleInjectionComplete}
                >
                  ✓ Log Injection
                </button>
              )}
              
              <button 
                style={styles.homeCalModalClose}
                onClick={() => setShowInjectionModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// Goal Card Component
function GoalCard({ icon, label, current, goal, unit, color, onIncrement }) {
  const percentage = Math.round((current / goal) * 100);
  
  return (
    <div style={styles.goalCard} className="card-hover" onClick={onIncrement}>
      <div style={styles.goalHeader}>
        <div style={{...styles.goalIcon, backgroundColor: `${color}15`}}>
          {React.cloneElement(icon, { color })}
        </div>
        <span style={{...styles.goalPercentage, color}}>{percentage}%</span>
      </div>
      <div style={styles.goalProgress}>
        <div style={styles.progressBar}>
          <div 
            className="progress-bar-fill"
            style={{
              ...styles.progressFill,
              width: `${percentage}%`,
              backgroundColor: color
            }}
          />
        </div>
      </div>
      <p style={styles.goalLabel}>{label}</p>
      <p style={styles.goalValue}>{current}<span style={styles.goalUnit}>/{goal}{unit}</span></p>
    </div>
  );
}

// Nutrition Screen
function NutritionScreen({ user, setUser }) {
  const [showMealPlanner, setShowMealPlanner] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);

  // Calculate calorie goal based on current weight
  // For GLP-1 patients: 10-11 calories per pound of body weight for weight loss
  const currentWeight = user.weightLog?.length > 0 
    ? user.weightLog[user.weightLog.length - 1].weight 
    : 180; // default if no weight logged
  const calorieGoal = Math.round(currentWeight * 10.5); // 10.5 cal/lb for moderate deficit
  const carbGoal = Math.round(calorieGoal * 0.35 / 4); // 35% of calories from carbs, 4 cal/g
  const fatGoal = Math.round(calorieGoal * 0.30 / 9); // 30% of calories from fat, 9 cal/g

  const tips = [
    { icon: '🥩', title: 'Protein First', desc: 'Aim for 25-35g protein per meal to preserve muscle' },
    { icon: '💧', title: 'Hydrate Proactively', desc: 'GLP-1 can reduce thirst awareness—set reminders' },
    { icon: '🥬', title: "Don't Skip Fiber", desc: 'Supports digestion, gut health, and satisfaction' },
    { icon: '🍞', title: "Carbs Aren't Evil", desc: 'Include carbs strategically for energy and satisfaction' },
    { icon: '🍽️', title: 'Eat Intentionally', desc: "Low hunger doesn't mean you don't need fuel" },
  ];

  // Four Essential Nutrition Shifts for GLP-1 patients
  const essentialShifts = [
    { number: 1, title: 'Protein Targets', detail: '25-35g per meal minimum', why: 'Muscle preservation' },
    { number: 2, title: 'Proper Meal Timing', detail: 'Eat consistently throughout the week', why: 'Prevents rebound hunger' },
    { number: 3, title: 'Hydration Awareness', detail: '64+ oz daily, set reminders', why: 'GLP-1 reduces thirst signals' },
    { number: 4, title: 'Fiber Intake', detail: '25-30g daily from produce', why: 'Long-term weight maintenance' }
  ];

  const days = ['Today', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Show meal planner setup if no meal plan exists
  if (!user.mealPlanComplete && showMealPlanner) {
    return (
      <MealPlanSetup 
        user={user}
        onComplete={(preferences, mealPlan) => {
          setUser({
            ...user,
            mealPlanComplete: true,
            dietaryPreferences: preferences,
            mealPlan: mealPlan
          });
          setShowMealPlanner(false);
        }}
        onCancel={() => setShowMealPlanner(false)}
      />
    );
  }

  // Show meal plan prompt if no plan exists
  if (!user.mealPlanComplete) {
    return (
      <div style={styles.screenContent} className="fade-in">
        <header style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Nutrition</h1>
          <p style={styles.pageSubtitle}>Your daily fuel tracker</p>
        </header>

        <div style={styles.macroOverview}>
          <MacroCircle label="Protein" current={user.proteinCurrent} goal={user.proteinGoal} color="#4A6741" />
          <MacroCircle label="Fiber" current={user.fiberCurrent} goal={user.fiberGoal} color="#C4956A" />
          <MacroCircle label="Water" current={user.waterCurrent} goal={user.waterGoal} color="#2AABB3" unit="oz" />
        </div>

        <div style={styles.mealPlanPrompt}>
          <div style={styles.mealPlanBadge}>
            <span style={styles.mealPlanBadgeIcon}>✨</span>
            <span style={styles.mealPlanBadgeText}>AI-Powered</span>
          </div>
          
          <div style={styles.mealPlanIllustration}>
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="60" r="55" fill="#E8EDE6"/>
              <circle cx="60" cy="60" r="40" fill="#F5F7F4"/>
              <circle cx="45" cy="50" r="8" fill="#4A6741"/>
              <circle cx="75" cy="50" r="8" fill="#C4956A"/>
              <circle cx="60" cy="75" r="10" fill="#2AABB3"/>
              <path d="M35 40L45 50L35 60" stroke="#4A6741" strokeWidth="2" strokeLinecap="round"/>
              <path d="M85 40L75 50L85 60" stroke="#C4956A" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          
          <h2 style={styles.mealPlanTitle}>Personalized Meal Plans</h2>
          <p style={styles.mealPlanDesc}>
            Get AI-generated meal plans optimized for GLP-1 success—high protein, 
            proper portions, and foods that work with your medication.
          </p>
          
          <div style={styles.mealPlanFeatures}>
            <div style={styles.mealPlanFeature}>
              <span style={styles.mpFeatureIcon}>🎯</span>
              <span style={styles.mpFeatureText}>Tailored to your preferences</span>
            </div>
            <div style={styles.mealPlanFeature}>
              <span style={styles.mpFeatureIcon}>🥗</span>
              <span style={styles.mpFeatureText}>GLP-1 optimized nutrition</span>
            </div>
            <div style={styles.mealPlanFeature}>
              <span style={styles.mpFeatureIcon}>📊</span>
              <span style={styles.mpFeatureText}>Macros calculated for you</span>
            </div>
          </div>
          
          <button style={styles.primaryButton} className="btn-primary" onClick={() => setShowMealPlanner(true)}>
            Create My Meal Plan
          </button>
        </div>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>GLP-1 Nutrition Tips</h3>
          <div style={styles.tipsContainer}>
            {tips.map((tip, idx) => (
              <div key={idx} style={styles.tipCard}>
                <span style={styles.tipIcon}>{tip.icon}</span>
                <div>
                  <h4 style={styles.tipTitle}>{tip.title}</h4>
                  <p style={styles.tipDesc}>{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // Show meal plan
  const todayPlan = user.mealPlan?.weeklyPlan?.[selectedDay] || user.mealPlan?.weeklyPlan?.[0];
  const totalProtein = todayPlan?.meals?.reduce((sum, m) => sum + (m.protein || 0), 0) || Math.round(user.proteinGoal * 0.9);
  const totalCarbs = todayPlan?.meals?.reduce((sum, m) => sum + (m.carbs || 0), 0) || Math.round(carbGoal * 0.8);
  const totalFat = todayPlan?.meals?.reduce((sum, m) => sum + (m.fat || 0), 0) || Math.round(fatGoal * 0.8);
  const totalCalories = todayPlan?.meals?.reduce((sum, m) => sum + (m.calories || 0), 0) || Math.round(calorieGoal * 0.85);

  return (
    <div style={styles.screenContent} className="fade-in">
      <header style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Nutrition</h1>
        <p style={styles.pageSubtitle}>Your personalized meal plan</p>
      </header>

      {/* Main Macros - Protein Emphasized */}
      <div style={styles.macroOverviewEnhanced}>
        {/* Protein - Large and centered */}
        <div style={styles.proteinHighlight}>
          <div style={styles.proteinCircleOuter}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="60" fill="none" stroke="#E8EDE6" strokeWidth="12"/>
              <circle 
                cx="70" cy="70" r="60" fill="none" 
                stroke="#4A6741" strokeWidth="12" strokeLinecap="round"
                strokeDasharray={`${(user.proteinCurrent / user.proteinGoal) * 377} 377`}
                transform="rotate(-90 70 70)"
                className="progress-ring"
              />
            </svg>
            <div style={styles.proteinInner}>
              <span style={styles.proteinValue}>{user.proteinCurrent}</span>
              <span style={styles.proteinUnit}>g</span>
            </div>
          </div>
          <div style={styles.proteinLabel}>Protein</div>
          <div style={styles.proteinGoal}>Goal: {user.proteinGoal}g</div>
        </div>

        {/* Carbs and Fat - smaller, side by side */}
        <div style={styles.secondaryMacros}>
          <div style={styles.secondaryMacroCard}>
            <div style={styles.secondaryMacroCircle}>
              <svg width="70" height="70" viewBox="0 0 70 70">
                <circle cx="35" cy="35" r="28" fill="none" stroke="#F0EBE3" strokeWidth="6"/>
                <circle 
                  cx="35" cy="35" r="28" fill="none" 
                  stroke="#C4956A" strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={`${(totalCarbs / carbGoal) * 176} 176`}
                  transform="rotate(-90 35 35)"
                />
              </svg>
              <span style={styles.secondaryMacroValue}>{totalCarbs}</span>
            </div>
            <span style={styles.secondaryMacroLabel}>Carbs</span>
            <span style={styles.secondaryMacroGoal}>{totalCarbs}g / {carbGoal}g</span>
          </div>
          
          <div style={styles.secondaryMacroCard}>
            <div style={styles.secondaryMacroCircle}>
              <svg width="70" height="70" viewBox="0 0 70 70">
                <circle cx="35" cy="35" r="28" fill="none" stroke="#E8F4F8" strokeWidth="6"/>
                <circle 
                  cx="35" cy="35" r="28" fill="none" 
                  stroke="#2AABB3" strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={`${(totalFat / fatGoal) * 176} 176`}
                  transform="rotate(-90 35 35)"
                />
              </svg>
              <span style={styles.secondaryMacroValue}>{totalFat}</span>
            </div>
            <span style={styles.secondaryMacroLabel}>Fat</span>
            <span style={styles.secondaryMacroGoal}>{totalFat}g / {fatGoal}g</span>
          </div>
        </div>
      </div>

      {/* Day selector */}
      <div style={styles.daySelector}>
        {days.map((day, idx) => (
          <button
            key={idx}
            style={{
              ...styles.daySelectorBtn,
              ...(selectedDay === idx ? styles.daySelectorBtnActive : {})
            }}
            onClick={() => setSelectedDay(idx)}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Calorie info based on weight */}
      <div style={styles.calorieInfoBanner}>
        <span style={styles.calorieInfoIcon}>⚖️</span>
        <div style={styles.calorieInfoContent}>
          <span style={styles.calorieInfoTitle}>Daily Target: {calorieGoal} cal</span>
          <span style={styles.calorieInfoSubtext}>Based on your current weight ({currentWeight} lbs)</span>
        </div>
      </div>

      {/* Daily summary - Protein first and emphasized */}
      <div style={styles.dailySummaryEnhanced}>
        <div style={styles.summaryItemProtein}>
          <span style={styles.summaryValueProtein}>{totalProtein}g</span>
          <span style={styles.summaryLabelProtein}>PROTEIN</span>
        </div>
        <div style={styles.summaryDivider} />
        <div style={styles.summaryItem}>
          <span style={styles.summaryValue}>{totalCarbs}g</span>
          <span style={styles.summaryLabel}>CARBS</span>
        </div>
        <div style={styles.summaryDivider} />
        <div style={styles.summaryItem}>
          <span style={styles.summaryValue}>{totalFat}g</span>
          <span style={styles.summaryLabel}>FAT</span>
        </div>
        <div style={styles.summaryDivider} />
        <div style={styles.summaryItem}>
          <span style={styles.summaryValue}>{totalCalories}</span>
          <span style={styles.summaryLabel}>/ {calorieGoal} CAL</span>
        </div>
      </div>

      {/* Meals */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>{days[selectedDay]}'s Meals</h3>
        </div>
        <div style={styles.mealPlanList}>
          {todayPlan?.meals?.map((meal, idx) => (
            <MealCard key={idx} meal={meal} user={user} setUser={setUser} />
          ))}
        </div>
      </section>

      {/* Snack suggestions */}
      {todayPlan?.snacks && todayPlan.snacks.length > 0 && (
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Snack Ideas</h3>
          <div style={styles.snackList}>
            {todayPlan.snacks.map((snack, idx) => (
              <div key={idx} style={styles.snackCard}>
                <span style={styles.snackEmoji}>{snack.emoji || '🍎'}</span>
                <div style={styles.snackInfo}>
                  <p style={styles.snackName}>{snack.name}</p>
                  <p style={styles.snackMacros}>{snack.calories} cal · {snack.protein}g protein</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Hydration reminder */}
      <div style={styles.hydrationReminder}>
        <span style={styles.hydrationIcon}>💧</span>
        <div style={styles.hydrationContent}>
          <p style={styles.hydrationTitle}>Hydration Reminder</p>
          <p style={styles.hydrationText}>{user.mealPlan?.hydrationTip || 'Drink water 30 minutes before meals to aid digestion'}</p>
        </div>
      </div>

      {/* Edit preferences button */}
      <button 
        style={styles.editPrefsButton}
        onClick={() => {
          setUser({...user, mealPlanComplete: false});
          setShowMealPlanner(true);
        }}
      >
        ✏️ Update Dietary Preferences
      </button>
    </div>
  );
}

// Meal Card Component
function MealCard({ meal, user, setUser }) {
  const [expanded, setExpanded] = useState(false);
  const [logged, setLogged] = useState(false);

  const handleLog = () => {
    setLogged(true);
    setUser({
      ...user,
      proteinCurrent: Math.min(user.proteinGoal, user.proteinCurrent + meal.protein),
      fiberCurrent: Math.min(user.fiberGoal, user.fiberCurrent + meal.fiber)
    });
  };

  return (
    <div style={styles.mealPlanCard} className="card-hover">
      <div style={styles.mealPlanCardHeader} onClick={() => setExpanded(!expanded)}>
        <div style={styles.mealTimeIcon}>
          {meal.type === 'breakfast' && '🌅'}
          {meal.type === 'lunch' && '☀️'}
          {meal.type === 'dinner' && '🌙'}
          {meal.type === 'snack' && '🍎'}
        </div>
        <div style={styles.mealPlanCardInfo}>
          <p style={styles.mealPlanType}>{meal.type?.charAt(0).toUpperCase() + meal.type?.slice(1)}</p>
          <h4 style={styles.mealPlanName}>{meal.name}</h4>
          <p style={styles.mealPlanMacros}>
            {meal.calories} cal · {meal.protein}g protein · {meal.fiber}g fiber
          </p>
        </div>
        <div style={styles.mealExpandIcon}>{expanded ? '−' : '+'}</div>
      </div>
      
      {expanded && (
        <div style={styles.mealPlanDetails}>
          {meal.description && (
            <p style={styles.mealDescription}>{meal.description}</p>
          )}
          
          {meal.ingredients && (
            <div style={styles.ingredientsList}>
              <p style={styles.ingredientsTitle}>Ingredients:</p>
              {meal.ingredients.map((ing, idx) => (
                <p key={idx} style={styles.ingredientItem}>• {ing}</p>
              ))}
            </div>
          )}
          
          {meal.instructions && (
            <div style={styles.instructionsList}>
              <p style={styles.instructionsTitle}>Quick Prep:</p>
              <p style={styles.instructionsText}>{meal.instructions}</p>
            </div>
          )}

          {meal.glp1Tip && (
            <div style={styles.glp1TipBox}>
              <span style={styles.glp1TipIcon}>💡</span>
              <p style={styles.glp1TipText}>{meal.glp1Tip}</p>
            </div>
          )}

          <button 
            style={{
              ...styles.logMealButton,
              ...(logged ? styles.logMealButtonLogged : {})
            }}
            onClick={handleLog}
            disabled={logged}
          >
            {logged ? '✓ Logged' : 'Log This Meal'}
          </button>
        </div>
      )}
    </div>
  );
}

// Meal Plan Setup Component
function MealPlanSetup({ user, onComplete, onCancel }) {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    dietType: null,
    allergies: [],
    dislikes: [],
    cuisines: [],
    cookingTime: null,
    mealsPerDay: 3,
    snacksPerDay: 1,
    calorieTarget: null,
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const dietTypes = [
    { id: 'omnivore', name: 'Omnivore', icon: '🍖', desc: 'Eat everything' },
    { id: 'pescatarian', name: 'Pescatarian', icon: '🐟', desc: 'Fish & seafood, no meat' },
    { id: 'vegetarian', name: 'Vegetarian', icon: '🥬', desc: 'No meat or fish' },
    { id: 'vegan', name: 'Vegan', icon: '🌱', desc: 'No animal products' },
    { id: 'keto', name: 'Keto', icon: '🥑', desc: 'Very low carb' },
    { id: 'mediterranean', name: 'Mediterranean', icon: '🫒', desc: 'Heart-healthy focus' },
  ];

  const allergyOptions = [
    { id: 'dairy', name: 'Dairy', icon: '🥛' },
    { id: 'gluten', name: 'Gluten', icon: '🌾' },
    { id: 'nuts', name: 'Tree Nuts', icon: '🥜' },
    { id: 'peanuts', name: 'Peanuts', icon: '🥜' },
    { id: 'eggs', name: 'Eggs', icon: '🥚' },
    { id: 'soy', name: 'Soy', icon: '🫘' },
    { id: 'shellfish', name: 'Shellfish', icon: '🦐' },
    { id: 'fish', name: 'Fish', icon: '🐟' },
  ];

  const cuisineOptions = [
    { id: 'american', name: 'American', icon: '🍔' },
    { id: 'mexican', name: 'Mexican', icon: '🌮' },
    { id: 'italian', name: 'Italian', icon: '🍝' },
    { id: 'asian', name: 'Asian', icon: '🍜' },
    { id: 'mediterranean', name: 'Mediterranean', icon: '🥙' },
    { id: 'indian', name: 'Indian', icon: '🍛' },
    { id: 'japanese', name: 'Japanese', icon: '🍱' },
    { id: 'thai', name: 'Thai', icon: '🍲' },
  ];

  const cookingTimeOptions = [
    { id: 'minimal', name: 'Minimal (< 15 min)', icon: 'âš¡' },
    { id: 'quick', name: 'Quick (15-30 min)', icon: '🕐' },
    { id: 'moderate', name: 'Moderate (30-45 min)', icon: '🕑' },
    { id: 'any', name: 'Any time is fine', icon: '👨‍🍳' },
  ];

  const toggleSelection = (array, item) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    }
    return [...array, item];
  };

  const generateMealPlan = async () => {
    setIsGenerating(true);

    // Calculate calorie goal based on patient's current weight
    // For GLP-1 patients: 10-11 calories per pound of body weight for weight loss
    const currentWeight = user.weightLog?.length > 0 
      ? user.weightLog[user.weightLog.length - 1].weight 
      : 180; // default if no weight logged
    const calorieTarget = Math.round(currentWeight * 10.5); // 10.5 cal/lb for moderate deficit
    const proteinTarget = Math.round(currentWeight * 0.7); // 0.7g protein per lb for muscle preservation
    const minCalories = Math.max(1200, calorieTarget - 200); // Don't go below 1200
    const maxCalories = calorieTarget + 100;

    const prefsDescription = `
Diet Type: ${preferences.dietType || 'Omnivore'}
Allergies/Restrictions: ${preferences.allergies.length > 0 ? preferences.allergies.join(', ') : 'None'}
Food Dislikes: ${preferences.dislikes.length > 0 ? preferences.dislikes.join(', ') : 'None specified'}
Preferred Cuisines: ${preferences.cuisines.length > 0 ? preferences.cuisines.join(', ') : 'Any'}
Cooking Time Preference: ${preferences.cookingTime || 'Any'}
Meals Per Day: ${preferences.mealsPerDay}
Snacks Per Day: ${preferences.snacksPerDay}
Current Weight: ${currentWeight} lbs
Daily Calorie Target: ${calorieTarget} calories (${minCalories}-${maxCalories} range)
Daily Protein Target: ${proteinTarget}g minimum
    `.trim();

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          messages: [{
            role: 'user',
            content: `You are a nutrition AI creating a personalized 7-day meal plan for a GLP-1 weight loss patient. This person is on medication like Ozempic, Wegovy, or Mounjaro.

Patient Info & Dietary Preferences:
${prefsDescription}

CRITICAL GLP-1 NUTRITION REQUIREMENTS:
1. HIGH PROTEIN: ${Math.round(proteinTarget / preferences.mealsPerDay)}g+ protein per meal minimum (${proteinTarget}g daily - crucial for muscle preservation during weight loss)
2. CALORIE TARGET: ${calorieTarget} calories daily (calculated from patient's current weight of ${currentWeight} lbs at 10.5 cal/lb)
3. MODERATE FIBER: 25-30g daily total (helps with satiety but too much can cause GI issues with GLP-1)
4. SMALLER PORTIONS: GLP-1 reduces appetite, so portions should be satisfying but not overwhelming
5. HYDRATION FOCUS: Include water-rich foods; GLP-1 can reduce thirst sensation
6. AVOID: Greasy/fried foods, very high-fat meals, excessive sugar (can cause dumping syndrome)
7. PROTEIN FIRST: Structure meals to eat protein first, then vegetables, then carbs

Create a JSON response with this structure (respond ONLY with JSON, no markdown):
{
  "weeklyPlan": [
    {
      "day": "Monday",
      "meals": [
        {
          "type": "breakfast",
          "name": "Meal Name",
          "description": "Brief appetizing description",
          "calories": 350,
          "protein": 30,
          "carbs": 25,
          "fat": 12,
          "fiber": 6,
          "ingredients": ["ingredient 1 with amount", "ingredient 2 with amount"],
          "instructions": "Brief prep instructions (2-3 sentences)",
          "glp1Tip": "Specific tip for eating this meal on GLP-1",
          "prepTime": "15 min"
        }
      ],
      "snacks": [
        {
          "name": "Snack name",
          "emoji": "🍎",
          "calories": 150,
          "protein": 10,
          "description": "Brief description"
        }
      ],
      "dailyTotals": {
        "calories": ${calorieTarget},
        "protein": ${proteinTarget},
        "fiber": 28
      }
    }
  ],
  "hydrationTip": "Personalized hydration advice for this person",
  "weeklyTips": ["tip 1 for success", "tip 2", "tip 3"],
  "groceryCategories": {
    "proteins": ["item1", "item2"],
    "produce": ["item1", "item2"],
    "dairy": ["item1", "item2"],
    "pantry": ["item1", "item2"]
  }
}

Make meals delicious, varied, and realistic to prepare. Include a mix of simple and slightly more elaborate options. Each day should have ${preferences.mealsPerDay} meals and ${preferences.snacksPerDay} snack options. Target ${minCalories}-${maxCalories} calories daily with at least ${proteinTarget}g protein. Distribute calories appropriately across meals.`
          }]
        })
      });

      const data = await response.json();
      const planText = data.content.map(c => c.text || '').join('');
      
      let mealPlan;
      try {
        const cleanJson = planText.replace(/```json|```/g, '').trim();
        mealPlan = JSON.parse(cleanJson);
      } catch {
        mealPlan = getDefaultMealPlan(preferences, calorieTarget, proteinTarget);
      }

      onComplete(preferences, mealPlan);

    } catch (error) {
      console.error('Meal plan generation error:', error);
      onComplete(preferences, getDefaultMealPlan(preferences, calorieTarget, proteinTarget));
    }
  };

  const getDefaultMealPlan = (prefs, calorieTarget = 1500, proteinTarget = 110) => {
    // Distribute calories across meals
    const mealsPerDay = prefs.mealsPerDay || 3;
    const snacksPerDay = prefs.snacksPerDay || 1;
    const snackCalories = snacksPerDay * 120;
    const mealCalories = Math.round((calorieTarget - snackCalories) / mealsPerDay);
    const mealProtein = Math.round(proteinTarget / mealsPerDay);
    
    return {
    weeklyPlan: [
      {
        day: 'Monday',
        meals: [
          {
            type: 'breakfast',
            name: 'Greek Yogurt Protein Bowl',
            description: 'Creamy Greek yogurt topped with berries and a sprinkle of nuts',
            calories: Math.round(mealCalories * 0.85),
            protein: mealProtein,
            carbs: 28,
            fat: 12,
            fiber: 5,
            ingredients: ['1 cup plain Greek yogurt (2%)', '1/2 cup mixed berries', '1 tbsp almond butter', '1 tbsp chia seeds'],
            instructions: 'Add yogurt to a bowl. Top with berries, drizzle almond butter, and sprinkle chia seeds.',
            glp1Tip: 'Eat the yogurt slowly—protein-rich foods help you feel satisfied longer on GLP-1.',
            prepTime: '5 min'
          },
          {
            type: 'lunch',
            name: 'Grilled Chicken Salad',
            description: 'Tender grilled chicken over fresh greens with avocado',
            calories: mealCalories,
            protein: Math.round(mealProtein * 1.15),
            carbs: 15,
            fat: 24,
            fiber: 8,
            ingredients: ['5 oz grilled chicken breast', '3 cups mixed greens', '1/2 avocado', '1/4 cup cherry tomatoes', '2 tbsp olive oil vinaigrette'],
            instructions: 'Arrange greens on plate. Top with sliced chicken, avocado, and tomatoes. Drizzle with dressing.',
            glp1Tip: 'Start with the chicken bites first to prioritize protein absorption.',
            prepTime: '15 min'
          },
          {
            type: 'dinner',
            name: 'Baked Salmon with Vegetables',
            description: 'Flaky salmon fillet with roasted asparagus and quinoa',
            calories: Math.round(mealCalories * 1.15),
            protein: Math.round(mealProtein * 1.25),
            carbs: 28,
            fat: 22,
            fiber: 6,
            ingredients: ['6 oz salmon fillet', '1 cup asparagus', '1/2 cup cooked quinoa', '1 tbsp olive oil', 'Lemon, garlic, herbs'],
            instructions: 'Season salmon and bake at 400°F for 12-15 min. Roast asparagus alongside. Serve over quinoa.',
            glp1Tip: 'If you feel full quickly, save the quinoa for later—prioritize the protein and veggies.',
            prepTime: '25 min'
          }
        ],
        snacks: [
          { name: 'Cottage cheese with cucumber', emoji: '🥒', calories: 120, protein: 14, description: '1/2 cup cottage cheese with sliced cucumber' },
          { name: 'Turkey roll-ups', emoji: '🦃', calories: 100, protein: 12, description: '3 slices turkey wrapped around cheese stick' }
        ],
        dailyTotals: { calories: calorieTarget, protein: proteinTarget, fiber: 19 }
      },
      {
        day: 'Tuesday',
        meals: [
          {
            type: 'breakfast',
            name: 'Veggie Egg White Scramble',
            description: 'Fluffy egg whites with spinach, tomatoes, and feta',
            calories: Math.round(mealCalories * 0.7),
            protein: mealProtein,
            carbs: 12,
            fat: 14,
            fiber: 4,
            ingredients: ['5 egg whites', '1 whole egg', '1 cup spinach', '1/4 cup tomatoes', '2 tbsp feta cheese'],
            instructions: 'Sauté spinach and tomatoes. Add whisked eggs and scramble. Top with feta.',
            glp1Tip: 'Eggs are easy to digest on GLP-1—a great breakfast protein source.',
            prepTime: '10 min'
          },
          {
            type: 'lunch',
            name: 'Turkey Lettuce Wraps',
            description: 'Seasoned ground turkey in crisp lettuce cups',
            calories: mealCalories,
            protein: Math.round(mealProtein * 1.1),
            carbs: 18,
            fat: 18,
            fiber: 5,
            ingredients: ['5 oz ground turkey', 'Butter lettuce leaves', '1/4 cup diced bell peppers', 'Asian sauce', 'Green onions'],
            instructions: 'Cook seasoned turkey. Spoon into lettuce cups with peppers and sauce.',
            glp1Tip: 'Lettuce wraps are perfect for GLP-1—light but protein-packed.',
            prepTime: '15 min'
          },
          {
            type: 'dinner',
            name: 'Shrimp Stir-Fry',
            description: 'Garlic shrimp with colorful vegetables over cauliflower rice',
            calories: Math.round(mealCalories * 1.1),
            protein: Math.round(mealProtein * 1.2),
            carbs: 22,
            fat: 20,
            fiber: 7,
            ingredients: ['6 oz shrimp', '2 cups mixed stir-fry vegetables', '1 cup cauliflower rice', '1 tbsp sesame oil', 'Garlic, ginger, soy sauce'],
            instructions: 'Stir-fry shrimp with garlic and ginger. Add vegetables. Serve over cauliflower rice.',
            glp1Tip: 'Shrimp is lean and easy to digest—eat protein first, then veggies.',
            prepTime: '20 min'
          }
        ],
        snacks: [
          { name: 'Hard-boiled eggs', emoji: '🥚', calories: 140, protein: 12, description: '2 hard-boiled eggs with everything seasoning' },
          { name: 'Edamame', emoji: '🫛', calories: 120, protein: 11, description: '1/2 cup shelled edamame with sea salt' }
        ],
        dailyTotals: { calories: calorieTarget, protein: proteinTarget, fiber: 16 }
      }
    ],
    hydrationTip: 'Set a timer to drink 8oz of water every 2 hours. GLP-1 can reduce thirst signals, so stay proactive!',
    weeklyTips: [
      'Eat protein first at every meal to maximize satisfaction',
      'Take small bites and chew thoroughly—this helps with GLP-1 digestion',
      'If you feel full, stop eating—save the rest for later'
    ],
    groceryCategories: {
      proteins: ['Chicken breast', 'Salmon', 'Shrimp', 'Ground turkey', 'Greek yogurt', 'Eggs', 'Cottage cheese'],
      produce: ['Mixed greens', 'Spinach', 'Asparagus', 'Bell peppers', 'Tomatoes', 'Avocado', 'Berries'],
      dairy: ['Feta cheese', 'String cheese'],
      pantry: ['Quinoa', 'Cauliflower rice', 'Olive oil', 'Chia seeds', 'Almond butter']
    }
  };
  };

  // Step 1: Diet Type
  if (step === 1) {
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.mpSetupHeader}>
          <button style={styles.backButton} onClick={onCancel}>← Back</button>
          <div style={styles.mpProgressDots}>
            {[1,2,3,4].map(s => (
              <div key={s} style={{...styles.mpProgressDot, ...(s <= step ? styles.mpProgressDotActive : {})}} />
            ))}
          </div>
        </div>

        <h2 style={styles.mpStepTitle}>What's your diet style?</h2>
        <p style={styles.mpStepSubtitle}>We'll customize your meals accordingly</p>

        <div style={styles.mpOptionsGrid}>
          {dietTypes.map(diet => (
            <div
              key={diet.id}
              style={{
                ...styles.mpOptionCard,
                ...(preferences.dietType === diet.id ? styles.mpOptionCardSelected : {})
              }}
              onClick={() => setPreferences({...preferences, dietType: diet.id})}
            >
              <span style={styles.mpOptionIcon}>{diet.icon}</span>
              <p style={styles.mpOptionName}>{diet.name}</p>
              <p style={styles.mpOptionDesc}>{diet.desc}</p>
            </div>
          ))}
        </div>

        <button 
          style={{...styles.primaryButton, opacity: preferences.dietType ? 1 : 0.5}}
          className="btn-primary"
          disabled={!preferences.dietType}
          onClick={() => setStep(2)}
        >
          Continue
        </button>
      </div>
    );
  }

  // Step 2: Allergies
  if (step === 2) {
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.mpSetupHeader}>
          <button style={styles.backButton} onClick={() => setStep(1)}>← Back</button>
          <div style={styles.mpProgressDots}>
            {[1,2,3,4].map(s => (
              <div key={s} style={{...styles.mpProgressDot, ...(s <= step ? styles.mpProgressDotActive : {})}} />
            ))}
          </div>
        </div>

        <h2 style={styles.mpStepTitle}>Any allergies or restrictions?</h2>
        <p style={styles.mpStepSubtitle}>Select all that apply (or skip if none)</p>

        <div style={styles.mpChipGrid}>
          {allergyOptions.map(allergy => (
            <div
              key={allergy.id}
              style={{
                ...styles.mpChip,
                ...(preferences.allergies.includes(allergy.id) ? styles.mpChipSelected : {})
              }}
              onClick={() => setPreferences({
                ...preferences, 
                allergies: toggleSelection(preferences.allergies, allergy.id)
              })}
            >
              <span>{allergy.icon}</span>
              <span>{allergy.name}</span>
            </div>
          ))}
        </div>

        <div style={styles.mpDislikesSection}>
          <p style={styles.mpDislikesLabel}>Any foods you dislike? (optional)</p>
          <input
            type="text"
            placeholder="e.g., mushrooms, cilantro, olives..."
            style={styles.mpTextInput}
            onBlur={(e) => {
              const dislikes = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
              setPreferences({...preferences, dislikes});
            }}
          />
        </div>

        <button style={styles.primaryButton} className="btn-primary" onClick={() => setStep(3)}>
          Continue
        </button>
      </div>
    );
  }

  // Step 3: Cuisines & Cooking Time
  if (step === 3) {
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.mpSetupHeader}>
          <button style={styles.backButton} onClick={() => setStep(2)}>← Back</button>
          <div style={styles.mpProgressDots}>
            {[1,2,3,4].map(s => (
              <div key={s} style={{...styles.mpProgressDot, ...(s <= step ? styles.mpProgressDotActive : {})}} />
            ))}
          </div>
        </div>

        <h2 style={styles.mpStepTitle}>What cuisines do you enjoy?</h2>
        <p style={styles.mpStepSubtitle}>Select your favorites for more variety</p>

        <div style={styles.mpChipGrid}>
          {cuisineOptions.map(cuisine => (
            <div
              key={cuisine.id}
              style={{
                ...styles.mpChip,
                ...(preferences.cuisines.includes(cuisine.id) ? styles.mpChipSelected : {})
              }}
              onClick={() => setPreferences({
                ...preferences, 
                cuisines: toggleSelection(preferences.cuisines, cuisine.id)
              })}
            >
              <span>{cuisine.icon}</span>
              <span>{cuisine.name}</span>
            </div>
          ))}
        </div>

        <h3 style={{...styles.mpStepTitle, marginTop: '24px', fontSize: '18px'}}>How much time for cooking?</h3>
        
        <div style={styles.mpCookingOptions}>
          {cookingTimeOptions.map(option => (
            <div
              key={option.id}
              style={{
                ...styles.mpCookingOption,
                ...(preferences.cookingTime === option.id ? styles.mpCookingOptionSelected : {})
              }}
              onClick={() => setPreferences({...preferences, cookingTime: option.id})}
            >
              <span style={styles.mpCookingIcon}>{option.icon}</span>
              <span style={styles.mpCookingName}>{option.name}</span>
            </div>
          ))}
        </div>

        <button 
          style={{...styles.primaryButton, opacity: preferences.cookingTime ? 1 : 0.5}}
          className="btn-primary"
          disabled={!preferences.cookingTime}
          onClick={() => setStep(4)}
        >
          Continue
        </button>
      </div>
    );
  }

  // Step 4: Meals per day & Generate
  if (step === 4) {
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.mpSetupHeader}>
          <button style={styles.backButton} onClick={() => setStep(3)}>← Back</button>
          <div style={styles.mpProgressDots}>
            {[1,2,3,4].map(s => (
              <div key={s} style={{...styles.mpProgressDot, ...(s <= step ? styles.mpProgressDotActive : {})}} />
            ))}
          </div>
        </div>

        <h2 style={styles.mpStepTitle}>Almost done!</h2>
        <p style={styles.mpStepSubtitle}>A few more preferences</p>

        <div style={styles.mpMealCountSection}>
          <div style={styles.mpMealCountRow}>
            <div>
              <p style={styles.mpMealCountLabel}>Meals per day</p>
              <p style={styles.mpMealCountHint}>Most GLP-1 patients do well with 2-3</p>
            </div>
            <div style={styles.mpCounter}>
              <button 
                style={styles.mpCounterBtn}
                onClick={() => setPreferences({...preferences, mealsPerDay: Math.max(2, preferences.mealsPerDay - 1)})}
              >−</button>
              <span style={styles.mpCounterValue}>{preferences.mealsPerDay}</span>
              <button 
                style={styles.mpCounterBtn}
                onClick={() => setPreferences({...preferences, mealsPerDay: Math.min(4, preferences.mealsPerDay + 1)})}
              >+</button>
            </div>
          </div>

          <div style={styles.mpMealCountRow}>
            <div>
              <p style={styles.mpMealCountLabel}>Snacks per day</p>
              <p style={styles.mpMealCountHint}>Protein-rich snacks help maintain energy</p>
            </div>
            <div style={styles.mpCounter}>
              <button 
                style={styles.mpCounterBtn}
                onClick={() => setPreferences({...preferences, snacksPerDay: Math.max(0, preferences.snacksPerDay - 1)})}
              >−</button>
              <span style={styles.mpCounterValue}>{preferences.snacksPerDay}</span>
              <button 
                style={styles.mpCounterBtn}
                onClick={() => setPreferences({...preferences, snacksPerDay: Math.min(3, preferences.snacksPerDay + 1)})}
              >+</button>
            </div>
          </div>
        </div>

        <div style={styles.mpSummaryBox}>
          <h4 style={styles.mpSummaryTitle}>Your Preferences Summary</h4>
          <p style={styles.mpSummaryItem}>🍽️ Diet: {dietTypes.find(d => d.id === preferences.dietType)?.name || 'Omnivore'}</p>
          <p style={styles.mpSummaryItem}>âš ️ Allergies: {preferences.allergies.length > 0 ? preferences.allergies.join(', ') : 'None'}</p>
          <p style={styles.mpSummaryItem}>🌍 Cuisines: {preferences.cuisines.length > 0 ? preferences.cuisines.slice(0, 3).join(', ') : 'Any'}</p>
          <p style={styles.mpSummaryItem}>⏱️ Cooking: {cookingTimeOptions.find(c => c.id === preferences.cookingTime)?.name || 'Any'}</p>
        </div>

        {isGenerating ? (
          <div style={styles.mpGenerating}>
            <div style={styles.mpGeneratingSpinner} className="breathe">🤖</div>
            <p style={styles.mpGeneratingText}>Creating your personalized meal plan...</p>
            <p style={styles.mpGeneratingSubtext}>Optimizing for GLP-1 nutrition guidelines</p>
          </div>
        ) : (
          <button style={styles.primaryButton} className="btn-primary" onClick={generateMealPlan}>
            Generate My Meal Plan
          </button>
        )}
      </div>
    );
  }

  return null;
}

// Macro Circle Component
function MacroCircle({ label, current, goal, color, unit = 'g' }) {
  const percentage = Math.round((current / goal) * 100);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={styles.macroCircle}>
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle cx="45" cy="45" r={radius} fill="none" stroke="#F0EFED" strokeWidth="6" />
        <circle
          cx="45" cy="45" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 45 45)"
          className="progress-ring"
        />
      </svg>
      <div style={styles.macroCircleContent}>
        <span style={styles.macroValue}>{current}</span>
        <span style={styles.macroUnit}>{unit}</span>
      </div>
      <p style={styles.macroLabel}>{label}</p>
    </div>
  );
}

// ==================== WORKOUT PLAYER ====================
function WorkoutPlayer({ workout, user, onComplete, onExit }) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const [workoutComplete, setWorkoutComplete] = useState(false);

  // Exercise video database - YouTube embed IDs for common exercises
  const exerciseVideos = {
    // Beginner exercises
    'wall push-ups': 'a6YHbXD2XlU',
    'wall push-up': 'a6YHbXD2XlU',
    'chair squats': 'MVKvgiM9vWQ',
    'chair squat': 'MVKvgiM9vWQ',
    'standing marches': 'bNskaOqYtb4',
    'standing march': 'bNskaOqYtb4',
    'arm circles': 'UJbIQxMVL6E',
    'seated leg lifts': 'c4Ncm4ZsGzQ',
    'wall slides': 'e_-tIeJG14g',
    
    // Intermediate exercises
    'push-ups': 'IODxDxX7oi4',
    'push-up': 'IODxDxX7oi4',
    'pushups': 'IODxDxX7oi4',
    'squats': 'aclHkVaku9U',
    'squat': 'aclHkVaku9U',
    'bodyweight squats': 'aclHkVaku9U',
    'lunges': 'QOVaHwm-Q6U',
    'lunge': 'QOVaHwm-Q6U',
    'plank': 'pSHjTRCQxIw',
    'planks': 'pSHjTRCQxIw',
    'glute bridges': 'OUgsJ8-Vi0E',
    'glute bridge': 'OUgsJ8-Vi0E',
    'bird dogs': 'wiFNA3sqjCA',
    'bird dog': 'wiFNA3sqjCA',
    'mountain climbers': 'nmwgirgXLYM',
    'mountain climber': 'nmwgirgXLYM',
    'jumping jacks': 'c4DAnQ6DtF8',
    'burpees': 'dZgVxmf6jkA',
    'burpee': 'dZgVxmf6jkA',
    
    // Dumbbell exercises
    'dumbbell rows': 'pYcpY20QaE8',
    'dumbbell row': 'pYcpY20QaE8',
    'bent over rows': 'pYcpY20QaE8',
    'dumbbell press': 'VmB1G1K7v94',
    'shoulder press': 'qEwKCR5JCog',
    'bicep curls': 'ykJmrZ5v0Oo',
    'bicep curl': 'ykJmrZ5v0Oo',
    'tricep extensions': 'nRiJVZDpdL0',
    'tricep extension': 'nRiJVZDpdL0',
    'goblet squats': 'MeIiIdhvXT4',
    'goblet squat': 'MeIiIdhvXT4',
    'deadlifts': '1ZXobu7JvvE',
    'deadlift': '1ZXobu7JvvE',
    'romanian deadlifts': 'jEy_czb3RKA',
    'lateral raises': '3VcKaXpzqRo',
    'lateral raise': '3VcKaXpzqRo',
    
    // Resistance band exercises
    'band pull aparts': 'JObYtU7Y7ag',
    'band pull apart': 'JObYtU7Y7ag',
    'band rows': 'xQNrFHEMhI4',
    'band squats': 'ph3pddpKzzQ',
    
    // Core exercises
    'crunches': '5ER5Of4MOPI',
    'crunch': '5ER5Of4MOPI',
    'russian twists': 'wkD8rjkodUI',
    'russian twist': 'wkD8rjkodUI',
    'leg raises': 'JB2oyawG9KI',
    'dead bugs': 'g_BYB0R-4Ts',
    'dead bug': 'g_BYB0R-4Ts',
    'side planks': 'K2VljzCC16g',
    'side plank': 'K2VljzCC16g',
    
    // Stretching
    'cat cow': 'kqnua4rHVVA',
    'cat-cow': 'kqnua4rHVVA',
    'hip flexor stretch': '0Y6hQrGR3nk',
    'hamstring stretch': 'g-3Gorz5xEA',
    'quad stretch': 'JllLD3uqXrg',
    'shoulder stretch': 'SEdqd1n0cvg',
    'child pose': '2MJvjzUafy8',
    "child's pose": '2MJvjzUafy8',
    
    // Default fallback
    'default': 'IODxDxX7oi4'
  };

  const exercises = workout?.exercises || [
    { name: 'Wall Push-ups', sets: 2, reps: 10, notes: 'Keep core engaged' },
    { name: 'Chair Squats', sets: 2, reps: 12, notes: 'Go as low as comfortable' },
    { name: 'Standing Marches', sets: 2, reps: 20, notes: 'Lift knees high' }
  ];

  const currentExercise = exercises[currentExerciseIndex];
  const totalSets = parseInt(currentExercise?.sets) || 3;
  const reps = currentExercise?.reps || 10;

  // Get video ID for current exercise
  const getVideoId = (exerciseName) => {
    const name = exerciseName?.toLowerCase() || '';
    // Try exact match first
    if (exerciseVideos[name]) return exerciseVideos[name];
    // Try partial match
    for (const [key, value] of Object.entries(exerciseVideos)) {
      if (name.includes(key) || key.includes(name)) return value;
    }
    return exerciseVideos['default'];
  };

  const videoId = getVideoId(currentExercise?.name);

  // Rest timer
  useEffect(() => {
    let interval;
    if (isResting && restTime > 0 && !isPaused) {
      interval = setInterval(() => {
        setRestTime(prev => prev - 1);
      }, 1000);
    } else if (isResting && restTime === 0) {
      setIsResting(false);
    }
    return () => clearInterval(interval);
  }, [isResting, restTime, isPaused]);

  const completeSet = () => {
    if (currentSet < totalSets) {
      // More sets to do
      setCurrentSet(currentSet + 1);
      setIsResting(true);
      setRestTime(45); // 45 second rest
    } else {
      // Move to next exercise
      if (currentExerciseIndex < exercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCurrentSet(1);
        setIsResting(true);
        setRestTime(60); // 60 second rest between exercises
      } else {
        // Workout complete!
        setWorkoutComplete(true);
      }
    }
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTime(0);
  };

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
      setCurrentSet(1);
      setIsResting(false);
    }
  };

  const nextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSet(1);
      setIsResting(false);
    }
  };

  // Workout complete screen
  if (workoutComplete) {
    return (
      <div style={workoutPlayerStyles.container}>
        <div style={workoutPlayerStyles.completeScreen}>
          <div style={workoutPlayerStyles.completeIcon}>🎉</div>
          <h1 style={workoutPlayerStyles.completeTitle}>Workout Complete!</h1>
          <p style={workoutPlayerStyles.completeSubtitle}>Great job! You finished all {exercises.length} exercises.</p>
          
          <div style={workoutPlayerStyles.statsGrid}>
            <div style={workoutPlayerStyles.statCard}>
              <span style={workoutPlayerStyles.statValue}>{exercises.length}</span>
              <span style={workoutPlayerStyles.statLabel}>Exercises</span>
            </div>
            <div style={workoutPlayerStyles.statCard}>
              <span style={workoutPlayerStyles.statValue}>{exercises.reduce((sum, ex) => sum + (parseInt(ex.sets) || 3), 0)}</span>
              <span style={workoutPlayerStyles.statLabel}>Total Sets</span>
            </div>
            <div style={workoutPlayerStyles.statCard}>
              <span style={workoutPlayerStyles.statValue}>+100</span>
              <span style={workoutPlayerStyles.statLabel}>Points</span>
            </div>
          </div>

          <button style={workoutPlayerStyles.primaryButton} onClick={onComplete}>
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={workoutPlayerStyles.container}>
      {/* Header */}
      <div style={workoutPlayerStyles.header}>
        <button style={workoutPlayerStyles.backButton} onClick={onExit}>
          ← Exit
        </button>
        <div style={workoutPlayerStyles.progress}>
          <span style={workoutPlayerStyles.progressText}>
            Exercise {currentExerciseIndex + 1} of {exercises.length}
          </span>
          <div style={workoutPlayerStyles.progressBar}>
            <div 
              style={{
                ...workoutPlayerStyles.progressFill,
                width: `${((currentExerciseIndex + 1) / exercises.length) * 100}%`
              }}
            />
          </div>
        </div>
        <button 
          style={workoutPlayerStyles.toggleVideoBtn}
          onClick={() => setShowVideo(!showVideo)}
        >
          {showVideo ? '📺' : '📺'}
        </button>
      </div>

      {/* Video Section */}
      {showVideo && !isResting && (
        <div style={workoutPlayerStyles.videoContainer}>
          <iframe
            style={workoutPlayerStyles.video}
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`}
            title={currentExercise?.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <div style={workoutPlayerStyles.videoOverlay}>
            <span style={workoutPlayerStyles.videoLabel}>📹 Demo Video</span>
          </div>
        </div>
      )}

      {/* Rest Timer */}
      {isResting && (
        <div style={workoutPlayerStyles.restContainer}>
          <div style={workoutPlayerStyles.restCircle}>
            <span style={workoutPlayerStyles.restTime}>{restTime}</span>
            <span style={workoutPlayerStyles.restLabel}>seconds</span>
          </div>
          <h2 style={workoutPlayerStyles.restTitle}>Rest Time</h2>
          <p style={workoutPlayerStyles.restSubtitle}>
            {currentSet <= totalSets ? `Get ready for set ${currentSet}` : `Next: ${exercises[currentExerciseIndex + 1]?.name || 'Finish'}`}
          </p>
          <button style={workoutPlayerStyles.skipButton} onClick={skipRest}>
            Skip Rest →
          </button>
        </div>
      )}

      {/* Exercise Info */}
      <div style={workoutPlayerStyles.exerciseInfo}>
        <h1 style={workoutPlayerStyles.exerciseName}>{currentExercise?.name}</h1>
        
        <div style={workoutPlayerStyles.setsReps}>
          <div style={workoutPlayerStyles.setIndicator}>
            <span style={workoutPlayerStyles.setLabel}>Set</span>
            <span style={workoutPlayerStyles.setNumber}>{currentSet} / {totalSets}</span>
          </div>
          <div style={workoutPlayerStyles.repIndicator}>
            <span style={workoutPlayerStyles.repLabel}>Reps</span>
            <span style={workoutPlayerStyles.repNumber}>{reps}</span>
          </div>
        </div>

        {currentExercise?.notes && (
          <div style={workoutPlayerStyles.tips}>
            <span style={workoutPlayerStyles.tipsIcon}>💡</span>
            <span style={workoutPlayerStyles.tipsText}>{currentExercise.notes}</span>
          </div>
        )}

        {/* Set Progress Dots */}
        <div style={workoutPlayerStyles.setDots}>
          {Array.from({ length: totalSets }).map((_, idx) => (
            <div 
              key={idx}
              style={{
                ...workoutPlayerStyles.setDot,
                backgroundColor: idx < currentSet - 1 ? '#4A6741' : idx === currentSet - 1 ? '#2AABB3' : '#E0E0E0'
              }}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div style={workoutPlayerStyles.controls}>
        <button 
          style={workoutPlayerStyles.navButton}
          onClick={previousExercise}
          disabled={currentExerciseIndex === 0}
        >
          ← Prev
        </button>
        
        {!isResting && (
          <button style={workoutPlayerStyles.completeSetBtn} onClick={completeSet}>
            ✓ Complete Set
          </button>
        )}

        <button 
          style={workoutPlayerStyles.navButton}
          onClick={nextExercise}
          disabled={currentExerciseIndex === exercises.length - 1}
        >
          Next →
        </button>
      </div>

      {/* Exercise List Preview */}
      <div style={workoutPlayerStyles.exerciseList}>
        <h4 style={workoutPlayerStyles.listTitle}>Exercises</h4>
        <div style={workoutPlayerStyles.listScroll}>
          {exercises.map((ex, idx) => (
            <div 
              key={idx}
              style={{
                ...workoutPlayerStyles.listItem,
                backgroundColor: idx === currentExerciseIndex ? '#E8EDE6' : 'transparent',
                opacity: idx < currentExerciseIndex ? 0.5 : 1
              }}
              onClick={() => {
                setCurrentExerciseIndex(idx);
                setCurrentSet(1);
                setIsResting(false);
              }}
            >
              <span style={{
                ...workoutPlayerStyles.listNumber,
                backgroundColor: idx < currentExerciseIndex ? '#4A6741' : idx === currentExerciseIndex ? '#2AABB3' : '#E0E0E0',
                color: idx <= currentExerciseIndex ? '#FFFFFF' : '#666666'
              }}>
                {idx < currentExerciseIndex ? '✓' : idx + 1}
              </span>
              <span style={workoutPlayerStyles.listName}>{ex.name}</span>
              <span style={workoutPlayerStyles.listSets}>{ex.sets}×{ex.reps}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Workout Player Styles
const workoutPlayerStyles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid #E8E8E8',
    backgroundColor: '#FFFFFF',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  backButton: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    color: '#4A6741',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '8px 0',
  },
  progress: {
    flex: 1,
    marginLeft: '16px',
    marginRight: '16px',
  },
  progressText: {
    fontSize: '12px',
    color: '#666666',
    marginBottom: '4px',
    display: 'block',
    textAlign: 'center',
  },
  progressBar: {
    height: '4px',
    backgroundColor: '#E8E8E8',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A6741',
    borderRadius: '2px',
    transition: 'width 0.3s ease',
  },
  toggleVideoBtn: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '8px',
  },
  videoContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16/9',
    backgroundColor: '#000',
    maxHeight: '250px',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  videoLabel: {
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: '500',
  },
  restContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    backgroundColor: '#F5F7F4',
    minHeight: '250px',
  },
  restCircle: {
    width: '140px',
    height: '140px',
    borderRadius: '70px',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  restTime: {
    fontSize: '48px',
    fontWeight: '700',
    color: '#2AABB3',
  },
  restLabel: {
    fontSize: '14px',
    color: '#666666',
  },
  restTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '8px',
  },
  restSubtitle: {
    fontSize: '16px',
    color: '#666666',
    marginBottom: '20px',
  },
  skipButton: {
    backgroundColor: '#4A6741',
    color: '#FFFFFF',
    border: 'none',
    padding: '12px 32px',
    borderRadius: '25px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  exerciseInfo: {
    padding: '24px 20px',
    textAlign: 'center',
  },
  exerciseName: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#2D2D2D',
    marginBottom: '20px',
  },
  setsReps: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    marginBottom: '20px',
  },
  setIndicator: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  setLabel: {
    fontSize: '14px',
    color: '#666666',
    marginBottom: '4px',
  },
  setNumber: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#4A6741',
  },
  repIndicator: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  repLabel: {
    fontSize: '14px',
    color: '#666666',
    marginBottom: '4px',
  },
  repNumber: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#2AABB3',
  },
  tips: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#FFF9E6',
    padding: '12px 20px',
    borderRadius: '12px',
    marginBottom: '16px',
  },
  tipsIcon: {
    fontSize: '18px',
  },
  tipsText: {
    fontSize: '14px',
    color: '#666666',
  },
  setDots: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
  },
  setDot: {
    width: '12px',
    height: '12px',
    borderRadius: '6px',
    transition: 'background-color 0.3s ease',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    gap: '12px',
    borderTop: '1px solid #E8E8E8',
    backgroundColor: '#FFFFFF',
  },
  navButton: {
    backgroundColor: '#F5F5F5',
    color: '#666666',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  completeSetBtn: {
    flex: 1,
    backgroundColor: '#4A6741',
    color: '#FFFFFF',
    border: 'none',
    padding: '16px 24px',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  exerciseList: {
    padding: '16px 20px',
    borderTop: '1px solid #E8E8E8',
    backgroundColor: '#FAFAFA',
  },
  listTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#666666',
    marginBottom: '12px',
  },
  listScroll: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 12px',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  listNumber: {
    width: '28px',
    height: '28px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
    marginRight: '12px',
  },
  listName: {
    flex: 1,
    fontSize: '15px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  listSets: {
    fontSize: '13px',
    color: '#888888',
  },
  completeScreen: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    textAlign: 'center',
  },
  completeIcon: {
    fontSize: '80px',
    marginBottom: '24px',
  },
  completeTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#4A6741',
    marginBottom: '12px',
  },
  completeSubtitle: {
    fontSize: '18px',
    color: '#666666',
    marginBottom: '32px',
  },
  statsGrid: {
    display: 'flex',
    gap: '16px',
    marginBottom: '40px',
  },
  statCard: {
    backgroundColor: '#F5F7F4',
    padding: '20px 24px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#4A6741',
  },
  statLabel: {
    fontSize: '14px',
    color: '#666666',
    marginTop: '4px',
  },
  primaryButton: {
    backgroundColor: '#4A6741',
    color: '#FFFFFF',
    border: 'none',
    padding: '16px 48px',
    borderRadius: '30px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

// ==================== KICKSTART GUIDE DATA ====================
const kickstartGuideData = {
  title: "GLP-1 Kickstart Guide",
  author: "Merris Taylor, MS, RD",
  sections: [
    { id: 'fears', title: 'Real Talk About Your Fears', icon: '💭', color: '#9B7E9B', description: 'Addressing concerns keeping you up at night' },
    { id: 'first30days', title: 'Your First 30 Days', icon: '📅', color: '#4A6741', description: 'Week-by-week guide to getting started' },
    { id: 'sideeffects', title: 'Side Effect Prevention', icon: '🛡️', color: '#2AABB3', description: 'Strategies to minimize discomfort' },
    { id: 'checklist', title: 'Getting Started Checklist', icon: '✅', color: '#C4956A', description: 'Everything you need to prepare' },
    { id: 'essentials', title: '4 Essential Nutrition Shifts', icon: '🎯', color: '#E57373', description: 'The foundation for GLP-1 success' }
  ],
  fears: [
    {
      id: 'doesnt-work',
      question: '"What if it doesn\'t work?"',
      answer: `GLP-1 medications have some of the highest success rates we've ever seen for weight loss—15-20% of body weight on average.

**The people who get the BEST results:**
• Build sustainable habits
• Get proper support
• Follow a realistic nutrition plan
• Take a long-term approach

**The people who struggle often:**
• Try to do it alone
• Push doses too high too fast
• Follow random advice online
• Look for quick fixes

Here's the truth: If you've tried everything and nothing's stuck, it's not because you lack willpower. Your body has powerful biological mechanisms that fight against weight loss.

Think of it like this: Your body has a weight "thermostat" stuck on a higher setting. No amount of willpower can override biology forever. GLP-1s help adjust that thermostat so your efforts can finally work.`,
      icon: '🤔'
    },
    {
      id: 'easy-way',
      question: '"Isn\'t this the easy way out?"',
      answer: `Do you tell people with diabetes they're taking the easy way out by using insulin?

Do you shame people for using thyroid medication?

Do you judge someone for taking antidepressants?

No?

Then why are we still shaming people for using medically-proven tools for weight management?

**Here's what science tells us:**
• Hormones play a huge role in weight
• Biology actively fights against weight loss
• Willpower oftentimes isn't enough
• Tools exist to help

Using tools that work WITH your body instead of against it isn't weakness—it's smart.`,
      icon: '💪'
    },
    {
      id: 'side-effects',
      question: '"What about the side effects?"',
      answer: `Real talk: Side effects can happen. But here's what nobody tells you...

**Many side effects come from:**
• Starting dose too high
• Increasing too fast
• Missing key nutrition strategies

**The good news? Most side effects are:**
• Preventable with the right plan
• Manageable with proper support
• Temporary as your body adjusts
• Mild when doses are optimized

Many side effects can be prevented or minimized with the right approach to nutrition and habits.`,
      icon: '⚠️'
    },
    {
      id: 'regain',
      question: '"What if I regain the weight?"',
      answer: `This is the big one, isn't it? After years of yo-yo dieting, this fear is so valid.

**Here's what makes GLP-1s different:**
• They address biological drivers
• They allow time to create new habits
• They provide time for learning
• They support maintenance

**Important transparency:** These medications do have risk of regaining after stopping. Most people gain some weight back after they stop the medication.

While many people regain weight, it's not everyone. A lot of people are able to keep their weight off, but it requires creating strong new habits—especially with eating—that you take into your weight maintenance phase.`,
      icon: '🔄'
    }
  ],
  first30Days: {
    intro: "Starting a GLP-1 medication can feel overwhelming, but knowing what to expect can help you navigate those first crucial weeks.",
    weeks: [
      {
        id: 'week1', title: 'Week 1: Getting Started', icon: '1️⃣',
        expectations: ['Minimal appetite suppression at first—medication takes time to build up', 'Side effects may begin: nausea (especially 24-48 hours after injection), fatigue, headaches', 'Potential constipation or diarrhea'],
        tips: ['Take your injection at night to sleep through initial side effects', 'Keep meals simple but nutritious', 'Stay well hydrated', 'Consider taking an acid reducer before bedtime if experiencing reflux']
      },
      {
        id: 'week2', title: 'Week 2: Adjusting', icon: '2️⃣',
        expectations: ['Slightly decreased appetite', 'Early satiety (feeling full faster)', 'Better control around food choices', 'Side effects may still be present but potentially improving'],
        tips: ['Establish a regular eating schedule', 'Learn to recognize your new fullness cues', 'Get enough protein with each meal', 'Take it slow with meals—no rushing']
      },
      {
        id: 'week34', title: 'Weeks 3-4: Finding Your Rhythm', icon: '3️⃣',
        expectations: ['More consistent appetite suppression', 'Better management of side effects', 'Possible initial weight loss (though this varies greatly)', 'More stable energy levels'],
        tips: ['Eat regular meals even if not hungry', 'Focus on protein and fiber', 'Stay ahead of constipation', 'Regular hydration', 'Gentle movement if you feel up to it']
      }
    ],
    successLooks: {
      notAbout: ['Losing a specific amount of weight', 'Having zero side effects', 'Perfect eating', 'Comparing your results to others'],
      isAbout: ["Learning your body's new signals", 'Establishing sustainable habits', 'Managing side effects effectively', 'Building a foundation for long-term success']
    },
    redFlags: ['Severe or persistent vomiting', 'Unable to keep fluids down', 'Severe abdominal pain', 'Extreme fatigue', 'Severe headaches', 'Any concerning symptoms that worry you']
  },
  sideEffectPrevention: {
    essentials: ['Stay ahead of nausea', 'Keep hydration up', 'Plan simple meals', 'Have supplies ready'],
    strategies: [
      { symptom: 'Nausea', icon: '🤢', tips: ['Eat slowly', 'Small, frequent meals', 'Ginger & peppermint', 'Stay hydrated'] },
      { symptom: 'Fatigue', icon: '😴', tips: ['Prioritize protein', 'Regular meals', 'Proper hydration', 'Electrolytes', 'Adequate rest'] },
      { symptom: 'Constipation', icon: '💫', tips: ['High fiber foods', 'Lots of water', 'Daily movement', 'Regular routine'] }
    ],
    supplyList: ['Sharps container for needle disposal', 'Alcohol swabs', 'Nausea remedies (ginger tea, peppermint)', 'Electrolyte supplements', 'High-protein snacks', 'Fiber supplements (if needed)', 'Water bottle']
  },
  checklist: {
    categories: [
      { title: 'Medical Preparation', icon: '🏥', items: ['Provider consultation scheduled', 'Current medications/supplements documented', 'Medical conditions/allergies listed', 'Weight loss history noted', 'Questions for provider written down', 'Insurance coverage confirmed', 'Pharmacy selected'] },
      { title: 'Physical Preparation', icon: '📦', items: ['Sharps container obtained', 'Alcohol swabs ready', 'Nausea remedies stocked', 'Electrolyte supplements purchased', 'High-protein foods in kitchen', 'Fiber-rich foods available', 'Easy-to-digest foods for side effect days', 'Water bottle ready'] },
      { title: 'Tracking Setup', icon: '📊', items: ['Weight tracking method chosen', 'Food tracking method selected (optional)', 'Side effect tracking system ready', 'Injection day reminder set', 'Prescription refill reminder set', '"Before" photos taken', 'Initial measurements recorded'] },
      { title: 'Mental Preparation', icon: '🧠', items: ['Injection day/time selected', 'Meal timing strategy planned', 'Exercise plan considered', 'Support system identified', 'Realistic expectations set', 'Understanding this is a tool, not magic', "Acceptance that progress isn't linear"] },
      { title: 'Environment Setup', icon: '🏠', items: ['Trigger foods addressed', 'Healthy food easily accessible', 'Meal prep area organized', 'Medication storage area prepared', 'Time blocked for meal prep', 'Regular eating times planned', 'Self-care time scheduled'] }
    ]
  },
  essentialShifts: [
    { id: 'protein', title: 'Protein', icon: '🥩', number: '1', summary: 'Crucial for losing weight and minimizing muscle loss', details: 'Eating enough protein is crucial to losing weight on GLP-1 and minimizing muscle loss. Muscle burns calories and helps keep your metabolism higher as you lose weight.', tip: 'Aim for 25-35g protein at every meal. Eat your protein first before getting too full.', color: '#4A6741' },
    { id: 'timing', title: 'Meal Timing', icon: '⏰', number: '2', summary: 'Consistent eating prevents dangerous blood sugar drops', details: "GLP-1s have the ability to lower blood sugar, and the fact that they lower appetite and sometimes cause people to forget they need to eat can be potentially dangerous.", tip: 'Eat within 1-2 hours of waking up. No more than 4-5 hours between meals. Stop eating 3-4 hours before bedtime.', color: '#C4956A' },
    { id: 'hydration', title: 'Hydration', icon: '💧', number: '3', summary: 'GLP-1 affects thirst too—stay ahead of dehydration', details: "Get plenty of sugar-free fluids throughout the day. GLP-1 doesn't only affect appetite—it has been known to decrease thirst too.", tip: 'Use sugar-free flavorings if it helps. Add electrolytes on low-appetite days or when sweating more than usual.', color: '#2AABB3' },
    { id: 'fiber', title: 'Fiber', icon: '🥬', number: '4', summary: 'Keeps digestion moving and provides essential nutrients', details: "Fiber helps your gut keep moving (which is a problem for some on these meds), and many high-fiber foods are packed with nutrients that you need on this journey.", tip: 'Get at least 25g of fiber per day from fruits, vegetables, and whole grains.', color: '#9B7E9B' }
  ]
};

// ==================== GLP-1 EDUCATION DATA ====================
const glp1MistakesData = {
  categories: [
    {
      id: 'appetite',
      title: 'Appetite & Undereating',
      icon: '🍽️',
      color: '#C4956A',
      description: 'Mistakes that quietly wreck results'
    },
    {
      id: 'nutrition',
      title: 'Nutrition Quality',
      icon: '🥗',
      color: '#4A6741',
      description: 'Mistakes that cost you fat loss'
    },
    {
      id: 'muscle',
      title: 'Muscle & Metabolism',
      icon: '💪',
      color: '#2AABB3',
      description: 'Mistakes that lead to stalls later'
    },
    {
      id: 'dose',
      title: 'Dose & Side Effects',
      icon: '💊',
      color: '#9B7E9B',
      description: 'Assumptions that create struggle'
    },
    {
      id: 'progress',
      title: 'Progress & Expectations',
      icon: '📊',
      color: '#E57373',
      description: 'Mistakes that trigger panic'
    },
    {
      id: 'strategy',
      title: 'Strategy & Habits',
      icon: '🎯',
      color: '#4A8BA8',
      description: 'Mistakes that lead to burnout'
    }
  ],
  mistakes: [
    {
      id: 1,
      category: 'appetite',
      title: 'Undereating',
      summary: 'Unintentionally eating less and less over time',
      content: `One of the most common mistakes is unintentionally eating less and less over time. It starts subtly—you feel full faster, leave more bites on your plate, skip part of a meal. In the beginning, weight comes off, which feels exciting.

The problem is that as weight loss progresses, your body requires fewer calories. When you're already eating very small amounts, your body adapts to functioning on less and less food. This makes continued fat loss harder and increases likelihood for weight stalls.

**The Goal:** Eat enough, consistently, so your body doesn't keep adapting downward. Learning how to fuel your body helps protect your metabolism, muscle, and ability to keep losing weight.`,
      keyTakeaway: 'Relying on "eating less" without structure can create problems later. The goal isn\'t to eat as little as possible.',
      icon: '⚠️'
    },
    {
      id: 2,
      category: 'appetite',
      title: 'Chasing Zero Appetite',
      summary: 'Believing you need no appetite to lose weight',
      content: `Many people believe that having no appetite is the goal on GLP-1. When appetite starts to come back as your body adjusts, it can feel scary—leading people to increase their dose just to chase their appetite away.

**The Truth:** Having an appetite is not bad. Appetite helps you eat enough, fuel your body, and maintain muscle. Trying to completely numb it can make this journey harder.

The goal of GLP-1 isn't zero appetite—it's to take the edge off enough that you feel in control and can make better eating decisions.`,
      keyTakeaway: 'Learning to respond to your appetite, instead of being afraid of it, sets you up for better long-term results.',
      icon: '🎯'
    },
    {
      id: 3,
      category: 'appetite',
      title: 'Blindly "Listening to Your Body"',
      summary: 'Not eating because hunger isn\'t showing up',
      content: `On GLP-1, listening to your body looks very different. When you're new to the medication, your hunger and fullness cues can be much quieter than normal. You might feel full after a few bites or go most of the day without feeling hungry.

The mistake happens when "listening to your body" turns into not eating simply because hunger isn't showing up. On GLP-1, low hunger is common—but letting long stretches go by without eating can lead to underfueling, low energy, muscle loss, and slower progress.

**New Approach:** On GLP-1, hunger isn't always a reliable fuel gauge. Your body still needs fuel to function well. Just because the "hunger light" isn't on doesn't mean your tank is full.`,
      keyTakeaway: 'GLP-1 changes hunger cues, but your body\'s need for fuel doesn\'t. Intentional eating is fundamental.',
      icon: '👂'
    },
    {
      id: 4,
      category: 'appetite',
      title: 'Undereating Early, Overeating Later',
      summary: 'Skipping meals early in the week leads to rebound hunger',
      content: `With weekly GLP-1 injections, medication levels are highest in the first day or two after your shot. As days go by, levels drop and appetite gradually returns.

If you barely eat at the beginning of the week when appetite is lowest, this often leads to rebound hunger later. That rebound isn't a lack of willpower—it's your body responding to being underfed.

**The Solution:** Learn to work with your appetite cycle so your body gets what it needs over the course of the week. This avoids the toxic cycle of undereating then binging.`,
      keyTakeaway: 'Appetite changes across the week are normal. Learning to fuel intentionally across the full cycle matters more than any single day.',
      icon: '📅'
    },
    {
      id: 5,
      category: 'nutrition',
      title: 'Thinking Deficit = Fat Loss',
      summary: 'A calorie deficit doesn\'t guarantee what kind of weight you lose',
      content: `A calorie deficit does lead to weight loss, but it doesn't guarantee WHAT kind of weight you're losing or how you feel during your journey.

When food quality is low and protein is sparse, your body can pull energy from muscle, not just fat. This leads to low energy, dizziness, hair loss, or a "skinny-fat" look—where the scale goes down but body composition doesn't improve.

**What Matters:** WHAT you eat matters just as much as HOW MUCH. A calorie deficit without enough protein, micronutrients, and minerals often leads to muscle loss and a worse experience overall.`,
      keyTakeaway: 'Food quality determines how you feel, how much muscle you keep, and what your body looks like as you lose weight.',
      icon: '⚖️'
    },
    {
      id: 6,
      category: 'nutrition',
      title: 'Over-Relying on Protein Supplements',
      summary: 'Supplements slowly replacing real meals',
      content: `Protein supplements can be helpful on GLP-1—they're convenient and a great way to add extra protein when appetite is low. The mistake happens when supplements start replacing real meals instead of supplementing them.

Many people lean heavily on shakes because they think real meals can't meet their protein needs with a lower appetite. But that's not true!

Most protein supplements are high in protein but low in calories, carbs, fat, and fiber. Real meals provide a mix of nutrients that help you feel more satisfied with steadier energy.`,
      keyTakeaway: 'Protein supplements are tools to fill gaps. Learning to get enough protein from real food helps you feel satisfied and confident.',
      icon: '🥤'
    },
    {
      id: 7,
      category: 'nutrition',
      title: 'Ignoring Fiber & Produce',
      summary: 'Treating protein as the only thing that matters',
      content: `Because appetite is lower on GLP-1, many people feel like they have to "use up" their appetite on protein alone. Once they finish the protein, they feel too full for anything else, so fiber and produce get pushed aside.

Fiber and produce play a big role in:
• Digestion and gut health
• Energy levels
• Feeling satisfied day to day
• Keeping digestion moving

When these are missing, people notice more constipation, lower energy, and harder time feeling satisfied.`,
      keyTakeaway: 'Protein matters, but fiber and produce help your body feel better, stay regular, and are crucial for keeping weight off long-term.',
      icon: '🥬'
    },
    {
      id: 8,
      category: 'nutrition',
      title: 'Cutting Out Carbs Completely',
      summary: 'Diet culture taught that weight loss only happens without carbs',
      content: `Many people cut carbs on GLP-1 because past diets taught them that's the "right" way to lose weight. But carbs are NOT the problem.

**Why Carbs Matter:**
• Your brain's preferred energy source
• Help with mood, focus, and satisfaction
• Prevent low energy and frustration
• Make your journey more sustainable

Carbs don't stop fat loss on GLP-1. The right types and amounts can make your journey more enjoyable while still losing weight consistently.`,
      keyTakeaway: 'You don\'t need to cut carbs to lose weight on GLP-1. Including them strategically improves energy, satisfaction, and results.',
      icon: '🍞'
    },
    {
      id: 9,
      category: 'muscle',
      title: 'Not Thinking About Muscle',
      summary: 'Assuming muscle loss won\'t be an issue if weight is coming off',
      content: `Many people assume that as long as weight is coming off, muscle loss won't be an issue. But when muscle isn't protected during weight loss, it's easy to lose more than you realize.

**Why Muscle Matters:**
• Helps your body burn more energy at rest
• Makes weight loss easier long-term
• Prevents weight regain
• Keeps you strong for daily activities

The good news: Protecting muscle doesn't require hours in the gym. Pairing nutrition with simple strength training (even 20-30 minutes, a couple times per week) makes a huge difference.`,
      keyTakeaway: 'On GLP-1, weight loss is easier but so is muscle loss. Strength training protects your metabolism and long-term results.',
      icon: '💪'
    },
    {
      id: 10,
      category: 'muscle',
      title: 'Assuming 1-2 lbs/Week is Always "Healthy"',
      summary: 'One-size-fits-all weight loss guidelines don\'t work',
      content: `The "1-2 pounds per week" guideline is often taken too literally on GLP-1. Just like we all have different nutrition needs, we have different safe rates of weight loss.

**The Reality:**
• For some, 2 lbs/week is too aggressive and risks muscle loss
• For others (especially early on), 1-2 lbs may be slower than safe
• Weight loss rate depends on starting weight, body size, and medication response
• Your safe rate CHANGES as you lose weight

Figuring out your personalized safe weight loss rate helps you lose fat without pushing your body too hard.`,
      keyTakeaway: 'Healthy weight loss isn\'t one-size-fits-all. Knowing your personal safe range helps you avoid losing too fast or too slow.',
      icon: '📉'
    },
    {
      id: 11,
      category: 'muscle',
      title: 'Waiting to Address Nutrition',
      summary: 'Waiting until stalled, exhausted, or losing muscle',
      content: `A common mistake is assuming that as long as weight is going down, everything else will take care of itself.

Ignoring nutrition becomes cumulative. What starts as "probably fine" can turn into:
• Fatigue and weakness
• Noticeable muscle loss
• Struggling with everyday tasks
• Weight loss suddenly stopping

**Proactive vs Reactive:** When you proactively support your body BEFORE problems show up, you create a powerful environment to thrive while losing weight.`,
      keyTakeaway: 'On GLP-1, proactive nutrition beats reactive nutrition every time.',
      icon: '⏰'
    },
    {
      id: 12,
      category: 'dose',
      title: 'Increasing Dose Too Quickly',
      summary: 'Feeling pressure to move up every month',
      content: `Many people feel pressure to increase their dose every month—from social media, other users, or providers following standard schedules without looking at individual response.

**Important:** A higher dose doesn't always mean better results.

Many people wish they had gone slower. Once at the highest dose, they felt "capped out" and nervous about going back down.

The goal isn't to rush to the highest dose—it's to get the most effectiveness out of each dose you're on.`,
      keyTakeaway: 'Higher isn\'t always better. The best approach is getting the most out of each dose while listening to your body.',
      icon: '📈'
    },
    {
      id: 13,
      category: 'dose',
      title: 'Feeling Like a Failure for Needing Higher Dose',
      summary: 'Assuming needing more means you\'re doing something wrong',
      content: `On the flip side, many feel embarrassed when they need to increase their dose. They assume it means they're not trying hard enough or failing the medication.

**The Truth:** Needing a higher dose doesn't say anything about your effort or worth. Bodies respond differently to GLP-1, and some simply need more support.

At the same time, the dose alone isn't what creates results. When you focus on intentional habits alongside the medication, that's when you get the most out of every dose.`,
      keyTakeaway: 'Needing a higher dose isn\'t failure. Lasting results come from pairing medication with intentional habits.',
      icon: '💚'
    },
    {
      id: 14,
      category: 'dose',
      title: 'Assuming Side Effects Are Unavoidable',
      summary: 'Chalking everything up to "just the medication"',
      content: `Many people assume nausea, fatigue, hair loss, and GI issues are "just part of it." Sometimes side effects ARE medication-related, especially when adjusting doses.

**But many times, they're made worse by controllable factors:**
• Nausea often tied to not eating enough or going too long without food
• High-fat meals can trigger nausea and GI symptoms
• Fatigue, headaches, dizziness often connected to hydration or electrolytes

When you pay attention to patterns around food, hydration, and timing, many symptoms become easier to manage or disappear.`,
      keyTakeaway: 'Some side effects are medication-related, but many are influenced by how you eat and hydrate. Small adjustments make a big difference.',
      icon: '🩺'
    },
    {
      id: 15,
      category: 'progress',
      title: 'Only Tracking the Scale',
      summary: 'The scale can\'t tell the difference between fat and muscle',
      content: `The scale is one way to track progress, but not the only one—and not the best measure of what's happening in your body.

**The scale can't tell you:**
• Fat loss vs muscle gain
• Body composition changes
• Strength improvements
• How clothes fit differently

When building/protecting muscle while losing fat, the scale may move slowly or fluctuate—even though body composition is improving (body recomposition).

Track progress through: measurements, photos, how clothes fit, energy levels, and strength.`,
      keyTakeaway: 'The scale tells part of the story. Body composition, strength, and how you feel tell the rest.',
      icon: '⚖️'
    },
    {
      id: 16,
      category: 'progress',
      title: 'Expecting Immediate Results',
      summary: 'Thinking you\'re failing if no weight loss in 1-3 months',
      content: `Many people panic if they haven't lost weight right away, thinking the medication isn't working or they're a "non-responder."

**Reality Check:**
• The first month is usually a starting dose that doesn't cause much weight loss
• It can take a few months to find the right dose
• Early weight loss (or lack of it) isn't a verdict on overall success

While finding your right dose, do your part: eat intentionally and build supportive habits to help the shot work better when it clicks.`,
      keyTakeaway: 'Not losing weight right away doesn\'t mean you\'re failing. Sometimes your body needs time to find the right dose.',
      icon: '⏳'
    },
    {
      id: 17,
      category: 'progress',
      title: 'Comparing to Others',
      summary: 'Social media is a highlight reel',
      content: `Comparing your progress to people online is a common trap. Social media shows big wins and dramatic changes—not plateaus, slow months, or struggles.

**Remember:**
• The algorithm promotes extreme examples
• You never see the full picture
• Bodies respond differently
• Doses and situations differ

Losing 4 pounds in a month can feel discouraging when someone claims 20—but those situations are rarely comparable.`,
      keyTakeaway: 'Your progress doesn\'t need to look like a highlight reel to be working and improving your life.',
      icon: '📱'
    },
    {
      id: 18,
      category: 'strategy',
      title: 'Waiting to Build Habits',
      summary: 'Waiting until near goal weight to care about nutrition',
      content: `Many people wait until they've lost most weight to start building habits for maintenance. But that's the hardest time to start.

**The Truth:** The way you lose the weight is usually the way you keep it off.

If weight loss happened mostly because appetite was low without learning to eat intentionally, maintenance will feel scary instead of freeing.

When you build habits while the medication is helping, you set yourself up to confidently maintain results for a lifetime.`,
      keyTakeaway: 'Maintenance doesn\'t start at goal weight. It starts with how you eat while you\'re losing.',
      icon: '🏗️'
    },
    {
      id: 19,
      category: 'strategy',
      title: 'Trying to Change Everything at Once',
      summary: 'Piling on changes is a fast track to burnout',
      content: `People start GLP-1 motivated and try to change everything: more steps, fewer carbs, perfect meals, more workouts, more rules.

**The Problem:** When you overhaul everything at once, it's hard to keep up. When something slips, it often triggers all-or-nothing thinking—you're either "on" or "off."

**Better Approach:** Focus on just a couple small, meaningful habits at a time. Once you nail a habit, add another. Progress sticks when change feels manageable.`,
      keyTakeaway: 'Too much effort too fast leads to burnout and all-or-nothing thinking. Progress sticks when change feels manageable.',
      icon: '🎢'
    },
    {
      id: 20,
      category: 'strategy',
      title: 'YOLO-ing Your Time on the Shot',
      summary: 'Swinging too far toward "anything goes"',
      content: `Once food feels peaceful, some swing too far—assuming caring about nutrition means giving in to diet culture, or that healing your relationship with food means saying yes to every craving.

**The Balance:** Eating intentionally on GLP-1 isn't restriction—it's self-care. You don't have to eat perfectly, but when most intake comes from foods that don't fuel your body, weight loss can slow.

Healing your relationship with food and supporting fat loss are NOT opposites. On GLP-1, intentional eating is the BEST thing you can do for yourself.`,
      keyTakeaway: 'Healing your relationship with food and supporting fat loss can happen together. Intentional eating is self-care.',
      icon: '🎯'
    },
    {
      id: 21,
      category: 'strategy',
      title: 'Over-Consuming Free Advice',
      summary: 'Getting more confused from too many opinions',
      content: `Trying to take in all free advice online rarely brings clarity—it usually does the opposite.

When you hear dozens of different opinions daily, you end up with:
• 30 things on your to-do list
• Amazon cart full of supplements
• No realistic way to keep up
• More confusion than before

**The Truth:** Losing weight consistently on GLP-1 is much simpler than social media makes it seem. More tips don't equal better results without a clear framework.`,
      keyTakeaway: 'More information doesn\'t automatically lead to better results. Clarity, consistency, and trusted guidance move the needle.',
      icon: '📚'
    }
  ]
};

// GLP-1 Education Screen Component
function GLP1EducationScreen({ onBack }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMistake, setSelectedMistake] = useState(null);
  const [completedMistakes, setCompletedMistakes] = useState([]);

  const toggleCompleted = (id) => {
    setCompletedMistakes(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  // Show mistake detail
  if (selectedMistake) {
    const mistake = glp1MistakesData.mistakes.find(m => m.id === selectedMistake);
    const category = glp1MistakesData.categories.find(c => c.id === mistake.category);
    
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.educationHeader}>
          <button style={styles.backButton} onClick={() => setSelectedMistake(null)}>← Back</button>
        </div>

        <div style={{...styles.mistakeCategoryBadge, background: `${category.color}20`, color: category.color}}>
          {category.icon} {category.title}
        </div>

        <h1 style={styles.mistakeDetailTitle}>Mistake #{mistake.id}</h1>
        <h2 style={styles.mistakeDetailName}>{mistake.title}</h2>

        <div style={styles.mistakeContent}>
          {mistake.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
              return <h4 key={idx} style={styles.mistakeSubheading}>{paragraph.replace(/\*\*/g, '')}</h4>;
            }
            if (paragraph.includes('**')) {
              const parts = paragraph.split('**');
              return (
                <p key={idx} style={styles.mistakeParagraph}>
                  {parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
                </p>
              );
            }
            if (paragraph.startsWith('•')) {
              return (
                <div key={idx} style={styles.mistakeBulletList}>
                  {paragraph.split('\n').map((line, i) => (
                    <p key={i} style={styles.mistakeBullet}>{line}</p>
                  ))}
                </div>
              );
            }
            return <p key={idx} style={styles.mistakeParagraph}>{paragraph}</p>;
          })}
        </div>

        <div style={styles.keyTakeawayBox}>
          <span style={styles.keyTakeawayIcon}>💡</span>
          <div>
            <p style={styles.keyTakeawayLabel}>Key Takeaway</p>
            <p style={styles.keyTakeawayText}>{mistake.keyTakeaway}</p>
          </div>
        </div>

        <button 
          style={{
            ...styles.markCompleteButton,
            background: completedMistakes.includes(mistake.id) ? '#E8EDE6' : '#4A6741',
            color: completedMistakes.includes(mistake.id) ? '#4A6741' : '#FFFFFF'
          }}
          onClick={() => toggleCompleted(mistake.id)}
        >
          {completedMistakes.includes(mistake.id) ? '✓ Marked as Read' : 'Mark as Read'}
        </button>
      </div>
    );
  }

  // Show category mistakes
  if (selectedCategory) {
    const category = glp1MistakesData.categories.find(c => c.id === selectedCategory);
    const categoryMistakes = glp1MistakesData.mistakes.filter(m => m.category === selectedCategory);

    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.educationHeader}>
          <button style={styles.backButton} onClick={() => setSelectedCategory(null)}>← Back</button>
        </div>

        <div style={{...styles.categoryHeaderLarge, background: `linear-gradient(135deg, ${category.color}15 0%, ${category.color}30 100%)`}}>
          <span style={styles.categoryIconLarge}>{category.icon}</span>
          <h1 style={styles.categoryTitleLarge}>{category.title}</h1>
          <p style={styles.categoryDescLarge}>{category.description}</p>
          <p style={styles.categoryCount}>{categoryMistakes.length} mistakes to avoid</p>
        </div>

        <div style={styles.mistakesList}>
          {categoryMistakes.map((mistake) => (
            <div 
              key={mistake.id}
              style={styles.mistakeCard}
              className="card-hover"
              onClick={() => setSelectedMistake(mistake.id)}
            >
              <div style={styles.mistakeCardLeft}>
                <span style={{...styles.mistakeNumber, background: category.color}}>#{mistake.id}</span>
              </div>
              <div style={styles.mistakeCardContent}>
                <h3 style={styles.mistakeCardTitle}>{mistake.title}</h3>
                <p style={styles.mistakeCardSummary}>{mistake.summary}</p>
              </div>
              {completedMistakes.includes(mistake.id) && (
                <span style={styles.mistakeCompletedBadge}>✓</span>
              )}
              <span style={styles.mistakeArrow}>→</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Main education screen
  return (
    <div style={styles.screenContent} className="fade-in">
      <div style={styles.educationHeader}>
        <button style={styles.backButton} onClick={onBack}>← Back</button>
      </div>

      <header style={styles.educationIntro}>
        <h1 style={styles.educationTitle}>21 GLP-1 Mistakes</h1>
        <p style={styles.educationSubtitle}>
          Avoid the biggest mistakes before they cost you progress and plateaus
        </p>
        <div style={styles.progressOverview}>
          <span style={styles.progressText}>{completedMistakes.length} of 21 read</span>
          <div style={styles.progressBarSmall}>
            <div style={{...styles.progressFillSmall, width: `${(completedMistakes.length / 21) * 100}%`}} />
          </div>
        </div>
      </header>

      <div style={styles.categoriesGrid}>
        {glp1MistakesData.categories.map((category) => {
          const categoryMistakes = glp1MistakesData.mistakes.filter(m => m.category === category.id);
          const completedInCategory = categoryMistakes.filter(m => completedMistakes.includes(m.id)).length;
          
          return (
            <div 
              key={category.id}
              style={{...styles.categoryCard, borderLeftColor: category.color}}
              className="card-hover"
              onClick={() => setSelectedCategory(category.id)}
            >
              <div style={styles.categoryCardHeader}>
                <span style={styles.categoryCardIcon}>{category.icon}</span>
                <span style={styles.categoryCardProgress}>{completedInCategory}/{categoryMistakes.length}</span>
              </div>
              <h3 style={styles.categoryCardTitle}>{category.title}</h3>
              <p style={styles.categoryCardDesc}>{category.description}</p>
              <div style={styles.categoryCardBar}>
                <div style={{
                  ...styles.categoryCardBarFill, 
                  width: `${(completedInCategory / categoryMistakes.length) * 100}%`,
                  background: category.color
                }} />
              </div>
            </div>
          );
        })}
      </div>

      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Quick Tips</h3>
        <div style={styles.quickTipsList}>
          <div style={styles.quickTipCard}>
            <span style={styles.quickTipIcon}>🎯</span>
            <div>
              <p style={styles.quickTipTitle}>Protein First</p>
              <p style={styles.quickTipText}>25-35g per meal to preserve muscle</p>
            </div>
          </div>
          <div style={styles.quickTipCard}>
            <span style={styles.quickTipIcon}>💧</span>
            <div>
              <p style={styles.quickTipTitle}>Stay Hydrated</p>
              <p style={styles.quickTipText}>GLP-1 can reduce thirst awareness</p>
            </div>
          </div>
          <div style={styles.quickTipCard}>
            <span style={styles.quickTipIcon}>🥬</span>
            <div>
              <p style={styles.quickTipTitle}>Include Fiber</p>
              <p style={styles.quickTipText}>Supports digestion and satisfaction</p>
            </div>
          </div>
          <div style={styles.quickTipCard}>
            <span style={styles.quickTipIcon}>💪</span>
            <div>
              <p style={styles.quickTipTitle}>Add Strength Training</p>
              <p style={styles.quickTipText}>Even 20-30 min, 2x/week helps</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ==================== KICKSTART GUIDE SCREEN ====================
function KickstartGuideScreen({ onBack }) {
  const [activeSection, setActiveSection] = useState(null);
  const [activeFear, setActiveFear] = useState(null);
  const [activeWeek, setActiveWeek] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheckItem = (categoryIdx, itemIdx) => {
    const key = `${categoryIdx}-${itemIdx}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getChecklistProgress = () => {
    const totalItems = kickstartGuideData.checklist.categories.reduce((sum, cat) => sum + cat.items.length, 0);
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    return Math.round((checkedCount / totalItems) * 100);
  };

  // Main section view
  if (!activeSection) {
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.kickstartHeader}>
          <button style={styles.backButton} onClick={onBack}>← Back</button>
        </div>
        
        <div style={styles.kickstartHero}>
          <span style={styles.kickstartBadge}>📚 Complete Guide</span>
          <h1 style={styles.kickstartTitle}>GLP-1 Kickstart Guide</h1>
          <p style={styles.kickstartDesc}>Everything you need to know to start your GLP-1 journey with confidence.</p>
        </div>

        <div style={styles.kickstartSections}>
          {kickstartGuideData.sections.map((section, idx) => (
            <div 
              key={section.id}
              style={{...styles.kickstartSectionCard, borderLeftColor: section.color}}
              className="card-hover"
              onClick={() => setActiveSection(section.id)}
            >
              <span style={styles.kickstartSectionIcon}>{section.icon}</span>
              <div style={styles.kickstartSectionContent}>
                <h3 style={styles.kickstartSectionTitle}>{section.title}</h3>
                <p style={styles.kickstartSectionDesc}>{section.description}</p>
              </div>
              <span style={styles.kickstartArrow}>→</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Fears section
  if (activeSection === 'fears') {
    if (activeFear) {
      const fear = kickstartGuideData.fears.find(f => f.id === activeFear);
      return (
        <div style={styles.screenContent} className="fade-in">
          <div style={styles.kickstartHeader}>
            <button style={styles.backButton} onClick={() => setActiveFear(null)}>← Back</button>
          </div>
          <div style={styles.fearDetailCard}>
            <span style={styles.fearDetailIcon}>{fear.icon}</span>
            <h2 style={styles.fearDetailQuestion}>{fear.question}</h2>
            <div style={styles.fearDetailAnswer}>
              {fear.answer.split('\n\n').map((para, idx) => (
                <p key={idx} style={styles.fearParagraph}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.kickstartHeader}>
          <button style={styles.backButton} onClick={() => setActiveSection(null)}>← Back</button>
        </div>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionHeaderIcon}>💭</span>
          <h1 style={styles.sectionHeaderTitle}>Real Talk About Your Fears</h1>
          <p style={styles.sectionHeaderDesc}>Let's address the concerns that might be keeping you up at night.</p>
        </div>
        <div style={styles.fearsList}>
          {kickstartGuideData.fears.map(fear => (
            <div 
              key={fear.id}
              style={styles.fearCard}
              className="card-hover"
              onClick={() => setActiveFear(fear.id)}
            >
              <span style={styles.fearIcon}>{fear.icon}</span>
              <span style={styles.fearQuestion}>{fear.question}</span>
              <span style={styles.fearArrow}>→</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // First 30 Days section
  if (activeSection === 'first30days') {
    if (activeWeek) {
      const week = kickstartGuideData.first30Days.weeks.find(w => w.id === activeWeek);
      return (
        <div style={styles.screenContent} className="fade-in">
          <div style={styles.kickstartHeader}>
            <button style={styles.backButton} onClick={() => setActiveWeek(null)}>← Back</button>
          </div>
          <div style={styles.weekDetailHeader}>
            <span style={styles.weekDetailIcon}>{week.icon}</span>
            <h2 style={styles.weekDetailTitle}>{week.title}</h2>
          </div>
          <div style={styles.weekSection}>
            <h4 style={styles.weekSectionTitle}>What to Expect</h4>
            {week.expectations.map((exp, idx) => (
              <div key={idx} style={styles.weekItem}>
                <span style={styles.weekItemBullet}>•</span>
                <span style={styles.weekItemText}>{exp}</span>
              </div>
            ))}
          </div>
          <div style={styles.weekSection}>
            <h4 style={styles.weekSectionTitle}>Tips for Success</h4>
            {week.tips.map((tip, idx) => (
              <div key={idx} style={styles.weekItem}>
                <span style={styles.weekItemBullet}>✓</span>
                <span style={styles.weekItemText}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.kickstartHeader}>
          <button style={styles.backButton} onClick={() => setActiveSection(null)}>← Back</button>
        </div>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionHeaderIcon}>📅</span>
          <h1 style={styles.sectionHeaderTitle}>Your First 30 Days</h1>
          <p style={styles.sectionHeaderDesc}>{kickstartGuideData.first30Days.intro}</p>
        </div>
        <div style={styles.weeksList}>
          {kickstartGuideData.first30Days.weeks.map(week => (
            <div 
              key={week.id}
              style={styles.weekCard}
              className="card-hover"
              onClick={() => setActiveWeek(week.id)}
            >
              <span style={styles.weekIcon}>{week.icon}</span>
              <span style={styles.weekTitle}>{week.title}</span>
              <span style={styles.weekArrow}>→</span>
            </div>
          ))}
        </div>
        <div style={styles.successBox}>
          <h4 style={styles.successTitle}>🎯 Success in Month 1</h4>
          <p style={styles.successSubtitle}>Is NOT about:</p>
          {kickstartGuideData.first30Days.successLooks.notAbout.map((item, idx) => (
            <p key={idx} style={styles.successNotItem}>✗ {item}</p>
          ))}
          <p style={{...styles.successSubtitle, marginTop: '16px'}}>IS about:</p>
          {kickstartGuideData.first30Days.successLooks.isAbout.map((item, idx) => (
            <p key={idx} style={styles.successIsItem}>✓ {item}</p>
          ))}
        </div>
        <div style={styles.redFlagsBox}>
          <h4 style={styles.redFlagsTitle}>⚠️ When to Call Your Provider</h4>
          {kickstartGuideData.first30Days.redFlags.map((flag, idx) => (
            <p key={idx} style={styles.redFlagItem}>• {flag}</p>
          ))}
        </div>
      </div>
    );
  }

  // Side Effects section
  if (activeSection === 'sideeffects') {
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.kickstartHeader}>
          <button style={styles.backButton} onClick={() => setActiveSection(null)}>← Back</button>
        </div>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionHeaderIcon}>🛡️</span>
          <h1 style={styles.sectionHeaderTitle}>Side Effect Prevention</h1>
          <p style={styles.sectionHeaderDesc}>Strategies to minimize discomfort and feel your best.</p>
        </div>
        <div style={styles.preventionEssentials}>
          <h4 style={styles.essentialsTitle}>Prevention Essentials</h4>
          {kickstartGuideData.sideEffectPrevention.essentials.map((item, idx) => (
            <span key={idx} style={styles.essentialTag}>{item}</span>
          ))}
        </div>
        <div style={styles.strategiesGrid}>
          {kickstartGuideData.sideEffectPrevention.strategies.map((strategy, idx) => (
            <div key={idx} style={styles.strategyCard}>
              <div style={styles.strategyHeader}>
                <span style={styles.strategyIcon}>{strategy.icon}</span>
                <span style={styles.strategySymptom}>{strategy.symptom}</span>
              </div>
              <div style={styles.strategyTips}>
                {strategy.tips.map((tip, tidx) => (
                  <p key={tidx} style={styles.strategyTip}>• {tip}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={styles.supplyListBox}>
          <h4 style={styles.supplyListTitle}>📦 Supply Checklist</h4>
          {kickstartGuideData.sideEffectPrevention.supplyList.map((item, idx) => (
            <p key={idx} style={styles.supplyItem}>□ {item}</p>
          ))}
        </div>
      </div>
    );
  }

  // Checklist section
  if (activeSection === 'checklist') {
    const progress = getChecklistProgress();
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.kickstartHeader}>
          <button style={styles.backButton} onClick={() => setActiveSection(null)}>← Back</button>
        </div>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionHeaderIcon}>✅</span>
          <h1 style={styles.sectionHeaderTitle}>Getting Started Checklist</h1>
          <p style={styles.sectionHeaderDesc}>Everything you need to prepare for success.</p>
        </div>
        <div style={styles.checklistProgress}>
          <div style={styles.checklistProgressBar}>
            <div style={{...styles.checklistProgressFill, width: `${progress}%`}} />
          </div>
          <span style={styles.checklistProgressText}>{progress}% Complete</span>
        </div>
        {kickstartGuideData.checklist.categories.map((category, catIdx) => (
          <div key={catIdx} style={styles.checklistCategory}>
            <div style={styles.checklistCategoryHeader}>
              <span style={styles.checklistCategoryIcon}>{category.icon}</span>
              <span style={styles.checklistCategoryTitle}>{category.title}</span>
            </div>
            {category.items.map((item, itemIdx) => {
              const isChecked = checkedItems[`${catIdx}-${itemIdx}`];
              return (
                <div 
                  key={itemIdx} 
                  style={styles.checklistItem}
                  onClick={() => toggleCheckItem(catIdx, itemIdx)}
                >
                  <div style={{
                    ...styles.checkbox,
                    ...(isChecked ? styles.checkboxChecked : {})
                  }}>
                    {isChecked && '✓'}
                  </div>
                  <span style={{
                    ...styles.checklistItemText,
                    ...(isChecked ? styles.checklistItemChecked : {})
                  }}>{item}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  // Essential Shifts section
  if (activeSection === 'essentials') {
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.kickstartHeader}>
          <button style={styles.backButton} onClick={() => setActiveSection(null)}>← Back</button>
        </div>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionHeaderIcon}>🎯</span>
          <h1 style={styles.sectionHeaderTitle}>4 Essential Nutrition Shifts</h1>
          <p style={styles.sectionHeaderDesc}>The foundation for GLP-1 success.</p>
        </div>
        <div style={styles.essentialsList}>
          {kickstartGuideData.essentialShifts.map((shift, idx) => (
            <div key={idx} style={{...styles.essentialCard, borderLeftColor: shift.color}}>
              <div style={styles.essentialHeader}>
                <div style={{...styles.essentialNumber, backgroundColor: shift.color}}>{shift.number}</div>
                <span style={styles.essentialIcon}>{shift.icon}</span>
                <h3 style={styles.essentialTitle}>{shift.title}</h3>
              </div>
              <p style={styles.essentialSummary}>{shift.summary}</p>
              <p style={styles.essentialDetails}>{shift.details}</p>
              <div style={{...styles.essentialTipBox, backgroundColor: `${shift.color}15`}}>
                <span style={styles.essentialTipIcon}>💡</span>
                <p style={styles.essentialTipText}>{shift.tip}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

// Injection Tracker Screen
function InjectionTrackerScreen({ user, setUser, onBack }) {
  const [activeTab, setActiveTab] = useState('log'); // 'log', 'calendar', 'supply'
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState('glp1');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDose, setSelectedDose] = useState(user.glp1Supply?.currentDose || '0.5mg');
  const [injectionNotes, setInjectionNotes] = useState('');

  const glp1Doses = ['0.25mg', '0.5mg', '1.0mg', '1.7mg', '2.4mg'];
  const lipocDoses = ['standard'];

  const addInjection = () => {
    const newInjection = {
      id: Date.now(),
      type: selectedType,
      date: selectedDate,
      dose: selectedType === 'glp1' ? selectedDose : 'standard',
      notes: injectionNotes,
      completed: true // New injections are marked complete by default
    };
    
    const updatedLog = [...(user.injectionLog || []), newInjection].sort((a, b) => new Date(b.date) - new Date(a.date));
    setUser({
      ...user,
      injectionLog: updatedLog
    });
    
    setShowAddModal(false);
    setInjectionNotes('');
  };

  const deleteInjection = (id) => {
    setUser({
      ...user,
      injectionLog: user.injectionLog.filter(i => i.id !== id)
    });
  };

  const toggleInjectionComplete = (id) => {
    setUser({
      ...user,
      injectionLog: user.injectionLog.map(i => 
        i.id === id ? { ...i, completed: !i.completed } : i
      )
    });
  };

  // Get injection history sorted by date (newest first)
  const sortedLog = [...(user.injectionLog || [])].sort((a, b) => new Date(b.date) - new Date(a.date));
  const glp1Injections = sortedLog.filter(i => i.type === 'glp1');
  const lipocInjections = sortedLog.filter(i => i.type === 'lipoc');

  // Calculate next injection dates
  const lastGlp1 = glp1Injections[0];
  const lastLipoc = lipocInjections[0];
  const nextGlp1Date = lastGlp1 ? new Date(new Date(lastGlp1.date).getTime() + 7*24*60*60*1000) : null;
  const nextLipocDate = lastLipoc ? new Date(new Date(lastLipoc.date).getTime() + 7*24*60*60*1000) : null;

  // Get calendar data for current month
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDay = firstDayOfMonth.getDay();

  const calendarDays = [];
  for (let i = 0; i < startingDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const getInjectionsForDay = (day) => {
    if (!day) return [];
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return sortedLog.filter(i => i.date === dateStr);
  };

  return (
    <div style={styles.screenContent} className="fade-in">
      <div style={styles.injectionHeader}>
        <button style={styles.backButton} onClick={onBack}>← Back</button>
        <h1 style={styles.injectionTitle}>Injection Tracker</h1>
        <button style={styles.addInjectionBtn} onClick={() => setShowAddModal(true)}>+ Log</button>
      </div>

      {/* Summary Cards */}
      <div style={styles.injectionSummaryCards}>
        <div style={styles.injectionSummaryCard}>
          <div style={styles.summaryCardHeader}>
            <span style={styles.summaryCardIcon}>💉</span>
            <span style={styles.summaryCardLabel}>GLP-1</span>
          </div>
          <div style={styles.summaryCardContent}>
            <p style={styles.summaryCardDose}>{user.glp1Supply?.currentDose || user.medicationDose}</p>
            <p style={styles.summaryCardMeta}>
              {lastGlp1 ? `Last: ${new Date(lastGlp1.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}` : 'No injections logged'}
            </p>
            {nextGlp1Date && (
              <p style={{
                ...styles.summaryCardNext,
                color: nextGlp1Date <= today ? '#E57373' : '#4A6741'
              }}>
                {nextGlp1Date <= today ? '⚠️ Due now' : `Next: ${nextGlp1Date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}`}
              </p>
            )}
          </div>
        </div>

        <div style={styles.injectionSummaryCard}>
          <div style={styles.summaryCardHeader}>
            <span style={styles.summaryCardIcon}>🧪</span>
            <span style={styles.summaryCardLabel}>Lipo-C</span>
          </div>
          <div style={styles.summaryCardContent}>
            <p style={styles.summaryCardDose}>Standard</p>
            <p style={styles.summaryCardMeta}>
              {lastLipoc ? `Last: ${new Date(lastLipoc.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}` : 'No injections logged'}
            </p>
            {nextLipocDate && (
              <p style={{
                ...styles.summaryCardNext,
                color: nextLipocDate <= today ? '#E57373' : '#4A6741'
              }}>
                {nextLipocDate <= today ? '⚠️ Due now' : `Next: ${nextLipocDate.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}`}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.injectionTabs}>
        <button 
          style={{...styles.injectionTab, ...(activeTab === 'log' ? styles.injectionTabActive : {})}}
          onClick={() => setActiveTab('log')}
        >
          📋 History
        </button>
        <button 
          style={{...styles.injectionTab, ...(activeTab === 'calendar' ? styles.injectionTabActive : {})}}
          onClick={() => setActiveTab('calendar')}
        >
          📅 Calendar
        </button>
        <button 
          style={{...styles.injectionTab, ...(activeTab === 'supply' ? styles.injectionTabActive : {})}}
          onClick={() => setActiveTab('supply')}
        >
          📦 Supply
        </button>
        <button 
          style={{...styles.injectionTab, ...(activeTab === 'badges' ? styles.injectionTabActive : {})}}
          onClick={() => setActiveTab('badges')}
        >
          🏆 Badges
        </button>
      </div>

      {/* Badges Tab */}
      {activeTab === 'badges' && (
        <InjectionBadgesSection user={user} sortedLog={sortedLog} />
      )}

      {/* History Tab */}
      {activeTab === 'log' && (
        <div style={styles.injectionLogList}>
          {sortedLog.length === 0 ? (
            <div style={styles.emptyState}>
              <span style={styles.emptyStateIcon}>💉</span>
              <p style={styles.emptyStateText}>No injections logged yet</p>
              <button style={styles.primaryButton} onClick={() => setShowAddModal(true)}>Log Your First Injection</button>
            </div>
          ) : (
            sortedLog.map((injection) => (
              <div key={injection.id} style={{
                ...styles.injectionLogItem,
                opacity: injection.completed ? 1 : 0.8,
                background: injection.completed ? '#FFFFFF' : '#FFFBF0'
              }}>
                <button 
                  style={{
                    ...styles.injectionCheckbox,
                    background: injection.completed ? '#4A6741' : '#FFFFFF',
                    borderColor: injection.completed ? '#4A6741' : '#D0D0D0'
                  }}
                  onClick={() => toggleInjectionComplete(injection.id)}
                >
                  {injection.completed && <span style={styles.checkboxCheck}>✓</span>}
                </button>
                <div style={{
                  ...styles.injectionLogIcon,
                  background: injection.type === 'glp1' ? '#E8EDE6' : '#E8F4F8'
                }}>
                  {injection.type === 'glp1' ? '💉' : '🧪'}
                </div>
                <div style={styles.injectionLogContent}>
                  <div style={styles.injectionLogHeader}>
                    <span style={styles.injectionLogType}>{injection.type === 'glp1' ? 'GLP-1' : 'Lipo-C'}</span>
                    <span style={styles.injectionLogDate}>
                      {new Date(injection.date).toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'})}
                    </span>
                  </div>
                  <p style={styles.injectionLogDose}>{injection.dose}</p>
                  {injection.notes && <p style={styles.injectionLogNotes}>{injection.notes}</p>}
                  {!injection.completed && (
                    <span style={styles.injectionPendingBadge}>⏳ Pending</span>
                  )}
                </div>
                <button style={styles.deleteInjectionBtn} onClick={() => deleteInjection(injection.id)}>×</button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <InjectionCalendarTab 
          user={user} 
          setUser={setUser}
          sortedLog={sortedLog}
          toggleInjectionComplete={toggleInjectionComplete}
          setShowAddModal={setShowAddModal}
        />
      )}

      {/* Supply Tab */}
      {activeTab === 'supply' && (
        <div style={styles.supplySection}>
          <div style={styles.supplyCard}>
            <div style={styles.supplyCardHeader}>
              <span style={styles.supplyCardIcon}>💉</span>
              <h3 style={styles.supplyCardTitle}>GLP-1 Supply</h3>
            </div>
            <div style={styles.supplyCardContent}>
              <div style={styles.supplyRow}>
                <span style={styles.supplyLabel}>Current Dose</span>
                <span style={styles.supplyValue}>{user.glp1Supply?.currentDose || user.medicationDose}</span>
              </div>
              <div style={styles.supplyRow}>
                <span style={styles.supplyLabel}>Weeks Remaining</span>
                <span style={{
                  ...styles.supplyValue,
                  color: (user.glp1Supply?.weeksRemaining || 0) <= 2 ? '#E57373' : '#4A6741'
                }}>
                  {user.glp1Supply?.weeksRemaining || '?'} weeks
                </span>
              </div>
              <div style={styles.supplyRow}>
                <span style={styles.supplyLabel}>Refill Date</span>
                <span style={styles.supplyValue}>{user.glp1Supply?.refillDate || 'Not set'}</span>
              </div>
            </div>
            {(user.glp1Supply?.weeksRemaining || 0) <= 2 && (
              <div style={styles.refillAlert}>
                <span>⚠️ Running low! Contact provider for refill.</span>
              </div>
            )}
          </div>

          {user.lipocSupply && (
            <div style={styles.supplyCard}>
              <div style={styles.supplyCardHeader}>
                <span style={styles.supplyCardIcon}>🧪</span>
                <h3 style={styles.supplyCardTitle}>Lipo-C Supply</h3>
              </div>
              <div style={styles.supplyCardContent}>
                <div style={styles.supplyRow}>
                  <span style={styles.supplyLabel}>Injections Remaining</span>
                  <span style={{
                    ...styles.supplyValue,
                    color: (user.lipocSupply?.injectionsRemaining || 0) <= 4 ? '#E57373' : '#4A6741'
                  }}>
                    {user.lipocSupply?.injectionsRemaining || '?'}
                  </span>
                </div>
                <div style={styles.supplyRow}>
                  <span style={styles.supplyLabel}>Refill Date</span>
                  <span style={styles.supplyValue}>{user.lipocSupply?.refillDate || 'Not set'}</span>
                </div>
              </div>
              {(user.lipocSupply?.injectionsRemaining || 0) <= 4 && (
                <div style={styles.refillAlert}>
                  <span>⚠️ Running low! Contact provider for refill.</span>
                </div>
              )}
            </div>
          )}

          <div style={styles.contactProviderBox}>
            <p style={styles.contactProviderText}>Need a refill or dose adjustment?</p>
            <a href="tel:801-917-4386" style={styles.contactProviderBtn}>📞 Call HYDR801: 801-917-4386</a>
          </div>
        </div>
      )}

      {/* Add Injection Modal */}
      {showAddModal && (
        <div style={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div style={styles.addInjectionModal} onClick={e => e.stopPropagation()}>
            <button style={styles.modalClose} onClick={() => setShowAddModal(false)}>×</button>
            <h2 style={styles.addModalTitle}>Log Injection</h2>

            <div style={styles.addModalSection}>
              <label style={styles.addModalLabel}>Medication Type</label>
              <div style={styles.typeSelector}>
                <button 
                  style={{...styles.typeSelectorBtn, ...(selectedType === 'glp1' ? styles.typeSelectorBtnActive : {})}}
                  onClick={() => setSelectedType('glp1')}
                >
                  💉 GLP-1
                </button>
                <button 
                  style={{...styles.typeSelectorBtn, ...(selectedType === 'lipoc' ? styles.typeSelectorBtnActive : {})}}
                  onClick={() => setSelectedType('lipoc')}
                >
                  🧪 Lipo-C
                </button>
              </div>
            </div>

            <div style={styles.addModalSection}>
              <label style={styles.addModalLabel}>Date</label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={styles.dateInput}
              />
            </div>

            {selectedType === 'glp1' && (
              <div style={styles.addModalSection}>
                <label style={styles.addModalLabel}>Dose</label>
                <div style={styles.doseSelector}>
                  {glp1Doses.map(dose => (
                    <button
                      key={dose}
                      style={{...styles.doseSelectorBtn, ...(selectedDose === dose ? styles.doseSelectorBtnActive : {})}}
                      onClick={() => setSelectedDose(dose)}
                    >
                      {dose}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={styles.addModalSection}>
              <label style={styles.addModalLabel}>Notes (optional)</label>
              <textarea 
                placeholder="Any side effects or notes..."
                value={injectionNotes}
                onChange={(e) => setInjectionNotes(e.target.value)}
                style={styles.notesInput}
              />
            </div>

            <button style={styles.primaryButton} onClick={addInjection}>
              Save Injection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Injection Calendar Tab Component - Enhanced with day selection and marking complete
function InjectionCalendarTab({ user, setUser, sortedLog, toggleInjectionComplete, setShowAddModal }) {
  const [viewMonth, setViewMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  
  const today = new Date();
  const currentMonth = viewMonth.getMonth();
  const currentYear = viewMonth.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDay = firstDayOfMonth.getDay();

  const calendarDays = [];
  for (let i = 0; i < startingDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const getInjectionsForDay = (day) => {
    if (!day) return [];
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return sortedLog.filter(i => i.date === dateStr);
  };

  const goToPrevMonth = () => {
    setViewMonth(new Date(currentYear, currentMonth - 1, 1));
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    setViewMonth(new Date(currentYear, currentMonth + 1, 1));
    setSelectedDay(null);
  };

  const goToToday = () => {
    setViewMonth(new Date());
    setSelectedDay(today.getDate());
  };

  const selectedDayInjections = selectedDay ? getInjectionsForDay(selectedDay) : [];
  const selectedDateStr = selectedDay 
    ? `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
    : null;

  // Calculate scheduled/expected injection dates
  const glp1Injections = sortedLog.filter(i => i.type === 'glp1' && i.completed);
  const lipocInjections = sortedLog.filter(i => i.type === 'lipoc' && i.completed);
  const lastGlp1 = glp1Injections.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  const lastLipoc = lipocInjections.sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  const getExpectedDates = () => {
    const expected = [];
    if (lastGlp1) {
      for (let i = 1; i <= 8; i++) {
        const nextDate = new Date(new Date(lastGlp1.date).getTime() + (i * 7 * 24 * 60 * 60 * 1000));
        if (nextDate.getMonth() === currentMonth && nextDate.getFullYear() === currentYear) {
          expected.push({ type: 'glp1', day: nextDate.getDate(), isExpected: true });
        }
      }
    }
    if (lastLipoc) {
      for (let i = 1; i <= 8; i++) {
        const nextDate = new Date(new Date(lastLipoc.date).getTime() + (i * 7 * 24 * 60 * 60 * 1000));
        if (nextDate.getMonth() === currentMonth && nextDate.getFullYear() === currentYear) {
          expected.push({ type: 'lipoc', day: nextDate.getDate(), isExpected: true });
        }
      }
    }
    return expected;
  };

  const expectedDates = getExpectedDates();

  const isExpectedDay = (day, type) => {
    return expectedDates.some(e => e.day === day && e.type === type);
  };

  return (
    <div style={styles.injectionCalendar}>
      {/* Month Navigation */}
      <div style={styles.calendarNavHeader}>
        <button style={styles.calendarNavBtn} onClick={goToPrevMonth}>‹</button>
        <div style={styles.calendarMonthTitle}>
          <span style={styles.calendarMonth}>
            {viewMonth.toLocaleDateString('en-US', {month: 'long', year: 'numeric'})}
          </span>
          <button style={styles.todayBtn} onClick={goToToday}>Today</button>
        </div>
        <button style={styles.calendarNavBtn} onClick={goToNextMonth}>›</button>
      </div>

      {/* Day Headers */}
      <div style={styles.calendarDaysHeader}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <span key={day} style={styles.calendarDayLabel}>{day}</span>
        ))}
      </div>

      {/* Calendar Grid */}
      <div style={styles.calendarGrid}>
        {calendarDays.map((day, idx) => {
          const injections = getInjectionsForDay(day);
          const hasGlp1Completed = injections.some(i => i.type === 'glp1' && i.completed);
          const hasGlp1Pending = injections.some(i => i.type === 'glp1' && !i.completed);
          const hasLipocCompleted = injections.some(i => i.type === 'lipoc' && i.completed);
          const hasLipocPending = injections.some(i => i.type === 'lipoc' && !i.completed);
          const glp1Expected = isExpectedDay(day, 'glp1') && !hasGlp1Completed && !hasGlp1Pending;
          const lipocExpected = isExpectedDay(day, 'lipoc') && !hasLipocCompleted && !hasLipocPending;
          const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
          const isSelected = day === selectedDay;
          const isPast = day && new Date(currentYear, currentMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
          
          return (
            <div 
              key={idx} 
              style={{
                ...styles.calendarDay,
                ...(isToday ? styles.calendarDayToday : {}),
                ...(isSelected ? styles.calendarDaySelected : {}),
                ...(day === null ? styles.calendarDayEmpty : {}),
                cursor: day ? 'pointer' : 'default',
              }}
              onClick={() => day && setSelectedDay(day === selectedDay ? null : day)}
            >
              {day && (
                <>
                  <span style={{
                    ...styles.calendarDayNumber,
                    ...(isToday ? styles.calendarDayNumberToday : {}),
                    ...(isSelected ? styles.calendarDayNumberSelected : {})
                  }}>
                    {day}
                  </span>
                  <div style={styles.calendarDots}>
                    {hasGlp1Completed && <span style={{...styles.calendarDot, background: '#4A6741'}} title="GLP-1 ✓" />}
                    {hasGlp1Pending && <span style={{...styles.calendarDotPending, borderColor: '#4A6741'}} title="GLP-1 pending" />}
                    {glp1Expected && <span style={{...styles.calendarDotExpected, background: '#4A674140'}} title="GLP-1 expected" />}
                    {hasLipocCompleted && <span style={{...styles.calendarDot, background: '#2AABB3'}} title="Lipo-C ✓" />}
                    {hasLipocPending && <span style={{...styles.calendarDotPending, borderColor: '#2AABB3'}} title="Lipo-C pending" />}
                    {lipocExpected && <span style={{...styles.calendarDotExpected, background: '#2AABB340'}} title="Lipo-C expected" />}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={styles.calendarLegendEnhanced}>
        <div style={styles.legendItem}>
          <span style={{...styles.legendDot, background: '#4A6741'}} />
          <span style={styles.legendLabel}>GLP-1 Done</span>
        </div>
        <div style={styles.legendItem}>
          <span style={{...styles.legendDot, background: '#2AABB3'}} />
          <span style={styles.legendLabel}>Lipo-C Done</span>
        </div>
        <div style={styles.legendItem}>
          <span style={{...styles.legendDotOutline, borderColor: '#4A6741'}} />
          <span style={styles.legendLabel}>Pending</span>
        </div>
        <div style={styles.legendItem}>
          <span style={{...styles.legendDotFaded}} />
          <span style={styles.legendLabel}>Expected</span>
        </div>
      </div>

      {/* Selected Day Detail */}
      {selectedDay && (
        <div style={styles.selectedDayDetail}>
          <div style={styles.selectedDayHeader}>
            <h3 style={styles.selectedDayTitle}>
              {new Date(currentYear, currentMonth, selectedDay).toLocaleDateString('en-US', {
                weekday: 'long', 
                month: 'long', 
                day: 'numeric'
              })}
            </h3>
            <button 
              style={styles.addToDayBtn}
              onClick={() => setShowAddModal(true)}
            >
              + Log
            </button>
          </div>

          {selectedDayInjections.length === 0 ? (
            <div style={styles.noDayInjections}>
              <p style={styles.noDayInjectionsText}>No injections logged for this day</p>
              {(isExpectedDay(selectedDay, 'glp1') || isExpectedDay(selectedDay, 'lipoc')) && (
                <p style={styles.expectedHint}>
                  💡 {isExpectedDay(selectedDay, 'glp1') ? 'GLP-1' : 'Lipo-C'} injection expected on this day
                </p>
              )}
            </div>
          ) : (
            <div style={styles.dayInjectionsList}>
              {selectedDayInjections.map((injection) => (
                <div 
                  key={injection.id} 
                  style={{
                    ...styles.dayInjectionItem,
                    borderLeftColor: injection.type === 'glp1' ? '#4A6741' : '#2AABB3'
                  }}
                >
                  <button 
                    style={{
                      ...styles.dayInjectionCheckbox,
                      background: injection.completed ? (injection.type === 'glp1' ? '#4A6741' : '#2AABB3') : '#FFFFFF',
                      borderColor: injection.type === 'glp1' ? '#4A6741' : '#2AABB3'
                    }}
                    onClick={() => toggleInjectionComplete(injection.id)}
                  >
                    {injection.completed && <span style={styles.checkboxCheck}>✓</span>}
                  </button>
                  <div style={styles.dayInjectionInfo}>
                    <div style={styles.dayInjectionHeader}>
                      <span style={{
                        ...styles.dayInjectionType,
                        color: injection.type === 'glp1' ? '#4A6741' : '#2AABB3'
                      }}>
                        {injection.type === 'glp1' ? '💉 GLP-1' : '🧪 Lipo-C'}
                      </span>
                      <span style={styles.dayInjectionDose}>{injection.dose}</span>
                    </div>
                    {injection.notes && (
                      <p style={styles.dayInjectionNotes}>{injection.notes}</p>
                    )}
                    <span style={{
                      ...styles.dayInjectionStatus,
                      color: injection.completed ? '#4A6741' : '#E57373',
                      background: injection.completed ? '#E8EDE6' : '#FFF5F0'
                    }}>
                      {injection.completed ? '✓ Completed' : '⏳ Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Injection Badges Section - Peloton-style achievements
function InjectionBadgesSection({ user, sortedLog }) {
  const glp1Count = sortedLog.filter(i => i.type === 'glp1' && i.completed).length;
  const lipocCount = sortedLog.filter(i => i.type === 'lipoc' && i.completed).length;
  const totalInjections = glp1Count + lipocCount;
  const ivSessions = user.achievements?.ivTherapySessions || 0;
  const weightLost = user.achievements?.totalWeightLost || 0;
  const currentStreak = user.currentStreak || 0;
  const longestStreak = user.longestStreak || 0;
  const referrals = user.referralCount || 0;
  const monthsOnProgram = user.achievements?.monthsOnProgram || 1;

  // Badge categories
  const badgeCategories = [
    {
      title: 'GLP-1 MILESTONES',
      color: '#4A6741',
      badges: [
        { id: 'first_glp1', name: 'First Injection', icon: '1', threshold: 1, current: glp1Count },
        { id: 'glp1_4', name: '4 Weeks', icon: '4', threshold: 4, current: glp1Count },
        { id: 'glp1_8', name: '8 Weeks', icon: '8', threshold: 8, current: glp1Count },
        { id: 'glp1_12', name: '12 Weeks', icon: '12', threshold: 12, current: glp1Count },
        { id: 'glp1_26', name: '6 Months', icon: '26', threshold: 26, current: glp1Count },
        { id: 'glp1_52', name: '1 Year', icon: '52', threshold: 52, current: glp1Count },
      ]
    },
    {
      title: 'LIPO-C MILESTONES',
      color: '#2AABB3',
      badges: [
        { id: 'first_lipoc', name: 'First Shot', icon: '1', threshold: 1, current: lipocCount },
        { id: 'lipoc_4', name: '4 Weeks', icon: '4', threshold: 4, current: lipocCount },
        { id: 'lipoc_8', name: '8 Weeks', icon: '8', threshold: 8, current: lipocCount },
        { id: 'lipoc_12', name: '12 Weeks', icon: '12', threshold: 12, current: lipocCount },
      ]
    },
    {
      title: 'WEIGHT LOSS',
      color: '#C4956A',
      badges: [
        { id: '5lb_lost', name: '5 lbs Lost', icon: '5', threshold: 5, current: weightLost },
        { id: '10lb_lost', name: '10 lbs Lost', icon: '10', threshold: 10, current: weightLost },
        { id: '25lb_lost', name: '25 lbs Lost', icon: '25', threshold: 25, current: weightLost },
        { id: '50lb_lost', name: '50 lbs Lost', icon: '50', threshold: 50, current: weightLost },
        { id: '75lb_lost', name: '75 lbs Lost', icon: '75', threshold: 75, current: weightLost },
        { id: '100lb_lost', name: '100 lbs Lost', icon: '💯', threshold: 100, current: weightLost },
      ]
    },
    {
      title: 'STREAKS',
      color: '#9B7E9B',
      badges: [
        { id: '7_day_streak', name: '7 Day Streak', icon: '7', threshold: 7, current: longestStreak },
        { id: '14_day_streak', name: '14 Day Streak', icon: '14', threshold: 14, current: longestStreak },
        { id: '30_day_streak', name: '30 Day Streak', icon: '30', threshold: 30, current: longestStreak },
        { id: '60_day_streak', name: '60 Day Streak', icon: '60', threshold: 60, current: longestStreak },
        { id: '90_day_streak', name: '90 Day Streak', icon: '90', threshold: 90, current: longestStreak },
      ]
    },
    {
      title: 'IV THERAPY',
      color: '#E57373',
      badges: [
        { id: 'first_iv', name: 'First IV', icon: '1', threshold: 1, current: ivSessions },
        { id: 'iv_5', name: '5 Sessions', icon: '5', threshold: 5, current: ivSessions },
        { id: 'iv_10', name: '10 Sessions', icon: '10', threshold: 10, current: ivSessions },
        { id: 'iv_25', name: '25 Sessions', icon: '25', threshold: 25, current: ivSessions },
      ]
    },
    {
      title: 'COMMUNITY',
      color: '#4A8BA8',
      badges: [
        { id: 'first_referral', name: 'First Referral', icon: '1', threshold: 1, current: referrals },
        { id: 'referral_3', name: '3 Referrals', icon: '3', threshold: 3, current: referrals },
        { id: 'referral_5', name: '5 Referrals', icon: '5', threshold: 5, current: referrals },
        { id: 'referral_10', name: '10 Referrals', icon: '10', threshold: 10, current: referrals },
      ]
    },
  ];

  // Special event badges (like Peloton's special events)
  const specialBadges = [
    { 
      id: 'new_year_2025', 
      name: 'New Year 2025', 
      description: 'Started fresh in 2025', 
      icon: '🎆',
      earned: new Date(user.startDate) >= new Date('2025-01-01'),
      color: '#FFD700'
    },
    { 
      id: 'wellness_warrior', 
      name: 'Wellness Warrior', 
      description: 'Completed all 4 goals in a day', 
      icon: '⚔️',
      earned: user.badges?.includes('wellness_warrior'),
      color: '#9B7E9B'
    },
    { 
      id: 'protein_champion', 
      name: 'Protein Champion', 
      description: 'Hit protein goal 7 days straight', 
      icon: '🥩',
      earned: user.badges?.includes('protein_champion') || (user.achievements?.proteinGoalsMet >= 7),
      color: '#C4956A'
    },
    { 
      id: 'hydration_hero', 
      name: 'Hydration Hero', 
      description: 'Hit water goal 7 days straight', 
      icon: '💧',
      earned: user.badges?.includes('hydration_hero') || (user.achievements?.hydrationGoalsMet >= 7),
      color: '#2AABB3'
    },
    { 
      id: 'month_1', 
      name: '1 Month Strong', 
      description: 'Completed first month', 
      icon: '🌟',
      earned: monthsOnProgram >= 1,
      color: '#4A6741'
    },
    { 
      id: 'month_3', 
      name: '3 Month Milestone', 
      description: 'Completed 3 months', 
      icon: '🏅',
      earned: monthsOnProgram >= 3,
      color: '#FFD700'
    },
  ];

  const totalEarned = badgeCategories.reduce((sum, cat) => 
    sum + cat.badges.filter(b => b.current >= b.threshold).length, 0
  ) + specialBadges.filter(b => b.earned).length;

  const totalPossible = badgeCategories.reduce((sum, cat) => sum + cat.badges.length, 0) + specialBadges.length;

  return (
    <div style={styles.badgesSectionContainer}>
      {/* Achievement Summary */}
      <div style={styles.badgesSummary}>
        <div style={styles.badgesSummaryIcon}>🏆</div>
        <div style={styles.badgesSummaryContent}>
          <p style={styles.badgesSummaryTitle}>{totalEarned} Badges Earned</p>
          <p style={styles.badgesSummarySubtitle}>{totalPossible - totalEarned} more to unlock</p>
        </div>
        <div style={styles.badgesSummaryProgress}>
          <div style={{
            ...styles.badgesSummaryProgressFill,
            width: `${(totalEarned / totalPossible) * 100}%`
          }} />
        </div>
      </div>

      {/* Special Events */}
      <div style={styles.badgeCategory}>
        <h3 style={styles.badgeCategoryTitle}>SPECIAL ACHIEVEMENTS</h3>
        <div style={styles.specialBadgesScroll}>
          {specialBadges.map(badge => (
            <div 
              key={badge.id}
              style={{
                ...styles.specialBadgeCard,
                opacity: badge.earned ? 1 : 0.4,
                background: badge.earned 
                  ? `linear-gradient(145deg, ${badge.color}15 0%, ${badge.color}30 100%)`
                  : '#F5F4F2'
              }}
            >
              <div style={{
                ...styles.specialBadgeIcon,
                border: badge.earned ? `3px solid ${badge.color}` : '3px solid #D0D0D0'
              }}>
                <span style={styles.specialBadgeEmoji}>{badge.icon}</span>
              </div>
              <p style={styles.specialBadgeName}>{badge.name}</p>
              {badge.earned && <span style={styles.specialBadgeCheck}>✓</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Milestone Categories */}
      {badgeCategories.map(category => (
        <div key={category.title} style={styles.badgeCategory}>
          <h3 style={styles.badgeCategoryTitle}>{category.title}</h3>
          <div style={styles.milestoneBadgesContainer}>
            <div style={styles.milestoneBadgesScroll}>
              {category.badges.map(badge => {
                const earned = badge.current >= badge.threshold;
                const progress = Math.min(100, (badge.current / badge.threshold) * 100);
                
                return (
                  <div 
                    key={badge.id}
                    style={{
                      ...styles.milestoneBadge,
                      opacity: earned ? 1 : 0.5,
                    }}
                  >
                    <div style={{
                      ...styles.milestoneBadgeCircle,
                      background: earned 
                        ? `linear-gradient(145deg, ${category.color} 0%, ${category.color}CC 100%)`
                        : '#2D2D2D',
                      borderColor: earned ? category.color : '#444',
                    }}>
                      {/* Progress ring for unearned badges */}
                      {!earned && (
                        <svg 
                          style={styles.milestoneBadgeProgress}
                          viewBox="0 0 80 80"
                        >
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            fill="none"
                            stroke={category.color}
                            strokeWidth="4"
                            strokeDasharray={`${(progress / 100) * 226} 226`}
                            strokeLinecap="round"
                            transform="rotate(-90 40 40)"
                            opacity="0.6"
                          />
                        </svg>
                      )}
                      <span style={{
                        ...styles.milestoneBadgeNumber,
                        color: earned ? '#FFFFFF' : category.color
                      }}>
                        {badge.icon}
                      </span>
                    </div>
                    <p style={styles.milestoneBadgeName}>{badge.name}</p>
                    {!earned && (
                      <p style={styles.milestoneBadgeProgressText}>
                        {badge.current}/{badge.threshold}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Fitness Screen
function FitnessScreen({ user, setUser }) {
  const [showAssessment, setShowAssessment] = useState(false);
  const [showWorkoutPlayer, setShowWorkoutPlayer] = useState(false);

  // Show workout player when started
  if (showWorkoutPlayer && user.workoutPlan) {
    return (
      <WorkoutPlayer 
        workout={user.workoutPlan?.weeklyPlan?.workouts?.[0]}
        user={user}
        onComplete={() => {
          setShowWorkoutPlayer(false);
          // Award points for completing workout
          setUser({
            ...user,
            totalPoints: (user.totalPoints || 0) + 100,
            exerciseCurrent: user.exerciseGoal // Mark as completed
          });
        }}
        onExit={() => setShowWorkoutPlayer(false)}
      />
    );
  }

  if (!user.fitnessAssessmentComplete && !showAssessment) {
    return (
      <div style={styles.screenContent} className="fade-in">
        <header style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Fitness</h1>
          <p style={styles.pageSubtitle}>Movement for your journey</p>
        </header>
        
        <div style={styles.assessmentPrompt}>
          <div style={styles.aiAssessmentBadge}>
            <span style={styles.aiBadgeIcon}>✨</span>
            <span style={styles.aiBadgeText}>AI-Powered</span>
          </div>
          <div style={styles.assessmentIllustration}>
            <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
              <circle cx="70" cy="70" r="65" fill="#E8EDE6"/>
              <circle cx="70" cy="70" r="50" stroke="#4A6741" strokeWidth="2" strokeDasharray="8 4"/>
              <path d="M70 40V70L90 90" stroke="#4A6741" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="70" cy="70" r="6" fill="#4A6741"/>
              <circle cx="70" cy="30" r="4" fill="#2AABB3"/>
              <circle cx="110" cy="70" r="4" fill="#C4956A"/>
              <circle cx="70" cy="110" r="4" fill="#9B7E9B"/>
              <circle cx="30" cy="70" r="4" fill="#4A6741"/>
            </svg>
          </div>
          <h2 style={styles.assessmentTitle}>Smart Fitness Assessment</h2>
          <p style={styles.assessmentDesc}>
            Our AI will guide you through simple movements using your camera to analyze your 
            mobility, strength, and balance—then create a personalized workout plan for your GLP-1 journey.
          </p>
          
          <div style={styles.assessmentFeatures}>
            <div style={styles.assessmentFeature}>
              <span style={styles.featureIcon}>📷</span>
              <span style={styles.featureText}>Camera-guided movements</span>
            </div>
            <div style={styles.assessmentFeature}>
              <span style={styles.featureIcon}>🤖</span>
              <span style={styles.featureText}>Real-time AI analysis</span>
            </div>
            <div style={styles.assessmentFeature}>
              <span style={styles.featureIcon}>📋</span>
              <span style={styles.featureText}>Personalized workout plan</span>
            </div>
          </div>
          
          <button style={styles.primaryButton} className="btn-primary" onClick={() => setShowAssessment(true)}>
            Start AI Assessment
          </button>
          <p style={styles.assessmentNote}>Takes about 3-5 minutes · Camera required</p>
        </div>
      </div>
    );
  }

  if (showAssessment) {
    return (
      <AIFitnessAssessment 
        onComplete={(results) => {
          setUser({
            ...user, 
            fitnessAssessmentComplete: true,
            fitnessLevel: results.level,
            workoutPlan: results.plan,
            equipment: results.equipment || []
          });
          setShowAssessment(false);
        }}
        onCancel={() => setShowAssessment(false)}
      />
    );
  }

  return <FitnessHomeScreen user={user} />;
}

// AI Fitness Assessment Component
function AIFitnessAssessment({ onComplete, onCancel }) {
  const [stage, setStage] = useState('intro'); // intro, camera-setup, exercise, equipment, analyzing, results
  const [currentExercise, setCurrentExercise] = useState(0);
  const [exerciseState, setExerciseState] = useState('ready'); // ready, countdown, performing, captured, analyzing
  const [countdown, setCountdown] = useState(3);
  const [capturedFrames, setCapturedFrames] = useState([]);
  const [analysisResults, setAnalysisResults] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [finalResults, setFinalResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const exercises = [
    {
      id: 'squat',
      name: 'Bodyweight Squat',
      instruction: 'Stand with feet shoulder-width apart, then lower into a squat position',
      duration: 5,
      icon: '🏋️',
      analyzeFor: ['depth', 'knee_alignment', 'back_position']
    },
    {
      id: 'balance',
      name: 'Single Leg Balance',
      instruction: 'Stand on one leg with arms out to the sides for balance',
      duration: 5,
      icon: '🧘',
      analyzeFor: ['stability', 'posture', 'duration']
    },
    {
      id: 'reach',
      name: 'Overhead Reach',
      instruction: 'Raise both arms straight overhead and stretch upward',
      duration: 4,
      icon: '🙆',
      analyzeFor: ['shoulder_mobility', 'spine_alignment', 'range_of_motion']
    },
    {
      id: 'march',
      name: 'Standing March',
      instruction: 'March in place, bringing knees up to hip level',
      duration: 5,
      icon: '🚶',
      analyzeFor: ['hip_mobility', 'coordination', 'posture']
    }
  ];

  const equipmentOptions = [
    { id: 'none', name: 'No Equipment', icon: '🏠', description: 'Bodyweight exercises only' },
    { id: 'dumbbells', name: 'Dumbbells', icon: '🏋️', description: 'Any weight set' },
    { id: 'resistance_bands', name: 'Resistance Bands', icon: '🔴', description: 'Loop or tube bands' },
    { id: 'kettlebell', name: 'Kettlebell', icon: '🔔', description: 'Any size kettlebell' },
    { id: 'yoga_mat', name: 'Yoga Mat', icon: '🧘', description: 'For floor exercises' },
    { id: 'stability_ball', name: 'Stability Ball', icon: '⚪', description: 'Exercise/Swiss ball' },
    { id: 'pull_up_bar', name: 'Pull-Up Bar', icon: '🚪', description: 'Doorway or mounted' },
    { id: 'bench', name: 'Workout Bench', icon: '🪑', description: 'Flat or adjustable' },
    { id: 'foam_roller', name: 'Foam Roller', icon: '🧴', description: 'For recovery & mobility' },
    { id: 'jump_rope', name: 'Jump Rope', icon: '〰️', description: 'For cardio workouts' },
    { id: 'trx', name: 'TRX/Suspension', icon: '⛓️', description: 'Suspension trainer' },
    { id: 'gym_access', name: 'Full Gym Access', icon: '🏢', description: 'Machines & full equipment' },
  ];

  const toggleEquipment = (id) => {
    if (id === 'none') {
      setSelectedEquipment(['none']);
    } else {
      setSelectedEquipment(prev => {
        const filtered = prev.filter(e => e !== 'none');
        if (filtered.includes(id)) {
          return filtered.filter(e => e !== id);
        } else {
          return [...filtered, id];
        }
      });
    }
  };

  // Camera setup - Mobile optimized
  const startCamera = useCallback(async () => {
    try {
      // Check if we're in a secure context (HTTPS required for camera)
      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        setCameraError('Camera requires a secure connection (HTTPS). Please access this app via HTTPS.');
        return;
      }
      
      // Check if camera is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera not supported on this device. Please use the manual assessment instead.');
        return;
      }
      
      // Mobile-optimized constraints
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const constraints = {
        video: {
          facingMode: 'user', // Front camera for selfie view
          width: isMobile ? { ideal: 480 } : { ideal: 640 },
          height: isMobile ? { ideal: 640 } : { ideal: 480 },
        },
        audio: false
      };
      
      // Try to get camera stream
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (firstError) {
        // If specific constraints fail, try with basic constraints
        console.log('First attempt failed, trying basic constraints');
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Mobile-specific attributes
        videoRef.current.setAttribute('autoplay', '');
        videoRef.current.setAttribute('playsinline', '');
        videoRef.current.setAttribute('muted', '');
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = async () => {
          try {
            // Mobile browsers often need user interaction to play
            await videoRef.current.play();
            setStage('exercise');
          } catch (playErr) {
            console.warn('Auto-play prevented, proceeding anyway:', playErr);
            setStage('exercise');
          }
        };
        
        // Fallback if onloadedmetadata doesn't fire
        setTimeout(() => {
          if (stage === 'camera-setup') {
            videoRef.current?.play().catch(() => {});
            setStage('exercise');
          }
        }, 3000);
      } else {
        setStage('exercise');
      }
    } catch (err) {
      console.error('Camera error:', err);
      let errorMessage = 'Unable to access camera. ';
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = 'Camera permission denied. Please allow camera access:\n\n';
        errorMessage += '• iPhone/iPad: Settings → Safari → Camera → Allow\n';
        errorMessage += '• Android: Settings → Apps → Browser → Permissions → Camera\n';
        errorMessage += '• Or tap the camera icon in your browser\'s address bar';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = 'No camera found. Please make sure your device has a camera.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage = 'Camera is in use by another app. Please close other apps using the camera and try again.';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'Camera settings not supported. Please try again.';
      } else if (err.name === 'SecurityError') {
        errorMessage = 'Camera access blocked. This app requires HTTPS for camera access.';
      } else {
        errorMessage += 'Please check your camera permissions and try again.';
      }
      
      setCameraError(errorMessage);
    }
  }, [stage]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  // Re-attach stream when entering exercise stage (fixes mobile video display)
  useEffect(() => {
    if (stage === 'exercise' && streamRef.current && videoRef.current) {
      // Re-attach the stream to the video element
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(err => {
        console.warn('Video play error on stage change:', err);
      });
    }
  }, [stage]);

  // Capture frame from video
  const captureFrame = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      return canvas.toDataURL('image/jpeg', 0.8);
    }
    return null;
  }, []);

  // Exercise flow
  const startExercise = useCallback(() => {
    setExerciseState('countdown');
    setCountdown(3);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (exerciseState === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (exerciseState === 'countdown' && countdown === 0) {
      setExerciseState('performing');
      setCapturedFrames([]);
    }
  }, [exerciseState, countdown]);

  // Capture frames periodically during exercise (but don't auto-advance)
  useEffect(() => {
    if (exerciseState === 'performing') {
      // Capture a frame every 2 seconds for analysis
      const captureInterval = setInterval(() => {
        const frame = captureFrame();
        if (frame) {
          setCapturedFrames(prev => {
            // Keep only last 5 frames to avoid memory issues
            const newFrames = [...prev, frame];
            return newFrames.slice(-5);
          });
        }
      }, 2000);

      return () => {
        clearInterval(captureInterval);
      };
    }
  }, [exerciseState, captureFrame]);

  // User manually completes exercise
  const completeExercise = useCallback(() => {
    // Capture one final frame
    const finalFrame = captureFrame();
    if (finalFrame) {
      setCapturedFrames(prev => [...prev, finalFrame]);
    }
    setExerciseState('captured');
  }, [captureFrame]);

  // Analyze captured frames with AI
  useEffect(() => {
    if (exerciseState === 'captured' && capturedFrames.length > 0) {
      analyzeExercise();
    }
  }, [exerciseState, capturedFrames]);

  const analyzeExercise = async () => {
    setExerciseState('analyzing');
    setIsAnalyzing(true);

    const exercise = exercises[currentExercise];
    
    // Select best frames (first, middle, last)
    const frameIndices = [0, Math.floor(capturedFrames.length / 2), capturedFrames.length - 1];
    const selectedFrames = frameIndices.map(i => capturedFrames[Math.min(i, capturedFrames.length - 1)]);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: [
              ...selectedFrames.map((frame, idx) => ({
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: frame.split(',')[1]
                }
              })),
              {
                type: 'text',
                text: `You are a fitness assessment AI for a GLP-1 wellness app. Analyze these ${selectedFrames.length} images of a person performing a "${exercise.name}" exercise.

The person was instructed to: "${exercise.instruction}"

Please analyze their form and provide a JSON response with the following structure (respond ONLY with JSON, no markdown):
{
  "exerciseDetected": true/false,
  "formScore": 1-10,
  "observations": ["observation 1", "observation 2"],
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "mobilityLevel": "limited" | "moderate" | "good" | "excellent",
  "safetyNotes": ["any safety concerns"]
}

Be encouraging but honest. Consider that this person is on a GLP-1 medication for weight management and may be new to exercise. Focus on what they did well while noting areas for improvement.`
              }
            ]
          }]
        })
      });

      const data = await response.json();
      const analysisText = data.content.map(c => c.text || '').join('');
      
      // Parse JSON from response
      let analysis;
      try {
        const cleanJson = analysisText.replace(/```json|```/g, '').trim();
        analysis = JSON.parse(cleanJson);
      } catch {
        // Default analysis if parsing fails
        analysis = {
          exerciseDetected: true,
          formScore: 7,
          observations: ['Movement detected and analyzed'],
          strengths: ['Good effort and willingness to assess'],
          improvements: ['Continue practicing for better form'],
          mobilityLevel: 'moderate',
          safetyNotes: []
        };
      }

      setAnalysisResults(prev => [...prev, { exercise: exercise.id, ...analysis }]);
      setIsAnalyzing(false);

      // Move to next exercise or finish
      if (currentExercise < exercises.length - 1) {
        setCurrentExercise(currentExercise + 1);
        setExerciseState('ready');
        setCapturedFrames([]);
      } else {
        // Go to equipment selection instead of directly to analyzing
        setStage('equipment');
      }

    } catch (error) {
      console.error('Analysis error:', error);
      // Continue with default results on error
      const defaultAnalysis = {
        exerciseDetected: true,
        formScore: 7,
        observations: ['Movement completed'],
        strengths: ['Completed the exercise'],
        improvements: ['Keep practicing'],
        mobilityLevel: 'moderate',
        safetyNotes: []
      };
      
      setAnalysisResults(prev => [...prev, { exercise: exercise.id, ...defaultAnalysis }]);
      setIsAnalyzing(false);

      if (currentExercise < exercises.length - 1) {
        setCurrentExercise(currentExercise + 1);
        setExerciseState('ready');
        setCapturedFrames([]);
      } else {
        // Go to equipment selection instead of directly to analyzing
        setStage('equipment');
      }
    }
  };

  const generateFinalResults = async (allResults, equipment) => {
    setStage('analyzing');
    stopCamera();

    const equipmentList = equipment.length > 0 
      ? equipment.map(id => equipmentOptions.find(e => e.id === id)?.name).filter(Boolean).join(', ')
      : 'No equipment (bodyweight only)';

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [{
            role: 'user',
            content: `You are a fitness coach AI creating a personalized workout plan for a GLP-1 patient. Based on these fitness assessment results and available equipment, create a comprehensive but gentle workout plan.

Assessment Results:
${JSON.stringify(allResults, null, 2)}

Available Equipment: ${equipmentList}

Create a JSON response with this structure (respond ONLY with JSON, no markdown):
{
  "overallLevel": "beginner" | "intermediate" | "advanced",
  "overallScore": 1-100,
  "summary": "2-3 sentence summary of their fitness level",
  "strengths": ["key strength 1", "key strength 2", "key strength 3"],
  "focusAreas": ["area to improve 1", "area to improve 2"],
  "equipmentUsed": ["list of equipment incorporated into the plan"],
  "weeklyPlan": {
    "daysPerWeek": 3-5,
    "minutesPerSession": 15-45,
    "workouts": [
      {
        "day": "Monday",
        "name": "Workout Name",
        "type": "strength" | "cardio" | "flexibility" | "balance",
        "duration": "XX min",
        "exercises": [
          {"name": "Exercise", "sets": "X", "reps": "X", "equipment": "equipment needed or bodyweight", "notes": "any modifications"}
        ]
      }
    ]
  },
  "safetyRecommendations": ["recommendation 1", "recommendation 2"],
  "progressionTips": ["tip for advancing over time"],
  "equipmentToBuy": ["optional equipment that would enhance their workouts"]
}

Important considerations:
- This person is on GLP-1 medication for weight management
- Focus on muscle preservation (very important during weight loss)
- ONLY use exercises that match their available equipment: ${equipmentList}
- Include low-impact options
- Emphasize consistency over intensity
- Make it achievable and encouraging
- If they have limited equipment, be creative with bodyweight variations`
          }]
        })
      });

      const data = await response.json();
      const planText = data.content.map(c => c.text || '').join('');
      
      let plan;
      try {
        const cleanJson = planText.replace(/```json|```/g, '').trim();
        plan = JSON.parse(cleanJson);
      } catch {
        plan = getDefaultPlan();
      }

      setFinalResults(plan);
      setStage('results');

    } catch (error) {
      console.error('Plan generation error:', error);
      setFinalResults(getDefaultPlan(selectedEquipment));
      setStage('results');
    }
  };

  const getDefaultPlan = (equipment = []) => ({
    overallLevel: 'beginner',
    overallScore: 65,
    summary: 'You show good foundational movement patterns with room for improvement in mobility and stability. A gentle, progressive program will help you build strength while preserving muscle during your GLP-1 journey.',
    strengths: ['Willingness to move', 'Basic movement patterns', 'Good attitude'],
    focusAreas: ['Core stability', 'Lower body strength', 'Flexibility'],
    equipmentUsed: equipment.length > 0 ? equipment : ['Bodyweight'],
    weeklyPlan: {
      daysPerWeek: 3,
      minutesPerSession: 20,
      workouts: [
        {
          day: 'Monday',
          name: 'Gentle Strength',
          type: 'strength',
          duration: '20 min',
          exercises: [
            { name: 'Wall Push-ups', sets: '2', reps: '10', equipment: 'Bodyweight', notes: 'Keep core engaged' },
            { name: 'Chair Squats', sets: '2', reps: '8', equipment: 'Bodyweight', notes: 'Use chair for support' },
            { name: equipment.includes('resistance_bands') ? 'Banded Rows' : 'Standing Rows', sets: '2', reps: '10', equipment: equipment.includes('resistance_bands') ? 'Resistance Band' : 'Bodyweight', notes: 'Squeeze shoulder blades' }
          ]
        },
        {
          day: 'Wednesday',
          name: 'Balance & Core',
          type: 'balance',
          duration: '20 min',
          exercises: [
            { name: 'Single Leg Stands', sets: '2', reps: '30 sec each', equipment: 'Bodyweight', notes: 'Hold wall if needed' },
            { name: 'Bird Dogs', sets: '2', reps: '8 each side', equipment: equipment.includes('yoga_mat') ? 'Yoga Mat' : 'Bodyweight', notes: 'Slow and controlled' },
            { name: 'Gentle Stretching', sets: '1', reps: '5 min', equipment: equipment.includes('yoga_mat') ? 'Yoga Mat' : 'Bodyweight', notes: 'Full body' }
          ]
        },
        {
          day: 'Friday',
          name: 'Active Recovery',
          type: 'cardio',
          duration: '20 min',
          exercises: [
            { name: 'Walking', sets: '1', reps: '15 min', equipment: 'None', notes: 'Moderate pace' },
            { name: 'Arm Circles', sets: '2', reps: '10 each direction', equipment: 'Bodyweight', notes: 'Warm up shoulders' },
            { name: 'Calf Raises', sets: '2', reps: '12', equipment: 'Bodyweight', notes: 'Hold wall for balance' }
          ]
        }
      ]
    },
    safetyRecommendations: ['Stay hydrated during workouts', 'Stop if you feel dizzy', 'Listen to your body'],
    progressionTips: ['Add 1-2 reps per week', 'Gradually increase duration'],
    equipmentToBuy: equipment.length === 0 || equipment.includes('none') ? ['Resistance bands - versatile and affordable', 'Yoga mat for floor exercises'] : []
  });

  // Render different stages
  if (stage === 'intro') {
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.assessmentHeader}>
          <button style={styles.backButton} onClick={onCancel}>← Back</button>
          <h2 style={styles.assessmentStageTitle}>AI Fitness Assessment</h2>
        </div>
        
        <div style={styles.introContent}>
          <div style={styles.cameraPreviewBox}>
            <div style={styles.cameraIcon}>📷</div>
            <p style={styles.cameraText}>Camera Preview</p>
          </div>
          
          <h3 style={styles.introTitle}>Here's what we'll do:</h3>
          <div style={styles.exercisePreviewList}>
            {exercises.map((ex, idx) => (
              <div key={idx} style={styles.exercisePreviewItem}>
                <span style={styles.exercisePreviewIcon}>{ex.icon}</span>
                <div>
                  <p style={styles.exercisePreviewName}>{ex.name}</p>
                  <p style={styles.exercisePreviewDuration}>{ex.duration} seconds</p>
                </div>
              </div>
            ))}
          </div>
          
          <div style={styles.privacyNote}>
            <span style={styles.privacyIcon}>🔒</span>
            <p style={styles.privacyText}>Your video is analyzed in real-time and never stored. Privacy first.</p>
          </div>
          
          <button style={styles.primaryButton} className="btn-primary" onClick={() => { setStage('camera-setup'); startCamera(); }}>
            Enable Camera & Start
          </button>
          <button style={styles.secondaryButton} onClick={() => setStage('manual')}>
            Quick Assessment (No Camera)
          </button>
        </div>
      </div>
    );
  }

  if (cameraError) {
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>📷</div>
          <h2 style={styles.errorTitle}>Camera Access Needed</h2>
          <p style={{...styles.errorText, whiteSpace: 'pre-line', textAlign: 'left', maxWidth: '300px'}}>{cameraError}</p>
          <button style={styles.primaryButton} className="btn-primary" onClick={() => { setCameraError(null); startCamera(); }}>
            Try Again
          </button>
          <button style={styles.secondaryButton} onClick={() => setStage('manual')}>
            Quick Assessment Instead
          </button>
          <button style={{...styles.secondaryButton, marginTop: '8px', background: 'transparent'}} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Manual/Quick Assessment without camera
  if (stage === 'manual') {
    const fitnessLevels = [
      { id: 'beginner', label: 'Beginner', desc: 'New to exercise or returning after a long break', icon: '🌱' },
      { id: 'intermediate', label: 'Intermediate', desc: 'Exercise 2-3 times per week regularly', icon: '🌿' },
      { id: 'advanced', label: 'Advanced', desc: 'Exercise 4+ times per week with good form', icon: '🌳' }
    ];
    
    return (
      <div style={styles.screenContent} className="fade-in">
        <header style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Quick Assessment</h1>
          <p style={styles.pageSubtitle}>Select your fitness level</p>
        </header>
        
        <div style={styles.manualAssessmentList}>
          {fitnessLevels.map(level => (
            <button
              key={level.id}
              style={styles.fitnessLevelCard}
              onClick={() => {
                setStage('equipment');
                // Set a mock result based on selection
                setAnalysisResult({
                  fitnessLevel: level.id,
                  scores: {
                    strength: level.id === 'beginner' ? 40 : level.id === 'intermediate' ? 65 : 85,
                    flexibility: level.id === 'beginner' ? 45 : level.id === 'intermediate' ? 60 : 80,
                    balance: level.id === 'beginner' ? 50 : level.id === 'intermediate' ? 70 : 85,
                    endurance: level.id === 'beginner' ? 35 : level.id === 'intermediate' ? 60 : 82
                  },
                  summary: `Based on your self-assessment as ${level.label.toLowerCase()}, we'll create a personalized workout plan.`
                });
              }}
            >
              <span style={styles.fitnessLevelIcon}>{level.icon}</span>
              <div style={styles.fitnessLevelContent}>
                <h3 style={styles.fitnessLevelTitle}>{level.label}</h3>
                <p style={styles.fitnessLevelDesc}>{level.desc}</p>
              </div>
              <span style={styles.fitnessLevelArrow}>→</span>
            </button>
          ))}
        </div>
        
        <button style={styles.secondaryButton} onClick={onCancel}>
          Cancel
        </button>
      </div>
    );
  }

  if (stage === 'camera-setup') {
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.cameraSetupContainer}>
          <div style={styles.loadingSpinner} className="pulse">
            <span style={styles.spinnerIcon}>📷</span>
          </div>
          <p style={styles.setupText}>Setting up camera...</p>
        </div>
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          webkit-playsinline="true"
          x5-playsinline="true"
          style={{ display: 'none' }} 
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    );
  }

  if (stage === 'exercise') {
    const exercise = exercises[currentExercise];
    
    return (
      <div style={styles.cameraFullScreen}>
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted
          webkit-playsinline="true"
          x5-playsinline="true"
          x5-video-player-type="h5"
          style={styles.cameraVideo}
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        {/* Overlay UI */}
        <div style={styles.cameraOverlay}>
          {/* Progress indicator */}
          <div style={styles.exerciseProgress}>
            {exercises.map((_, idx) => (
              <div 
                key={idx} 
                style={{
                  ...styles.exerciseProgressDot,
                  backgroundColor: idx < currentExercise ? '#4A6741' : idx === currentExercise ? '#FFFFFF' : 'rgba(255,255,255,0.3)'
                }}
              />
            ))}
          </div>
          
          {/* Exercise info card */}
          <div style={styles.exerciseInfoCard}>
            <span style={styles.exerciseNumber}>Exercise {currentExercise + 1} of {exercises.length}</span>
            <h2 style={styles.exerciseNameLarge}>{exercise.icon} {exercise.name}</h2>
            <p style={styles.exerciseInstruction}>{exercise.instruction}</p>
          </div>

          {/* Center content based on state */}
          {exerciseState === 'ready' && (
            <div style={styles.centerContent}>
              <button style={styles.startExerciseButton} onClick={startExercise}>
                <span style={styles.startButtonText}>Start</span>
              </button>
              <p style={styles.positionText}>Position yourself in frame</p>
            </div>
          )}

          {exerciseState === 'countdown' && (
            <div style={styles.centerContent}>
              <div style={styles.countdownCircle} className="pulse">
                <span style={styles.countdownNumber}>{countdown}</span>
              </div>
              <p style={styles.getReadyText}>Get ready!</p>
            </div>
          )}

          {exerciseState === 'performing' && (
            <div style={styles.centerContent}>
              <div style={styles.performingContainer}>
                <div style={styles.recordingIndicator}>
                  <div style={styles.recordingDot} />
                  <span style={styles.recordingText}>Recording</span>
                </div>
                <p style={styles.performingInstructions}>
                  Perform the exercise at your own pace
                </p>
                <button 
                  style={styles.completeExerciseButton} 
                  onClick={completeExercise}
                  className="btn-primary"
                >
                  ✓ I Did It!
                </button>
                <p style={styles.performingHint}>Tap when you've completed the exercise</p>
              </div>
            </div>
          )}

          {(exerciseState === 'captured' || exerciseState === 'analyzing') && (
            <div style={styles.centerContent}>
              <div style={styles.analyzingSpinner} className="breathe">
                <span style={styles.analyzingIcon}>🤖</span>
              </div>
              <p style={styles.analyzingText}>AI analyzing your form...</p>
            </div>
          )}

          {/* Cancel button */}
          <button style={styles.cancelAssessmentButton} onClick={() => { stopCamera(); onCancel(); }}>
            ✕
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'analyzing') {
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.analyzingContainer}>
          <div style={styles.analyzingAnimation} className="breathe">
            <span style={styles.analyzingMainIcon}>🤖</span>
          </div>
          <h2 style={styles.analyzingTitle}>Creating Your Plan</h2>
          <p style={styles.analyzingSubtext}>Our AI is analyzing your movements and building a personalized workout plan with your equipment...</p>
          
          <div style={styles.analysisSteps}>
            <div style={styles.analysisStep}>
              <span style={styles.stepCheck}>✓</span>
              <span style={styles.stepText}>Movement analysis complete</span>
            </div>
            <div style={styles.analysisStep}>
              <span style={styles.stepCheck}>✓</span>
              <span style={styles.stepText}>Form assessment done</span>
            </div>
            <div style={styles.analysisStep}>
              <span style={styles.stepCheck}>✓</span>
              <span style={styles.stepText}>Equipment preferences saved</span>
            </div>
            <div style={{...styles.analysisStep, opacity: 0.6}}>
              <span style={styles.stepSpinner}>â—‹</span>
              <span style={styles.stepText}>Generating workout plan...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'equipment') {
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.assessmentHeader}>
          <button style={styles.backButton} onClick={() => setStage('exercise')}>← Back</button>
          <h2 style={styles.assessmentStageTitle}>Your Equipment</h2>
        </div>

        <div style={styles.equipmentIntro}>
          <div style={styles.equipmentIcon}>🎒</div>
          <h3 style={styles.equipmentTitle}>What equipment do you have?</h3>
          <p style={styles.equipmentSubtitle}>Select all that you have access to. We'll create workouts that use your available equipment.</p>
        </div>

        <div style={styles.equipmentGrid}>
          {equipmentOptions.map((item) => (
            <div
              key={item.id}
              style={{
                ...styles.equipmentCard,
                ...(selectedEquipment.includes(item.id) ? styles.equipmentCardSelected : {})
              }}
              onClick={() => toggleEquipment(item.id)}
            >
              <div style={styles.equipmentCardIcon}>{item.icon}</div>
              <div style={styles.equipmentCardContent}>
                <p style={styles.equipmentCardName}>{item.name}</p>
                <p style={styles.equipmentCardDesc}>{item.description}</p>
              </div>
              <div style={{
                ...styles.equipmentCheckbox,
                ...(selectedEquipment.includes(item.id) ? styles.equipmentCheckboxSelected : {})
              }}>
                {selectedEquipment.includes(item.id) && '✓'}
              </div>
            </div>
          ))}
        </div>

        <div style={styles.equipmentFooter}>
          <p style={styles.equipmentNote}>
            {selectedEquipment.length === 0 
              ? 'Select at least one option to continue'
              : selectedEquipment.includes('none')
                ? 'Bodyweight workouts selected'
                : `${selectedEquipment.length} item${selectedEquipment.length > 1 ? 's' : ''} selected`
            }
          </p>
          <button 
            style={{
              ...styles.primaryButton,
              opacity: selectedEquipment.length === 0 ? 0.5 : 1
            }} 
            className="btn-primary"
            disabled={selectedEquipment.length === 0}
            onClick={() => {
              if (selectedEquipment.length > 0) {
                generateFinalResults(analysisResults, selectedEquipment);
              }
            }}
          >
            Generate My Workout Plan
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'results' && finalResults) {
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.resultsHeader}>
          <div style={styles.resultsBadge}>
            <span style={styles.resultsBadgeText}>Assessment Complete</span>
          </div>
          <div style={styles.scoreCircle}>
            <span style={styles.scoreNumber}>{finalResults.overallScore}</span>
            <span style={styles.scoreLabel}>Score</span>
          </div>
          <h2 style={styles.levelBadge}>{finalResults.overallLevel.charAt(0).toUpperCase() + finalResults.overallLevel.slice(1)} Level</h2>
          <p style={styles.summaryText}>{finalResults.summary}</p>
        </div>

        <div style={styles.resultsSection}>
          <h3 style={styles.resultsSectionTitle}>💪 Your Strengths</h3>
          <div style={styles.tagList}>
            {finalResults.strengths.map((s, i) => (
              <span key={i} style={styles.strengthTag}>{s}</span>
            ))}
          </div>
        </div>

        <div style={styles.resultsSection}>
          <h3 style={styles.resultsSectionTitle}>🎯 Focus Areas</h3>
          <div style={styles.tagList}>
            {finalResults.focusAreas.map((f, i) => (
              <span key={i} style={styles.focusTag}>{f}</span>
            ))}
          </div>
        </div>

        {finalResults.equipmentUsed && finalResults.equipmentUsed.length > 0 && (
          <div style={styles.resultsSection}>
            <h3 style={styles.resultsSectionTitle}>🎒 Equipment in Your Plan</h3>
            <div style={styles.tagList}>
              {finalResults.equipmentUsed.map((e, i) => (
                <span key={i} style={styles.equipmentTag}>{e}</span>
              ))}
            </div>
          </div>
        )}

        <div style={styles.resultsSection}>
          <h3 style={styles.resultsSectionTitle}>📅 Your Weekly Plan</h3>
          <p style={styles.planOverview}>
            {finalResults.weeklyPlan.daysPerWeek} days/week · {finalResults.weeklyPlan.minutesPerSession} min/session
          </p>
          <div style={styles.workoutPreviewList}>
            {finalResults.weeklyPlan.workouts.slice(0, 3).map((w, i) => (
              <div key={i} style={styles.workoutPreviewCard}>
                <span style={styles.workoutDay}>{w.day}</span>
                <span style={styles.workoutName2}>{w.name}</span>
                <span style={styles.workoutDuration}>{w.duration}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.safetySection}>
          <h4 style={styles.safetyTitle}>âš ️ Safety Notes</h4>
          {finalResults.safetyRecommendations.map((s, i) => (
            <p key={i} style={styles.safetyItem}>• {s}</p>
          ))}
        </div>

        {finalResults.equipmentToBuy && finalResults.equipmentToBuy.length > 0 && (
          <div style={styles.equipmentSuggestionSection}>
            <h4 style={styles.equipmentSuggestionTitle}>💡 Optional Equipment to Consider</h4>
            {finalResults.equipmentToBuy.map((e, i) => (
              <p key={i} style={styles.equipmentSuggestionItem}>• {e}</p>
            ))}
          </div>
        )}

        <button 
          style={styles.primaryButton} 
          className="btn-primary"
          onClick={() => onComplete({ level: finalResults.overallLevel, plan: finalResults, equipment: selectedEquipment })}
        >
          Start My Workout Plan
        </button>
      </div>
    );
  }

  return null;
}

// Fitness Home Screen (after assessment)
function FitnessHomeScreen({ user }) {
  const plan = user.workoutPlan;
  const todayWorkout = plan?.weeklyPlan?.workouts?.[0] || {
    name: 'Gentle Strength',
    duration: '20 min',
    type: 'strength',
    exercises: []
  };

  return (
    <div style={styles.screenContent} className="fade-in">
      <header style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Fitness</h1>
        <p style={styles.pageSubtitle}>Your personalized plan</p>
      </header>

      <div style={styles.levelCard}>
        <span style={styles.levelLabel}>Your Level</span>
        <span style={styles.levelValue}>{user.fitnessLevel?.charAt(0).toUpperCase() + user.fitnessLevel?.slice(1) || 'Beginner'}</span>
      </div>

      {user.equipment && user.equipment.length > 0 && !user.equipment.includes('none') && (
        <div style={styles.equipmentBadge}>
          <span style={styles.equipmentBadgeLabel}>🎒 Your Equipment</span>
          <div style={styles.equipmentBadgeList}>
            {user.equipment.slice(0, 4).map((eq, i) => {
              const equipmentItem = [
                { id: 'dumbbells', name: 'Dumbbells' },
                { id: 'resistance_bands', name: 'Bands' },
                { id: 'kettlebell', name: 'Kettlebell' },
                { id: 'yoga_mat', name: 'Mat' },
                { id: 'stability_ball', name: 'Ball' },
                { id: 'pull_up_bar', name: 'Pull-up Bar' },
                { id: 'bench', name: 'Bench' },
                { id: 'foam_roller', name: 'Roller' },
                { id: 'jump_rope', name: 'Jump Rope' },
                { id: 'trx', name: 'TRX' },
                { id: 'gym_access', name: 'Gym' },
              ].find(e => e.id === eq);
              return equipmentItem ? (
                <span key={i} style={styles.equipmentBadgeItem}>{equipmentItem.name}</span>
              ) : null;
            })}
            {user.equipment.length > 4 && (
              <span style={styles.equipmentBadgeItem}>+{user.equipment.length - 4}</span>
            )}
          </div>
        </div>
      )}

      <div style={styles.todayWorkout}>
        <span style={styles.todayLabel}>Today's Workout</span>
        <h2 style={styles.todayTitle}>{todayWorkout.name}</h2>
        <p style={styles.todayDesc}>{plan?.summary || 'A workout designed for your fitness level'}</p>
        <div style={styles.todayMeta}>
          <span style={styles.todayTag}>{todayWorkout.duration}</span>
          <span style={styles.todayTag}>{user.fitnessLevel || 'Beginner'}</span>
          <span style={styles.todayTag}>{todayWorkout.type}</span>
        </div>
        <button 
          style={styles.primaryButtonWhite}
          onClick={() => setShowWorkoutPlayer(true)}
        >
          Start Workout
        </button>
      </div>

      {todayWorkout.exercises?.length > 0 && (
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Exercises</h3>
          <div style={styles.exerciseList}>
            {todayWorkout.exercises.map((ex, idx) => (
              <div key={idx} style={styles.exerciseCard} className="card-hover">
                <div style={styles.exerciseIndex}>{idx + 1}</div>
                <div style={styles.exerciseDetails}>
                  <h4 style={styles.exerciseTitle}>{ex.name}</h4>
                  <p style={styles.exerciseMeta}>{ex.sets} sets × {ex.reps}</p>
                  {ex.equipment && ex.equipment !== 'Bodyweight' && ex.equipment !== 'None' && (
                    <p style={styles.exerciseEquipment}>🎒 {ex.equipment}</p>
                  )}
                  {ex.notes && <p style={styles.exerciseNotes}>{ex.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section style={styles.section}>
        <div style={styles.activityCard}>
          <h4 style={styles.activityTitle}>This Week's Activity</h4>
          <div style={styles.activityBars}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
              <div key={idx} style={styles.activityDay}>
                <div style={styles.activityBarContainer}>
                  <div style={{
                    ...styles.activityBar,
                    height: `${[60, 80, 40, 100, 70, 20, 0][idx]}%`
                  }} />
                </div>
                <span style={styles.activityDayLabel}>{day}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Education Screen - GLP-1 Learning Center
function EducationScreen({ user }) {
  const [activeSection, setActiveSection] = useState(null);
  const [showMistakes, setShowMistakes] = useState(false);
  const [showKickstart, setShowKickstart] = useState(false);

  // 21 GLP-1 Mistakes content
  const glp1Mistakes = [
    { id: 1, title: "Not eating enough protein", desc: "Aim for 25-35g protein per meal to preserve muscle mass during weight loss.", category: "nutrition" },
    { id: 2, title: "Skipping meals entirely", desc: "Even with reduced appetite, your body needs regular nutrition. Eat small, nutrient-dense meals.", category: "nutrition" },
    { id: 3, title: "Not drinking enough water", desc: "GLP-1s can reduce thirst sensation. Set reminders and aim for 64+ oz daily.", category: "hydration" },
    { id: 4, title: "Eating too fast", desc: "Slow down! GLP-1s work by making you feel full faster—give your body time to register satiety.", category: "nutrition" },
    { id: 5, title: "Ignoring fiber intake", desc: "Constipation is common. Aim for 25-30g fiber daily from vegetables, fruits, and whole grains.", category: "nutrition" },
    { id: 6, title: "Not timing meals properly", desc: "Eat protein first, then vegetables, then carbs. This optimizes absorption and satiety.", category: "nutrition" },
    { id: 7, title: "Drinking alcohol regularly", desc: "Alcohol can worsen side effects and slow weight loss. Limit or avoid during treatment.", category: "lifestyle" },
    { id: 8, title: "Expecting instant results", desc: "GLP-1s work gradually. Focus on the process, not daily scale fluctuations.", category: "mindset" },
    { id: 9, title: "Not exercising at all", desc: "Even light movement helps preserve muscle. Start with walks and build from there.", category: "fitness" },
    { id: 10, title: "Over-exercising initially", desc: "High-intensity workouts can be too much early on. Start gentle and increase gradually.", category: "fitness" },
    { id: 11, title: "Ignoring side effects", desc: "Track and report persistent symptoms to your provider. Many can be managed.", category: "medical" },
    { id: 12, title: "Missing injection doses", desc: "Consistency is key. Set a recurring reminder for your injection day.", category: "medical" },
    { id: 13, title: "Not rotating injection sites", desc: "Rotate between belly, thigh, and arm to prevent tissue issues.", category: "medical" },
    { id: 14, title: "Eating greasy/fried foods", desc: "High-fat foods can trigger nausea and digestive issues with GLP-1s.", category: "nutrition" },
    { id: 15, title: "Drinking with meals", desc: "Avoid large amounts of liquid with meals—it can increase nausea.", category: "hydration" },
    { id: 16, title: "Not tracking progress", desc: "Log food, weight, and symptoms to identify patterns and share with your provider.", category: "tracking" },
    { id: 17, title: "Comparing to others", desc: "Everyone's GLP-1 journey is different. Focus on your own progress.", category: "mindset" },
    { id: 18, title: "Stopping too soon", desc: "Weight management is ongoing. Work with your provider on a long-term plan.", category: "medical" },
    { id: 19, title: "Not addressing emotional eating", desc: "GLP-1s reduce hunger, but habits need work too. Consider therapy or support groups.", category: "mindset" },
    { id: 20, title: "Forgetting supplements", desc: "Consider B12, vitamin D, and a multivitamin—absorption may change on GLP-1s.", category: "nutrition" },
    { id: 21, title: "Not celebrating wins", desc: "Acknowledge non-scale victories: energy, sleep, clothes fit, mobility!", category: "mindset" }
  ];

  // Kickstart Guide sections
  const kickstartSections = [
    {
      id: 'week1',
      title: 'Week 1: Getting Started',
      icon: '1️⃣',
      content: {
        expect: [
          'Minimal appetite changes initially',
          'Possible nausea 24-48 hours after injection',
          'Fatigue or headaches as body adjusts'
        ],
        tips: [
          'Inject at night to sleep through initial side effects',
          'Keep meals small and simple',
          'Stay very well hydrated',
          'Consider over-the-counter nausea remedies if needed'
        ]
      }
    },
    {
      id: 'week2',
      title: 'Week 2: Adjusting',
      icon: '2️⃣',
      content: {
        expect: [
          'Decreased appetite becoming noticeable',
          'Feeling full faster (early satiety)',
          'Side effects may persist but often improving'
        ],
        tips: [
          'Establish a consistent eating schedule',
          'Focus on protein at every meal',
          'Listen to your new fullness cues',
          'Take it slow—eat mindfully'
        ]
      }
    },
    {
      id: 'weeks34',
      title: 'Weeks 3-4: Finding Rhythm',
      icon: '3️⃣',
      content: {
        expect: [
          'More consistent appetite suppression',
          'Better management of side effects',
          'Possible initial weight loss (varies greatly)',
          'More stable energy levels'
        ],
        tips: [
          'Eat regular meals even if not hungry',
          'Prioritize protein and fiber',
          'Stay ahead of constipation with fiber/water',
          'Add gentle movement if feeling up to it'
        ]
      }
    },
    {
      id: 'month2plus',
      title: 'Month 2 & Beyond',
      icon: '🚀',
      content: {
        expect: [
          'Dose increases may bring new adjustments',
          'Steady weight loss pattern emerges',
          'Food relationship continues evolving'
        ],
        tips: [
          'Continue tracking your progress',
          'Celebrate non-scale victories',
          'Build sustainable exercise habits',
          'Stay in touch with your provider'
        ]
      }
    }
  ];

  // Did You Know facts
  const didYouKnowFacts = [
    { icon: '💡', fact: "Side effects aren't always unavoidable. Many symptoms like nausea and fatigue are often tied to not eating enough—not just the medication." },
    { icon: '🥩', fact: "Protein is your best friend on GLP-1s. It helps preserve muscle mass, keeps you satisfied longer, and supports your metabolism." },
    { icon: '💧', fact: "GLP-1 medications can reduce your thirst sensation. Set reminders to drink water—you may not feel thirsty even when dehydrated." },
    { icon: '🌙', fact: "Taking your injection at bedtime can help you sleep through the initial side effects that often occur in the first 24-48 hours." },
    { icon: '🎯', fact: "The average GLP-1 patient loses 15-20% of their body weight over 12-18 months. Patience and consistency are key." },
    { icon: '💪', fact: "Resistance training while on GLP-1s helps preserve muscle mass. Aim for 2-3 strength sessions per week." }
  ];

  if (showMistakes) {
    return (
      <div style={styles.screenContent} className="fade-in">
        <button style={styles.backButton} onClick={() => setShowMistakes(false)}>← Back</button>
        
        <div style={styles.eduDetailHeader}>
          <span style={styles.eduDetailIcon}>📚</span>
          <h1 style={styles.eduDetailTitle}>21 GLP-1 Mistakes to Avoid</h1>
          <p style={styles.eduDetailSubtitle}>Learn what actually works for sustainable results</p>
        </div>

        <div style={styles.mistakesList}>
          {glp1Mistakes.map((mistake, idx) => (
            <div key={mistake.id} style={styles.mistakeCard}>
              <div style={styles.mistakeNumber}>{mistake.id}</div>
              <div style={styles.mistakeContent}>
                <h4 style={styles.mistakeTitle}>{mistake.title}</h4>
                <p style={styles.mistakeDesc}>{mistake.desc}</p>
                <span style={styles.mistakeCategory}>{mistake.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (showKickstart) {
    return (
      <div style={styles.screenContent} className="fade-in">
        <button style={styles.backButton} onClick={() => setShowKickstart(false)}>← Back</button>
        
        <div style={styles.kickstartHeader}>
          <span style={styles.kickstartIcon}>🚀</span>
          <h1 style={styles.kickstartTitle}>GLP-1 Kickstart Guide</h1>
          <p style={styles.kickstartSubtitle}>Your complete roadmap to success</p>
        </div>

        {kickstartSections.map((section) => (
          <div key={section.id} style={styles.kickstartSection}>
            <div 
              style={styles.kickstartSectionHeader}
              onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
            >
              <span style={styles.kickstartSectionIcon}>{section.icon}</span>
              <span style={styles.kickstartSectionTitle}>{section.title}</span>
              <span style={styles.kickstartSectionArrow}>
                {activeSection === section.id ? '−' : '+'}
              </span>
            </div>
            
            {activeSection === section.id && (
              <div style={styles.kickstartSectionContent}>
                <div style={styles.kickstartExpect}>
                  <h4 style={styles.kickstartExpectTitle}>What to Expect</h4>
                  {section.content.expect.map((item, idx) => (
                    <div key={idx} style={styles.kickstartExpectItem}>
                      <span style={styles.kickstartBullet}>•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                
                <div style={styles.kickstartTips}>
                  <h4 style={styles.kickstartTipsTitle}>Tips for Success</h4>
                  {section.content.tips.map((tip, idx) => (
                    <div key={idx} style={styles.kickstartTipItem}>
                      <span style={styles.kickstartCheck}>✓</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Provider reminder */}
        <div style={styles.eduProviderCard}>
          <span style={styles.eduProviderIcon}>📞</span>
          <div>
            <p style={styles.eduProviderText}>Questions? We're here to help.</p>
            <a href="tel:801-917-4386" style={styles.eduProviderLink}>Call 801-917-4386</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.screenContent} className="fade-in">
      <header style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Learn</h1>
        <p style={styles.pageSubtitle}>GLP-1 education & resources</p>
      </header>

      {/* Featured Guides */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Essential Guides</h3>
        
        <div style={styles.eduFeaturedCard} className="card-hover" onClick={() => setShowMistakes(true)}>
          <div style={styles.eduFeaturedIcon}>📚</div>
          <div style={styles.eduFeaturedContent}>
            <h4 style={styles.eduFeaturedTitle}>21 GLP-1 Mistakes to Avoid</h4>
            <p style={styles.eduFeaturedDesc}>Learn what actually works for sustainable results</p>
          </div>
          <div style={styles.eduFeaturedArrow}>→</div>
        </div>

        <div style={styles.eduKickstartCard} className="card-hover" onClick={() => setShowKickstart(true)}>
          <div style={styles.eduKickstartIcon}>🚀</div>
          <div style={styles.eduKickstartContent}>
            <span style={styles.eduKickstartBadge}>Your Complete Roadmap</span>
            <h4 style={styles.eduKickstartTitle}>GLP-1 Kickstart Guide</h4>
            <p style={styles.eduKickstartDesc}>First 30 days, side effects, checklists & more</p>
          </div>
          <div style={styles.eduKickstartArrow}>→</div>
        </div>
      </section>

      {/* Did You Know Section */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Did You Know?</h3>
        <div style={styles.eduFactsContainer}>
          {didYouKnowFacts.map((item, idx) => (
            <div key={idx} style={styles.eduFactCard}>
              <span style={styles.eduFactIcon}>{item.icon}</span>
              <p style={styles.eduFactText}>{item.fact}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Tips Categories */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Quick Tips by Category</h3>
        <div style={styles.eduCategoryGrid}>
          {[
            { icon: '🥗', label: 'Nutrition', color: '#4A6741' },
            { icon: '💧', label: 'Hydration', color: '#2AABB3' },
            { icon: '💪', label: 'Fitness', color: '#9B7E9B' },
            { icon: '💊', label: 'Medication', color: '#C4956A' },
            { icon: '😌', label: 'Side Effects', color: '#E57373' },
            { icon: '🎯', label: 'Mindset', color: '#5B7B50' },
          ].map((cat, idx) => (
            <div key={idx} style={{...styles.eduCategoryCard, borderLeftColor: cat.color}}>
              <span style={styles.eduCategoryIcon}>{cat.icon}</span>
              <span style={styles.eduCategoryLabel}>{cat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Provider */}
      <div style={styles.eduContactCard}>
        <div style={styles.eduContactIcon}>💬</div>
        <div style={styles.eduContactContent}>
          <h4 style={styles.eduContactTitle}>Have Questions?</h4>
          <p style={styles.eduContactText}>Our team is here to support your journey</p>
          <a href="tel:801-917-4386" style={styles.eduContactLink}>
            📞 Call 801-917-4386
          </a>
        </div>
      </div>
    </div>
  );
}

// Treatments Screen - All HYDR801 Services
function TreatmentsScreen({ setActiveModal }) {
  const [activeCategory, setActiveCategory] = useState('weight-loss');

  const categories = [
    { id: 'weight-loss', name: 'Weight Loss', icon: 'âš–️' },
    { id: 'iv-therapy', name: 'IV Therapy', icon: '💧' },
    { id: 'vitamin-boosters', name: 'Boosters', icon: '💉' },
    { id: 'hormone', name: 'Hormone', icon: '🧬' },
    { id: 'body', name: 'Body', icon: '✨' },
  ];

  const services = {
    'weight-loss': {
      title: 'Weight Loss Injections',
      description: 'Medical weight loss solutions including GLP-1 medications to help you reach your goals.',
      items: [
        {
          id: 'semaglutide',
          name: 'Semaglutide',
          tagline: 'GLP-1 Weight Loss',
          description: 'FDA-approved GLP-1 medication that helps control appetite and blood sugar levels for effective weight loss.',
          benefits: ['Reduces appetite', 'Controls cravings', 'Improves blood sugar', 'Weekly injection'],
          pricing: [
            { label: 'Initial consult + first month', price: '$300' },
            { label: '0.25mg - 2mg/month', price: '$200' },
            { label: '2.25mg - 2.5mg/month', price: '$300' },
          ],
          popular: true
        },
        {
          id: 'tirzepatide',
          name: 'Tirzepatide',
          tagline: 'Dual-Action GLP-1/GIP',
          description: 'Next-generation weight loss medication targeting both GLP-1 and GIP receptors for enhanced results.',
          benefits: ['Dual hormone action', 'Superior weight loss', 'Improved metabolism', 'Weekly injection'],
          pricing: [
            { label: 'Initial consult + first month', price: '$300' },
            { label: '2.5mg/month', price: '$200' },
            { label: '5mg/month', price: '$250' },
            { label: '7.5mg/month', price: '$300' },
            { label: '10mg/month', price: '$350' },
            { label: '12.5mg/month', price: '$412.50' },
            { label: '15mg/month', price: '$475' },
          ],
          popular: true
        },
        {
          id: 'phentermine',
          name: 'Phentermine',
          tagline: 'Appetite Suppressant',
          description: 'Proven appetite suppressant to help control hunger and support your weight loss journey.',
          benefits: ['Reduces hunger', 'Boosts energy', 'Short-term use', 'Daily oral medication'],
          pricing: [
            { label: 'Monthly supply', price: '$40' },
          ],
          popular: false
        },
      ]
    },
    'iv-therapy': {
      title: 'IV Therapy',
      description: 'Premium IV infusions delivering vitamins, minerals, and hydration directly to your bloodstream.',
      items: [
        {
          id: 'immunity-boost',
          name: 'Immunity Boost',
          tagline: 'Improvement Tier',
          description: 'Fortify your body\'s defenses to stay strong and healthy with immune-supporting nutrients.',
          benefits: ['Boosts immune system', 'Fights illness', 'Vitamin C & Zinc', '1000cc saline base'],
          pricing: [{ label: 'Per session', price: '$149' }],
          popular: false,
          tier: 'improvement'
        },
        {
          id: 'gut-boost',
          name: 'Gut Boost',
          tagline: 'Improvement Tier',
          description: 'Repair and heal your gut lining to feel your best inside and out.',
          benefits: ['Gut health', 'Reduces inflammation', 'Improves digestion', 'Healing nutrients'],
          pricing: [{ label: 'Per session', price: '$149' }],
          popular: false,
          tier: 'improvement'
        },
        {
          id: 'detox-boost',
          name: 'Detox Boost',
          tagline: 'Improvement Tier',
          description: 'Cleanse and rejuvenate with a blend formulated to flush out toxins and impurities.',
          benefits: ['Flushes toxins', 'Liver support', 'Glutathione', 'Rejuvenating'],
          pricing: [{ label: 'Per session', price: '$149' }],
          popular: false,
          tier: 'improvement'
        },
        {
          id: 'beauty-boost',
          name: 'Beauty Boost',
          tagline: 'Upgrade Tier',
          description: 'Luxurious blend to strengthen hair and reduce skin inflammation for radiant beauty.',
          benefits: ['Glowing skin', 'Stronger hair', 'Biotin & collagen', 'Anti-inflammatory'],
          pricing: [{ label: 'Per session', price: '$179' }],
          popular: true,
          tier: 'upgrade'
        },
        {
          id: 'recovery-boost',
          name: 'Recovery Boost',
          tagline: 'Upgrade Tier',
          description: 'Supercharge your fitness journey by accelerating muscle recovery after workouts.',
          benefits: ['Muscle recovery', 'Reduces soreness', 'Amino acids', 'Athletic performance'],
          pricing: [{ label: 'Per session', price: '$179' }],
          popular: false,
          tier: 'upgrade'
        },
        {
          id: 'energy-boost',
          name: 'Energy Boost',
          tagline: 'Upgrade Tier',
          description: 'Refresh with an invigorating blend that sustains your energy throughout the day.',
          benefits: ['Sustained energy', 'Mental clarity', 'B vitamins', 'No crash'],
          pricing: [{ label: 'Per session', price: '$179' }],
          popular: true,
          tier: 'upgrade'
        },
        {
          id: 'meyers-cocktail',
          name: 'Meyer\'s Cocktail',
          tagline: 'Advanced Tier',
          description: 'A time-tested blend that alleviates chronic ailments and brings your health back into balance.',
          benefits: ['Chronic fatigue relief', 'Migraine support', 'Balanced formula', 'Proven effective'],
          pricing: [{ label: 'Per session', price: '$199' }],
          popular: true,
          tier: 'advanced'
        },
        {
          id: 'physique-boost',
          name: 'Physique Boost',
          tagline: 'Advanced Tier',
          description: 'Jumpstart your weight loss goals by revving up your body\'s natural fat-burning processes.',
          benefits: ['Metabolism boost', 'Fat burning', 'Lipo nutrients', 'Weight loss support'],
          pricing: [{ label: 'Per session', price: '$199' }],
          popular: true,
          tier: 'advanced'
        },
        {
          id: 'overall-boost',
          name: 'Overall Boost',
          tagline: 'Advanced Tier',
          description: 'Unlock your body\'s full potential by optimizing your overall vitality and well-being.',
          benefits: ['Complete wellness', 'Full spectrum', 'Optimal health', 'Total rejuvenation'],
          pricing: [{ label: 'Per session', price: '$199' }],
          popular: false,
          tier: 'advanced'
        },
        {
          id: 'high-dose-vitamin-c',
          name: 'High Dose Vitamin C',
          tagline: 'High Dose Drip',
          description: 'Powerful antioxidant therapy with concentrated Vitamin C for immune support and wellness.',
          benefits: ['Powerful antioxidant', 'Immune booster', 'Collagen support', 'Cellular health'],
          pricing: [
            { label: '10g infusion', price: '$179' },
            { label: '20g infusion', price: '$219' },
          ],
          popular: false,
          tier: 'high-dose'
        },
        {
          id: 'glutathione',
          name: 'Glutathione',
          tagline: 'High Dose Drip',
          description: 'The master antioxidant for detoxification, skin brightening, and cellular protection.',
          benefits: ['Master antioxidant', 'Skin brightening', 'Detoxification', 'Anti-aging'],
          pricing: [
            { label: '1200mg infusion', price: '$179' },
            { label: '2000mg infusion', price: '$219' },
          ],
          popular: true,
          tier: 'high-dose'
        },
        {
          id: 'nad-therapy',
          name: 'NAD+ Therapy',
          tagline: 'Cellular Energy',
          description: 'Boost cellular energy and support healthy aging with NAD+ infusion therapy.',
          benefits: ['Cellular energy', 'Mental clarity', 'Anti-aging', 'Brain function'],
          pricing: [
            { label: '250mg infusion', price: '$400' },
            { label: '500mg infusion', price: '$550' },
            { label: '1000mg infusion', price: '$700' },
          ],
          popular: true,
          tier: 'premium'
        },
      ]
    },
    'vitamin-boosters': {
      title: 'Vitamin Boosters',
      description: 'Quick vitamin injections for targeted health benefits and enhanced well-being.',
      items: [
        {
          id: 'b12',
          name: 'Vitamin B12',
          tagline: 'Energy & Focus',
          description: 'Essential vitamin for energy production, brain function, and red blood cell formation.',
          benefits: ['Boosts energy', 'Mental clarity', 'Mood support', 'Quick injection'],
          pricing: [{ label: 'Per injection', price: '$15' }],
          popular: true
        },
        {
          id: 'b-complex',
          name: 'B-Complex',
          tagline: 'Complete B Vitamins',
          description: 'Full spectrum of B vitamins for metabolism, energy, and nervous system support.',
          benefits: ['All B vitamins', 'Metabolism', 'Nerve health', 'Energy production'],
          pricing: [{ label: 'Per injection', price: '$20' }],
          popular: true
        },
        {
          id: 'vitamin-d',
          name: 'Vitamin D',
          tagline: 'Sunshine Vitamin',
          description: 'Essential for bone health, immune function, and mood regulation.',
          benefits: ['Bone health', 'Immune support', 'Mood booster', 'Hormone balance'],
          pricing: [{ label: 'Per injection', price: '$20' }],
          popular: false
        },
        {
          id: 'lipo-c',
          name: 'Lipo-C',
          tagline: 'Fat Metabolism',
          description: 'Lipotropic injection to support your body\'s natural fat-burning processes.',
          benefits: ['Fat metabolism', 'Liver support', 'Energy boost', 'Weight loss aid'],
          pricing: [{ label: 'Per month', price: '$20' }],
          popular: true
        },
        {
          id: 'immune-boost-shot',
          name: 'Immune Boost Shot',
          tagline: 'Quick Defense',
          description: 'Fast-acting immune support injection to keep you healthy and resilient.',
          benefits: ['Immune support', 'Cold & flu defense', 'Quick protection', 'Vitamin blend'],
          pricing: [{ label: 'Per injection', price: '$20' }],
          popular: false
        },
      ]
    },
    'hormone': {
      title: 'Hormone Therapy',
      description: 'Bioidentical hormone replacement therapy to restore balance and vitality.',
      items: [
        {
          id: 'bhrt-women',
          name: 'Women\'s BHRT',
          tagline: 'Hormone Balance',
          description: 'Bioidentical hormone replacement therapy to address hormonal imbalances, reduce fatigue, and improve quality of life.',
          benefits: ['Reduces fatigue', 'Mood stability', 'Better sleep', 'Increased energy'],
          pricing: [{ label: 'Monthly (plus medication)', price: '$50' }],
          popular: true
        },
        {
          id: 'bhrt-men',
          name: 'Men\'s BHRT',
          tagline: 'Testosterone Therapy',
          description: 'Testosterone replacement therapy to restore energy, strength, and vitality.',
          benefits: ['Increased energy', 'Muscle support', 'Libido boost', 'Mental clarity'],
          pricing: [{ label: 'Monthly (plus medication)', price: '$50' }],
          popular: true
        },
        {
          id: 'hormone-panel',
          name: 'Hormone Lab Panel',
          tagline: 'Comprehensive Testing',
          description: 'Complete hormone panel to assess your current levels and guide treatment.',
          benefits: ['Full hormone panel', 'Accurate baseline', 'Treatment guidance', 'Health insights'],
          pricing: [{ label: 'Male hormone panel', price: '$220' }],
          popular: false
        },
      ]
    },
    'body': {
      title: 'Body Contouring & Aesthetics',
      description: 'Non-invasive treatments for body sculpting and aesthetic enhancement.',
      items: [
        {
          id: 'emsculpt-neo',
          name: 'Emsculpt Neo',
          tagline: 'Build Muscle + Burn Fat',
          description: 'Revolutionary non-invasive treatment that simultaneously burns fat and builds muscle using RF and HIFEM technology.',
          benefits: ['Burns fat', 'Builds muscle', 'No downtime', '30-minute sessions'],
          pricing: [
            { label: 'Per session', price: '$850' },
            { label: '4-treatment package', price: '$3,400' },
          ],
          popular: true,
          featured: true
        },
        {
          id: 'latisse',
          name: 'Latisse',
          tagline: 'Lash Growth',
          description: 'FDA-approved treatment for longer, fuller, darker eyelashes.',
          benefits: ['Longer lashes', 'Fuller lashes', 'Darker lashes', 'FDA-approved'],
          pricing: [{ label: 'Per bottle', price: '$120' }],
          popular: false
        },
      ]
    }
  };

  const currentServices = services[activeCategory];

  return (
    <div style={styles.screenContent} className="fade-in">
      <header style={styles.pageHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <img src="/logo.png" alt="" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
          <h1 style={styles.pageTitle}>Services</h1>
        </div>
        <p style={styles.pageSubtitle}>HYDR801 Infusion & Wellness</p>
      </header>

      {/* Category Tabs */}
      <div style={styles.categoryTabs}>
        {categories.map(cat => (
          <button
            key={cat.id}
            style={{
              ...styles.categoryTab,
              ...(activeCategory === cat.id ? styles.categoryTabActive : {})
            }}
            onClick={() => setActiveCategory(cat.id)}
          >
            <span style={styles.categoryIcon}>{cat.icon}</span>
            <span style={styles.categoryName}>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Category Header */}
      <div style={styles.categoryHeader}>
        <h2 style={styles.categoryTitle}>{currentServices.title}</h2>
        <p style={styles.categoryDescription}>{currentServices.description}</p>
      </div>

      {/* Services List */}
      <div style={styles.servicesList}>
        {currentServices.items.map((service) => (
          <div 
            key={service.id} 
            style={{
              ...styles.serviceCard,
              ...(service.featured ? styles.serviceCardFeatured : {})
            }}
            className="card-hover"
            onClick={() => setActiveModal(service.id)}
          >
            {service.popular && <span style={styles.popularBadge}>Popular</span>}
            {service.tier && (
              <span style={{
                ...styles.tierBadge,
                background: service.tier === 'premium' ? '#9B7E9B' : 
                           service.tier === 'advanced' ? '#4A6741' :
                           service.tier === 'upgrade' ? '#2AABB3' :
                           service.tier === 'high-dose' ? '#C4956A' : '#E8EDE6'
              }}>
                {service.tier === 'premium' ? '⭐ Premium' : 
                 service.tier === 'advanced' ? '🔷 Advanced' :
                 service.tier === 'upgrade' ? '⬆️ Upgrade' :
                 service.tier === 'high-dose' ? '💪 High Dose' : service.tier}
              </span>
            )}
            <h3 style={styles.serviceName}>{service.name}</h3>
            <p style={styles.serviceTagline}>{service.tagline}</p>
            <p style={styles.serviceDescription}>{service.description}</p>
            
            <div style={styles.serviceBenefits}>
              {service.benefits.slice(0, 3).map((benefit, idx) => (
                <span key={idx} style={styles.serviceBenefit}>✓ {benefit}</span>
              ))}
            </div>

            <div style={styles.servicePricing}>
              {service.pricing.slice(0, 2).map((price, idx) => (
                <div key={idx} style={styles.priceRow}>
                  <span style={styles.priceLabel}>{price.label}</span>
                  <span style={styles.priceValue}>{price.price}</span>
                </div>
              ))}
              {service.pricing.length > 2 && (
                <span style={styles.morePricing}>+{service.pricing.length - 2} more options</span>
              )}
            </div>

            <button style={styles.serviceBtn}>Learn More →</button>
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div style={styles.contactCTA}>
        <p style={styles.contactText}>Questions about our services?</p>
        <a href="tel:801-917-4386" style={styles.contactPhone}>📞 801-917-4386</a>
        <p style={styles.contactLocation}>📍 West Haven & South Ogden, UT</p>
      </div>
    </div>
  );
}

// Achievements Screen
function AchievementsScreen({ user, setUser, onBack }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Badge definitions organized by category
  const badgeCategories = {
    'GLP-1 Journey': {
      icon: '💉',
      badges: [
        { id: 'first_glp1', name: 'First Shot', desc: 'Complete your first GLP-1 injection', icon: '1', requirement: 1, type: 'glp1Injections' },
        { id: 'glp1_4', name: '4 Weeks', desc: 'Complete 4 GLP-1 injections', icon: '4', requirement: 4, type: 'glp1Injections' },
        { id: 'glp1_12', name: '3 Months', desc: 'Complete 12 GLP-1 injections', icon: '12', requirement: 12, type: 'glp1Injections' },
        { id: 'glp1_26', name: '6 Months', desc: 'Complete 26 GLP-1 injections', icon: '26', requirement: 26, type: 'glp1Injections' },
        { id: 'glp1_52', name: '1 Year', desc: 'Complete 52 GLP-1 injections', icon: '52', requirement: 52, type: 'glp1Injections' },
      ]
    },
    'Lipo-C Progress': {
      icon: '🧪',
      badges: [
        { id: 'first_lipoc', name: 'Lipo Starter', desc: 'Complete your first Lipo-C injection', icon: '1', requirement: 1, type: 'lipocInjections' },
        { id: 'lipoc_5', name: 'Lipo Regular', desc: 'Complete 5 Lipo-C injections', icon: '5', requirement: 5, type: 'lipocInjections' },
        { id: 'lipoc_10', name: 'Lipo Pro', desc: 'Complete 10 Lipo-C injections', icon: '10', requirement: 10, type: 'lipocInjections' },
        { id: 'lipoc_25', name: 'Lipo Master', desc: 'Complete 25 Lipo-C injections', icon: '25', requirement: 25, type: 'lipocInjections' },
      ]
    },
    'Weight Loss': {
      icon: '⚖️',
      badges: [
        { id: '5lb_lost', name: '5 lbs Down', desc: 'Lose 5 pounds', icon: '5', requirement: 5, type: 'totalWeightLost' },
        { id: '10lb_lost', name: '10 lbs Down', desc: 'Lose 10 pounds', icon: '10', requirement: 10, type: 'totalWeightLost' },
        { id: '25lb_lost', name: '25 lbs Down', desc: 'Lose 25 pounds', icon: '25', requirement: 25, type: 'totalWeightLost' },
        { id: '50lb_lost', name: '50 lbs Down', desc: 'Lose 50 pounds', icon: '50', requirement: 50, type: 'totalWeightLost' },
        { id: '100lb_lost', name: 'Century Club', desc: 'Lose 100 pounds', icon: '100', requirement: 100, type: 'totalWeightLost' },
      ]
    },
    'Consistency': {
      icon: '🔥',
      badges: [
        { id: '7_day_streak', name: '7-Day Streak', desc: 'Maintain a 7-day streak', icon: '7', requirement: 7, type: 'longestStreak' },
        { id: '14_day_streak', name: '14-Day Streak', desc: 'Maintain a 14-day streak', icon: '14', requirement: 14, type: 'longestStreak' },
        { id: '30_day_streak', name: '30-Day Streak', desc: 'Maintain a 30-day streak', icon: '30', requirement: 30, type: 'longestStreak' },
        { id: '60_day_streak', name: '60-Day Streak', desc: 'Maintain a 60-day streak', icon: '60', requirement: 60, type: 'longestStreak' },
        { id: '90_day_streak', name: '90-Day Streak', desc: 'Maintain a 90-day streak', icon: '90', requirement: 90, type: 'longestStreak' },
      ]
    },
    'IV Therapy': {
      icon: '💧',
      badges: [
        { id: 'first_iv', name: 'First Drip', desc: 'Complete your first IV session', icon: '1', requirement: 1, type: 'ivTherapySessions' },
        { id: 'iv_5', name: 'IV Regular', desc: 'Complete 5 IV sessions', icon: '5', requirement: 5, type: 'ivTherapySessions' },
        { id: 'iv_10', name: 'IV Enthusiast', desc: 'Complete 10 IV sessions', icon: '10', requirement: 10, type: 'ivTherapySessions' },
        { id: 'iv_25', name: 'IV Champion', desc: 'Complete 25 IV sessions', icon: '25', requirement: 25, type: 'ivTherapySessions' },
      ]
    },
    'Nutrition': {
      icon: '🥗',
      badges: [
        { id: 'protein_week', name: 'Protein Pro', desc: 'Hit protein goal 7 days in a row', icon: '7', requirement: 7, type: 'proteinGoalsMet' },
        { id: 'protein_month', name: 'Protein Master', desc: 'Hit protein goal 30 days', icon: '30', requirement: 30, type: 'proteinGoalsMet' },
        { id: 'hydration_week', name: 'Hydration Hero', desc: 'Hit hydration goal 7 days in a row', icon: '7', requirement: 7, type: 'hydrationGoalsMet' },
        { id: 'hydration_month', name: 'Hydration Master', desc: 'Hit hydration goal 30 days', icon: '30', requirement: 30, type: 'hydrationGoalsMet' },
      ]
    },
    'Fitness': {
      icon: '💪',
      badges: [
        { id: 'first_workout', name: 'First Workout', desc: 'Complete your first workout', icon: '1', requirement: 1, type: 'workoutsCompleted' },
        { id: 'workout_10', name: '10 Workouts', desc: 'Complete 10 workouts', icon: '10', requirement: 10, type: 'workoutsCompleted' },
        { id: 'workout_25', name: '25 Workouts', desc: 'Complete 25 workouts', icon: '25', requirement: 25, type: 'workoutsCompleted' },
        { id: 'workout_50', name: '50 Workouts', desc: 'Complete 50 workouts', icon: '50', requirement: 50, type: 'workoutsCompleted' },
      ]
    },
    'Community': {
      icon: '👥',
      badges: [
        { id: 'first_referral', name: 'First Referral', desc: 'Refer your first friend', icon: '1', requirement: 1, type: 'referralsMade' },
        { id: 'referral_3', name: '3 Referrals', desc: 'Refer 3 friends', icon: '3', requirement: 3, type: 'referralsMade' },
        { id: 'referral_5', name: '5 Referrals', desc: 'Refer 5 friends', icon: '5', requirement: 5, type: 'referralsMade' },
        { id: 'referral_10', name: '10 Referrals', desc: 'Refer 10 friends', icon: '10', requirement: 10, type: 'referralsMade' },
      ]
    },
  };

  const categories = ['all', ...Object.keys(badgeCategories)];
  
  const isBadgeEarned = (badge) => {
    return user.earnedBadges?.includes(badge.id) || 
           (user.achievements && user.achievements[badge.type] >= badge.requirement);
  };

  const getBadgeProgress = (badge) => {
    const current = user.achievements?.[badge.type] || 0;
    return Math.min(100, (current / badge.requirement) * 100);
  };

  const totalBadges = Object.values(badgeCategories).reduce((sum, cat) => sum + cat.badges.length, 0);
  const earnedCount = Object.values(badgeCategories).reduce((sum, cat) => 
    sum + cat.badges.filter(b => isBadgeEarned(b)).length, 0);

  const filteredCategories = selectedCategory === 'all' 
    ? Object.entries(badgeCategories) 
    : Object.entries(badgeCategories).filter(([key]) => key === selectedCategory);

  return (
    <div style={styles.screenContent} className="fade-in">
      <div style={styles.achievementsHeader}>
        <button style={styles.backButton} onClick={onBack}>← Back</button>
        <h1 style={styles.achievementsTitle}>Achievements</h1>
        <div style={{ width: '50px' }} />
      </div>

      {/* Summary Card */}
      <div style={styles.achievementsSummary}>
        <div style={styles.achievementsSummaryIcon}>🏆</div>
        <div style={styles.achievementsSummaryInfo}>
          <h2 style={styles.achievementsSummaryCount}>{earnedCount} / {totalBadges}</h2>
          <p style={styles.achievementsSummaryLabel}>Badges Earned</p>
        </div>
        <div style={styles.achievementsSummaryProgress}>
          <div style={{...styles.achievementsSummaryProgressFill, width: `${(earnedCount/totalBadges)*100}%`}} />
        </div>
      </div>

      {/* Category Filter */}
      <div style={styles.achievementsCategoryFilter}>
        {categories.map(cat => (
          <button
            key={cat}
            style={{
              ...styles.achievementsCategoryBtn,
              ...(selectedCategory === cat ? styles.achievementsCategoryBtnActive : {})
            }}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat === 'all' ? '🏅 All' : `${badgeCategories[cat]?.icon || ''} ${cat.split(' ')[0]}`}
          </button>
        ))}
      </div>

      {/* Badge Lists by Category */}
      {filteredCategories.map(([categoryName, category]) => (
        <div key={categoryName} style={styles.achievementsCategorySection}>
          <div style={styles.achievementsCategoryHeader}>
            <span style={styles.achievementsCategoryIcon}>{category.icon}</span>
            <h3 style={styles.achievementsCategoryTitle}>{categoryName.toUpperCase()}</h3>
          </div>
          <div style={styles.badgesGrid}>
            {category.badges.map((badge) => {
              const earned = isBadgeEarned(badge);
              const progress = getBadgeProgress(badge);
              
              return (
                <div 
                  key={badge.id} 
                  style={{
                    ...styles.badgeCard,
                    opacity: earned ? 1 : 0.5,
                  }}
                >
                  <div style={{
                    ...styles.badgeCircle,
                    background: earned 
                      ? 'linear-gradient(135deg, #D946B0 0%, #9B2D7B 100%)' 
                      : 'linear-gradient(135deg, #3D3D4D 0%, #2D2D3D 100%)',
                    boxShadow: earned ? '0 4px 15px rgba(217, 70, 176, 0.4)' : 'none'
                  }}>
                    <div style={styles.badgeInnerCircle}>
                      <span style={{
                        ...styles.badgeNumber,
                        color: earned ? '#FFFFFF' : '#666666'
                      }}>{badge.icon}</span>
                    </div>
                    {!earned && progress > 0 && progress < 100 && (
                      <svg style={styles.badgeProgressRing} viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#4A4A5A" strokeWidth="6" />
                        <circle 
                          cx="50" cy="50" r="45" fill="none" 
                          stroke="#D946B0" strokeWidth="6" strokeLinecap="round"
                          strokeDasharray={`${progress * 2.83} 283`}
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                    )}
                  </div>
                  <p style={styles.badgeName}>{badge.name}</p>
                  {earned && <span style={styles.badgeEarnedCheck}>✓</span>}
                  {!earned && (
                    <p style={styles.badgeProgressText}>
                      {user.achievements?.[badge.type] || 0}/{badge.requirement}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Special Events Section */}
      <div style={styles.achievementsCategorySection}>
        <div style={styles.achievementsCategoryHeader}>
          <span style={styles.achievementsCategoryIcon}>⭐</span>
          <h3 style={styles.achievementsCategoryTitle}>SPECIAL EVENTS</h3>
        </div>
        <div style={styles.specialBadgesRow}>
          <div style={styles.specialBadgeCard}>
            <div style={styles.specialBadgeImage}>
              <span style={styles.specialBadgeEmoji}>🎄</span>
            </div>
            <p style={styles.specialBadgeName}>Holiday 2024</p>
          </div>
          <div style={{...styles.specialBadgeCard, opacity: 0.4}}>
            <div style={styles.specialBadgeImage}>
              <span style={styles.specialBadgeEmoji}>💝</span>
            </div>
            <p style={styles.specialBadgeName}>Valentine's 2025</p>
          </div>
          <div style={{...styles.specialBadgeCard, opacity: 0.4}}>
            <div style={styles.specialBadgeImage}>
              <span style={styles.specialBadgeEmoji}>☀️</span>
            </div>
            <p style={styles.specialBadgeName}>Summer 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loyalty Program Screen
function LoyaltyProgramScreen({ user, setUser, onBack }) {
  const [activeTab, setActiveTab] = useState('rewards');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Luxury Tier Badge Component
  const TierBadge = ({ tier, size = 'large' }) => {
    const sizes = {
      small: { width: 32, height: 32, fontSize: 10, iconSize: 14 },
      medium: { width: 48, height: 48, fontSize: 12, iconSize: 18 },
      large: { width: 64, height: 64, fontSize: 14, iconSize: 24 }
    };
    const s = sizes[size];
    
    const tierStyles = {
      Bronze: {
        gradient: 'linear-gradient(145deg, #D4A574 0%, #8B6914 50%, #CD7F32 100%)',
        border: '#8B6914',
        shadow: '0 4px 15px rgba(205, 127, 50, 0.4)',
        icon: '✦'
      },
      Silver: {
        gradient: 'linear-gradient(145deg, #E8E8E8 0%, #A8A8A8 50%, #C0C0C0 100%)',
        border: '#909090',
        shadow: '0 4px 15px rgba(168, 168, 168, 0.4)',
        icon: '❖'
      },
      Gold: {
        gradient: 'linear-gradient(145deg, #FFE55C 0%, #D4AF37 50%, #B8860B 100%)',
        border: '#B8860B',
        shadow: '0 4px 15px rgba(212, 175, 55, 0.5)',
        icon: '✧'
      },
      Platinum: {
        gradient: 'linear-gradient(145deg, #F5F5F5 0%, #E5E4E2 30%, #A0A0A0 70%, #E8E8E8 100%)',
        border: '#8A8A8A',
        shadow: '0 4px 20px rgba(160, 160, 160, 0.5)',
        icon: '◆'
      }
    };
    
    const style = tierStyles[tier] || tierStyles.Bronze;
    
    return (
      <div style={{
        width: s.width,
        height: s.height,
        borderRadius: '50%',
        background: style.gradient,
        border: `2px solid ${style.border}`,
        boxShadow: style.shadow,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Inner ring */}
        <div style={{
          position: 'absolute',
          width: s.width - 8,
          height: s.height - 8,
          borderRadius: '50%',
          border: `1px solid rgba(255,255,255,0.3)`,
        }} />
        {/* Center icon */}
        <span style={{
          fontSize: s.iconSize,
          color: tier === 'Platinum' ? '#4A4A4A' : '#FFFFFF',
          textShadow: tier === 'Platinum' ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
          fontWeight: '300',
        }}>
          {style.icon}
        </span>
      </div>
    );
  };

  // Tier definitions with luxury colors
  const tiers = [
    { 
      id: 'Bronze', 
      minSpend: 0, 
      maxSpend: 499,
      color: '#8B6914',
      textColor: '#6B4E11',
      bgColor: 'linear-gradient(135deg, #FDF8F0 0%, #F5E6D3 100%)',
      accentColor: '#CD7F32',
      benefits: ['5% off IV Therapy', '$20 referral credit', 'Birthday bonus'],
      discount: 5
    },
    { 
      id: 'Silver', 
      minSpend: 500, 
      maxSpend: 1499,
      color: '#6B6B6B',
      textColor: '#4A4A4A',
      bgColor: 'linear-gradient(135deg, #FAFAFA 0%, #E8E8E8 100%)',
      accentColor: '#A8A8A8',
      benefits: ['10% off IV Therapy', '$20 referral credit', 'Priority scheduling', 'Free B12 monthly'],
      discount: 10
    },
    { 
      id: 'Gold', 
      minSpend: 1500, 
      maxSpend: 2999,
      color: '#B8860B',
      textColor: '#8B6914',
      bgColor: 'linear-gradient(135deg, #FFFEF5 0%, #F5E6C8 100%)',
      accentColor: '#D4AF37',
      benefits: ['15% off all services', '$20 referral credit', 'VIP scheduling', 'Free monthly booster', 'Exclusive events'],
      discount: 15
    },
    { 
      id: 'Platinum', 
      minSpend: 3000, 
      maxSpend: Infinity,
      color: '#5A5A5A',
      textColor: '#3A3A3A',
      bgColor: 'linear-gradient(135deg, #F8F8FA 0%, #E0E0E5 100%)',
      accentColor: '#8A8A8A',
      benefits: ['20% off everything', '$20 referral credit', 'Concierge service', 'Free monthly IV', 'VIP events', 'First access to new treatments'],
      discount: 20
    },
  ];

  const currentTier = tiers.find(t => t.id === user.loyaltyTier) || tiers[0];
  const currentTierIndex = tiers.findIndex(t => t.id === user.loyaltyTier);
  const nextTier = currentTierIndex < tiers.length - 1 ? tiers[currentTierIndex + 1] : null;
  
  const spendToNextTier = nextTier ? nextTier.minSpend - (user.lifetimeSpent || 0) : 0;
  const progressToNext = nextTier 
    ? Math.min(100, ((user.lifetimeSpent - currentTier.minSpend) / (nextTier.minSpend - currentTier.minSpend)) * 100)
    : 100;

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(user.referralCode || 'HYDR801');
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async (method) => {
    const shareText = `Join me at HYDR801 Infusion & Wellness! Use my code ${user.referralCode} to get $25 off your first treatment. 💪✨`;
    const shareUrl = `https://hydr801.com/refer/${user.referralCode}`;
    
    if (method === 'native' && navigator.share) {
      try {
        await navigator.share({
          title: 'HYDR801 Referral',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else if (method === 'sms') {
      window.open(`sms:?body=${encodeURIComponent(shareText + ' ' + shareUrl)}`);
    } else if (method === 'email') {
      window.open(`mailto:?subject=${encodeURIComponent('Join me at HYDR801!')}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`);
    } else if (method === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
    } else if (method === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`);
    }
    setShowShareModal(false);
  };

  return (
    <div style={styles.screenContent} className="fade-in">
      <div style={styles.loyaltyHeader}>
        <button style={styles.backButton} onClick={onBack}>← Back</button>
        <h2 style={styles.loyaltyHeaderTitle}>Rewards Program</h2>
        <div style={{ width: '50px' }} />
      </div>

      {/* Current Tier Card */}
      <div style={{...styles.tierCard, background: currentTier.bgColor}}>
        <div style={styles.tierCardHeader}>
          <TierBadge tier={currentTier.id} size="large" />
          <div style={styles.tierInfo}>
            <h2 style={{...styles.tierName, color: currentTier.textColor}}>{currentTier.id} Member</h2>
            <p style={styles.tierSpent}>${user.lifetimeSpent?.toLocaleString() || 0} lifetime spending</p>
          </div>
        </div>
        
        {nextTier && (
          <div style={styles.tierProgress}>
            <div style={styles.tierProgressHeader}>
              <span style={styles.tierProgressLabel}>Progress to {nextTier.id}</span>
              <span style={styles.tierProgressValue}>${spendToNextTier} to go</span>
            </div>
            <div style={styles.tierProgressBar}>
              <div style={{...styles.tierProgressFill, width: `${progressToNext}%`, background: nextTier.accentColor}} />
            </div>
          </div>
        )}
        
        <div style={styles.tierDiscount}>
          <span style={{...styles.discountBadge, background: currentTier.accentColor}}>{currentTier.discount}% OFF</span>
          <span style={styles.discountText}>your services</span>
        </div>
      </div>

      {/* Referral Code Card */}
      <div style={styles.referralCard}>
        <div style={styles.referralHeader}>
          <span style={styles.referralIcon}>🎁</span>
          <div>
            <h3 style={styles.referralTitle}>Share & Earn</h3>
            <p style={styles.referralSubtitle}>Get $20 credit for each friend</p>
          </div>
        </div>
        
        <div style={styles.referralCodeBox}>
          <span style={styles.referralCodeLabel}>Your Referral Code</span>
          <div style={styles.referralCodeRow}>
            <span style={styles.referralCode}>{user.referralCode || 'HYDR801'}</span>
            <button style={styles.copyButton} onClick={handleCopyCode}>
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>
        </div>
        
        <button style={styles.shareButton} onClick={() => setShowShareModal(true)}>
          <span>📤</span> Share with Friends
        </button>
        
        <div style={styles.referralStats}>
          <div style={styles.referralStat}>
            <span style={styles.referralStatValue}>{user.referralCount || 0}</span>
            <span style={styles.referralStatLabel}>Friends Referred</span>
          </div>
          <div style={styles.referralStatDivider} />
          <div style={styles.referralStat}>
            <span style={styles.referralStatValue}>${user.referralCredits || 0}</span>
            <span style={styles.referralStatLabel}>Credits Earned</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.loyaltyTabs}>
        {['rewards', 'history', 'tiers'].map(tab => (
          <button
            key={tab}
            style={{...styles.loyaltyTab, ...(activeTab === tab ? styles.loyaltyTabActive : {})}}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'rewards' && (
        <div className="fade-in">
          <h3 style={styles.loyaltySectionTitle}>Your {currentTier.id} Benefits</h3>
          <div style={styles.benefitsList}>
            {currentTier.benefits.map((benefit, idx) => (
              <div key={idx} style={styles.benefitItem}>
                <span style={styles.benefitCheck}>✓</span>
                <span style={styles.benefitText}>{benefit}</span>
              </div>
            ))}
          </div>
          
          {nextTier && (
            <>
              <h3 style={{...styles.loyaltySectionTitle, marginTop: '24px'}}>Unlock with {nextTier.id}</h3>
              <div style={{...styles.benefitsList, opacity: 0.6}}>
                {nextTier.benefits.filter(b => !currentTier.benefits.includes(b)).map((benefit, idx) => (
                  <div key={idx} style={styles.benefitItem}>
                    <span style={{...styles.benefitCheck, background: '#E0E0E0', color: '#9B9B9B'}}>🔒</span>
                    <span style={styles.benefitText}>{benefit}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Available Rewards */}
          <h3 style={{...styles.loyaltySectionTitle, marginTop: '24px'}}>Available Rewards</h3>
          <div style={styles.rewardsList}>
            <div style={styles.rewardCard}>
              <span style={styles.rewardIcon}>💧</span>
              <div style={styles.rewardInfo}>
                <h4 style={styles.rewardName}>{currentTier.discount}% Off IV Therapy</h4>
                <p style={styles.rewardDesc}>Applied automatically at checkout</p>
              </div>
              <span style={styles.rewardStatus}>Active</span>
            </div>
            {user.referralCredits > 0 && (
              <div style={styles.rewardCard}>
                <span style={styles.rewardIcon}>💵</span>
                <div style={styles.rewardInfo}>
                  <h4 style={styles.rewardName}>${user.referralCredits} Credit Balance</h4>
                  <p style={styles.rewardDesc}>Use toward any service</p>
                </div>
                <span style={{...styles.rewardStatus, background: '#E8EDE6', color: '#4A6741'}}>Available</span>
              </div>
            )}
            {(currentTier.id === 'Silver' || currentTier.id === 'Gold' || currentTier.id === 'Platinum') && (
              <div style={styles.rewardCard}>
                <span style={styles.rewardIcon}>💉</span>
                <div style={styles.rewardInfo}>
                  <h4 style={styles.rewardName}>Free Monthly {currentTier.id === 'Platinum' ? 'IV' : 'Booster'}</h4>
                  <p style={styles.rewardDesc}>Resets on the 1st</p>
                </div>
                <span style={{...styles.rewardStatus, background: '#FFF5F0', color: '#C4956A'}}>Claim</span>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="fade-in">
          <h3 style={styles.loyaltySectionTitle}>Referral History</h3>
          {user.referralHistory && user.referralHistory.length > 0 ? (
            <div style={styles.historyList}>
              {user.referralHistory.map((ref, idx) => (
                <div key={idx} style={styles.historyItem}>
                  <div style={styles.historyAvatar}>{ref.name[0]}</div>
                  <div style={styles.historyInfo}>
                    <p style={styles.historyName}>{ref.name}</p>
                    <p style={styles.historyDate}>{new Date(ref.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <div style={styles.historyRight}>
                    <span style={{
                      ...styles.historyStatus,
                      background: ref.status === 'completed' ? '#E8EDE6' : '#FFF5F0',
                      color: ref.status === 'completed' ? '#4A6741' : '#C4956A'
                    }}>
                      {ref.status === 'completed' ? '✓ Earned' : '⏳ Pending'}
                    </span>
                    <span style={styles.historyCredit}>+${ref.credit}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyHistory}>
              <span style={styles.emptyIcon}>👥</span>
              <p style={styles.emptyText}>No referrals yet</p>
              <p style={styles.emptySubtext}>Share your code to start earning!</p>
            </div>
          )}

          <h3 style={{...styles.loyaltySectionTitle, marginTop: '24px'}}>Spending History</h3>
          {user.spendingHistory && user.spendingHistory.length > 0 ? (
            <div style={styles.historyList}>
              {user.spendingHistory.map((item, idx) => (
                <div key={idx} style={styles.spendingItem}>
                  <div style={styles.spendingIcon}>💳</div>
                  <div style={styles.spendingInfo}>
                    <p style={styles.spendingDesc}>{item.description}</p>
                    <p style={styles.spendingDate}>{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <span style={styles.spendingAmount}>${item.amount}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyHistory}>
              <span style={styles.emptyIcon}>📋</span>
              <p style={styles.emptyText}>No purchases yet</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'tiers' && (
        <div className="fade-in">
          <h3 style={styles.loyaltySectionTitle}>Membership Tiers</h3>
          <div style={styles.tiersList}>
            {tiers.map((tier, idx) => {
              const isCurrentTier = tier.id === user.loyaltyTier;
              const isUnlocked = (user.lifetimeSpent || 0) >= tier.minSpend;
              
              return (
                <div 
                  key={idx} 
                  style={{
                    ...styles.tierListItem,
                    border: isCurrentTier ? `2px solid ${tier.accentColor}` : '1px solid #E8E8E8',
                    background: isCurrentTier ? tier.bgColor : '#FFFFFF',
                    opacity: isUnlocked ? 1 : 0.6
                  }}
                >
                  <div style={styles.tierListHeader}>
                    <TierBadge tier={tier.id} size="medium" />
                    <div style={styles.tierListInfo}>
                      <h4 style={{...styles.tierListName, color: tier.textColor}}>{tier.id}</h4>
                      <p style={styles.tierListSpend}>
                        {tier.maxSpend === Infinity 
                          ? `$${tier.minSpend.toLocaleString()}+` 
                          : `$${tier.minSpend.toLocaleString()} - $${tier.maxSpend.toLocaleString()}`}
                      </p>
                    </div>
                    {isCurrentTier && (
                      <span style={{...styles.currentTierBadge, background: tier.accentColor}}>Current</span>
                    )}
                    {!isUnlocked && (
                      <span style={styles.lockedBadge}>🔒</span>
                    )}
                  </div>
                  <div style={styles.tierListBenefits}>
                    {tier.benefits.slice(0, 3).map((benefit, bidx) => (
                      <span key={bidx} style={styles.tierBenefitTag}>• {benefit}</span>
                    ))}
                    {tier.benefits.length > 3 && (
                      <span style={styles.tierMoreBenefits}>+{tier.benefits.length - 3} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div style={styles.shareModalOverlay} onClick={() => setShowShareModal(false)}>
          <div style={styles.shareModalContent} className="slide-up" onClick={e => e.stopPropagation()}>
            <button style={styles.shareModalClose} onClick={() => setShowShareModal(false)}>×</button>
            <h3 style={styles.shareModalTitle}>Share Your Code</h3>
            <p style={styles.shareModalSubtitle}>Friends get $25 off, you get ${currentTier.id === 'Platinum' ? '100' : currentTier.id === 'Gold' ? '75' : currentTier.id === 'Silver' ? '50' : '25'}!</p>
            
            <div style={styles.shareCodeDisplay}>
              <span style={styles.shareCodeText}>{user.referralCode || 'HYDR801'}</span>
            </div>
            
            <div style={styles.shareOptions}>
              {navigator.share && (
                <button style={styles.shareOption} onClick={() => handleShare('native')}>
                  <span style={styles.shareOptionIcon}>📱</span>
                  <span style={styles.shareOptionLabel}>Share</span>
                </button>
              )}
              <button style={styles.shareOption} onClick={() => handleShare('sms')}>
                <span style={styles.shareOptionIcon}>💬</span>
                <span style={styles.shareOptionLabel}>Text</span>
              </button>
              <button style={styles.shareOption} onClick={() => handleShare('email')}>
                <span style={styles.shareOptionIcon}>📧</span>
                <span style={styles.shareOptionLabel}>Email</span>
              </button>
              <button style={styles.shareOption} onClick={() => handleShare('facebook')}>
                <span style={styles.shareOptionIcon}>📘</span>
                <span style={styles.shareOptionLabel}>Facebook</span>
              </button>
              <button style={styles.shareOption} onClick={() => handleShare('twitter')}>
                <span style={styles.shareOptionIcon}>🐦</span>
                <span style={styles.shareOptionLabel}>Twitter</span>
              </button>
              <button style={styles.shareOption} onClick={handleCopyCode}>
                <span style={styles.shareOptionIcon}>{copied ? '✓' : '📋'}</span>
                <span style={styles.shareOptionLabel}>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            
            <div style={styles.sharePreview}>
              <p style={styles.sharePreviewLabel}>Preview Message:</p>
              <p style={styles.sharePreviewText}>
                "Join me at HYDR801 Infusion & Wellness! Use my code {user.referralCode} to get $25 off your first treatment. 💪✨"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Profile Screen
function ProfileScreen({ user, setUser }) {
  const [showWeightLog, setShowWeightLog] = useState(false);
  const [showLoyalty, setShowLoyalty] = useState(false);
  const [activeSubscreen, setActiveSubscreen] = useState(null);

  const menuItems = [
    { icon: '👤', label: 'Personal Information', id: 'personal' },
    { icon: '📊', label: 'Progress & Metrics', id: 'progress' },
    { icon: '🎯', label: 'Goals & Preferences', id: 'goals' },
    { icon: '💊', label: 'My Treatments', id: 'treatments' },
    { icon: '📱', label: 'Notifications', id: 'notifications' },
    { icon: '❓', label: 'Help & Support', id: 'help' },
  ];

  const badges = [
    { id: 'first_workout', name: 'First Workout', icon: '🏃', earned: user.badges?.includes('first_workout') },
    { id: 'protein_champion', name: 'Protein Champion', icon: '🥩', earned: user.badges?.includes('protein_champion') },
    { id: 'hydration_hero', name: 'Hydration Hero', icon: '💧', earned: user.badges?.includes('hydration_hero') },
    { id: '7_day_streak', name: '7-Day Streak', icon: '🔥', earned: user.badges?.includes('7_day_streak') },
    { id: '14_day_streak', name: '14-Day Streak', icon: '⚡', earned: user.badges?.includes('14_day_streak') },
    { id: 'meal_master', name: 'Meal Master', icon: '🍽️', earned: user.badges?.includes('meal_master') },
  ];

  const weightLoss = user.weightLog?.length >= 2
    ? (user.weightLog[0].weight - user.weightLog[user.weightLog.length - 1].weight).toFixed(1)
    : 0;

  if (showLoyalty) {
    return <LoyaltyProgramScreen user={user} setUser={setUser} onBack={() => setShowLoyalty(false)} />;
  }

  // Personal Information Subscreen
  if (activeSubscreen === 'personal') {
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.subscreenHeader}>
          <button style={styles.backButton} onClick={() => setActiveSubscreen(null)}>← Back</button>
          <h2 style={styles.subscreenTitle}>Personal Information</h2>
        </div>
        
        <div style={styles.personalInfoSection}>
          <div style={styles.personalInfoAvatar}>
            <span style={styles.personalInfoAvatarText}>{user.name[0]}</span>
            <button style={styles.editAvatarBtn}>📷</button>
          </div>
          
          <div style={styles.infoFieldGroup}>
            <div style={styles.infoField}>
              <label style={styles.infoFieldLabel}>Full Name</label>
              <input 
                type="text" 
                style={styles.infoFieldInput} 
                defaultValue={user.name}
                onBlur={(e) => setUser({...user, name: e.target.value})}
              />
            </div>
            
            <div style={styles.infoField}>
              <label style={styles.infoFieldLabel}>Email</label>
              <input 
                type="email" 
                style={styles.infoFieldInput} 
                defaultValue={user.email}
                onBlur={(e) => setUser({...user, email: e.target.value})}
              />
            </div>
            
            <div style={styles.infoField}>
              <label style={styles.infoFieldLabel}>Phone Number</label>
              <input 
                type="tel" 
                style={styles.infoFieldInput} 
                defaultValue={user.phone || ''}
                placeholder="(555) 123-4567"
                onBlur={(e) => setUser({...user, phone: e.target.value})}
              />
            </div>
            
            <div style={styles.infoField}>
              <label style={styles.infoFieldLabel}>Date of Birth</label>
              <input 
                type="date" 
                style={styles.infoFieldInput} 
                defaultValue={user.dob || ''}
                onBlur={(e) => setUser({...user, dob: e.target.value})}
              />
            </div>
          </div>
          
          <div style={styles.infoSection}>
            <h4 style={styles.infoSectionTitle}>Emergency Contact</h4>
            <div style={styles.infoField}>
              <label style={styles.infoFieldLabel}>Contact Name</label>
              <input 
                type="text" 
                style={styles.infoFieldInput} 
                defaultValue={user.emergencyContact || ''}
                placeholder="Emergency contact name"
                onBlur={(e) => setUser({...user, emergencyContact: e.target.value})}
              />
            </div>
            <div style={styles.infoField}>
              <label style={styles.infoFieldLabel}>Contact Phone</label>
              <input 
                type="tel" 
                style={styles.infoFieldInput} 
                defaultValue={user.emergencyPhone || ''}
                placeholder="(555) 123-4567"
                onBlur={(e) => setUser({...user, emergencyPhone: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Progress & Metrics Subscreen
  if (activeSubscreen === 'progress') {
    const weeklyAvg = user.weeklyHistory?.length > 0 
      ? Math.round(user.weeklyHistory.reduce((sum, w) => sum + (w.protein + w.water + w.exercise + w.meals) / 4, 0) / user.weeklyHistory.length)
      : 0;
    
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.subscreenHeader}>
          <button style={styles.backButton} onClick={() => setActiveSubscreen(null)}>← Back</button>
          <h2 style={styles.subscreenTitle}>Progress & Metrics</h2>
        </div>
        
        {/* Summary Stats */}
        <div style={styles.progressStatsGrid}>
          <div style={styles.progressStatCard}>
            <span style={styles.progressStatValue}>{weightLoss}</span>
            <span style={styles.progressStatLabel}>lbs Lost</span>
          </div>
          <div style={styles.progressStatCard}>
            <span style={styles.progressStatValue}>{user.week}</span>
            <span style={styles.progressStatLabel}>Weeks In</span>
          </div>
          <div style={styles.progressStatCard}>
            <span style={styles.progressStatValue}>{user.currentStreak || 0}</span>
            <span style={styles.progressStatLabel}>Day Streak</span>
          </div>
          <div style={styles.progressStatCard}>
            <span style={styles.progressStatValue}>{weeklyAvg}%</span>
            <span style={styles.progressStatLabel}>Avg Compliance</span>
          </div>
        </div>
        
        {/* Weight Chart */}
        <div style={styles.progressSection}>
          <h4 style={styles.progressSectionTitle}>📉 Weight History</h4>
          <div style={styles.weightChartLarge}>
            {user.weightLog?.map((entry, idx) => {
              const maxWeight = Math.max(...user.weightLog.map(e => e.weight));
              const minWeight = Math.min(...user.weightLog.map(e => e.weight));
              const range = maxWeight - minWeight || 1;
              const height = ((entry.weight - minWeight) / range) * 80 + 10;
              
              return (
                <div key={idx} style={styles.weightChartPointLarge}>
                  <div style={{...styles.weightChartBarLarge, height: `${height}%`}} />
                  <span style={styles.weightChartValueLarge}>{entry.weight}</span>
                  <span style={styles.weightChartDateLarge}>
                    {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Weekly Compliance */}
        <div style={styles.progressSection}>
          <h4 style={styles.progressSectionTitle}>📊 Weekly Compliance</h4>
          {user.weeklyHistory?.map((week, idx) => {
            const avg = Math.round((week.protein + week.water + week.exercise + week.meals) / 4);
            return (
              <div key={idx} style={styles.weeklyComplianceRow}>
                <span style={styles.weeklyComplianceLabel}>Week {week.week}</span>
                <div style={styles.weeklyComplianceBar}>
                  <div style={{...styles.weeklyComplianceBarFill, width: `${avg}%`, background: avg >= 80 ? '#4A6741' : avg >= 60 ? '#C4956A' : '#E57373'}} />
                </div>
                <span style={styles.weeklyComplianceValue}>{avg}%</span>
              </div>
            );
          })}
        </div>
        
        {/* Badges */}
        <div style={styles.progressSection}>
          <h4 style={styles.progressSectionTitle}>🏆 Achievements</h4>
          <div style={styles.badgesGridLarge}>
            {badges.map((badge, idx) => (
              <div 
                key={idx} 
                style={{
                  ...styles.badgeCardLarge,
                  opacity: badge.earned ? 1 : 0.4,
                  background: badge.earned ? '#E8EDE6' : '#F5F4F2'
                }}
              >
                <span style={styles.badgeIconLarge}>{badge.icon}</span>
                <span style={styles.badgeNameLarge}>{badge.name}</span>
                {badge.earned && <span style={styles.badgeCheckLarge}>✓</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Goals & Preferences Subscreen
  if (activeSubscreen === 'goals') {
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.subscreenHeader}>
          <button style={styles.backButton} onClick={() => setActiveSubscreen(null)}>← Back</button>
          <h2 style={styles.subscreenTitle}>Goals & Preferences</h2>
        </div>
        
        <div style={styles.goalsSection}>
          <h4 style={styles.goalsSectionTitle}>Daily Goals</h4>
          
          <div style={styles.goalSettingRow}>
            <div style={styles.goalSettingInfo}>
              <span style={styles.goalSettingIcon}>💧</span>
              <span style={styles.goalSettingLabel}>Water Goal</span>
            </div>
            <div style={styles.goalSettingControl}>
              <button 
                style={styles.goalAdjustBtn}
                onClick={() => setUser({...user, waterGoal: Math.max(40, user.waterGoal - 8)})}
              >−</button>
              <span style={styles.goalSettingValue}>{user.waterGoal}oz</span>
              <button 
                style={styles.goalAdjustBtn}
                onClick={() => setUser({...user, waterGoal: user.waterGoal + 8})}
              >+</button>
            </div>
          </div>
          
          <div style={styles.goalSettingRow}>
            <div style={styles.goalSettingInfo}>
              <span style={styles.goalSettingIcon}>🥩</span>
              <span style={styles.goalSettingLabel}>Protein Goal</span>
            </div>
            <div style={styles.goalSettingControl}>
              <button 
                style={styles.goalAdjustBtn}
                onClick={() => setUser({...user, proteinGoal: Math.max(50, user.proteinGoal - 10)})}
              >−</button>
              <span style={styles.goalSettingValue}>{user.proteinGoal}g</span>
              <button 
                style={styles.goalAdjustBtn}
                onClick={() => setUser({...user, proteinGoal: user.proteinGoal + 10})}
              >+</button>
            </div>
          </div>
          
          <div style={styles.goalSettingRow}>
            <div style={styles.goalSettingInfo}>
              <span style={styles.goalSettingIcon}>🥬</span>
              <span style={styles.goalSettingLabel}>Fiber Goal</span>
            </div>
            <div style={styles.goalSettingControl}>
              <button 
                style={styles.goalAdjustBtn}
                onClick={() => setUser({...user, fiberGoal: Math.max(15, user.fiberGoal - 5)})}
              >−</button>
              <span style={styles.goalSettingValue}>{user.fiberGoal}g</span>
              <button 
                style={styles.goalAdjustBtn}
                onClick={() => setUser({...user, fiberGoal: user.fiberGoal + 5})}
              >+</button>
            </div>
          </div>
          
          <div style={styles.goalSettingRow}>
            <div style={styles.goalSettingInfo}>
              <span style={styles.goalSettingIcon}>🏃</span>
              <span style={styles.goalSettingLabel}>Exercise Goal</span>
            </div>
            <div style={styles.goalSettingControl}>
              <button 
                style={styles.goalAdjustBtn}
                onClick={() => setUser({...user, exerciseGoal: Math.max(15, user.exerciseGoal - 5)})}
              >−</button>
              <span style={styles.goalSettingValue}>{user.exerciseGoal}min</span>
              <button 
                style={styles.goalAdjustBtn}
                onClick={() => setUser({...user, exerciseGoal: user.exerciseGoal + 5})}
              >+</button>
            </div>
          </div>
        </div>
        
        <div style={styles.goalsSection}>
          <h4 style={styles.goalsSectionTitle}>Injection Schedule</h4>
          <div style={styles.injectionScheduleCard}>
            <div style={styles.injectionScheduleRow}>
              <span style={styles.injectionScheduleLabel}>Preferred Injection Day</span>
              <select 
                style={styles.injectionScheduleSelect}
                value={user.injectionDay || 0}
                onChange={(e) => setUser({...user, injectionDay: parseInt(e.target.value)})}
              >
                <option value={0}>Sunday</option>
                <option value={1}>Monday</option>
                <option value={2}>Tuesday</option>
                <option value={3}>Wednesday</option>
                <option value={4}>Thursday</option>
                <option value={5}>Friday</option>
                <option value={6}>Saturday</option>
              </select>
            </div>
          </div>
        </div>
        
        <div style={styles.goalsSection}>
          <h4 style={styles.goalsSectionTitle}>Preferences</h4>
          <div style={styles.preferenceRow}>
            <span style={styles.preferenceLabel}>Daily Reminders</span>
            <div 
              style={{
                ...styles.toggleSwitch,
                background: user.dailyReminders ? '#4A6741' : '#E0E0E0'
              }}
              onClick={() => setUser({...user, dailyReminders: !user.dailyReminders})}
            >
              <div style={{
                ...styles.toggleKnob,
                transform: user.dailyReminders ? 'translateX(20px)' : 'translateX(0)'
              }} />
            </div>
          </div>
          <div style={styles.preferenceRow}>
            <span style={styles.preferenceLabel}>Share Progress with Provider</span>
            <div 
              style={{
                ...styles.toggleSwitch,
                background: user.shareWithProvider !== false ? '#4A6741' : '#E0E0E0'
              }}
              onClick={() => setUser({...user, shareWithProvider: user.shareWithProvider === false ? true : false})}
            >
              <div style={{
                ...styles.toggleKnob,
                transform: user.shareWithProvider !== false ? 'translateX(20px)' : 'translateX(0)'
              }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // My Treatments Subscreen
  if (activeSubscreen === 'treatments') {
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.subscreenHeader}>
          <button style={styles.backButton} onClick={() => setActiveSubscreen(null)}>← Back</button>
          <h2 style={styles.subscreenTitle}>My Treatments</h2>
        </div>
        
        {/* Current Medication */}
        <div style={styles.treatmentSection}>
          <h4 style={styles.treatmentSectionTitle}>Current Medication</h4>
          <div style={styles.currentMedCard}>
            <div style={styles.currentMedIcon}>💉</div>
            <div style={styles.currentMedInfo}>
              <h5 style={styles.currentMedName}>Semaglutide (GLP-1)</h5>
              <p style={styles.currentMedDose}>Current Dose: {user.medicationDose}</p>
              <p style={styles.currentMedSchedule}>{user.medicationSchedule}</p>
            </div>
          </div>
        </div>
        
        {/* Dose History */}
        <div style={styles.treatmentSection}>
          <h4 style={styles.treatmentSectionTitle}>Dose History</h4>
          <div style={styles.doseHistoryList}>
            {[
              { date: '2024-12-01', dose: '0.25mg', note: 'Starting dose' },
              { date: '2024-12-15', dose: '0.5mg', note: 'First increase' },
            ].map((entry, idx) => (
              <div key={idx} style={styles.doseHistoryItem}>
                <div style={styles.doseHistoryDate}>
                  {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div style={styles.doseHistoryInfo}>
                  <span style={styles.doseHistoryDose}>{entry.dose}</span>
                  <span style={styles.doseHistoryNote}>{entry.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Add-on Treatments */}
        <div style={styles.treatmentSection}>
          <h4 style={styles.treatmentSectionTitle}>Add-on Treatments</h4>
          <div style={styles.addonTreatmentsList}>
            <div style={styles.addonTreatmentCard}>
              <span style={styles.addonTreatmentIcon}>💊</span>
              <div style={styles.addonTreatmentInfo}>
                <h5 style={styles.addonTreatmentName}>Lipo-C Injections</h5>
                <p style={styles.addonTreatmentDesc}>Fat metabolism support</p>
              </div>
              <span style={styles.addonTreatmentPrice}>$20/mo</span>
            </div>
            <div style={styles.addonTreatmentCard}>
              <span style={styles.addonTreatmentIcon}>💧</span>
              <div style={styles.addonTreatmentInfo}>
                <h5 style={styles.addonTreatmentName}>Physique Boost IV</h5>
                <p style={styles.addonTreatmentDesc}>Monthly metabolism boost</p>
              </div>
              <span style={styles.addonTreatmentPrice}>$199/session</span>
            </div>
          </div>
        </div>
        
        {/* Next Appointment */}
        <div style={styles.treatmentSection}>
          <h4 style={styles.treatmentSectionTitle}>Next Appointment</h4>
          <div style={styles.appointmentCard}>
            <span style={styles.appointmentIcon}>📅</span>
            <div style={styles.appointmentInfo}>
              <p style={styles.appointmentDate}>{user.nextAppointment || 'Not scheduled'}</p>
              <p style={styles.appointmentType}>Check-in with Dr. Williams</p>
            </div>
            <button style={styles.appointmentBtn}>Reschedule</button>
          </div>
        </div>
      </div>
    );
  }

  // Notifications Subscreen
  if (activeSubscreen === 'notifications') {
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.subscreenHeader}>
          <button style={styles.backButton} onClick={() => setActiveSubscreen(null)}>← Back</button>
          <h2 style={styles.subscreenTitle}>Notifications</h2>
        </div>
        
        <div style={styles.notificationsSection}>
          <h4 style={styles.notificationsSectionTitle}>Reminders</h4>
          
          <div style={styles.notificationRow}>
            <div style={styles.notificationInfo}>
              <span style={styles.notificationIcon}>💉</span>
              <div>
                <p style={styles.notificationLabel}>Injection Reminder</p>
                <p style={styles.notificationDesc}>Get reminded on injection day</p>
              </div>
            </div>
            <div 
              style={{
                ...styles.toggleSwitch,
                background: user.injectionReminder !== false ? '#4A6741' : '#E0E0E0'
              }}
              onClick={() => setUser({...user, injectionReminder: user.injectionReminder === false ? true : false})}
            >
              <div style={{
                ...styles.toggleKnob,
                transform: user.injectionReminder !== false ? 'translateX(20px)' : 'translateX(0)'
              }} />
            </div>
          </div>
          
          <div style={styles.notificationRow}>
            <div style={styles.notificationInfo}>
              <span style={styles.notificationIcon}>💧</span>
              <div>
                <p style={styles.notificationLabel}>Hydration Reminders</p>
                <p style={styles.notificationDesc}>Periodic water reminders</p>
              </div>
            </div>
            <div 
              style={{
                ...styles.toggleSwitch,
                background: user.hydrationReminder !== false ? '#4A6741' : '#E0E0E0'
              }}
              onClick={() => setUser({...user, hydrationReminder: user.hydrationReminder === false ? true : false})}
            >
              <div style={{
                ...styles.toggleKnob,
                transform: user.hydrationReminder !== false ? 'translateX(20px)' : 'translateX(0)'
              }} />
            </div>
          </div>
          
          <div style={styles.notificationRow}>
            <div style={styles.notificationInfo}>
              <span style={styles.notificationIcon}>🍽️</span>
              <div>
                <p style={styles.notificationLabel}>Meal Logging</p>
                <p style={styles.notificationDesc}>Remind to log meals</p>
              </div>
            </div>
            <div 
              style={{
                ...styles.toggleSwitch,
                background: user.mealReminder !== false ? '#4A6741' : '#E0E0E0'
              }}
              onClick={() => setUser({...user, mealReminder: user.mealReminder === false ? true : false})}
            >
              <div style={{
                ...styles.toggleKnob,
                transform: user.mealReminder !== false ? 'translateX(20px)' : 'translateX(0)'
              }} />
            </div>
          </div>
          
          <div style={styles.notificationRow}>
            <div style={styles.notificationInfo}>
              <span style={styles.notificationIcon}>🏃</span>
              <div>
                <p style={styles.notificationLabel}>Exercise Reminder</p>
                <p style={styles.notificationDesc}>Daily movement reminder</p>
              </div>
            </div>
            <div 
              style={{
                ...styles.toggleSwitch,
                background: user.exerciseReminder !== false ? '#4A6741' : '#E0E0E0'
              }}
              onClick={() => setUser({...user, exerciseReminder: user.exerciseReminder === false ? true : false})}
            >
              <div style={{
                ...styles.toggleKnob,
                transform: user.exerciseReminder !== false ? 'translateX(20px)' : 'translateX(0)'
              }} />
            </div>
          </div>
        </div>
        
        <div style={styles.notificationsSection}>
          <h4 style={styles.notificationsSectionTitle}>Updates</h4>
          
          <div style={styles.notificationRow}>
            <div style={styles.notificationInfo}>
              <span style={styles.notificationIcon}>📰</span>
              <div>
                <p style={styles.notificationLabel}>Weekly Summary</p>
                <p style={styles.notificationDesc}>Progress report every week</p>
              </div>
            </div>
            <div 
              style={{
                ...styles.toggleSwitch,
                background: user.weeklySummary !== false ? '#4A6741' : '#E0E0E0'
              }}
              onClick={() => setUser({...user, weeklySummary: user.weeklySummary === false ? true : false})}
            >
              <div style={{
                ...styles.toggleKnob,
                transform: user.weeklySummary !== false ? 'translateX(20px)' : 'translateX(0)'
              }} />
            </div>
          </div>
          
          <div style={styles.notificationRow}>
            <div style={styles.notificationInfo}>
              <span style={styles.notificationIcon}>🎉</span>
              <div>
                <p style={styles.notificationLabel}>Promotions & Offers</p>
                <p style={styles.notificationDesc}>Special deals from HYDR801</p>
              </div>
            </div>
            <div 
              style={{
                ...styles.toggleSwitch,
                background: user.promotions ? '#4A6741' : '#E0E0E0'
              }}
              onClick={() => setUser({...user, promotions: !user.promotions})}
            >
              <div style={{
                ...styles.toggleKnob,
                transform: user.promotions ? 'translateX(20px)' : 'translateX(0)'
              }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Help & Support Subscreen
  if (activeSubscreen === 'help') {
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.subscreenHeader}>
          <button style={styles.backButton} onClick={() => setActiveSubscreen(null)}>← Back</button>
          <h2 style={styles.subscreenTitle}>Help & Support</h2>
        </div>
        
        <div style={styles.helpSection}>
          <h4 style={styles.helpSectionTitle}>Contact Us</h4>
          <a href="tel:801-917-4386" style={styles.helpContactCard}>
            <span style={styles.helpContactIcon}>📞</span>
            <div style={styles.helpContactInfo}>
              <p style={styles.helpContactLabel}>Call Us</p>
              <p style={styles.helpContactValue}>801-917-4386</p>
            </div>
          </a>
          <a href="mailto:support@hydr801.com" style={styles.helpContactCard}>
            <span style={styles.helpContactIcon}>✉️</span>
            <div style={styles.helpContactInfo}>
              <p style={styles.helpContactLabel}>Email</p>
              <p style={styles.helpContactValue}>support@hydr801.com</p>
            </div>
          </a>
        </div>
        
        <div style={styles.helpSection}>
          <h4 style={styles.helpSectionTitle}>Locations</h4>
          <div style={styles.locationCard}>
            <span style={styles.locationIcon}>📍</span>
            <div style={styles.locationInfo}>
              <p style={styles.locationName}>West Haven</p>
              <p style={styles.locationAddress}>1234 Main St, West Haven, UT</p>
            </div>
          </div>
          <div style={styles.locationCard}>
            <span style={styles.locationIcon}>📍</span>
            <div style={styles.locationInfo}>
              <p style={styles.locationName}>South Ogden</p>
              <p style={styles.locationAddress}>5678 Washington Blvd, South Ogden, UT</p>
            </div>
          </div>
        </div>
        
        <div style={styles.helpSection}>
          <h4 style={styles.helpSectionTitle}>FAQs</h4>
          <div style={styles.faqList}>
            {[
              { q: 'How do I track my injection?', a: 'Tap any date on the Home calendar to log your injection.' },
              { q: 'What if I miss an injection?', a: 'Contact your provider. Generally, take it as soon as you remember unless your next dose is within 2 days.' },
              { q: 'How do I update my goals?', a: 'Go to Profile → Goals & Preferences to adjust your daily targets.' },
              { q: 'Can I change my injection day?', a: 'Yes! Update it in Goals & Preferences or on the Home calendar.' },
            ].map((faq, idx) => (
              <details key={idx} style={styles.faqItem}>
                <summary style={styles.faqQuestion}>{faq.q}</summary>
                <p style={styles.faqAnswer}>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
        
        <div style={styles.helpSection}>
          <h4 style={styles.helpSectionTitle}>App Info</h4>
          <div style={styles.appInfoCard}>
            <p style={styles.appInfoRow}><span>Version</span><span>1.0.0</span></p>
            <p style={styles.appInfoRow}><span>Terms of Service</span><span style={styles.appInfoLink}>View →</span></p>
            <p style={styles.appInfoRow}><span>Privacy Policy</span><span style={styles.appInfoLink}>View →</span></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.screenContent} className="fade-in">
      <header style={styles.profileHeader}>
        <div style={styles.avatar}>
          <span style={styles.avatarText}>{user.name[0]}</span>
        </div>
        <h1 style={styles.profileName}>{user.name}</h1>
        <p style={styles.profileJourney}>Week {user.week} of your journey</p>
        
        {/* Level Badge - Now clickable */}
        <div style={styles.levelBadgeProfile} onClick={() => setShowLoyalty(true)} className="card-hover">
          <span style={styles.levelBadgeIcon}>⭐</span>
          <span style={styles.levelBadgeText}>{user.loyaltyTier || 'Bronze'} Member</span>
          <span style={styles.levelBadgePoints}>${user.lifetimeSpent || 0} spent</span>
        </div>
      </header>

      {/* Loyalty Program Card */}
      <div style={styles.loyaltyPreviewCard} className="card-hover" onClick={() => setShowLoyalty(true)}>
        <div style={styles.loyaltyPreviewLeft}>
          <div style={{
            ...styles.loyaltyPreviewBadge,
            background: user.loyaltyTier === 'Platinum' ? 'linear-gradient(145deg, #F5F5F5 0%, #A0A0A0 100%)' :
                       user.loyaltyTier === 'Gold' ? 'linear-gradient(145deg, #FFE55C 0%, #B8860B 100%)' :
                       user.loyaltyTier === 'Silver' ? 'linear-gradient(145deg, #E8E8E8 0%, #A8A8A8 100%)' :
                       'linear-gradient(145deg, #D4A574 0%, #8B6914 100%)',
            border: user.loyaltyTier === 'Platinum' ? '2px solid #8A8A8A' :
                   user.loyaltyTier === 'Gold' ? '2px solid #B8860B' :
                   user.loyaltyTier === 'Silver' ? '2px solid #909090' :
                   '2px solid #8B6914',
            boxShadow: user.loyaltyTier === 'Platinum' ? '0 3px 10px rgba(160,160,160,0.4)' :
                      user.loyaltyTier === 'Gold' ? '0 3px 10px rgba(212,175,55,0.4)' :
                      user.loyaltyTier === 'Silver' ? '0 3px 10px rgba(168,168,168,0.3)' :
                      '0 3px 10px rgba(205,127,50,0.3)',
          }}>
            <span style={{
              fontSize: '18px',
              color: user.loyaltyTier === 'Platinum' ? '#4A4A4A' : '#FFFFFF',
              textShadow: user.loyaltyTier === 'Platinum' ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
            }}>
              {user.loyaltyTier === 'Platinum' ? '◆' : user.loyaltyTier === 'Gold' ? '✧' : user.loyaltyTier === 'Silver' ? '❖' : '✦'}
            </span>
          </div>
          <div style={styles.loyaltyPreviewInfo}>
            <h4 style={styles.loyaltyPreviewTitle}>{user.loyaltyTier || 'Bronze'} Rewards</h4>
            <p style={styles.loyaltyPreviewSubtext}>
              {user.referralCount || 0} referrals • ${user.referralCredits || 0} credits
            </p>
          </div>
        </div>
        <div style={styles.loyaltyPreviewArrow}>→</div>
      </div>

      {/* Streak & Stats */}
      <div style={styles.statsRow}>
        <div style={styles.statItem}>
          <span style={styles.statValue}>🔥 {user.currentStreak || 0}</span>
          <span style={styles.statLabel}>Day Streak</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <span style={styles.statValue}>{weightLoss}</span>
          <span style={styles.statLabel}>lbs Lost</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <span style={styles.statValue}>{user.longestStreak || 0}</span>
          <span style={styles.statLabel}>Best Streak</span>
        </div>
      </div>

      {/* Weight Log Section */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Weight Progress</h3>
          <button style={styles.addButton} onClick={() => setShowWeightLog(!showWeightLog)}>
            {showWeightLog ? 'Hide' : '+ Log'}
          </button>
        </div>
        
        {showWeightLog && (
          <div style={styles.weightLogInput}>
            <input 
              type="number" 
              placeholder="Enter weight (lbs)"
              style={styles.weightInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value) {
                  const newLog = {
                    date: new Date().toISOString().split('T')[0],
                    weight: parseFloat(e.target.value)
                  };
                  setUser({
                    ...user,
                    weightLog: [...(user.weightLog || []), newLog]
                  });
                  e.target.value = '';
                  setShowWeightLog(false);
                }
              }}
            />
            <p style={styles.weightInputHint}>Press Enter to save</p>
          </div>
        )}

        <div style={styles.weightChart}>
          {user.weightLog?.slice(-5).map((entry, idx) => {
            const maxWeight = Math.max(...user.weightLog.slice(-5).map(e => e.weight));
            const minWeight = Math.min(...user.weightLog.slice(-5).map(e => e.weight));
            const range = maxWeight - minWeight || 1;
            const height = ((entry.weight - minWeight) / range) * 60 + 20;
            
            return (
              <div key={idx} style={styles.weightChartPoint}>
                <div style={{...styles.weightChartBar, height: `${height}%`}} />
                <span style={styles.weightChartValue}>{entry.weight}</span>
                <span style={styles.weightChartDate}>
                  {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Badges Section */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Badges Earned</h3>
        <div style={styles.badgesGrid}>
          {badges.map((badge, idx) => (
            <div 
              key={idx} 
              style={{
                ...styles.badgeCard,
                opacity: badge.earned ? 1 : 0.4
              }}
            >
              <span style={styles.badgeIcon}>{badge.icon}</span>
              <span style={styles.badgeName}>{badge.name}</span>
              {badge.earned && <span style={styles.badgeCheck}>✓</span>}
            </div>
          ))}
        </div>
      </section>

      {/* Provider Connection */}
      <section style={styles.section}>
        <div style={styles.providerCard}>
          <div style={styles.providerCardIcon}>🩺</div>
          <div style={styles.providerCardInfo}>
            <p style={styles.providerCardTitle}>Connected to Provider</p>
            <p style={styles.providerCardText}>Your progress is shared with Dr. Williams</p>
            <p style={styles.providerCardAppt}>Next appointment: {user.nextAppointment || 'Not scheduled'}</p>
          </div>
        </div>
      </section>

      <div style={styles.menuList}>
        {menuItems.map((item, idx) => (
          <div 
            key={idx} 
            style={styles.menuItem} 
            className="card-hover"
            onClick={() => setActiveSubscreen(item.id)}
          >
            <span style={styles.menuIcon}>{item.icon}</span>
            <span style={styles.menuLabel}>{item.label}</span>
            <span style={styles.menuArrow}>›</span>
          </div>
        ))}
      </div>

      <button style={styles.signOutButton}>Sign Out</button>
    </div>
  );
}

// Modal Component
function Modal({ activeModal, setActiveModal }) {
  // All services data for modals
  const allServices = {
    semaglutide: {
      title: 'Semaglutide',
      subtitle: 'GLP-1 Weight Loss',
      description: 'Semaglutide is an FDA-approved GLP-1 receptor agonist that helps control appetite, reduce cravings, and regulate blood sugar levels. It works by mimicking the GLP-1 hormone, which slows gastric emptying and increases feelings of fullness.',
      benefits: [
        'Reduces appetite and controls cravings',
        'Helps regulate blood sugar levels',
        'Weekly self-administered injection',
        'Proven effective for sustainable weight loss',
        'Supports muscle preservation with proper nutrition'
      ],
      pricing: 'Initial consult + first month: $300 | Monthly: $200-$300'
    },
    tirzepatide: {
      title: 'Tirzepatide',
      subtitle: 'Dual-Action GLP-1/GIP',
      description: 'Tirzepatide is a next-generation weight loss medication that targets both GLP-1 and GIP receptors for enhanced results. This dual-action approach can lead to superior weight loss compared to single-receptor medications.',
      benefits: [
        'Dual hormone action for enhanced results',
        'Superior weight loss potential',
        'Improved metabolic function',
        'Weekly self-administered injection',
        'May be more effective for some patients'
      ],
      pricing: 'Initial consult: $300 | Monthly: $200-$475 (dose dependent)'
    },
    phentermine: {
      title: 'Phentermine',
      subtitle: 'Appetite Suppressant',
      description: 'Phentermine is a proven appetite suppressant that helps control hunger signals and supports your weight loss journey. It\'s typically used for short-term weight management.',
      benefits: [
        'Effective appetite suppression',
        'Boosts energy levels',
        'Daily oral medication',
        'Affordable option'
      ],
      pricing: '$40/month'
    },
    'immunity-boost': {
      title: 'Immunity Boost IV',
      subtitle: 'Improvement Tier - $149',
      description: 'Fortify your body\'s defenses with our immunity-focused IV infusion. Packed with vitamin C, zinc, and other immune-supporting nutrients delivered directly to your bloodstream for maximum absorption.',
      benefits: [
        'Boosts immune system function',
        'Helps fight off illness',
        'High-dose Vitamin C',
        'Zinc and antioxidants',
        '1000cc saline base for hydration'
      ],
      pricing: '$149 per session'
    },
    'gut-boost': {
      title: 'Gut Boost IV',
      subtitle: 'Improvement Tier - $149',
      description: 'Repair and heal your gut lining with our specialized gut health IV infusion. Essential nutrients support digestive wellness and reduce inflammation.',
      benefits: [
        'Supports gut lining repair',
        'Reduces digestive inflammation',
        'Improves nutrient absorption',
        'Healing amino acids and minerals'
      ],
      pricing: '$149 per session'
    },
    'detox-boost': {
      title: 'Detox Boost IV',
      subtitle: 'Improvement Tier - $149',
      description: 'Cleanse and rejuvenate with our detoxification IV blend. Formulated to help flush out toxins and impurities while supporting liver function.',
      benefits: [
        'Flushes toxins from the body',
        'Supports liver function',
        'Contains glutathione',
        'Rejuvenating antioxidants'
      ],
      pricing: '$149 per session'
    },
    'beauty-boost': {
      title: 'Beauty Boost IV',
      subtitle: 'Upgrade Tier - $179',
      description: 'Our luxurious beauty blend strengthens hair, improves skin health, and reduces inflammation for a radiant glow from the inside out.',
      benefits: [
        'Promotes glowing, healthy skin',
        'Strengthens hair and nails',
        'Contains biotin and collagen support',
        'Anti-inflammatory nutrients'
      ],
      pricing: '$179 per session'
    },
    'recovery-boost': {
      title: 'Recovery Boost IV',
      subtitle: 'Upgrade Tier - $179',
      description: 'Supercharge your fitness journey with our recovery-focused IV infusion. Accelerates muscle recovery and reduces soreness after intense workouts.',
      benefits: [
        'Faster muscle recovery',
        'Reduces post-workout soreness',
        'Essential amino acids',
        'Enhances athletic performance'
      ],
      pricing: '$179 per session'
    },
    'energy-boost': {
      title: 'Energy Boost IV',
      subtitle: 'Upgrade Tier - $179',
      description: 'Refresh and recharge with our energy-focused IV blend. Provides sustained energy throughout the day without the crash of caffeine.',
      benefits: [
        'Sustained energy levels',
        'Enhanced mental clarity',
        'B vitamins complex',
        'No crash or jitters'
      ],
      pricing: '$179 per session'
    },
    'meyers-cocktail': {
      title: 'Meyer\'s Cocktail',
      subtitle: 'Advanced Tier - $199',
      description: 'The original and time-tested IV therapy blend. The Meyer\'s Cocktail has been used for decades to alleviate chronic ailments and restore health balance.',
      benefits: [
        'Relieves chronic fatigue',
        'Supports migraine management',
        'Balanced vitamin formula',
        'Proven effective over decades'
      ],
      pricing: '$199 per session'
    },
    'physique-boost': {
      title: 'Physique Boost IV',
      subtitle: 'Advanced Tier - $199',
      description: 'Jumpstart your weight loss goals with our physique-focused IV infusion. Helps rev up your body\'s natural fat-burning processes.',
      benefits: [
        'Boosts metabolism',
        'Supports fat burning',
        'Contains lipotropic nutrients',
        'Complements weight loss programs'
      ],
      pricing: '$199 per session'
    },
    'overall-boost': {
      title: 'Overall Boost IV',
      subtitle: 'Advanced Tier - $199',
      description: 'Unlock your body\'s full potential with our comprehensive wellness IV. Optimizes overall vitality and well-being with a full spectrum of nutrients.',
      benefits: [
        'Complete wellness support',
        'Full spectrum nutrients',
        'Optimal health promotion',
        'Total body rejuvenation'
      ],
      pricing: '$199 per session'
    },
    'high-dose-vitamin-c': {
      title: 'High Dose Vitamin C',
      subtitle: 'High Dose Drip',
      description: 'Powerful antioxidant therapy with concentrated Vitamin C. Supports immune function, collagen production, and cellular health.',
      benefits: [
        'Powerful antioxidant protection',
        'Boosts immune system',
        'Supports collagen production',
        'Promotes cellular health'
      ],
      pricing: '10g: $179 | 20g: $219'
    },
    glutathione: {
      title: 'Glutathione',
      subtitle: 'Master Antioxidant',
      description: 'Glutathione is known as the "master antioxidant" for its powerful detoxification properties. Also popular for skin brightening and anti-aging benefits.',
      benefits: [
        'Most powerful antioxidant',
        'Skin brightening effects',
        'Supports detoxification',
        'Anti-aging properties'
      ],
      pricing: '1200mg: $179 | 2000mg: $219'
    },
    'nad-therapy': {
      title: 'NAD+ Therapy',
      subtitle: 'Cellular Energy',
      description: 'NAD+ is a coenzyme essential for cellular energy production. Levels naturally decline with age, and supplementation can support metabolic health, mental clarity, and overall vitality.',
      benefits: [
        'Boosts cellular energy production',
        'Supports mental clarity and focus',
        'Promotes healthy aging',
        'May enhance exercise endurance'
      ],
      pricing: '250mg: $400 | 500mg: $550 | 1000mg: $700'
    },
    b12: {
      title: 'Vitamin B12',
      subtitle: 'Energy & Focus',
      description: 'Vitamin B12 is essential for energy production, brain function, and red blood cell formation. Quick injection for immediate absorption.',
      benefits: [
        'Boosts energy naturally',
        'Enhances mental clarity',
        'Supports mood balance',
        'Quick and easy injection'
      ],
      pricing: '$15 per injection'
    },
    'b-complex': {
      title: 'B-Complex',
      subtitle: 'Complete B Vitamins',
      description: 'Full spectrum of B vitamins in one injection. Supports metabolism, energy production, and nervous system health.',
      benefits: [
        'All essential B vitamins',
        'Supports metabolism',
        'Promotes nerve health',
        'Enhances energy production'
      ],
      pricing: '$20 per injection'
    },
    'vitamin-d': {
      title: 'Vitamin D',
      subtitle: 'Sunshine Vitamin',
      description: 'Vitamin D is essential for bone health, immune function, and mood regulation. Especially important for those with limited sun exposure.',
      benefits: [
        'Supports bone health',
        'Boosts immune function',
        'Improves mood',
        'Helps hormone balance'
      ],
      pricing: '$20 per injection'
    },
    'lipo-c': {
      title: 'Lipo-C Injections',
      subtitle: 'Fat Metabolism Support',
      description: 'Lipo-C combines lipotropic compounds that support liver function and fat metabolism. This can complement your GLP-1 treatment by optimizing your body\'s fat-burning processes.',
      benefits: [
        'Supports healthy fat metabolism',
        'Promotes liver health and detoxification',
        'May boost energy levels',
        'Enhances overall metabolic function'
      ],
      pricing: '$20/month'
    },
    'immune-boost-shot': {
      title: 'Immune Boost Shot',
      subtitle: 'Quick Defense',
      description: 'Fast-acting immune support injection to help keep you healthy during cold and flu season or when you feel something coming on.',
      benefits: [
        'Quick immune support',
        'Cold & flu defense',
        'Fast protection',
        'Vitamin blend'
      ],
      pricing: '$20 per injection'
    },
    'bhrt-women': {
      title: 'Women\'s BHRT',
      subtitle: 'Hormone Balance',
      description: 'Bioidentical Hormone Replacement Therapy uses hormones identical to those your body produces naturally. Helps address symptoms like fatigue, weight gain, mood swings, and reduced libido.',
      benefits: [
        'Reduces fatigue and increases energy',
        'Improves mood stability',
        'Better sleep quality',
        'Supports healthy weight management'
      ],
      pricing: '$50/month (plus medication cost)'
    },
    'bhrt-men': {
      title: 'Men\'s Testosterone Therapy',
      subtitle: 'Hormone Optimization',
      description: 'Testosterone replacement therapy to restore optimal hormone levels. Helps address symptoms like low energy, reduced muscle mass, and decreased libido.',
      benefits: [
        'Increased energy and vitality',
        'Supports muscle mass',
        'Improves libido',
        'Enhanced mental clarity'
      ],
      pricing: '$50/month (plus medication cost)'
    },
    'hormone-panel': {
      title: 'Hormone Lab Panel',
      subtitle: 'Comprehensive Testing',
      description: 'Complete hormone panel to assess your current levels and establish a baseline for treatment. Essential for personalized hormone therapy.',
      benefits: [
        'Full hormone panel',
        'Accurate baseline levels',
        'Guides treatment decisions',
        'Health insights'
      ],
      pricing: 'Male Hormone Panel: $220'
    },
    'emsculpt-neo': {
      title: 'Emsculpt Neo',
      subtitle: 'Build Muscle + Burn Fat',
      description: 'Emsculpt Neo is a revolutionary non-invasive body contouring treatment that simultaneously burns fat and builds muscle using RF (radiofrequency) and HIFEM (High-Intensity Focused Electromagnetic) technology. Perfect for abs, glutes, arms, and legs.',
      benefits: [
        'Burns fat while building muscle',
        'Non-invasive with no downtime',
        '30-minute treatment sessions',
        'Results in 4 treatments',
        'Tones abs, lifts glutes, sculpts arms/legs'
      ],
      pricing: 'Per session: $850 | 4-treatment package: $3,400'
    },
    latisse: {
      title: 'Latisse',
      subtitle: 'Lash Growth Serum',
      description: 'Latisse is an FDA-approved prescription treatment for inadequate or sparse eyelashes. Grow longer, fuller, and darker lashes with consistent use.',
      benefits: [
        'Longer eyelashes',
        'Fuller lash appearance',
        'Darker lashes',
        'FDA-approved'
      ],
      pricing: '$120 per bottle'
    },
    // Legacy support for old modal IDs
    sermorelin: {
      title: 'Sermorelin Therapy',
      subtitle: 'Growth Hormone Support',
      description: 'Sermorelin is a growth hormone-releasing peptide that stimulates your body\'s natural production of growth hormone. This supports muscle preservation during weight loss—a key concern for GLP-1 patients.',
      benefits: [
        'Preserves lean muscle mass during weight loss',
        'Supports faster recovery from workouts',
        'May improve sleep quality and energy levels',
        'Promotes healthy body composition'
      ],
      pricing: 'Contact us for pricing'
    },
    nad: {
      title: 'NAD+ Therapy',
      subtitle: 'Cellular Energy',
      description: 'NAD+ is a coenzyme essential for cellular energy production. Levels naturally decline with age, and supplementation can support metabolic health, mental clarity, and overall vitality.',
      benefits: [
        'Boosts cellular energy production',
        'Supports mental clarity and focus',
        'Promotes healthy aging at the cellular level',
        'May enhance exercise endurance'
      ],
      pricing: '250mg: $400 | 500mg: $550 | 1000mg: $700'
    },
    lipoc: {
      title: 'Lipo-C Injections',
      subtitle: 'Fat Metabolism Support',
      description: 'Lipo-C combines lipotropic compounds that support liver function and fat metabolism. This can complement your GLP-1 treatment by optimizing your body\'s fat-burning processes.',
      benefits: [
        'Supports healthy fat metabolism',
        'Promotes liver health and detoxification',
        'May boost energy levels',
        'Enhances overall metabolic function'
      ],
      pricing: '$20/month'
    }
  };

  const data = allServices[activeModal];
  if (!data) return null;

  return (
    <div style={styles.modalOverlay} onClick={() => setActiveModal(null)}>
      <div style={styles.modalContent} className="slide-up" onClick={e => e.stopPropagation()}>
        <button style={styles.modalClose} onClick={() => setActiveModal(null)}>×</button>
        <span style={styles.modalSubtitle}>{data.subtitle}</span>
        <h2 style={styles.modalTitle}>{data.title}</h2>
        <p style={styles.modalDescription}>{data.description}</p>
        
        <div style={styles.modalBenefits}>
          <h4 style={styles.benefitsTitle}>Key Benefits</h4>
          {data.benefits.map((benefit, idx) => (
            <div key={idx} style={styles.benefitItem}>
              <span style={styles.benefitCheck}>✓</span>
              <span style={styles.benefitText}>{benefit}</span>
            </div>
          ))}
        </div>

        <div style={styles.modalFooter}>
          <span style={styles.modalPrice}>{data.pricing}</span>
          <button style={styles.primaryButton} className="btn-primary">
            Book Consultation
          </button>
          <a href="tel:801-917-4386" style={styles.modalPhoneLink}>
            Or call 801-917-4386
          </a>
        </div>
      </div>
    </div>
  );
}

// Bottom Navigation
function BottomNav({ currentScreen, setCurrentScreen }) {
  const items = [
    { id: 'home', icon: <HomeIcon />, label: 'Home' },
    { id: 'nutrition', icon: <NutritionIcon />, label: 'Nutrition' },
    { id: 'fitness', icon: <FitnessIcon />, label: 'Fitness' },
    { id: 'education', icon: <EducationIcon />, label: 'Learn' },
    { id: 'profile', icon: <ProfileIcon />, label: 'Profile' },
  ];

  return (
    <nav style={styles.bottomNav}>
      {items.map(item => (
        <button
          key={item.id}
          style={{
            ...styles.navButton,
            color: currentScreen === item.id ? '#4A6741' : '#9B9B9B'
          }}
          onClick={() => setCurrentScreen(item.id)}
          className="nav-item"
        >
          {React.cloneElement(item.icon, { 
            color: currentScreen === item.id ? '#4A6741' : '#9B9B9B' 
          })}
          <span style={styles.navLabel}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

// Icons
function HomeIcon({ color = '#9B9B9B' }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function NutritionIcon({ color = '#9B9B9B' }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C12 2 8 6 8 12C8 18 12 22 12 22C12 22 16 18 16 12C16 6 12 2 12 2Z" stroke={color} strokeWidth="2"/>
      <path d="M12 22V12" stroke={color} strokeWidth="2"/>
    </svg>
  );
}

function FitnessIcon({ color = '#9B9B9B' }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M6 12H18M4 8H6V16H4V8ZM18 8H20V16H18V8Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function TreatmentIcon({ color = '#9B9B9B' }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 8V16M8 12H16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2"/>
    </svg>
  );
}

function ProfileIcon({ color = '#9B9B9B' }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2"/>
      <path d="M4 20C4 16 8 14 12 14C16 14 20 16 20 20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function EducationIcon({ color = '#9B9B9B' }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 3L2 9L12 15L22 9L12 3Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      <path d="M6 11V17L12 21L18 17V11" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 9V15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function WaterIcon({ color = '#2AABB3' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2L5 10C5 14 7 17 10 17C13 17 15 14 15 10L10 2Z" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
}

function ProteinIcon({ color = '#4A6741' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="6" stroke={color} strokeWidth="1.5"/>
      <circle cx="10" cy="10" r="2" fill={color}/>
    </svg>
  );
}

function FiberIcon({ color = '#C4956A' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 3V17M6 7C6 7 8 5 10 5C12 5 14 7 14 7M5 12C5 12 7 14 10 14C13 14 15 12 15 12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function ExerciseIcon({ color = '#9B7E9B' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 10H16M2 7H4V13H2V7ZM16 7H18V13H16V7Z" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// Styles
const styles = {
  appContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #F5F4F2 0%, #EAE8E4 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: "'DM Sans', sans-serif",
  },
  
  // Mode Toggle
  modeToggle: {
    display: 'flex',
    gap: '10px',
    marginBottom: '16px',
  },
  modeBtn: {
    padding: '10px 20px',
    borderRadius: '25px',
    border: '2px solid #E0E0E0',
    background: '#FFFFFF',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  modeBtnActive: {
    borderColor: '#4A6741',
    background: '#4A6741',
    color: '#FFFFFF',
  },
  phoneFrame: {
    width: '100%',
    maxWidth: '390px',
    height: '844px',
    background: '#FAF9F7',
    borderRadius: '40px',
    overflow: 'hidden',
    boxShadow: '0 25px 80px rgba(0,0,0,0.15), 0 10px 30px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  screen: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  screenContent: {
    padding: '24px 20px',
    paddingBottom: '100px',
  },
  
  // Header
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
  },
  brandHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
  },
  brandName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4A6741',
    letterSpacing: '1px',
  },
  greeting: {
    fontSize: '14px',
    color: '#8B8B8B',
    marginBottom: '4px',
    fontWeight: '400',
  },
  userName: {
    fontFamily: "'Fraunces', serif",
    fontSize: '28px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  loyaltyBadgeSmall: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '14px',
    padding: '4px 10px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#FFFFFF',
    whiteSpace: 'nowrap',
    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  weekBadge: {
    background: '#E8EDE6',
    borderRadius: '12px',
    padding: '8px 14px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  weekLabel: {
    fontSize: '11px',
    color: '#6B6B6B',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  weekNumber: {
    fontFamily: "'Fraunces', serif",
    fontSize: '20px',
    fontWeight: '600',
    color: '#4A6741',
  },
  
  // Hero Card
  heroCard: {
    background: 'linear-gradient(135deg, #4A6741 0%, #5B7B50 100%)',
    borderRadius: '20px',
    padding: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
  },
  heroContent: {
    flex: 1,
  },
  heroSubtitle: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px',
  },
  heroTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '22px',
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: '8px',
  },
  heroText: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.85)',
    lineHeight: '1.5',
    maxWidth: '200px',
  },
  heroImagePlaceholder: {
    width: '80px',
    height: '80px',
  },
  
  // Sections
  section: {
    marginBottom: '28px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '18px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '16px',
  },
  addButton: {
    background: 'none',
    border: '1px solid #E0E0E0',
    borderRadius: '20px',
    padding: '6px 14px',
    fontSize: '13px',
    color: '#4A6741',
    cursor: 'pointer',
    marginBottom: '16px',
  },
  
  // Goals Grid
  goalsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  goalCard: {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '16px',
    cursor: 'pointer',
  },
  goalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  goalIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalPercentage: {
    fontSize: '13px',
    fontWeight: '600',
  },
  goalProgress: {
    marginBottom: '12px',
  },
  progressBar: {
    height: '6px',
    background: '#F0EFED',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '3px',
  },
  goalLabel: {
    fontSize: '13px',
    color: '#6B6B6B',
    marginBottom: '2px',
  },
  goalValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2D2D2D',
  },
  goalUnit: {
    fontSize: '13px',
    fontWeight: '400',
    color: '#9B9B9B',
  },
  
  // Treatment Preview
  treatmentPreview: {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
  },
  treatmentPreviewContent: {
    flex: 1,
  },
  treatmentTag: {
    fontSize: '11px',
    color: '#C4956A',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '6px',
    display: 'block',
  },
  treatmentPreviewTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '17px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '4px',
  },
  treatmentPreviewText: {
    fontSize: '13px',
    color: '#8B8B8B',
  },
  treatmentArrow: {
    fontSize: '20px',
    color: '#4A6741',
  },
  
  // Page Header
  pageHeader: {
    marginBottom: '24px',
  },
  pageTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '28px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '4px',
  },
  pageSubtitle: {
    fontSize: '14px',
    color: '#8B8B8B',
  },
  
  // Macro Overview
  macroOverview: {
    display: 'flex',
    justifyContent: 'space-around',
    background: '#FFFFFF',
    borderRadius: '20px',
    padding: '20px',
    marginBottom: '24px',
  },
  macroCircle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  macroCircleContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    marginTop: '-10px',
  },
  macroValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2D2D2D',
    display: 'block',
  },
  macroUnit: {
    fontSize: '11px',
    color: '#9B9B9B',
  },
  macroLabel: {
    fontSize: '12px',
    color: '#6B6B6B',
    marginTop: '8px',
  },
  
  // Enhanced Macro Overview - Protein Focused
  macroOverviewEnhanced: {
    background: '#FFFFFF',
    borderRadius: '20px',
    padding: '24px 16px',
    marginBottom: '20px',
  },
  proteinHighlight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  proteinCircleOuter: {
    position: 'relative',
    width: '140px',
    height: '140px',
  },
  proteinInner: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  proteinValue: {
    fontSize: '36px',
    fontWeight: '600',
    color: '#4A6741',
  },
  proteinUnit: {
    fontSize: '16px',
    color: '#4A6741',
    marginLeft: '2px',
  },
  proteinLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2D2D2D',
    marginTop: '8px',
  },
  proteinGoal: {
    fontSize: '13px',
    color: '#8B8B8B',
    marginTop: '2px',
  },
  secondaryMacros: {
    display: 'flex',
    justifyContent: 'center',
    gap: '32px',
  },
  secondaryMacroCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  secondaryMacroCircle: {
    position: 'relative',
    width: '70px',
    height: '70px',
  },
  secondaryMacroValue: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '16px',
    fontWeight: '600',
    color: '#2D2D2D',
  },
  secondaryMacroLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginTop: '6px',
  },
  secondaryMacroGoal: {
    fontSize: '11px',
    color: '#8B8B8B',
    marginTop: '2px',
  },
  dailySummaryEnhanced: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px 12px',
    marginBottom: '20px',
  },
  summaryItemProtein: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1.2,
  },
  summaryValueProtein: {
    fontFamily: "'Fraunces', serif",
    fontSize: '22px',
    fontWeight: '600',
    color: '#4A6741',
  },
  summaryLabelProtein: {
    fontSize: '10px',
    fontWeight: '600',
    color: '#4A6741',
    letterSpacing: '0.5px',
  },
  
  // Meals
  mealsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  mealCard: {
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    cursor: 'pointer',
  },
  mealTime: {
    fontSize: '12px',
    color: '#9B9B9B',
    width: '60px',
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '2px',
  },
  mealMacros: {
    fontSize: '13px',
    color: '#6B6B6B',
  },
  mealPrompt: {
    fontSize: '13px',
    color: '#C4956A',
  },
  mealStatus: {
    width: '28px',
    height: '28px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    color: '#4A6741',
  },
  
  // Tips
  tipsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  tipCard: {
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
  },
  tipIcon: {
    fontSize: '24px',
  },
  tipTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '4px',
  },
  tipDesc: {
    fontSize: '13px',
    color: '#8B8B8B',
    lineHeight: '1.4',
  },

  // Meal Plan Prompt
  mealPlanPrompt: {
    textAlign: 'center',
    padding: '20px 10px',
    marginBottom: '24px',
  },
  mealPlanBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'linear-gradient(135deg, #4A6741 0%, #5B7B50 100%)',
    borderRadius: '20px',
    padding: '6px 14px',
    marginBottom: '20px',
  },
  mealPlanBadgeIcon: {
    fontSize: '14px',
  },
  mealPlanBadgeText: {
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: '500',
  },
  mealPlanIllustration: {
    marginBottom: '20px',
  },
  mealPlanTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '22px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '10px',
  },
  mealPlanDesc: {
    fontSize: '14px',
    color: '#6B6B6B',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  mealPlanFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '24px',
  },
  mealPlanFeature: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '12px 16px',
  },
  mpFeatureIcon: {
    fontSize: '20px',
  },
  mpFeatureText: {
    fontSize: '14px',
    color: '#2D2D2D',
  },

  // Day Selector
  daySelector: {
    display: 'flex',
    gap: '6px',
    marginBottom: '16px',
    overflowX: 'auto',
    paddingBottom: '4px',
  },
  daySelectorBtn: {
    background: '#F5F4F2',
    border: 'none',
    borderRadius: '20px',
    padding: '8px 14px',
    fontSize: '13px',
    color: '#6B6B6B',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
  },
  daySelectorBtnActive: {
    background: '#4A6741',
    color: '#FFFFFF',
  },

  // Daily Summary
  dailySummary: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '20px',
    gap: '20px',
  },
  summaryItem: {
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#4A6741',
    display: 'block',
  },
  summaryLabel: {
    fontSize: '11px',
    color: '#9B9B9B',
    textTransform: 'uppercase',
  },
  summaryDivider: {
    width: '1px',
    height: '30px',
    background: '#E8E8E8',
  },

  // Meal Plan List
  mealPlanList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  mealPlanCard: {
    background: '#FFFFFF',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  mealPlanCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '16px',
    cursor: 'pointer',
  },
  mealTimeIcon: {
    fontSize: '24px',
    width: '44px',
    height: '44px',
    background: '#F5F4F2',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealPlanCardInfo: {
    flex: 1,
  },
  mealPlanType: {
    fontSize: '11px',
    color: '#9B9B9B',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  mealPlanName: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '2px',
  },
  mealPlanMacros: {
    fontSize: '12px',
    color: '#6B6B6B',
  },
  mealExpandIcon: {
    fontSize: '20px',
    color: '#9B9B9B',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealPlanDetails: {
    padding: '0 16px 16px',
    borderTop: '1px solid #F0EFED',
  },
  mealDescription: {
    fontSize: '14px',
    color: '#6B6B6B',
    lineHeight: '1.5',
    marginTop: '12px',
    marginBottom: '12px',
  },
  ingredientsList: {
    marginBottom: '12px',
  },
  ingredientsTitle: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '6px',
  },
  ingredientItem: {
    fontSize: '13px',
    color: '#6B6B6B',
    lineHeight: '1.6',
  },
  instructionsList: {
    marginBottom: '12px',
  },
  instructionsTitle: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '6px',
  },
  instructionsText: {
    fontSize: '13px',
    color: '#6B6B6B',
    lineHeight: '1.5',
  },
  glp1TipBox: {
    display: 'flex',
    gap: '10px',
    background: '#F5F8F4',
    borderRadius: '10px',
    padding: '12px',
    marginBottom: '12px',
  },
  glp1TipIcon: {
    fontSize: '16px',
  },
  glp1TipText: {
    fontSize: '13px',
    color: '#4A6741',
    lineHeight: '1.4',
  },
  logMealButton: {
    width: '100%',
    background: '#4A6741',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '8px',
  },
  logMealButtonLogged: {
    background: '#E8EDE6',
    color: '#4A6741',
  },

  // Snacks
  snackList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  snackCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px',
  },
  snackEmoji: {
    fontSize: '24px',
  },
  snackInfo: {
    flex: 1,
  },
  snackName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '2px',
  },
  snackMacros: {
    fontSize: '12px',
    color: '#9B9B9B',
  },

  // Hydration Reminder
  hydrationReminder: {
    display: 'flex',
    gap: '14px',
    background: '#E8F4F8',
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '20px',
  },
  hydrationIcon: {
    fontSize: '24px',
  },
  hydrationContent: {
    flex: 1,
  },
  hydrationTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#4A8BA8',
    marginBottom: '4px',
  },
  hydrationText: {
    fontSize: '13px',
    color: '#6B6B6B',
    lineHeight: '1.4',
  },

  // Calorie Info Banner (weight-based)
  calorieInfoBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'linear-gradient(135deg, #F5F8F4 0%, #E8EDE6 100%)',
    borderRadius: '14px',
    padding: '14px 16px',
    marginBottom: '16px',
    border: '1px solid #D8E0D5',
  },
  calorieInfoIcon: {
    fontSize: '24px',
  },
  calorieInfoContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  calorieInfoTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#4A6741',
    marginBottom: '2px',
  },
  calorieInfoSubtext: {
    fontSize: '12px',
    color: '#6B6B6B',
  },

  // Edit Preferences Button
  editPrefsButton: {
    width: '100%',
    background: 'transparent',
    border: '1px solid #E0E0E0',
    borderRadius: '12px',
    padding: '14px',
    fontSize: '14px',
    color: '#6B6B6B',
    cursor: 'pointer',
    marginBottom: '20px',
  },

  // Meal Plan Setup Styles
  mpSetupHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  mpProgressDots: {
    display: 'flex',
    gap: '8px',
  },
  mpProgressDot: {
    width: '8px',
    height: '8px',
    borderRadius: '4px',
    background: '#E0E0E0',
  },
  mpProgressDotActive: {
    background: '#4A6741',
  },
  mpStepTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '22px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '8px',
  },
  mpStepSubtitle: {
    fontSize: '14px',
    color: '#6B6B6B',
    marginBottom: '24px',
  },
  mpOptionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '24px',
  },
  mpOptionCard: {
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px',
    textAlign: 'center',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'all 0.2s',
  },
  mpOptionCardSelected: {
    borderColor: '#4A6741',
    background: '#F5F8F4',
  },
  mpOptionIcon: {
    fontSize: '32px',
    marginBottom: '8px',
    display: 'block',
  },
  mpOptionName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '4px',
  },
  mpOptionDesc: {
    fontSize: '11px',
    color: '#9B9B9B',
  },
  mpChipGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '24px',
  },
  mpChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#FFFFFF',
    borderRadius: '24px',
    padding: '10px 16px',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'all 0.2s',
    fontSize: '14px',
    color: '#2D2D2D',
  },
  mpChipSelected: {
    borderColor: '#4A6741',
    background: '#F5F8F4',
  },
  mpDislikesSection: {
    marginBottom: '24px',
  },
  mpDislikesLabel: {
    fontSize: '14px',
    color: '#6B6B6B',
    marginBottom: '10px',
  },
  mpTextInput: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid #E0E0E0',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
  },
  mpCookingOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '24px',
  },
  mpCookingOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px 16px',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'all 0.2s',
  },
  mpCookingOptionSelected: {
    borderColor: '#4A6741',
    background: '#F5F8F4',
  },
  mpCookingIcon: {
    fontSize: '20px',
  },
  mpCookingName: {
    fontSize: '14px',
    color: '#2D2D2D',
  },
  mpMealCountSection: {
    marginBottom: '24px',
  },
  mpMealCountRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '12px',
  },
  mpMealCountLabel: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '2px',
  },
  mpMealCountHint: {
    fontSize: '12px',
    color: '#9B9B9B',
  },
  mpCounter: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  mpCounterBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '18px',
    border: '1px solid #E0E0E0',
    background: '#FFFFFF',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#4A6741',
  },
  mpCounterValue: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2D2D2D',
    minWidth: '24px',
    textAlign: 'center',
  },
  mpSummaryBox: {
    background: '#F5F8F4',
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '24px',
  },
  mpSummaryTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#4A6741',
    marginBottom: '12px',
  },
  mpSummaryItem: {
    fontSize: '13px',
    color: '#4B4B4B',
    marginBottom: '6px',
  },
  mpGenerating: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  mpGeneratingSpinner: {
    fontSize: '48px',
    marginBottom: '16px',
    display: 'inline-block',
  },
  mpGeneratingText: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '8px',
  },
  mpGeneratingSubtext: {
    fontSize: '13px',
    color: '#9B9B9B',
  },

  // ==================== ONBOARDING STYLES ====================
  onboardingContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '24px 20px',
    background: '#FAF9F7',
  },
  onboardingProgress: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '20px',
  },
  onboardingDot: {
    width: '8px',
    height: '8px',
    borderRadius: '4px',
    background: '#E0E0E0',
    transition: 'all 0.3s',
  },
  onboardingDotActive: {
    background: '#4A6741',
    width: '24px',
  },
  skipButton: {
    position: 'absolute',
    top: '24px',
    right: '20px',
    background: 'none',
    border: 'none',
    color: '#9B9B9B',
    fontSize: '14px',
    cursor: 'pointer',
  },
  onboardingContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '20px 0',
  },
  onboardingImage: {
    marginBottom: '24px',
  },
  onboardingIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    display: 'block',
  },
  onboardingTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '26px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '8px',
  },
  onboardingSubtitle: {
    fontSize: '16px',
    color: '#4A6741',
    marginBottom: '16px',
  },
  onboardingDesc: {
    fontSize: '14px',
    color: '#6B6B6B',
    lineHeight: '1.6',
    maxWidth: '300px',
  },
  onboardingNav: {
    padding: '20px 0',
  },

  // ==================== PROVIDER STYLES ====================
  providerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  providerName: {
    fontFamily: "'Fraunces', serif",
    fontSize: '24px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  providerAvatar: {
    fontSize: '40px',
  },
  providerStatsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    background: 'linear-gradient(135deg, #4A6741 0%, #5B7B50 100%)',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '24px',
  },
  providerStat: {
    textAlign: 'center',
  },
  providerStatValue: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#FFFFFF',
    display: 'block',
  },
  providerStatLabel: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
  },
  alertsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  alertCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#FFF5F0',
    borderRadius: '12px',
    padding: '14px',
  },
  alertIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '16px',
    background: '#FFCCBC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#E57373',
    fontWeight: '600',
  },
  alertContent: {
    flex: 1,
  },
  alertPatient: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  alertText: {
    fontSize: '12px',
    color: '#6B6B6B',
  },
  alertAction: {
    background: '#FFFFFF',
    border: '1px solid #E0E0E0',
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  appointmentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  appointmentCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px',
  },
  appointmentTime: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#4A6741',
    minWidth: '70px',
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  appointmentType: {
    fontSize: '12px',
    color: '#9B9B9B',
  },
  appointmentBtn: {
    background: '#E8EDE6',
    border: 'none',
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '12px',
    color: '#4A6741',
    cursor: 'pointer',
  },
  noAppointments: {
    textAlign: 'center',
    color: '#9B9B9B',
    padding: '20px',
    fontSize: '14px',
  },
  viewAllBtn: {
    background: 'none',
    border: 'none',
    color: '#4A6741',
    fontSize: '13px',
    cursor: 'pointer',
  },
  patientMiniList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  patientMiniCard: {
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '14px',
  },
  pmcHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  pmcAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, #4A6741 0%, #5B7B50 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontWeight: '500',
  },
  pmcInfo: {
    flex: 1,
  },
  pmcName: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  pmcWeek: {
    fontSize: '12px',
    color: '#9B9B9B',
  },
  pmcAlertBadge: {
    width: '20px',
    height: '20px',
    borderRadius: '10px',
    background: '#E57373',
    color: '#FFFFFF',
    fontSize: '11px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pmcStats: {
    display: 'flex',
    justifyContent: 'space-around',
    borderTop: '1px solid #F0EFED',
    paddingTop: '12px',
  },
  pmcStatItem: {
    textAlign: 'center',
  },
  pmcStatValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2D2D2D',
    display: 'block',
  },
  pmcStatLabel: {
    fontSize: '10px',
    color: '#9B9B9B',
    textTransform: 'uppercase',
  },
  quickActionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
  },
  quickActionCard: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px 8px',
    textAlign: 'center',
    cursor: 'pointer',
  },
  qaIcon: {
    fontSize: '24px',
    display: 'block',
    marginBottom: '6px',
  },
  qaLabel: {
    fontSize: '11px',
    color: '#6B6B6B',
  },

  // Patient List
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '12px 16px',
    marginBottom: '20px',
  },
  searchIcon: {
    fontSize: '16px',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    fontFamily: 'inherit',
  },
  patientList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  patientListCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '14px',
    cursor: 'pointer',
  },
  plcAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '22px',
    background: 'linear-gradient(135deg, #4A6741 0%, #5B7B50 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontSize: '18px',
    fontWeight: '500',
  },
  plcInfo: {
    flex: 1,
  },
  plcName: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  plcMeta: {
    fontSize: '12px',
    color: '#9B9B9B',
  },
  plcRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  plcCompliance: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '500',
  },
  plcAlert: {
    fontSize: '14px',
  },

  // Patient Detail
  patientDetailHeader: {
    marginBottom: '16px',
  },
  patientProfile: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  pdAvatar: {
    width: '80px',
    height: '80px',
    borderRadius: '40px',
    background: 'linear-gradient(135deg, #4A6741 0%, #5B7B50 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontSize: '32px',
    fontWeight: '500',
    margin: '0 auto 16px',
  },
  pdName: {
    fontFamily: "'Fraunces', serif",
    fontSize: '24px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '4px',
  },
  pdMeta: {
    fontSize: '14px',
    color: '#9B9B9B',
  },
  pdAlerts: {
    marginTop: '12px',
  },
  pdAlertItem: {
    background: '#FFF5F0',
    color: '#C4956A',
    fontSize: '12px',
    padding: '8px 12px',
    borderRadius: '8px',
    marginBottom: '6px',
  },
  pdTabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    overflowX: 'auto',
  },
  pdTab: {
    background: '#F5F4F2',
    border: 'none',
    borderRadius: '20px',
    padding: '8px 16px',
    fontSize: '13px',
    color: '#6B6B6B',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  pdTabActive: {
    background: '#4A6741',
    color: '#FFFFFF',
  },
  pdMetricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    marginBottom: '20px',
  },
  pdMetricCard: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'center',
  },
  pdMetricValue: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#4A6741',
    display: 'block',
  },
  pdMetricLabel: {
    fontSize: '11px',
    color: '#9B9B9B',
    textTransform: 'uppercase',
  },
  pdChartCard: {
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '20px',
  },
  pdChartTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '16px',
  },
  pdChart: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '120px',
  },
  pdChartBar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  pdChartBarFill: {
    width: '24px',
    borderRadius: '4px',
    transition: 'height 0.3s',
  },
  pdChartLabel: {
    fontSize: '11px',
    color: '#9B9B9B',
  },
  pdActions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  pdActionBtn: {
    flex: 1,
    minWidth: '100px',
    background: '#FFFFFF',
    border: '1px solid #E0E0E0',
    borderRadius: '10px',
    padding: '12px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  pdWeightChart: {
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px',
  },
  weightChartContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '150px',
  },
  weightPoint: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  weightBar: {
    width: '8px',
    background: '#4A6741',
    borderRadius: '4px',
  },
  weightValue: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  weightDate: {
    fontSize: '10px',
    color: '#9B9B9B',
  },
  pdNutritionStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  nutritionStatCard: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '16px',
  },
  nutritionStatHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
  },
  nutritionPercent: {
    color: '#4A6741',
  },
  nutritionBar: {
    height: '8px',
    background: '#F0EFED',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '6px',
  },
  nutritionBarFill: {
    height: '100%',
    borderRadius: '4px',
  },
  nutritionMeta: {
    fontSize: '12px',
    color: '#9B9B9B',
  },
  pdFitnessInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  fitnessInfoCard: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fitnessInfoLabel: {
    fontSize: '14px',
    color: '#6B6B6B',
  },
  fitnessInfoValue: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
    textTransform: 'capitalize',
  },

  // Messages
  messagesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  messageCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '14px',
    cursor: 'pointer',
  },
  msgAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '22px',
    background: 'linear-gradient(135deg, #4A6741 0%, #5B7B50 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontWeight: '500',
  },
  msgContent: {
    flex: 1,
  },
  msgHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
  },
  msgName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  msgTime: {
    fontSize: '12px',
    color: '#9B9B9B',
  },
  msgPreview: {
    fontSize: '13px',
    color: '#6B6B6B',
  },
  msgUnread: {
    width: '10px',
    height: '10px',
    borderRadius: '5px',
    background: '#4A6741',
  },

  // Analytics
  analyticsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '24px',
  },
  analyticsCard: {
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px',
    textAlign: 'center',
  },
  analyticsValue: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#4A6741',
    display: 'block',
  },
  analyticsLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#2D2D2D',
    display: 'block',
    marginBottom: '2px',
  },
  analyticsSubtext: {
    fontSize: '11px',
    color: '#9B9B9B',
  },
  complianceBreakdown: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  complianceItem: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px',
  },
  complianceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  complianceLabel: {
    fontSize: '14px',
    color: '#2D2D2D',
  },
  complianceValue: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#4A6741',
  },
  complianceBar: {
    height: '8px',
    background: '#F0EFED',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  complianceBarFill: {
    height: '100%',
    borderRadius: '4px',
  },

  // Settings
  settingsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  settingItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px 16px',
    cursor: 'pointer',
  },
  settingIcon: {
    fontSize: '20px',
  },
  settingLabel: {
    flex: 1,
    fontSize: '14px',
    color: '#2D2D2D',
  },
  settingArrow: {
    color: '#CCCCCC',
    fontSize: '18px',
  },

  // Profile Enhancements
  levelBadgeProfile: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'linear-gradient(135deg, #F5E6D3 0%, #E8D5C4 100%)',
    borderRadius: '20px',
    padding: '8px 16px',
    marginTop: '12px',
  },
  levelBadgeIcon: {
    fontSize: '16px',
  },
  levelBadgeText: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#8B6914',
  },
  levelBadgePoints: {
    fontSize: '12px',
    color: '#A08050',
  },
  weightLogInput: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px',
    marginBottom: '16px',
  },
  weightInput: {
    width: '100%',
    padding: '12px',
    border: '1px solid #E0E0E0',
    borderRadius: '8px',
    fontSize: '16px',
    fontFamily: 'inherit',
    outline: 'none',
  },
  weightInputHint: {
    fontSize: '12px',
    color: '#9B9B9B',
    marginTop: '8px',
    textAlign: 'center',
  },
  weightChart: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '120px',
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px',
  },
  weightChartPoint: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  weightChartBar: {
    width: '20px',
    background: 'linear-gradient(180deg, #4A6741 0%, #5B7B50 100%)',
    borderRadius: '4px',
  },
  weightChartValue: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  weightChartDate: {
    fontSize: '10px',
    color: '#9B9B9B',
  },
  badgesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
  },
  badgeCard: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '12px 8px',
    textAlign: 'center',
    position: 'relative',
  },
  badgeIcon: {
    fontSize: '28px',
    display: 'block',
    marginBottom: '6px',
  },
  badgeName: {
    fontSize: '10px',
    color: '#6B6B6B',
  },
  badgeCheck: {
    position: 'absolute',
    top: '6px',
    right: '6px',
    fontSize: '10px',
    color: '#4A6741',
  },
  providerCard: {
    display: 'flex',
    gap: '14px',
    background: '#E8EDE6',
    borderRadius: '14px',
    padding: '16px',
  },
  providerCardIcon: {
    fontSize: '32px',
  },
  providerCardInfo: {
    flex: 1,
  },
  providerCardTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#4A6741',
    marginBottom: '4px',
  },
  providerCardText: {
    fontSize: '13px',
    color: '#6B6B6B',
    marginBottom: '4px',
  },
  providerCardAppt: {
    fontSize: '12px',
    color: '#4A6741',
  },
  
  // Assessment Prompt (updated)
  assessmentPrompt: {
    textAlign: 'center',
    padding: '20px 10px',
  },
  aiAssessmentBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'linear-gradient(135deg, #4A6741 0%, #5B7B50 100%)',
    borderRadius: '20px',
    padding: '6px 14px',
    marginBottom: '20px',
  },
  aiBadgeIcon: {
    fontSize: '14px',
  },
  aiBadgeText: {
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: '500',
  },
  assessmentIllustration: {
    marginBottom: '20px',
  },
  assessmentTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '24px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '12px',
  },
  assessmentDesc: {
    fontSize: '14px',
    color: '#6B6B6B',
    lineHeight: '1.6',
    marginBottom: '24px',
    maxWidth: '300px',
    margin: '0 auto 24px',
  },
  assessmentFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px',
  },
  assessmentFeature: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px 16px',
  },
  featureIcon: {
    fontSize: '20px',
  },
  featureText: {
    fontSize: '14px',
    color: '#2D2D2D',
  },
  assessmentNote: {
    fontSize: '12px',
    color: '#9B9B9B',
    marginTop: '12px',
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #4A6741 0%, #5B7B50 100%)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '14px',
    padding: '16px 32px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    width: '100%',
  },
  primaryButtonWhite: {
    background: '#FFFFFF',
    color: '#4A6741',
    border: 'none',
    borderRadius: '14px',
    padding: '16px 32px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    width: '100%',
  },
  secondaryButton: {
    background: 'transparent',
    color: '#6B6B6B',
    border: '1px solid #E0E0E0',
    borderRadius: '14px',
    padding: '14px 32px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    width: '100%',
    marginTop: '12px',
  },

  // Manual Assessment Styles
  manualAssessmentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px',
  },
  fitnessLevelCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    background: '#FFFFFF',
    border: 'none',
    borderRadius: '16px',
    padding: '20px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  fitnessLevelIcon: {
    fontSize: '32px',
  },
  fitnessLevelContent: {
    flex: 1,
  },
  fitnessLevelTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '4px',
  },
  fitnessLevelDesc: {
    fontSize: '13px',
    color: '#6B6B6B',
    lineHeight: '1.4',
  },
  fitnessLevelArrow: {
    fontSize: '18px',
    color: '#4A6741',
  },

  // Assessment Header
  assessmentHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
  },
  backButton: {
    background: 'none',
    border: 'none',
    fontSize: '15px',
    color: '#4A6741',
    cursor: 'pointer',
    padding: 0,
  },
  assessmentStageTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '18px',
    fontWeight: '500',
    color: '#2D2D2D',
  },

  // Intro Screen
  introContent: {
    padding: '0 10px',
  },
  cameraPreviewBox: {
    background: '#2D2D2D',
    borderRadius: '20px',
    height: '180px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  cameraIcon: {
    fontSize: '40px',
    marginBottom: '8px',
  },
  cameraText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '14px',
  },
  introTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '18px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '16px',
    textAlign: 'left',
  },
  exercisePreviewList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '24px',
  },
  exercisePreviewItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px 16px',
  },
  exercisePreviewIcon: {
    fontSize: '24px',
  },
  exercisePreviewName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  exercisePreviewDuration: {
    fontSize: '12px',
    color: '#9B9B9B',
  },
  privacyNote: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: '#F5F4F2',
    borderRadius: '12px',
    padding: '14px 16px',
    marginBottom: '24px',
  },
  privacyIcon: {
    fontSize: '16px',
  },
  privacyText: {
    fontSize: '12px',
    color: '#6B6B6B',
    lineHeight: '1.4',
  },

  // Camera Full Screen
  cameraFullScreen: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: '#000',
    zIndex: 100,
    overflow: 'hidden',
  },
  cameraVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: 'scaleX(-1)', // Mirror for selfie view
  },
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '60px 24px 40px',
  },
  exerciseProgress: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
  },
  exerciseProgressDot: {
    width: '10px',
    height: '10px',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  },
  exerciseInfoCard: {
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '20px',
    textAlign: 'center',
  },
  exerciseNumber: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px',
    display: 'block',
  },
  exerciseNameLarge: {
    fontFamily: "'Fraunces', serif",
    fontSize: '22px',
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: '8px',
  },
  exerciseInstruction: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: '1.4',
  },
  centerContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startExerciseButton: {
    width: '100px',
    height: '100px',
    borderRadius: '50px',
    background: 'linear-gradient(135deg, #4A6741 0%, #5B7B50 100%)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 30px rgba(74, 103, 65, 0.4)',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: '18px',
    fontWeight: '600',
  },
  positionText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '14px',
    marginTop: '20px',
  },
  countdownCircle: {
    width: '120px',
    height: '120px',
    borderRadius: '60px',
    background: 'rgba(255,255,255,0.2)',
    border: '4px solid #FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownNumber: {
    fontSize: '48px',
    fontWeight: '600',
    color: '#FFFFFF',
  },
  getReadyText: {
    color: '#FFFFFF',
    fontSize: '18px',
    fontWeight: '500',
    marginTop: '20px',
  },
  recordingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(0,0,0,0.6)',
    borderRadius: '30px',
    padding: '12px 24px',
  },
  recordingDot: {
    width: '12px',
    height: '12px',
    borderRadius: '6px',
    background: '#FF4444',
    animation: 'pulse 1s ease-in-out infinite',
  },
  recordingText: {
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: '500',
  },
  performingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  performingInstructions: {
    color: '#FFFFFF',
    fontSize: '18px',
    fontWeight: '500',
    textAlign: 'center',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
    marginTop: '12px',
  },
  completeExerciseButton: {
    backgroundColor: '#4A6741',
    color: '#FFFFFF',
    border: 'none',
    padding: '18px 48px',
    borderRadius: '30px',
    fontSize: '20px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(74, 103, 65, 0.4)',
    marginTop: '20px',
  },
  performingHint: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '14px',
    textAlign: 'center',
    marginTop: '8px',
  },
  scanningOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '200px',
    height: '200px',
    border: '2px solid rgba(74, 103, 65, 0.5)',
    borderRadius: '20px',
    overflow: 'hidden',
  },
  scanningLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, transparent, #4A6741, transparent)',
  },
  analyzingSpinner: {
    width: '80px',
    height: '80px',
    borderRadius: '40px',
    background: 'rgba(74, 103, 65, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzingIcon: {
    fontSize: '36px',
  },
  analyzingText: {
    color: '#FFFFFF',
    fontSize: '16px',
    marginTop: '16px',
  },
  cancelAssessmentButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    background: 'rgba(0,0,0,0.5)',
    border: 'none',
    color: '#FFFFFF',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Error Container
  errorContainer: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  errorIcon: {
    fontSize: '60px',
    marginBottom: '20px',
  },
  errorTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '22px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '12px',
  },
  errorText: {
    fontSize: '14px',
    color: '#6B6B6B',
    lineHeight: '1.6',
    marginBottom: '24px',
  },

  // Camera Setup
  cameraSetupContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '40px',
  },
  loadingSpinner: {
    width: '80px',
    height: '80px',
    borderRadius: '40px',
    background: '#E8EDE6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  spinnerIcon: {
    fontSize: '36px',
  },
  setupText: {
    fontSize: '16px',
    color: '#6B6B6B',
  },

  // Analyzing Screen
  analyzingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center',
  },
  analyzingAnimation: {
    width: '100px',
    height: '100px',
    borderRadius: '50px',
    background: 'linear-gradient(135deg, #E8EDE6 0%, #D8E0D5 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  analyzingMainIcon: {
    fontSize: '48px',
  },
  analyzingTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '24px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '12px',
  },
  analyzingSubtext: {
    fontSize: '14px',
    color: '#6B6B6B',
    lineHeight: '1.6',
    marginBottom: '32px',
    maxWidth: '280px',
  },
  analysisSteps: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
  },
  analysisStep: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px 16px',
  },
  stepCheck: {
    color: '#4A6741',
    fontSize: '16px',
    fontWeight: '600',
  },
  stepSpinner: {
    color: '#9B9B9B',
    fontSize: '16px',
  },
  stepText: {
    fontSize: '14px',
    color: '#2D2D2D',
  },

  // Results Screen
  resultsHeader: {
    textAlign: 'center',
    marginBottom: '28px',
  },

  // Equipment Selection Styles
  equipmentIntro: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  equipmentIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  equipmentTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '22px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '8px',
  },
  equipmentSubtitle: {
    fontSize: '14px',
    color: '#6B6B6B',
    lineHeight: '1.5',
  },
  equipmentGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '24px',
    maxHeight: '400px',
    overflowY: 'auto',
    paddingRight: '4px',
  },
  equipmentCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '14px 16px',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'all 0.2s ease',
  },
  equipmentCardSelected: {
    borderColor: '#4A6741',
    background: '#F5F8F4',
  },
  equipmentCardIcon: {
    fontSize: '24px',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#F5F4F2',
    borderRadius: '10px',
  },
  equipmentCardContent: {
    flex: 1,
  },
  equipmentCardName: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '2px',
  },
  equipmentCardDesc: {
    fontSize: '12px',
    color: '#9B9B9B',
  },
  equipmentCheckbox: {
    width: '24px',
    height: '24px',
    borderRadius: '12px',
    border: '2px solid #E0E0E0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    color: '#FFFFFF',
    transition: 'all 0.2s ease',
  },
  equipmentCheckboxSelected: {
    background: '#4A6741',
    borderColor: '#4A6741',
  },
  equipmentFooter: {
    position: 'sticky',
    bottom: 0,
    background: 'linear-gradient(transparent, #FAF9F7 20%)',
    paddingTop: '20px',
  },
  equipmentNote: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#6B6B6B',
    marginBottom: '12px',
  },
  resultsBadge: {
    display: 'inline-block',
    background: '#E8EDE6',
    borderRadius: '20px',
    padding: '6px 16px',
    marginBottom: '20px',
  },
  resultsBadgeText: {
    fontSize: '12px',
    color: '#4A6741',
    fontWeight: '500',
  },
  scoreCircle: {
    width: '100px',
    height: '100px',
    borderRadius: '50px',
    background: 'linear-gradient(135deg, #4A6741 0%, #5B7B50 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  scoreNumber: {
    fontSize: '36px',
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scoreLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.8)',
  },
  levelBadge: {
    fontFamily: "'Fraunces', serif",
    fontSize: '22px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '8px',
  },
  summaryText: {
    fontSize: '14px',
    color: '#6B6B6B',
    lineHeight: '1.6',
  },
  resultsSection: {
    marginBottom: '24px',
  },
  resultsSectionTitle: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '12px',
  },
  tagList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  strengthTag: {
    background: '#E8EDE6',
    color: '#4A6741',
    fontSize: '13px',
    padding: '8px 14px',
    borderRadius: '20px',
  },
  focusTag: {
    background: '#FFF5F0',
    color: '#C4956A',
    fontSize: '13px',
    padding: '8px 14px',
    borderRadius: '20px',
  },
  equipmentTag: {
    background: '#E8F4F8',
    color: '#4A8BA8',
    fontSize: '13px',
    padding: '8px 14px',
    borderRadius: '20px',
  },
  planOverview: {
    fontSize: '14px',
    color: '#6B6B6B',
    marginBottom: '12px',
  },
  workoutPreviewList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  workoutPreviewCard: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  workoutDay: {
    fontSize: '12px',
    color: '#9B9B9B',
    width: '60px',
  },
  workoutName2: {
    flex: 1,
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  workoutDuration: {
    fontSize: '12px',
    color: '#4A6741',
    background: '#E8EDE6',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  safetySection: {
    background: '#FFF5F0',
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '24px',
  },
  safetyTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#C4956A',
    marginBottom: '8px',
  },
  safetyItem: {
    fontSize: '13px',
    color: '#6B6B6B',
    lineHeight: '1.6',
  },
  equipmentSuggestionSection: {
    background: '#E8F4F8',
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '24px',
  },
  equipmentSuggestionTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#4A8BA8',
    marginBottom: '8px',
  },
  equipmentSuggestionItem: {
    fontSize: '13px',
    color: '#6B6B6B',
    lineHeight: '1.6',
  },

  // Fitness Home Screen additions
  levelCard: {
    background: 'linear-gradient(135deg, #E8EDE6 0%, #D8E0D5 100%)',
    borderRadius: '14px',
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  levelLabel: {
    fontSize: '13px',
    color: '#6B6B6B',
  },
  levelValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#4A6741',
  },
  equipmentBadge: {
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '14px 16px',
    marginBottom: '20px',
  },
  equipmentBadgeLabel: {
    fontSize: '12px',
    color: '#6B6B6B',
    marginBottom: '8px',
    display: 'block',
  },
  equipmentBadgeList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  equipmentBadgeItem: {
    background: '#E8F4F8',
    color: '#4A8BA8',
    fontSize: '12px',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  exerciseList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  exerciseCard: {
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    cursor: 'pointer',
  },
  exerciseIndex: {
    width: '28px',
    height: '28px',
    borderRadius: '14px',
    background: '#E8EDE6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '600',
    color: '#4A6741',
    flexShrink: 0,
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '4px',
  },
  exerciseMeta: {
    fontSize: '13px',
    color: '#6B6B6B',
    marginBottom: '4px',
  },
  exerciseNotes: {
    fontSize: '12px',
    color: '#9B9B9B',
    fontStyle: 'italic',
  },
  exerciseEquipment: {
    fontSize: '12px',
    color: '#4A8BA8',
    marginBottom: '2px',
  },
  
  // Today's Workout
  todayWorkout: {
    background: 'linear-gradient(135deg, #4A6741 0%, #5B7B50 100%)',
    borderRadius: '20px',
    padding: '24px',
    marginBottom: '24px',
    color: '#FFFFFF',
  },
  todayLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    display: 'block',
    marginBottom: '8px',
  },
  todayTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '24px',
    fontWeight: '500',
    marginBottom: '8px',
  },
  todayDesc: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: '16px',
    lineHeight: '1.5',
  },
  todayMeta: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  todayTag: {
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '20px',
    padding: '6px 12px',
    fontSize: '12px',
    textTransform: 'capitalize',
  },
  
  // Activity
  activityCard: {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '20px',
  },
  activityTitle: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '20px',
  },
  activityBars: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100px',
  },
  activityDay: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  activityBarContainer: {
    width: '24px',
    height: '80px',
    background: '#F0EFED',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'flex-end',
    overflow: 'hidden',
  },
  activityBar: {
    width: '100%',
    background: 'linear-gradient(180deg, #5B7B50 0%, #4A6741 100%)',
    borderRadius: '4px',
    transition: 'height 0.5s ease',
  },
  activityDayLabel: {
    fontSize: '11px',
    color: '#9B9B9B',
  },
  
  // Treatments/Services
  treatmentsIntro: {
    marginBottom: '24px',
  },
  introText: {
    fontSize: '14px',
    color: '#6B6B6B',
    lineHeight: '1.6',
  },
  categoryTabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    overflowX: 'auto',
    paddingBottom: '8px',
  },
  categoryTab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '10px 14px',
    background: '#F5F4F2',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    minWidth: '60px',
    transition: 'all 0.2s',
  },
  categoryTabActive: {
    background: '#4A6741',
    color: '#FFFFFF',
  },
  categoryIcon: {
    fontSize: '18px',
  },
  categoryName: {
    fontSize: '10px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
  categoryHeader: {
    marginBottom: '20px',
  },
  categoryTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '20px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '6px',
  },
  categoryDescription: {
    fontSize: '13px',
    color: '#6B6B6B',
    lineHeight: '1.5',
  },
  servicesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    marginBottom: '24px',
  },
  serviceCard: {
    background: '#FFFFFF',
    borderRadius: '18px',
    padding: '20px',
    position: 'relative',
    cursor: 'pointer',
  },
  serviceCardFeatured: {
    background: 'linear-gradient(135deg, #F5F8F4 0%, #E8EDE6 100%)',
    border: '2px solid #4A6741',
  },
  tierBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    color: '#FFFFFF',
    fontSize: '10px',
    fontWeight: '500',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  serviceName: {
    fontFamily: "'Fraunces', serif",
    fontSize: '18px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '4px',
    marginTop: '4px',
  },
  serviceTagline: {
    fontSize: '12px',
    color: '#4A6741',
    marginBottom: '10px',
    fontWeight: '500',
  },
  serviceDescription: {
    fontSize: '13px',
    color: '#6B6B6B',
    lineHeight: '1.5',
    marginBottom: '14px',
  },
  serviceBenefits: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '14px',
  },
  serviceBenefit: {
    fontSize: '11px',
    color: '#4A6741',
    background: '#E8EDE6',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  servicePricing: {
    background: '#F5F4F2',
    borderRadius: '10px',
    padding: '12px',
    marginBottom: '14px',
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  priceLabel: {
    fontSize: '12px',
    color: '#6B6B6B',
  },
  priceValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2D2D2D',
  },
  morePricing: {
    fontSize: '11px',
    color: '#4A6741',
    display: 'block',
    textAlign: 'center',
    marginTop: '6px',
  },
  serviceBtn: {
    background: 'none',
    border: 'none',
    color: '#4A6741',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    padding: 0,
  },
  contactCTA: {
    textAlign: 'center',
    background: 'linear-gradient(135deg, #4A6741 0%, #5B7B50 100%)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '20px',
  },
  contactText: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: '10px',
  },
  contactPhone: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#FFFFFF',
    textDecoration: 'none',
    display: 'block',
    marginBottom: '8px',
  },
  contactLocation: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.8)',
  },
  treatmentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  treatmentCard: {
    background: '#FFFFFF',
    borderRadius: '20px',
    padding: '24px',
    position: 'relative',
    cursor: 'pointer',
  },
  popularBadge: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: '#FFF5F0',
    color: '#C4956A',
    fontSize: '11px',
    fontWeight: '500',
    padding: '4px 10px',
    borderRadius: '20px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  treatmentName: {
    fontFamily: "'Fraunces', serif",
    fontSize: '20px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '4px',
  },
  treatmentTagline: {
    fontSize: '13px',
    color: '#4A6741',
    marginBottom: '12px',
  },
  treatmentDescription: {
    fontSize: '14px',
    color: '#6B6B6B',
    lineHeight: '1.5',
    marginBottom: '16px',
  },
  benefitTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px',
  },
  benefitTag: {
    background: '#F5F4F2',
    color: '#6B6B6B',
    fontSize: '12px',
    padding: '6px 12px',
    borderRadius: '20px',
  },
  learnMoreBtn: {
    background: 'none',
    border: 'none',
    color: '#4A6741',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    padding: 0,
  },
  
  // Profile
  profileHeader: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  avatar: {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #4A6741 0%, #5B7B50 100%)',
    borderRadius: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  avatarText: {
    fontSize: '32px',
    fontWeight: '500',
    color: '#FFFFFF',
  },
  profileName: {
    fontFamily: "'Fraunces', serif",
    fontSize: '24px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '4px',
  },
  profileJourney: {
    fontSize: '14px',
    color: '#8B8B8B',
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '24px',
    gap: '20px',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#4A6741',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '12px',
    color: '#9B9B9B',
  },
  statDivider: {
    width: '1px',
    height: '40px',
    background: '#E8E8E8',
  },
  menuList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '24px',
  },
  menuItem: {
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    cursor: 'pointer',
  },
  menuIcon: {
    fontSize: '20px',
  },
  menuLabel: {
    flex: 1,
    fontSize: '15px',
    color: '#2D2D2D',
  },
  menuArrow: {
    color: '#CCCCCC',
    fontSize: '20px',
  },
  signOutButton: {
    background: 'none',
    border: '1px solid #E8E8E8',
    borderRadius: '14px',
    padding: '16px',
    width: '100%',
    fontSize: '15px',
    color: '#9B9B9B',
    cursor: 'pointer',
  },
  
  // Profile Subscreens
  subscreenHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
  },
  subscreenTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '20px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  
  // Personal Information
  personalInfoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  personalInfoAvatar: {
    position: 'relative',
    width: '100px',
    height: '100px',
    margin: '0 auto 10px',
  },
  personalInfoAvatarText: {
    width: '100px',
    height: '100px',
    borderRadius: '50px',
    background: 'linear-gradient(135deg, #4A6741 0%, #5B7B50 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontSize: '40px',
    fontWeight: '500',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    width: '32px',
    height: '32px',
    borderRadius: '16px',
    background: '#FFFFFF',
    border: '2px solid #E0E0E0',
    cursor: 'pointer',
    fontSize: '14px',
  },
  infoFieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  infoField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  infoFieldLabel: {
    fontSize: '13px',
    color: '#6B6B6B',
    fontWeight: '500',
  },
  infoFieldInput: {
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid #E0E0E0',
    fontSize: '15px',
    fontFamily: 'inherit',
    outline: 'none',
    background: '#FFFFFF',
  },
  infoSection: {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '16px',
  },
  infoSectionTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '12px',
  },
  
  // Progress & Metrics
  progressStatsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '24px',
  },
  progressStatCard: {
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px',
    textAlign: 'center',
  },
  progressStatValue: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#4A6741',
    display: 'block',
  },
  progressStatLabel: {
    fontSize: '12px',
    color: '#9B9B9B',
  },
  progressSection: {
    marginBottom: '24px',
  },
  progressSectionTitle: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '14px',
  },
  weightChartLarge: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '150px',
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px',
  },
  weightChartPointLarge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  weightChartBarLarge: {
    width: '20px',
    background: 'linear-gradient(180deg, #4A6741 0%, #5B7B50 100%)',
    borderRadius: '4px',
  },
  weightChartValueLarge: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#2D2D2D',
  },
  weightChartDateLarge: {
    fontSize: '10px',
    color: '#9B9B9B',
  },
  weeklyComplianceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#FFFFFF',
    borderRadius: '10px',
    padding: '12px 14px',
    marginBottom: '8px',
  },
  weeklyComplianceLabel: {
    fontSize: '13px',
    color: '#6B6B6B',
    width: '60px',
  },
  weeklyComplianceBar: {
    flex: 1,
    height: '8px',
    background: '#F0EFED',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  weeklyComplianceBarFill: {
    height: '100%',
    borderRadius: '4px',
  },
  weeklyComplianceValue: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#4A6741',
    width: '40px',
    textAlign: 'right',
  },
  badgesGridLarge: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
  },
  badgeCardLarge: {
    borderRadius: '12px',
    padding: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    position: 'relative',
  },
  badgeIconLarge: {
    fontSize: '28px',
  },
  badgeNameLarge: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  badgeCheckLarge: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    fontSize: '12px',
    color: '#4A6741',
  },
  
  // Goals & Preferences
  goalsSection: {
    marginBottom: '24px',
  },
  goalsSectionTitle: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '14px',
  },
  goalSettingRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px 16px',
    marginBottom: '10px',
  },
  goalSettingInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  goalSettingIcon: {
    fontSize: '20px',
  },
  goalSettingLabel: {
    fontSize: '15px',
    color: '#2D2D2D',
  },
  goalSettingControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  goalAdjustBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '16px',
    border: '1px solid #E0E0E0',
    background: '#FFFFFF',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#4A6741',
  },
  goalSettingValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#4A6741',
    minWidth: '60px',
    textAlign: 'center',
  },
  injectionScheduleCard: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '16px',
  },
  injectionScheduleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  injectionScheduleLabel: {
    fontSize: '14px',
    color: '#2D2D2D',
  },
  injectionScheduleSelect: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #E0E0E0',
    fontSize: '14px',
    fontFamily: 'inherit',
    background: '#FFFFFF',
    color: '#4A6741',
    fontWeight: '500',
  },
  preferenceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px 16px',
    marginBottom: '10px',
  },
  preferenceLabel: {
    fontSize: '15px',
    color: '#2D2D2D',
  },
  toggleSwitch: {
    width: '50px',
    height: '30px',
    borderRadius: '15px',
    padding: '3px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  toggleKnob: {
    width: '24px',
    height: '24px',
    borderRadius: '12px',
    background: '#FFFFFF',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
  },
  
  // My Treatments
  treatmentSection: {
    marginBottom: '24px',
  },
  treatmentSectionTitle: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '14px',
  },
  currentMedCard: {
    display: 'flex',
    gap: '16px',
    background: 'linear-gradient(135deg, #E8EDE6 0%, #D8E0D5 100%)',
    borderRadius: '16px',
    padding: '20px',
  },
  currentMedIcon: {
    fontSize: '36px',
  },
  currentMedInfo: {
    flex: 1,
  },
  currentMedName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '4px',
  },
  currentMedDose: {
    fontSize: '14px',
    color: '#4A6741',
    fontWeight: '500',
    marginBottom: '2px',
  },
  currentMedSchedule: {
    fontSize: '13px',
    color: '#6B6B6B',
  },
  doseHistoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  doseHistoryItem: {
    display: 'flex',
    gap: '14px',
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px',
  },
  doseHistoryDate: {
    fontSize: '12px',
    color: '#9B9B9B',
    width: '80px',
  },
  doseHistoryInfo: {
    flex: 1,
  },
  doseHistoryDose: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#4A6741',
    display: 'block',
  },
  doseHistoryNote: {
    fontSize: '13px',
    color: '#6B6B6B',
  },
  addonTreatmentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  addonTreatmentCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px',
  },
  addonTreatmentIcon: {
    fontSize: '24px',
  },
  addonTreatmentInfo: {
    flex: 1,
  },
  addonTreatmentName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '2px',
  },
  addonTreatmentDesc: {
    fontSize: '12px',
    color: '#9B9B9B',
  },
  addonTreatmentPrice: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4A6741',
  },
  appointmentCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '16px',
  },
  appointmentIcon: {
    fontSize: '24px',
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentDate: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '2px',
  },
  appointmentType: {
    fontSize: '13px',
    color: '#6B6B6B',
  },
  appointmentBtn: {
    background: '#E8EDE6',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 14px',
    fontSize: '13px',
    color: '#4A6741',
    fontWeight: '500',
    cursor: 'pointer',
  },
  
  // Notifications
  notificationsSection: {
    marginBottom: '24px',
  },
  notificationsSectionTitle: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '14px',
  },
  notificationRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px 16px',
    marginBottom: '10px',
  },
  notificationInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  notificationIcon: {
    fontSize: '20px',
  },
  notificationLabel: {
    fontSize: '15px',
    color: '#2D2D2D',
    fontWeight: '500',
  },
  notificationDesc: {
    fontSize: '12px',
    color: '#9B9B9B',
  },
  
  // Help & Support
  helpSection: {
    marginBottom: '24px',
  },
  helpSectionTitle: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '14px',
  },
  helpContactCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '10px',
    textDecoration: 'none',
  },
  helpContactIcon: {
    fontSize: '24px',
  },
  helpContactInfo: {
    flex: 1,
  },
  helpContactLabel: {
    fontSize: '13px',
    color: '#9B9B9B',
    marginBottom: '2px',
  },
  helpContactValue: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#4A6741',
  },
  locationCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '10px',
  },
  locationIcon: {
    fontSize: '24px',
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '2px',
  },
  locationAddress: {
    fontSize: '13px',
    color: '#6B6B6B',
  },
  faqList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  faqItem: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px 16px',
  },
  faqQuestion: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
    cursor: 'pointer',
  },
  faqAnswer: {
    fontSize: '13px',
    color: '#6B6B6B',
    marginTop: '10px',
    lineHeight: '1.5',
  },
  appInfoCard: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '16px',
  },
  appInfoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#2D2D2D',
    padding: '10px 0',
    borderBottom: '1px solid #F0EFED',
  },
  appInfoLink: {
    color: '#4A6741',
    fontWeight: '500',
  },
  
  // Modal
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    background: '#FAF9F7',
    borderRadius: '24px 24px 0 0',
    padding: '32px 24px',
    maxWidth: '390px',
    width: '100%',
    maxHeight: '80vh',
    overflowY: 'auto',
    position: 'relative',
  },
  modalClose: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: '#F0EFED',
    border: 'none',
    width: '32px',
    height: '32px',
    borderRadius: '16px',
    fontSize: '20px',
    color: '#6B6B6B',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubtitle: {
    fontSize: '12px',
    color: '#4A6741',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px',
    display: 'block',
  },
  modalTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '26px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '16px',
  },
  modalDescription: {
    fontSize: '15px',
    color: '#6B6B6B',
    lineHeight: '1.6',
    marginBottom: '24px',
  },
  modalBenefits: {
    marginBottom: '24px',
  },
  benefitsTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '16px',
  },
  benefitItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '12px',
  },
  benefitCheck: {
    width: '20px',
    height: '20px',
    background: '#E8EDE6',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#4A6741',
    fontSize: '12px',
    flexShrink: 0,
  },
  benefitText: {
    fontSize: '14px',
    color: '#4B4B4B',
    lineHeight: '1.4',
  },
  modalFooter: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  modalPrice: {
    fontSize: '14px',
    color: '#8B8B8B',
    textAlign: 'center',
  },
  modalPhoneLink: {
    display: 'block',
    textAlign: 'center',
    color: '#4A6741',
    fontSize: '14px',
    marginTop: '12px',
    textDecoration: 'none',
  },
  
  // Bottom Nav
  bottomNav: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    background: '#FFFFFF',
    borderTop: '1px solid #F0EFED',
    padding: '12px 0 28px',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    background: 'none',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    padding: '8px',
  },
  navLabel: {
    fontSize: '10px',
    fontWeight: '500',
  },
  
  // ==================== EDUCATION STYLES ====================
  educationPreviewCard: {
    background: 'linear-gradient(135deg, #F5F8F4 0%, #E8EDE6 100%)',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    cursor: 'pointer',
    border: '2px solid #4A6741',
  },
  educationPreviewIcon: {
    fontSize: '32px',
  },
  educationPreviewContent: {
    flex: 1,
  },
  educationPreviewBadge: {
    fontSize: '11px',
    color: '#4A6741',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'block',
    marginBottom: '4px',
  },
  educationPreviewTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '17px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '4px',
  },
  educationPreviewText: {
    fontSize: '13px',
    color: '#6B6B6B',
  },
  didYouKnowCard: {
    background: '#FFF9E6',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
  },
  didYouKnowIcon: {
    fontSize: '24px',
  },
  didYouKnowText: {
    fontSize: '14px',
    color: '#5A4D2E',
    lineHeight: '1.6',
  },
  educationHeader: {
    marginBottom: '20px',
  },
  educationIntro: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  educationBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'linear-gradient(135deg, #4A6741 0%, #5B7B50 100%)',
    borderRadius: '20px',
    padding: '6px 14px',
    marginBottom: '16px',
  },
  educationBadgeIcon: {
    fontSize: '14px',
  },
  educationBadgeText: {
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: '500',
  },
  educationTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '28px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '8px',
  },
  educationSubtitle: {
    fontSize: '14px',
    color: '#6B6B6B',
    lineHeight: '1.5',
    maxWidth: '300px',
    margin: '0 auto',
  },
  progressOverview: {
    marginTop: '20px',
  },
  progressText: {
    fontSize: '13px',
    color: '#4A6741',
    fontWeight: '500',
    marginBottom: '8px',
    display: 'block',
  },
  progressBarSmall: {
    height: '6px',
    background: '#E8EDE6',
    borderRadius: '3px',
    overflow: 'hidden',
    maxWidth: '200px',
    margin: '0 auto',
  },
  progressFillSmall: {
    height: '100%',
    background: '#4A6741',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  categoriesGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '28px',
  },
  categoryCard: {
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px',
    borderLeft: '4px solid',
    cursor: 'pointer',
  },
  categoryCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  categoryCardIcon: {
    fontSize: '24px',
  },
  categoryCardProgress: {
    fontSize: '12px',
    color: '#9B9B9B',
    fontWeight: '500',
  },
  categoryCardTitle: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '4px',
  },
  categoryCardDesc: {
    fontSize: '13px',
    color: '#6B6B6B',
    marginBottom: '12px',
  },
  categoryCardBar: {
    height: '4px',
    background: '#F0EFED',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  categoryCardBarFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.3s ease',
  },
  quickTipsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  quickTipCard: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  quickTipIcon: {
    fontSize: '20px',
  },
  quickTipTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '2px',
  },
  quickTipText: {
    fontSize: '12px',
    color: '#6B6B6B',
  },
  categoryHeaderLarge: {
    borderRadius: '20px',
    padding: '24px',
    textAlign: 'center',
    marginBottom: '24px',
  },
  categoryIconLarge: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '12px',
  },
  categoryTitleLarge: {
    fontFamily: "'Fraunces', serif",
    fontSize: '24px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '8px',
  },
  categoryDescLarge: {
    fontSize: '14px',
    color: '#6B6B6B',
    marginBottom: '8px',
  },
  categoryCount: {
    fontSize: '13px',
    color: '#4A6741',
    fontWeight: '500',
  },
  mistakesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  mistakeCard: {
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    cursor: 'pointer',
  },
  mistakeCardLeft: {
    flexShrink: 0,
  },
  mistakeNumber: {
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: '600',
    padding: '6px 10px',
    borderRadius: '8px',
  },
  mistakeCardContent: {
    flex: 1,
  },
  mistakeCardTitle: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '4px',
  },
  mistakeCardSummary: {
    fontSize: '13px',
    color: '#6B6B6B',
  },
  mistakeCompletedBadge: {
    color: '#4A6741',
    fontWeight: '600',
    fontSize: '16px',
  },
  mistakeArrow: {
    color: '#CCCCCC',
    fontSize: '18px',
  },
  mistakeCategoryBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
    marginBottom: '16px',
  },
  mistakeDetailTitle: {
    fontSize: '14px',
    color: '#9B9B9B',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '4px',
  },
  mistakeDetailName: {
    fontFamily: "'Fraunces', serif",
    fontSize: '26px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '20px',
  },
  mistakeContent: {
    marginBottom: '24px',
  },
  mistakeParagraph: {
    fontSize: '15px',
    color: '#4B4B4B',
    lineHeight: '1.7',
    marginBottom: '16px',
  },
  mistakeSubheading: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '12px',
    marginTop: '20px',
  },
  mistakeBulletList: {
    marginBottom: '16px',
    paddingLeft: '8px',
  },
  mistakeBullet: {
    fontSize: '15px',
    color: '#4B4B4B',
    lineHeight: '1.7',
    marginBottom: '4px',
  },
  keyTakeawayBox: {
    background: '#F5F8F4',
    borderRadius: '14px',
    padding: '20px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    marginBottom: '24px',
    border: '1px solid #E8EDE6',
  },
  keyTakeawayIcon: {
    fontSize: '24px',
  },
  keyTakeawayLabel: {
    fontSize: '12px',
    color: '#4A6741',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '6px',
  },
  keyTakeawayText: {
    fontSize: '15px',
    color: '#4A6741',
    lineHeight: '1.5',
    fontWeight: '500',
  },
  markCompleteButton: {
    width: '100%',
    padding: '16px',
    borderRadius: '14px',
    border: 'none',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
  },

  // ==================== KICKSTART GUIDE STYLES ====================
  kickstartHeader: {
    marginBottom: '20px',
  },
  kickstartHero: {
    background: 'linear-gradient(135deg, #2AABB3 0%, #1D8A91 100%)',
    borderRadius: '20px',
    padding: '28px 24px',
    marginBottom: '24px',
    textAlign: 'center',
  },
  kickstartBadge: {
    display: 'inline-block',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '20px',
    padding: '6px 14px',
    fontSize: '12px',
    color: '#FFFFFF',
    marginBottom: '12px',
  },
  kickstartTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '26px',
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: '6px',
  },
  kickstartAuthor: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: '12px',
  },
  kickstartDesc: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.9)',
    lineHeight: '1.5',
  },
  kickstartSections: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  kickstartSectionCard: {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '18px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    cursor: 'pointer',
    borderLeft: '4px solid',
  },
  kickstartSectionIcon: {
    fontSize: '28px',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#F5F4F2',
    borderRadius: '12px',
  },
  kickstartSectionContent: {
    flex: 1,
  },
  kickstartSectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '4px',
  },
  kickstartSectionDesc: {
    fontSize: '13px',
    color: '#6B6B6B',
    lineHeight: '1.4',
  },
  kickstartArrow: {
    fontSize: '18px',
    color: '#9B9B9B',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  sectionHeaderIcon: {
    fontSize: '40px',
    marginBottom: '12px',
    display: 'block',
  },
  sectionHeaderTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '24px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '8px',
  },
  sectionHeaderDesc: {
    fontSize: '14px',
    color: '#6B6B6B',
    lineHeight: '1.5',
  },
  fearsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  fearCard: {
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '18px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    cursor: 'pointer',
  },
  fearIcon: {
    fontSize: '24px',
  },
  fearQuestion: {
    flex: 1,
    fontSize: '15px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  fearArrow: {
    fontSize: '16px',
    color: '#9B9B9B',
  },
  fearDetailCard: {
    background: '#FFFFFF',
    borderRadius: '20px',
    padding: '28px 24px',
  },
  fearDetailIcon: {
    fontSize: '48px',
    display: 'block',
    textAlign: 'center',
    marginBottom: '16px',
  },
  fearDetailQuestion: {
    fontFamily: "'Fraunces', serif",
    fontSize: '22px',
    fontWeight: '500',
    color: '#2D2D2D',
    textAlign: 'center',
    marginBottom: '24px',
  },
  fearDetailAnswer: {
    fontSize: '15px',
    color: '#4B4B4B',
    lineHeight: '1.7',
  },
  fearParagraph: {
    marginBottom: '16px',
    fontSize: '15px',
    color: '#4B4B4B',
    lineHeight: '1.7',
  },
  weeksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '24px',
  },
  weekCard: {
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '18px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    cursor: 'pointer',
  },
  weekIcon: {
    fontSize: '24px',
  },
  weekTitle: {
    flex: 1,
    fontSize: '15px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  weekArrow: {
    fontSize: '16px',
    color: '#9B9B9B',
  },
  weekDetailHeader: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  weekDetailIcon: {
    fontSize: '48px',
    marginBottom: '12px',
    display: 'block',
  },
  weekDetailTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '22px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  weekSection: {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '16px',
  },
  weekSectionTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4A6741',
    marginBottom: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  weekItem: {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px',
  },
  weekItemBullet: {
    color: '#4A6741',
    fontWeight: '600',
  },
  weekItemText: {
    flex: 1,
    fontSize: '14px',
    color: '#4B4B4B',
    lineHeight: '1.5',
  },
  successBox: {
    background: '#E8EDE6',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '16px',
  },
  successTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#4A6741',
    marginBottom: '14px',
  },
  successSubtitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#6B6B6B',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  successNotItem: {
    fontSize: '14px',
    color: '#9B7E9B',
    marginBottom: '6px',
  },
  successIsItem: {
    fontSize: '14px',
    color: '#4A6741',
    marginBottom: '6px',
  },
  redFlagsBox: {
    background: '#FFF5F0',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '20px',
  },
  redFlagsTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#C4956A',
    marginBottom: '14px',
  },
  redFlagItem: {
    fontSize: '14px',
    color: '#6B6B6B',
    marginBottom: '6px',
  },
  preventionEssentials: {
    background: '#E8F4F8',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '20px',
  },
  essentialsTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2AABB3',
    marginBottom: '12px',
  },
  essentialTag: {
    display: 'inline-block',
    background: '#FFFFFF',
    borderRadius: '20px',
    padding: '8px 14px',
    fontSize: '13px',
    color: '#2AABB3',
    marginRight: '8px',
    marginBottom: '8px',
  },
  strategiesGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
  },
  strategyCard: {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '18px',
  },
  strategyHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
  },
  strategyIcon: {
    fontSize: '24px',
  },
  strategySymptom: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2D2D2D',
  },
  strategyTips: {
    paddingLeft: '8px',
  },
  strategyTip: {
    fontSize: '14px',
    color: '#6B6B6B',
    marginBottom: '6px',
  },
  supplyListBox: {
    background: '#F5F4F2',
    borderRadius: '16px',
    padding: '20px',
  },
  supplyListTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '14px',
  },
  supplyItem: {
    fontSize: '14px',
    color: '#4B4B4B',
    marginBottom: '8px',
  },
  checklistProgress: {
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '20px',
  },
  checklistProgressBar: {
    height: '8px',
    background: '#F0EFED',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  checklistProgressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #4A6741 0%, #5B7B50 100%)',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  checklistProgressText: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#4A6741',
    textAlign: 'center',
    display: 'block',
  },
  checklistCategory: {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '12px',
  },
  checklistCategoryHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '14px',
    paddingBottom: '12px',
    borderBottom: '1px solid #F0EFED',
  },
  checklistCategoryIcon: {
    fontSize: '20px',
  },
  checklistCategoryTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#2D2D2D',
  },
  checklistItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '10px 0',
    cursor: 'pointer',
  },
  checkbox: {
    width: '22px',
    height: '22px',
    borderRadius: '6px',
    border: '2px solid #E0E0E0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    color: '#FFFFFF',
    flexShrink: 0,
    transition: 'all 0.2s ease',
  },
  checkboxChecked: {
    background: '#4A6741',
    borderColor: '#4A6741',
  },
  checklistItemText: {
    fontSize: '14px',
    color: '#4B4B4B',
    lineHeight: '1.4',
  },
  checklistItemChecked: {
    textDecoration: 'line-through',
    color: '#9B9B9B',
  },
  essentialsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  essentialCard: {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '20px',
    borderLeft: '4px solid',
  },
  essentialHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  essentialNumber: {
    width: '28px',
    height: '28px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: '600',
  },
  essentialIcon: {
    fontSize: '24px',
  },
  essentialTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2D2D2D',
  },
  essentialSummary: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#4A6741',
    marginBottom: '10px',
  },
  essentialDetails: {
    fontSize: '14px',
    color: '#6B6B6B',
    lineHeight: '1.6',
    marginBottom: '14px',
  },
  essentialTipBox: {
    borderRadius: '12px',
    padding: '14px',
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
  },
  essentialTipIcon: {
    fontSize: '16px',
  },
  essentialTipText: {
    fontSize: '13px',
    color: '#4B4B4B',
    lineHeight: '1.5',
    flex: 1,
  },
  kickstartPreviewCard: {
    background: 'linear-gradient(135deg, #2AABB3 0%, #1D8A91 100%)',
    borderRadius: '16px',
    padding: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginTop: '12px',
  },
  kickstartPreviewIcon: {
    fontSize: '32px',
    width: '50px',
    height: '50px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kickstartPreviewContent: {
    flex: 1,
  },
  kickstartPreviewBadge: {
    fontSize: '10px',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px',
    display: 'block',
  },
  kickstartPreviewTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: '4px',
  },
  kickstartPreviewText: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.9)',
  },

  // ==================== INJECTION TRACKER STYLES ====================
  injectionTrackerCard: {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '10px',
  },
  injectionTrackerHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '14px',
  },
  injectionTrackerIcon: {
    fontSize: '28px',
    width: '50px',
    height: '50px',
    background: '#F5F8F4',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  injectionTrackerInfo: {
    flex: 1,
  },
  injectionTrackerTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '2px',
  },
  injectionTrackerSubtext: {
    fontSize: '13px',
    color: '#9B9B9B',
  },
  injectionQuickStats: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#F5F8F4',
    borderRadius: '12px',
    padding: '12px 16px',
  },
  injectionQuickStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  injectionQuickStatDivider: {
    width: '1px',
    height: '30px',
    background: '#D8E0D5',
  },
  iqsLabel: {
    fontSize: '10px',
    color: '#6B6B6B',
    textTransform: 'uppercase',
    marginBottom: '2px',
  },
  iqsValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4A6741',
  },

  // Injection Tracker Screen
  injectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  injectionTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '20px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  addInjectionBtn: {
    background: '#4A6741',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '20px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  injectionSummaryCards: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '20px',
  },
  injectionSummaryCard: {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '16px',
  },
  summaryCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '10px',
  },
  summaryCardIcon: {
    fontSize: '20px',
  },
  summaryCardLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#6B6B6B',
  },
  summaryCardContent: {},
  summaryCardDose: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '4px',
  },
  summaryCardMeta: {
    fontSize: '12px',
    color: '#9B9B9B',
    marginBottom: '4px',
  },
  summaryCardNext: {
    fontSize: '12px',
    fontWeight: '500',
  },
  injectionTabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
  },
  injectionTab: {
    flex: 1,
    background: '#F5F4F2',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 8px',
    fontSize: '13px',
    color: '#6B6B6B',
    cursor: 'pointer',
    textAlign: 'center',
  },
  injectionTabActive: {
    background: '#4A6741',
    color: '#FFFFFF',
  },
  injectionLogList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  emptyStateIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '12px',
  },
  emptyStateText: {
    fontSize: '16px',
    color: '#6B6B6B',
    marginBottom: '20px',
  },
  injectionLogItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '14px',
  },
  injectionLogIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  injectionLogContent: {
    flex: 1,
  },
  injectionLogHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2px',
  },
  injectionLogType: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2D2D2D',
  },
  injectionLogDate: {
    fontSize: '12px',
    color: '#9B9B9B',
  },
  injectionLogDose: {
    fontSize: '13px',
    color: '#4A6741',
    fontWeight: '500',
  },
  injectionLogNotes: {
    fontSize: '12px',
    color: '#6B6B6B',
    fontStyle: 'italic',
    marginTop: '4px',
  },
  deleteInjectionBtn: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    color: '#CCCCCC',
    cursor: 'pointer',
    padding: '4px 8px',
  },

  // Calendar styles
  injectionCalendar: {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '16px',
  },
  calendarHeader: {
    textAlign: 'center',
    marginBottom: '16px',
  },
  calendarMonth: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2D2D2D',
  },
  calendarDaysHeader: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
    marginBottom: '8px',
  },
  calendarDayLabel: {
    textAlign: 'center',
    fontSize: '11px',
    color: '#9B9B9B',
    fontWeight: '500',
  },
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
  },
  calendarDay: {
    aspectRatio: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    background: '#F5F4F2',
    padding: '4px',
  },
  calendarDayToday: {
    background: '#E8EDE6',
    border: '2px solid #4A6741',
  },
  calendarDayEmpty: {
    background: 'transparent',
  },
  calendarDayNumber: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  calendarDots: {
    display: 'flex',
    gap: '3px',
    marginTop: '2px',
  },
  calendarDot: {
    width: '6px',
    height: '6px',
    borderRadius: '3px',
  },
  calendarLegend: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '16px',
    paddingTop: '12px',
    borderTop: '1px solid #F0EFED',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  legendDot: {
    width: '10px',
    height: '10px',
    borderRadius: '5px',
  },
  legendLabel: {
    fontSize: '12px',
    color: '#6B6B6B',
  },

  // Supply section
  supplySection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  supplyCard: {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '16px',
  },
  supplyCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '14px',
  },
  supplyCardIcon: {
    fontSize: '24px',
  },
  supplyCardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2D2D2D',
  },
  supplyCardContent: {},
  supplyRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: '8px',
    borderBottom: '1px solid #F0EFED',
    marginBottom: '8px',
  },
  supplyLabel: {
    fontSize: '14px',
    color: '#6B6B6B',
  },
  supplyValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2D2D2D',
  },
  refillAlert: {
    background: '#FFF5F0',
    borderRadius: '10px',
    padding: '12px',
    marginTop: '10px',
    fontSize: '13px',
    color: '#C4956A',
    textAlign: 'center',
  },
  contactProviderBox: {
    background: '#F5F8F4',
    borderRadius: '14px',
    padding: '20px',
    textAlign: 'center',
  },
  contactProviderText: {
    fontSize: '14px',
    color: '#6B6B6B',
    marginBottom: '12px',
  },
  contactProviderBtn: {
    display: 'inline-block',
    background: '#4A6741',
    color: '#FFFFFF',
    padding: '12px 24px',
    borderRadius: '25px',
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'none',
  },

  // Add Injection Modal
  addInjectionModal: {
    background: '#FFFFFF',
    borderRadius: '24px 24px 0 0',
    padding: '24px',
    maxWidth: '400px',
    width: '100%',
    maxHeight: '80vh',
    overflowY: 'auto',
    position: 'relative',
  },
  addModalTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '22px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '20px',
    textAlign: 'center',
  },
  addModalSection: {
    marginBottom: '20px',
  },
  addModalLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '10px',
    display: 'block',
  },
  typeSelector: {
    display: 'flex',
    gap: '10px',
  },
  typeSelectorBtn: {
    flex: 1,
    padding: '14px',
    borderRadius: '12px',
    border: '2px solid #E0E0E0',
    background: '#FFFFFF',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    textAlign: 'center',
  },
  typeSelectorBtnActive: {
    borderColor: '#4A6741',
    background: '#F5F8F4',
    color: '#4A6741',
  },
  dateInput: {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid #E0E0E0',
    fontSize: '16px',
    fontFamily: 'inherit',
  },
  doseSelector: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  doseSelectorBtn: {
    padding: '10px 16px',
    borderRadius: '20px',
    border: '1px solid #E0E0E0',
    background: '#FFFFFF',
    fontSize: '14px',
    cursor: 'pointer',
  },
  doseSelectorBtnActive: {
    borderColor: '#4A6741',
    background: '#4A6741',
    color: '#FFFFFF',
  },
  notesInput: {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid #E0E0E0',
    fontSize: '14px',
    fontFamily: 'inherit',
    minHeight: '80px',
    resize: 'vertical',
  },

  // Provider Injection Styles
  providerInjectionSummary: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '20px',
  },
  providerInjectionCard: {
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '14px',
  },
  providerInjectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  providerInjectionIcon: {
    fontSize: '18px',
  },
  providerInjectionLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#6B6B6B',
  },
  providerInjectionDose: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '4px',
  },
  providerInjectionMeta: {
    fontSize: '12px',
    color: '#9B9B9B',
    marginBottom: '4px',
  },
  providerSupplyStatus: {
    fontSize: '12px',
    fontWeight: '500',
  },
  providerInjectionHistory: {
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '16px',
  },
  providerInjectionHistoryTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '14px',
  },
  providerInjectionItem: {
    display: 'flex',
    gap: '12px',
    paddingBottom: '12px',
    marginBottom: '12px',
    borderBottom: '1px solid #F0EFED',
  },
  providerInjectionDot: {
    width: '12px',
    height: '12px',
    borderRadius: '6px',
    marginTop: '4px',
  },
  providerInjectionItemContent: {
    flex: 1,
  },
  providerInjectionItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '2px',
  },
  providerInjectionItemType: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  providerInjectionItemDose: {
    fontSize: '13px',
    color: '#4A6741',
    fontWeight: '500',
  },
  providerInjectionItemDate: {
    fontSize: '12px',
    color: '#9B9B9B',
  },
  providerInjectionItemNotes: {
    fontSize: '12px',
    color: '#6B6B6B',
    fontStyle: 'italic',
    marginTop: '4px',
  },
  noInjectionData: {
    fontSize: '14px',
    color: '#9B9B9B',
    textAlign: 'center',
    padding: '20px',
  },
  providerReorderSection: {
    background: '#F5F8F4',
    borderRadius: '14px',
    padding: '16px',
  },
  providerReorderTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '12px',
  },
  providerReorderActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  providerReorderBtn: {
    background: '#FFFFFF',
    border: '1px solid #E0E0E0',
    borderRadius: '10px',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
    cursor: 'pointer',
    textAlign: 'left',
  },
  providerAdjustDoseBtn: {
    background: '#4A6741',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#FFFFFF',
    cursor: 'pointer',
    textAlign: 'left',
  },
  
  // Loyalty Program Styles
  loyaltyPreviewCard: {
    background: 'linear-gradient(135deg, #F5E6D3 0%, #FFFFFF 100%)',
    borderRadius: '16px',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    cursor: 'pointer',
  },
  loyaltyPreviewLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  loyaltyPreviewBadge: {
    width: '44px',
    height: '44px',
    borderRadius: '22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loyaltyPreviewInfo: {
    flex: 1,
  },
  loyaltyPreviewTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '2px',
  },
  loyaltyPreviewSubtext: {
    fontSize: '13px',
    color: '#8B8B8B',
  },
  loyaltyPreviewArrow: {
    fontSize: '18px',
    color: '#C4956A',
  },
  loyaltyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  loyaltyHeaderTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '20px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  tierCard: {
    borderRadius: '20px',
    padding: '24px',
    marginBottom: '20px',
    border: '1px solid rgba(0,0,0,0.05)',
  },
  tierCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
  },
  tierIcon: {
    fontSize: '48px',
  },
  tierInfo: {
    flex: 1,
  },
  tierName: {
    fontFamily: "'Fraunces', serif",
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '4px',
  },
  tierSpent: {
    fontSize: '14px',
    color: '#6B6B6B',
  },
  tierProgress: {
    marginBottom: '16px',
  },
  tierProgressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  tierProgressLabel: {
    fontSize: '13px',
    color: '#6B6B6B',
  },
  tierProgressValue: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#4A6741',
  },
  tierProgressBar: {
    height: '8px',
    background: '#E8E8E8',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  tierProgressFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.5s ease',
  },
  tierDiscount: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  discountBadge: {
    background: '#4A6741',
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: '600',
    padding: '6px 14px',
    borderRadius: '20px',
  },
  discountText: {
    fontSize: '14px',
    color: '#6B6B6B',
  },
  referralCard: {
    background: '#FFFFFF',
    borderRadius: '20px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  referralHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '20px',
  },
  referralIcon: {
    fontSize: '28px',
  },
  referralTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '18px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '2px',
  },
  referralSubtitle: {
    fontSize: '13px',
    color: '#6B6B6B',
  },
  referralCodeBox: {
    background: '#F5F4F2',
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '16px',
  },
  referralCodeLabel: {
    fontSize: '11px',
    color: '#9B9B9B',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
    display: 'block',
  },
  referralCodeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  referralCode: {
    fontFamily: "'DM Sans', monospace",
    fontSize: '24px',
    fontWeight: '700',
    color: '#4A6741',
    letterSpacing: '2px',
  },
  copyButton: {
    background: '#FFFFFF',
    border: '1px solid #E0E0E0',
    borderRadius: '10px',
    padding: '8px 14px',
    fontSize: '13px',
    color: '#4A6741',
    cursor: 'pointer',
    fontWeight: '500',
  },
  shareButton: {
    width: '100%',
    background: 'linear-gradient(135deg, #4A6741 0%, #5B7B50 100%)',
    border: 'none',
    borderRadius: '14px',
    padding: '16px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#FFFFFF',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '16px',
  },
  referralStats: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '24px',
  },
  referralStat: {
    textAlign: 'center',
  },
  referralStatValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#4A6741',
    display: 'block',
  },
  referralStatLabel: {
    fontSize: '12px',
    color: '#9B9B9B',
  },
  referralStatDivider: {
    width: '1px',
    height: '36px',
    background: '#E8E8E8',
  },
  loyaltyTabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
  },
  loyaltyTab: {
    flex: 1,
    background: '#F5F4F2',
    border: 'none',
    borderRadius: '12px',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#6B6B6B',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  loyaltyTabActive: {
    background: '#4A6741',
    color: '#FFFFFF',
  },
  loyaltySectionTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '16px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '14px',
  },
  benefitsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  benefitItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px',
  },
  benefitCheck: {
    width: '24px',
    height: '24px',
    borderRadius: '12px',
    background: '#E8EDE6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#4A6741',
    fontSize: '12px',
  },
  benefitText: {
    fontSize: '14px',
    color: '#2D2D2D',
  },
  rewardsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  rewardCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px',
  },
  rewardIcon: {
    fontSize: '28px',
  },
  rewardInfo: {
    flex: 1,
  },
  rewardName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '2px',
  },
  rewardDesc: {
    fontSize: '12px',
    color: '#9B9B9B',
  },
  rewardStatus: {
    background: '#F5F4F2',
    color: '#6B6B6B',
    fontSize: '12px',
    fontWeight: '500',
    padding: '6px 12px',
    borderRadius: '16px',
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  historyItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px',
  },
  historyAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, #4A6741 0%, #5B7B50 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: '16px',
  },
  historyInfo: {
    flex: 1,
  },
  historyName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '2px',
  },
  historyDate: {
    fontSize: '12px',
    color: '#9B9B9B',
  },
  historyRight: {
    textAlign: 'right',
  },
  historyStatus: {
    fontSize: '11px',
    fontWeight: '500',
    padding: '4px 10px',
    borderRadius: '12px',
    display: 'inline-block',
    marginBottom: '4px',
  },
  historyCredit: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4A6741',
    display: 'block',
  },
  spendingItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px',
  },
  spendingIcon: {
    fontSize: '20px',
    width: '40px',
    height: '40px',
    background: '#F5F4F2',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spendingInfo: {
    flex: 1,
  },
  spendingDesc: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '2px',
  },
  spendingDate: {
    fontSize: '12px',
    color: '#9B9B9B',
  },
  spendingAmount: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2D2D2D',
  },
  emptyHistory: {
    textAlign: 'center',
    padding: '40px 20px',
    background: '#FFFFFF',
    borderRadius: '14px',
  },
  emptyIcon: {
    fontSize: '40px',
    display: 'block',
    marginBottom: '12px',
  },
  emptyText: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '4px',
  },
  emptySubtext: {
    fontSize: '13px',
    color: '#9B9B9B',
  },
  tiersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  tierListItem: {
    borderRadius: '16px',
    padding: '16px',
    transition: 'all 0.2s',
  },
  tierListHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '12px',
  },
  tierListIcon: {
    fontSize: '28px',
  },
  tierListInfo: {
    flex: 1,
  },
  tierListName: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '2px',
  },
  tierListSpend: {
    fontSize: '12px',
    color: '#6B6B6B',
  },
  currentTierBadge: {
    background: '#4A6741',
    color: '#FFFFFF',
    fontSize: '11px',
    fontWeight: '500',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  lockedBadge: {
    fontSize: '18px',
  },
  tierListBenefits: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  tierBenefitTag: {
    fontSize: '11px',
    color: '#6B6B6B',
  },
  tierMoreBenefits: {
    fontSize: '11px',
    color: '#4A6741',
    fontWeight: '500',
  },
  shareModalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  shareModalContent: {
    background: '#FFFFFF',
    borderRadius: '24px 24px 0 0',
    padding: '32px 24px',
    maxWidth: '390px',
    width: '100%',
    position: 'relative',
  },
  shareModalClose: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: '#F0EFED',
    border: 'none',
    width: '32px',
    height: '32px',
    borderRadius: '16px',
    fontSize: '20px',
    color: '#6B6B6B',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareModalTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '22px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '8px',
    textAlign: 'center',
  },
  shareModalSubtitle: {
    fontSize: '14px',
    color: '#6B6B6B',
    textAlign: 'center',
    marginBottom: '24px',
  },
  shareCodeDisplay: {
    background: 'linear-gradient(135deg, #E8EDE6 0%, #F5F4F2 100%)',
    borderRadius: '16px',
    padding: '20px',
    textAlign: 'center',
    marginBottom: '24px',
  },
  shareCodeText: {
    fontFamily: "'DM Sans', monospace",
    fontSize: '28px',
    fontWeight: '700',
    color: '#4A6741',
    letterSpacing: '3px',
  },
  shareOptions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '24px',
  },
  shareOption: {
    background: '#F5F4F2',
    border: 'none',
    borderRadius: '14px',
    padding: '16px 12px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s',
  },
  shareOptionIcon: {
    fontSize: '24px',
  },
  shareOptionLabel: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  sharePreview: {
    background: '#F9F9F9',
    borderRadius: '12px',
    padding: '14px',
  },
  sharePreviewLabel: {
    fontSize: '11px',
    color: '#9B9B9B',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  sharePreviewText: {
    fontSize: '13px',
    color: '#4B4B4B',
    lineHeight: '1.5',
    fontStyle: 'italic',
  },

  // ==================== BADGE STYLES ====================
  badgesSectionContainer: {
    paddingBottom: '20px',
  },
  badgesSummary: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: 'linear-gradient(135deg, #2D2D2D 0%, #1A1A1A 100%)',
    borderRadius: '16px',
    padding: '18px',
    marginBottom: '24px',
    position: 'relative',
    overflow: 'hidden',
  },
  badgesSummaryIcon: {
    fontSize: '32px',
  },
  badgesSummaryContent: {
    flex: 1,
  },
  badgesSummaryTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: '4px',
  },
  badgesSummarySubtitle: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.6)',
  },
  badgesSummaryProgress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '0 0 16px 16px',
  },
  badgesSummaryProgressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #4A6741, #FFD700)',
    borderRadius: '0 0 0 16px',
  },
  badgeCategory: {
    marginBottom: '24px',
  },
  badgeCategoryTitle: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#9B9B9B',
    letterSpacing: '1px',
    marginBottom: '12px',
    paddingLeft: '4px',
  },
  specialBadgesScroll: {
    display: 'flex',
    gap: '12px',
    overflowX: 'auto',
    paddingBottom: '8px',
    scrollbarWidth: 'none',
  },
  specialBadgeCard: {
    flexShrink: 0,
    width: '100px',
    padding: '14px 10px',
    borderRadius: '16px',
    textAlign: 'center',
    position: 'relative',
  },
  specialBadgeIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '30px',
    background: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 10px',
  },
  specialBadgeEmoji: {
    fontSize: '28px',
  },
  specialBadgeName: {
    fontSize: '11px',
    fontWeight: '500',
    color: '#2D2D2D',
    lineHeight: '1.3',
  },
  specialBadgeCheck: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    fontSize: '12px',
    color: '#4A6741',
    background: '#E8EDE6',
    borderRadius: '10px',
    width: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneBadgesContainer: {
    background: '#1A1A1A',
    borderRadius: '16px',
    padding: '16px 12px',
  },
  milestoneBadgesScroll: {
    display: 'flex',
    gap: '16px',
    overflowX: 'auto',
    paddingBottom: '4px',
    scrollbarWidth: 'none',
  },
  milestoneBadge: {
    flexShrink: 0,
    textAlign: 'center',
    width: '70px',
  },
  milestoneBadgeCircle: {
    width: '60px',
    height: '60px',
    borderRadius: '30px',
    border: '3px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 8px',
    position: 'relative',
    overflow: 'hidden',
  },
  milestoneBadgeProgress: {
    position: 'absolute',
    width: '80px',
    height: '80px',
    top: '-10px',
    left: '-10px',
  },
  milestoneBadgeNumber: {
    fontSize: '18px',
    fontWeight: '700',
    zIndex: 1,
  },
  milestoneBadgeName: {
    fontSize: '10px',
    color: '#FFFFFF',
    lineHeight: '1.2',
  },
  milestoneBadgeProgressText: {
    fontSize: '9px',
    color: '#888888',
    marginTop: '2px',
  },

  // ==================== ENHANCED CALENDAR STYLES ====================
  calendarNavHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  calendarNavBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '18px',
    background: '#F5F4F2',
    border: 'none',
    fontSize: '20px',
    color: '#4A6741',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarMonthTitle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  todayBtn: {
    background: 'none',
    border: '1px solid #E0E0E0',
    borderRadius: '12px',
    padding: '4px 12px',
    fontSize: '11px',
    color: '#4A6741',
    cursor: 'pointer',
  },
  calendarDaySelected: {
    background: '#4A6741 !important',
    borderRadius: '8px',
  },
  calendarDayNumberToday: {
    background: '#4A6741',
    color: '#FFFFFF',
    width: '24px',
    height: '24px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDayNumberSelected: {
    color: '#FFFFFF',
  },
  calendarDotPending: {
    width: '6px',
    height: '6px',
    borderRadius: '3px',
    background: 'transparent',
    border: '1.5px solid',
  },
  calendarDotExpected: {
    width: '6px',
    height: '6px',
    borderRadius: '3px',
  },
  calendarLegendEnhanced: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #F0EFED',
  },
  legendDotOutline: {
    width: '8px',
    height: '8px',
    borderRadius: '4px',
    background: 'transparent',
    border: '2px solid',
  },
  legendDotFaded: {
    width: '8px',
    height: '8px',
    borderRadius: '4px',
    background: '#D0D0D0',
  },
  selectedDayDetail: {
    marginTop: '20px',
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '16px',
    border: '1px solid #E8E8E8',
  },
  selectedDayHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
    paddingBottom: '12px',
    borderBottom: '1px solid #F0EFED',
  },
  selectedDayTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '16px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  addToDayBtn: {
    background: '#4A6741',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 14px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  noDayInjections: {
    textAlign: 'center',
    padding: '16px',
  },
  noDayInjectionsText: {
    fontSize: '14px',
    color: '#9B9B9B',
    marginBottom: '8px',
  },
  expectedHint: {
    fontSize: '13px',
    color: '#C4956A',
    background: '#FFF9E6',
    padding: '10px 14px',
    borderRadius: '10px',
  },
  dayInjectionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  dayInjectionItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px',
    background: '#FAFAFA',
    borderRadius: '12px',
    borderLeft: '4px solid',
  },
  dayInjectionCheckbox: {
    width: '28px',
    height: '28px',
    borderRadius: '14px',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  },
  dayInjectionInfo: {
    flex: 1,
  },
  dayInjectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  dayInjectionType: {
    fontSize: '14px',
    fontWeight: '600',
  },
  dayInjectionDose: {
    fontSize: '13px',
    color: '#6B6B6B',
    background: '#FFFFFF',
    padding: '2px 8px',
    borderRadius: '6px',
  },
  dayInjectionNotes: {
    fontSize: '12px',
    color: '#8B8B8B',
    fontStyle: 'italic',
    marginBottom: '6px',
  },
  dayInjectionStatus: {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: '500',
    padding: '4px 10px',
    borderRadius: '12px',
  },

  // First 30 Days Journey Styles
  first30DaysContainer: {
    marginBottom: '24px',
  },
  first30DaysHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  first30DaysIcon: {
    fontSize: '28px',
  },
  first30DaysTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '18px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '2px',
  },
  first30DaysSubtitle: {
    fontSize: '13px',
    color: '#8B8B8B',
  },
  journeyWeeksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '16px',
  },
  journeyWeekCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '14px 16px',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'all 0.2s ease',
  },
  journeyWeekCardActive: {
    background: '#F5F8F4',
    borderColor: '#4A6741',
  },
  journeyWeekIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: '#F0EFED',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
  },
  journeyWeekIconActive: {
    background: '#4A6741',
  },
  journeyWeekContent: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  journeyWeekTitle: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  journeyWeekTitleActive: {
    color: '#4A6741',
    fontWeight: '600',
  },
  journeyWeekCurrentBadge: {
    background: '#4A6741',
    color: '#FFFFFF',
    fontSize: '10px',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  journeyWeekArrow: {
    fontSize: '16px',
    color: '#CCCCCC',
  },
  
  // Success in Month 1 Card
  successMonth1Card: {
    background: '#F5F8F4',
    borderRadius: '16px',
    padding: '18px',
    marginBottom: '16px',
  },
  successMonth1Header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '14px',
  },
  successMonth1Icon: {
    fontSize: '20px',
  },
  successMonth1Title: {
    fontFamily: "'Fraunces', serif",
    fontSize: '17px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  successMonth1Content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  successNotAbout: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px',
  },
  successIsAbout: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px',
  },
  successSectionLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#8B8B8B',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '10px',
  },
  successListNot: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  successListIs: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  successItemNot: {
    fontSize: '13px',
    color: '#9B9B9B',
    lineHeight: '1.4',
  },
  successItemIs: {
    fontSize: '13px',
    color: '#4A6741',
    lineHeight: '1.4',
  },

  // Call Provider Card
  callProviderCard: {
    background: '#FFF5F0',
    borderRadius: '16px',
    padding: '18px',
    borderLeft: '4px solid #E57373',
  },
  callProviderHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
  },
  callProviderIcon: {
    fontSize: '20px',
  },
  callProviderTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '16px',
    fontWeight: '500',
    color: '#C75050',
  },
  callProviderList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '14px',
  },
  callProviderItem: {
    fontSize: '13px',
    color: '#6B6B6B',
    lineHeight: '1.4',
  },
  callProviderButton: {
    display: 'block',
    background: '#C75050',
    color: '#FFFFFF',
    textDecoration: 'none',
    textAlign: 'center',
    padding: '12px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
  },

  // Journey Week Detail Styles
  journeyDetailHeader: {
    textAlign: 'center',
    marginBottom: '28px',
    paddingTop: '20px',
  },
  journeyDetailIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #4A6741 0%, #5B7B50 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    margin: '0 auto 16px',
  },
  journeyDetailTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '24px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  journeyDetailSection: {
    marginBottom: '24px',
  },
  journeyDetailSectionTitle: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#4A6741',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '12px',
  },
  journeyDetailCard: {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '18px',
  },
  journeyExpectationItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    marginBottom: '12px',
  },
  journeyExpectationBullet: {
    fontSize: '16px',
    color: '#4A6741',
    lineHeight: '1.5',
    flexShrink: 0,
  },
  journeyExpectationText: {
    fontSize: '14px',
    color: '#4B4B4B',
    lineHeight: '1.5',
  },
  journeyTipItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    marginBottom: '12px',
  },
  journeyTipCheck: {
    fontSize: '14px',
    color: '#4A6741',
    fontWeight: '600',
    lineHeight: '1.5',
    flexShrink: 0,
  },
  journeyTipText: {
    fontSize: '14px',
    color: '#4B4B4B',
    lineHeight: '1.5',
  },
  journeyProviderReminder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    background: '#F5F8F4',
    borderRadius: '16px',
    padding: '20px',
    textAlign: 'center',
  },
  journeyProviderIcon: {
    fontSize: '24px',
  },
  journeyProviderText: {
    fontSize: '14px',
    color: '#6B6B6B',
    lineHeight: '1.5',
  },
  journeyProviderLink: {
    color: '#4A6741',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
  },

  // Home Calendar Styles
  homeCalendarContainer: {
    background: '#FFFFFF',
    borderRadius: '20px',
    padding: '18px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
  },
  homeCalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  homeCalTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  homeCalIcon: {
    fontSize: '20px',
  },
  homeCalTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '18px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  homeCalTodayBtn: {
    background: 'none',
    border: 'none',
    color: '#2AABB3',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  homeCalMonthNav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  homeCalNavBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: '#9B9B9B',
    cursor: 'pointer',
    padding: '4px 12px',
  },
  homeCalMonthLabel: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  homeCalDayHeaders: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    marginBottom: '8px',
  },
  homeCalDayHeader: {
    textAlign: 'center',
    fontSize: '12px',
    color: '#9B9B9B',
    fontWeight: '500',
    padding: '4px 0',
  },
  homeCalGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '2px',
  },
  homeCalDay: {
    aspectRatio: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    transition: 'background 0.2s',
    padding: '4px',
    position: 'relative',
  },
  homeCalDayOther: {
    opacity: 0.3,
  },
  homeCalDayToday: {
    background: '#E8F4F8',
  },
  homeCalDaySelected: {
    background: '#4A6741',
  },
  homeCalDayNum: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  homeCalDayNumSelected: {
    color: '#FFFFFF',
  },
  homeCalDots: {
    display: 'flex',
    gap: '3px',
    marginTop: '2px',
    height: '6px',
  },
  homeCalDot: {
    width: '6px',
    height: '6px',
    borderRadius: '3px',
  },
  homeCalDetail: {
    marginTop: '16px',
    padding: '16px',
    background: '#FAFAFA',
    borderRadius: '14px',
    borderTop: '1px solid #F0EFED',
  },
  homeCalDetailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
  },
  homeCalDetailTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '16px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  homeCalDetailClose: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: '#9B9B9B',
    cursor: 'pointer',
    padding: '0',
    lineHeight: '1',
  },
  homeCalInjectionCard: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px',
    marginBottom: '12px',
    borderLeft: '4px solid #4A6741',
  },
  homeCalInjHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  homeCalInjIcon: {
    fontSize: '16px',
  },
  homeCalInjType: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4A6741',
  },
  homeCalInjDetails: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  homeCalInjDose: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2D2D2D',
  },
  homeCalInjSite: {
    background: '#E8F4F8',
    color: '#2AABB3',
    fontSize: '12px',
    fontWeight: '500',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  homeCalInjNotes: {
    fontSize: '13px',
    color: '#8B8B8B',
    marginTop: '8px',
    fontStyle: 'italic',
  },
  homeCalNoData: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    background: '#FFFFFF',
    borderRadius: '10px',
    marginBottom: '12px',
  },
  homeCalNoDataIcon: {
    fontSize: '16px',
    opacity: 0.4,
  },
  homeCalNoDataText: {
    fontSize: '14px',
    color: '#9B9B9B',
  },
  homeCalStatsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '10px',
  },
  homeCalStatBox: {
    background: '#FFFFFF',
    borderRadius: '10px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '4px',
  },
  homeCalStatIcon: {
    fontSize: '16px',
  },
  homeCalStatLabel: {
    fontSize: '12px',
    color: '#9B9B9B',
  },
  homeCalStatValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2D2D2D',
  },
  
  // New Injection Calendar Styles
  homeCalInjDayPicker: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  homeCalInjDayLabel: {
    fontSize: '12px',
    color: '#6B6B6B',
  },
  homeCalInjDaySelect: {
    background: '#E8EDE6',
    border: 'none',
    borderRadius: '8px',
    padding: '6px 10px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#4A6741',
    cursor: 'pointer',
    outline: 'none',
  },
  homeCalDayInjection: {
    background: '#F5F8F4',
    border: '2px solid #E8EDE6',
  },
  homeCalDayNumInj: {
    color: '#4A6741',
    fontWeight: '600',
  },
  homeCalCompletedDot: {
    position: 'absolute',
    bottom: '2px',
    width: '16px',
    height: '16px',
    background: '#4A6741',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontSize: '10px',
    fontWeight: '700',
  },
  homeCalInjIndicator: {
    position: 'absolute',
    bottom: '2px',
    fontSize: '10px',
  },
  homeCalLegend: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #F0EFED',
  },
  homeCalLegendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  homeCalLegendDot: {
    fontSize: '12px',
  },
  homeCalLegendDotGreen: {
    width: '16px',
    height: '16px',
    background: '#4A6741',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontSize: '10px',
    fontWeight: '700',
  },
  homeCalLegendText: {
    fontSize: '12px',
    color: '#6B6B6B',
  },
  homeCalModal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  homeCalModalContent: {
    background: '#FFFFFF',
    borderRadius: '20px',
    padding: '24px',
    maxWidth: '320px',
    width: '100%',
    textAlign: 'center',
  },
  homeCalModalTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '18px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '8px',
  },
  homeCalModalDose: {
    fontSize: '14px',
    color: '#6B6B6B',
    marginBottom: '20px',
  },
  homeCalModalCompleted: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    background: '#E8EDE6',
    color: '#4A6741',
    padding: '14px',
    borderRadius: '12px',
    marginBottom: '12px',
    fontWeight: '600',
    fontSize: '15px',
  },
  homeCalModalCompletedIcon: {
    fontSize: '18px',
  },
  homeCalModalBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #4A6741 0%, #5B7B50 100%)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    padding: '14px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  homeCalModalBtnUndo: {
    width: '100%',
    background: '#F5F4F2',
    color: '#6B6B6B',
    border: 'none',
    borderRadius: '12px',
    padding: '14px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  homeCalModalClose: {
    width: '100%',
    background: 'none',
    color: '#9B9B9B',
    border: 'none',
    padding: '10px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  
  // Week Guidance Card Styles
  weekGuidanceCard: {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '18px',
    marginBottom: '20px',
    border: '1px solid #E8E8E8',
  },
  weekGuidanceHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  weekGuidanceIcon: {
    fontSize: '28px',
  },
  weekGuidanceLabel: {
    fontSize: '12px',
    color: '#4A6741',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'block',
  },
  weekGuidanceTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '18px',
    fontWeight: '500',
    color: '#2D2D2D',
    margin: 0,
  },
  weekGuidanceTip: {
    fontSize: '14px',
    color: '#6B6B6B',
    lineHeight: '1.5',
    margin: 0,
  },
  
  // Injection Status Card Styles
  injectionStatusCard: {
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    border: '1px solid #E8E8E8',
  },
  injectionStatusLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  injectionStatusIcon: {
    fontSize: '24px',
  },
  injectionStatusLabel: {
    fontSize: '12px',
    color: '#9B9B9B',
    display: 'block',
  },
  injectionStatusDose: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2D2D2D',
    display: 'block',
  },
  injectionStatusRight: {},
  injectionStatusArrow: {
    fontSize: '20px',
    color: '#4A6741',
  },

  // Education Screen Styles
  eduFeaturedCard: {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '18px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '12px',
    cursor: 'pointer',
    border: '1px solid #E8E8E8',
  },
  eduFeaturedIcon: {
    fontSize: '32px',
    width: '50px',
    height: '50px',
    background: '#F5F4F2',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eduFeaturedContent: {
    flex: 1,
  },
  eduFeaturedTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '4px',
  },
  eduFeaturedDesc: {
    fontSize: '13px',
    color: '#8B8B8B',
  },
  eduFeaturedArrow: {
    fontSize: '18px',
    color: '#4A6741',
  },
  eduKickstartCard: {
    background: 'linear-gradient(135deg, #4A6741 0%, #5B7B50 100%)',
    borderRadius: '16px',
    padding: '18px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    cursor: 'pointer',
  },
  eduKickstartIcon: {
    fontSize: '32px',
    width: '50px',
    height: '50px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eduKickstartContent: {
    flex: 1,
  },
  eduKickstartBadge: {
    fontSize: '10px',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  eduKickstartTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: '4px',
  },
  eduKickstartDesc: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.85)',
  },
  eduKickstartArrow: {
    fontSize: '18px',
    color: '#FFFFFF',
  },
  eduFactsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  eduFactCard: {
    background: '#FFFBEB',
    borderRadius: '12px',
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  eduFactIcon: {
    fontSize: '20px',
    flexShrink: 0,
  },
  eduFactText: {
    fontSize: '14px',
    color: '#5B5B5B',
    lineHeight: '1.5',
  },
  eduCategoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
  },
  eduCategoryCard: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderLeft: '4px solid',
    cursor: 'pointer',
  },
  eduCategoryIcon: {
    fontSize: '20px',
  },
  eduCategoryLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  eduContactCard: {
    background: 'linear-gradient(135deg, #E8EDE6 0%, #D8E0D5 100%)',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginTop: '8px',
  },
  eduContactIcon: {
    fontSize: '32px',
  },
  eduContactContent: {
    flex: 1,
  },
  eduContactTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '4px',
  },
  eduContactText: {
    fontSize: '13px',
    color: '#6B6B6B',
    marginBottom: '8px',
  },
  eduContactLink: {
    fontSize: '14px',
    color: '#4A6741',
    fontWeight: '600',
    textDecoration: 'none',
  },
  eduDetailHeader: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  eduDetailIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '12px',
  },
  eduDetailTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '24px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '8px',
  },
  eduDetailSubtitle: {
    fontSize: '14px',
    color: '#8B8B8B',
  },
  mistakesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  mistakeCard: {
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px',
    display: 'flex',
    gap: '14px',
  },
  mistakeNumber: {
    width: '32px',
    height: '32px',
    borderRadius: '16px',
    background: '#4A6741',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
    flexShrink: 0,
  },
  mistakeContent: {
    flex: 1,
  },
  mistakeTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '4px',
  },
  mistakeDesc: {
    fontSize: '13px',
    color: '#6B6B6B',
    lineHeight: '1.5',
    marginBottom: '8px',
  },
  mistakeCategory: {
    fontSize: '11px',
    color: '#4A6741',
    background: '#E8EDE6',
    padding: '4px 10px',
    borderRadius: '12px',
    textTransform: 'capitalize',
  },
  kickstartHeader: {
    textAlign: 'center',
    marginBottom: '24px',
    background: 'linear-gradient(135deg, #4A6741 0%, #5B7B50 100%)',
    margin: '-24px -20px 24px',
    padding: '32px 20px',
    borderRadius: '0 0 24px 24px',
  },
  kickstartIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '12px',
  },
  kickstartTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '24px',
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: '8px',
  },
  kickstartSubtitle: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.85)',
  },
  kickstartSection: {
    background: '#FFFFFF',
    borderRadius: '14px',
    marginBottom: '12px',
    overflow: 'hidden',
  },
  kickstartSectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    cursor: 'pointer',
  },
  kickstartSectionIcon: {
    fontSize: '24px',
  },
  kickstartSectionTitle: {
    flex: 1,
    fontSize: '16px',
    fontWeight: '600',
    color: '#2D2D2D',
  },
  kickstartSectionArrow: {
    fontSize: '20px',
    color: '#9B9B9B',
    fontWeight: '300',
  },
  kickstartSectionContent: {
    padding: '0 16px 16px',
    borderTop: '1px solid #F0EFED',
  },
  kickstartExpect: {
    marginBottom: '16px',
    marginTop: '12px',
  },
  kickstartExpectTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#4A6741',
    marginBottom: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  kickstartExpectItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#4B4B4B',
    lineHeight: '1.4',
  },
  kickstartBullet: {
    color: '#4A6741',
    fontWeight: '600',
  },
  kickstartTips: {
    background: '#F5F8F4',
    borderRadius: '10px',
    padding: '14px',
  },
  kickstartTipsTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#4A6741',
    marginBottom: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  kickstartTipItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#4B4B4B',
    lineHeight: '1.4',
  },
  kickstartCheck: {
    color: '#4A6741',
    fontWeight: '600',
  },
  eduProviderCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: '#E8EDE6',
    borderRadius: '14px',
    padding: '16px',
    marginTop: '20px',
  },
  eduProviderIcon: {
    fontSize: '24px',
  },
  eduProviderText: {
    fontSize: '14px',
    color: '#4B4B4B',
    marginBottom: '4px',
  },
  eduProviderLink: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4A6741',
    textDecoration: 'none',
  },

  // ==================== PAYMENTS STYLES ====================
  paymentsCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  paymentInput: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    fontSize: '13px',
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
  },
  tableHeader: {
    padding: '12px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#666',
    cursor: 'pointer',
    userSelect: 'none',
  },
  tableCell: {
    padding: '12px',
    fontSize: '13px',
    color: '#333',
  },
  paginationBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    background: 'white',
    fontSize: '14px',
    cursor: 'pointer',
    color: '#333',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    maxWidth: '90%',
    width: '100%',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#999',
    padding: '0',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultItem: {
    background: '#f8f9fa',
    padding: '12px',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: '13px',
    color: '#666',
  },
  resultValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#4A6741',
  },
  detailLabel: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '4px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  detailValue: {
    fontSize: '15px',
    color: '#333',
  },
};
