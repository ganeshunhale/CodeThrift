"use client"
import "./globals.css"
import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Users, Zap, Sparkles, Globe } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  const [filename, setFilename] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (filename.trim()) {
      router.push(`/${encodeURIComponent(filename.trim())}`)
    }
  }

  const handleQuickStart = (name: string) => {
    router.push(`/${name}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative overflow-hidden">
      {/* Background Effects */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Header */}
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="relative">
                <Code className="h-12 w-12 text-violet-400" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full animate-ping"></div>
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                CodeThrift
              </h1>
            </div>
            <p className="text-2xl text-gray-300 font-light">Real-time collaborative code editor</p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Write, share, and collaborate on code in real-time with developers around the world. No setup required,
              just start coding.
            </p>
          </div>

          {/* Main Card */}
          <Card className="shadow-2xl border border-gray-700/50 bg-gray-800/40 backdrop-blur-xl max-w-2xl mx-auto">
            <CardHeader className="space-y-4 pb-8">
              <CardTitle className="text-3xl text-white font-semibold">Start Your Session</CardTitle>
              <CardDescription className="text-lg text-gray-300">
                Enter a filename to create or join a collaborative coding session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative group">
                  <Input
                    type="text"
                    placeholder="Enter filename (e.g., main.js, index.html, app.py)"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    className="h-14 text-lg px-6 border-2 border-gray-600/50 bg-gray-700/50 text-white placeholder:text-gray-400 focus:border-violet-500 focus:bg-gray-700/70 transition-all duration-300 rounded-xl backdrop-blur-sm"
                    autoFocus
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 text-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 transition-all duration-300 rounded-xl shadow-lg hover:shadow-violet-500/25 transform hover:scale-[1.02]"
                  disabled={!filename.trim()}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Coding
                </Button>
              </form>

              <div className="space-y-4">
                <p className="text-sm text-gray-400 font-medium">Quick Start Templates</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { name: "main.js", icon: <Image src="/images/js-brands.svg" alt="JS Icon"/>, desc: "JavaScript" },
                    { name: "index.html", icon: <Image src="/images/html5-brands.svg" alt="HTML Icon"/>,desc: "HTML" },
                    { name: "app.py", icon:  <Image src="/images/python-brands.svg" alt="Python Icon"/>, desc: "Python" },
                    { name: "style.css", icon: "🎨", desc: "CSS" },
                    { name: "README.md", icon: "📝", desc: "Markdown" },
                    { name: "config.json", icon: "⚙️", desc: "JSON" },
                  ].map((item) => (
                    <Button
                      key={item.name}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickStart(item.name)}
                      className="h-12 flex-col border-gray-600/50 bg-gray-700/30 text-gray-300 hover:bg-gray-600/50 hover:border-violet-400/50 hover:text-white transition-all duration-300 rounded-lg backdrop-blur-sm"
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-xs font-medium">{item.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "See changes instantly as others type with real-time synchronization",
                color: "from-yellow-400 to-orange-500",
                bgColor: "bg-yellow-500/10",
              },
              {
                icon: Users,
                title: "Collaborate",
                description: "Multiple users can edit simultaneously with conflict resolution",
                color: "from-green-400 to-emerald-500",
                bgColor: "bg-green-500/10",
              },
              {
                icon: Globe,
                title: "Universal Access",
                description: "Works on any device, anywhere. No installation required",
                color: "from-blue-400 to-cyan-500",
                bgColor: "bg-blue-500/10",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div
                  className={`absolute inset-0 rounded-2xl ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                ></div>
                <div className="relative z-10 text-center space-y-4">
                  <div className={`mx-auto w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-4 shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
