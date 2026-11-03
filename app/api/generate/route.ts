import { MAX_UPLOAD_BYTES } from '@/lib/photos'
import {
  MAX_CUSTOM_STYLE_LENGTH,
  QUALITIES,
  STYLES,
  buildPrompt,
} from '@/lib/styles'
import { createClient } from '@/lib/supabase/server'

const MODEL = process.env.IMAGE_MODEL ?? 'gpt-image-1.5'
const SIZE = '1024x1024'
// Always return a solid background rather than letting the model choose transparency.
const BACKGROUND = 'opaque'
const MAX_DETAILS_LENGTH = 300
// At High quality this caps spending at about $3.25 per user per day.
const DAILY_IMAGE_LIMIT = 25

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status })
}

// The browser declares photo.type, so check that the file's first bytes match it.
async function hasImageSignature(photo: File) {
  const bytes = new Uint8Array(await photo.slice(0, 12).arrayBuffer())
  const text = (start: number, end: number) =>
    String.fromCharCode(...bytes.slice(start, end))

  switch (photo.type) {
    case 'image/png':
      return bytes[0] === 0x89 && text(1, 4) === 'PNG'
    case 'image/jpeg':
      return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
    case 'image/webp':
      return text(0, 4) === 'RIFF' && text(8, 12) === 'WEBP'
    default:
      return false
  }
}

export async function POST(request: Request) {
  // getUser asks Supabase rather than trusting the cookie, so a removed user is
  // locked out right away. It runs first so that signed-out requests cost nothing.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return errorResponse(
      'Your session has ended. Download any images you want to keep, then reload the page to sign in.',
      401,
    )
  }

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
  if (photo && !(await hasImageSignature(photo))) {
    return errorResponse('Photos must be PNG, JPEG, or WebP.', 400)
  }
  if (photo && photo.size > MAX_UPLOAD_BYTES) {
    return errorResponse('Photos must be 4 MB or smaller.', 400)
  }

  // Taken last so that invalid requests don't use up a credit. If it can't be
  // checked, nothing is sent to OpenAI.
  const { data: hasCredit, error: creditError } = await supabase.rpc(
    'consume_image_credit',
    { daily_limit: DAILY_IMAGE_LIMIT },
  )
  if (creditError) {
    console.error('Daily limit check failed', creditError.code, creditError.message)
    return errorResponse('Could not check your daily limit. Please try again.', 503)
  }
  if (!hasCredit) {
    return errorResponse(
      `You've reached today's limit of ${DAILY_IMAGE_LIMIT} images. It resets at midnight UTC.`,
      429,
    )
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
    // OpenAI's own messages can reveal account details, so they stay in the logs.
    return errorResponse(
      response.status === 400
        ? 'OpenAI rejected this request. Try a different photo or description.'
        : 'Image generation failed. Please try again.',
      502,
    )
  }

  return Response.json({ image: `data:image/png;base64,${result.data[0].b64_json}` })
}
