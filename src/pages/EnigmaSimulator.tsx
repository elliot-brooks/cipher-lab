import { useState, useCallback, useMemo } from 'react'
import {
  EnigmaMachine,
  ROTORS,
  REFLECTORS,
  type EnigmaConfig,
} from '../lib/enigma'
import './EnigmaSimulator.css'

// ── Helpers ───────────────────────────────────────────────────────────────────

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function makeConfig(
  rotorIds: [string, string, string],
  ringSettings: [string, string, string],
  startPositions: [string, string, string],
  reflectorId: string,
  plugboardRaw: string,
): EnigmaConfig {
  const pairs = plugboardRaw
    .toUpperCase()
    .trim()
    .split(/\s+/)
    .filter((p) => /^[A-Z]{2}$/.test(p))

  return { rotorIds, ringSettings, startPositions, reflectorId, plugboardPairs: pairs }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function EnigmaSimulator() {
  // ── Config state ────────────────────────────────────────────────────────────
  const [rotorIds, setRotorIds] = useState<[string, string, string]>(['I', 'II', 'III'])
  const [ringSettings, setRingSettings] = useState<[string, string, string]>(['A', 'A', 'A'])
  const [startPositions, setStartPositions] = useState<[string, string, string]>(['A', 'A', 'A'])
  const [reflectorId, setReflectorId] = useState('B')
  const [plugboardRaw, setPlugboardRaw] = useState('')

  // ── I/O state ───────────────────────────────────────────────────────────────
  const [input, setInput] = useState('')

  // ── Derived output ──────────────────────────────────────────────────────────
  const output = useMemo(() => {
    try {
      const config = makeConfig(rotorIds, ringSettings, startPositions, reflectorId, plugboardRaw)
      const machine = new EnigmaMachine(config)
      return machine.encryptMessage(input.toUpperCase())
    } catch {
      return ''
    }
  }, [input, rotorIds, ringSettings, startPositions, reflectorId, plugboardRaw])

  // ── Handlers ────────────────────────────────────────────────────────────────

  const setRotor = useCallback((index: 0 | 1 | 2, value: string) => {
    setRotorIds((prev) => {
      const next = [...prev] as [string, string, string]
      next[index] = value
      return next
    })
  }, [])

  const setRing = useCallback((index: 0 | 1 | 2, value: string) => {
    setRingSettings((prev) => {
      const next = [...prev] as [string, string, string]
      next[index] = value
      return next
    })
  }, [])

  const setStart = useCallback((index: 0 | 1 | 2, value: string) => {
    setStartPositions((prev) => {
      const next = [...prev] as [string, string, string]
      next[index] = value
      return next
    })
  }, [])

  const handleSwap = () => {
    setInput(output.toLowerCase())
  }

  const handleReset = () => {
    setInput('')
    setRotorIds(['I', 'II', 'III'])
    setRingSettings(['A', 'A', 'A'])
    setStartPositions(['A', 'A', 'A'])
    setReflectorId('B')
    setPlugboardRaw('')
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="enigma">
      <div className="enigma-header">
        <h1 className="enigma-title">⚙ Enigma Simulator</h1>
        <p className="enigma-subtitle">
          Configure the machine below, type your message, and the output appears
          instantly. Because Enigma is symmetric, swapping input ↔ output
          decrypts the message with the same settings.
        </p>
      </div>

      <div className="enigma-layout">
        {/* ── Settings panel ────────────────────────────────────────────── */}
        <aside className="enigma-settings">
          <h2 className="settings-heading">Machine Settings</h2>

          {/* Rotors */}
          <section className="settings-section">
            <h3 className="settings-label">Rotors (Left → Right)</h3>
            <div className="rotor-row">
              {([0, 1, 2] as const).map((i) => (
                <RotorControl
                  key={i}
                  label={`Rotor ${i + 1}`}
                  rotorId={rotorIds[i]}
                  ringLetter={ringSettings[i]}
                  positionLetter={startPositions[i]}
                  onRotorChange={(v) => setRotor(i, v)}
                  onRingChange={(v) => setRing(i, v)}
                  onPositionChange={(v) => setStart(i, v)}
                />
              ))}
            </div>
          </section>

          {/* Reflector */}
          <section className="settings-section">
            <h3 className="settings-label">Reflector</h3>
            <div className="reflector-select">
              {REFLECTORS.map((r) => (
                <button
                  key={r.id}
                  className={`reflector-btn ${reflectorId === r.id ? 'reflector-btn--active' : ''}`}
                  onClick={() => setReflectorId(r.id)}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </section>

          {/* Plugboard */}
          <section className="settings-section">
            <h3 className="settings-label">Plugboard (Steckerbrett)</h3>
            <p className="settings-hint">
              Enter letter pairs separated by spaces, e.g. <code>AB CD EF</code>
            </p>
            <input
              className="plugboard-input"
              type="text"
              value={plugboardRaw}
              onChange={(e) => setPlugboardRaw(e.target.value)}
              placeholder="e.g. AB CD"
              spellCheck={false}
            />
          </section>

          <button className="btn btn-ghost" onClick={handleReset}>
            Reset all settings
          </button>
        </aside>

        {/* ── I/O panel ────────────────────────────────────────────────── */}
        <section className="enigma-io">
          <div className="io-panel">
            <label className="io-label" htmlFor="enigma-input">
              Input
            </label>
            <textarea
              id="enigma-input"
              className="io-textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your plaintext or ciphertext here…"
              rows={7}
              spellCheck={false}
            />
            <div className="io-meta">
              {input.replace(/[^A-Za-z]/g, '').length} characters
            </div>
          </div>

          <div className="io-actions">
            <button className="btn btn-primary" onClick={handleSwap} title="Use output as input">
              ⇅ Swap
            </button>
          </div>

          <div className="io-panel">
            <label className="io-label" htmlFor="enigma-output">
              Output
            </label>
            <textarea
              id="enigma-output"
              className="io-textarea io-textarea--output"
              value={output}
              readOnly
              rows={7}
              spellCheck={false}
            />
            <div className="io-meta">
              {output.replace(/[^A-Za-z]/g, '').length} characters
            </div>
          </div>
        </section>
      </div>

      {/* ── Explainer ────────────────────────────────────────────────────── */}
      <section className="enigma-explainer">
        <h2 className="settings-heading">How it works</h2>
        <div className="explainer-grid">
          <div className="explainer-card">
            <span className="explainer-icon">🔄</span>
            <h3>Rotors</h3>
            <p>
              Three rotors, each containing a scrambled alphabet, rotate with
              every keypress. The rightmost rotor steps on every letter; the
              others advance using a mechanical double-stepping mechanism.
            </p>
          </div>
          <div className="explainer-card">
            <span className="explainer-icon">↔</span>
            <h3>Reflector</h3>
            <p>
              After passing through all three rotors, the signal bounces off a
              reflector that pairs each letter with a different one, then travels
              back through the rotors in reverse. This makes the machine
              self-inverse: the same settings encrypt and decrypt.
            </p>
          </div>
          <div className="explainer-card">
            <span className="explainer-icon">🔌</span>
            <h3>Plugboard</h3>
            <p>
              Up to 13 letter pairs can be swapped before and after the rotor
              pass. This greatly increases the keyspace — Enigma's plugboard
              alone adds over 150 trillion possible configurations.
            </p>
          </div>
          <div className="explainer-card">
            <span className="explainer-icon">💍</span>
            <h3>Ring Settings</h3>
            <p>
              The ring setting (Ringstellung) shifts each rotor's internal wiring
              relative to its alphabet ring, adding another layer of
              configurability to the machine's key.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

// ── Sub-component: RotorControl ───────────────────────────────────────────────

interface RotorControlProps {
  label: string
  rotorId: string
  ringLetter: string
  positionLetter: string
  onRotorChange: (v: string) => void
  onRingChange: (v: string) => void
  onPositionChange: (v: string) => void
}

function RotorControl({
  label,
  rotorId,
  ringLetter,
  positionLetter,
  onRotorChange,
  onRingChange,
  onPositionChange,
}: RotorControlProps) {
  return (
    <div className="rotor-control">
      <span className="rotor-control-label">{label}</span>

      <div className="rotor-field">
        <span className="rotor-field-label">Model</span>
        <select
          className="rotor-select"
          value={rotorId}
          onChange={(e) => onRotorChange(e.target.value)}
        >
          {ROTORS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.id}
            </option>
          ))}
        </select>
      </div>

      <div className="rotor-field">
        <span className="rotor-field-label">Ring</span>
        <select
          className="rotor-select"
          value={ringLetter}
          onChange={(e) => onRingChange(e.target.value)}
        >
          {ALPHA.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="rotor-field">
        <span className="rotor-field-label">Start</span>
        <select
          className="rotor-select"
          value={positionLetter}
          onChange={(e) => onPositionChange(e.target.value)}
        >
          {ALPHA.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
