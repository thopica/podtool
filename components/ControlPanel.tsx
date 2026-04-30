'use client'

interface ControlPanelProps {
  blendMode: boolean
  onBlendModeToggle: () => void
  transform: { x: number; y: number; width: number; height: number } | null
  onTransformChange: (t: { x: number; y: number; width: number; height: number }) => void
}

export default function ControlPanel({
  blendMode,
  onBlendModeToggle,
  transform,
  onTransformChange,
}: ControlPanelProps) {
  if (!transform) return null

  const nudge = (axis: 'x' | 'y', delta: number) => {
    onTransformChange({ ...transform, [axis]: transform[axis] + delta })
  }

  return (
    <div className="border-4 border-black bg-white font-mono" style={{ boxShadow: '4px 4px 0 #000' }}>
      <div className="border-b-4 border-black px-4 py-2 bg-black text-yellow-300 font-black uppercase tracking-tight text-sm">
        Controls
      </div>
      <div className="p-4 flex flex-col gap-4">

        {/* Blend mode toggle */}
        <div className="flex items-center justify-between">
          <span className="font-black uppercase text-sm tracking-tight">Realistic Blend</span>
          <button
            onClick={onBlendModeToggle}
            className={`
              border-4 border-black px-3 py-1 font-black uppercase text-sm tracking-tight
              transition-colors cursor-pointer
              ${blendMode ? 'bg-yellow-300' : 'bg-white hover:bg-yellow-50'}
            `}
            style={{ boxShadow: '2px 2px 0 #000' }}
          >
            {blendMode ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Nudge */}
        <div>
          <div className="font-black uppercase text-sm tracking-tight mb-2">Nudge Position</div>
          <div className="grid grid-cols-3 gap-1 w-28">
            <div />
            <button onClick={() => nudge('y', -5)} className="border-4 border-black text-center py-1 font-black bg-white hover:bg-yellow-50 cursor-pointer" style={{ boxShadow: '2px 2px 0 #000' }}>↑</button>
            <div />
            <button onClick={() => nudge('x', -5)} className="border-4 border-black text-center py-1 font-black bg-white hover:bg-yellow-50 cursor-pointer" style={{ boxShadow: '2px 2px 0 #000' }}>←</button>
            <div className="border-4 border-black flex items-center justify-center text-xs font-black bg-yellow-300">·</div>
            <button onClick={() => nudge('x', 5)} className="border-4 border-black text-center py-1 font-black bg-white hover:bg-yellow-50 cursor-pointer" style={{ boxShadow: '2px 2px 0 #000' }}>→</button>
            <div />
            <button onClick={() => nudge('y', 5)} className="border-4 border-black text-center py-1 font-black bg-white hover:bg-yellow-50 cursor-pointer" style={{ boxShadow: '2px 2px 0 #000' }}>↓</button>
            <div />
          </div>
          <p className="text-xs text-gray-500 mt-2 uppercase tracking-tight">
            Click graphic on canvas to resize
          </p>
        </div>

      </div>
    </div>
  )
}
