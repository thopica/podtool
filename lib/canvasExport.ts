import JSZip from 'jszip'

export interface ExportFrame {
  mockupSrc: string
  graphicSrc: string
  x: number         // graphic x as fraction of canvas width
  y: number         // graphic y as fraction of canvas height
  width: number     // graphic width as fraction of canvas width
  height: number    // graphic height as fraction of canvas height
  blendMode: GlobalCompositeOperation
  opacity: number
}

const OUTPUT_SIZE = 2000

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

async function renderFrame(frame: ExportFrame): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas')
  canvas.width = OUTPUT_SIZE
  canvas.height = OUTPUT_SIZE
  const ctx = canvas.getContext('2d')!

  const mockup = await loadImage(frame.mockupSrc)
  ctx.drawImage(mockup, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE)

  const graphic = await loadImage(frame.graphicSrc)
  const gx = frame.x * OUTPUT_SIZE
  const gy = frame.y * OUTPUT_SIZE
  const gw = frame.width * OUTPUT_SIZE
  const gh = frame.height * OUTPUT_SIZE

  ctx.globalCompositeOperation = frame.blendMode
  ctx.globalAlpha = frame.opacity
  ctx.drawImage(graphic, gx, gy, gw, gh)
  ctx.globalCompositeOperation = 'source-over'
  ctx.globalAlpha = 1

  return canvas
}

export async function exportSingle(
  frame: ExportFrame,
  baseName: string,
  format: 'png' | 'jpg'
): Promise<void> {
  const canvas = await renderFrame(frame)
  const mimeType = format === 'png' ? 'image/png' : 'image/jpeg'
  const quality = format === 'jpg' ? 0.92 : undefined
  const dataUrl = canvas.toDataURL(mimeType, quality)
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = `${baseName}.${format}`
  a.click()
}

export async function exportAllAsZip(
  frames: Array<{ frame: ExportFrame; baseName: string }>,
  zipName: string
): Promise<void> {
  const zip = new JSZip()

  await Promise.all(
    frames.map(async ({ frame, baseName }) => {
      const canvas = await renderFrame(frame)
      const pngBlob = await new Promise<Blob>((res) =>
        canvas.toBlob((b) => res(b!), 'image/png')
      )
      const jpgBlob = await new Promise<Blob>((res) =>
        canvas.toBlob((b) => res(b!), 'image/jpeg', 0.92)
      )
      zip.file(`${baseName}.png`, pngBlob)
      zip.file(`${baseName}.jpg`, jpgBlob)
    })
  )

  const blob = await zip.generateAsync({ type: 'blob' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${zipName}.zip`
  a.click()
  URL.revokeObjectURL(a.href)
}
