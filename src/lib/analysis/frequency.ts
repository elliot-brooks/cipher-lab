/**
 * Frequency analysis utilities.
 *
 * This module will grow to include tools for analysing ciphertext:
 *  - Letter frequency counts and percentages
 *  - Index of Coincidence (IoC)
 *  - Bigram / trigram analysis
 *  - Expected English frequency comparison
 *
 * Currently provides foundational helpers used by future analysis tools.
 */

/** Count occurrences of each letter (A–Z) in a string, case-insensitive. */
export function letterFrequency(text: string): Map<string, number> {
  const counts = new Map<string, number>()
  for (const ch of text.toUpperCase()) {
    if (/[A-Z]/.test(ch)) {
      counts.set(ch, (counts.get(ch) ?? 0) + 1)
    }
  }
  return counts
}

/** Return the Index of Coincidence for a string. */
export function indexOfCoincidence(text: string): number {
  const freq = letterFrequency(text)
  let n = 0
  let sum = 0
  for (const count of freq.values()) {
    n += count
    sum += count * (count - 1)
  }
  if (n < 2) return 0
  return sum / (n * (n - 1))
}

/** English reference letter frequencies (percentage), A–Z. */
export const ENGLISH_FREQUENCIES: Record<string, number> = {
  A: 8.2,  B: 1.5,  C: 2.8,  D: 4.3,  E: 12.7, F: 2.2,
  G: 2.0,  H: 6.1,  I: 7.0,  J: 0.15, K: 0.77, L: 4.0,
  M: 2.4,  N: 6.7,  O: 7.5,  P: 1.9,  Q: 0.10, R: 6.0,
  S: 6.3,  T: 9.1,  U: 2.8,  V: 0.98, W: 2.4,  X: 0.15,
  Y: 2.0,  Z: 0.074,
}
