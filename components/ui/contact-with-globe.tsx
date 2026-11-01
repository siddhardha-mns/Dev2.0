import { Mail } from "lucide-react";
import dynamic from "next/dynamic";

const GlobeWireframe = dynamic(() => import("@/components/ui/globe-wireframe"), {
  loading: () => <div className="mx-auto aspect-square w-full max-w-[390px]" />,
});
import ContactForm from "@/components/ui/contact-form";
import ContactHeader from "@/components/ui/contact-header";
import { cn } from "@/lib/utils";
import { emailHref } from "@/lib/contact";

export default function ContactWithGlobe({
  title = "Let's build what matters",
  subtitle = "Contact",
  description = "Questions, event ideas, or collaboration enquiries? We'd like to hear from you.",
  className,
}: {
  title?: string;
  subtitle?: string;
  description?: string;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden bg-catalyst-paper py-24 text-catalyst-ink", className)}>
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <ContactHeader title={title} subtitle={subtitle} description={description} />

        <div className="mx-auto grid max-w-5xl items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="flex min-w-0 flex-col gap-7">
            <div>
              <h3 className="text-xl font-semibold">Get in touch</h3>
              <p className="mt-2 max-w-sm text-base leading-7 text-catalyst-muted">
                Reach the team directly by email.
              </p>
            </div>
            <a
              href={emailHref()}
              className="group flex min-h-12 w-fit items-center gap-3 rounded-lg text-base font-medium text-catalyst-ink transition-colors hover:text-catalyst-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-catalyst-forest focus-visible:ring-offset-4"
            >
              <span className="grid size-10 place-items-center rounded-lg border border-catalyst-line bg-catalyst-white group-hover:border-catalyst-forest">
                <Mail size={17} aria-hidden="true" />
              </span>
              contact@devcatalyst.in
            </a>
            <GlobeWireframe
              className="mx-auto aspect-square w-full max-w-[390px]"
              variant="wireframesolid"
              autoRotate
              autoRotateSpeed={0.45}
              strokeWidth={0.6}
              graticuleOpacity={0.12}
            />
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
