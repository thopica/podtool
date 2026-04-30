'use client'

import { useRef, useState } from 'react'

interface UploaderProps {
  onGraphicLoaded: (dataUrl: string) => void
}

export default function Uploader({ onGraphicLoaded }: UploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      onGraphicLoaded(result)
      setFileName(file.name)
    }
    reader.readAsDataURL(file)
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={`
        cursor-pointer border-4 border-black p-6 text-center font-mono
        transition-colors select-none
        ${dragging ? 'bg-yellow-300' : 'bg-white hover:bg-yellow-50'}
      `}
      style={{ boxShadow: '4px 4px 0 #000' }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={onInputChange}
      />
      <div className="text-2xl font-black uppercase tracking-tight mb-1">
        {fileName ? '↺ CHANGE GRAPHIC' : '+ UPLOAD GRAPHIC'}
      </div>
      <div className="text-sm font-mono text-gray-600">
        {fileName ? fileName : 'PNG or JPG — drag & drop or click'}
      </div>
    </div>
  )
}
