import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "gold" | "danger" | "ghost";

type BaseProps = {
  children: ReactNode;
  className?: string;
  variant?: Variant;
};

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type LinkProps = BaseProps & {
  href: string;
};

type BeyButtonProps = ButtonProps | LinkProps;

function getVariantClasses(variant: Variant) {
  switch (variant) {
    case "gold":
      return "bg-gradient-to-r from-amber-300 to-yellow-500 text-slate-950 shadow-[0_8px_24px_rgba(251,191,36,0.28)]";
    case "danger":
      return "bg-gradient-to-r from-rose-400 to-red-500 text-white shadow-[0_8px_24px_rgba(239,68,68,0.28)]";
    case "ghost":
      return "border border-white/10 bg-white/5 text-white hover:border-sky-400/30 hover:bg-sky-400/10";
    case "primary":
    default:
      return "bg-gradient-to-r from-sky-400 to-cyan-500 text-white shadow-[0_8px_24px_rgba(56,189,248,0.28)]";
  }
}

function buildClasses(variant: Variant, className?: string) {
  return [
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-extrabold transition",
    "hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60",
    getVariantClasses(variant),
    className ?? "",
  ].join(" ");
}

export default function BeyButton(props: BeyButtonProps) {
  const variant = props.variant ?? "primary";

  if (props.href !== undefined) {
    return (
      <Link href={props.href} className={buildClasses(variant, props.className)}>
        {props.children}
      </Link>
    );
  }

  const { children, className, type = "button", ...rest } = props;

  return (
    <button
      type={type}
      className={buildClasses(variant, className)}
      {...rest}
    >
      {children}
    </button>
  );
}