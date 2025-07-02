"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import useWebSocket from "react-use-websocket"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Users, Home, Download, Maximize2, Minimize2 } from "lucide-react"
import Link from "next/link"
import { ConnectionBanner } from "@/components/connection-banner"
import axios from "axios"
import Image from "next/image"
interface WSMessage {
  code?: string;      
  users?: number;
}

export default function EditorPage() {
  const filename = decodeURIComponent(useParams().filename as string)
  const [code, setCode] = useState("")
  const [users, setUsers] = useState<number>(0)
  const [copied, setCopied] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lastReceivedCodeRef  = useRef<string|null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected" | "error">("connecting")

  // Fetch initial content
  useEffect(() => {
    const fetchInitialCode = async () => {
       try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BACKEND_URL||"http://localhost:3001"}/${filename}`
        );
        setCode(data.existedFile.content);
      } catch (err) {
        console.error("Error fetching initial code:", err);
      }
    }

    fetchInitialCode()
  }, [filename])

  const {
    sendJsonMessage,
    lastJsonMessage,
    readyState,
  } = useWebSocket<WSMessage>(process.env.NEXT_PUBLIC_WS_BACKEND_URL || "ws://localhost:3001", {
    queryParams: { fileName: filename },
    shouldReconnect: () => true,
    onOpen: () => setConnectionStatus("connected"),
    onClose: () => setConnectionStatus("disconnected"),
    onError: () => setConnectionStatus("error"),
  })

  const isConnected = readyState === WebSocket.OPEN

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

  if (!isConnected) {
    // Save to DB after 1 min (60000ms) if not connected
    timer = setTimeout(() => {
      axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND_URL||"http://localhost:3001"}/${filename}`, {
        content: code,
      }).catch((err) => {
        console.error("Failed to save code offline:", err);
      });
    }, 60000);
  } else {
    // Debounced socket update when connected
    timer = setTimeout(() => {
      if (code !== lastReceivedCodeRef.current) {
        sendJsonMessage(code);
      }
    }, 1000);
  }
    return () => clearTimeout(timer)
  }, [code, isConnected])
  useEffect(() => { 
if (!lastJsonMessage) return

    if (lastJsonMessage?.code && lastJsonMessage.code !== code) {
      lastReceivedCodeRef.current = lastJsonMessage.code
      setCode(lastJsonMessage.code)
    }
// console.log("users",lastJsonMessage?.users);

    if (lastJsonMessage?.users) {
      setUsers(lastJsonMessage.users)
    }
  }, [lastJsonMessage])


  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value
    setCode(newCode)

  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getLanguageFromFilename = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase()
    const langMap: Record<string, { name: string; color: string; icon: React.ReactNode }> = {
      js: { name: "JavaScript", color: "bg-yellow-500", icon: <Image src="/images/js-brands.svg" alt="JS Icon"/> },
      jsx: { name: "React", color: "bg-blue-500", icon: "⚛️" },
      ts: { name: "TypeScript", color: "bg-blue-600", icon: "🔷" },
      tsx: { name: "React TS", color: "bg-blue-600", icon: "⚛️" },
      py: { name: "Python", color: "bg-green-500", icon: <Image src="/images/python-brands.svg" alt="Python Icon"/> },
      html: { name: "HTML", color: "bg-orange-500", icon: <Image src="/images/html5-brands.svg" alt="HTML Icon"/> },
      css: { name: "CSS", color: "bg-purple-500", icon: "🎨" },
      json: { name: "JSON", color: "bg-gray-500", icon: "⚙️" },
      md: { name: "Markdown", color: "bg-gray-600", icon: "📝" },
      sql: { name: "SQL", color: "bg-indigo-500", icon: "🗄️" },
      php: { name: "PHP", color: "bg-purple-600", icon: "🐘" },
      java: { name: "Java", color: "bg-red-500", icon: "☕" },
      cpp: { name: "C++", color: "bg-blue-700", icon: "⚡" },
      c: { name: "C", color: "bg-gray-700", icon: "⚡" },
    }
    return langMap[ext || ""] || { name: "Text", color: "bg-gray-500", icon: "📄" }
  }

  const language = getLanguageFromFilename(filename)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-700/50 bg-gray-800/50 backdrop-blur-xl shadow-lg">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-700/50">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{language.icon}</span>
              <h1 className="text-2xl font-semibold text-white">{filename}</h1>
              <Badge className={`${language.color} text-white border-0 px-3 py-1 rounded-full text-xs font-medium`}>
                {language.name}
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-700/50 rounded-full">
              <div
                className={`w-2 h-2 rounded-full ${
                  connectionStatus === "connected"
                    ? "bg-green-400 animate-pulse"
                    : connectionStatus === "connecting"
                    ? "bg-yellow-400 animate-pulse"
                    : connectionStatus === "error"
                    ? "bg-red-400"
                    : "bg-gray-400"
                }`}
              />
              <span className="text-sm text-gray-300 font-medium">
                {connectionStatus === "connected"
                  ? "Connected"
                  : connectionStatus === "connecting"
                  ? "Connecting..."
                  : connectionStatus === "error"
                  ? "Error"
                  : "Disconnected"}
              </span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 rounded-full">
              <Users className="h-4 w-4 text-violet-400" />
              <span className="text-sm text-gray-300 font-medium">
                {`${users}`} user{users !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Button onClick={copyToClipboard} variant="outline" size="sm" className="text-gray-300">
                <Copy className="h-4 w-4 mr-2" />
                {copied ? "Copied!" : "Share"}
              </Button>
              <Button onClick={downloadCode} variant="outline" size="sm" className="text-gray-300">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={() => setIsFullscreen(!isFullscreen)}
                variant="outline"
                size="sm"
                className="text-gray-300"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Editor */}
      <main className={`${isFullscreen ? "fixed inset-0 top-16 z-50" : "container mx-auto px-6 py-6"}`}>
        <ConnectionBanner
          status={connectionStatus}
          onRetry={() => setConnectionStatus("connecting")}
        />

        <Card className="shadow-2xl border border-gray-700/50 bg-gray-800/30 backdrop-blur-xl h-full">
          <div className="relative h-full">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gray-700/30 border-r border-gray-600/30 flex flex-col text-gray-500 text-sm font-mono pt-4">
              {code.split("\n").map((_, i) => (
                <div key={i} className="h-5 flex items-center justify-end pr-3 leading-6">
                  {i + 1}
                </div>
              ))}
            </div>

            <Textarea
              ref={textareaRef}
              value={code}
              onChange={handleCodeChange}
              placeholder={`Start typing your ${language.name} code here...`}
              className={`${isFullscreen ? "h-[calc(100vh-4rem)]" : "min-h-[70vh]"} font-mono text-sm border-0 resize-none focus:ring-0 focus:outline-none rounded-xl bg-transparent text-gray-100 placeholder:text-gray-500 pl-20 pr-6 py-4 leading-6`}
              style={{ tabSize: 2 }}
            />

            <div className="absolute top-4 right-6 flex items-center space-x-4">
              <Badge variant="outline" className="bg-gray-700/50 text-gray-300">
                {code.split("\n").length} lines
              </Badge>
              <Badge variant="outline" className="bg-gray-700/50 text-gray-300">
                {code.length} chars
              </Badge>
            </div>
          </div>
        </Card>

        <div className="mt-4 flex justify-between text-sm text-gray-400 px-2">
          <div className="flex space-x-6">
            <span>Characters: {code.length}</span>
            <span>Lines: {code.split("\n").length}</span>
            <span>Words: {code.trim().split(/\s+/).length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`} />
            <span>{isConnected ? "Auto-save enabled" : "Disconnected - changes not saved"}</span>
          </div>
        </div>
      </main>
    </div>
  )
}
