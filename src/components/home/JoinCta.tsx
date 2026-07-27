import { motion } from "framer-motion";
import { Button } from "@/components/common/Button";
import { SectionGlow } from "@/components/common/SectionGlow";

export function JoinCta() {
  return (
    <section className="container-astra pb-24 pt-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="glass-panel relative overflow-hidden rounded-lg px-8 py-14 text-center sm:px-16"
      >
        <SectionGlow
          color="rgba(0, 242, 254, 0.25)"
          className="-left-24 -top-24 h-80 w-80"
        />
        <SectionGlow
          color="rgba(139, 92, 246, 0.3)"
          className="-bottom-24 -right-24 h-80 w-80"
        />

        <div className="relative">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-tertiary-cyan">
            Recruiting — All Departments
          </span>
          <h2 className="mx-auto mt-4 max-w-xl font-display text-3xl font-semibold text-starlight-white sm:text-4xl">
            Join the crew
          </h2>
          <p className="mx-auto mt-4 max-w-md text-metallic-silver">
            No prior experience required — bring curiosity about the sky, a
            soldering iron, or both.
          </p>
          <div className="mt-8 flex justify-center">
            <Button to="/contact" variant="primary">
              Get in touch
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
