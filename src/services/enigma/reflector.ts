import { ALPHABET_LENGTH, ASCII_A } from './constants'
import { hasDuplicateLetters } from './tools'

/**
 * Configuration parameters for reflector construction.
 * @typedef {Object} ReflectorParams
 * @property {string} name - Reflector identifier (e.g., 'UKW-B')
 * @property {string} encoding - 26-character reciprocal wiring (no character maps to itself)
 */
export type ReflectorParams = {
  name: string
  encoding: string
}

/**
 * Enigma machine reflector component.
 * Implements bidirectional wiring that bounces signals back through rotors.
 * No character maps to itself; all validation occurs at construction time.
 * @class
 */
export class Reflector {
  /** Reflector identifier (e.g., 'UKW-B') */
  readonly name: string
  /** 26-character reciprocal wiring */
  readonly encoding: string
  private wiring: number[]

  /**
   * Create a new reflector with strict validation.
   * @param {ReflectorParams} params - Reflector configuration
   * @throws {Error} If encoding is not exactly 26 characters, contains duplicates, or has self-mapping
   */
  constructor(params: ReflectorParams) {
    if (!params.encoding || params.encoding.length !== ALPHABET_LENGTH) {
      throw new Error('Invalid reflector encoding: must be exactly 26 characters')
    }
    if (hasDuplicateLetters(params.encoding)) {
      throw new Error('Invalid reflector encoding: contains duplicate characters')
    }
    for (let i = 0; i < params.encoding.length; i++) {
      if (params.encoding.charCodeAt(i) - ASCII_A === i) {
        throw new Error('Invalid reflector encoding: no character can map to itself')
      }
    }

    this.name = params.name
    this.encoding = params.encoding
    this.wiring = this.configureWiring(params.encoding)
  }

  private configureWiring(encoding: string): number[] {
    const charArray = encoding.split('')
    this.wiring = new Array<number>(charArray.length)
    for (let i = 0; i < this.wiring.length; i++) {
      this.wiring[i] = charArray[i].charCodeAt(0) - ASCII_A
    }
    return this.wiring
  }

  /**
   * Reflect a character through the reflector (bidirectional).
   * @param {number} characterIndex - Character index [0-25]
   * @returns {number} Reflected character index [0-25]
   */
  encrypt(characterIndex: number): number {
    return this.wiring[characterIndex]
  }

  /**
   * Get wiring configuration for inspection.
   * @returns {number[]} Internal wiring array
   */
  getWiring(): number[] {
    return this.wiring
  }
}
