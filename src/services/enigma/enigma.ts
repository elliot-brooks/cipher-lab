import { ALPHABET_LENGTH, ASCII_A } from './constants'
import { Direction } from './direction'
import { Plugboard } from './plugboard'
import { Reflector } from './reflector'
import { Rotor } from './rotor'
import { convertIndexToCharacter, parseCablePairing } from './tools'

/**
 * Current state of all Enigma machine components.
 * Useful for serialization, debugging, and UI representation.
 * @typedef {Object} EnigmaSettings
 * @property {string} plugboardEncoding - Space-separated cable pairs (e.g., 'AB BA YZ ZY')
 * @property {Object} reflector - Reflector configuration snapshot
 * @property {string} reflector.name - Reflector identifier
 * @property {string} reflector.encoding - Current reflector wiring
 * @property {Array<Object>} rotors - Array of rotor snapshots [right, middle, left]
 * @property {string} rotors[].position - Physical rotor position
 * @property {string} rotors[].name - Rotor identifier
 * @property {number} rotors[].rotation - Current rotation position [0-25]
 * @property {number} rotors[].ringSetting - Current ring setting [0-25]
 * @property {string} rotors[].encoding - Current rotor wiring
 */
export type EnigmaSettings = {
  plugboardEncoding: string
  reflector: {
    name: string
    encoding: string
  }
  rotors: Array<{
    position: 'right' | 'middle' | 'left'
    name: string
    rotation: number
    ringSetting: number
    encoding: string
  }>
}

/**
 * Enigma machine simulator with plugboard, rotor, and reflector components.
 * Encrypts and decrypts messages with full Enigma behavior including double-stepping.
 * All components work together via signal path: Plugboard → Rotors → Reflector → Rotors → Plugboard.
 * @class
 */
export class Enigma {
  static readonly ROTOR_SLOT_1 = 0
  static readonly ROTOR_SLOT_2 = 1
  static readonly ROTOR_SLOT_3 = 2

  private rotors: Rotor[]
  private plugboard: Plugboard
  private reflector: Reflector

  /**
   * Initialize Enigma machine with components.
   * @param {Rotor[]} rotorsIn - Array of 3 rotors [right, middle, left]
   * @param {Plugboard} plugboard - Plugboard for character substitution
   * @param {Reflector} reflector - Reflector for signal bouncing
   */
  constructor(rotorsIn: Rotor[], plugboard: Plugboard, reflector: Reflector) {
    this.rotors = rotorsIn
    this.plugboard = plugboard
    this.reflector = reflector
  }

  setReflector(reflector: Reflector): void {
    this.reflector = reflector
  }

  getReflector(): Reflector {
    return this.reflector
  }

  getRotors(): Rotor[] {
    return this.rotors
  }

  getPlugboard(): Plugboard {
    return this.plugboard
  }

  setRotor(position: number, newRotor: Rotor): void {
    this.getRotors()[position] = newRotor
  }

  setRotors(rotors: Rotor[]): void {
    this.rotors = rotors
  }

  /**
   * Reset all rotor rotations and ring settings to 0, clear plugboard.
   */
  resetMachine(): void {
    for (const rotor of this.rotors) {
      rotor.rotation = 0
      rotor.ringSetting = 0
    }
    this.plugboard = new Plugboard()
  }

  configureRotorRingSetting(position: number, ringSetting: number): void {
    this.rotors[position].ringSetting = ringSetting
  }

  configureRotorRingSettings(ringSettings: number[]): void {
    for (let i = 0; i < ringSettings.length; i++) {
      this.rotors[i].ringSetting = ringSettings[i]
    }
  }

  configureRotorRotation(position: number, rotation: number): void {
    this.rotors[position].rotation = rotation
  }

  /**
   * Set rotation positions for all rotors at once.
   * @param {number[]} rotations - Array of rotation positions [right, middle, left]
   */
  configureRotorRotations(rotations: number[]): void {
    for (let i = 0; i < rotations.length; i++) {
      this.rotors[i].rotation = rotations[i]
    }
  }

  getCurrentRotation(): number[] {
    return [
      this.rotors[Enigma.ROTOR_SLOT_1].rotation,
      this.rotors[Enigma.ROTOR_SLOT_2].rotation,
      this.rotors[Enigma.ROTOR_SLOT_3].rotation,
    ]
  }

  getRingSettings(): number[] {
    return [
      this.rotors[Enigma.ROTOR_SLOT_1].ringSetting,
      this.rotors[Enigma.ROTOR_SLOT_2].ringSetting,
      this.rotors[Enigma.ROTOR_SLOT_3].ringSetting,
    ]
  }

  addCables(cablePairings: string[]): void {
    for (const pairing of cablePairings) {
      try {
        this.addCable(pairing)
      } catch {
        // Do nothing
      }
    }
  }

  addCable(cablePairing: string): void {
    if (!/^[A-Z]+$/.test(cablePairing) || cablePairing.length !== 2) {
      return
    }
    const [first, second] = parseCablePairing(cablePairing)
    this.plugboard.addCable(first, second)
  }

  removeCables(cablePairings: string[]): void {
    for (const pairing of cablePairings) {
      try {
        this.removeCable(pairing)
      } catch {
        // Do nothing
      }
    }
  }

  removeCable(cablePairing: string): void {
    if (!/^[A-Z]+$/.test(cablePairing) || cablePairing.length !== 2) {
      return
    }
    const [first, second] = parseCablePairing(cablePairing)
    this.plugboard.removeCable(first, second)
  }

  private rotate(): void {
    let doubleStepped = false

    if (this.rotors[Enigma.ROTOR_SLOT_2].isAtTurnoverPosition()) {
      this.rotors[Enigma.ROTOR_SLOT_2].rotate()
      this.rotors[Enigma.ROTOR_SLOT_3].rotate()
      doubleStepped = true
    }

    if (this.rotors[Enigma.ROTOR_SLOT_1].isAtTurnoverPosition() && !doubleStepped) {
      this.rotors[Enigma.ROTOR_SLOT_2].rotate()
    }

    this.rotors[Enigma.ROTOR_SLOT_1].rotate()
  }

  /**
   * Get a snapshot of all machine state for serialization or UI display.
   * @returns {EnigmaSettings} Current configuration of all components
   */
  getCurrentSettings(): EnigmaSettings {
    const positions: Array<'right' | 'middle' | 'left'> = ['right', 'middle', 'left']

    return {
      plugboardEncoding: this.plugboard.getEncoding(),
      reflector: {
        name: this.reflector.name,
        encoding: this.reflector.encoding,
      },
      rotors: this.rotors.map((rotor, idx) => ({
        position: positions[idx],
        name: rotor.name,
        rotation: rotor.rotation,
        ringSetting: rotor.ringSetting,
        encoding: rotor.encoding,
      })),
    }
  }

  decode(message: string): string {
    return this.encode(message)
  }

  /**
   * Encrypt or decrypt a message (operation is symmetric).
   * Non-alphabetic characters are passed through unchanged.
   * @param {string} message - Message to encrypt (case-insensitive)
   * @returns {string} Encrypted message (uppercase)
   */
  encode(message: string): string {
    const upperMessage = message.toUpperCase()
    let out = ''
    for (const c of upperMessage) {
      out += this.encrypt(c)
    }
    return out
  }

  getAllCurrentPossiblePaths(): string[] {
    return this.getAllPossiblePaths(this.getCurrentRotation())
  }

  getAllPossiblePaths(rotations: number[]): string[] {
    const currentRotation = this.getCurrentRotation()
    this.configureRotorRotations(rotations)

    const possibleEncryptionPaths: string[] = []
    for (let index = 0; index < ALPHABET_LENGTH; index++) {
      let charIndex = index
      let encryptionPath = ''
      encryptionPath += `${convertIndexToCharacter(charIndex)} -> `
      charIndex = this.plugboard.encrypt(charIndex)
      encryptionPath += `${convertIndexToCharacter(charIndex)} -> `

      for (let i = 0; i < this.rotors.length; i++) {
        charIndex = this.rotors[i].encrypt(charIndex, Direction.FORWARD)
        encryptionPath += `${convertIndexToCharacter(charIndex)} -> `
      }

      charIndex = this.reflector.encrypt(charIndex)
      encryptionPath += `${convertIndexToCharacter(charIndex)} -> `

      for (let i = this.rotors.length - 1; i >= 0; i--) {
        charIndex = this.rotors[i].encrypt(charIndex, Direction.BACKWARD)
        encryptionPath += `${convertIndexToCharacter(charIndex)} -> `
      }

      charIndex = this.plugboard.encrypt(charIndex)
      encryptionPath += convertIndexToCharacter(charIndex)
      possibleEncryptionPaths.push(encryptionPath)
    }

    this.configureRotorRotations(currentRotation)
    return possibleEncryptionPaths
  }

  private encrypt(character: string): string {
    if (!/[A-Z]/.test(character)) {
      return character
    }

    this.rotate()
    let newChar = character.charCodeAt(0) - ASCII_A

    newChar = this.plugboard.encrypt(newChar)
    for (let i = 0; i < this.rotors.length; i++) {
      newChar = this.rotors[i].encrypt(newChar, Direction.FORWARD)
    }

    newChar = this.reflector.encrypt(newChar)

    for (let i = this.rotors.length - 1; i >= 0; i--) {
      newChar = this.rotors[i].encrypt(newChar, Direction.BACKWARD)
    }

    newChar = this.plugboard.encrypt(newChar)
    return convertIndexToCharacter(newChar)
  }
}
