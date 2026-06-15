import './Home.css'

type HomeProps = {
  onExplore: (page: 'home' | 'enigma') => void
}

export default function Home({ onExplore }: HomeProps) {
  return (
    <div className="home">
      <section className="home-hero home-card">
        <h1 className="home-hero-title">
          <span className="home-hero-icon">🔐</span> Cipher Lab
        </h1>
        <p className="home-hero-subtitle">
          An open crypto-analysis workbench built with React &amp; TypeScript.
          Tools for exploring classical ciphers, analysing encrypted text, and
          visualising historic encryption machines.
        </p>
        <div className="home-hero-actions">
          <button className="home-primary-action" type="button" onClick={() => onExplore('enigma')}>
            Open the Enigma simulator
          </button>
          <p className="home-hero-note">Historic rotors, a live plugboard, and a working encryption path.</p>
        </div>
      </section>

      <section className="home-grid">
        <article className="home-card home-feature">
          <span className="home-feature-kicker">Model</span>
          <h2>Historical machine parts</h2>
          <p>Inspect the rotor stack, reflector, and plugboard as the machine mutates with each setting change.</p>
        </article>
        <article className="home-card home-feature">
          <span className="home-feature-kicker">Interact</span>
          <h2>Encode live text</h2>
          <p>Feed the machine a message and see the Enigma API transform it with the current configuration.</p>
        </article>
        <article className="home-card home-feature">
          <span className="home-feature-kicker">Explore</span>
          <h2>Ready for more pages</h2>
          <p>The app shell now supports multiple views, so future cipher tools can slot in cleanly.</p>
        </article>
      </section>
    </div>
  )
}
