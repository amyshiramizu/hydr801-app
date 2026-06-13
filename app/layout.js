import './globals.css'

export const metadata = {
  title: 'HYDR801 Infusion & Wellness',
  description: 'Your personalized GLP-1 wellness companion - nutrition, fitness, and progress tracking',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'HYDR801',
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
}

// Next 14 split themeColor + viewport out of the `metadata` export into a
// dedicated `viewport` export — keeping them in metadata logs deprecation
// warnings on every page render in dev.
export const viewport = {
  themeColor: '#4A6741',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="HYDR801" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#4A6741" />
      </head>
      <body>{children}</body>
    </html>
  )
}
