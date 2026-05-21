import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-white text-black shadow-lg shadow-black/20 hover:bg-zinc-100 active:scale-[0.98]",
  secondary:
    "border border-white/20 bg-white/10 text-white hover:bg-white/15 active:scale-[0.98]",
  ghost: "text-white/80 hover:bg-white/10 active:scale-[0.98]",
};

export default function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`min-h-12 rounded-full px-6 py-3.5 text-base font-semibold transition ${variantClass[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
