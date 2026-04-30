'use client'

import { useState, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { MOCKUP_VARIANTS } from '@/lib/mockups'
import Uploader from '@/components/Uploader'
import VariantStrip from '@/components/VariantStrip'
import ControlPanel from '@/components/ControlPanel'
import ExportPanel from '@/components/ExportPanel'

const MockupEditor = dynamic(() => import('@/components/MockupEditor'), { ssr: false })

const CANVAS_SIZE = 600

interface Transform {
  x: number
  y: number
  width: number
  height: number
}

export default function Home() {
  const [graphicSrc, setGraphicSrc] = useState<string | null>(null)
  const [activeVariantId, setActiveVariantId] = useState(MOCKUP_VARIANTS[0].id)
  const [transform, setTransform] = useState<Transform | null>(null)
  const [initialTransform, setInitialTransform] = useState<Transform | null>(null)
  const [opacity, setOpacity] = useState(1)
  const captureInitial = useRef(false)

  const activeVariant = MOCKUP_VARIANTS.find((v) => v.id === activeVariantId)!

  const handleGraphicLoaded = useCallback((src: string) => {
    setGraphicSrc(src)
    setTransform(null)
    setInitialTransform(null)
    setOpacity(1)
    captureInitial.current = true
  }, [])

  const handleTransformChange = useCallback((t: Transform) => {
    setTransform(t)
    // Capture the very first transform (auto-placement) as the reset target
    if (captureInitial.current) {
      setInitialTransform(t)
      captureInitial.current = false
    }
  }, [])

  const handleReset = useCallback(() => {
    if (initialTransform) setTransform(initialTransform)
  }, [initialTransform])

  const handleDelete = useCallback(() => {
    setGraphicSrc(null)
    setTransform(null)
    setInitialTransform(null)
    setOpacity(1)
  }, [])

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mb-8 border-b-4 border-black pb-4">
        <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">
          PODTOOL
        </h1>
        <p className="text-sm font-mono text-gray-600 mt-1 uppercase tracking-tight">
          T-Shirt Mockup Generator
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">

        {/* Left column: editor + variant strip */}
        <div className="flex flex-col gap-6 flex-shrink-0">
          <MockupEditor
            variant={activeVariant}
            graphicSrc={graphicSrc}
            opacity={opacity}
            onTransformChange={handleTransformChange}
            transform={transform}
          />

          <div>
            <div className="font-black uppercase text-xs tracking-tight text-gray-500 mb-2">
              Color Variants
            </div>
            <VariantStrip
              variants={MOCKUP_VARIANTS}
              activeId={activeVariantId}
              graphicSrc={graphicSrc}
              transform={transform}
              blendMode={false}
              onSelect={setActiveVariantId}
            />
          </div>
        </div>

        {/* Right column: controls */}
        <div className="flex flex-col gap-6 flex-1 max-w-sm">
          <Uploader onGraphicLoaded={handleGraphicLoaded} hasGraphic={!!graphicSrc} />

          {!graphicSrc && (
            <div className="border-4 border-black border-dashed p-6 font-mono text-sm text-gray-500 text-center uppercase tracking-tight">
              Upload a graphic to start placing it on the shirt
            </div>
          )}

          {graphicSrc && (
            <>
              <ControlPanel
                opacity={opacity}
                onOpacityChange={setOpacity}
                onReset={handleReset}
                onDelete={handleDelete}
                hasGraphic={!!graphicSrc}
              />
              <ExportPanel
                activeVariantId={activeVariantId}
                graphicSrc={graphicSrc}
                transform={transform}
                opacity={opacity}
                canvasSize={CANVAS_SIZE}
              />
            </>
          )}
        </div>
      </div>
    </main>
  )
}
