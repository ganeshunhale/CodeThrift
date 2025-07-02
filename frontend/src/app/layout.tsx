import "./globals.css";
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CodeThrift - Real-time Collaborative Code Editor",
  description: "Share and edit code in real-time with developers around the world",
  keywords: "code editor, collaboration, real-time, programming, development",
  
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 text-gray-100 antialiased`}>{children}</body>
    </html>
  )
}
