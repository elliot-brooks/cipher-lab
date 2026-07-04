import './Home.css'

import type { AppPage } from '../App'

type HomeProps = {
  onExplore: (page: AppPage) => void
}

export default function Home({ onExplore }: HomeProps) {

  return (
    <div className="home">
      <section className="home-hero home-card">
        <h1 className="home-hero-title">
          <img src="cipher-lab.svg" alt="" className="home-hero-icon" aria-hidden="true" />Cipher Lab
        </h1>
        <p className="home-hero-subtitle">
          A playful cryptography playground for experimenting with ciphers,
          testing ideas, and learning by doing. Cipher Lab is an interactive
          space for exploring classical encryption through hands-on tools.
        </p>
        <div className="home-hero-actions">
          <button className="home-primary-action" type="button" onClick={() => onExplore('enigma')}>
            Enigma Simulator
          </button>
          <button className="home-primary-action" type="button" onClick={() => onExplore('rsa')}>
            RSA Workbench
          </button>
        </div>
      </section>

      <section className="home-grid">
        <article className="home-card home-feature">
          <span className="home-feature-kicker">Play</span>
          <h2>Try cryptography ideas quickly</h2>
          <p>Use visual tools to test inputs, compare outputs, and spot patterns across different cipher settings.</p>
        </article>
        <article className="home-card home-feature">
          <span className="home-feature-kicker">Learn</span>
          <h2>Understand how ciphers behave</h2>
          <p>Explore how parameter changes impact encryption so theory feels concrete, not abstract.</p>
        </article>
        <article className="home-card home-feature">
          <span className="home-feature-kicker">Encrypt</span>
          <h2>Secure your messages</h2>
          <p>Apply encryption techniques to protect your data and understand the principles behind secure communication.</p>
        </article>
      </section>
    </div>
  )
}
