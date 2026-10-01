'use client'
import { useEffect, useRef, useState } from 'react'

// View-only document renderer for the public Resources page.
// PDFs are drawn page by page onto <canvas> with pdf.js and no text layer, so
// there is nothing to select or copy and no browser PDF toolbar to save from.
// Images are drawn onto a canvas too. The bytes are fetched with a header the
// backend requires, so the /view URL can't be opened or saved directly.
// This deters casual copying/saving; it can't stop screenshots.

const MAX_PIXEL_RATIO = 2

async function fetchFile(url) {
  const res = await fetch(url, { headers: { 'X-Resource-Viewer': '1' }, cache: 'no-store' })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.message || 'This document could not be loaded')
  }
  return res
}

function PdfPages({ url, onError }) {
  const containerRef = useRef(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    let pdf = null

    ;(async () => {
      try {
        const pdfjs = await import('pdfjs-dist')
        pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

        const data = await (await fetchFile(url)).arrayBuffer()
        if (cancelled) return
        pdf = await pdfjs.getDocument({ data, isEvalSupported: false }).promise

        const container = containerRef.current
        const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO)
        const targetWidth = Math.min(container.clientWidth - 32, 1000)

        for (let n = 1; n <= pdf.numPages; n++) {
          if (cancelled) return
          const page = await pdf.getPage(n)
          const base = page.getViewport({ scale: 1 })
          const viewport = page.getViewport({ scale: (targetWidth / base.width) * ratio })

          const canvas = document.createElement('canvas')
          canvas.width = viewport.width
          canvas.height = viewport.height
          canvas.style.width = `${viewport.width / ratio}px`
          canvas.style.maxWidth = '100%'
          canvas.className = 'mx-auto mb-4 block bg-white shadow-sm'
          container.appendChild(canvas)

          await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise
          if (n === 1 && !cancelled) setLoading(false)
        }
      } catch (err) {
        if (!cancelled) onError(err.message)
      }
    })()

    return () => {
      cancelled = true
      pdf?.destroy()
    }
  }, [url, onError])

  return (
    <div className="p-4">
      {loading && <Spinner />}
      <div ref={containerRef} />
    </div>
  )
}

function ImageCanvas({ url, onError }) {
  const canvasRef = useRef(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const bitmap = await createImageBitmap(await (await fetchFile(url)).blob())
        if (cancelled) return
        const canvas = canvasRef.current
        canvas.width = bitmap.width
        canvas.height = bitmap.height
        canvas.getContext('2d').drawImage(bitmap, 0, 0)
        bitmap.close()
        setLoading(false)
      } catch (err) {
        if (!cancelled) onError(err.message)
      }
    })()
    return () => { cancelled = true }
  }, [url, onError])

  return (
    <div className="flex h-full min-h-[70vh] items-center justify-center p-6">
      {loading && <Spinner />}
      <canvas ref={canvasRef} className={`max-h-full max-w-full rounded-[8px] ${loading ? 'hidden' : ''}`} />
    </div>
  )
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="animate-spin h-8 w-8 rounded-full border-4 border-[#236331] border-t-transparent" />
    </div>
  )
}

const BLOCKED_KEYS = new Set(['s', 'p', 'c', 'a', 'x'])

export function ProtectedDocumentViewer({ url, kind, onError }) {
  // Block save / print / copy / select-all shortcuts while the viewer is open
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && BLOCKED_KEYS.has(e.key.toLowerCase())) e.preventDefault()
    }
    const block = (e) => e.preventDefault()
    window.addEventListener('keydown', onKeyDown, true)
    document.addEventListener('copy', block, true)
    document.addEventListener('cut', block, true)
    return () => {
      window.removeEventListener('keydown', onKeyDown, true)
      document.removeEventListener('copy', block, true)
      document.removeEventListener('cut', block, true)
    }
  }, [])

  const block = (e) => e.preventDefault()

  return (
    <div
      className="h-full select-none"
      style={{ WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}
      onContextMenu={block}
      onDragStart={block}
    >
      {/* Printing the page prints nothing */}
      <style>{'@media print { body { display: none !important; } }'}</style>
      {kind === 'pdf'
        ? <PdfPages url={url} onError={onError} />
        : <ImageCanvas url={url} onError={onError} />}
    </div>
  )
}
