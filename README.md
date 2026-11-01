# Chibi Generator

Turn a photo into a chibi: a cute figure with a big head, small body, and big eyes, shown as a capsule toy, sticker, boxed figure, or keychain. You can also skip the photo and describe a character, or write your own style.

<img src="images/sample-chibi.png" alt="A chibi adventurer figure inside a clear gashapon capsule" width="320">

Built with Next.js 16, React 19, and Tailwind CSS 4. Images are generated with OpenAI's image API (`gpt-image-1.5` by default).

## Features

- **Photo or text:** upload a PNG, JPEG, or WebP (up to 10 MB), or describe a character instead.
- **Styles:** capsule toy, sticker, boxed figure, keychain, or **Other**, where you write your own style (up to 1,000 characters).
- **Details:** add a pose, outfit, or props (up to 300 characters).
- **Quality:** Draft, Standard, or High, with the approximate cost shown for each.
- **Results list:** download or remove each image. Results only stay in the open browser tab and are gone after a refresh.

## Getting started

You need Node.js 20 or later, [pnpm](https://pnpm.io), and an [OpenAI API key](https://platform.openai.com/api-keys) with access to image generation.

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create a `.env.local` file in the project root:

   ```bash
   OPENAI_API_KEY=sk-...
   # Optional: use a different image model (default: gpt-image-1.5)
   # IMAGE_MODEL=gpt-image-2
   ```

   `.env.local` is in `.gitignore`. Never commit your key.

3. Start the dev server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Costs

Each image is billed to your OpenAI account. Approximate prices for one 1024×1024 image with `gpt-image-1.5`:

| Quality  | Cost per image |
| -------- | -------------- |
| Draft    | ≈ $0.01        |
| Standard | ≈ $0.03        |
| High     | ≈ $0.13        |

Uploading a photo adds a small charge for the input image. Check [OpenAI's pricing page](https://openai.com/api/pricing) for current rates.

## Model availability

OpenAI has scheduled `gpt-image-1.5` to shut down on **December 1, 2026** ([deprecations page](https://developers.openai.com/api/docs/deprecations)). After that date, set `IMAGE_MODEL` in `.env.local` to a supported model. Newer models may support different options, so test a few images after switching.

## Customizing styles

The preset styles, quality options, and the prompt builder live in [`lib/styles.ts`](lib/styles.ts). To add a style, add an entry to `STYLES` with an `id`, `name`, `description`, and a `scene` that describes how the chibi should be rendered. It appears in the form automatically.

Every prompt starts with the same chibi basics (big head, small body, big eyes, and keeping the person recognizable when a photo is used), then adds the style's scene and any details.

## Testing the API from the command line

[`scripts/try-chibi.mjs`](scripts/try-chibi.mjs) calls OpenAI directly, without the web app, and saves the result to `output/` (ignored by git):

```bash
# From a photo
node --env-file=.env.local scripts/try-chibi.mjs path/to/photo.jpg

# From the built-in text prompt
node --env-file=.env.local scripts/try-chibi.mjs

# Cheaper drafts, or a different model
IMAGE_QUALITY=low IMAGE_MODEL=gpt-image-2 node --env-file=.env.local scripts/try-chibi.mjs
```

## Project structure

```
app/
  page.tsx               Page layout: sidebar and main column
  layout.tsx             Root layout, fonts, and metadata
  api/generate/route.ts  Server route that calls OpenAI
components/
  ChibiStudio.tsx        The create form and results list
  PetalBanner.tsx        Petal and sparkle header decoration
  TinyPetalIcon.tsx      Section heading icon
  AboutSection.tsx       Collapsible About text
lib/
  styles.ts              Styles, quality options, and prompt builder
scripts/
  try-chibi.mjs          Command-line test script
```

## How it works

The browser sends the form to `/api/generate`. The server checks the input, builds the prompt, and calls OpenAI: the image edits endpoint when a photo is included, the generations endpoint when it isn't. It returns the image to the browser as a base64 PNG. The API key is only used on the server and is never sent to the browser. Photos are passed to OpenAI and not stored by the app.

## Before you deploy

`/api/generate` has no login or rate limiting. If you deploy the app publicly, anyone who finds it can generate images on your OpenAI bill. Before deploying:

- Add authentication or rate limiting to `/api/generate`.
- Set a monthly spending limit in your [OpenAI account settings](https://platform.openai.com/settings/organization/limits).

## Scripts

| Command      | What it does                  |
| ------------ | ----------------------------- |
| `pnpm dev`   | Start the development server  |
| `pnpm build` | Build for production          |
| `pnpm start` | Run the production build      |
| `pnpm lint`  | Run ESLint                    |
