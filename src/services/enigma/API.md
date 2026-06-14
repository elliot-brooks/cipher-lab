# Enigma Simulator API

This document covers the TypeScript API for the Enigma simulator in this folder.

## Importing

```ts
import {
  Enigma,
  Plugboard,
  Reflector,
  Rotor,
  createDefaultEnigma,
  REFLECTOR_PRESETS,
  ROTOR_PRESETS,
} from './index'
```

## Quick Start

Use the default historical setup (Rotor III, II, I + UKW-B reflector):

```ts
const machine = createDefaultEnigma()

const encrypted = machine.encode('HELLO WORLD')
const decrypted = machine.decode(encrypted)

console.log({ encrypted, decrypted })
```

## Building a Custom Machine

```ts
const rotors = [
  new Rotor(ROTOR_PRESETS.V),
  new Rotor(ROTOR_PRESETS.III),
  new Rotor(ROTOR_PRESETS.II),
]

const plugboard = new Plugboard()
const reflector = new Reflector(REFLECTOR_PRESETS.UKW_C)

const machine = new Enigma(rotors, plugboard, reflector)
```

Rotor order is right to left: `[right, middle, left]`.

## Core Enigma Methods

| Method | Purpose |
| --- | --- |
| `encode(message: string): string` | Encrypt input text (also used for decryption in Enigma). |
| `decode(message: string): string` | Convenience alias for `encode`. |
| `resetMachine(): void` | Reset rotor rotations/ring settings to `0` and clear plugboard cables. |
| `getCurrentSettings(): EnigmaSettings` | Return a serializable snapshot of reflector, rotor, and plugboard state. |
| `configureRotorRotation(position: number, rotation: number): void` | Set one rotor rotation by slot index. |
| `configureRotorRotations(rotations: number[]): void` | Set all rotor rotations as `[right, middle, left]`. |
| `configureRotorRingSetting(position: number, ringSetting: number): void` | Set one rotor ring setting by slot index. |
| `configureRotorRingSettings(ringSettings: number[]): void` | Set all rotor ring settings as `[right, middle, left]`. |
| `addCable(cablePairing: string): void` | Add one plugboard cable pair such as `"AB"`. |
| `removeCable(cablePairing: string): void` | Remove one plugboard cable pair such as `"AB"`. |
| `addCables(cablePairings: string[]): void` | Add multiple plugboard cable pairs. |
| `removeCables(cablePairings: string[]): void` | Remove multiple plugboard cable pairs. |

### Rotor Configuration Snippet

```ts
machine.configureRotorRotations([0, 0, 0]) // [right, middle, left]
machine.configureRotorRingSettings([1, 4, 7])

machine.configureRotorRotation(Enigma.ROTOR_SLOT_1, 12)
machine.configureRotorRingSetting(Enigma.ROTOR_SLOT_2, 5)
```

### Plugboard Snippet

`addCable` accepts two uppercase letters (for example, `"AB"`).

```ts
machine.addCable('AB')
machine.addCable('CD')
machine.removeCable('CD')

machine.addCables(['EF', 'GH', 'IJ'])
```

## Reading Current State

Use `getCurrentSettings()` when you need a serializable snapshot for logs or UI.

```ts
const settings = machine.getCurrentSettings()

console.log(settings.reflector.name)
console.log(settings.rotors.map((r) => ({
  position: r.position,
  name: r.name,
  rotation: r.rotation,
  ringSetting: r.ringSetting,
})))
console.log(settings.plugboardEncoding)
```

## Working with Rotor Instances

`Rotor` exposes readonly config and mutable runtime properties.

```ts
const rotor = new Rotor(ROTOR_PRESETS.I)

console.log(rotor.name)             // readonly
console.log(rotor.encoding)         // readonly
console.log(rotor.turnoverPosition) // readonly

rotor.rotation = 8
rotor.ringSetting = 3

console.log(rotor.rotation)
console.log(rotor.ringSetting)
```

## Notes

- Encoding/decoding is symmetric in Enigma, so `decode` delegates to `encode`.
- Input is normalized to uppercase inside `encode`.
- Non-alphabetic characters pass through unchanged.