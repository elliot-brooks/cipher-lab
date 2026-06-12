import './App.css'
import Home from './pages/Home'
import NavBar from './components/NavBar'

function App() {
  return (
    <div className="app">
      <NavBar />
      <main className="app-main">
        <Home />
      </main>
      <footer className="app-footer">
        <span>Cipher Lab &mdash; an open crypto-analysis workbench</span>
      </footer>
    </div>
  )
}

export default App
