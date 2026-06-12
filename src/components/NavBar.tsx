import type { Page } from '../App'
import './NavBar.css'

interface NavBarProps {
  currentPage: Page
  onNavigate: (page: Page) => void
}

const NAV_ITEMS: { id: Page; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: '⌂' },
  { id: 'enigma', label: 'Enigma Simulator', icon: '⚙' },
]

export default function NavBar({ currentPage, onNavigate }: NavBarProps) {
  return (
    <header className="navbar">
      <div className="navbar-brand" onClick={() => onNavigate('home')}>
        <span className="navbar-logo">🔐</span>
        <span className="navbar-title">Cipher Lab</span>
      </div>
      <nav className="navbar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? 'nav-item--active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-item-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </header>
  )
}
