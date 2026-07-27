import { NavLink } from "react-router-dom";
import { navLinks, siteConfig } from "@/constants/site";
import logo from "@/assets/images/astra-logo.png";

const socialLabels = Object.keys(siteConfig.socials) as Array<
  keyof typeof siteConfig.socials
>;

export function Footer() {
  const yearsActive = new Date().getFullYear() - siteConfig.foundedYear;

  return (
    <footer className="border-t border-metallic-silver/15 bg-space-black">
      <div className="container-astra flex flex-col gap-8 py-12">
        <div className="flex flex-col justify-between gap-8 sm:flex-row">
          <div className="flex items-start gap-3">
            <img src={logo} alt={siteConfig.name} className="h-12 w-12 rounded-full" />
            <div>
              <p className="font-display text-lg font-semibold text-starlight-white">
                {siteConfig.name}
              </p>
              <p className="max-w-xs text-sm text-metallic-silver">
                {siteConfig.tagline}
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="font-mono text-xs uppercase tracking-[0.1em] text-metallic-silver hover:text-tertiary-cyan"
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex gap-5">
            {socialLabels.map((label) => (
              <a
                key={label}
                href={siteConfig.socials[label]}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs uppercase tracking-[0.1em] text-metallic-silver hover:text-tertiary-cyan"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-metallic-silver/15 pt-6 font-mono text-[11px] uppercase tracking-[0.15em] text-metallic-silver">
          <span>© {new Date().getFullYear()} {siteConfig.name}</span>
          <span className="text-tertiary-cyan/70">STATUS: ACTIVE</span>
          <span>{yearsActive}+ Years Active</span>
          <span>Model Engineering College</span>
        </div>
      </div>
    </footer>
  );
}
