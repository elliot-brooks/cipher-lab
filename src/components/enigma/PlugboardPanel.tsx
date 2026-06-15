import { useState } from 'react'

import type { Enigma } from '../../services/enigma'

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
  const canConnect = cableValue.length === 2

  const addCable = () => {
    if (canConnect) {
      const pair = normalizeCable(cableValue)

      try {
        machine.addCable(pair)
        setCableValue('')
        onChange()
      } catch {
        // Ignore duplicates/invalid pairs and keep current input.
      }
    }
  }

  const clearAll = () => {
    machine.removeCables(cables)
    onChange()
  }

  return (
    <section className="config-column">
      <div className="config-column-header">
        <span className="enigma-card-kicker">Plugboard</span>
      </div>

      <div className="subcard plugboard-subcard">
        <div className="plugboard-controls">
          <label className="field plugboard-pair-input">
            <span className="subcard-label">Pair</span>
            <input
              type="text"
              value={cableValue}
              onChange={(event) => setCableValue(normalizeCable(event.target.value))}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  addCable()
                }
              }}
              placeholder="AB"
              maxLength={2}
            />
          </label>

          <div className="plugboard-actions">
            <button className="home-primary-action plugboard-action" type="button" onClick={addCable} disabled={!canConnect}>
              Connect
            </button>
            <button className="ghost-button plugboard-action" type="button" onClick={clearAll} disabled={cables.length === 0}>
              Clear all
            </button>
          </div>
        </div>

        <div className="plugboard-connections">
          <span className="subcard-label">Wiring</span>
          <div className="plugboard-list">
            {cables.length > 0 ? (
              cables.map((pair) => (
                <button
                  key={pair}
                  className="chip-button"
                  type="button"
                  aria-label={`Disconnect ${pair}`}
                  onClick={() => {
                    machine.removeCable(pair)
                    onChange()
                  }}
                >
                  <span>
                    {pair}|{pair[1]}{pair[0]}
                  </span>
                  <span aria-hidden="true">x</span>
                </button>
              ))
            ) : (
              <span className="empty-state">No cables</span>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
