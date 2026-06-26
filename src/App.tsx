import { useEffect, useState } from 'react'

import './App.css'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import EnigmaPage from './pages/EnigmaPage'
import RsaWorkbenchPage from './pages/RsaWorkbenchPage'

export type AppPage = 'home' | 'enigma' | 'rsa'

function readPageFromHash(): AppPage {
  if (window.location.hash === '#enigma') return 'enigma'
  if (window.location.hash === '#rsa') return 'rsa'
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
        {page === 'rsa' && <RsaWorkbenchPage />}
      </main>
      <footer className="app-footer">
        <span>Cipher Lab - an open crypto-analysis workbench</span>
      </footer>
    </div>
  )
}

export default App
