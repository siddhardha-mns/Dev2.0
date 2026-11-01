"use client";

import { useState } from "react";
import { CONTACT_EMAIL, PARTNERSHIPS_EMAIL, TEAM_CC_EMAIL, emailHref } from "@/lib/contact";
import { FAQ_CATEGORIES, FAQ_ITEMS } from "./faq-data";

const communityUrl = "https://socials.devcatalyst.in/";
const answerLinks: Record<string, string> = {
  [CONTACT_EMAIL]: emailHref(CONTACT_EMAIL),
  [PARTNERSHIPS_EMAIL]: emailHref(PARTNERSHIPS_EMAIL),
  "partnerships email": emailHref(PARTNERSHIPS_EMAIL),
  "official community joining link": communityUrl,
  "official social media pages": communityUrl,
  "community channels": communityUrl,
};

function linkedAnswer(answer: string) {
  return answer.split(/(partnerships@devcatalyst\.in|contact@devcatalyst\.in|partnerships email|official community joining link|official social media pages|community channels)/g).map((part, index) =>
    answerLinks[part]
      ? <a key={index} href={answerLinks[part]} className="font-medium underline underline-offset-4 [overflow-wrap:anywhere]">{part}</a>
      : part
  );
}

export default function FaqQuestions() {
  const [category, setCategory] = useState<typeof FAQ_CATEGORIES[number]>("Events");
  const [openIndex, setOpenIndex] = useState(-1);
  const questions = FAQ_ITEMS.filter((item) => item.category === category);

  return (
    <section className="dc-faq-content-col" aria-label="Frequently Asked Questions">
      <div className="dc-filter-bar" role="group" aria-label="Filter questions by category">
        {FAQ_CATEGORIES.map((item) => (
          <button key={item} type="button" className={`dc-filter-btn${category === item ? " active" : ""}`} aria-pressed={category === item} onClick={() => { setCategory(item); setOpenIndex(-1); }}>{item}</button>
        ))}
      </div>
      <p className="mb-6 text-sm leading-6 text-catalyst-muted">
        Please CC <strong className="font-medium text-catalyst-ink [overflow-wrap:anywhere]">{TEAM_CC_EMAIL}</strong> in every email, for both general queries and partnerships. Our email links include this automatically.
      </p>
      <div className="dc-accordion-list">
        {questions.map((item, index) => {
          const isOpen = openIndex === index;
          const id = `dc-faq-${FAQ_CATEGORIES.indexOf(category)}-${index}`;
          return (
            <article className={`dc-faq-item${isOpen ? " is-open" : ""}`} data-category={category} key={item.question}>
              <button id={`${id}-trigger`} className="dc-faq-trigger" type="button" aria-expanded={isOpen} aria-controls={`${id}-answer`} onClick={() => setOpenIndex(isOpen ? -1 : index)}>
                <span className="dc-faq-num">{String(index + 1).padStart(2, "0")}</span>
                <span className="dc-faq-cat">{category}</span>
                <span className="dc-faq-q">{item.question}</span>
                <span className="dc-faq-icon" aria-hidden="true" />
              </button>
              <div className="dc-faq-panel" id={`${id}-answer`} role="region" aria-labelledby={`${id}-trigger`} aria-hidden={!isOpen} inert={!isOpen}>
                <div className="dc-faq-panel-inner"><div className="dc-faq-answer-box whitespace-pre-line">{linkedAnswer(item.answer)}</div></div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
