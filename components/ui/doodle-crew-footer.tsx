"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

const links = [
  { label: "About us", href: "/#about" },
  { label: "Gallery", href: "/event-gallery" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "FAQ", href: "/#faq" },
  { label: "Partner", href: "/partner-with-devcatalyst" },
  { label: "GitHub", href: "https://github.com/DevCatalyst-OSS/", external: true },
];

function Sparkle({ className = "" }: { className?: string }) {
  return <svg viewBox="0 0 40 40" className={className} aria-hidden="true"><path d="M20 3l3.4 13.6L37 20l-13.6 3.4L20 37l-3.4-13.6L3 20l13.6-3.4z" fill="white" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" /></svg>;
}

function Arrow() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

export default function DoodleCrewFooter() {
  const repeated = ["Students", "Events", "Community", "Partnerships", "DevCatalyst"];
  const footerRef = React.useRef<HTMLElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const wordRef = React.useRef<HTMLHeadingElement>(null);
  const marqueeRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const footer = footerRef.current;
    const stage = stageRef.current;
    const word = wordRef.current;
    const marquee = marqueeRef.current;
    const track = trackRef.current;
    if (!footer || !stage || !word || !marquee || !track) return;

    gsap.registerPlugin(ScrollTrigger);
    const cleanups: Array<() => void> = [];
    const context = gsap.context(() => {
      const letters = Array.from(word.querySelectorAll<HTMLElement>(".dc-footer-letter"));
      const innerLetters = Array.from(word.querySelectorAll<HTMLElement>(".dc-footer-letter-inner"));
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const paths = footer.querySelectorAll<SVGPathElement>(".dc-footer-scribble path");
      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });

      const entrance = gsap.timeline({
        scrollTrigger: { trigger: footer, start: "top 75%", once: true },
      });
      entrance
        .from(letters, { yPercent: 130, rotation: () => gsap.utils.random(-12, 12), duration: 1.15, ease: "back.out(1.45)", stagger: 0.055 })
        .to(paths, { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut", stagger: 0.12 }, "-=0.55")
        .from(footer.querySelectorAll(".dc-footer-sparkle"), { scale: 0, rotation: -120, duration: 0.9, ease: "back.out(2.2)", stagger: 0.14 }, "-=1.2")
        .from(footer.querySelector(".dc-footer-kicker"), { opacity: 0, y: 12, duration: 0.7 }, "-=0.9")
        .from(footer.querySelectorAll(".dc-footer-reveal"), { opacity: 0, y: 26, duration: 0.8, stagger: 0.12, ease: "power3.out" }, "-=0.6")
        .from(footer.querySelectorAll(".dc-footer-micro"), { opacity: 0, duration: 1.1 }, "<")
        .from(footer.querySelector(".dc-footer-bottom"), { opacity: 0, duration: 0.9 }, "-=0.4");

      innerLetters.forEach((letter) => {
        gsap.to(letter, { y: () => -4 - Math.random() * 4, duration: () => 3 + Math.random() * 2.2, ease: "sine.inOut", repeat: -1, yoyo: true, delay: () => 1.6 + Math.random() * 2.5 });
      });

      if (window.matchMedia("(pointer: fine)").matches) {
        const setters = letters.map((letter) => ({
          x: gsap.quickTo(letter, "x", { duration: 0.5, ease: "power3" }),
          y: gsap.quickTo(letter, "y", { duration: 0.5, ease: "power3" }),
          rotation: gsap.quickTo(letter, "rotation", { duration: 0.7, ease: "power3" }),
        }));
        const onMove = (event: MouseEvent) => letters.forEach((letter, index) => {
          const rect = letter.getBoundingClientRect();
          const dx = event.clientX - (rect.left + rect.width / 2);
          const dy = event.clientY - (rect.top + rect.height / 2);
          const distance = Math.hypot(dx, dy);
          if (distance < 170) {
            const force = 1 - distance / 170;
            setters[index].x(dx * 0.32 * force);
            setters[index].y(dy * 0.32 * force);
            setters[index].rotation(dx * 0.035 * force);
          } else {
            setters[index].x(0); setters[index].y(0); setters[index].rotation(0);
          }
        });
        const reset = () => setters.forEach((setter) => { setter.x(0); setter.y(0); setter.rotation(0); });
        stage.addEventListener("mousemove", onMove);
        stage.addEventListener("mouseleave", reset);
        cleanups.push(() => {
          stage.removeEventListener("mousemove", onMove);
          stage.removeEventListener("mouseleave", reset);
        });
      }

      const animation = gsap.to(track, { xPercent: -50, ease: "none", duration: 28, repeat: -1 });
      const slow = () => gsap.to(animation, { timeScale: 0.2, duration: 0.6 });
      const resume = () => gsap.to(animation, { timeScale: 1, duration: 0.6 });
      marquee.addEventListener("mouseenter", slow);
      marquee.addEventListener("mouseleave", resume);
      marquee.addEventListener("focusin", slow);
      marquee.addEventListener("focusout", resume);
      cleanups.push(() => {
        marquee.removeEventListener("mouseenter", slow);
        marquee.removeEventListener("mouseleave", resume);
        marquee.removeEventListener("focusin", slow);
        marquee.removeEventListener("focusout", resume);
      });
    }, footer);

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      context.revert();
    };
  }, []);

  return (
    <footer ref={footerRef} id="footer" className="relative w-full overflow-hidden border-t border-catalyst-line bg-catalyst-lime px-0 pt-[clamp(110px,15vh,180px)] text-[#0f0f0f]">
      <div className="dc-footer-micro pointer-events-none absolute left-[4vw] top-12 hidden border-l border-black pl-4 font-mono text-[11px] uppercase leading-[2.1] tracking-[0.3em] lg:block">Student led<br />Tech<br />Community</div>
      <div className="dc-footer-micro pointer-events-none absolute right-[4vw] top-12 hidden font-mono text-[11px] uppercase leading-[2.1] tracking-[0.3em] lg:block"><Sparkle className="mb-2 block w-4" />Ideas<br />People<br />Projects<br />Impact<span className="mt-2 block h-px w-11 -rotate-2 bg-black" /></div>

      <div className="relative mx-auto w-full max-w-[1500px] px-5 sm:px-8 lg:px-[4vw]">
        <div ref={stageRef} className="relative mx-auto w-full max-w-[1280px]">
          <Sparkle className="dc-footer-sparkle absolute -left-1 top-[-9%] w-[clamp(26px,3vw,44px)] text-black [filter:drop-shadow(3px_3px_0_#0f0f0f)]" />
          <Sparkle className="dc-footer-sparkle absolute -right-1 top-[-16%] w-[clamp(40px,4.6vw,68px)] text-black [filter:drop-shadow(3px_3px_0_#0f0f0f)]" />
          <p className="dc-footer-kicker mb-[4vh] text-center font-mono text-[clamp(9px,3vw,12px)] uppercase tracking-[0.14em] before:mr-2 before:inline-block before:h-6 before:w-px before:translate-y-[-2px] before:bg-black before:align-middle sm:tracking-[0.35em] sm:before:mr-4 sm:before:h-[34px]">Curious minds — Real projects</p>
          <div className="overflow-hidden px-[.1em]">
            <h2 ref={wordRef} className="flex select-none justify-center whitespace-nowrap text-[clamp(38px,12.5vw,215px)] font-black leading-none tracking-[-.045em] [filter:url(#dc-footer-rough)] sm:text-[clamp(58px,12.5vw,215px)]" aria-label="DevCatalyst">
              {Array.from("DevCatalyst").map((char, index) => <span key={`${char}-${index}`} aria-hidden="true" className="dc-footer-letter inline-block"><span className="dc-footer-letter-inner inline-block bg-black bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27260%27 height=%2790%27%3E%3Cg stroke=%27%23fff%27 fill=%27none%27 stroke-linecap=%27round%27%3E%3Cpath d=%27M10 12h80M110 10h60M185 13h65M20 28h50M90 26h90M200 29h45M5 46h35M60 44h70M150 47h95M25 64h60M105 62h40M165 65h80M12 80h45M75 78h75M170 81h60%27 stroke-width=%272%27/%3E%3C/g%3E%3Cg fill=%27%23fff%27%3E%3Ccircle cx=%2770%27 cy=%2720%27 r=%271%27/%3E%3Ccircle cx=%27150%27 cy=%2736%27 r=%271%27/%3E%3Ccircle cx=%27215%27 cy=%2755%27 r=%271%27/%3E%3C/g%3E%3C/svg%3E')] bg-[length:.85em_auto] bg-clip-text text-transparent">{char}</span></span>)}
            </h2>
          </div>
          <svg className="dc-footer-scribble pointer-events-none absolute -bottom-[7%] left-[1%] h-[34px] w-[98%]" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true"><path d="M12 34C180 18 360 44 540 30S880 22 988 32" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" /><path d="M20 44C200 32 420 50 620 38S900 32 978 40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity=".4" /></svg>
        </div>

        <h3 className="dc-footer-reveal mt-[clamp(56px,8vh,90px)] text-center text-[clamp(20px,2.6vw,36px)] font-black tracking-[-.035em]">Students come together. <span className="text-catalyst-muted">Community grows from there.</span></h3>
        <div className="dc-footer-reveal mt-[30px] flex flex-wrap justify-center gap-[14px] px-[4vw]">
          <Link href="/partner-with-devcatalyst" className="flex min-h-12 items-center gap-2.5 rounded-full bg-catalyst-forest px-7 py-3.5 text-base font-medium text-white transition-colors hover:bg-[#333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4">Partner with us <Arrow /></Link>
          <a href="https://socials.devcatalyst.in/" target="_blank" rel="noreferrer noopener" className="flex min-h-12 items-center gap-2.5 rounded-full border border-[#0f0f0f] px-7 py-3.5 text-base font-medium transition-colors hover:bg-[#f1f1f1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4">Join DevCatalyst</a>
        </div>

        <div ref={marqueeRef} className="dc-footer-marquee mt-[clamp(70px,10vh,110px)] overflow-hidden border-y border-black py-[clamp(10px,1.6vw,20px)]">
          <div ref={trackRef} className="dc-footer-track flex w-max">
            {[0, 1].map((copy) => <div key={copy} className="flex items-center gap-[3.2vw] pr-[3.2vw] text-[clamp(36px,5.6vw,92px)] font-black uppercase leading-none tracking-[-.03em]" aria-hidden={copy === 1}>{repeated.map((item, index) => <React.Fragment key={`${copy}-${item}`}><span className={index % 2 ? "[-webkit-text-stroke:1.5px_#0f0f0f] text-transparent" : ""}>{item}</span><Sparkle className="w-[.42em] shrink-0 text-black" /></React.Fragment>)}</div>)}
          </div>
        </div>
      </div>

      <div className="dc-footer-bottom flex flex-wrap items-center justify-between gap-[18px] border-t border-[#e6e6e6] px-[4vw] py-6 font-mono text-[11px] uppercase tracking-[0.25em] text-[#555]">
        <span>© {new Date().getFullYear()} DevCatalyst</span>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-[26px] gap-y-2">{links.map((link) => link.external ? <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="transition-colors hover:text-black hover:underline">{link.label}</a> : <Link key={link.label} href={link.href} className="transition-colors hover:text-black hover:underline">{link.label}</Link>)}</nav>
        <span>Made on campus</span>
      </div>
      <svg width="0" height="0" className="absolute" aria-hidden="true"><defs><filter id="dc-footer-rough"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="4" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale="2.5" /></filter></defs></svg>
    </footer>
  );
}
