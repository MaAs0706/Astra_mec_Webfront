import { Hero } from "@/components/home/Hero";
import { TelemetryBar } from "@/components/home/TelemetryBar";
import { Mission } from "@/components/home/Mission";
import { RecentEvents } from "@/components/home/RecentEvents";
import { GalleryTeaser } from "@/components/home/GalleryTeaser";
import { TeamTeaser } from "@/components/home/TeamTeaser";
import { JoinCta } from "@/components/home/JoinCta";

export function Home() {
  return (
    <>
      <Hero />
      <TelemetryBar />
      <RecentEvents />
      <TeamTeaser />
      <Mission />
      <GalleryTeaser />
      <JoinCta />
    </>
  );
}
