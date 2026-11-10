// Generatore di QR Code senza dipendenze.
// Modalità byte, correzione d'errore M, versioni da 1 a 9 (fino a 180 byte),
// più che sufficienti per il link personale di un'agenzia.
// File puro, usabile sia dal server sia dal client.

type Matrix = boolean[][]

// Per ogni versione: codeword di correzione per blocco e gruppi [numero blocchi, codeword dati].
const EC_M: Record<number, { ec: number; groups: [number, number][] }> = {
  1: { ec: 10, groups: [[1, 16]] },
  2: { ec: 16, groups: [[1, 28]] },
  3: { ec: 26, groups: [[1, 44]] },
  4: { ec: 18, groups: [[2, 32]] },
  5: { ec: 24, groups: [[2, 43]] },
  6: { ec: 16, groups: [[4, 27]] },
  7: { ec: 18, groups: [[4, 31]] },
  8: { ec: 22, groups: [[2, 38], [2, 39]] },
  9: { ec: 22, groups: [[3, 36], [2, 37]] },
}

const ALIGNMENT: Record<number, number[]> = {
  1: [],
  2: [6, 18],
  3: [6, 22],
  4: [6, 26],
  5: [6, 30],
  6: [6, 34],
  7: [6, 22, 38],
  8: [6, 24, 42],
  9: [6, 26, 46],
}

// ── Aritmetica su GF(256), polinomio 0x11D ──────────────────────────────────

const EXP = new Uint8Array(512)
const LOG = new Uint8Array(256)
{
  let x = 1
  for (let i = 0; i < 255; i++) {
    EXP[i] = x
    LOG[x] = i
    x <<= 1
    if (x & 0x100) x ^= 0x11d
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255]
}

function gfMul(a: number, b: number): number {
  return a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]]
}

function rsGenerator(degree: number): number[] {
  let poly = [1]
  for (let i = 0; i < degree; i++) {
    const next = new Array<number>(poly.length + 1).fill(0)
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j]
      next[j + 1] ^= gfMul(poly[j], EXP[i])
    }
    poly = next
  }
  return poly
}

function rsRemainder(data: number[], generator: number[]): number[] {
  const degree = generator.length - 1
  const rem = new Array<number>(degree).fill(0)
  for (const byte of data) {
    const factor = byte ^ (rem.shift() as number)
    rem.push(0)
    for (let i = 0; i < degree; i++) rem[i] ^= gfMul(generator[i + 1], factor)
  }
  return rem
}

// ── Codifica ────────────────────────────────────────────────────────────────

function dataCapacity(version: number): number {
  return EC_M[version].groups.reduce((sum, [count, size]) => sum + count * size, 0)
}

function pickVersion(byteLength: number): number {
  for (let v = 1; v <= 9; v++) {
    // 4 bit di modalità + 8 bit di lunghezza
    if (byteLength + 2 <= dataCapacity(v)) return v
  }
  throw new Error('Testo troppo lungo per il QR.')
}

function buildCodewords(bytes: Uint8Array, version: number): number[] {
  const capacity = dataCapacity(version)
  const bits: number[] = []
  const push = (value: number, length: number) => {
    for (let i = length - 1; i >= 0; i--) bits.push((value >>> i) & 1)
  }
  push(0b0100, 4)
  push(bytes.length, 8)
  for (const b of bytes) push(b, 8)
  const terminator = Math.min(4, capacity * 8 - bits.length)
  push(0, terminator)
  while (bits.length % 8 !== 0) bits.push(0)

  const data: number[] = []
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0
    for (let j = 0; j < 8; j++) byte = (byte << 1) | bits[i + j]
    data.push(byte)
  }
  for (let pad = 0xec; data.length < capacity; pad ^= 0xec ^ 0x11) data.push(pad)

  // Divisione in blocchi e correzione d'errore
  const { ec, groups } = EC_M[version]
  const generator = rsGenerator(ec)
  const dataBlocks: number[][] = []
  const ecBlocks: number[][] = []
  let offset = 0
  for (const [count, size] of groups) {
    for (let i = 0; i < count; i++) {
      const block = data.slice(offset, offset + size)
      offset += size
      dataBlocks.push(block)
      ecBlocks.push(rsRemainder(block, generator))
    }
  }

  // Interlacciamento
  const out: number[] = []
  const longest = Math.max(...dataBlocks.map((b) => b.length))
  for (let i = 0; i < longest; i++) {
    for (const block of dataBlocks) if (i < block.length) out.push(block[i])
  }
  for (let i = 0; i < ec; i++) {
    for (const block of ecBlocks) out.push(block[i])
  }
  return out
}

// ── Matrice ─────────────────────────────────────────────────────────────────

const MASKS: ((x: number, y: number) => boolean)[] = [
  (x, y) => (x + y) % 2 === 0,
  (_x, y) => y % 2 === 0,
  (x) => x % 3 === 0,
  (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
  (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
  (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
]

function bit(value: number, i: number): boolean {
  return ((value >>> i) & 1) !== 0
}

function penalty(m: Matrix): number {
  const size = m.length
  let score = 0

  // Sequenze di 5 o più moduli uguali, in riga e in colonna
  for (let pass = 0; pass < 2; pass++) {
    for (let a = 0; a < size; a++) {
      let run = 1
      for (let b = 1; b < size; b++) {
        const cur = pass === 0 ? m[a][b] : m[b][a]
        const prev = pass === 0 ? m[a][b - 1] : m[b - 1][a]
        if (cur === prev) {
          run++
          if (run === 5) score += 3
          else if (run > 5) score++
        } else {
          run = 1
        }
      }
    }
  }

  // Blocchi 2x2 dello stesso colore
  for (let y = 0; y < size - 1; y++) {
    for (let x = 0; x < size - 1; x++) {
      const c = m[y][x]
      if (c === m[y][x + 1] && c === m[y + 1][x] && c === m[y + 1][x + 1]) score += 3
    }
  }

  // Motivi simili ai finder (1:1:3:1:1 con quattro moduli chiari accanto)
  const A = [true, false, true, true, true, false, true, false, false, false, false]
  const B = [...A].reverse()
  for (let pass = 0; pass < 2; pass++) {
    for (let a = 0; a < size; a++) {
      for (let b = 0; b + 11 <= size; b++) {
        let matchA = true
        let matchB = true
        for (let k = 0; k < 11 && (matchA || matchB); k++) {
          const cur = pass === 0 ? m[a][b + k] : m[b + k][a]
          if (cur !== A[k]) matchA = false
          if (cur !== B[k]) matchB = false
        }
        if (matchA) score += 40
        if (matchB) score += 40
      }
    }
  }

  // Equilibrio tra moduli scuri e chiari
  let dark = 0
  for (const row of m) for (const cell of row) if (cell) dark++
  const percent = (dark * 100) / (size * size)
  score += Math.floor(Math.abs(percent - 50) / 5) * 10

  return score
}

/** Matrice del QR. true = modulo scuro. Indici [riga][colonna]. */
export function qrMatrix(text: string): Matrix {
  const bytes = new TextEncoder().encode(text)
  const version = pickVersion(bytes.length)
  const size = 17 + 4 * version
  const codewords = buildCodewords(bytes, version)

  const base: Matrix = Array.from({ length: size }, () => new Array<boolean>(size).fill(false))
  const fn: Matrix = Array.from({ length: size }, () => new Array<boolean>(size).fill(false))
  const setFn = (m: Matrix, x: number, y: number, dark: boolean) => {
    m[y][x] = dark
    fn[y][x] = true
  }

  // Timing
  for (let i = 0; i < size; i++) {
    setFn(base, 6, i, i % 2 === 0)
    setFn(base, i, 6, i % 2 === 0)
  }

  // Finder con separatori
  for (const [cx, cy] of [
    [3, 3],
    [size - 4, 3],
    [3, size - 4],
  ]) {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const x = cx + dx
        const y = cy + dy
        if (x < 0 || x >= size || y < 0 || y >= size) continue
        const dist = Math.max(Math.abs(dx), Math.abs(dy))
        setFn(base, x, y, dist !== 2 && dist !== 4)
      }
    }
  }

  // Allineamento
  const pos = ALIGNMENT[version]
  for (let i = 0; i < pos.length; i++) {
    for (let j = 0; j < pos.length; j++) {
      const last = pos.length - 1
      if ((i === 0 && j === 0) || (i === 0 && j === last) || (i === last && j === 0)) continue
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          setFn(base, pos[i] + dx, pos[j] + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1)
        }
      }
    }
  }

  const drawFormat = (m: Matrix, mask: number) => {
    // Livello M = 00
    const data = mask
    let rem = data
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537)
    const bits = ((data << 10) | rem) ^ 0x5412
    for (let i = 0; i <= 5; i++) setFn(m, 8, i, bit(bits, i))
    setFn(m, 8, 7, bit(bits, 6))
    setFn(m, 8, 8, bit(bits, 7))
    setFn(m, 7, 8, bit(bits, 8))
    for (let i = 9; i < 15; i++) setFn(m, 14 - i, 8, bit(bits, i))
    for (let i = 0; i < 8; i++) setFn(m, size - 1 - i, 8, bit(bits, i))
    for (let i = 8; i < 15; i++) setFn(m, 8, size - 15 + i, bit(bits, i))
    setFn(m, 8, size - 8, true)
  }

  // Riserva l'area del formato prima di posare i dati
  drawFormat(base, 0)

  // Informazione di versione (dalla 7 in su)
  if (version >= 7) {
    let rem = version
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25)
    const bits = (version << 12) | rem
    for (let i = 0; i < 18; i++) {
      const a = size - 11 + (i % 3)
      const b = Math.floor(i / 3)
      setFn(base, a, b, bit(bits, i))
      setFn(base, b, a, bit(bits, i))
    }
  }

  // Dati, a zig-zag dall'angolo in basso a destra
  let k = 0
  const totalBits = codewords.length * 8
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j
        const upward = ((right + 1) & 2) === 0
        const y = upward ? size - 1 - vert : vert
        if (!fn[y][x] && k < totalBits) {
          base[y][x] = bit(codewords[k >>> 3], 7 - (k & 7))
          k++
        }
      }
    }
  }

  // Sceglie la maschera con la penalità più bassa
  let best: Matrix | null = null
  let bestScore = Infinity
  for (let mask = 0; mask < 8; mask++) {
    const m = base.map((row) => row.slice())
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (!fn[y][x] && MASKS[mask](x, y)) m[y][x] = !m[y][x]
      }
    }
    drawFormat(m, mask)
    const score = penalty(m)
    if (score < bestScore) {
      bestScore = score
      best = m
    }
  }
  return best as Matrix
}

/** Il QR come righe di "1" e "0", comodo da passare a un componente client. */
export function qrRows(text: string): string[] {
  return qrMatrix(text).map((row) => row.map((c) => (c ? '1' : '0')).join(''))
}

/** Percorso SVG dei moduli scuri, con margine di 4 moduli. */
export function qrPath(rows: string[], margin = 4): { d: string; size: number } {
  let d = ''
  for (let y = 0; y < rows.length; y++) {
    let x = 0
    while (x < rows.length) {
      if (rows[y][x] === '1') {
        let w = 1
        while (x + w < rows.length && rows[y][x + w] === '1') w++
        d += `M${x + margin} ${y + margin}h${w}v1h-${w}z`
        x += w
      } else {
        x++
      }
    }
  }
  return { d, size: rows.length + margin * 2 }
}
