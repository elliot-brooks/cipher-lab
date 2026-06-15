import './NavBar.css'

type NavBarProps = {
  currentPage: 'home' | 'enigma'
  onNavigate: (page: 'home' | 'enigma') => void
}

export default function NavBar({ currentPage, onNavigate }: NavBarProps) {
  return (
    <header className="navbar">
      <button className="navbar-brand" type="button" onClick={() => onNavigate('home')}>
        <span className="navbar-logo">🔐</span>
        <span className="navbar-title">Cipher Lab</span>
      </button>
      <nav className="navbar-links" aria-label="Primary navigation">
        <button
          type="button"
          className={`navbar-link ${currentPage === 'home' ? 'is-active' : ''}`}
          onClick={() => onNavigate('home')}
        >
          Home
        </button>
        <button
          type="button"
          className={`navbar-link ${currentPage === 'enigma' ? 'is-active' : ''}`}
          onClick={() => onNavigate('enigma')}
        >
          Enigma Simulator
        </button>
      </nav>
    </header>
  )
}
