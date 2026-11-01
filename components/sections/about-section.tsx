import AboutBallTrack from "./about-ball-track";

export default function AboutSection() {
  return (
    <>
      <AboutBallTrack />

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
