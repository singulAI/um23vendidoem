import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Logo123Vendido } from "@/components/brand/Logo123Vendido";

/**
 * Shared shell for institutional pages (Sobre, Planos, LGPD, etc.).
 * Keeps brand chrome consistent without touching the landing hero.
 */
export function PublicPage({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center">
            <Logo123Vendido size={26} />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar ao site
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
          {description && (
            <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
          )}
        </motion.div>

        <div className="prose prose-invert mt-10 max-w-none text-muted-foreground prose-headings:font-display prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary">
          {children}
        </div>
      </main>

      <footer className="border-t border-border py-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} 123Vendido · Todos os direitos reservados
      </footer>
    </div>
  );
}
