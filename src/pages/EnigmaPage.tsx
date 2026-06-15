import { useReducer, useState } from 'react'

import './EnigmaPage.css'
import InfoHint from '../components/enigma/InfoHint'
import { createDefaultEnigma } from '../services/enigma'
import PlugboardPanel from '../components/enigma/PlugboardPanel'
import ReflectorPanel from '../components/enigma/ReflectorPanel'
import RotorPanel from '../components/enigma/RotorPanel'

export default function EnigmaPage() {
  const [machine] = useState(() => createDefaultEnigma())
  const [, forceUpdate] = useReducer((value: number) => value + 1, 0)
  const [inputText, setInputText] = useState('HELLO WORLD')
  const [lastOutput, setLastOutput] = useState('')

  const refresh = () => {
    forceUpdate()
  }

  const encode = () => {
    setLastOutput(machine.encode(inputText))
    forceUpdate()
  }

  const decode = () => {
    setLastOutput(machine.decode(inputText))
    forceUpdate()
  }

  const resetMachine = () => {
    machine.resetMachine()
    setLastOutput('')
    refresh()
  }

  return (
    <div className="enigma-page">
      <section className="enigma-hero enigma-card">
        <div>
          <h1>Enigma simulator</h1>
        </div>
      </section>

      <div className="enigma-layout">
        <section className="enigma-card enigma-control-card">
          <div className="enigma-card-header">
            <div>
              <div className="kicker-with-info">
                <span className="enigma-card-kicker">Encode</span>
                <InfoHint text="Encoding is symmetric. With identical settings, Decode reverses a ciphertext." />
              </div>
              <h2>Message</h2>
            </div>
            <button className="ghost-button" type="button" onClick={resetMachine}>
              Reset machine
            </button>
          </div>

          <div className="enigma-control-body">
            <label className="field">
              <span>Input</span>
              <textarea rows={4} value={inputText} onChange={(event) => setInputText(event.target.value)} />
            </label>

            <div className="action-row">
              <button className="home-primary-action" type="button" onClick={encode}>
                Encode
              </button>
              <button className="ghost-button" type="button" onClick={decode}>
                Decode
              </button>
            </div>

            <div className="output-block">
              <span className="subcard-label">Output</span>
              <div className="mono-block mono-block-compact">{lastOutput || 'No output yet'}</div>
            </div>
          </div>
        </section>

        <section className="enigma-card enigma-config-pane">
          <div className="enigma-card-header">
            <div>
              <div className="kicker-with-info">
                <span className="enigma-card-kicker">Configure</span>
                <InfoHint text="Top row controls rotor order, ring, and rotation. Bottom row controls reflector and plugboard." />
              </div>
              <h2>Enigma Settings</h2>
            </div>
          </div>

          <div className="enigma-machine-grid">
            <div className="enigma-machine-row enigma-machine-row-rotors">
              <RotorPanel machine={machine} onChange={refresh} />
            </div>

            <div className="enigma-machine-row enigma-machine-row-secondary">
              <ReflectorPanel machine={machine} onChange={refresh} />
              <PlugboardPanel machine={machine} onChange={refresh} />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
