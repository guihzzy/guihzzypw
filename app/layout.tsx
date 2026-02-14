import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'guihzzy - profile',
  description: '...',
  icons: {
    icon: 'https://cdn.discordapp.com/emojis/1397681454615498975.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}


