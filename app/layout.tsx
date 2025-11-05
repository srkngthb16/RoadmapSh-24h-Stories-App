import './globals.css'
import React from 'react'

export const metadata = {
  title: 'Hikayeler - Serkan Dalgıç',
  description: '24 saatlik hikaye özelliği (client-side)',
}

// ✅ Type the props correctly
interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="tr">
      <body>
        <main className="app-container">
          {children}
        </main>
      </body>
    </html>
  )
}
