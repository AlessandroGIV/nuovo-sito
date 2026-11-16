/**
 * Aeroporti usati dalle pagine tratta (/voli/...).
 * Le coordinate servono solo al calcolo della distanza ortodromica (art. 7 par. 4 Reg. CE 261/2004).
 * `ue` indica se l'aeroporto si trova nel territorio di uno Stato membro dell'Unione.
 */
export interface AeroportoTratta {
  iata: string
  slug: string
  /** Nome breve usato in titoli e testi, es. "Milano Malpensa" */
  nome: string
  citta: string
  paese: string
  ue: boolean
  lat: number
  lon: number
}

export const aeroportiTratta: AeroportoTratta[] = [
  // Italia
  { iata: 'BRI', slug: 'bari', nome: 'Bari', citta: 'Bari', paese: 'Italia', ue: true, lat: 41.1389, lon: 16.7606 },
  { iata: 'FCO', slug: 'roma-fiumicino', nome: 'Roma Fiumicino', citta: 'Roma', paese: 'Italia', ue: true, lat: 41.8003, lon: 12.2389 },
  { iata: 'MXP', slug: 'milano-malpensa', nome: 'Milano Malpensa', citta: 'Milano', paese: 'Italia', ue: true, lat: 45.6306, lon: 8.7281 },
  { iata: 'BGY', slug: 'milano-bergamo', nome: 'Milano Bergamo', citta: 'Bergamo', paese: 'Italia', ue: true, lat: 45.6739, lon: 9.7042 },
  { iata: 'LIN', slug: 'milano-linate', nome: 'Milano Linate', citta: 'Milano', paese: 'Italia', ue: true, lat: 45.4451, lon: 9.2767 },
  { iata: 'NAP', slug: 'napoli', nome: 'Napoli', citta: 'Napoli', paese: 'Italia', ue: true, lat: 40.886, lon: 14.2908 },
  { iata: 'CTA', slug: 'catania', nome: 'Catania', citta: 'Catania', paese: 'Italia', ue: true, lat: 37.4668, lon: 15.0664 },
  { iata: 'PMO', slug: 'palermo', nome: 'Palermo', citta: 'Palermo', paese: 'Italia', ue: true, lat: 38.176, lon: 13.091 },
  { iata: 'BLQ', slug: 'bologna', nome: 'Bologna', citta: 'Bologna', paese: 'Italia', ue: true, lat: 44.5354, lon: 11.2887 },
  { iata: 'VCE', slug: 'venezia', nome: 'Venezia', citta: 'Venezia', paese: 'Italia', ue: true, lat: 45.5053, lon: 12.3519 },
  { iata: 'TRN', slug: 'torino', nome: 'Torino', citta: 'Torino', paese: 'Italia', ue: true, lat: 45.2008, lon: 7.6497 },
  { iata: 'PSA', slug: 'pisa', nome: 'Pisa', citta: 'Pisa', paese: 'Italia', ue: true, lat: 43.6839, lon: 10.3927 },
  { iata: 'VRN', slug: 'verona', nome: 'Verona', citta: 'Verona', paese: 'Italia', ue: true, lat: 45.3957, lon: 10.8885 },
  { iata: 'GOA', slug: 'genova', nome: 'Genova', citta: 'Genova', paese: 'Italia', ue: true, lat: 44.4133, lon: 8.8375 },
  { iata: 'BDS', slug: 'brindisi', nome: 'Brindisi', citta: 'Brindisi', paese: 'Italia', ue: true, lat: 40.6576, lon: 17.947 },
  { iata: 'CAG', slug: 'cagliari', nome: 'Cagliari', citta: 'Cagliari', paese: 'Italia', ue: true, lat: 39.2515, lon: 9.0543 },
  { iata: 'OLB', slug: 'olbia', nome: 'Olbia', citta: 'Olbia', paese: 'Italia', ue: true, lat: 40.8987, lon: 9.5176 },
  { iata: 'SUF', slug: 'lamezia-terme', nome: 'Lamezia Terme', citta: 'Lamezia Terme', paese: 'Italia', ue: true, lat: 38.9054, lon: 16.2423 },
  // Spagna e Portogallo
  { iata: 'AGP', slug: 'malaga', nome: 'Malaga', citta: 'Malaga', paese: 'Spagna', ue: true, lat: 36.6749, lon: -4.4991 },
  { iata: 'MAD', slug: 'madrid', nome: 'Madrid', citta: 'Madrid', paese: 'Spagna', ue: true, lat: 40.4719, lon: -3.5626 },
  { iata: 'BCN', slug: 'barcellona', nome: 'Barcellona', citta: 'Barcellona', paese: 'Spagna', ue: true, lat: 41.2971, lon: 2.0785 },
  { iata: 'VLC', slug: 'valencia', nome: 'Valencia', citta: 'Valencia', paese: 'Spagna', ue: true, lat: 39.4893, lon: -0.4816 },
  { iata: 'SVQ', slug: 'siviglia', nome: 'Siviglia', citta: 'Siviglia', paese: 'Spagna', ue: true, lat: 37.418, lon: -5.8931 },
  { iata: 'BIO', slug: 'bilbao', nome: 'Bilbao', citta: 'Bilbao', paese: 'Spagna', ue: true, lat: 43.3011, lon: -2.9106 },
  { iata: 'TFS', slug: 'tenerife-sud', nome: 'Tenerife Sud', citta: 'Tenerife', paese: 'Spagna', ue: true, lat: 28.0445, lon: -16.5725 },
  { iata: 'LPA', slug: 'gran-canaria', nome: 'Gran Canaria', citta: 'Las Palmas', paese: 'Spagna', ue: true, lat: 27.9319, lon: -15.3866 },
  { iata: 'LIS', slug: 'lisbona', nome: 'Lisbona', citta: 'Lisbona', paese: 'Portogallo', ue: true, lat: 38.7813, lon: -9.1359 },
  { iata: 'OPO', slug: 'porto', nome: 'Porto', citta: 'Porto', paese: 'Portogallo', ue: true, lat: 41.2481, lon: -8.6814 },
  // Regno Unito e Irlanda
  { iata: 'STN', slug: 'londra-stansted', nome: 'Londra Stansted', citta: 'Londra', paese: 'Regno Unito', ue: false, lat: 51.885, lon: 0.235 },
  { iata: 'LGW', slug: 'londra-gatwick', nome: 'Londra Gatwick', citta: 'Londra', paese: 'Regno Unito', ue: false, lat: 51.1481, lon: -0.1903 },
  { iata: 'LTN', slug: 'londra-luton', nome: 'Londra Luton', citta: 'Londra', paese: 'Regno Unito', ue: false, lat: 51.8747, lon: -0.3683 },
  { iata: 'LHR', slug: 'londra-heathrow', nome: 'Londra Heathrow', citta: 'Londra', paese: 'Regno Unito', ue: false, lat: 51.4706, lon: -0.4619 },
  { iata: 'DUB', slug: 'dublino', nome: 'Dublino', citta: 'Dublino', paese: 'Irlanda', ue: true, lat: 53.4213, lon: -6.2701 },
  // Francia, Benelux, Germania
  { iata: 'BVA', slug: 'parigi-beauvais', nome: 'Parigi Beauvais', citta: 'Parigi', paese: 'Francia', ue: true, lat: 49.4544, lon: 2.1128 },
  { iata: 'ORY', slug: 'parigi-orly', nome: 'Parigi Orly', citta: 'Parigi', paese: 'Francia', ue: true, lat: 48.7233, lon: 2.3794 },
  { iata: 'CDG', slug: 'parigi-charles-de-gaulle', nome: 'Parigi Charles de Gaulle', citta: 'Parigi', paese: 'Francia', ue: true, lat: 49.0097, lon: 2.5479 },
  { iata: 'NCE', slug: 'nizza', nome: 'Nizza', citta: 'Nizza', paese: 'Francia', ue: true, lat: 43.6584, lon: 7.2159 },
  { iata: 'LYS', slug: 'lione', nome: 'Lione', citta: 'Lione', paese: 'Francia', ue: true, lat: 45.7256, lon: 5.0811 },
  { iata: 'CRL', slug: 'bruxelles-charleroi', nome: 'Bruxelles Charleroi', citta: 'Bruxelles', paese: 'Belgio', ue: true, lat: 50.4592, lon: 4.4538 },
  { iata: 'BRU', slug: 'bruxelles', nome: 'Bruxelles', citta: 'Bruxelles', paese: 'Belgio', ue: true, lat: 50.9014, lon: 4.4844 },
  { iata: 'AMS', slug: 'amsterdam', nome: 'Amsterdam', citta: 'Amsterdam', paese: 'Paesi Bassi', ue: true, lat: 52.3086, lon: 4.7639 },
  { iata: 'BER', slug: 'berlino', nome: 'Berlino', citta: 'Berlino', paese: 'Germania', ue: true, lat: 52.3667, lon: 13.5033 },
  { iata: 'FRA', slug: 'francoforte', nome: 'Francoforte', citta: 'Francoforte', paese: 'Germania', ue: true, lat: 50.0333, lon: 8.5706 },
  { iata: 'MUC', slug: 'monaco-di-baviera', nome: 'Monaco di Baviera', citta: 'Monaco di Baviera', paese: 'Germania', ue: true, lat: 48.3538, lon: 11.7861 },
  // Europa centrale e orientale, Mediterraneo
  { iata: 'VIE', slug: 'vienna', nome: 'Vienna', citta: 'Vienna', paese: 'Austria', ue: true, lat: 48.1103, lon: 16.5697 },
  { iata: 'BUD', slug: 'budapest', nome: 'Budapest', citta: 'Budapest', paese: 'Ungheria', ue: true, lat: 47.4369, lon: 19.2556 },
  { iata: 'PRG', slug: 'praga', nome: 'Praga', citta: 'Praga', paese: 'Repubblica Ceca', ue: true, lat: 50.1008, lon: 14.26 },
  { iata: 'KRK', slug: 'cracovia', nome: 'Cracovia', citta: 'Cracovia', paese: 'Polonia', ue: true, lat: 50.0777, lon: 19.7848 },
  { iata: 'OTP', slug: 'bucarest', nome: 'Bucarest', citta: 'Bucarest', paese: 'Romania', ue: true, lat: 44.5711, lon: 26.085 },
  { iata: 'SOF', slug: 'sofia', nome: 'Sofia', citta: 'Sofia', paese: 'Bulgaria', ue: true, lat: 42.6952, lon: 23.4062 },
  { iata: 'MLA', slug: 'malta', nome: 'Malta', citta: 'Malta', paese: 'Malta', ue: true, lat: 35.8575, lon: 14.4775 },
  { iata: 'ATH', slug: 'atene', nome: 'Atene', citta: 'Atene', paese: 'Grecia', ue: true, lat: 37.9364, lon: 23.9445 },
  { iata: 'TIA', slug: 'tirana', nome: 'Tirana', citta: 'Tirana', paese: 'Albania', ue: false, lat: 41.4147, lon: 19.7206 },
]

const perIata = new Map(aeroportiTratta.map((a) => [a.iata, a]))

export function aeroporto(iata: string): AeroportoTratta {
  const a = perIata.get(iata)
  if (!a) throw new Error(`[seo] Aeroporto ${iata} non presente in lib/seo/aeroporti.ts`)
  return a
}

/** Distanza ortodromica in km (formula dell'emisenoverso, raggio terrestre medio 6.371 km). */
export function distanzaKm(da: AeroportoTratta, a: AeroportoTratta): number {
  const rad = (g: number) => (g * Math.PI) / 180
  const dLat = rad(a.lat - da.lat)
  const dLon = rad(a.lon - da.lon)
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(da.lat)) * Math.cos(rad(a.lat)) * Math.sin(dLon / 2) ** 2
  return 2 * 6371 * Math.asin(Math.sqrt(h))
}
