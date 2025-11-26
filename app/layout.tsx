import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { ServiceWorkerRegister } from "@/components/service-worker-register"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Repos",
  description: "Управление репозиториями",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon.png",
        type: "image/png",
      },
    ]
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`font-sans antialiased`}>
        <ServiceWorkerRegister />
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
