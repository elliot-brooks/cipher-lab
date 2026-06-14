import { describe, expect, test } from 'vitest'

import { REFLECTOR_PRESETS } from './presets'
import { Reflector } from './reflector'
import { convertIndexToCharacter } from './tools'

describe('Reflector', () => {
  test('encryptionTest', () => {
    const reflectorUnderTest = new Reflector(REFLECTOR_PRESETS.UKW_B)
    const encodingString = 'YRUHQSLDPXNGOKMIEBFZCWVJAT'

    let output = ''
    for (let i = 0; i < 26; i++) {
      output += convertIndexToCharacter(reflectorUnderTest.encrypt(i))
    }

    expect(output).toBe(encodingString)
  })

  test('testGetters', () => {
    const reflectorUnderTest = new Reflector(REFLECTOR_PRESETS.UKW_B)
    expect(reflectorUnderTest.encoding).toBe('YRUHQSLDPXNGOKMIEBFZCWVJAT')
    expect(reflectorUnderTest.name).toBe('UKW-B')
  })
})
