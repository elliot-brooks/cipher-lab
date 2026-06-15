import { useEffect, useState } from 'react'

import './App.css'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import EnigmaPage from './pages/EnigmaPage'
import HowItWorksPage from './pages/HowItWorksPage'

export type AppPage = 'home' | 'enigma' | 'how-it-works'

function readPageFromHash(): AppPage {
  if (window.location.hash === '#enigma') {
    return 'enigma'
  }

  if (window.location.hash === '#how-it-works') {
    return 'how-it-works'
  }

  return 'home'
}

function App() {
  const [page, setPage] = useState<AppPage>(readPageFromHash)

  useEffect(() => {
    if (!window.location.hash) {
      window.history.replaceState(null, '', '#home')
    }

    const handleHashChange = () => {
      setPage(readPageFromHash())
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  const navigate = (nextPage: AppPage) => {
    window.location.hash = `#${nextPage}`
  }

  return (
    <div className="app">
      <NavBar currentPage={page} onNavigate={navigate} />
      <main className="app-main">
        {page === 'home' && <Home onExplore={navigate} />}
        {page === 'enigma' && <EnigmaPage />}
        {page === 'how-it-works' && <HowItWorksPage />}
      </main>
      <footer className="app-footer">
        <span>Cipher Lab - an open crypto-analysis workbench</span>
      </footer>
    </div>
  )
}

export default App
