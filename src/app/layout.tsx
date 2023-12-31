import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { ConfettiProvider } from '@/components/providers/ConfettiProvider'
import QueryProvider from '@/components/providers/ReactQuery'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'serene',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <QueryProvider>
          <body className={inter.className}>
            <ConfettiProvider />
            {children}
            <Toaster />
          </body>
        </QueryProvider>
      </html>
    </ClerkProvider>
  )
}
