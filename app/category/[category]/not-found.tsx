import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Search } from 'lucide-react'

export default function CategoryNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-balance">Category Not Found</h2>
        <p className="text-gray-600 mb-8 text-pretty">
          The category you're looking for doesn't exist or may have been moved. Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Browse Categories</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
