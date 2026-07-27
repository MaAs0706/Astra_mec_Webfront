import type { ComponentPropsWithoutRef } from "react";
import { Link } from "react-router-dom";

type Variant = "primary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[4px] px-6 py-3 font-mono text-sm uppercase tracking-[0.1em] transition-all duration-200";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-secondary-blue to-primary-purple text-starlight-white hover:brightness-110 hover:shadow-[0_0_20px_rgba(139,92,246,0.35)]",
  ghost:
    "border border-metallic-silver/50 text-starlight-white hover:border-tertiary-cyan hover:text-tertiary-cyan hover:shadow-[0_0_15px_rgba(0,242,254,0.2)]",
};

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: Variant;
  to?: string;
}

export function Button({ variant = "primary", to, className = "", children, ...props }: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
