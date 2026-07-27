import { Button } from "@/components/common/Button";

interface ComingSoonProps {
  title: string;
}

/**
 * Placeholder for pages not yet designed (Events, Team, Gallery, Reports,
 * Contact). Home is the only page in scope for this build phase — see
 * ARCHITECTURE.md. Replace each with its real page as it's designed.
 */
export function ComingSoon({ title }: ComingSoonProps) {
  return (
    <section className="container-astra flex min-h-[60vh] flex-col items-center justify-center gap-6 py-24 text-center">
      <span className="font-mono text-xs uppercase tracking-[0.25em] text-tertiary-cyan">
        Under Construction
      </span>
      <h1 className="font-display text-4xl font-semibold text-starlight-white sm:text-5xl">
        {title}
      </h1>
      <p className="max-w-md text-metallic-silver">
        This section of Astra MEC hasn't launched yet. Check back soon.
      </p>
      <Button to="/" variant="ghost">
        Back to Home
      </Button>
    </section>
  );
}
