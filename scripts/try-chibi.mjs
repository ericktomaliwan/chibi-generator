// Quick test of OpenAI image models for chibi generation.
//
// Usage:
//   node --env-file=.env.local scripts/try-chibi.mjs [path/to/photo.jpg]
//
// With a photo, it calls the edits endpoint and turns the person into a chibi.
// Without a photo, it generates a chibi character from the text prompt alone.
//
// Optional env vars: IMAGE_MODEL (default gpt-image-1.5), IMAGE_QUALITY
// (low | medium | high, default medium), IMAGE_SIZE (default 1024x1024).

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { basename, extname } from "node:path";

const MODEL = process.env.IMAGE_MODEL ?? "gpt-image-1.5";
const QUALITY = process.env.IMAGE_QUALITY ?? "medium";
const SIZE = process.env.IMAGE_SIZE ?? "1024x1024";

const PHOTO_PROMPT = `Create a chibi-style, full-figure miniature version of the person in the uploaded photo.
Keep their face, hairstyle, clothing, and colors recognizable.
Big head, small body, large expressive eyes, soft rounded shapes, cute proportions.
Render it as a glossy vinyl collectible toy standing inside a clear glass gashapon capsule,
on a clean pastel background with soft studio lighting.`;

const TEXT_PROMPT = `A chibi-style, full-figure miniature character: a cheerful young adventurer
with a backpack. Big head, small body, large expressive eyes, soft rounded shapes.
Render it as a glossy vinyl collectible toy standing inside a clear glass gashapon capsule,
on a clean pastel background with soft studio lighting.`;

const MIME_TYPES = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("Missing OPENAI_API_KEY. Add it to .env.local and run with --env-file=.env.local.");
  process.exit(1);
}

const photoPath = process.argv[2];
let response;

if (photoPath) {
  const mimeType = MIME_TYPES[extname(photoPath).toLowerCase()];
  if (!mimeType) {
    console.error("Photo must be .png, .jpg, .jpeg, or .webp.");
    process.exit(1);
  }
  const form = new FormData();
  form.append("model", MODEL);
  form.append("prompt", PHOTO_PROMPT);
  form.append("size", SIZE);
  form.append("quality", QUALITY);
  form.append("image", new Blob([await readFile(photoPath)], { type: mimeType }), basename(photoPath));

  console.log(`Editing ${photoPath} with ${MODEL} (${QUALITY}, ${SIZE})...`);
  response = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });
} else {
  console.log(`Generating from text with ${MODEL} (${QUALITY}, ${SIZE})...`);
  response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, prompt: TEXT_PROMPT, size: SIZE, quality: QUALITY }),
  });
}

const result = await response.json();
if (!response.ok) {
  console.error(`OpenAI error (${response.status}):`, result.error?.message ?? result);
  process.exit(1);
}

await mkdir("output", { recursive: true });
const outPath = `output/chibi-${MODEL}-${Date.now()}.png`;
await writeFile(outPath, Buffer.from(result.data[0].b64_json, "base64"));
console.log(`Saved ${outPath}`);
if (result.usage) console.log("Usage:", result.usage);
