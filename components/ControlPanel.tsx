'use client'

interface ControlPanelProps {
  opacity: number
  onOpacityChange: (v: number) => void
  onReset: () => void
  onDelete: () => void
  hasGraphic: boolean
}

export default function ControlPanel({
  opacity,
  onOpacityChange,
  onReset,
  onDelete,
  hasGraphic,
}: ControlPanelProps) {
  if (!hasGraphic) return null

  return (
    <div className="border-4 border-black bg-white font-mono" style={{ boxShadow: '4px 4px 0 #000' }}>
      <div className="border-b-4 border-black px-4 py-2 bg-black text-yellow-300 font-black uppercase tracking-tight text-sm">
        Controls
      </div>
      <div className="p-4 flex flex-col gap-4">

        {/* Opacity slider */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="font-black uppercase text-sm tracking-tight">Transparency</span>
            <span className="font-black text-sm">{Math.round(opacity * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(opacity * 100)}
            onChange={(e) => onOpacityChange(Number(e.target.value) / 100)}
            className="w-full h-2 appearance-none bg-black cursor-pointer accent-yellow-300"
          />
        </div>

        {/* Reset + Delete */}
        <div className="flex gap-2">
          <button
            onClick={onReset}
            className="flex-1 border-4 border-black px-3 py-2 font-black uppercase text-sm tracking-tight bg-white hover:bg-yellow-50 cursor-pointer"
            style={{ boxShadow: '2px 2px 0 #000' }}
          >
            ↺ Reset Size
          </button>
          <button
            onClick={onDelete}
            className="flex-1 border-4 border-black px-3 py-2 font-black uppercase text-sm tracking-tight bg-white hover:bg-red-100 cursor-pointer"
            style={{ boxShadow: '2px 2px 0 #000' }}
          >
            ✕ Delete
          </button>
        </div>

      </div>
    </div>
  )
}
