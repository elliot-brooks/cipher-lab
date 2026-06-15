import type { Enigma } from '../../services/enigma'

import InfoHint from './InfoHint'
import { ROTOR_PRESETS, Rotor } from '../../services/enigma'

const ROTOR_NAMES = ['I', 'II', 'III', 'IV', 'V'] as const

type RotorPanelProps = {
  machine: Enigma
  onChange: () => void
}

export default function RotorPanel({ machine, onChange }: RotorPanelProps) {
  const rotors = machine.getRotors()

  const replaceRotor = (slot: number, rotorName: (typeof ROTOR_NAMES)[number]) => {
    const currentRotor = rotors[slot]
    const preset = ROTOR_PRESETS[rotorName]

    machine.setRotor(
      slot,
      new Rotor({
        ...preset,
        startPosition: currentRotor.rotation,
        ringSetting: currentRotor.ringSetting,
      }),
    )
    onChange()
  }

  const updateRotation = (slot: number, value: string) => {
    machine.configureRotorRotation(slot, Number(value))
    onChange()
  }

  const updateRing = (slot: number, value: string) => {
    machine.configureRotorRingSetting(slot, Number(value))
    onChange()
  }

  return (
    <section className="config-column">
      <div className="config-column-header">
        <div className="config-column-label">
          <span className="enigma-card-kicker">Rotor stack</span>
          <InfoHint text="Rotor order is right to left. Notch indicates the turnover position for stepping." />
        </div>
      </div>

      <div className="rotor-grid">
        {rotors.map((rotor, index) => (
          <article className="subcard" key={rotor.name + index}>
            <div className="subcard-header">
              <div>
                <span className="subcard-label">Slot {index + 1}</span>
                <h3>{rotor.name}</h3>
              </div>
              <span className="subcard-pill" title={`Rotor notch at ${String.fromCharCode(65 + rotor.turnoverPosition)}`}>
                Notch {String.fromCharCode(65 + rotor.turnoverPosition)}
              </span>
            </div>

            <label className="field">
              <span>Rotor preset</span>
              <select value={rotor.name} onChange={(event) => replaceRotor(index, event.target.value as (typeof ROTOR_NAMES)[number])}>
                {ROTOR_NAMES.map((name) => (
                  <option key={name} value={name}>
                    Rotor {name}
                  </option>
                ))}
              </select>
            </label>

            <div className="field-grid">
              <label className="field">
                <span>Rotation</span>
                <input type="range" min="0" max="25" value={rotor.rotation} onChange={(event) => updateRotation(index, event.target.value)} />
                <output>{rotor.rotation}</output>
              </label>
              <label className="field">
                <span>Ring setting</span>
                <input type="range" min="0" max="25" value={rotor.ringSetting} onChange={(event) => updateRing(index, event.target.value)} />
                <output>{rotor.ringSetting}</output>
              </label>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
