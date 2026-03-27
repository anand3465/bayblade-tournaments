type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div className={isCenter ? "mb-8 text-center" : "mb-8"}>
      {eyebrow ? (
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-sky-300/80">
          {eyebrow}
        </p>
      ) : null}

      <h1 className="bey-title text-4xl text-white sm:text-5xl">{title}</h1>

      {subtitle ? (
        <p
          className={`mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base ${
            isCenter ? "mx-auto" : ""
          }`}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}