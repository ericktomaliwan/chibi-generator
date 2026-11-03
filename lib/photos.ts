// The largest photo someone can choose.
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024
// The largest photo the server accepts. Vercel rejects request bodies over
// 4.5 MB, so this leaves room for the rest of the form.
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024

const MAX_SHRUNK_EDGE = 2048
const SHRUNK_JPEG_QUALITY = 0.85

// Runs in the browser. Photos that already fit are sent untouched.
export async function shrinkPhoto(file: File) {
  if (file.size <= MAX_UPLOAD_BYTES) return file

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_SHRUNK_EDGE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)

  const context = canvas.getContext('2d')!
  // JPEG has no transparency, so see-through areas become white rather than black.
  context.fillStyle = 'white'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', SHRUNK_JPEG_QUALITY),
  )
  if (!blob) throw new Error('Could not process that photo.')

  return new File([blob], `${file.name.replace(/\.\w+$/, '')}.jpg`, {
    type: 'image/jpeg',
  })
}
