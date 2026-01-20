import MultiStepRequestForm from "@/components/multi-step-request-form"
import { Suspense } from "react"

export default function RichiestaPage() {
  return (
    <main className="bg-[#072534] text-white min-h-screen">
      <section className="container mx-auto px-4 my-0 pb-1 pt-1">
        <Suspense
          fallback={
            <div className="max-w-3xl mx-auto">
              <div className="h-20 bg-white/10 rounded animate-pulse mb-8" />
              <div className="rounded-2xl bg-white/10 p-6">
                <div className="h-6 w-48 bg-white/20 rounded animate-pulse mb-4" />
                <div className="space-y-3">
                  <div className="h-10 bg-white/10 rounded animate-pulse" />
                  <div className="h-10 bg-white/10 rounded animate-pulse" />
                  <div className="h-24 bg-white/10 rounded animate-pulse" />
                </div>
              </div>
            </div>
          }
        >
          <MultiStepRequestForm />
        </Suspense>
      </section>
    </main>
  )
}
