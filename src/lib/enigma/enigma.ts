/**
 * Enigma machine core.
 *
 * This is an educational simulation of the 3-rotor Wehrmacht/Luftwaffe Enigma.
 * It implements:
 *   - Double-stepping anomaly (authentic rotor advance behaviour)
 *   - Configurable ring settings (Ringstellung)
 *   - Optional plugboard (Steckerbrett) as character-pair swaps
 *   - Reflector pass-through
 *
 * The machine is stateful: call `encryptChar` sequentially to
 * encrypt/decrypt a message, just as an operator would.
 * Call `reset()` to restore initial rotor positions.
 */

import { ROTORS, REFLECTORS, type RotorSpec } from './rotors'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function charIndex(c: string): number {
  return c.charCodeAt(0) - 65
}

function indexChar(i: number): string {
  return ALPHABET[(i + 26) % 26]
}

// ── Plugboard ─────────────────────────────────────────────────────────────────

/**
 * Build a bidirectional plugboard substitution map from pair strings.
 * e.g. ['AB', 'CD'] means A↔B and C↔D.
 */
function buildPlugboard(pairs: string[]): Map<string, string> {
  const board = new Map<string, string>()
  for (const pair of pairs) {
    const a = pair[0].toUpperCase()
    const b = pair[1].toUpperCase()
    board.set(a, b)
    board.set(b, a)
  }
  return board
}

function plugboardSwap(board: Map<string, string>, c: string): string {
  return board.get(c) ?? c
}

// ── Rotor ─────────────────────────────────────────────────────────────────────

class Rotor {
  private readonly forward: number[]  // forward wiring (right→left)
  private readonly backward: number[] // inverse wiring (left→right)
  private readonly notchIndex: number
  private readonly ringSetting: number // 0-based ring offset

  /** Current offset (position), 0-based (A=0 … Z=25) */
  position: number

  constructor(spec: RotorSpec, ringSetting: number, startPosition: number) {
    this.ringSetting = ringSetting
    this.position = startPosition
    this.notchIndex = charIndex(spec.notch)

    this.forward = Array.from(spec.wiring, charIndex)
    this.backward = new Array<number>(26)
    for (let i = 0; i < 26; i++) {
      this.backward[this.forward[i]] = i
    }
  }

  /** True when this rotor is sitting at its notch position. */
  atNotch(): boolean {
    return this.position === this.notchIndex
  }

  step(): void {
    this.position = (this.position + 1) % 26
  }

  /** Signal passes right→left (forward direction). */
  encodeForward(input: number): number {
    const offset = (input + this.position - this.ringSetting + 26) % 26
    const wired = this.forward[offset]
    return (wired - this.position + this.ringSetting + 26) % 26
  }

  /** Signal passes left→right (backward direction). */
  encodeBackward(input: number): number {
    const offset = (input + this.position - this.ringSetting + 26) % 26
    const wired = this.backward[offset]
    return (wired - this.position + this.ringSetting + 26) % 26
  }
}

// ── EnigmaMachine ────────────────────────────────────────────────────────────

export interface EnigmaConfig {
  /** Three rotor IDs from left to right, e.g. ['I', 'II', 'III'] */
  rotorIds: [string, string, string]
  /** Ring settings (Ringstellung) A–Z for each rotor, left to right */
  ringSettings: [string, string, string]
  /** Starting positions A–Z for each rotor, left to right */
  startPositions: [string, string, string]
  /** Reflector ID, e.g. 'B' */
  reflectorId: string
  /** Plugboard pairs, e.g. ['AB', 'CD'] */
  plugboardPairs: string[]
}

export const DEFAULT_CONFIG: EnigmaConfig = {
  rotorIds: ['I', 'II', 'III'],
  ringSettings: ['A', 'A', 'A'],
  startPositions: ['A', 'A', 'A'],
  reflectorId: 'B',
  plugboardPairs: [],
}

export class EnigmaMachine {
  private rotors: [Rotor, Rotor, Rotor]
  private reflectorWiring: number[]
  private plugboard: Map<string, string>
  private readonly config: EnigmaConfig

  constructor(config: EnigmaConfig = DEFAULT_CONFIG) {
    this.config = config
    const [left, middle, right] = config.rotorIds.map((id) => {
      const spec = ROTORS.find((r) => r.id === id)
      if (!spec) throw new Error(`Unknown rotor: ${id}`)
      return spec
    }) as [RotorSpec, RotorSpec, RotorSpec]

    const reflectorSpec = REFLECTORS.find((r) => r.id === config.reflectorId)
    if (!reflectorSpec) throw new Error(`Unknown reflector: ${config.reflectorId}`)

    this.reflectorWiring = Array.from(reflectorSpec.wiring, charIndex)
    this.plugboard = buildPlugboard(config.plugboardPairs)

    this.rotors = [
      new Rotor(left,   charIndex(config.ringSettings[0]),  charIndex(config.startPositions[0])),
      new Rotor(middle, charIndex(config.ringSettings[1]),  charIndex(config.startPositions[1])),
      new Rotor(right,  charIndex(config.ringSettings[2]),  charIndex(config.startPositions[2])),
    ]
  }

  /** Reset rotor positions back to their configured start positions. */
  reset(): void {
    const [l, m, r] = this.config.startPositions.map(charIndex) as [number, number, number]
    this.rotors[0].position = l
    this.rotors[1].position = m
    this.rotors[2].position = r
  }

  /**
   * Step rotors using the authentic double-stepping mechanism:
   *  1. If the middle rotor is at its notch, step both the left and middle rotors.
   *  2. If the right rotor is at its notch, step the middle rotor.
   *  3. Always step the right rotor.
   */
  private stepRotors(): void {
    const [left, middle, right] = this.rotors

    if (middle.atNotch()) {
      left.step()
      middle.step()
    } else if (right.atNotch()) {
      middle.step()
    }
    right.step()
  }

  /**
   * Encrypt (or decrypt — the operation is symmetric) a single uppercase letter.
   * Advances rotor positions before encoding, exactly as the real machine did.
   */
  encryptChar(letter: string): string {
    const upper = letter.toUpperCase()
    if (!/[A-Z]/.test(upper)) return letter // pass through non-alpha

    this.stepRotors()

    let idx = charIndex(upper)

    // Plugboard in
    idx = charIndex(plugboardSwap(this.plugboard, indexChar(idx)))

    // Right → middle → left rotors
    idx = this.rotors[2].encodeForward(idx)
    idx = this.rotors[1].encodeForward(idx)
    idx = this.rotors[0].encodeForward(idx)

    // Reflector
    idx = this.reflectorWiring[idx]

    // Left → middle → right rotors (reverse pass)
    idx = this.rotors[0].encodeBackward(idx)
    idx = this.rotors[1].encodeBackward(idx)
    idx = this.rotors[2].encodeBackward(idx)

    // Plugboard out
    idx = charIndex(plugboardSwap(this.plugboard, indexChar(idx)))

    return indexChar(idx)
  }

  /**
   * Encrypt (or decrypt) a full string.
   * Non-alphabetic characters are passed through unchanged.
   * Resets rotor positions to the configured start positions before encoding.
   */
  encryptMessage(plaintext: string): string {
    this.reset()
    return Array.from(plaintext)
      .map((c) => this.encryptChar(c))
      .join('')
  }

  /** Return current rotor positions as an array of letters [left, middle, right]. */
  getPositions(): [string, string, string] {
    return this.rotors.map((r) => indexChar(r.position)) as [string, string, string]
  }
}
