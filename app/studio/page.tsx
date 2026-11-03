import Image from "next/image";

import { AboutSection } from "@/components/AboutSection";
import { ChibiStudio } from "@/components/ChibiStudio";
import { PetalBanner } from "@/components/PetalBanner";
import { TinyPetalIcon } from "@/components/TinyPetalIcon";
import sampleChibi from "@/images/sample-chibi.png";
import { IMAGE_MODEL } from "@/lib/model";

const steps = [
  ["1", "Upload a photo, or describe a character"],
  ["2", "Pick a style, or describe your own"],
  ["3", "Generate, then download your favorites"],
] as const;

function SparkleIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" {...props}>
      <path d="M6 0c.3 2.9 1.4 4.6 6 6-4.6 1.4-5.7 3.1-6 6-.3-2.9-1.4-4.6-6-6 4.6-1.4 5.7-3.1 6-6Z" />
    </svg>
  );
}

export default function Studio() {
  return (
    <>
      <header className="bg-slate-50 lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-md lg:items-start lg:overflow-y-auto xl:w-120">
        <div className="hidden lg:sticky lg:top-0 lg:flex lg:w-16 lg:flex-none lg:items-center lg:px-12 lg:text-sm/7 lg:whitespace-nowrap lg:[writing-mode:vertical-rl]">
          <span className="font-mono text-slate-500">Powered by</span>
          <span className="mt-6 font-bold text-slate-900">{IMAGE_MODEL}</span>
        </div>
        <div className="relative z-10 mx-auto px-4 pt-10 pb-4 sm:px-6 md:max-w-2xl md:px-4 lg:min-h-full lg:flex-auto lg:border-x lg:border-slate-200 lg:px-8 lg:py-12 xl:px-12">
          <div className="relative mx-auto block w-48 overflow-hidden rounded-lg bg-slate-200 shadow-xl shadow-slate-200 sm:w-64 sm:rounded-xl lg:w-auto lg:rounded-2xl">
            <Image
              className="w-full"
              src={sampleChibi}
              alt="A chibi adventurer figure inside a clear capsule"
              sizes="(min-width: 1024px) 20rem, (min-width: 640px) 16rem, 12rem"
              loading="eager"
            />
            <div className="absolute inset-0 rounded-lg ring-1 ring-black/10 ring-inset sm:rounded-xl lg:rounded-2xl" />
          </div>
          <div className="mt-10 text-center lg:mt-12 lg:text-left">
            <p className="text-xl font-bold text-slate-900">Chibi Generator</p>
            <p className="mt-3 text-lg/8 font-medium text-slate-700">
              Turn any photo into a pocket-sized collectible.
            </p>
          </div>
          <AboutSection className="mt-12 hidden lg:block" />
          <section className="mt-10 lg:mt-12">
            <h2 className="sr-only flex items-center font-mono text-sm/7 font-medium text-slate-900 lg:not-sr-only">
              <TinyPetalIcon
                colors={["fill-indigo-300", "fill-blue-300"]}
                className="h-3 w-3"
              />
              <span className="ml-2.5">How it works</span>
            </h2>
            <div className="h-px bg-linear-to-r from-slate-200/0 via-slate-200 to-slate-200/0 lg:hidden" />
            <ol
              role="list"
              className="mt-4 flex flex-col gap-4 text-base/7 font-medium text-slate-700"
            >
              {steps.map(([number, label]) => (
                <li key={number} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white font-mono text-sm text-slate-500 ring-1 ring-slate-200">
                    {number}
                  </span>
                  {label}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </header>
      <main className="border-t border-slate-200 lg:relative lg:ml-112 lg:border-t-0 xl:ml-120">
        <PetalBanner className="absolute top-0 left-0 h-24 w-full" />
        <div className="relative">
          <ChibiStudio />
        </div>
      </main>
      <footer className="border-t border-slate-200 bg-slate-50 py-10 sm:py-16 lg:hidden">
        <div className="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4">
          <AboutSection />
          <h2 className="mt-8 flex items-center font-mono text-sm/7 font-medium text-slate-900">
            <SparkleIcon className="h-3 w-auto fill-slate-300" />
            <span className="ml-2.5">Powered by</span>
          </h2>
          <p className="mt-2 text-sm/7 font-bold text-slate-900">
            {IMAGE_MODEL}
          </p>
        </div>
      </footer>
    </>
  );
}
