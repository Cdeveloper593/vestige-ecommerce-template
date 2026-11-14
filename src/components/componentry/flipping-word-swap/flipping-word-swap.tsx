"use client";

import { cn } from "@/lib/utils";
import gsap from "gsap";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

const graphemeSegmenter =
  typeof Intl.Segmenter === "function"
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null;

function segmentCharacters(text: string) {
  if (!graphemeSegmenter) return Array.from(text);
  return Array.from(graphemeSegmenter.segment(text), ({ segment }) => segment);
}

export interface FlippingWordSwapProps {
  /** The word or short phrase shown at rest. */
  word1: string;
  /** The word or short phrase revealed on interaction. */
  word2: string;
  /** Duration of each character flip in milliseconds. */
  duration?: number;
  /** Delay between neighboring character flips in milliseconds. */
  stagger?: number;
  /** Additional classes applied to the interactive container. */
  className?: string;
  /** Additional classes applied only to the revealed word. */
  toClassName?: string;
  /** Inline styles applied to the interactive container. */
  style?: CSSProperties;
  /** Inline styles applied only to the revealed word. */
  toStyle?: CSSProperties;
}

export function FlippingWordSwap({
  word1,
  word2,
  duration = 400,
  stagger = 44,
  className,
  toClassName,
  style,
  toStyle,
}: FlippingWordSwapProps) {
  const containerRef = useRef<HTMLButtonElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const swappedRef = useRef(false);
  const [isSwapped, setIsSwapped] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const resolvedDuration = prefersReducedMotion
      ? 0
      : Math.max(180, duration) / 1000;
    const resolvedStagger = prefersReducedMotion
      ? 0
      : Math.max(0, stagger) / 1000;

    const context = gsap.context(() => {
      const firstWord = gsap.utils.toArray<HTMLElement>(
        '[data-flip-word="first"]',
      );
      const secondWord = gsap.utils.toArray<HTMLElement>(
        '[data-flip-word="second"]',
      );

      gsap.set(firstWord, {
        rotationX: 0,
        opacity: 1,
        transformOrigin: "center top",
      });
      gsap.set(secondWord, {
        rotationX: -82,
        opacity: 0,
        transformOrigin: "center bottom",
      });

      // Fit the container to the *displayed* word, not the wider one.
      // As shipped, the stacked-words box is sized by the wider word, so
      // when the narrower word shows, the space between it and whatever
      // follows inline (e.g. a comma) pools inside the box and the
      // punctuation detaches. Measure each word's natural width from its
      // character spans and animate the container width alongside the flip.
      const rowWidth = (chars: HTMLElement[]) => {
        if (!chars.length) return 0;
        const row = chars[0].parentElement;
        const gap = row
          ? parseFloat(getComputedStyle(row).columnGap) || 0
          : 0;
        return (
          chars.reduce((sum, c) => sum + c.offsetWidth, 0) +
          gap * (chars.length - 1)
        );
      };
      const widthFirst = rowWidth(firstWord);
      const widthSecond = rowWidth(secondWord);
      gsap.set(containerRef.current, {
        width: swappedRef.current ? widthSecond : widthFirst,
      });

      const timeline = gsap.timeline({ paused: true });
      timeline
        .to(firstWord, {
          rotationX: 82,
          opacity: 0,
          duration: resolvedDuration,
          stagger: resolvedStagger,
          ease: "power2.in",
        })
        .to(
          secondWord,
          {
            rotationX: 0,
            opacity: 1,
            duration: resolvedDuration,
            stagger: resolvedStagger,
            ease: "power2.out",
          },
          `<${resolvedDuration * 0.62}`,
        );

      // Width follows the flip: shrink/grow starts once the outgoing word
      // is mostly rotated away and runs through the incoming word settling.
      // Reversing the timeline reverses the width with it.
      if (Math.abs(widthFirst - widthSecond) > 0.5) {
        const total = timeline.duration();
        timeline.to(
          containerRef.current,
          {
            // Function-based so a resize/font swap re-measures the target
            // when the tween next plays from the resting state.
            width: () => rowWidth(secondWord),
            duration: total * 0.55,
            ease: "power2.inOut",
          },
          total * 0.45,
        );
      }

      if (swappedRef.current) timeline.progress(1);
      timelineRef.current = timeline;
    }, containerRef);

    // Font swaps and breakpoint font-size changes alter the natural word
    // widths — re-measure and re-fit the resting width when they happen.
    // Skipped mid-flip: the timeline owns the width while it runs.
    const refit = () => {
      const container = containerRef.current;
      if (!container || timelineRef.current?.isActive()) return;
      const charsOf = (layer: string) =>
        Array.from(
          container.querySelectorAll<HTMLElement>(
            `[data-flip-word="${layer}"]`,
          ),
        );
      const widthOf = (chars: HTMLElement[]) => {
        if (!chars.length) return 0;
        const row = chars[0].parentElement;
        const gap = row
          ? parseFloat(getComputedStyle(row).columnGap) || 0
          : 0;
        return (
          chars.reduce((sum, c) => sum + c.offsetWidth, 0) +
          gap * (chars.length - 1)
        );
      };
      gsap.set(container, {
        width: swappedRef.current
          ? widthOf(charsOf("second"))
          : widthOf(charsOf("first")),
      });
    };
    window.addEventListener("resize", refit);
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) refit();
    });

    return () => {
      cancelled = true;
      window.removeEventListener("resize", refit);
      timelineRef.current = null;
      context.revert();
    };
  }, [duration, stagger, word1, word2]);

  const updateSwap = useCallback((next: boolean) => {
    swappedRef.current = next;
    setIsSwapped(next);

    if (next) {
      timelineRef.current?.play();
    } else {
      timelineRef.current?.reverse();
    }
  }, []);

  const renderCharacters = (text: string, layer: "first" | "second") =>
    segmentCharacters(text).map((character, index) => (
      <span
        key={`${layer}-${index}-${character}`}
        data-flip-word={layer}
        className="inline-block whitespace-pre [backface-visibility:hidden] [will-change:transform,opacity]"
      >
        {character === " " ? "\u00a0" : character}
      </span>
    ));

  return (
    <button
      ref={containerRef}
      type="button"
      className={cn(
        "relative inline-grid cursor-pointer select-none border-0 bg-transparent p-0 align-baseline font-[inherit] leading-[inherit] tracking-[inherit] text-[inherit]",
        "rounded-[0.08em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/30 focus-visible:ring-offset-2",
        className,
      )}
      aria-label={isSwapped ? word2 : word1}
      aria-pressed={isSwapped}
      style={style}
      onMouseEnter={() => updateSwap(true)}
      onMouseLeave={() => updateSwap(false)}
      onPointerUp={(event) => {
        if (event.pointerType !== "mouse") updateSwap(!swappedRef.current);
      }}
      onFocus={(event) => {
        if (event.currentTarget.matches(":focus-visible")) updateSwap(true);
      }}
      onBlur={() => updateSwap(false)}
    >
      <span className="col-start-1 row-start-1 inline-grid overflow-hidden [perspective:800px]">
        <span
          className="col-start-1 row-start-1 inline-flex items-baseline justify-center gap-[0.012em] whitespace-pre"
          aria-hidden="true"
        >
          {renderCharacters(word1, "first")}
        </span>
        <span
          className={cn(
            "col-start-1 row-start-1 inline-flex items-baseline justify-center gap-[0.012em] whitespace-pre",
            toClassName,
          )}
          aria-hidden="true"
          style={toStyle}
        >
          {renderCharacters(word2, "second")}
        </span>
      </span>
    </button>
  );
}
