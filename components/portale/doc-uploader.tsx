'use client'

// Caricamento dei documenti di una pratica. Un file alla volta verso
// /api/agenzie/documenti, con l'esito mostrato riga per riga.

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Paperclip, X } from 'lucide-react'
import { ALLOWED_UPLOAD_TYPES, MAX_UPLOAD_BYTES } from '@/lib/portale/constants'
import { formatBytes } from './format'

export type PickedFile = { file: File; error?: string }

const ACCEPT = Object.keys(ALLOWED_UPLOAD_TYPES).join(',')

export function checkFile(file: File): string | undefined {
  if (!ALLOWED_UPLOAD_TYPES[file.type]) return 'Formato non accettato'
  if (file.size > MAX_UPLOAD_BYTES) return 'Supera i 4 MB'
  if (file.size === 0) return 'File vuoto'
  return undefined
}

export async function uploadDocument(caseId: string, file: File): Promise<{ ok: boolean; message?: string }> {
  const fd = new FormData()
  fd.set('case_id', caseId)
  fd.set('file', file)
  try {
    const res = await fetch('/api/agenzie/documenti', { method: 'POST', body: fd })
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string }
    return { ok: Boolean(data.ok), message: data.message }
  } catch {
    return { ok: false, message: 'Connessione interrotta.' }
  }
}

/** Selettore di file. Lo stato lo tiene chi lo usa. */
export function FilePicker({
  files,
  onChange,
  disabled,
}: {
  files: PickedFile[]
  onChange: (files: PickedFile[]) => void
  disabled?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPT}
        className="sr-only"
        aria-label="Scegli i documenti da allegare"
        disabled={disabled}
        onChange={(e) => {
          const picked = Array.from(e.target.files ?? []).map((file) => ({ file, error: checkFile(file) }))
          onChange([...files, ...picked])
          e.target.value = ''
        }}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-2 rounded-xl border-[1.5px] border-dashed border-[#B7C4D2] bg-white px-4 py-3 text-[14.5px] font-semibold text-[#13283D] transition-colors hover:border-[#072534] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#072534] disabled:opacity-60"
      >
        <Paperclip className="h-4 w-4" />
        Allega documenti
      </button>
      <p className="mt-1.5 text-[13px] text-[#5A7088]">PDF, JPG, PNG, WEBP o HEIC. Massimo 4 MB per file.</p>
      {files.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {files.map((f, i) => (
            <li
              key={`${f.file.name}-${i}`}
              className="flex items-center gap-3 rounded-xl border border-[#072534]/10 bg-white px-3 py-2.5 text-[14px]"
            >
              <FileText className="h-4 w-4 flex-shrink-0 text-[#5A7088]" />
              <span className="min-w-0 flex-1 truncate font-medium text-[#13283D]">{f.file.name}</span>
              <span className={f.error ? 'flex-shrink-0 font-semibold text-red-600' : 'flex-shrink-0 text-[#5A7088]'}>
                {f.error ?? formatBytes(f.file.size)}
              </span>
              <button
                type="button"
                disabled={disabled}
                aria-label={`Togli ${f.file.name}`}
                onClick={() => onChange(files.filter((_, j) => j !== i))}
                className="flex-shrink-0 rounded-md p-1 text-[#5A7088] hover:bg-[#EEF2F6] hover:text-[#072534] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#072534]"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

/** Aggiunta di documenti a una pratica già aperta. */
export function AddDocuments({ caseId }: { caseId: string }) {
  const router = useRouter()
  const [files, setFiles] = useState<PickedFile[]>([])
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)
  const valid = files.filter((f) => !f.error)

  const send = async () => {
    setBusy(true)
    setMessage(null)
    const failed: PickedFile[] = []
    for (const f of valid) {
      const res = await uploadDocument(caseId, f.file)
      if (!res.ok) failed.push({ file: f.file, error: res.message ?? 'Non caricato' })
    }
    setBusy(false)
    setFiles(failed)
    const sent = valid.length - failed.length
    setMessage(
      failed.length === 0
        ? { ok: true, text: sent === 1 ? 'Documento caricato.' : `${sent} documenti caricati.` }
        : { ok: false, text: 'Alcuni documenti non sono stati caricati. Riprova.' },
    )
    router.refresh()
  }

  return (
    <div>
      <FilePicker files={files} onChange={setFiles} disabled={busy} />
      {valid.length > 0 ? (
        <button
          type="button"
          onClick={send}
          disabled={busy}
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#072534] px-5 py-3 text-[15px] font-bold text-white transition-colors hover:bg-[#0E3A52] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#072534] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
        >
          {busy ? 'Caricamento…' : valid.length === 1 ? 'Carica il documento' : `Carica ${valid.length} documenti`}
        </button>
      ) : null}
      {message ? (
        <p
          role={message.ok ? 'status' : 'alert'}
          className={`mt-3 rounded-xl px-4 py-3 text-[14px] font-medium ${message.ok ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`}
        >
          {message.text}
        </p>
      ) : null}
    </div>
  )
}
