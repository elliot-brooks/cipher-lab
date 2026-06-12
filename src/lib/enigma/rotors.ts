/**
 * Enigma rotor definitions.
 *
 * Each rotor contains:
 *  - wiring: the substitution alphabet (A→wiring[0], B→wiring[1], …)
 *  - notch:  the letter at which this rotor causes the next rotor to step
 *
 * Historical Wehrmacht/Luftwaffe rotors I–V and Reflector B are included.
 */

export interface RotorSpec {
  id: string
  label: string
  wiring: string
  /** The letter position at which this rotor's notch triggers the next rotor. */
  notch: string
}

export interface ReflectorSpec {
  id: string
  label: string
  wiring: string
}

// ── Rotors ───────────────────────────────────────────────────────────────────

export const ROTORS: RotorSpec[] = [
  { id: 'I',   label: 'Rotor I',   wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', notch: 'Q' },
  { id: 'II',  label: 'Rotor II',  wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', notch: 'E' },
  { id: 'III', label: 'Rotor III', wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', notch: 'V' },
  { id: 'IV',  label: 'Rotor IV',  wiring: 'ESOVPZJAYQUIRHXLNFTGKDCMWB', notch: 'J' },
  { id: 'V',   label: 'Rotor V',   wiring: 'VZBRGITYUPSDNHLXAWMJQOFECK', notch: 'Z' },
]

// ── Reflectors ───────────────────────────────────────────────────────────────

export const REFLECTORS: ReflectorSpec[] = [
  { id: 'B', label: 'Reflector B', wiring: 'YRUHQSLDPXNGOKMIEBFZCWVJAT' },
  { id: 'C', label: 'Reflector C', wiring: 'FVPJIAOYEDRZXWGCTKUQSBNMHL' },
]
