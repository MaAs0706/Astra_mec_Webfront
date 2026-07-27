import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { navLinks, siteConfig } from "@/constants/site";
import { INTRO_TIMING } from "@/constants/intro";
import { useIntroContext } from "@/context/IntroContext";
import logo from "@/assets/images/astra-logo.png";
import { Button } from "@/components/common/Button";

const FLIGHT_SECONDS = INTRO_TIMING.flightMs / 1000;

/**
 * The brand mark always shares layoutId "astra-brand" with the intro
 * title card, so Framer Motion can fly it into place. While `morphing`,
 * it renders the same text (fading out) + logo (fading in) the intro left
 * behind; once the flight settles, it collapses to a plain logo.
 */
function BrandMark({ morphing }: { morphing: boolean }) {
  if (!morphing) {
    return (
      <motion.img layoutId="astra-brand" src={logo} alt={siteConfig.name} className="h-10 w-10 rounded-full" />
    );
  }

  return (
    <motion.div
      layoutId="astra-brand"
      transition={{ duration: FLIGHT_SECONDS, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full"
    >
      <motion.span
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: FLIGHT_SECONDS, ease: "easeInOut" }}
        className="absolute whitespace-nowrap font-display text-4xl font-bold tracking-wide text-starlight-white sm:text-6xl lg:text-7xl"
      >
        {siteConfig.name}
      </motion.span>
      <motion.img
        src={logo}
        alt={siteConfig.name}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: FLIGHT_SECONDS, ease: "easeInOut" }}
        className="absolute h-10 w-10 rounded-full"
      />
    </motion.div>
  );
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `font-mono text-sm uppercase tracking-[0.08em] transition-colors ${
          isActive
            ? "text-tertiary-cyan"
            : "text-starlight-white/80 hover:text-tertiary-cyan"
        }`
      }
    >
      {({ isActive }) => (isActive ? `[ ${label} ]` : label)}
    </NavLink>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const prefersReducedMotion = useReducedMotion();
  const { morphing } = useIntroContext();

  useEffect(() => {
    function handleScroll() {
      const currentY = window.scrollY;

      if (open || currentY < 10) {
        setHidden(false);
      } else if (currentY > lastScrollY.current) {
        // Scrolling down — hide, and stay hidden while still scrolling down.
        setHidden(true);
      } else if (currentY < lastScrollY.current) {
        // Scrolling up — reveal, and stay revealed while still scrolling up.
        setHidden(false);
      }

      lastScrollY.current = currentY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  return (
    <motion.header
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: "easeInOut" }}
      className="sticky top-0 z-50 border-b border-metallic-silver/15 bg-space-black/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-20 w-full max-w-[1400px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <NavLink to="/" aria-label={siteConfig.name} className="flex items-center">
          <BrandMark morphing={morphing} />
        </NavLink>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavItem key={link.to} to={link.to} label={link.label} />
          ))}
        </nav>

        <div className="hidden md:block">
          <Button to="/contact" variant="primary" className="px-5 py-2 text-xs">
            Join Us
          </Button>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`h-0.5 w-6 bg-starlight-white transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-starlight-white transition-opacity ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-starlight-white transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-5 border-t border-metallic-silver/15 px-6 py-6 md:hidden">
          {navLinks.map((link) => (
            <div key={link.to} onClick={() => setOpen(false)}>
              <NavItem to={link.to} label={link.label} />
            </div>
          ))}
          <Button to="/contact" variant="primary" className="mt-2 w-full">
            Join Us
          </Button>
        </nav>
      )}
    </motion.header>
  );
}
