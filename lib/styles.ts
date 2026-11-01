export const STYLES = [
  {
    id: 'capsule',
    name: 'Capsule toy',
    description: 'Glossy vinyl figure inside a clear gashapon capsule.',
    scene:
      'Render it as a glossy vinyl collectible toy standing inside a clear glass gashapon capsule, on a clean pastel background with soft studio lighting.',
  },
  {
    id: 'sticker',
    name: 'Sticker',
    description: 'Die-cut sticker with a thick white border.',
    scene:
      'Render it as a die-cut vinyl sticker with a thick white border, flat bright colors and clean outlines, on a plain light background.',
  },
  {
    id: 'boxed',
    name: 'Boxed figure',
    description: 'Collectible figure in a retail box with a clear window.',
    scene:
      'Render it as a collectible vinyl figure displayed in its retail box with a clear plastic window, product-photo style with soft studio lighting.',
  },
  {
    id: 'keychain',
    name: 'Keychain',
    description: 'Acrylic charm with a metal ring and clasp.',
    scene:
      'Render it as a small acrylic keychain charm with a metal ring and clasp, photographed on a clean pastel background.',
  },
  {
    id: 'custom',
    name: 'Other',
    description: 'Write your own style or scene.',
    scene: null,
  },
] as const

export type Style = (typeof STYLES)[number]
export type StyleId = Style['id']

export const MAX_CUSTOM_STYLE_LENGTH = 1000

// Approximate per-image prices for 1024x1024 output. Photo uploads add a
// small charge for the input image.
export const QUALITIES = [
  { id: 'low', name: 'Draft', price: '≈ $0.01' },
  { id: 'medium', name: 'Standard', price: '≈ $0.03' },
  { id: 'high', name: 'High', price: '≈ $0.13' },
] as const

export type Quality = (typeof QUALITIES)[number]
export type QualityId = Quality['id']

export function buildPrompt(
  style: Style,
  details: string,
  fromPhoto: boolean,
  customStyle = '',
) {
  const subject = fromPhoto
    ? 'Create a chibi-style, full-figure miniature version of the person in the uploaded photo. Keep their face, hairstyle, clothing, and colors recognizable.'
    : `Create an original chibi-style, full-figure character: ${details || 'a cheerful young adventurer'}.`

  // Presets bring their own backdrop. A custom style may not, so keep the
  // photo's setting unless the user's text describes a different one.
  const keepBackground =
    fromPhoto && !style.scene
      ? 'Keep the background and setting from the original photo, unless the style below describes a different scene.'
      : ''

  return [
    subject,
    'Big head, small body, large expressive eyes, soft rounded shapes, cute proportions.',
    keepBackground,
    style.scene ?? `Render it in this style: ${customStyle}`,
    fromPhoto && details ? `Additional details: ${details}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}
