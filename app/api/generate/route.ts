import {
  MAX_CUSTOM_STYLE_LENGTH,
  QUALITIES,
  STYLES,
  buildPrompt,
} from '@/lib/styles'

const MODEL = process.env.IMAGE_MODEL ?? 'gpt-image-1.5'
const SIZE = '1024x1024'
// Always return a solid background rather than letting the model choose transparency.
const BACKGROUND = 'opaque'
const MAX_PHOTO_BYTES = 10 * 1024 * 1024
const PHOTO_TYPES = ['image/png', 'image/jpeg', 'image/webp']
const MAX_DETAILS_LENGTH = 300

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status })
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return errorResponse('The server is missing OPENAI_API_KEY.', 500)
  }

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return errorResponse('Expected a multipart form submission.', 400)
  }

  const style = STYLES.find((s) => s.id === form.get('style'))
  const quality = QUALITIES.find((q) => q.id === form.get('quality'))
  if (!style || !quality) {
    return errorResponse('Unknown style or quality.', 400)
  }

  const details = String(form.get('details') ?? '')
    .trim()
    .slice(0, MAX_DETAILS_LENGTH)

  const customStyle = String(form.get('customStyle') ?? '')
    .trim()
    .slice(0, MAX_CUSTOM_STYLE_LENGTH)
  if (style.id === 'custom' && !customStyle) {
    return errorResponse('Describe the style you want for "Other".', 400)
  }

  const photoField = form.get('photo')
  const photo = photoField instanceof File && photoField.size > 0 ? photoField : null
  if (photo && !PHOTO_TYPES.includes(photo.type)) {
    return errorResponse('Photos must be PNG, JPEG, or WebP.', 400)
  }
  if (photo && photo.size > MAX_PHOTO_BYTES) {
    return errorResponse('Photos must be 10 MB or smaller.', 400)
  }

  const prompt = buildPrompt(style, details, Boolean(photo), customStyle)
  let response: Response

  if (photo) {
    const body = new FormData()
    body.append('model', MODEL)
    body.append('prompt', prompt)
    body.append('size', SIZE)
    body.append('quality', quality.id)
    body.append('background', BACKGROUND)
    body.append('image', photo, photo.name)

    response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body,
    })
  } else {
    response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        prompt,
        size: SIZE,
        quality: quality.id,
        background: BACKGROUND,
      }),
    })
  }

  const result = await response.json().catch(() => null)
  if (!response.ok || !result?.data?.[0]?.b64_json) {
    console.error('OpenAI image request failed', response.status, result)
    return errorResponse(
      result?.error?.message ?? 'Image generation failed. Please try again.',
      502,
    )
  }

  return Response.json({ image: `data:image/png;base64,${result.data[0].b64_json}` })
}
