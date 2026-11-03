import Image, { type StaticImageData } from 'next/image'

import { BentoCard } from '@/components/home/BentoCard'
import { Button } from '@/components/home/Button'
import { Container } from '@/components/home/Container'
import { Footer } from '@/components/home/Footer'
import { Gradient } from '@/components/home/Gradient'
import { Navbar } from '@/components/home/Navbar'
import { Heading, Subheading } from '@/components/home/Text'
import boxedAstronaut from '@/images/chibi-boxed-astronaut.png'
import capsuleBarista from '@/images/chibi-capsule-barista.png'
import keychainKnight from '@/images/chibi-keychain-knight.png'
import plush from '@/images/chibi-plush.png'
import stickerSkater from '@/images/chibi-sticker-skater.png'
import stickerWizard from '@/images/chibi-sticker-wizard.png'
import sampleChibi from '@/images/sample-chibi.png'
import studioScreenshot from '@/images/studio-screenshot.png'
import { QUALITIES, STYLES } from '@/lib/styles'

function Hero() {
  return (
    <div className="relative">
      <Gradient className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset" />
      <Container className="relative">
        <Navbar />
        <div className="grid items-center gap-20 pt-16 pb-28 sm:pt-24 lg:grid-cols-[1fr_auto] lg:pb-32">
          <div>
            <h1 className="text-6xl/[0.9] font-medium tracking-tight text-balance text-gray-950 sm:text-8xl/[0.85] xl:text-9xl/[0.85]">
              Pocket-sized you.
            </h1>
            <p className="mt-8 max-w-lg text-xl/7 font-medium text-gray-950/75 sm:text-2xl/8">
              Turn a photo into a chibi: big head, small body, sparkly eyes. Or
              skip the photo and describe a character.
            </p>
            <div className="mt-12 flex flex-col gap-x-6 gap-y-4 sm:flex-row">
              <Button href="/login">Sign in</Button>
              <Button variant="secondary" href="#styles">
                See the styles
              </Button>
            </div>
            <p className="mt-6 text-sm/6 font-medium text-gray-950/70">
              Invite-only for now.
            </p>
          </div>
          <div className="relative mx-auto w-64 sm:w-96">
            <Image
              src={capsuleBarista}
              alt="A chibi barista in a yellow raincoat inside a clear capsule"
              sizes="(min-width: 640px) 24rem, 16rem"
              loading="eager"
              className="rotate-3 rounded-3xl shadow-2xl ring-1 ring-black/10"
            />
            <Image
              src={stickerSkater}
              alt="A chibi skateboarder with pink hair as a die-cut sticker"
              sizes="(min-width: 640px) 11rem, 8rem"
              className="absolute -bottom-10 -left-8 w-32 -rotate-6 rounded-2xl shadow-xl ring-1 ring-black/10 sm:-left-14 sm:w-44"
            />
          </div>
        </div>
      </Container>
    </div>
  )
}

function StudioSection() {
  return (
    <div className="overflow-hidden">
      <Container className="pb-24">
        <Heading as="h2" className="max-w-3xl">
          One page, from photo to download.
        </Heading>
        <div className="relative mt-16 aspect-1216/768 h-144 [--radius:var(--radius-xl)] sm:h-auto sm:w-304">
          <div className="absolute -inset-(--padding) rounded-[calc(var(--radius)+var(--padding))] shadow-xs ring-1 ring-black/5 [--padding:--spacing(2)]" />
          <Image
            src={studioScreenshot}
            alt="The Chibi Generator studio, with options for a photo, a style, and details"
            sizes="(min-width: 640px) 1216px, 912px"
            className="h-full w-full rounded-(--radius) shadow-2xl ring-1 ring-black/10"
          />
        </div>
      </Container>
    </div>
  )
}

function StyleImage({
  src,
  alt,
  position = 'object-center',
}: {
  src: StaticImageData
  alt: string
  position?: string
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width: 1024px) 40rem, 100vw"
      className={`object-cover ${position}`}
    />
  )
}

function StylesSection() {
  return (
    <Container>
      <div id="styles" className="scroll-mt-8">
        <Subheading>Styles</Subheading>
        <Heading as="h3" className="mt-2 max-w-3xl">
          Five ways to look adorable.
        </Heading>
        <p className="mt-6 max-w-2xl text-lg/8 text-gray-600">
          Every result is a 1024 × 1024 image for you to download, not a
          physical toy. These examples use the same prompts as the app.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
        <BentoCard
          eyebrow="Capsule toy"
          title="Tiny figure, clear capsule"
          description="Glossy vinyl figure inside a clear gashapon capsule."
          graphic={
            <StyleImage
              src={sampleChibi}
              alt="A chibi adventurer inside a clear capsule"
              position="object-[center_35%]"
            />
          }
          fade={['bottom']}
          className="max-lg:rounded-t-4xl lg:col-span-3 lg:rounded-tl-4xl"
        />
        <BentoCard
          eyebrow="Boxed figure"
          title="Straight off the shelf"
          description="Collectible figure in a retail box with a clear window."
          graphic={
            <StyleImage
              src={boxedAstronaut}
              alt="A chibi astronaut beside a retail box with a clear window"
              position="object-[center_45%]"
            />
          }
          fade={['bottom']}
          className="lg:col-span-3 lg:rounded-tr-4xl"
        />
        <BentoCard
          eyebrow="Sticker"
          title="Thick white border"
          description="Die-cut sticker with flat, bright colors and clean outlines."
          graphic={
            <StyleImage
              src={stickerWizard}
              alt="A sleepy chibi wizard as a die-cut sticker"
              position="object-top"
            />
          }
          fade={['bottom']}
          className="lg:col-span-2 lg:rounded-bl-4xl"
        />
        <BentoCard
          eyebrow="Keychain"
          title="Ring and clasp included"
          description="Acrylic charm with a metal ring and clasp."
          graphic={
            <StyleImage
              src={keychainKnight}
              alt="A chibi knight as an acrylic keychain charm"
              position="object-[center_40%]"
            />
          }
          fade={['bottom']}
          className="lg:col-span-2"
        />
        <BentoCard
          eyebrow="Other"
          title="Or write your own"
          description="Describe a material, scene, or art style, like a knitted plush doll on a wooden shelf."
          graphic={
            <StyleImage
              src={plush}
              alt="A chibi adventurer as a knitted plush doll on a wooden shelf"
              position="object-[center_30%]"
            />
          }
          fade={['bottom']}
          className="max-lg:rounded-b-4xl lg:col-span-2 lg:rounded-br-4xl"
        />
      </div>
    </Container>
  )
}

function Chip({ selected, children }: { selected?: boolean; children: string }) {
  return (
    <span
      className={
        selected
          ? 'rounded-full bg-pink-500/15 px-4 py-2 text-sm/6 font-medium text-pink-200 ring-1 ring-pink-400/60'
          : 'rounded-full px-4 py-2 text-sm/6 font-medium text-gray-300 ring-1 ring-white/15'
      }
    >
      {children}
    </span>
  )
}

function UploadGraphic() {
  return (
    <div aria-hidden="true" className="grid h-full gap-4 p-10 sm:grid-cols-2">
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 p-6 text-center">
        <p className="text-sm/6 font-medium text-white">
          Drop a photo here, or click to choose one
        </p>
        <p className="mt-1 text-xs/5 text-gray-400">PNG, JPEG, or WebP</p>
      </div>
      <div className="hidden rounded-2xl p-6 ring-1 ring-white/15 sm:block">
        <p className="text-sm/6 text-gray-300">
          A sleepy wizard in purple robes holding a tiny lantern
        </p>
      </div>
    </div>
  )
}

function StyleChipsGraphic() {
  return (
    <div
      aria-hidden="true"
      className="flex h-full flex-wrap content-center gap-3 p-10"
    >
      {STYLES.map((style, index) => (
        <Chip key={style.id} selected={index === 0}>
          {style.name}
        </Chip>
      ))}
    </div>
  )
}

function QualityGraphic() {
  return (
    <div
      aria-hidden="true"
      className="flex h-full flex-wrap content-center gap-3 p-10"
    >
      {QUALITIES.map((quality, index) => (
        <Chip key={quality.id} selected={index === 1}>
          {quality.name}
        </Chip>
      ))}
    </div>
  )
}

function ResultsGraphic() {
  return (
    <div aria-hidden="true" className="flex h-full justify-center gap-4 p-10">
      {[stickerWizard, keychainKnight, boxedAstronaut].map((image) => (
        <div key={image.src} className="min-w-0">
          <Image
            src={image}
            alt=""
            sizes="11rem"
            className="rounded-xl ring-1 ring-white/15"
          />
          <p className="mt-3 text-sm/6 font-medium text-pink-300">Download</p>
        </div>
      ))}
    </div>
  )
}

function HowItWorksSection() {
  return (
    <div
      id="how-it-works"
      className="mx-2 mt-2 scroll-mt-2 rounded-4xl bg-gray-900 py-32"
    >
      <Container>
        <Subheading dark>How it works</Subheading>
        <Heading as="h3" dark className="mt-2 max-w-3xl">
          Three steps, about a minute.
        </Heading>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
          <BentoCard
            dark
            eyebrow="Step 1"
            title="Upload a photo, or describe a character"
            description="Use a photo up to 10 MB. Or skip it and describe who they are, what they wear, and what they hold."
            graphic={<UploadGraphic />}
            className="max-lg:rounded-t-4xl lg:col-span-4 lg:rounded-tl-4xl"
          />
          <BentoCard
            dark
            eyebrow="Step 2"
            title="Pick a style"
            description="Choose one of the presets, or describe your own."
            graphic={<StyleChipsGraphic />}
            className="lg:col-span-2 lg:rounded-tr-4xl"
          />
          <BentoCard
            dark
            eyebrow="Step 3"
            title="Generate"
            description="Choose a quality and wait. It usually takes 30 to 60 seconds."
            graphic={<QualityGraphic />}
            className="lg:col-span-2 lg:rounded-bl-4xl"
          />
          <BentoCard
            dark
            eyebrow="Your images"
            title="Download the ones you like"
            description="Photos go to OpenAI to make your image, and this app doesn't store them. Your chibis stay in your browser tab, so save your favorites before you close it."
            graphic={<ResultsGraphic />}
            className="max-lg:rounded-b-4xl lg:col-span-4 lg:rounded-br-4xl"
          />
        </div>
      </Container>
    </div>
  )
}

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <main>
        <div className="bg-linear-to-b from-white from-50% to-gray-100 py-32">
          <StudioSection />
          <StylesSection />
        </div>
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  )
}
