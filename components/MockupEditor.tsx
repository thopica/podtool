'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva'
import Konva from 'konva'
import { MockupVariant, PRINT_AREA } from '@/lib/mockups'

interface MockupEditorProps {
  variant: MockupVariant
  graphicSrc: string | null
  blendMode: boolean
  onTransformChange: (t: { x: number; y: number; width: number; height: number }) => void
  transform: { x: number; y: number; width: number; height: number } | null
}

const CANVAS_SIZE = 600

export default function MockupEditor({
  variant,
  graphicSrc,
  blendMode,
  onTransformChange,
  transform,
}: MockupEditorProps) {
  const [mockupImage, setMockupImage] = useState<HTMLImageElement | null>(null)
  const [graphicImage, setGraphicImage] = useState<HTMLImageElement | null>(null)
  const [isSelected, setIsSelected] = useState(false)
  const graphicRef = useRef<Konva.Image>(null)
  const transformerRef = useRef<Konva.Transformer>(null)
  const isInitialized = useRef(false)

  // Load mockup image
  useEffect(() => {
    const img = new window.Image()
    img.onload = () => setMockupImage(img)
    img.src = variant.filename
  }, [variant.filename])

  // Load graphic image; reset selection and init flag on new upload
  useEffect(() => {
    if (!graphicSrc) { setGraphicImage(null); setIsSelected(false); return }
    const img = new window.Image()
    img.onload = () => {
      setGraphicImage(img)
      isInitialized.current = false
      setIsSelected(false)
    }
    img.src = graphicSrc
  }, [graphicSrc])

  // Attach or detach transformer based on selection state.
  // Runs after render so both graphicRef and transformerRef are guaranteed mounted.
  useEffect(() => {
    const tr = transformerRef.current
    if (!tr) return
    if (isSelected && graphicRef.current) {
      tr.nodes([graphicRef.current])
    } else {
      tr.nodes([])
    }
    tr.getLayer()?.batchDraw()
  }, [isSelected, graphicImage])

  // Set initial position inside print area on first graphic load
  useEffect(() => {
    if (!graphicImage || isInitialized.current) return
    if (transform) {
      isInitialized.current = true
      return
    }
    const printX = PRINT_AREA.xFraction * CANVAS_SIZE
    const printY = PRINT_AREA.yFraction * CANVAS_SIZE
    const printW = PRINT_AREA.wFraction * CANVAS_SIZE
    const printH = PRINT_AREA.hFraction * CANVAS_SIZE

    const aspect = graphicImage.width / graphicImage.height
    let w = printW * 0.7
    let h = w / aspect
    if (h > printH * 0.7) { h = printH * 0.7; w = h * aspect }

    const x = printX + (printW - w) / 2
    const y = printY + (printH - h) / 2

    onTransformChange({ x, y, width: w, height: h })
    isInitialized.current = true
  }, [graphicImage, transform, onTransformChange])

  const handleTransformEnd = useCallback(() => {
    const node = graphicRef.current
    if (!node) return
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()
    node.scaleX(1)
    node.scaleY(1)
    const t = {
      x: node.x(),
      y: node.y(),
      width: Math.abs(node.width() * scaleX),
      height: Math.abs(node.height() * scaleY),
    }
    node.width(t.width)
    node.height(t.height)
    onTransformChange(t)
  }, [onTransformChange])

  const handleDragEnd = useCallback(() => {
    const node = graphicRef.current
    if (!node) return
    onTransformChange({
      x: node.x(),
      y: node.y(),
      width: node.width(),
      height: node.height(),
    })
  }, [onTransformChange])

  return (
    <div
      className="border-4 border-black"
      style={{ boxShadow: '4px 4px 0 #000', width: CANVAS_SIZE, height: CANVAS_SIZE }}
    >
      <Stage
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        onMouseDown={(e) => {
          // Deselect when clicking the empty stage background
          if (e.target === e.target.getStage()) setIsSelected(false)
        }}
      >
        <Layer>
          {mockupImage && (
            <KonvaImage
              image={mockupImage}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              listening={false}
            />
          )}
          {graphicImage && transform && (
            <KonvaImage
              ref={graphicRef}
              image={graphicImage}
              x={transform.x}
              y={transform.y}
              width={transform.width}
              height={transform.height}
              draggable
              globalCompositeOperation={blendMode ? 'multiply' : 'source-over'}
              onClick={() => setIsSelected(true)}
              onTap={() => setIsSelected(true)}
              onDragEnd={handleDragEnd}
              onTransformEnd={handleTransformEnd}
            />
          )}
          {/* Transformer always in DOM — nodes() controls visibility */}
          <Transformer
            ref={transformerRef}
            keepRatio={false}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 20 || newBox.height < 20) return oldBox
              return newBox
            }}
            borderStroke="#FFE500"
            borderStrokeWidth={2}
            anchorStroke="#000"
            anchorFill="#FFE500"
            anchorSize={10}
          />
        </Layer>
      </Stage>
    </div>
  )
}
