'use client'

import Image from 'next/image'
import { MockupVariant } from '@/lib/mockups'

interface VariantStripProps {
  variants: MockupVariant[]
  activeId: string
  graphicSrc: string | null
  transform: { x: number; y: number; width: number; height: number } | null
  blendMode: boolean
  onSelect: (id: string) => void
}

export default function VariantStrip({
  variants,
  activeId,
  onSelect,
}: VariantStripProps) {
  return (
    <div className="flex gap-3 flex-wrap">
      {variants.map((v) => {
        const active = v.id === activeId
        return (
          <button
            key={v.id}
            onClick={() => onSelect(v.id)}
            className={`
              flex flex-col items-center gap-1 border-4 p-1 font-mono text-xs font-black uppercase
              transition-colors cursor-pointer
              ${active
                ? 'border-black bg-yellow-300'
                : 'border-black bg-white hover:bg-yellow-50'
              }
            `}
            style={{ boxShadow: active ? '3px 3px 0 #000' : '2px 2px 0 #000' }}
          >
            <div className="relative w-16 h-16 overflow-hidden">
              <Image
                src={v.filename}
                alt={v.label}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <span className="tracking-tight leading-none">{v.label}</span>
          </button>
        )
      })}
    </div>
  )
}
