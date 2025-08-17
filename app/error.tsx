"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="size-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="size-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-balance">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-8 text-pretty">
          We're having trouble loading the products. This might be a temporary issue.
        </p>
        <Button
          onClick={reset}
          className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:-translate-y-1"
        >
          <RefreshCw className="mr-2 size-4 transition-transform group-hover:rotate-180" />
          Try Again
        </Button>
      </div>
    </div>
  )
}
