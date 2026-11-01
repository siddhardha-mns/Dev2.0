"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { testimonials, testimonialInitials } from "./testimonial-data";
import styles from "./testimonial.module.css";

export default function ClientFeedback() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const group = groupRef.current;
    if (!viewport || !group) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 768px)");
    let isMobile = mobileQuery.matches;
    let width = 0;
    let frame = 0;
    let previousTime = 0;
    let remainder = 0;
    let hovered = false;
    let touching = false;
    let activeTouch = false;
    let resumeAt = 0;
    let isVisible = true;

    const onMediaChange = () => {
      isMobile = mobileQuery.matches;
    };
    mobileQuery.addEventListener("change", onMediaChange);

    const focused = () =>
      viewport.contains(document.activeElement) &&
      document.activeElement?.matches(":focus-visible");

    const measure = () => {
      width = group.getBoundingClientRect().width;
      if (!viewport.scrollLeft && !preference.matches && width > 0) {
        viewport.scrollLeft = width;
      }
      remainder = 0;
    };

    const wrap = () => {
      if (preference.matches || !width || focused()) return;
      if (viewport.scrollLeft < width / 2 || viewport.scrollLeft >= width * 1.5) {
        viewport.scrollLeft = width / 2 + (((viewport.scrollLeft - width / 2) % width) + width) % width;
      }
    };

    const tick = (time: number) => {
      if (!isVisible) {
        frame = 0;
        return;
      }

      const elapsed = previousTime ? Math.min(time - previousTime, 50) : 0;
      previousTime = time;

      if (
        !preference.matches &&
        !hovered &&
        !touching &&
        !activeTouch &&
        !focused() &&
        time >= resumeAt
      ) {
        // Brisk, confident speed: ~48px/s on mobile, perfectly readable and active
        const speed = isMobile ? 48 : Math.max(36, width / 55);
        remainder += (elapsed / 1000) * speed;
        const distance = Math.floor(remainder);
        if (distance > 0) {
          remainder -= distance;
          viewport.scrollLeft += distance;
          wrap();
        }
      }
      frame = requestAnimationFrame(tick);
    };

    const startAnimation = () => {
      if (!frame && isVisible && !preference.matches) {
        previousTime = 0;
        frame = requestAnimationFrame(tick);
      }
    };

    const stopAnimation = () => {
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          startAnimation();
        } else {
          stopAnimation();
        }
      },
      { rootMargin: "1200px" }
    );
    io.observe(viewport);

    const enter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") hovered = true;
    };
    const leave = () => {
      hovered = false;
    };
    const down = () => {
      touching = true;
    };
    const release = () => {
      touching = false;
      resumeAt = performance.now() + 800;
    };
    const touchStart = () => {
      activeTouch = true;
    };
    const touchEnd = (event: TouchEvent) => {
      activeTouch = event.touches.length > 0;
      if (!activeTouch) resumeAt = performance.now() + 800;
    };
    const wheel = () => {
      resumeAt = performance.now() + 800;
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(group);
    measure();
    startAnimation();

    preference.addEventListener("change", measure);
    viewport.addEventListener("scroll", wrap, { passive: true });
    viewport.addEventListener("pointerenter", enter);
    viewport.addEventListener("pointerleave", leave);
    viewport.addEventListener("pointerdown", down);
    viewport.addEventListener("touchstart", touchStart, { passive: true });
    viewport.addEventListener("wheel", wheel, { passive: true });
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    window.addEventListener("touchend", touchEnd, { passive: true });
    window.addEventListener("touchcancel", touchEnd, { passive: true });

    return () => {
      stopAnimation();
      io.disconnect();
      resizeObserver.disconnect();
      mobileQuery.removeEventListener("change", onMediaChange);
      preference.removeEventListener("change", measure);
      viewport.removeEventListener("scroll", wrap);
      viewport.removeEventListener("pointerenter", enter);
      viewport.removeEventListener("pointerleave", leave);
      viewport.removeEventListener("pointerdown", down);
      viewport.removeEventListener("touchstart", touchStart);
      viewport.removeEventListener("wheel", wheel);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("touchend", touchEnd);
      window.removeEventListener("touchcancel", touchEnd);
    };
  }, []);

  return (
    <section className="w-full overflow-hidden bg-catalyst-paper py-20 text-catalyst-ink sm:py-24" aria-labelledby="stories-title">
      <header className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <h2 id="stories-title" className="max-w-4xl text-balance text-4xl font-semibold tracking-[-0.035em] sm:text-6xl">Relationships make the work work.</h2>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-2xl text-base leading-7 text-catalyst-muted sm:text-lg">Notes from people and teams who have worked alongside DevCatalyst.</p>
        </div>
      </header>
      <div ref={viewportRef} className={styles.viewport}>
        <div className={styles.track}>
          {[0, 1, 2].map((copy) => (
            <ul ref={copy === 1 ? groupRef : undefined} key={copy} className={styles.group} aria-hidden={copy !== 1 ? true : undefined}>
              {testimonials.map((item) => (
                <li key={item.slug} className={styles.card}>
                  <Link href={`/testimonials/${item.slug}`} tabIndex={copy !== 1 ? -1 : undefined} className="flex h-full flex-col justify-between rounded-2xl border border-catalyst-line bg-catalyst-white p-6 transition-colors hover:border-catalyst-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-catalyst-ink">
                    <div>
                      <p className="mb-5 text-xs font-medium uppercase tracking-[0.1em] text-catalyst-muted">{item.organization}</p>
                      <blockquote className="line-clamp-4 text-lg leading-7 tracking-[-0.015em]">&ldquo;{item.excerpt}&rdquo;</blockquote>
                    </div>
                    <div>
                      <div className="mt-7 flex items-center gap-3 border-t border-catalyst-line pt-4">
                        {item.authorImage ? <span className="size-11 shrink-0 overflow-hidden rounded-full"><Image src={item.authorImage} alt="" width={44} height={44} className="size-11 object-cover object-top" style={{ transform: `scale(${item.portraitScale})`, transformOrigin: item.portraitOrigin }} /></span> : item.companyImage ? <Image src={item.companyImage} alt="" width={88} height={44} className={item.companyImageSquare ? "h-14 w-14 shrink-0 rounded-md object-cover" : "h-11 w-[88px] shrink-0 rounded-md bg-white p-1 object-contain"} /> : <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-catalyst-ink text-sm font-semibold text-white">{testimonialInitials(item.name)}</span>}
                        <div className="min-w-0"><p className="text-sm font-semibold">{item.name}</p><p className="mt-1 text-xs leading-5 text-catalyst-muted">{item.role}</p></div>
                      </div>
                      <span className="mt-5 flex items-center justify-between gap-3 text-sm font-medium">View full testimonial <ArrowUpRight aria-hidden="true" size={17} /></span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
