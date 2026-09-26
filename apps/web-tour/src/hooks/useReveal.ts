import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface RevealOptions {
  y?: number;
  delay?: number;
  stagger?: number;
  scrub?: boolean;
}

/**
 * Attaches a GSAP ScrollTrigger fade-up reveal to a container ref.
 * Targets all children with [data-gsap-reveal] or the ref element itself.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: RevealOptions = {}
) {
  const ref = useRef<T>(null);
  const { y = 40, delay = 0, stagger = 0.08 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = el.querySelectorAll("[data-gsap-reveal]");
    const animTargets = targets.length > 0 ? Array.from(targets) : [el];

    const ctx = gsap.context(() => {
      gsap.fromTo(
        animTargets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [y, delay, stagger]);

  return ref;
}