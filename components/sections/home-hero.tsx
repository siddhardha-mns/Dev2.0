"use client";

import { ArrowRight, ArrowUpRight, Box, Globe, Lightbulb, Users } from "lucide-react";
import { gsap } from "gsap";
import { useLayoutEffect, useRef } from "react";
import Link from "next/link";

import dynamic from "next/dynamic";
import AnimatedHeroHeadline from "@/components/ui/animated-hero-headline";
import SiteNav from "./site-nav";

const CrowdCanvas = dynamic(
  () => import("@/components/ui/skiper39").then((m) => m.CrowdCanvas),
  { ssr: false }
);

const activities = [
  { label: "WORKSHOPS", Icon: Users },
  { label: "BUILD NIGHTS", Icon: Lightbulb },
  { label: "HACKATHONS", Icon: Box },
  { label: "OPEN SOURCE", Icon: Globe },
];

export default function HomeHero() {
  const heroRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .fromTo("[data-hero-kicker]", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 })
        .fromTo("[data-hero-title]", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75 }, "-=0.12")
        .fromTo("[data-hero-copy]", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, "-=0.3")
        .fromTo("[data-hero-actions]", { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, "-=0.18")
        .fromTo("[data-hero-aside]", { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, "-=0.28")
        .fromTo("[data-hero-crowd]", { y: 24, scale: 1.025, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 1.3, ease: "power2.out" }, "-=0.75");
    }, hero);

    return () => context.revert();
  }, []);

  return (
    <>
      <SiteNav />

      <section
        ref={heroRef}
        id="home"
        aria-labelledby="hero-title"
        className="relative isolate min-h-[100svh] overflow-hidden bg-catalyst-paper text-catalyst-ink lg:min-h-screen lg:min-h-[100svh]"
      >
        <div className="pointer-events-none absolute left-7 top-9 z-20 hidden h-32 border-l border-catalyst-forest/70 pl-4 md:block lg:left-10">
          <p className="max-w-[90px] text-[10px] font-medium uppercase leading-[1.55] tracking-[0.17em] text-catalyst-muted">
            Student led<br />tech<br />community
          </p>
        </div>

        <div className="pointer-events-none absolute right-8 top-8 z-20 hidden -rotate-6 items-start gap-3 xl:flex">
          <svg aria-hidden="true" viewBox="0 0 36 40" className="mt-1 size-8" fill="none">
            <path d="M17 2l2.8 12 10.5-6-8 10.1 11 4.2-12 .8 3.6 11.2-7.8-9.1-7 9.7 2.6-11.8L1 25l10.2-6.2L3 10l11 5.2L17 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
          <p className="text-[12px] font-semibold uppercase leading-[1.45] tracking-[0.08em] text-catalyst-ink">
            Students<br />Events<br />Community<br />Partnerships
          </p>
          <span aria-hidden="true" className="absolute -bottom-2 right-0 h-px w-12 rotate-[-12deg] bg-catalyst-forest" />
        </div>

        {/* Editorial hero layout */}
        <div className="relative z-10 mx-auto grid w-full max-w-[1360px] grid-cols-1 items-start gap-10 px-6 pt-24 sm:px-10 sm:pt-28 lg:min-h-[100svh] lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-12 lg:px-12 lg:pb-[300px] lg:pt-[155px] xl:px-20">
          {/* Main headline and calls to action */}
          <div className="relative min-w-0">
            <div data-hero-kicker className="mb-7 inline-flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-6 w-px bg-catalyst-forest"
              />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-catalyst-muted sm:text-xs">
                Community, events, collaboration
              </span>
            </div>

            <AnimatedHeroHeadline />

            <p data-hero-copy className="mt-7 max-w-[465px] text-base leading-7 text-catalyst-muted sm:text-lg sm:leading-7">
              DevCatalyst brings students together through technology,
              events, and collaboration with industry and campus communities.
            </p>

            <div data-hero-actions className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                id="start"
                href="/partner-with-devcatalyst"
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-catalyst-forest px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-catalyst-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-catalyst-forest focus-visible:ring-offset-4"
              >
                Partner with us
                <ArrowRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
              <a
                href="https://socials.devcatalyst.in/"
                target="_blank"
                rel="noreferrer noopener"
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-catalyst-line/80 bg-catalyst-white/60 px-6 py-3 text-sm font-medium text-catalyst-ink shadow-[0_5px_24px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-colors duration-200 hover:bg-catalyst-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-catalyst-forest focus-visible:ring-offset-4 motion-reduce:transition-none"
              >
                Join the community
                <ArrowUpRight size={17} strokeWidth={1.8} />
              </a>
            </div>

          </div>

          <aside
            aria-label="DevCatalyst activities"
            data-hero-aside
            className="hidden min-w-0 flex-col items-end pt-2 lg:flex"
          >
            <div className="mt-6 flex w-full items-center justify-end gap-3">
              <div className="relative w-[190px] shrink-0 border-l border-catalyst-forest/75 pl-6">
                {activities.map(({ label, Icon }) => (
                  <div key={label} className="relative flex min-h-[45px] items-center gap-3">
                    <span aria-hidden="true" className="absolute -left-[29px] top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-catalyst-forest" />
                    <Icon aria-hidden="true" size={21} strokeWidth={1.6} className="shrink-0 text-catalyst-ink" />
                    <span className="whitespace-nowrap text-[10px] font-medium tracking-[0.14em] text-catalyst-muted">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div
          aria-hidden="true"
          className="hero-crowd-frame pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[90svh] overflow-hidden lg:h-[48svh] lg:max-h-[520px]"
          data-hero-crowd
        >
          <CrowdCanvas rows={8} cols={5} maxOnStage={24} maxBubbles={1} />
        </div>

      </section>
    </>
  );
}
