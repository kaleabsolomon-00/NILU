import type { Metadata } from "next";
import { Logo, LogoMark } from "@/components/logo";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Owner login | NILU",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="min-h-[calc(100svh-4rem)] px-3 py-3 md:px-5 md:py-5">
      <div className="mx-auto grid min-h-[calc(100svh-6.5rem)] max-w-6xl overflow-hidden rounded-[2rem] bg-night shadow-2xl shadow-night/10 md:grid-cols-[1.05fr_0.95fr] md:rounded-[2.5rem]">
        <section className="relative isolate flex min-h-[28rem] flex-col justify-between overflow-hidden p-7 text-background md:min-h-0 md:p-12 lg:p-16">
          <div className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full border border-background/15 md:h-96 md:w-96" />
          <div className="absolute -bottom-36 -left-24 -z-10 h-80 w-80 rounded-full bg-brand/40 blur-3xl" />
          <Logo variant="cream" className="h-9 w-auto self-start sm:h-10" />

          <div className="relative mt-20 max-w-xl md:mt-0">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-sun">
              For venue owners
            </p>
            <h1 className="max-w-lg text-balance font-display text-5xl font-bold leading-[0.98] tracking-tight sm:text-6xl">
              Your place has a story.{" "}
              <span className="text-sun">Make it easy to find.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-background/70">
              Keep your NILU page fresh, share your QR code, and turn honest
              visitor feedback into your next great decision.
            </p>
          </div>

          <div className="relative mt-16 flex items-end justify-between gap-6 md:mt-0">
            <div className="flex items-center gap-3">
              <LogoMark className="h-10 w-10 brightness-0 invert opacity-80" />
              <span className="max-w-32 text-sm leading-tight text-background/60">
                Built for places people remember.
              </span>
            </div>
            <span className="hidden text-sm text-background/40 sm:block">
              NILU / 2026
            </span>
          </div>
        </section>

        <section className="flex flex-col justify-center bg-background p-7 sm:p-12 lg:p-16">
          <div className="mx-auto w-full max-w-md">
            <div className="mt-6 sm:mt-8">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand/70">
                Welcome back
              </p>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
                Owner login
              </h2>
              <p className="mt-3 max-w-sm text-lg text-ink/60">
                Sign in to see how your place is doing.
              </p>
            </div>
            <LoginForm />
            <p className="mt-8 text-center text-sm text-ink/50">
              Need an owner account?{" "}
              <a
                href="https://t.me/Kal_de_blues"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-brand underline decoration-brand/30 underline-offset-4 hover:decoration-brand"
              >
                Contact me on Telegram
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
