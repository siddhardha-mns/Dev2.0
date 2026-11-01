import dynamic from "next/dynamic";

const DoodleCrewFooter = dynamic(() => import("@/components/ui/doodle-crew-footer"));

export default function SiteFooter() {
  return <DoodleCrewFooter />;
}
