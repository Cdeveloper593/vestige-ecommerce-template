import { useEffect, useState } from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Class-name glue used by the installed Componentry / React Bits sources (`@/lib/utils`). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const money = (n: number) =>
  // Integers render as $485; fractional amounts always get two decimals
  // ($12.50, not $12.5) — QA 2026-11-14.
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: n % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })

/**
 * Real hook (QA 2026-11-14): the previous version read matchMedia during
 * render — a plain function wearing a hook's name. It never reacted when the
 * OS setting changed mid-session and its render-time read is exactly the
 * pattern that caused a hydration-mismatch bug in the Cerium project.
 * Now: state starts false, syncs on mount, and follows live changes.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}
