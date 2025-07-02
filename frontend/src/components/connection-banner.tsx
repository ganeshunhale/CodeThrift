"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Wifi, WifiOff } from "lucide-react"

interface ConnectionBannerProps {
  status: "connecting" | "connected" | "disconnected" | "error"
  onRetry?: () => void
}

export function ConnectionBanner({ status, onRetry }: ConnectionBannerProps) {
  if (status === "connected") return null

  return (
    <Alert
      className={`mb-4 ${
        status === "error"
          ? "border-red-500/50 bg-red-500/10"
          : status === "connecting"
            ? "border-yellow-500/50 bg-yellow-500/10"
            : "border-gray-500/50 bg-gray-500/10"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {status === "error" ? (
            <AlertTriangle className="h-4 w-4 text-red-400" />
          ) : status === "connecting" ? (
            <Wifi className="h-4 w-4 text-yellow-400 animate-pulse" />
          ) : (
            <WifiOff className="h-4 w-4 text-gray-400" />
          )}
          <AlertDescription className="text-sm">
            {status === "error" && "Unable to connect to the collaboration server. Your changes are saved locally."}
            {status === "connecting" && "Connecting to collaboration server..."}
            {status === "disconnected" && "Disconnected from collaboration server. Working in offline mode."}
          </AlertDescription>
        </div>
        {(status === "error" || status === "disconnected") && onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="ml-4">
            Retry
          </Button>
        )}
      </div>
    </Alert>
  )
}
