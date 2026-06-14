import { ALPHABET_LENGTH, ASCII_A } from './constants'
import { Direction } from './direction'
import { hasDuplicateLetters } from './tools'

/**
 * Configuration parameters for rotor construction.
 * @typedef {Object} RotorParams
 * @property {string} name - Rotor identifier (e.g., 'I', 'II', 'III')
 * @property {string} encoding - 26-character wiring mapping (must be valid permutation)
 * @property {number} turnoverPosition - Position [0-25] at which the rotor triggers double-stepping
 * @property {number} ringSetting - Ring setting [0-25] for offset adjustment
 * @property {number} startPosition - Initial rotation position [0-25]
 */
export type RotorParams = {
  name: string
  encoding: string
  turnoverPosition: number
  ringSetting: number
  startPosition: number
}

/**
 * Enigma machine rotor component.
 * Implements rotor wiring, rotation, and turnover mechanics with ring setting support.
 * All numeric inputs are normalized to range [0-25] via modulo arithmetic.
 * @class
 */
export class Rotor {
  /** Rotor identifier (e.g., 'I', 'II', 'III') */
  readonly name: string
  /** 26-character wiring mapping */
  readonly encoding: string
  /** Position at which rotor triggers double-stepping */
  readonly turnoverPosition: number

  private wiring: number[] = []
  private wiringReversed: number[] = []
  private rotationPosition: number
  private _ringSetting: number

  /**
   * Create a new rotor with validated configuration.
   * @param {RotorParams} params - Rotor configuration
   * @throws {Error} If encoding is not exactly 26 characters or contains duplicates
   */
  constructor(params: RotorParams) {
    if (!params.encoding || params.encoding.length !== ALPHABET_LENGTH) {
      throw new Error('Invalid rotor encoding: must be exactly 26 characters')
    }
    if (hasDuplicateLetters(params.encoding)) {
      throw new Error('Invalid rotor encoding: contains duplicate characters')
    }

    this.name = params.name
    this.encoding = params.encoding
    this.turnoverPosition = params.turnoverPosition
    this.configureWiring()
    this.rotationPosition = ((params.startPosition % ALPHABET_LENGTH) + ALPHABET_LENGTH) % ALPHABET_LENGTH
    this._ringSetting = ((params.ringSetting % ALPHABET_LENGTH) + ALPHABET_LENGTH) % ALPHABET_LENGTH
  }

  /**
   * Encrypt a character index through the rotor in the specified direction.
   * Accounts for rotor rotation and ring setting offset.
   * @param {number} characterIndex - Character index [0-25]
   * @param {Direction} dir - Signal direction (FORWARD or BACKWARD)
   * @returns {number} Encrypted character index [0-25]
   */
  encrypt(characterIndex: number, dir: Direction): number {
    const rotorShift = this.rotationPosition - this._ringSetting

    if (dir === Direction.FORWARD) {
      return (
        this.wiring[(characterIndex + rotorShift + ALPHABET_LENGTH) % ALPHABET_LENGTH] -
        rotorShift +
        ALPHABET_LENGTH
      ) % ALPHABET_LENGTH
    }

    return (
      this.wiringReversed[(characterIndex + rotorShift + ALPHABET_LENGTH) % ALPHABET_LENGTH] -
      rotorShift +
      ALPHABET_LENGTH
    ) % ALPHABET_LENGTH
  }

  private configureWiringForward(): void {
    const charArray = this.encoding.split('')
    this.wiring = new Array<number>(charArray.length)
    for (let i = 0; i < this.wiring.length; i++) {
      this.wiring[i] = charArray[i].charCodeAt(0) - ASCII_A
    }
  }

  private configureWiringBackwards(): void {
    this.wiringReversed = new Array<number>(this.wiring.length)
    for (let i = 0; i < this.wiringReversed.length; i++) {
      const cypherCharacter = this.wiring[i]
      this.wiringReversed[cypherCharacter] = i
    }
  }

  configureWiring(): void {
    this.configureWiringForward()
    this.configureWiringBackwards()
  }

  /**
   * Get current rotation position [0-25].
   */
  get rotation(): number {
    return this.rotationPosition
  }

  /**
   * Set rotation position, normalized to [0-25].
   */
  set rotation(newRotation: number) {
    this.rotationPosition = ((newRotation % ALPHABET_LENGTH) + ALPHABET_LENGTH) % ALPHABET_LENGTH
  }

  /**
   * Get current ring setting [0-25].
   */
  get ringSetting(): number {
    return this._ringSetting
  }

  /**
   * Set ring setting, normalized to [0-25].
   */
  set ringSetting(setting: number) {
    this._ringSetting = ((setting % ALPHABET_LENGTH) + ALPHABET_LENGTH) % ALPHABET_LENGTH
  }

  /**
   * Check if rotor is at turnover position (triggers double-stepping).
   * @returns {boolean} True if current rotation equals turnover position
   */
  isAtTurnoverPosition(): boolean {
    return this.rotationPosition === this.turnoverPosition
  }

  /**
   * Advance rotor to next position. Wraps around after position 25.
   */
  rotate(): void {
    this.rotationPosition = (this.rotationPosition + 1) % ALPHABET_LENGTH
  }
}
