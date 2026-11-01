"use client";

import { useEffect, useRef } from "react";

const BALL_SIZE = 380;

export default function AboutSection() {
  const trackRef = useRef<HTMLElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const main = track.closest("main");
    const previousOverflow = main?.style.overflow;
    if (main) main.style.overflow = "clip";

    let frame = 0;
    const update = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      const viewportWidth = track.clientWidth;
      const progress = Math.min(1, Math.max(0, -track.getBoundingClientRect().top / (viewportHeight * 2)));
      const centerProgress = Math.min(1, progress * 2);
      const expandProgress = Math.max(0, (progress - 0.5) * 2);
      const yOffset = (1 - centerProgress * centerProgress) * (viewportHeight / 2 + BALL_SIZE / 2);
      const size = BALL_SIZE + expandProgress * expandProgress * (Math.max(viewportWidth, viewportHeight) * 2.8 - BALL_SIZE);

      if (ballRef.current) {
        ballRef.current.style.width = ballRef.current.style.height = `${size}px`;
        ballRef.current.style.transform = `translate(-50%, calc(-50% + ${yOffset}px))`;
      }
      if (clipRef.current) {
        clipRef.current.style.clipPath = `circle(${size / 2}px at ${viewportWidth / 2}px ${viewportHeight / 2 + yOffset}px)`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      if (main) main.style.overflow = previousOverflow ?? "";
    };
  }, []);

  return (
    <>
      <section
        ref={trackRef}
        id="about"
        aria-labelledby="about-title"
        className="relative h-[300vh] bg-catalyst-paper motion-reduce:h-auto"
      >
        <div className="sticky top-0 h-screen overflow-hidden bg-catalyst-paper text-center motion-reduce:relative motion-reduce:h-[100svh]">
          <div
            ref={ballRef}
            aria-hidden="true"
            data-nav-theme="dark"
            className="absolute left-1/2 top-1/2 rounded-full bg-catalyst-forest will-change-[width,height,transform] motion-reduce:hidden"
          />
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-catalyst-forest">
            <h2 id="about-title" className="max-w-4xl text-balance text-[clamp(2.6rem,7vw,6rem)] font-semibold leading-[.98] tracking-[-.04em]">
              Students connect. Community takes shape.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-catalyst-muted sm:text-lg">
              DevCatalyst brings students together through shared learning, events, and collaboration.
            </p>
          </div>
          <div
            ref={clipRef}
            aria-hidden="true"
            className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-catalyst-white motion-reduce:hidden"
          >
            <p className="max-w-4xl text-balance text-[clamp(2.6rem,7vw,6rem)] font-semibold leading-[.98] tracking-[-.04em]">
              Students connect. Community takes shape.
            </p>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
              DevCatalyst brings students together through shared learning, events, and collaboration.
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="community-belief-title"
        className="flex min-h-[70svh] items-center justify-center bg-catalyst-paper px-6 py-24 text-catalyst-ink"
      >
        <div className="w-full max-w-[720px] text-center">
          <h2 id="community-belief-title" className="text-balance text-[clamp(1.7rem,3.8vw,1.9rem)] font-bold leading-[1.34] tracking-[-0.035em]">
            “A Place where curious minds turn ideas into real projects - a tech community that learns in public, builds together, and grows beyond the syllabus.”
          </h2>
          <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em]">- The DevCatalyst Community</p>
          <a
            href="https://socials.devcatalyst.in/"
            target="_blank"
            rel="noreferrer noopener"
            className="mt-10 inline-flex min-h-12 items-center rounded-full bg-catalyst-forest px-6 py-3 text-base font-semibold text-white transition hover:bg-catalyst-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-catalyst-forest focus-visible:ring-offset-4"
          >
            Join the Community
          </a>
        </div>
      </section>
    </>
  );
}
