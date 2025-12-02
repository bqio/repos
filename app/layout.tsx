import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geisMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Repos",
  description: "Управление репозиториями",
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
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
