import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export default function FAQPage() {
  return (
    <main className="bg-[#072534] text-white">
      <section className="container mx-auto px-4 py-14 text-center">
        <h1 className="text-[#FFC300] text-4xl md:text-5xl font-extrabold">FAQ</h1>
        <p className="mt-3 text-white/85 max-w-3xl mx-auto">
          Le risposte rapide alle domande più frequenti.
        </p>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <Accordion type="single" collapsible className="space-y-2">
          <AccordionItem value="q1" className="border border-white/10 rounded-lg px-4">
            <AccordionTrigger className="text-left text-[#FFC300]">
              Quando ho diritto al risarcimento?
            </AccordionTrigger>
            <AccordionContent className="text-white/85">
              In caso di volo cancellato con meno di 14 giorni di preavviso, volo in ritardo con
              arrivo a destinazione oltre 3 ore, o negato imbarco per overbooking o altre ragioni
              non dipendenti da te.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q2" className="border border-white/10 rounded-lg px-4">
            <AccordionTrigger className="text-left text-[#FFC300]">
              Devo pagare qualcosa?
            </AccordionTrigger>
            <AccordionContent className="text-white/85">
              No, nessun anticipo. Tratteniamo una percentuale solo in caso di successo, come
              indicato nel nostro modello di compenso.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q3" className="border border-white/10 rounded-lg px-4">
            <AccordionTrigger className="text-left text-[#FFC300]">
              Cosa succede se la compagnia si oppone?
            </AccordionTrigger>
            <AccordionContent className="text-white/85">
              Gestiamo noi le comunicazioni e, se necessario, possiamo rappresentarti in giudizio
              per far valere i tuoi diritti.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q4" className="border border-white/10 rounded-lg px-4">
            <AccordionTrigger className="text-left text-[#FFC300]">
              Quanto dura il processo?
            </AccordionTrigger>
            <AccordionContent className="text-white/85">
              Dipende dal caso e dalla risposta della compagnia aerea. In molti casi, il rimborso
              può essere ottenuto a seguito di diffida senza arrivare in giudizio.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q5" className="border border-white/10 rounded-lg px-4">
            <AccordionTrigger className="text-left text-[#FFC300]">
              Posso farmi seguire anche se il volo è di mesi fa?
            </AccordionTrigger>
            <AccordionContent className="text-white/85">
              Sì, in molti casi è possibile agire anche a distanza di mesi. Contattaci per una
              verifica gratuita della tua situazione.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </main>
  )
}
