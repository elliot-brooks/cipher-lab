import { ALPHABET_LENGTH, ASCII_A } from './constants'

/**
 * Enigma machine plugboard (Steckerbrett) for character substitution via cables.
 * Supports up to 10 cable connections. All cables are reciprocal (bidirectional).
 * @class
 */
export class Plugboard {
  private cablesUsed = 0
  private wiring: number[]

  /**
   * Initialize empty plugboard with identity wiring (no cables).
   */
  constructor() {
    this.wiring = this.initialiseWiring()
  }

  /**
   * Apply plugboard substitution to a character.
   * If no cable is connected, character passes through unchanged.
   * @param {number} characterIndex - Character index [0-25]
   * @returns {number} Substituted character index [0-25]
   */
  encrypt(characterIndex: number): number {
    return this.wiring[characterIndex]
  }

  private initialiseWiring(): number[] {
    const map = new Array<number>(ALPHABET_LENGTH)
    for (let i = 0; i < map.length; i++) {
      map[i] = i
    }
    return map
  }

  /**
   * Connect two characters with a cable (reciprocal substitution).
   * Each character can only participate in one cable.
   * @param {number} firstCharacter - First character index [0-25]
   * @param {number} secondCharacter - Second character index [0-25]
   * @throws {Error} If either character is already connected
   */
  addCable(firstCharacter: number, secondCharacter: number): void {
    if (this.isCharacterWired(firstCharacter) || this.isCharacterWired(secondCharacter)) {
      throw new Error('The specified connection already exists on the plugboard')
    }

    this.wiring[firstCharacter] = secondCharacter
    this.wiring[secondCharacter] = firstCharacter
    this.cablesUsed += 1
  }

  /**
   * Disconnect two characters (remove cable).
   * @param {number} firstCharacter - First character index [0-25]
   * @param {number} secondCharacter - Second character index [0-25]
   * @throws {Error} If the specified cable is not connected
   */
  removeCable(firstCharacter: number, secondCharacter: number): void {
    if (!this.isCharacterPairWired(firstCharacter, secondCharacter)) {
      throw new Error('The specified connection does not exist on the plugboard')
    }

    this.wiring[firstCharacter] = firstCharacter
    this.wiring[secondCharacter] = secondCharacter
    this.cablesUsed -= 1
  }

  private isCharacterWired(characterIndex: number): boolean {
    return this.wiring[characterIndex] !== characterIndex
  }

  private isCharacterPairWired(firstCharacter: number, secondCharacter: number): boolean {
    return (
      this.wiring[firstCharacter] === secondCharacter &&
      this.wiring[secondCharacter] === firstCharacter
    )
  }

  private formatCharacterPair(characterIndex: number): string {
    const firstCharacter = String.fromCharCode(characterIndex + ASCII_A)
    const secondCharacter = String.fromCharCode(this.wiring[characterIndex] + ASCII_A)
    return `${firstCharacter}${secondCharacter}`
  }

  /**
   * Get all connected cables as formatted pairs.
   * @returns {string[]} Array of cable pairs (e.g., ['AB', 'EA', 'YZ', 'ZY'])
   */
  getPairedCharacters(): string[] {
    const pairedList: string[] = []
    for (let i = 0; i < this.wiring.length; i++) {
      if (this.isCharacterWired(i)) {
        pairedList.push(this.formatCharacterPair(i))
      }
    }
    return pairedList
  }

  /**
   * Get human-readable representation of current cable configuration.
   * @returns {string} Space-separated cable pairs or empty string if no cables
   */
  getEncoding(): string {
    const pairs = this.getPairedCharacters()
    return pairs.join(' ')
  }

  getCablesUsed(): number {
    return this.cablesUsed
  }
}
