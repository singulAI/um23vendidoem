import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type Props = { onComplete: () => void };

const SEEN_KEY = "123v_intro_seen_v1";

/**
 * Official brand motion: 3 hammer strikes reveal "1", "2", "3",
 * then "Vendido" eases in from the right. The full lockup then scales
 * down and translates toward the navbar position before unmounting.
 */
export function BrandIntro({ onComplete }: Props) {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);

  useEffect(() => {
    const seen = typeof window !== "undefined" && sessionStorage.getItem(SEEN_KEY);
    if (seen) {
      onComplete();
      return;
    }
    const timeline = [
      [200, 1],
      [650, 2],
      [1200, 3],
      [1550, 4], // Vendido in
      [2400, 5], // transition to navbar
      [3000, -1],
    ] as const;
    const timers = timeline.map(([ms, p]) =>
      setTimeout(() => {
        if (p === -1) {
          sessionStorage.setItem(SEEN_KEY, "1");
          onComplete();
        } else {
          setPhase(p as 1 | 2 | 3 | 4 | 5);
        }
      }, ms),
    );
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const digitInit = { opacity: 0, scale: 2.4, filter: "blur(18px)" };
  const digitIn = { opacity: 1, scale: 1, filter: "blur(0px)" };
  const digitTransition = { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <AnimatePresence>
      {phase < 5 ? (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* soft glow */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{ background: "var(--gradient-hero)" }}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: phase >= 3 ? 0.9 : 0.4 }}
            transition={{ duration: 0.8 }}
          />

          <div className="relative flex items-end gap-3 leading-none">
            <motion.span
              className="font-display font-extrabold italic text-primary"
              style={{ fontSize: "clamp(64px, 12vw, 160px)", lineHeight: 1 }}
              initial={digitInit}
              animate={phase >= 1 ? digitIn : digitInit}
              transition={digitTransition}
            >
              1
            </motion.span>
            <motion.span
              className="font-display font-extrabold italic text-primary"
              style={{ fontSize: "clamp(72px, 14vw, 180px)", lineHeight: 1 }}
              initial={digitInit}
              animate={phase >= 2 ? digitIn : digitInit}
              transition={digitTransition}
            >
              2
            </motion.span>
            <motion.span
              className="font-display font-extrabold italic text-primary"
              style={{
                fontSize: "clamp(110px, 20vw, 260px)",
                lineHeight: 1,
                transform: "translateY(4px)",
              }}
              initial={digitInit}
              animate={phase >= 3 ? { ...digitIn, scale: 1.05 } : digitInit}
              transition={{ ...digitTransition, duration: 0.55 }}
            >
              3
            </motion.span>

            <motion.span
              className="ml-4 font-display font-semibold text-foreground"
              style={{ fontSize: "clamp(48px, 9vw, 120px)", lineHeight: 1 }}
              initial={{ opacity: 0, x: 40, filter: "blur(8px)" }}
              animate={
                phase >= 4
                  ? { opacity: 1, x: 0, filter: "blur(0px)" }
                  : { opacity: 0, x: 40, filter: "blur(8px)" }
              }
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Vendido
            </motion.span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
