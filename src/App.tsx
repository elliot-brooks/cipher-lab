import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import EnigmaSimulator from './pages/EnigmaSimulator'
import NavBar from './components/NavBar'

export type Page = 'home' | 'enigma'

function App() {
  const [page, setPage] = useState<Page>('home')

  return (
    <div className="app">
      <NavBar currentPage={page} onNavigate={setPage} />
      <main className="app-main">
        {page === 'home' && <Home onNavigate={setPage} />}
        {page === 'enigma' && <EnigmaSimulator />}
      </main>
      <footer className="app-footer">
        <span>Cipher Lab &mdash; an open crypto-analysis workbench</span>
      </footer>
    </div>
  )
}

export default App
