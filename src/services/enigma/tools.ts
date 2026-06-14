/**
 * Character and index conversion utilities for Enigma operations.
 * All indices are in range [0-25] corresponding to A-Z.
 * @module tools
 */

import { ASCII_A } from './constants'

/**
 * Convert a numeric index to its corresponding uppercase letter.
 * @param {number} characterIndex - Index [0-25]
 * @returns {string} Corresponding letter A-Z
 */
export function convertIndexToCharacter(characterIndex: number): string {
  return String.fromCharCode(characterIndex + ASCII_A)
}

/**
 * Convert a character to its numeric index (case-insensitive).
 * @param {string} c - Single character A-Z or a-z
 * @returns {number} Index [0-25] where A/a=0, Z/z=25
 */
export function convertCharToIndex(c: string): number {
  return c.toUpperCase().charCodeAt(0) - ASCII_A
}

/**
 * Check if a string contains any duplicate characters.
 * @param {string} s - String to check
 * @returns {boolean} True if any character appears more than once
 */
export function hasDuplicateLetters(s: string): boolean {
  return new Set(s).size !== s.length
}

/**
 * Parse a two-character cable pairing string into indices.
 * Used for plugboard configuration (e.g., 'AB' -> [0, 1]).
 * @param {string} cablePairing - Two-character pairing string A-Z
 * @returns {[number, number]} Array of two indices [0-25]
 */
export function parseCablePairing(cablePairing: string): [number, number] {
  return [convertCharToIndex(cablePairing[0]), convertCharToIndex(cablePairing[1])]
}
