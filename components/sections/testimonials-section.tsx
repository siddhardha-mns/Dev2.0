import dynamic from "next/dynamic";

const ClientFeedback = dynamic(() => import("@/components/ui/testimonial"));

export default function TestimonialsSection() {
  return (
    <section id="testimonials" aria-label="Community testimonials">
      <ClientFeedback />
    </section>
  );
}
