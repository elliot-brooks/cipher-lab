import { describe, expect, test } from 'vitest'

import { ROTOR_PRESETS } from './presets'

describe('Rotor presets and validation', () => {
  test('prebuiltTest', () => {
    expect(ROTOR_PRESETS.I.encoding).toBe('EKMFLGDQVZNTOWYHXUSPAIBRCJ')
    expect(ROTOR_PRESETS.II.encoding).toBe('AJDKSIRUXBLHWTMCQGZNPYFVOE')
    expect(ROTOR_PRESETS.III.encoding).toBe('BDFHJLCPRTXVZNYEIWGAKMUSQO')
    expect(ROTOR_PRESETS.IV.encoding).toBe('ESOVPZJAYQUIRHXLNFTGKDCMWB')
    expect(ROTOR_PRESETS.V.encoding).toBe('VZBRGITYUPSDNHLXAWMJQOFECK')
  })
})
