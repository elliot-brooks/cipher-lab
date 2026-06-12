import type { Page } from '../App'
import './Home.css'

interface HomeProps {
  onNavigate: (page: Page) => void
}

interface ToolCard {
  id: Page | null
  icon: string
  title: string
  description: string
  status: 'available' | 'coming-soon'
}

const TOOL_CARDS: ToolCard[] = [
  {
    id: 'enigma',
    icon: '⚙',
    title: 'Enigma Simulator',
    description:
      'Simulate the historic Enigma cipher machine. Configure rotors, ring settings, and a plugboard to encrypt or decrypt messages step by step.',
    status: 'available',
  },
  {
    id: null,
    icon: '📊',
    title: 'Frequency Analysis',
    description:
      'Analyse the letter-frequency distribution of ciphertext to identify classical substitution and transposition ciphers.',
    status: 'coming-soon',
  },
  {
    id: null,
    icon: '🔤',
    title: 'Substitution Helper',
    description:
      'Interactively map ciphertext characters to plaintext guesses and watch the decoded message update in real time.',
    status: 'coming-soon',
  },
  {
    id: null,
    icon: '🎡',
    title: 'Rotor Visualiser',
    description:
      'Step through the Enigma rotor mechanism visually — see how each keypress advances the rotors and scrambles the signal.',
    status: 'coming-soon',
  },
  {
    id: null,
    icon: '🔑',
    title: 'Vigenère Solver',
    description:
      'Crack Vigenère-encrypted messages using index-of-coincidence analysis and brute-force key-length detection.',
    status: 'coming-soon',
  },
  {
    id: null,
    icon: '🧩',
    title: 'Index of Coincidence',
    description:
      'Calculate the IoC of any text to distinguish monoalphabetic from polyalphabetic ciphers at a glance.',
    status: 'coming-soon',
  },
]

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div className="home">
      <section className="home-hero">
        <h1 className="home-hero-title">
          <span className="home-hero-icon">🔐</span> Cipher Lab
        </h1>
        <p className="home-hero-subtitle">
          An open crypto-analysis workbench built with React &amp; TypeScript.
          Explore classical ciphers, analyse encrypted text, and visualise
          historic encryption machines — all in the browser.
        </p>
      </section>

      <section className="home-tools">
        <h2 className="section-title">Tools</h2>
        <div className="tool-grid">
          {TOOL_CARDS.map((tool) => (
            <div
              key={tool.title}
              className={`tool-card ${tool.status === 'available' ? 'tool-card--available' : 'tool-card--soon'}`}
              onClick={() => tool.id && onNavigate(tool.id)}
              role={tool.id ? 'button' : undefined}
              tabIndex={tool.id ? 0 : undefined}
              onKeyDown={(e) => {
                if (tool.id && (e.key === 'Enter' || e.key === ' ')) {
                  onNavigate(tool.id)
                }
              }}
            >
              <span className="tool-card-icon">{tool.icon}</span>
              <div className="tool-card-body">
                <h3 className="tool-card-title">{tool.title}</h3>
                <p className="tool-card-desc">{tool.description}</p>
              </div>
              {tool.status === 'coming-soon' && (
                <span className="tool-card-badge">Coming soon</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="home-about">
        <h2 className="section-title">About the project</h2>
        <p>
          Cipher Lab is a growing collection of interactive tools for exploring
          classical cryptography. Whether you are a student learning about the
          history of encryption, a CTF competitor cracking challenge messages, or
          simply curious about how the Enigma machine worked, this workbench aims
          to make the subject accessible and visual.
        </p>
        <p>
          The project is intentionally lightweight: no heavy frameworks, minimal
          dependencies, and all computation runs entirely in your browser.
        </p>
      </section>
    </div>
  )
}
