import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowUpRight } from "lucide-react";

const EventFolderGallery = dynamic(() => import("@/components/ui/event-folder-gallery"));
import { CATEGORY_FOLDERS } from "@/components/ui/event-folder-data";

export default function GallerySection() {
  return (
    <section id="gallery" className="relative overflow-hidden bg-catalyst-paper px-6 py-28 lg:px-10" aria-labelledby="gallery-title">
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_22rem] md:items-end">
          <h2 id="gallery-title" className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-catalyst-ink sm:text-6xl">
            Events are where connection begins.
          </h2>
          <p className="text-sm leading-6 text-catalyst-muted">
            Open a folder to explore moments from our meetups, workshops, hackathons, and Catalyst Days.
          </p>
        </div>
        <div className="mt-14"><EventFolderGallery items={CATEGORY_FOLDERS} categories /></div>
        <div className="mt-10 flex justify-center">
          <Link href="/event-gallery" className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-catalyst-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-catalyst-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-catalyst-forest focus-visible:ring-offset-4">
            Explore the full event gallery
            <ArrowUpRight aria-hidden="true" size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}