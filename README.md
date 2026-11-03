# Chibi Generator

Turn a photo into a chibi: a cute figure with a big head, small body, and big eyes, shown as a capsule toy, sticker, boxed figure, or keychain. You can also skip the photo and describe a character, or write your own style.

<img src="images/sample-chibi.png" alt="A chibi adventurer figure inside a clear gashapon capsule" width="320">

Built with Next.js 16, React 19, and Tailwind CSS 4. Images are generated with OpenAI's image API (`gpt-image-1.5` by default). Login and the database use [Supabase](https://supabase.com).

## Features

- **Invite-only login:** sign in with your email and password, or with a link sent to your email if you forget it. Each account has a daily image limit.
- **Photo or text:** upload a PNG, JPEG, or WebP (up to 10 MB), or describe a character instead. Photos over 4 MB are shrunk in the browser before upload.
- **Styles:** capsule toy, sticker, boxed figure, keychain, or **Other**, where you write your own style (up to 1,000 characters).
- **Details:** add a pose, outfit, or props (up to 300 characters).
- **Quality:** Draft, Standard, or High, with the approximate cost shown for each.
- **Results list:** download or remove each image. Results only stay in the open browser tab and are gone after a refresh.

## Getting started

You need Node.js 24, [pnpm](https://pnpm.io), an [OpenAI API key](https://platform.openai.com/api-keys) with access to image generation, and a Supabase project (see below). If you use [nvm](https://github.com/nvm-sh/nvm), run `nvm use` in the project folder to switch to the right version.

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create a `.env.local` file in the project root:

   ```bash
   OPENAI_API_KEY=sk-...
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   # Optional: use a different image model (default: gpt-image-1.5)
   # IMAGE_MODEL=gpt-image-2
   ```

   `.env.local` is in `.gitignore`. Never commit your keys. The app doesn't need Supabase's secret key, so don't add it.

3. Start the dev server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) and sign in.

## Setting up Supabase

1. [Create a project](https://supabase.com/dashboard), signed up with the email you want to log in with. Supabase's built-in email service only sends to members of the project's team, and only 2 emails per hour. To invite anyone else, [set up your own SMTP server](https://supabase.com/docs/guides/auth/auth-smtp).
2. In the SQL Editor, run [`supabase/migrations/20261103000000_generation_usage.sql`](supabase/migrations/20261103000000_generation_usage.sql).
3. Under **Authentication**, change these settings:
   - **Allow new users to sign up:** turn this off. This is what makes the app invite-only.
   - **Site URL:** `http://localhost:3000` for now.
   - **Redirect URLs:** add `http://localhost:3000`. Use exact URLs here, not wildcards.
   - **Magic Link email template:** replace the link with:

     ```html
     <a href="{{ .RedirectTo }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">Sign in</a>
     ```

4. Under **Authentication > Users**, choose **Add user > Create new user**. Enter your email, a long random password from a password manager, and tick **Auto Confirm User**.
5. Copy the project URL and publishable key into `.env.local`.

To give someone else access, add them the same way. To remove access, delete the user, which locks them out of image generation right away.

## Costs

Each image is billed to your OpenAI account. Approximate prices for one 1024×1024 image with `gpt-image-1.5`:

| Quality  | Cost per image |
| -------- | -------------- |
| Draft    | ≈ $0.01        |
| Standard | ≈ $0.03        |
| High     | ≈ $0.13        |

Uploading a photo adds a small charge for the input image. Check [OpenAI's pricing page](https://openai.com/api/pricing) for current rates.

Each account can generate 25 images per day (UTC), which is about $3.25 per day at High quality. Requests that OpenAI rejects also count. To change the limit, edit `DAILY_IMAGE_LIMIT` in [`app/api/generate/route.ts`](app/api/generate/route.ts).

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
  login/page.tsx         Login page
  auth/confirm/route.ts  Where the emailed sign-in link lands
  actions/auth.ts        Sign in, email a sign-in link, sign out
  api/generate/route.ts  Server route that checks the session and calls OpenAI
components/
  ChibiStudio.tsx        The create form and results list
  LoginForm.tsx          The login form
  PetalBanner.tsx        Petal and sparkle header decoration
  TinyPetalIcon.tsx      Section heading icon
  AboutSection.tsx       Collapsible About text
lib/
  styles.ts              Styles, quality options, and prompt builder
  photos.ts              Upload limits and browser-side photo shrinking
  supabase/              Supabase clients and session handling
supabase/migrations/     Database setup, including the daily limit
proxy.ts                 Sends signed-out visitors to the login page
scripts/
  try-chibi.mjs          Command-line test script
```

## How it works

The browser sends the form to `/api/generate`. The server checks the session with Supabase, checks the input, takes one credit from the user's daily limit, builds the prompt, and calls OpenAI: the image edits endpoint when a photo is included, the generations endpoint when it isn't. It returns the image to the browser as a base64 PNG. API keys are only used on the server and are never sent to the browser. Photos are passed to OpenAI and not stored by the app.

`proxy.ts` only controls which pages signed-out visitors see. `/api/generate` is protected by its own session check, so any new API route needs one too.

## Deploying to Vercel

1. Add `OPENAI_API_KEY`, `SUPABASE_URL`, and `SUPABASE_PUBLISHABLE_KEY` to the project's environment variables, and mark `OPENAI_API_KEY` as [Sensitive](https://vercel.com/docs/environment-variables/sensitive-environment-variables). `.env.local` isn't deployed.
2. In Supabase, set **Site URL** to your production URL and add it to **Redirect URLs**, keeping `http://localhost:3000` if you still develop locally.
3. Set a monthly spending limit in your [OpenAI account settings](https://platform.openai.com/settings/organization/limits).

## Security testing

Vercel only [permits penetration testing](https://vercel.com/kb/guide/penetration-testing-on-vercel) on Pro and Enterprise plans, and only Enterprise can run high-volume scans. Supabase [permits testing your own project](https://supabase.com/docs/guides/security/security-testing), except for denial of service, request flooding, and cross-tenant attacks. Run heavy scans against a local build with OpenAI stubbed out, or they can run up your bill.

The Content Security Policy in [`next.config.ts`](next.config.ts) allows inline scripts, because nonces don't work with the static pages this app prerenders. A tester may flag this.

Password guessing is only slowed by [Supabase's default limit](https://supabase.com/docs/guides/auth/rate-limits) of 150 attempts per 5 minutes per IP address, and the app's sign-ins may all count against the server's address. Use long random passwords. Blocking known leaked passwords requires Supabase's Pro plan.

## Scripts

| Command      | What it does                  |
| ------------ | ----------------------------- |
| `pnpm dev`   | Start the development server  |
| `pnpm build` | Build for production          |
| `pnpm start` | Run the production build      |
| `pnpm lint`  | Run ESLint                    |
