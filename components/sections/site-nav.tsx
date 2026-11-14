"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { label: "About us", href: "/#about" },
  { label: "Events & Gallery", href: "/event-gallery" },
  { label: "Testimonials", href: "/#testimonials" },
];

export default function SiteNav() {
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    let frame = 0;
    let previousScrolled = false;
    let previousDarkTheme = false;

    const update = () => {
      frame = 0;
      const nextScrolled = window.scrollY > 24;
      if (nextScrolled !== previousScrolled) {
        previousScrolled = nextScrolled;
        setScrolled(nextScrolled);
      }

      const navBottom = navRef.current?.getBoundingClientRect().bottom ?? 72;
      const sampleY = Math.min(window.innerHeight - 1, navBottom + 8);
      const layers = document.elementsFromPoint(window.innerWidth / 2, sampleY);
      const nextDarkTheme = layers.some((layer) => {
        const themed = layer.closest<HTMLElement>("[data-nav-theme]");
        return themed?.dataset.navTheme === "dark";
      });

      if (nextDarkTheme !== previousDarkTheme) {
        previousDarkTheme = nextDarkTheme;
        setDarkTheme(nextDarkTheme);
      }
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  const closeMobileMenu = () => setMobileOpen(false);
  const handleLogoClick = () => {
    closeMobileMenu();
    // Easter egg: a whale shark swims across the page. Loaded on demand; navigation is untouched.
    void import("@/components/ui/whale-shark").then((m) => m.triggerWhaleShark("logo")).catch(() => {});
  };
  const inkText = darkTheme ? "text-white visited:text-white" : "text-catalyst-ink visited:text-catalyst-ink";
  const surface = darkTheme
    ? "border-white/20 bg-catalyst-ink/95 shadow-[0_10px_35px_rgba(0,0,0,0.24)]"
    : scrolled
      ? "border-catalyst-line bg-catalyst-white/95 shadow-[0_10px_35px_rgba(0,0,0,0.10)]"
      : "border-catalyst-line/80 bg-catalyst-white/85 shadow-[0_5px_24px_rgba(0,0,0,0.06)]";
  const menuSurface = darkTheme
    ? "border-white/20 bg-catalyst-ink/95"
    : "border-catalyst-line bg-catalyst-white/95";

  return (
    <nav
      ref={navRef}
      aria-label="Main navigation"
      className="fixed inset-x-4 top-4 z-50 sm:inset-x-6 sm:top-5"
    >
      <div className="mx-auto w-full max-w-[1060px]">
        <div className={`relative flex min-h-[60px] items-center justify-between gap-3 rounded-full border px-3 py-2 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-200 motion-reduce:transition-none ${surface}`}>
          <Link
            href="/#home"
            onClick={handleLogoClick}
            aria-label="DevCatalyst home"
            className={`group flex min-h-11 min-w-0 shrink-0 items-center gap-2.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${darkTheme ? "focus-visible:ring-white focus-visible:ring-offset-catalyst-ink" : "focus-visible:ring-catalyst-forest focus-visible:ring-offset-white"}`}
          >
            <Image
              src="/logo-mark.svg"
              alt=""
              aria-hidden="true"
              width={36}
              height={36}
              className={`size-9 object-contain transition-[filter] duration-200 motion-reduce:transition-none ${darkTheme ? "invert" : ""}`}
            />
            <span className={`hidden text-base font-semibold tracking-[-0.035em] min-[440px]:inline sm:text-lg ${inkText}`}>
              DevCatalyst
            </span>
          </Link>

          <div className="hidden items-center gap-4 xl:gap-6 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`min-h-11 whitespace-nowrap rounded-full px-1 py-3 text-[15px] font-medium transition-colors duration-200 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${inkText} ${darkTheme ? "focus-visible:ring-white focus-visible:ring-offset-catalyst-ink" : "focus-visible:ring-catalyst-forest focus-visible:ring-offset-white"}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link
            href="/partner-with-devcatalyst"
            onClick={closeMobileMenu}
            className={`group ml-auto inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-full px-3 py-2.5 text-xs font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:gap-2 sm:px-4 sm:text-sm lg:ml-0 ${darkTheme ? "bg-catalyst-paper text-catalyst-ink hover:bg-white focus-visible:ring-white focus-visible:ring-offset-catalyst-ink" : "bg-catalyst-forest text-white hover:bg-catalyst-ink focus-visible:ring-catalyst-forest focus-visible:ring-offset-white"}`}
          >
            Partner with us
            <ArrowUpRight size={15} strokeWidth={1.8} aria-hidden="true" />
          </Link>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            className={`grid size-11 shrink-0 place-items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:opacity-75 lg:hidden ${inkText} ${darkTheme ? "hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-catalyst-ink" : "hover:bg-catalyst-sage focus-visible:ring-catalyst-forest focus-visible:ring-offset-white"}`}
          >
            {mobileOpen ? <X size={20} strokeWidth={1.8} /> : <Menu size={20} strokeWidth={1.8} />}
          </button>
        </div>

        {mobileOpen && (
          <div
            id="mobile-navigation"
            className={`absolute right-0 top-[calc(100%+0.75rem)] w-[min(22rem,calc(100vw-2rem))] rounded-3xl border p-3 shadow-[0_12px_30px_rgba(0,0,0,0.16)] backdrop-blur-xl ${menuSurface} animate-in fade-in slide-in-from-top-2 duration-200 lg:hidden`}
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`flex min-h-12 items-center rounded-xl px-4 py-3 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 ${inkText} ${darkTheme ? "hover:bg-white/10 focus-visible:ring-white" : "hover:bg-catalyst-sage focus-visible:ring-catalyst-forest"}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
