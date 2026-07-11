"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "whileHover" | "whileTap"> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--green-deep)] text-white border-transparent shadow-md hover:shadow-lg",
  secondary:
    "bg-[var(--orange)] text-white border-transparent shadow-md hover:shadow-lg",
  outline:
    "bg-transparent text-[var(--green-deep)] border-[var(--green-soft)] hover:bg-[var(--bg-soft)]",
  ghost:
    "bg-transparent text-[var(--green-main)] border-transparent hover:text-[var(--green-deep)] hover:bg-[var(--bg-soft)]",
};

const sizeStyles: Record<string, string> = {
  sm: "px-4 py-2 text-sm rounded-xl",
  md: "px-6 py-3 text-base rounded-xl",
  lg: "px-8 py-4 text-lg rounded-2xl",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
      className={`inline-flex items-center justify-center font-medium cursor-pointer border transition-shadow
        ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
