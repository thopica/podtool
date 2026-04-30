'use client'

import { useState } from 'react'
import { MOCKUP_VARIANTS } from '@/lib/mockups'
import { exportSingle, exportAllAsZip, ExportFrame } from '@/lib/canvasExport'

interface ExportPanelProps {
  activeVariantId: string
  graphicSrc: string | null
  transform: { x: number; y: number; width: number; height: number } | null
  blendMode: boolean
  canvasSize: number
}

export default function ExportPanel({
  activeVariantId,
  graphicSrc,
  transform,
  blendMode,
  canvasSize,
}: ExportPanelProps) {
  const [designName, setDesignName] = useState('')
  const [exporting, setExporting] = useState(false)
  const [allFormat, setAllFormat] = useState<'png' | 'jpg'>('png')

  const activeVariant = MOCKUP_VARIANTS.find((v) => v.id === activeVariantId)!
  const slug = designName.trim().toLowerCase().replace(/\s+/g, '-') || 'design'
  const previewName = `${slug}-${activeVariant.colorSlug}`

  const disabled = !graphicSrc || !transform

  function buildFrame(variantId: string): ExportFrame {
    const variant = MOCKUP_VARIANTS.find((v) => v.id === variantId)!
    return {
      mockupSrc: variant.filename,
      graphicSrc: graphicSrc!,
      x: transform!.x / canvasSize,
      y: transform!.y / canvasSize,
      width: transform!.width / canvasSize,
      height: transform!.height / canvasSize,
      blendMode: blendMode ? 'multiply' : 'source-over',
      opacity: 1,
    }
  }

  async function handleExportCurrent(format: 'png' | 'jpg') {
    if (disabled) return
    setExporting(true)
    try {
      await exportSingle(buildFrame(activeVariantId), previewName, format)
    } finally {
      setExporting(false)
    }
  }

  async function handleExportAll() {
    if (disabled) return
    setExporting(true)
    try {
      const frames = MOCKUP_VARIANTS.map((v) => ({
        frame: buildFrame(v.id),
        baseName: `${slug}-${v.colorSlug}`,
      }))
      await exportAllAsZip(frames, slug, allFormat)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="border-4 border-black bg-white font-mono" style={{ boxShadow: '4px 4px 0 #000' }}>
      <div className="border-b-4 border-black px-4 py-2 bg-black text-yellow-300 font-black uppercase tracking-tight text-sm">
        Export
      </div>
      <div className="p-4 flex flex-col gap-4">

        {/* Design name input */}
        <div>
          <label className="block font-black uppercase text-sm tracking-tight mb-1">
            Design Name
          </label>
          <input
            type="text"
            value={designName}
            onChange={(e) => setDesignName(e.target.value)}
            placeholder="e.g. hiking-shirt"
            className="border-4 border-black px-3 py-2 w-full font-mono text-sm outline-none focus:bg-yellow-50"
          />
        </div>

        {/* Filename preview */}
        <div>
          <div className="font-black uppercase text-xs tracking-tight text-gray-500 mb-1">
            Filename Preview
          </div>
          <div className="bg-yellow-300 border-4 border-black px-3 py-1 text-sm font-black tracking-tight">
            {previewName}.{allFormat}
          </div>
        </div>

        {/* Export current */}
        <div>
          <div className="font-black uppercase text-sm tracking-tight mb-2">Current Variant</div>
          <div className="flex gap-2">
            {(['png', 'jpg'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => handleExportCurrent(fmt)}
                disabled={disabled || exporting}
                className={`
                  border-4 border-black px-4 py-2 font-black uppercase text-sm tracking-tight
                  transition-colors cursor-pointer
                  ${disabled || exporting
                    ? 'opacity-40 cursor-not-allowed bg-white'
                    : 'bg-white hover:bg-yellow-50 active:bg-yellow-300'
                  }
                `}
                style={{ boxShadow: '2px 2px 0 #000' }}
              >
                ↓ {fmt.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Export all */}
        <div>
          <div className="font-black uppercase text-sm tracking-tight mb-2">All Variants</div>
          <div className="flex gap-2 mb-3">
            {(['png', 'jpg'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setAllFormat(fmt)}
                className={`
                  border-4 border-black px-4 py-1 font-black uppercase text-sm tracking-tight
                  cursor-pointer transition-colors
                  ${allFormat === fmt ? 'bg-yellow-300' : 'bg-white hover:bg-yellow-50'}
                `}
                style={{ boxShadow: '2px 2px 0 #000' }}
              >
                {fmt.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            onClick={handleExportAll}
            disabled={disabled || exporting}
            className={`
              border-4 border-black px-4 py-3 font-black uppercase text-sm tracking-tight w-full
              transition-colors cursor-pointer
              ${disabled || exporting
                ? 'opacity-40 cursor-not-allowed bg-white'
                : 'bg-yellow-300 hover:bg-yellow-400 active:bg-yellow-500'
              }
            `}
            style={{ boxShadow: '4px 4px 0 #000' }}
          >
            {exporting ? 'Exporting…' : `↓ Export All 7 Variants (ZIP)`}
          </button>
        </div>

      </div>
    </div>
  )
}
