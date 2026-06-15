import { describe, expect, test } from 'vitest'

import { createDefaultEnigma } from './presets'

describe('Enigma', () => {
  test('enigmaSettingsTest', () => {
    const machine = createDefaultEnigma()
    expect(machine.getCurrentSettings()).toEqual({
      plugboardEncoding: '',
      reflector: {
        name: 'UKW-B',
        encoding: 'YRUHQSLDPXNGOKMIEBFZCWVJAT',
      },
      rotors: [
        {
          position: 'right',
          name: 'III',
          rotation: 0,
          ringSetting: 0,
          encoding: 'BDFHJLCPRTXVZNYEIWGAKMUSQO',
        },
        {
          position: 'middle',
          name: 'II',
          rotation: 0,
          ringSetting: 0,
          encoding: 'AJDKSIRUXBLHWTMCQGZNPYFVOE',
        },
        {
          position: 'left',
          name: 'I',
          rotation: 0,
          ringSetting: 0,
          encoding: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
        },
      ],
    })
  })

  test('configurationTest', () => {
    const machine = createDefaultEnigma()

    const plugboardPairings = ['AB', 'YZ']
    machine.addCables(plugboardPairings)
    expect(machine.getPlugboard().getEncoding()).toBe('AB BA YZ ZY')

    machine.removeCable('AB')
    expect(machine.getPlugboard().getEncoding()).toBe('YZ ZY')

    machine.configureRotorRingSetting(0, 5)
    expect(machine.getRotors()[0].ringSetting).toBe(5)

    machine.configureRotorRotation(0, 5)
    expect(machine.getRotors()[0].rotation).toBe(5)

    machine.resetMachine()
    expect(machine.getRotors()[0].ringSetting).toBe(0)
    expect(machine.getRotors()[0].rotation).toBe(0)
    expect(machine.getPlugboard().getEncoding()).toBe('')
  })

  test('defaultEncryptionTest', () => {
    let machine = createDefaultEnigma()
    expect(machine.encode('AA AAA')).toBe('BD ZGO')

    machine = createDefaultEnigma()
    expect(machine.encode('AA AAA')).toBe('BD ZGO')
  })

  test('decryptionTest', () => {
    const inputText =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBZZZZZ'

    const machine1 = createDefaultEnigma()
    const machine2 = createDefaultEnigma()

    const cypherText = machine1.encode(inputText)
    expect(machine2.encode(cypherText)).toBe(inputText)
  })

  test('doubleStepTest', () => {
    const inputText = 'QQQQQQ'
    const machine = createDefaultEnigma()
    machine.configureRotorRotations([19, 3, 16])
    expect(machine.encode(inputText)).toBe('LIOTLD')
  })

  test('ignoresSelfPlugboardPairing', () => {
    const machine = createDefaultEnigma()

    machine.addCable('AA')
    machine.addCable('AB')

    expect(machine.getPlugboard().getEncoding()).toBe('AB BA')
  })
})
