import { describe, expect, test } from 'vitest'

import { REFLECTOR_PRESETS } from './presets'

describe('Reflector presets and validation', () => {
  test('prebuiltTest', () => {
    expect(REFLECTOR_PRESETS.UKW_A.encoding).toBe('EJMZALYXVBWFCRQUONTSPIKHGD')
    expect(REFLECTOR_PRESETS.UKW_B.encoding).toBe('YRUHQSLDPXNGOKMIEBFZCWVJAT')
    expect(REFLECTOR_PRESETS.UKW_C.encoding).toBe('FVPJIAOYEDRZXWGCTKUQSBNMHL')
  })
})
