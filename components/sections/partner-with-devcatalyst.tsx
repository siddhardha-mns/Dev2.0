import { ArrowDown, ArrowUpRight, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/sections/site-nav";
import SiteFooter from "@/components/sections/site-footer";
import { testimonials } from "@/components/ui/testimonial-data";
import { PARTNERSHIPS_EMAIL, emailHref } from "@/lib/contact";
import styles from "./partner-with-devcatalyst.module.css";

const ways = [
  { title: "Bring people together", format: "Events & hackathons", detail: "Co-host a meetup or hackathon around a shared interest. Bring a challenge, mentors, or a judging team, and shape the experience with our student community." },
  { title: "Pass on what you know", format: "Workshops & speakers", detail: "Take students inside your craft. Run a hands-on session, share how your team approaches a problem, or open up a conversation about working in your field." },
  { title: "Make participation possible", format: "Sponsorships & resources", detail: "Contribute funding, tools, credits, learning resources, or a venue. Work with us on support that fits the event and helps students take part." },
  { title: "Open a new door", format: "Careers & internships", detail: "Introduce your team and share relevant opportunities, portfolio feedback, or career guidance with students exploring their next steps." },
  { title: "Connect our circles", format: "Community collaborations", detail: "Bring campus clubs and developer communities together for shared sessions, local meetups, and relationships that continue after the event." },
  { title: "Give an idea its first push", format: "Projects & startups", detail: "Explore a student project, open-source contribution, or prototype around a real problem. Agree on scope, mentorship, and expectations together." },
];
const stories = [
  { name: "FreshGradPrep", event: "They Got Hired. Why Didn't You?", image: "/event-gallery/freshgradprep-hired/01.jpg", alt: "A FreshGradPrep speaker speaking with students seated in the audience", href: "/testimonials/bhargavi-freshgradprep" },
  { name: "Centle", event: "SummerSaaS 2026", image: "/event-gallery/summersaas-2026/01.jpg", alt: "Participants at the SummerSaaS 2026 event", href: "/testimonials/vamshi-team-centle" },
  { name: "Beacon Technologies", event: "Beacon's AI Foundry", image: "/event-gallery/beacons/01.jpg", alt: "A speaker addressing participants in the Beacon event auditorium", href: "/testimonials/srini-rao-beacon" },
];
const enquiry = (format?: string) => emailHref(PARTNERSHIPS_EMAIL, `DevCatalyst partnership${format ? ` — ${format}` : ""}`);
const quote = testimonials[0];

export default function PartnerWithDevCatalyst() {
  return (
    <main className={styles.page}>
      <SiteNav />
      <section data-nav-theme="light" aria-labelledby="partner-title" className={styles.hero}>
        <div className={styles.heroPhoto}>
          <Image src="/event-gallery/catalyst-days/01.jpg" alt="The Catalyst Days student community gathered for a group photograph" fill priority sizes="(min-width: 900px) 60vw, 100vw" />
          <span className={styles.photoShade} />
          <span className={styles.photoCaption}>A shared moment at Catalyst Days.</span>
        </div>
        <div className={styles.heroCopy}>
          <h1 id="partner-title">Good things<br />happen<br /><em>together.</em></h1>
          <p>Partner with DevCatalyst. Bring your experience into a community of students ready to learn, connect, and create.</p>
          <a href={enquiry()} className={styles.lightAction}>Let’s make it happen <ArrowUpRight size={22} aria-hidden="true" /></a>
          <a href="#possibilities" className={styles.explore}>Find our common ground <ArrowDown size={17} aria-hidden="true" /></a>
        </div>
      </section>
      <section aria-labelledby="connection-title" className={`${styles.section} ${styles.intro}`}>
        <h2 id="connection-title">You bring experience.<br />They bring curiosity.<br /><span>We bring people together.</span></h2>
        <div className={styles.introText}>
          <p>DevCatalyst is a student-driven community built through events, shared learning, and relationships across campuses and industry.</p>
          <p>A partnership creates a place for those worlds to meet. Students get closer to real work. Your team gets to share its perspective, hear fresh questions, and build connections through something useful.</p>
          <Link href="/event-gallery" className={styles.textLink}>See the community in action <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
      </section>
      <section id="possibilities" aria-labelledby="possibilities-title" className={`${styles.section} ${styles.possibilities}`}>
        <div className={styles.possibilityLead}>
          <h2 id="possibilities-title">What could <br />we do <br /><em>together?</em></h2>
          <p>For companies, startups, institutions, and communities. Start with an idea; we’ll shape the format around what students can learn and contribute.</p>
          <figure className={styles.workshopPhoto}>
            <Image src="/event-gallery/agentic-ai/01.jpg" alt="Students and speakers gathered after an Agentic AI workshop" width={900} height={600} sizes="(min-width: 900px) 35vw, 100vw" />
            <figcaption>Different perspectives. One room.</figcaption>
          </figure>
        </div>
        <div className={styles.formats}>
          {ways.map((way, index) => (
            <details key={way.title} className={styles.format} open={index === 0}>
              <summary>
                <span><span className={styles.formatName}>{way.format}</span><span className={styles.formatTitle}>{way.title}</span></span>
                <Plus size={25} strokeWidth={1.5} className={styles.plus} aria-hidden="true" />
              </summary>
              <div className={styles.formatBody}>
                <p>{way.detail}</p>
                <a href={enquiry(way.format)} className={styles.textLink}>Talk about {way.format.toLowerCase()} <ArrowUpRight size={18} aria-hidden="true" /></a>
              </div>
            </details>
          ))}
        </div>
      </section>
      <section aria-labelledby="stories-title" className={styles.stories}>
        <div className={styles.storyHeading}>
          <h2 id="stories-title">Shared work.<br /><em>Real relationships.</em></h2>
          <p>Meet a few of the people and teams who have been in the room with us.</p>
        </div>
        <div className={styles.storyGrid}>
          {stories.map((story) => (
            <Link key={story.name} href={story.href} className={styles.story}>
              <div className={styles.storyImage}><Image src={story.image} alt={story.alt} fill sizes="(min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw" /></div>
              <div className={styles.storyLabel}><div><h3>{story.name}</h3><p>{story.event}</p></div><ArrowUpRight aria-hidden="true" size={24} /></div>
              <span className={styles.storyRead}>Read their story</span>
            </Link>
          ))}
        </div>
        <figure className={styles.quote}>
          <blockquote>“{quote.excerpt}”</blockquote>
          <figcaption><Image src="/testimonials/bhargavi-m.png" alt="" width={48} height={48} /><span><strong>{quote.name}</strong><span>Founder, FreshGradPrep Community</span></span></figcaption>
        </figure>
      </section>
      <section id="partner-enquiry" aria-labelledby="enquiry-title" className={`${styles.section} ${styles.enquiry}`}>
        <div>
          <h2 id="enquiry-title">It starts with<br /><em>“what if?”</em></h2>
          <a href={enquiry()} className={styles.email}>Let’s talk <ArrowUpRight size={38} strokeWidth={1.3} aria-hidden="true" /></a>
          <a href={enquiry()} className={styles.emailAddress}>{PARTNERSHIPS_EMAIL}</a>
        </div>
        <div className={styles.nextSteps}>
          <p>Bring an idea. We’ll work out the rest together.</p>
          <ol>
            <li><h3>Say hello.</h3><p>Share your organization, what you have in mind, and any dates you’re considering.</p></li>
            <li><h3>Find the fit.</h3><p>Discuss the student experience, format, resources, and responsibilities with our team.</p></li>
            <li><h3>Make a plan.</h3><p>Agree on the scope and points of contact before announcing the collaboration.</p></li>
          </ol>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
