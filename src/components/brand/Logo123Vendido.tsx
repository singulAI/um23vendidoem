import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Height in px for the logo block */
  size?: number;
  showWordmark?: boolean;
};

/**
 * 123Vendido proprietary lockup.
 * - "1 2 3" in orange, italic, the "3" carries dominant visual weight.
 * - "Vendido" in white, modern sans.
 * Treat the "123" group as a proprietary symbol — never recompose.
 */
export function Logo123Vendido({ className, size = 32, showWordmark = true }: Props) {
  return (
    <span
      className={cn("inline-flex items-end gap-2 leading-none select-none", className)}
      style={{ height: size }}
      aria-label="123Vendido"
    >
      <span
        className="font-display font-extrabold italic text-primary tracking-tight"
        style={{ fontSize: size * 0.95, lineHeight: 1 }}
      >
        <span style={{ fontSize: size * 0.78 }}>1</span>
        <span style={{ fontSize: size * 0.88, marginLeft: size * 0.05 }}>2</span>
        <span
          style={{
            fontSize: size * 1.25,
            marginLeft: size * 0.06,
            display: "inline-block",
            transform: "translateY(2px)",
          }}
        >
          3
        </span>
      </span>
      {showWordmark && (
        <span
          className="font-display font-semibold text-foreground tracking-tight"
          style={{ fontSize: size * 0.78, lineHeight: 1, marginLeft: size * 0.08 }}
        >
          Vendido
        </span>
      )}
    </span>
  );
}
