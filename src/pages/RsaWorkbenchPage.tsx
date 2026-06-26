import { useState } from 'react'
import './RsaWorkbenchPage.css'

type RsaTab = 'about' | 'keys' | 'encrypt' | 'decrypt' | 'attack'

const TABS: { id: RsaTab; label: string }[] = [
  { id: 'about',   label: 'About'   },
  { id: 'keys',    label: 'Keys'    },
  { id: 'encrypt', label: 'Encrypt' },
  { id: 'decrypt', label: 'Decrypt' },
  { id: 'attack',  label: 'Attack'  },
]

export default function RsaWorkbenchPage() {
  const [activeTab, setActiveTab] = useState<RsaTab>('about')

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
        {activeTab === 'about'   && <AboutTab   onStart={() => setActiveTab('keys')} />}
        {activeTab === 'keys'    && <StubTab name="Keys"    description="Generate your RSA key pair by choosing two prime numbers and a public exponent." />}
        {activeTab === 'encrypt' && <StubTab name="Encrypt" description="Convert a plaintext message to ciphertext using your public key." />}
        {activeTab === 'decrypt' && <StubTab name="Decrypt" description="Recover the original message from ciphertext using your private key." />}
        {activeTab === 'attack'  && <StubTab name="Attack"  description="Play the role of Eve: try to break RSA by factoring the public modulus." />}
      </div>
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
              <span className="rsa-key-icon">🔓</span>
              <span className="rsa-key-label">Public key</span>
            </div>
            <code className="rsa-key-value">(n, e)</code>
            <p className="rsa-key-note">Share freely</p>
          </div>
          <div className="rsa-key-card is-private">
            <div className="rsa-key-card-header">
              <span className="rsa-key-icon">🔑</span>
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
            <span className="rsa-use-icon">🔒</span>
            <span className="rsa-use-name">TLS / HTTPS</span>
            <p className="rsa-use-desc">Encrypts the session key during the handshake</p>
          </div>
          <div className="rsa-use-card">
            <span className="rsa-use-icon">✍</span>
            <span className="rsa-use-name">Digital Signatures</span>
            <p className="rsa-use-desc">Sign with private key, verify with public key</p>
          </div>
          <div className="rsa-use-card">
            <span className="rsa-use-icon">✉</span>
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
