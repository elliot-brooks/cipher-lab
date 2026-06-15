import { useState } from 'react'

import type { Enigma } from '../../services/enigma'
import InfoHint from './InfoHint'

type PlugboardPanelProps = {
  machine: Enigma
  onChange: () => void
}

function normalizeCable(value: string): string {
  return value.replace(/[^a-z]/gi, '').toUpperCase().slice(0, 2)
}

export default function PlugboardPanel({ machine, onChange }: PlugboardPanelProps) {
  const [cableValue, setCableValue] = useState('')

  const plugboard = machine.getPlugboard()
  const cables = plugboard.getPairedCharacters().filter((pair) => pair[0] < pair[1])

  const addCable = () => {
    const pair = normalizeCable(cableValue)
    if (pair.length === 2) {
      machine.addCable(pair)
      setCableValue('')
      onChange()
    }
  }

  const clearAll = () => {
    machine.removeCables(cables)
    onChange()
  }

  return (
    <section className="config-column">
      <div className="config-column-header">
        <div className="config-column-label">
          <span className="enigma-card-kicker">Plugboard</span>
          <InfoHint text="Plugboard swaps letter pairs before and after the rotor path." />
        </div>
      </div>

      <div className="subcard">
        <div className="plugboard-controls">
          <label className="field plugboard-pair-input">
            <span>Cable pair</span>
            <input
              type="text"
              value={cableValue}
              onChange={(event) => setCableValue(event.target.value)}
              placeholder="AB"
              maxLength={2}
            />
          </label>
          <button className="home-primary-action" type="button" onClick={addCable}>
            Connect
          </button>
          <button className="ghost-button" type="button" onClick={clearAll} disabled={cables.length === 0}>
            Clear
          </button>
        </div>

        <div className="enigma-row">
          <div>
            <span className="subcard-label">Wiring</span>
            <div className="mono-block mono-block-compact">{plugboard.getEncoding() || 'No cables installed'}</div>
          </div>
          <div>
            <span className="subcard-label">Cables</span>
            <div className="stat-value">{cables.length}</div>
          </div>
        </div>

        <div className="plugboard-list">
          {cables.length > 0 ? (
            cables.map((pair) => (
              <button
                key={pair}
                className="chip-button"
                type="button"
                onClick={() => {
                  machine.removeCable(pair)
                  onChange()
                }}
              >
                Disconnect {pair}
              </button>
            ))
          ) : (
            <span className="empty-state">No cables</span>
          )}
        </div>
      </div>
    </section>
  )
}
