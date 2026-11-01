"use client";

import { LazyMotion, domAnimation, m } from "motion/react";

export default function ContactHeader({
  subtitle,
  title,
  description,
}: {
  subtitle: string;
  title: string;
  description: string;
}) {
  return (
    <LazyMotion features={domAnimation}>
      <div className="mb-14 text-center">
        <m.span
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex rounded-full border border-catalyst-line bg-catalyst-white px-4 py-1.5 text-sm font-medium"
        >
          {subtitle}
        </m.span>
        <m.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-4 text-4xl font-bold tracking-[-0.035em] md:text-6xl"
        >
          {title}
        </m.h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-catalyst-muted">{description}</p>
      </div>
    </LazyMotion>
  );
}
