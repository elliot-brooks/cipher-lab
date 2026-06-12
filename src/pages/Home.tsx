import './Home.css'

export default function Home() {
  return (
    <div className="home">
      <section className="home-hero">
        <h1 className="home-hero-title">
          <span className="home-hero-icon">🔐</span> Cipher Lab
        </h1>
        <p className="home-hero-subtitle">
          An open crypto-analysis workbench built with React &amp; TypeScript.
          Tools for exploring classical ciphers, analysing encrypted text, and
          visualising historic encryption machines — coming soon.
        </p>
      </section>
    </div>
  )
}
