import { clsx } from "clsx";
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Button({
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" }) {
  return (
    <button
      className={clsx(
        "focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-ink text-paper hover:bg-black",
        variant === "secondary" && "border border-line bg-white text-ink hover:bg-paper",
        variant === "danger" && "bg-risk text-white hover:bg-[#8e3e31]",
        className
      )}
      {...props}
    />
  );
}

export function Field({
  label,
  children,
  help
}: {
  label: string;
  children: React.ReactNode;
  help?: string;
}) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium">{label}</span>
      {children}
      {help && <span className="text-xs text-muted">{help}</span>}
    </label>
  );
}

const inputClass =
  "focus-ring h-10 rounded-md border border-line bg-white px-3 text-sm text-ink shadow-sm placeholder:text-muted";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={clsx(inputClass, props.className)} {...props} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={clsx(inputClass, props.className)} {...props} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx(
        "focus-ring min-h-24 rounded-md border border-line bg-white px-3 py-2 text-sm text-ink shadow-sm placeholder:text-muted",
        props.className
      )}
      {...props}
    />
  );
}

export function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={clsx("border-t border-line py-6", className)}>{children}</section>;
}
