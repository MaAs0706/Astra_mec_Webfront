interface SectionHeadingProps {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`flex flex-col gap-3 ${alignment}`}>
      {eyebrow && (
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-tertiary-cyan">
          {eyebrow}
        </span>
      )}
      <h2 id={id} className="font-display text-3xl font-semibold text-starlight-white sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-metallic-silver">{description}</p>
      )}
    </div>
  );
}
