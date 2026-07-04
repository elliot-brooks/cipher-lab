import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCopy, faDice, faEnvelope, faKey, faLock, faLockOpen, faPaste, faPen, faPenNib, faRotateLeft, faXmark } from '@fortawesome/free-solid-svg-icons'
import { decrypt, encrypt, generateKeyPair, generateRandomPrime, isPrime } from '../services/rsa'
import type { DebugRsaKeyPair, RsaPrivateKey, RsaPublicKey } from '../services/rsa'
import './RsaWorkbenchPage.css'

type RsaTab = 'about' | 'keys' | 'encrypt' | 'decrypt' | 'attack'

const TABS: { id: RsaTab; label: string }[] = [
  { id: 'about',   label: 'About'   },
  { id: 'keys',    label: 'Keys'    },
  { id: 'encrypt', label: 'Encrypt' },
  { id: 'decrypt', label: 'Decrypt' },
  { id: 'attack',  label: 'Attack'  },
]

/* Small enough to keep every number readable, large enough that n = p*q
   exceeds every character code the message input can produce. */
const RANDOM_PRIME_BITS = 8

const UNICODE_CHARTS_URL = 'https://www.unicode.org/charts/'

type FieldCheck = { valid: boolean; note: string }

type KeyDerivation = {
  p: FieldCheck
  q: FieldCheck
  e: FieldCheck
  pair: DebugRsaKeyPair | null
}

function parsePositiveInt(raw: string): bigint | null {
  const trimmed = raw.trim()
  if (!/^\d+$/.test(trimmed)) return null
  return BigInt(trimmed)
}

function primeCheck(value: bigint | null): FieldCheck {
  if (value === null) return { valid: false, note: 'enter a positive whole number' }
  if (!isPrime(value)) return { valid: false, note: 'not prime' }
  return { valid: true, note: 'prime ✓' }
}

function modulusCheck(value: bigint | null): FieldCheck {
  if (value === null) return { valid: false, note: 'enter a positive whole number' }
  if (value < 2n) return { valid: false, note: 'must be at least 2' }
  return { valid: true, note: '' }
}

function exponentFieldCheck(value: bigint | null): FieldCheck {
  if (value === null) return { valid: false, note: 'enter a positive whole number' }
  if (value < 1n) return { valid: false, note: 'must be at least 1' }
  return { valid: true, note: '' }
}

function deriveKeys(pInput: string, qInput: string, eInput: string): KeyDerivation {
  const p = parsePositiveInt(pInput)
  const q = parsePositiveInt(qInput)
  const pCheck = primeCheck(p)
  let qCheck = primeCheck(q)
  if (pCheck.valid && qCheck.valid && p === q) {
    qCheck = { valid: false, note: 'must differ from p' }
  }

  const e = parsePositiveInt(eInput)
  const eCheck: FieldCheck = e === null
    ? { valid: false, note: 'enter a positive whole number' }
    : { valid: true, note: '' }

  if (p === null || q === null || e === null || !pCheck.valid || !qCheck.valid) {
    return { p: pCheck, q: qCheck, e: eCheck, pair: null }
  }

  try {
    return { p: pCheck, q: qCheck, e: eCheck, pair: generateKeyPair(p, q, e) }
  } catch (error) {
    const note = error instanceof Error ? error.message : String(error)
    return { p: pCheck, q: qCheck, e: { valid: false, note }, pair: null }
  }
}

function displayChar(char: string): string {
  return char === ' ' ? '␣' : char
}

function UnicodeLink() {
  return (
    <a href={UNICODE_CHARTS_URL} target="_blank" rel="noreferrer">
      Unicode character charts
    </a>
  )
}

type EncryptResult =
  | { ok: true; codes: number[]; blocks: string[]; ciphertext: string }
  | { ok: false; error: string }

function encryptMessage(message: string, key: RsaPublicKey): EncryptResult {
  const codes: number[] = []
  for (const char of message) {
    const code = char.codePointAt(0) as number
    if (BigInt(code) >= key.n) {
      return { ok: false, error: `'${displayChar(char)}' encodes to ${code}, which does not fit below n = ${key.n}. Use a larger modulus.` }
    }
    codes.push(code)
  }
  const width = String(key.n).length
  const blocks = codes.map((code) => String(encrypt(code, key)).padStart(width, '0'))
  return { ok: true, codes, blocks, ciphertext: blocks.join(' ') }
}

type DecryptResult =
  | { ok: true; blocks: bigint[]; codes: bigint[]; message: string }
  | { ok: false; error: string }

function decryptCiphertext(raw: string, key: RsaPrivateKey): DecryptResult {
  const blocks: bigint[] = []
  const codes: bigint[] = []
  for (const token of raw.trim().split(/\s+/)) {
    if (!/^\d+$/.test(token)) {
      return { ok: false, error: `'${token}' is not a number — ciphertext is space-separated blocks like "3000 0028"` }
    }
    const block = BigInt(token)
    if (block >= key.n) {
      return { ok: false, error: `block ${block} does not fit below n = ${key.n} — was it encrypted with a different key?` }
    }
    blocks.push(block)
    codes.push(decrypt(block, key))
  }
  try {
    return { ok: true, blocks, codes, message: codes.map((code) => String.fromCodePoint(Number(code))).join('') }
  } catch {
    return { ok: false, error: 'decrypted numbers are not valid characters — was the ciphertext encrypted with a different key?' }
  }
}

export default function RsaWorkbenchPage() {
  const [activeTab, setActiveTab] = useState<RsaTab>('about')
  const [pInput, setPInput] = useState('61')
  const [qInput, setQInput] = useState('53')
  const [eInput, setEInput] = useState('17')

  /* Encrypt / Decrypt hold their own key fields so keys can be entered
     directly; "use Keys tab" copies the derived pair across on demand. */
  const [pubN, setPubN] = useState('3233')
  const [pubE, setPubE] = useState('17')
  const [privN, setPrivN] = useState('3233')
  const [privD, setPrivD] = useState('2753')
  const [message, setMessage] = useState('HI')
  const [cipherInput, setCipherInput] = useState('')

  const derivation = useMemo(() => deriveKeys(pInput, qInput, eInput), [pInput, qInput, eInput])

  const randomize = () => {
    const p = generateRandomPrime(RANDOM_PRIME_BITS)
    let q = generateRandomPrime(RANDOM_PRIME_BITS)
    while (q === p) {
      q = generateRandomPrime(RANDOM_PRIME_BITS)
    }
    setPInput(String(p))
    setQInput(String(q))
    setEInput(String(generateKeyPair(p, q).publicKey.e))
  }

  const loadPublicKey = () => {
    if (!derivation.pair) return
    setPubN(String(derivation.pair.publicKey.n))
    setPubE(String(derivation.pair.publicKey.e))
  }

  const loadPrivateKey = () => {
    if (!derivation.pair) return
    setPrivN(String(derivation.pair.privateKey.n))
    setPrivD(String(derivation.pair.privateKey.d))
  }

  return (
    <div className="rsa-workbench">
      <div className="rsa-tabs" role="tablist" aria-label="RSA Workbench sections">
        {TABS.map(tab => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`rsa-tab ${activeTab === tab.id ? 'is-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rsa-panel">
        {activeTab === 'about'   && <AboutTab onStart={() => setActiveTab('keys')} />}
        {activeTab === 'keys'    && (
          <KeysTab
            pInput={pInput}
            qInput={qInput}
            eInput={eInput}
            onPChange={setPInput}
            onQChange={setQInput}
            onEChange={setEInput}
            derivation={derivation}
            onRandomize={randomize}
          />
        )}
        {activeTab === 'encrypt' && (
          <EncryptTab
            nInput={pubN}
            eInput={pubE}
            onNChange={setPubN}
            onEChange={setPubE}
            message={message}
            onMessageChange={setMessage}
            canLoadKeys={derivation.pair !== null}
            onLoadKeys={loadPublicKey}
          />
        )}
        {activeTab === 'decrypt' && (
          <DecryptTab
            nInput={privN}
            dInput={privD}
            onNChange={setPrivN}
            onDChange={setPrivD}
            cipherInput={cipherInput}
            onCipherChange={setCipherInput}
            canLoadKeys={derivation.pair !== null}
            onLoadKeys={loadPrivateKey}
          />
        )}
        {activeTab === 'attack'  && <StubTab name="Attack"  description="Play the role of Eve: try to break RSA by factoring the public modulus." />}
      </div>
    </div>
  )
}

type NumberFieldProps = {
  label: string
  value: string
  check: FieldCheck
  onChange: (value: string) => void
}

function NumberField({ label, value, check, onChange }: NumberFieldProps) {
  return (
    <label className="rsa-field">
      <span className="rsa-field-label">
        {label}
        <span className={`rsa-field-note ${check.valid ? 'is-ok' : 'is-bad'}`}>{check.note}</span>
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

type StepProps = {
  number: number
  title: string
  explanation: ReactNode
  detail?: string | null
}

function Step({ number, title, explanation, detail }: StepProps) {
  return (
    <li className="rsa-step">
      <span className="rsa-step-num">{number}</span>
      <div className="rsa-step-body">
        <span className="rsa-step-text">{title}</span>
        <p className="rsa-step-explain">{explanation}</p>
        {detail && <code className="rsa-step-detail">{detail}</code>}
      </div>
    </li>
  )
}

type KeysTabProps = {
  pInput: string
  qInput: string
  eInput: string
  onPChange: (value: string) => void
  onQChange: (value: string) => void
  onEChange: (value: string) => void
  derivation: KeyDerivation
  onRandomize: () => void
}

function KeysTab({ pInput, qInput, eInput, onPChange, onQChange, onEChange, derivation, onRandomize }: KeysTabProps) {
  const { pair } = derivation

  return (
    <div className="rsa-keys">
      <section className="rsa-keys-column">
        <span className="rsa-kicker">Inputs</span>
        <NumberField label="prime p" value={pInput} check={derivation.p} onChange={onPChange} />
        <NumberField label="prime q" value={qInput} check={derivation.q} onChange={onQChange} />
        <NumberField
          label="exponent e"
          value={eInput}
          check={derivation.e}
          onChange={onEChange}
        />
        <button className="rsa-randomize" type="button" onClick={onRandomize}>
          <FontAwesomeIcon icon={faDice} aria-hidden="true" /> randomize
        </button>
      </section>

      <section className="rsa-keys-column">
        <span className="rsa-kicker">Your keys</span>
        {pair ? (
          <>
            <div className="rsa-key-cards">
              <div className="rsa-key-card is-public">
                <div className="rsa-key-card-header">
                  <FontAwesomeIcon icon={faLockOpen} className="rsa-key-icon" />
                  <span className="rsa-key-label">Public key</span>
                </div>
                <code className="rsa-key-value">(n={String(pair.publicKey.n)}, e={String(pair.publicKey.e)})</code>
                <p className="rsa-key-note">Share freely</p>
              </div>
              <div className="rsa-key-card is-private">
                <div className="rsa-key-card-header">
                  <FontAwesomeIcon icon={faKey} className="rsa-key-icon" />
                  <span className="rsa-key-label">Private key</span>
                </div>
                <code className="rsa-key-value">(n={String(pair.privateKey.n)}, d={String(pair.privateKey.d)})</code>
                <p className="rsa-key-note">Never shared</p>
              </div>
            </div>
            <details className="rsa-derivation">
              <summary>How these were derived</summary>
              <dl className="rsa-derived">
                <div className="rsa-derived-row">
                  <dt>n = p·q</dt>
                  <dd>{String(pair.publicKey.n)}</dd>
                </div>
                <div className="rsa-derived-row">
                  <dt>φ(n) = (p−1)(q−1)</dt>
                  <dd>{String(pair.phi)}</dd>
                </div>
                <div className="rsa-derived-row">
                  <dt>e</dt>
                  <dd>{String(pair.publicKey.e)}</dd>
                </div>
                <div className="rsa-derived-row">
                  <dt>d = e⁻¹ mod φ(n)</dt>
                  <dd>{String(pair.privateKey.d)}</dd>
                </div>
              </dl>
            </details>
          </>
        ) : (
          <p className="rsa-note">Fix the inputs on the left to derive a key pair.</p>
        )}
      </section>
    </div>
  )
}

function CopyButton({ text }: { text: string | null }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable (permissions / insecure context) */
    }
  }

  return (
    <button className="rsa-field-action" type="button" disabled={!text} title="Copy to clipboard" onClick={copy}>
      <FontAwesomeIcon icon={copied ? faCheck : faCopy} aria-hidden="true" /> {copied ? 'copied' : 'copy'}
    </button>
  )
}

function PasteButton({ onPaste }: { onPaste: (text: string) => void }) {
  const paste = async () => {
    try {
      onPaste(await navigator.clipboard.readText())
    } catch {
      /* clipboard unavailable (permissions / insecure context) */
    }
  }

  return (
    <button className="rsa-field-action" type="button" title="Paste from clipboard" onClick={paste}>
      <FontAwesomeIcon icon={faPaste} aria-hidden="true" /> paste
    </button>
  )
}

function ClearButton({ disabled, onClear }: { disabled: boolean; onClear: () => void }) {
  return (
    <button className="rsa-field-action" type="button" disabled={disabled} title="Clear" onClick={onClear}>
      <FontAwesomeIcon icon={faXmark} aria-hidden="true" /> clear
    </button>
  )
}

type KeyConfigProps = {
  label: string
  preview: string
  canLoadKeys: boolean
  onLoadKeys: () => void
  children: ReactNode
}

function KeyConfig({ label, preview, canLoadKeys, onLoadKeys, children }: KeyConfigProps) {
  const [editing, setEditing] = useState(false)

  return (
    <div className="rsa-field">
      <span className="rsa-field-label">
        {label}
        <span className="rsa-field-buttons">
          <button
            className="rsa-field-action"
            type="button"
            disabled={!canLoadKeys}
            aria-label="Reset to the key from the Keys tab"
            title={canLoadKeys ? 'Reset to the key derived on the Keys tab' : 'The Keys tab inputs do not currently produce a valid key pair'}
            onClick={onLoadKeys}
          >
            <FontAwesomeIcon icon={faRotateLeft} aria-hidden="true" />
          </button>
          <button
            className="rsa-field-action"
            type="button"
            title={editing ? 'Finish editing the key' : 'Edit the key components'}
            onClick={() => setEditing((value) => !value)}
          >
            <FontAwesomeIcon icon={editing ? faCheck : faPen} aria-hidden="true" /> {editing ? 'done' : 'edit'}
          </button>
        </span>
      </span>
      {editing ? (
        <div className="rsa-key-fields">{children}</div>
      ) : (
        <button className="rsa-key-display" type="button" title="Edit the key components" onClick={() => setEditing(true)}>
          {preview}
        </button>
      )}
    </div>
  )
}

type EncryptTabProps = {
  nInput: string
  eInput: string
  onNChange: (value: string) => void
  onEChange: (value: string) => void
  message: string
  onMessageChange: (value: string) => void
  canLoadKeys: boolean
  onLoadKeys: () => void
}

function EncryptTab({ nInput, eInput, onNChange, onEChange, message, onMessageChange, canLoadKeys, onLoadKeys }: EncryptTabProps) {
  const n = parsePositiveInt(nInput)
  const e = parsePositiveInt(eInput)
  const nCheck = modulusCheck(n)
  const eCheck = exponentFieldCheck(e)

  const result = useMemo(() => {
    const modulus = parsePositiveInt(nInput)
    const exponent = parsePositiveInt(eInput)
    if (modulus === null || exponent === null || modulus < 2n || exponent < 1n || message.length === 0) {
      return null
    }
    return encryptMessage(message, { n: modulus, e: exponent })
  }, [nInput, eInput, message])

  const codeDetail = result?.ok
    ? [...message].map((char, index) => `${displayChar(char)}=${result.codes[index]}`).join(' · ')
    : null
  const powerDetail = result?.ok
    ? result.codes.map((code, index) => `${code}^${e} mod ${n} = ${BigInt(result.blocks[index])}`).join(' · ')
    : null

  return (
    <div className="rsa-tool-grid">
      <section className="rsa-tool-column">
        <span className="rsa-kicker">Encrypt</span>
        <KeyConfig
          label="Public key"
          preview={`(n=${nInput.trim() || '?'}, e=${eInput.trim() || '?'})`}
          canLoadKeys={canLoadKeys}
          onLoadKeys={onLoadKeys}
        >
          <NumberField label="modulus n" value={nInput} check={nCheck} onChange={onNChange} />
          <NumberField label="exponent e" value={eInput} check={eCheck} onChange={onEChange} />
        </KeyConfig>

        <label className="rsa-field">
          <span className="rsa-field-label">
            Message
            <span className="rsa-field-buttons">
              <PasteButton onPaste={onMessageChange} />
              <ClearButton disabled={message.length === 0} onClear={() => onMessageChange('')} />
            </span>
          </span>
          <textarea
            rows={4}
            value={message}
            onChange={(event) => onMessageChange(event.target.value)}
            placeholder="Type a message to encrypt"
          />
        </label>

        <div className="rsa-field">
          <span className="rsa-field-label">
            Ciphertext
            <span className="rsa-field-buttons">
              <CopyButton text={result?.ok ? result.ciphertext : null} />
            </span>
          </span>
          {result?.ok === true
            ? <div className="rsa-output-box is-cipher">{result.ciphertext}</div>
            : <div className="rsa-output-box is-cipher is-empty">{nCheck.valid && eCheck.valid ? 'Type a message above' : 'Enter a valid public key'}</div>}
          {result?.ok === false && <p className="rsa-error">{result.error}</p>}
        </div>
      </section>

      <section className="rsa-tool-column">
        <span className="rsa-kicker">How it works</span>
        <ol className="rsa-steps-list">
          <Step
            number={1}
            title="Letters → numbers"
            explanation={<>Each character is swapped for its code point from the <UnicodeLink /> — the same numbering ASCII uses.</>}
            detail={codeDetail}
          />
          <Step
            number={2}
            title="Encrypt each number"
            explanation="Each code m is raised to the power e, modulo n: c = mᵉ mod n. Only someone who knows d can reverse this."
            detail={powerDetail}
          />
          <Step
            number={3}
            title="Join the blocks"
            explanation="Each result is padded with leading zeros to the width of n and joined with spaces to form the ciphertext."
            detail={result?.ok ? result.ciphertext : null}
          />
        </ol>
      </section>
    </div>
  )
}

type DecryptTabProps = {
  nInput: string
  dInput: string
  onNChange: (value: string) => void
  onDChange: (value: string) => void
  cipherInput: string
  onCipherChange: (value: string) => void
  canLoadKeys: boolean
  onLoadKeys: () => void
}

function DecryptTab({ nInput, dInput, onNChange, onDChange, cipherInput, onCipherChange, canLoadKeys, onLoadKeys }: DecryptTabProps) {
  const n = parsePositiveInt(nInput)
  const d = parsePositiveInt(dInput)
  const nCheck = modulusCheck(n)
  const dCheck = exponentFieldCheck(d)

  const result = useMemo(() => {
    const modulus = parsePositiveInt(nInput)
    const exponent = parsePositiveInt(dInput)
    if (modulus === null || exponent === null || modulus < 2n || exponent < 1n || cipherInput.trim().length === 0) {
      return null
    }
    return decryptCiphertext(cipherInput, { n: modulus, d: exponent })
  }, [nInput, dInput, cipherInput])

  const powerDetail = result?.ok
    ? result.blocks.map((block, index) => `${block}^${d} mod ${n} = ${result.codes[index]}`).join(' · ')
    : null
  const codeDetail = result?.ok
    ? result.codes.map((code, index) => `${code}=${displayChar([...result.message][index])}`).join(' · ')
    : null

  return (
    <div className="rsa-tool-grid">
      <section className="rsa-tool-column">
        <span className="rsa-kicker">Decrypt</span>
        <KeyConfig
          label="Private key"
          preview={`(n=${nInput.trim() || '?'}, d=${dInput.trim() || '?'})`}
          canLoadKeys={canLoadKeys}
          onLoadKeys={onLoadKeys}
        >
          <NumberField label="modulus n" value={nInput} check={nCheck} onChange={onNChange} />
          <NumberField label="exponent d" value={dInput} check={dCheck} onChange={onDChange} />
        </KeyConfig>

        <label className="rsa-field">
          <span className="rsa-field-label">
            Ciphertext
            <span className="rsa-field-buttons">
              <PasteButton onPaste={onCipherChange} />
              <ClearButton disabled={cipherInput.length === 0} onClear={() => onCipherChange('')} />
            </span>
          </span>
          <textarea
            rows={4}
            value={cipherInput}
            onChange={(event) => onCipherChange(event.target.value)}
            placeholder="Space-separated blocks, e.g. 3000 0028"
          />
        </label>

        <div className="rsa-field">
          <span className="rsa-field-label">
            Recovered message
            <span className="rsa-field-buttons">
              <CopyButton text={result?.ok ? result.message : null} />
            </span>
          </span>
          {result?.ok === true
            ? <div className="rsa-output-box is-plain">{result.message}</div>
            : <div className="rsa-output-box is-plain is-empty">{nCheck.valid && dCheck.valid ? 'Paste ciphertext above' : 'Enter a valid private key'}</div>}
          {result?.ok === false && <p className="rsa-error">{result.error}</p>}
        </div>
      </section>

      <section className="rsa-tool-column">
        <span className="rsa-kicker">How it works</span>
        <ol className="rsa-steps-list">
          <Step
            number={1}
            title="Decrypt each block"
            explanation="Each ciphertext block c is raised to the power d, modulo n: m = cᵈ mod n. This undoes the encryption because e·d ≡ 1 mod φ(n)."
            detail={powerDetail}
          />
          <Step
            number={2}
            title="Numbers → letters"
            explanation={<>Each recovered number is a code point, so it maps straight back to a character via the <UnicodeLink />.</>}
            detail={codeDetail}
          />
          <Step
            number={3}
            title="Read the message"
            explanation="The characters are joined back together in order to rebuild the original message."
            detail={result?.ok ? result.message : null}
          />
        </ol>
      </section>
    </div>
  )
}

type AboutTabProps = { onStart: () => void }

function AboutTab({ onStart }: AboutTabProps) {
  return (
    <div className="rsa-about">

      {/* ① Hero */}
      <div className="rsa-hero">
        <h1 className="rsa-hero-title">RSA Encryption</h1>
        <p className="rsa-hero-subtitle">
          A public-key cryptosystem that allows two parties to exchange secrets securely, relying on the
          difficulty of factoring large numbers. It is widely used in secure communications, digital signatures, and key exchange protocols.
        </p>
      </div>

      {/* ② Trapdoor problem */}
      <section className="rsa-section">
        <h2 className="rsa-section-heading">The trapdoor problem</h2>
        <div className="rsa-trapdoor">
          <p className="rsa-note">
            RSA is based on a mathematical asymmetry: it's easy to multiply two large prime numbers together, but hard to factor the resulting product back into its prime factors.
          </p>
          <div className="rsa-trapdoor-row is-easy">
            <span className="rsa-trapdoor-badge">Easy</span>
            <code>multiply two large primes → instant</code>
          </div>
          <div className="rsa-trapdoor-row is-hard">
            <span className="rsa-trapdoor-badge">Hard</span>
            <code>factorise the result → computationally infeasible</code>
          </div>
        </div>
        <p className="rsa-note">This asymmetry is what makes RSA secure.</p>
      </section>

      {/* ③ Key generation */}
      <section className="rsa-section">
        <h2 className="rsa-section-heading">Key generation</h2>
        <pre className="rsa-steps">{[
          '1.  pick two large primes        p, q',
          '2.  compute public modulus       n = p * q',
          "3.  compute Euler's totient      φ(n) = (p-1)(q-1)",
          '4.  choose public exponent       e = 65537  (typical)',
          '5.  derive private exponent      d = e⁻¹ mod φ(n)',
          '─'.repeat(50),
          '    p, q, and φ(n) are discarded after generation',
        ].join('\n')}</pre>
        <div className="rsa-key-cards">
          <div className="rsa-key-card is-public">
            <div className="rsa-key-card-header">
              <FontAwesomeIcon icon={faLockOpen} className="rsa-key-icon" />
              <span className="rsa-key-label">Public key</span>
            </div>
            <code className="rsa-key-value">(n, e)</code>
            <p className="rsa-key-note">Share freely</p>
          </div>
          <div className="rsa-key-card is-private">
            <div className="rsa-key-card-header">
              <FontAwesomeIcon icon={faKey} className="rsa-key-icon" />
              <span className="rsa-key-label">Private key</span>
            </div>
            <code className="rsa-key-value">(n, d)</code>
            <p className="rsa-key-note">Never shared</p>
          </div>
        </div>
      </section>

      {/* ④ Encrypt & Decrypt */}
      <section className="rsa-section">
        <h2 className="rsa-section-heading">Encrypt &amp; Decrypt</h2>
        <div className="rsa-cipher-flow">
          <div className="rsa-cipher-step">
            <span className="rsa-cipher-op">Encrypt</span>
            <code className="rsa-cipher-formula">C = M<sup>e</sup> mod n</code>
            <span className="rsa-cipher-who">anyone with the public key</span>
          </div>
          <div className="rsa-cipher-arrow" aria-hidden="true">→</div>
          <div className="rsa-cipher-step">
            <span className="rsa-cipher-op">Decrypt</span>
            <code className="rsa-cipher-formula">M = C<sup>d</sup> mod n</code>
            <span className="rsa-cipher-who">only the private key holder</span>
          </div>
        </div>
        <p className="rsa-note">
          Works because <code>e · d ≡ 1 mod φ(n)</code> by construction.
        </p>
      </section>

      {/* ⑤ Where it's used */}
      <section className="rsa-section">
        <h2 className="rsa-section-heading">Where it's used</h2>
        <div className="rsa-use-cards">
          <div className="rsa-use-card">
            <FontAwesomeIcon icon={faLock} className="rsa-use-icon" />
            <span className="rsa-use-name">TLS / HTTPS</span>
            <p className="rsa-use-desc">Encrypts the session key during the handshake</p>
          </div>
          <div className="rsa-use-card">
            <FontAwesomeIcon icon={faPenNib} className="rsa-use-icon" />
            <span className="rsa-use-name">Digital Signatures</span>
            <p className="rsa-use-desc">Sign with private key, verify with public key</p>
          </div>
          <div className="rsa-use-card">
            <FontAwesomeIcon icon={faEnvelope} className="rsa-use-icon" />
            <span className="rsa-use-name">Encrypted Email</span>
            <p className="rsa-use-desc">PGP and S/MIME use RSA for key exchange</p>
          </div>
        </div>
      </section>

      <button className="rsa-cta" type="button" onClick={onStart}>
        Try it in the workbench →
      </button>

    </div>
  )
}

type StubTabProps = { name: string; description: string }

function StubTab({ name, description }: StubTabProps) {
  return (
    <div className="rsa-stub">
      <div className="rsa-stub-badge">Coming soon</div>
      <h2 className="rsa-stub-name">{name}</h2>
      <p className="rsa-stub-desc">{description}</p>
    </div>
  )
}
