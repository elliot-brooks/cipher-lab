import { describe, expect, test } from 'vitest'

import { Direction } from './direction'
import { ROTOR_PRESETS } from './presets'
import { Rotor } from './rotor'
import { convertIndexToCharacter } from './tools'

describe('Rotor', () => {
  test('testEncryptionForward', () => {
    const firstRotor = new Rotor(ROTOR_PRESETS.I)
    const inputText = [0, 0, 0, 0]
    const expectedOutput = 'JKCH'

    let output = ''
    for (const i of inputText) {
      firstRotor.rotate()
      const newChar = firstRotor.encrypt(i, Direction.FORWARD)
      output += convertIndexToCharacter(newChar)
    }

    expect(output).toBe(expectedOutput)
  })

  test('testEncryptionBackwards', () => {
    const firstRotor = new Rotor(ROTOR_PRESETS.I)
    const inputText = [9, 10, 2, 7]
    firstRotor.rotation = 0
    const expectedOutput = 'AAAA'

    let output = ''
    for (const i of inputText) {
      firstRotor.rotate()
      const newChar = firstRotor.encrypt(i, Direction.BACKWARD)
      output += convertIndexToCharacter(newChar)
    }

    expect(output).toBe(expectedOutput)
  })
})
