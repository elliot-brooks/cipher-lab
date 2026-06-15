import type { Enigma } from '../../services/enigma'

import InfoHint from './InfoHint'
import { REFLECTOR_PRESETS, Reflector } from '../../services/enigma'

const REFLECTOR_NAMES = ['UKW_A', 'UKW_B', 'UKW_C'] as const

type ReflectorPanelProps = {
  machine: Enigma
  onChange: () => void
}

export default function ReflectorPanel({ machine, onChange }: ReflectorPanelProps) {
  const reflector = machine.getReflector()

  const replaceReflector = (reflectorName: (typeof REFLECTOR_NAMES)[number]) => {
    machine.setReflector(new Reflector(REFLECTOR_PRESETS[reflectorName]))
    onChange()
  }

  return (
    <section className="config-column">
      <div className="config-column-header">
        <div className="config-column-label">
          <span className="enigma-card-kicker">Reflector</span>
          <InfoHint text="Reflector sends the signal back through the rotor stack. Switch presets to change the path." />
        </div>
      </div>

      <div className="subcard">
        <div className="subcard-header">
          <div>
            <span className="subcard-label">Current reflector</span>
            <h3>{reflector.name}</h3>
          </div>
        </div>

        <label className="field">
          <span>Preset</span>
          <select
            value={reflector.name === 'UKW-A' ? 'UKW_A' : reflector.name === 'UKW-B' ? 'UKW_B' : 'UKW_C'}
            onChange={(event) => replaceReflector(event.target.value as (typeof REFLECTOR_NAMES)[number])}
          >
            {REFLECTOR_NAMES.map((name) => (
              <option key={name} value={name}>
                {REFLECTOR_PRESETS[name].name}
              </option>
            ))}
          </select>
        </label>

        <div className="mono-block mono-block-compact">{reflector.encoding}</div>
      </div>
    </section>
  )
}
