export interface Airport {
  slug: string
  name: string
  code: string
  citta: string
  paese: string
  regione?: string
}

export const airports: Airport[] = [
  // Italia
  { slug: 'roma-fiumicino-fco', name: 'Aeroporto di Roma Fiumicino', code: 'FCO', citta: 'Roma', paese: 'Italia', regione: 'Lazio' },
  { slug: 'milano-malpensa-mxp', name: 'Aeroporto di Milano Malpensa', code: 'MXP', citta: 'Milano', paese: 'Italia', regione: 'Lombardia' },
  { slug: 'milano-bergamo-bgy', name: 'Aeroporto di Bergamo Orio al Serio', code: 'BGY', citta: 'Bergamo', paese: 'Italia', regione: 'Lombardia' },
  { slug: 'napoli-nap', name: 'Aeroporto di Napoli Capodichino', code: 'NAP', citta: 'Napoli', paese: 'Italia', regione: 'Campania' },
  { slug: 'catania-cta', name: 'Aeroporto di Catania Fontanarossa', code: 'CTA', citta: 'Catania', paese: 'Italia', regione: 'Sicilia' },
  { slug: 'bologna-blq', name: 'Aeroporto di Bologna Guglielmo Marconi', code: 'BLQ', citta: 'Bologna', paese: 'Italia', regione: 'Emilia-Romagna' },
  { slug: 'venezia-vce', name: 'Aeroporto di Venezia Marco Polo', code: 'VCE', citta: 'Venezia', paese: 'Italia', regione: 'Veneto' },
  { slug: 'palermo-pmo', name: 'Aeroporto di Palermo Falcone Borsellino', code: 'PMO', citta: 'Palermo', paese: 'Italia', regione: 'Sicilia' },
  { slug: 'bari-bri', name: 'Aeroporto di Bari Karol Wojtyla', code: 'BRI', citta: 'Bari', paese: 'Italia', regione: 'Puglia' },
  { slug: 'torino-trn', name: 'Aeroporto di Torino Caselle', code: 'TRN', citta: 'Torino', paese: 'Italia', regione: 'Piemonte' },
  { slug: 'pisa-psa', name: 'Aeroporto di Pisa Galileo Galilei', code: 'PSA', citta: 'Pisa', paese: 'Italia', regione: 'Toscana' },
  { slug: 'cagliari-cag', name: 'Aeroporto di Cagliari Elmas', code: 'CAG', citta: 'Cagliari', paese: 'Italia', regione: 'Sardegna' },
  { slug: 'firenze-flr', name: 'Aeroporto di Firenze Peretola', code: 'FLR', citta: 'Firenze', paese: 'Italia', regione: 'Toscana' },
  { slug: 'brindisi-bds', name: 'Aeroporto di Brindisi Papola Casale', code: 'BDS', citta: 'Brindisi', paese: 'Italia', regione: 'Puglia' },
  { slug: 'olbia-olb', name: 'Aeroporto di Olbia Costa Smeralda', code: 'OLB', citta: 'Olbia', paese: 'Italia', regione: 'Sardegna' },
  { slug: 'verona-vro', name: 'Aeroporto di Verona Villafranca', code: 'VRN', citta: 'Verona', paese: 'Italia', regione: 'Veneto' },
  { slug: 'genova-goa', name: 'Aeroporto di Genova Cristoforo Colombo', code: 'GOA', citta: 'Genova', paese: 'Italia', regione: 'Liguria' },
  // Europa
  { slug: 'parigi-cdg', name: 'Aeroporto di Parigi Charles de Gaulle', code: 'CDG', citta: 'Parigi', paese: 'Francia' },
  { slug: 'londra-heathrow-lhr', name: 'Aeroporto di Londra Heathrow', code: 'LHR', citta: 'Londra', paese: 'Regno Unito' },
  { slug: 'londra-gatwick-lgw', name: 'Aeroporto di Londra Gatwick', code: 'LGW', citta: 'Londra', paese: 'Regno Unito' },
  { slug: 'amsterdam-ams', name: 'Aeroporto di Amsterdam Schiphol', code: 'AMS', citta: 'Amsterdam', paese: 'Paesi Bassi' },
  { slug: 'francoforte-fra', name: 'Aeroporto di Francoforte', code: 'FRA', citta: 'Francoforte', paese: 'Germania' },
  { slug: 'madrid-mad', name: 'Aeroporto di Madrid Barajas', code: 'MAD', citta: 'Madrid', paese: 'Spagna' },
  { slug: 'barcellona-bcn', name: 'Aeroporto di Barcellona El Prat', code: 'BCN', citta: 'Barcellona', paese: 'Spagna' },
  { slug: 'monaco-muc', name: 'Aeroporto di Monaco di Baviera', code: 'MUC', citta: 'Monaco', paese: 'Germania' },
  { slug: 'zurigo-zrh', name: 'Aeroporto di Zurigo', code: 'ZRH', citta: 'Zurigo', paese: 'Svizzera' },
  { slug: 'lisbona-lis', name: 'Aeroporto di Lisbona Humberto Delgado', code: 'LIS', citta: 'Lisbona', paese: 'Portogallo' },
  { slug: 'dublino-dub', name: 'Aeroporto di Dublino', code: 'DUB', citta: 'Dublino', paese: 'Irlanda' },
  { slug: 'vienna-vie', name: 'Aeroporto di Vienna Schwechat', code: 'VIE', citta: 'Vienna', paese: 'Austria' },
  { slug: 'bruxelles-bru', name: 'Aeroporto di Bruxelles Zaventem', code: 'BRU', citta: 'Bruxelles', paese: 'Belgio' },
  { slug: 'copenaghen-cph', name: 'Aeroporto di Copenaghen Kastrup', code: 'CPH', citta: 'Copenaghen', paese: 'Danimarca' },
  { slug: 'stoccolma-arn', name: 'Aeroporto di Stoccolma Arlanda', code: 'ARN', citta: 'Stoccolma', paese: 'Svezia' },
  { slug: 'atene-ath', name: 'Aeroporto di Atene Eleftherios Venizelos', code: 'ATH', citta: 'Atene', paese: 'Grecia' },
]

export function getAirport(slug: string): Airport | undefined {
  return airports.find((a) => a.slug === slug)
}
