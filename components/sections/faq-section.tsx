import dynamic from "next/dynamic";
import FaqQuestions from "@/components/sections/faq-questions";

const FaqCatBoard = dynamic(() => import("@/components/sections/faq-cat-board"));

export default function FAQSection() {
  return (
    <section className="dc-faq-section" id="faq" aria-label="Frequently asked questions">
      <FaqCatBoard />
      <FaqQuestions />
    </section>
  );
}
