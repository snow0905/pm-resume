import type { ReactNode } from "react";

interface TagProps {
  label: string;
  variant?: "green" | "orange" | "muted";
  className?: string;
  children?: ReactNode;
}

const variantStyles: Record<string, string> = {
  green:
    "bg-[rgba(167,193,168,0.25)] text-[var(--green-deep)] border-[rgba(167,193,168,0.35)]",
  orange:
    "bg-[var(--orange-soft)] text-[var(--orange)] border-[rgba(242,155,88,0.3)]",
  muted:
    "bg-[var(--bg-soft)] text-[var(--text-secondary)] border-[var(--line-soft)]",
};

export default function Tag({
  label,
  variant = "green",
  className = "",
  children,
}: TagProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-lg border ${variantStyles[variant]} ${className}`}
    >
      {children}
      {label}
    </span>
  );
}
