/**
 * @module @enigma/services
 * @description TypeScript implementation of the Enigma machine cipher.
 * Provides full encryption/decryption capability with rotor, reflector, and plugboard components.
 * All components are validated at construction time for type safety.
 */

export { Enigma } from './enigma-service'
export { Direction } from './direction'
export { Plugboard } from './plugboard'
export { Reflector, type ReflectorParams } from './reflector'
export { Rotor, type RotorParams } from './rotor'
export { createDefaultEnigma, REFLECTOR_PRESETS, ROTOR_PRESETS } from './presets'
export {
  convertCharToIndex,
  convertIndexToCharacter,
  hasDuplicateLetters,
  parseCablePairing,
} from './tools'
