import RequestForm from "@/components/request-form"
import { Suspense } from "react"

export default function RichiestaPage() {
  return (
    <main className="bg-[#072534] text-white">
      <section className="container mx-auto px-4 pt-12 pb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#FFC300]">Richiesta di Assistenza</h1>
        <p className="mt-3 text-white/85 max-w-2xl">
          Rispondi a poche domande e invia i dettagli del tuo volo. Un avvocato reale valuterà la tua pratica.
        </p>
      </section>

      <section className="container mx-auto px-4 pb-12">
        <Suspense
          fallback={
            <div className="rounded-2xl bg-white/10 p-6">
              <div className="h-6 w-48 bg-white/20 rounded animate-pulse mb-4" />
              <div className="space-y-3">
                <div className="h-10 bg-white/10 rounded animate-pulse" />
                <div className="h-10 bg-white/10 rounded animate-pulse" />
                <div className="h-24 bg-white/10 rounded animate-pulse" />
              </div>
            </div>
          }
        >
          <RequestForm />
        </Suspense>
      </section>
    </main>
  )
}
