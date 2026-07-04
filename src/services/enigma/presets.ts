import { Enigma } from './enigma-service'
import { Plugboard } from './plugboard'
import { Reflector } from './reflector'
import { Rotor } from './rotor'

/**
 * Historical Enigma rotor configurations.
 * Each preset includes standard wiring, turnover position, and default ring/start settings.
 * @constant {Object}
 */
export const ROTOR_PRESETS = {
  I: {
    name: 'I',
    encoding: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
    turnoverPosition: 16,
    ringSetting: 0,
    startPosition: 0,
  },
  II: {
    name: 'II',
    encoding: 'AJDKSIRUXBLHWTMCQGZNPYFVOE',
    turnoverPosition: 4,
    ringSetting: 0,
    startPosition: 0,
  },
  III: {
    name: 'III',
    encoding: 'BDFHJLCPRTXVZNYEIWGAKMUSQO',
    turnoverPosition: 21,
    ringSetting: 0,
    startPosition: 0,
  },
  IV: {
    name: 'IV',
    encoding: 'ESOVPZJAYQUIRHXLNFTGKDCMWB',
    turnoverPosition: 9,
    ringSetting: 0,
    startPosition: 0,
  },
  V: {
    name: 'V',
    encoding: 'VZBRGITYUPSDNHLXAWMJQOFECK',
    turnoverPosition: 25,
    ringSetting: 0,
    startPosition: 0,
  },
} as const

/**
 * Historical Enigma reflector configurations.
 * Each reflector provides bidirectional wiring without self-mappings.
 * @constant {Object}
 */
export const REFLECTOR_PRESETS = {
  UKW_A: { name: 'UKW-A', encoding: 'EJMZALYXVBWFCRQUONTSPIKHGD' },
  UKW_B: { name: 'UKW-B', encoding: 'YRUHQSLDPXNGOKMIEBFZCWVJAT' },
  UKW_C: { name: 'UKW-C', encoding: 'FVPJIAOYEDRZXWGCTKUQSBNMHL' },
} as const

/**
 * Factory function to create a fully configured Enigma machine with historical defaults.
 * Rotors: III (right), II (middle), I (left)
 * Reflector: UKW-B
 * Plugboard: Empty
 * @returns {Enigma} Configured machine ready to encrypt
 */
export function createDefaultEnigma(): Enigma {
  const rotors = [
    new Rotor(ROTOR_PRESETS.III),
    new Rotor(ROTOR_PRESETS.II),
    new Rotor(ROTOR_PRESETS.I),
  ]

  return new Enigma(rotors, new Plugboard(), new Reflector(REFLECTOR_PRESETS.UKW_B))
}
