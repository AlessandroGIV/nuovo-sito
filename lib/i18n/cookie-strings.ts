export const cookieStrings = {
  it: {
    banner: {
      title: "Questo sito utilizza i cookie",
      description:
        "Utilizziamo cookie tecnici (necessari al funzionamento) e, previo consenso, cookie di statistica e marketing. Puoi accettarli tutti, rifiutarli o personalizzare le tue preferenze.",
      linkPolicy: "Informativa cookie",
      linkPrivacy: "Privacy Policy",
      acceptAll: "Accetta tutto",
      rejectAll: "Rifiuta tutto",
      customize: "Personalizza",
      close: "Chiudi senza accettare",
    },
    modal: {
      title: "Preferenze cookie",
      description:
        "Scegli quali categorie di cookie vuoi attivare. Puoi modificare questa scelta in qualsiasi momento.",
      linkPolicy: "Elenco completo dei cookie",
      savePreferences: "Salva preferenze",
      rejectAll: "Rifiuta tutto",
      acceptAll: "Accetta tutto",
      categories: {
        necessary: {
          name: "Necessari",
          description:
            "Garantiscono il funzionamento del sito e la memorizzazione delle tue preferenze (lingua, scelte cookie). Non richiedono consenso e non possono essere disattivati.",
        },
        analytics: {
          name: "Statistica",
          description:
            "Ci permettono di analizzare come gli utenti utilizzano il sito, in forma aggregata e anonima. Utilizziamo Google Analytics 4.",
        },
        marketing: {
          name: "Marketing",
          description:
            "Ci permettono di misurare l'efficacia delle campagne pubblicitarie e di mostrare annunci pertinenti. Utilizziamo Google Ads.",
        },
      },
      alwaysOn: "Sempre attivi",
    },
    footer: {
      manage: "Gestisci cookie",
    },
  },
  en: {
    banner: {
      title: "This site uses cookies",
      description:
        "We use technical cookies (necessary for operation) and, with your consent, analytics and marketing cookies. You can accept all, reject all, or customize your preferences.",
      linkPolicy: "Cookie policy",
      linkPrivacy: "Privacy Policy",
      acceptAll: "Accept all",
      rejectAll: "Reject all",
      customize: "Customize",
      close: "Close without accepting",
    },
    modal: {
      title: "Cookie preferences",
      description:
        "Choose which cookie categories you want to enable. You can change this choice at any time.",
      linkPolicy: "Full list of cookies",
      savePreferences: "Save preferences",
      rejectAll: "Reject all",
      acceptAll: "Accept all",
      categories: {
        necessary: {
          name: "Necessary",
          description:
            "Enable core site functionality and store your preferences (language, cookie choices). They do not require consent and cannot be disabled.",
        },
        analytics: {
          name: "Analytics",
          description:
            "Allow us to analyse how visitors use the site in an aggregated, anonymous way. We use Google Analytics 4.",
        },
        marketing: {
          name: "Marketing",
          description:
            "Allow us to measure ad campaign effectiveness and show relevant ads. We use Google Ads.",
        },
      },
      alwaysOn: "Always on",
    },
    footer: {
      manage: "Manage cookies",
    },
  },
} as const;

export type CookieLang = keyof typeof cookieStrings;
