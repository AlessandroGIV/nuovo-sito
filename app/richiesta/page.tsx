import RequestForm from "@/components/request-form"
import { Suspense } from "react"

export default function RichiestaPage() {
  return (
    <main>
      <Suspense
        fallback={
          <div className="flex min-h-[calc(100vh-4rem)] bg-gradient-to-b from-[#0E2032] to-[#0A1826] items-center justify-center">
            <div className="w-full max-w-[680px] bg-white rounded-2xl p-10 space-y-4 mx-6">
              <div className="h-4 w-24 bg-gray-100 rounded-full animate-pulse" />
              <div className="h-8 w-64 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-4 w-96 bg-gray-100 rounded-full animate-pulse" />
              <div className="space-y-3 mt-6">
                <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
                <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        }
      >
        <RequestForm />
      </Suspense>
    </main>
  )
}
