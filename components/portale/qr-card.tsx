'use client'

// QR del link personale dell'agenzia, con download per la stampa.

import { Download } from 'lucide-react'
import { qrPath } from '@/lib/portale/qr'

const btn =
  'inline-flex items-center gap-1.5 rounded-lg border-[1.5px] border-[#DCE3EB] bg-white px-3 py-2 text-[13.5px] font-semibold text-[#13283D] transition-colors hover:border-[#072534] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#072534]'

function save(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function QrCard({ rows, filename }: { rows: string[]; filename: string }) {
  const { d, size } = qrPath(rows)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#fff"/><path d="${d}" fill="#072534"/></svg>`

  const downloadPng = () => {
    // 1200 px di lato: nitido in stampa fino al formato A5.
    const margin = 4
    const scale = Math.floor(1200 / (rows.length + margin * 2))
    const px = (rows.length + margin * 2) * scale
    const canvas = document.createElement('canvas')
    canvas.width = px
    canvas.height = px
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, px, px)
    ctx.fillStyle = '#072534'
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        if (row[x] === '1') ctx.fillRect((x + margin) * scale, (y + margin) * scale, scale, scale)
      }
    })
    canvas.toBlob((blob) => blob && save(blob, `${filename}.png`), 'image/png')
  }

  return (
    <div>
      <div
        role="img"
        aria-label="QR del link personale dell’agenzia"
        className="w-full max-w-[220px] overflow-hidden rounded-xl border border-[#072534]/10"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className={btn} onClick={downloadPng}>
          <Download className="h-4 w-4" />
          Scarica PNG
        </button>
        <button
          type="button"
          className={btn}
          onClick={() => save(new Blob([svg], { type: 'image/svg+xml' }), `${filename}.svg`)}
        >
          <Download className="h-4 w-4" />
          Scarica SVG
        </button>
      </div>
    </div>
  )
}
