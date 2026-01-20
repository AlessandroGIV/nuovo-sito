export type Language = 'it' | 'en'

export const translations = {
  it: {
    // Header
    home: 'Home',
    howItWorks: 'Come Funziona',
    whoWeAre: 'Chi Siamo',
    compensation: 'Compenso',
    faq: 'FAQ',
    
    // Hero
    heroTitle: 'Volo in ritardo o cancellato?',
    heroSubtitle: 'Non lasciare il tuo rimborso a terra.',
    
    // How it works page
    howItWorksTitle: 'Come Funziona',
    howItWorksSubtitle: 'Il nostro processo è semplice, trasparente e senza rischi per te.',
    step1Title: 'Contattaci',
    step1Desc: 'Compila il modulo con i dettagli del tuo volo. La valutazione iniziale è completamente gratuita.',
    step2Title: 'Valutiamo il caso',
    step2Desc: 'Un nostro avvocato esamina la tua richiesta e verifica se hai diritto al risarcimento.',
    step3Title: 'Gestiamo tutto noi',
    step3Desc: 'Ci occupiamo di tutta la pratica: reclamo, negoziazione e, se necessario, azione legale.',
    step4Title: 'Ricevi il rimborso',
    step4Desc: 'In caso di successo, ricevi il tuo risarcimento. Tratteniamo solo una piccola percentuale.',
    
    // Who we are page
    whoWeAreTitle: 'Chi Siamo',
    whoWeAreSubtitle: 'Un team di professionisti al servizio dei passeggeri aerei.',
    whoWeAreText1: 'GiustiziaInVolo è un servizio legale specializzato nell\'assistenza ai passeggeri aerei vittime di disservizi. A differenza dei grandi portali automatizzati, ogni pratica è seguita personalmente da avvocati qualificati.',
    whoWeAreText2: 'Il nostro team ha esperienza diretta nel settore aereo e conosce a fondo il Regolamento CE 261/2004 e le normative internazionali sui diritti dei passeggeri.',
    
    // Compensation page
    compensationTitle: 'Modello di Compenso',
    compensationSubtitle: 'Trasparenza totale: paghi solo in caso di successo.',
    noHiddenCosts: 'Nessun costo iniziale o nascosto',
    fairPercentage: 'Percentuale contenuta e trasparente',
    writtenAgreement: 'Accordo scritto chiaro e dettagliato',
    transparencyTitle: 'Trasparenza e Chiarezza',
    transparencyText: 'Prima di iniziare, riceverai un accordo scritto che specifica chiaramente tutti i termini del nostro rapporto, inclusa la quota che tratterremo in caso di successo.',
    
    // FAQ page  
    faqQuestion1: 'Quando ho diritto al risarcimento?',
    faqAnswer1: 'Hai diritto al risarcimento se il tuo volo è stato cancellato, ha subito un ritardo di almeno 3 ore, o ti è stato negato l\'imbarco per overbooking. Il volo deve essere partito da un aeroporto UE o operato da una compagnia UE.',
    faqQuestion2: 'Cosa succede con i voli in connessione?',
    faqAnswer2: 'Se hai prenotato i voli come un\'unica prenotazione e perdi la coincidenza a causa di un ritardo del primo volo, hai diritto al risarcimento per l\'intero viaggio se arrivi a destinazione con più di 3 ore di ritardo.',
    faqQuestion3: 'Devo pagare qualcosa?',
    faqAnswer3: 'No, non devi anticipare nulla. Paghiamo noi tutte le spese legali. Solo in caso di successo tratteniamo una percentuale del rimborso ottenuto.',
    faqQuestion4: 'Cosa succede se la compagnia si oppone?',
    faqAnswer4: 'Se la compagnia aerea rifiuta il risarcimento, possiamo procedere con un\'azione legale. I costi del giudizio sono sempre a nostro carico, e tu non paghi nulla in caso di esito negativo.',
    faqQuestion5: 'Quanto dura il processo?',
    faqAnswer5: 'I tempi variano: con una diffida stragiudiziale possono bastare poche settimane. Se si arriva in tribunale, il processo può durare alcuni mesi. Ti terremo sempre aggiornato.',
    faqQuestion6: 'Posso farmi seguire anche se il volo è di mesi fa?',
    faqAnswer6: 'Sì, puoi richiedere il risarcimento fino a 2 anni dalla data del volo.',
    heroAmount: 'Potresti avere diritto fino a 600 €.',
    
    // Features
    realLawyers: 'Avvocati veri',
    noUpfront: 'Nessun anticipo',
    personalAssistance: 'Assistenza personale',
    
    // Form
    departureAirport: 'Aeroporto di partenza',
    destinationAirport: 'Aeroporto di destinazione',
    stopoverAirport: 'Aeroporto di scalo',
    calculateRefund: 'Calcola la possibilità di rimborso',
    requestAssistance: 'Richiedi Assistenza',
    
    // Itinerary
    itinerary: 'Itinerario',
    directFlight: 'Il tuo volo era diretto?',
    yes: 'Sì',
    no: 'No',
    whereFlying: 'Dove stavi volando?',
    startWithItinerary: 'Iniziamo con l\'itinerario del tuo volo',
    direct: 'Diretto',
    withStopover: 'Con scalo',
    continue: 'Continua',
    back: 'Indietro',
    whenDidItHappen: 'Quando è avvenuto il disservizio?',
    flight: 'Volo',
    yourData: 'I tuoi dati',
    howCanWeContact: 'Come possiamo contattarti?',
    almostDone: 'Quasi fatto!',
    readAndAccept: 'Leggi e accetta i termini per procedere',
    sendRequest: 'Invia richiesta',
    confirm: 'Conferma',
    
    // Flight details
    flightDetails: 'Dettagli volo',
    flightDetailsWithNumber: 'Dettagli volo (Volo {{number}})',
    flightDate: 'Data del volo',
    airline: 'Compagnia aerea',
    scheduledDeparture: 'Orario di partenza previsto',
    
    // Personal data
    personalData: 'Dati personali',
    fullName: 'Nome e Cognome',
    email: 'Email',
    phone: 'Telefono',
    yourPhone: 'Il tuo numero di telefono',
    problemDescription: 'Descrizione del problema',
    describeProblem: 'Descrivi brevemente cosa è successo (ritardo, cancellazione, ecc.)',
    
    // Consent
    consent: 'Consenso',
    agreeToPrivacy: 'Acconsento al trattamento dei miei dati personali come descritto nella',
    privacyPolicy: 'Privacy Policy',
    agreeToTerms: 'Dichiaro di aver preso visione e accettato i termini e condizioni del servizio - Vedi',
    termsAndConditions: 'Termini e condizioni',
    
    // Buttons
    submit: 'Invia la richiesta',
    submitRequest: 'INVIA RICHIESTA!',
    requestFreeClaim: 'Richiedi assistenza gratuita',
    readFAQ: 'Leggi le FAQ',
    sendAnotherRequest: 'Invia un\'altra richiesta',
    
    // Success
    requestSent: 'Richiesta Inviata!',
    requestSentMessage: 'Grazie per averci contattato. Un nostro avvocato ti risponderà al più presto per valutare il tuo caso.',
    
    // CTA
    ctaTitle: 'Pronto a Richiedere il Tuo Risarcimento?',
    ctaSubtitle: 'Non lasciare che le compagnie aeree ignorino i tuoi diritti. Contattaci oggi stesso per una valutazione gratuita del tuo caso.',
    
    // Footer
    footerTagline: 'Servizio legale italiano che assiste i passeggeri aerei vittime di ritardi o cancellazioni.',
    footerSlogan: 'Non lasciare il tuo rimborso a terra.',
    quickLinks: 'Collegamenti Rapidi',
    contact: 'Contattaci',
    contactEmail: 'info@giustiziainvolo.it',
    fillForm: 'Compila il modulo per essere ricontattato',
    
    // FAQ
    faqTitle: 'Domande Frequenti',
    faqSubtitle: 'Risposte alle domande più comuni sul risarcimento per disservizi aerei.',
    
    // Request form specific
    requestTitle: 'Richiesta di Assistenza',
    requestSubtitle: 'Rispondi a poche domande e invia i dettagli del tuo volo. Un avvocato reale valuterà la tua pratica.',
    insertDataContinue: 'Inserisci i dati e prosegui',
    completeRequiredFields: 'Compila i campi obbligatori',
    someMissingInvalid: 'Alcuni campi sono mancanti o non validi.',
    consentRequired: 'Consensi obbligatori',
    acceptPrivacyTerms: 'Accetta Privacy e Termini per inviare la richiesta.',
    submitting: 'Invio in corso...',
    submitRequest: 'Invia la richiesta',
    requestSentThankYou: 'Ti ricontatteremo entro 24 ore.',
    sendFailed: 'Invio non riuscito',
    tryAgainLater: 'Riprova più tardi.',
    networkError: 'Errore di rete',
    checkConnectionRetry: 'Controlla la connessione e riprova.',
    validTimeRequired: 'Inserisci un orario valido',
    enter10DigitPhone: 'Inserisci un numero di 10 cifre',
    yourFullName: 'Il tuo nome completo',
    yourEmail: 'La tua email',
    problemDescriptionPlaceholder: 'Es. ritardo di 4 ore sul primo volo, perdita connessione...',
    
    // Common
    loading: 'Caricamento...',
    noResults: 'Nessun risultato',
    required: 'Obbligatorio',
    optional: 'Facoltativo',
    requiredField: 'Campo obbligatorio',
    
  },
  en: {
    // Header
    home: 'Home',
    howItWorks: 'How It Works',
    whoWeAre: 'Who We Are',
    compensation: 'Compensation',
    faq: 'FAQ',
    
    // Hero
    heroTitle: 'Flight delayed or cancelled?',
    heroSubtitle: 'Don\'t let your refund stay grounded.',
    
    // How it works page
    howItWorksTitle: 'How It Works',
    howItWorksSubtitle: 'Our process is simple, transparent and risk-free for you.',
    step1Title: 'Contact us',
    step1Desc: 'Fill in the form with your flight details. The initial evaluation is completely free.',
    step2Title: 'We evaluate your case',
    step2Desc: 'One of our lawyers examines your request and verifies if you are entitled to compensation.',
    step3Title: 'We handle everything',
    step3Desc: 'We take care of the entire process: claim, negotiation and, if necessary, legal action.',
    step4Title: 'You receive the refund',
    step4Desc: 'If successful, you receive your compensation. We only keep a small percentage.',
    
    // Who we are page
    whoWeAreTitle: 'Who We Are',
    whoWeAreSubtitle: 'A team of professionals serving air passengers.',
    whoWeAreText1: 'GiustiziaInVolo is a legal service specialized in assisting air passengers affected by service disruptions. Unlike large automated portals, each case is personally handled by qualified lawyers.',
    whoWeAreText2: 'Our team has direct experience in the aviation sector and thorough knowledge of EC Regulation 261/2004 and international passenger rights regulations.',
    
    // Compensation page
    compensationTitle: 'Compensation Model',
    compensationSubtitle: 'Full transparency: you only pay if we succeed.',
    noHiddenCosts: 'No initial or hidden costs',
    fairPercentage: 'Fair and transparent percentage',
    writtenAgreement: 'Clear and detailed written agreement',
    transparencyTitle: 'Transparency and Clarity',
    transparencyText: 'Before we begin, you will receive a written agreement clearly specifying all terms of our relationship, including the fee we will retain in case of success.',
    
    // FAQ page
    faqQuestion1: 'When am I entitled to compensation?',
    faqAnswer1: 'You are entitled to compensation if your flight was cancelled, delayed by at least 3 hours, or you were denied boarding due to overbooking. The flight must have departed from an EU airport or been operated by an EU airline.',
    faqQuestion2: 'What happens with connecting flights?',
    faqAnswer2: 'If you booked the flights as a single booking and miss your connection due to a delay on the first flight, you are entitled to compensation for the entire journey if you arrive at your destination more than 3 hours late.',
    faqQuestion3: 'Do I have to pay anything?',
    faqAnswer3: 'No, you don\'t need to pay anything upfront. We cover all legal costs. Only in case of success do we retain a percentage of the compensation obtained.',
    faqQuestion4: 'What happens if the airline refuses?',
    faqAnswer4: 'If the airline refuses compensation, we can proceed with legal action. Court costs are always borne by us, and you pay nothing if the outcome is negative.',
    faqQuestion5: 'How long does the process take?',
    faqAnswer5: 'The timeframe varies: with an out-of-court demand letter, it can take just a few weeks. If it goes to court, the process can take several months. We will always keep you updated.',
    faqQuestion6: 'Can I still claim if my flight was months ago?',
    faqAnswer6: 'Yes, you can claim compensation up to 2 years from the flight date.',
    heroAmount: 'You could be entitled to up to €600.',
    
    // Features
    realLawyers: 'Real lawyers',
    noUpfront: 'No upfront costs',
    personalAssistance: 'Personal assistance',
    
    // Form
    departureAirport: 'Departure airport',
    destinationAirport: 'Destination airport',
    stopoverAirport: 'Stopover airport',
    calculateRefund: 'Calculate refund possibility',
    requestAssistance: 'Request Assistance',
    
    // Itinerary
    itinerary: 'Itinerary',
    directFlight: 'Was your flight direct?',
    yes: 'Yes',
    no: 'No',
    whereFlying: 'Where were you flying?',
    startWithItinerary: 'Let\'s start with your flight itinerary',
    direct: 'Direct',
    withStopover: 'With stopover',
    continue: 'Continue',
    back: 'Back',
    whenDidItHappen: 'When did the disruption occur?',
    flight: 'Flight',
    yourData: 'Your data',
    howCanWeContact: 'How can we contact you?',
    almostDone: 'Almost done!',
    readAndAccept: 'Read and accept the terms to proceed',
    sendRequest: 'Send request',
    confirm: 'Confirm',
    
    // Flight details
    flightDetails: 'Flight details',
    flightDetailsWithNumber: 'Flight details (Flight {{number}})',
    flightDate: 'Flight date',
    airline: 'Airline',
    scheduledDeparture: 'Scheduled departure time',
    
    // Personal data
    personalData: 'Personal data',
    fullName: 'Full Name',
    email: 'Email',
    phone: 'Phone',
    yourPhone: 'Your phone number',
    problemDescription: 'Problem description',
    describeProblem: 'Briefly describe what happened (delay, cancellation, etc.)',
    
    // Consent
    consent: 'Consent',
    agreeToPrivacy: 'I consent to the processing of my personal data as described in the',
    privacyPolicy: 'Privacy Policy',
    agreeToTerms: 'I declare that I have read and accepted the terms and conditions of service - See',
    termsAndConditions: 'Terms and Conditions',
    
    // Buttons
    submit: 'Submit request',
    submitRequest: 'SUBMIT REQUEST!',
    requestFreeClaim: 'Request free assistance',
    readFAQ: 'Read FAQ',
    sendAnotherRequest: 'Send another request',
    
    // Success
    requestSent: 'Request Sent!',
    requestSentMessage: 'Thank you for contacting us. One of our lawyers will respond as soon as possible to evaluate your case.',
    
    // CTA
    ctaTitle: 'Ready to Claim Your Compensation?',
    ctaSubtitle: 'Don\'t let airlines ignore your rights. Contact us today for a free evaluation of your case.',
    
    // Footer
    footerTagline: 'Italian legal service assisting air passengers affected by delays or cancellations.',
    footerSlogan: 'Don\'t leave your refund on the ground.',
    quickLinks: 'Quick Links',
    contact: 'Contact Us',
    contactEmail: 'info@giustiziainvolo.it',
    fillForm: 'Fill in the form to be contacted',
    
    // FAQ
    faqTitle: 'Frequently Asked Questions',
    faqSubtitle: 'Answers to the most common questions about compensation for air travel disruptions.',
    
    // Request form specific
    requestTitle: 'Request for Assistance',
    requestSubtitle: 'Answer a few questions and submit your flight details. A real lawyer will evaluate your case.',
    insertDataContinue: 'Insert data and continue',
    completeRequiredFields: 'Complete required fields',
    someMissingInvalid: 'Some fields are missing or invalid.',
    consentRequired: 'Consent required',
    acceptPrivacyTerms: 'Accept Privacy and Terms to submit the request.',
    submitting: 'Submitting...',
    submitRequest: 'Submit request',
    requestSentThankYou: 'We will contact you within 24 hours.',
    sendFailed: 'Send failed',
    tryAgainLater: 'Try again later.',
    networkError: 'Network error',
    checkConnectionRetry: 'Check your connection and try again.',
    validTimeRequired: 'Enter a valid time',
    enter10DigitPhone: 'Enter a 10-digit number',
    yourFullName: 'Your full name',
    yourEmail: 'Your email',
    problemDescriptionPlaceholder: 'E.g. 4 hour delay on first flight, missed connection...',
    
    // Common
    loading: 'Loading...',
    noResults: 'No results',
    required: 'Required',
    optional: 'Optional',
    requiredField: 'Required field',
  }
} as const

export type TranslationKey = keyof typeof translations.it

export function getTranslation(lang: Language, key: TranslationKey, vars?: Record<string, string | number>): string {
  let text = translations[lang][key] || translations.it[key] || key
  
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      text = text.replace(`{{${k}}}`, String(v))
    })
  }
  
  return text
}
