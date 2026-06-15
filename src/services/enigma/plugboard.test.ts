import { describe, expect, test } from 'vitest'

import { ASCII_A } from './constants'
import { Plugboard } from './plugboard'

describe('Plugboard', () => {
  const aIndex = 'A'.charCodeAt(0) - ASCII_A
  const eIndex = 'E'.charCodeAt(0) - ASCII_A

  test('encryptionTest', () => {
    const plugboard = new Plugboard()

    plugboard.addCable(aIndex, eIndex)
    expect(plugboard.encrypt(aIndex)).toBe(eIndex)
    expect(plugboard.encrypt(eIndex)).toBe(aIndex)

    plugboard.removeCable(aIndex, eIndex)
    expect(plugboard.encrypt(aIndex)).toBe(aIndex)
    expect(plugboard.encrypt(eIndex)).toBe(eIndex)
  })

  test('initialisationTest', () => {
    const plugboard = new Plugboard()
    for (let i = 0; i < 26; i++) {
      expect(plugboard.encrypt(i)).toBe(i)
    }
  })

  test('getPairedCharacterTest', () => {
    const plugboard = new Plugboard()
    plugboard.addCable(aIndex, eIndex)
    expect(plugboard.getPairedCharacters()).toEqual(['AE', 'EA'])
  })

  test('rejectsSelfPairing', () => {
    const plugboard = new Plugboard()

    expect(() => plugboard.addCable(aIndex, aIndex)).toThrow(
      'A plugboard cable cannot connect a letter to itself',
    )
    expect(plugboard.getCablesUsed()).toBe(0)
    expect(plugboard.encrypt(aIndex)).toBe(aIndex)
  })
})
