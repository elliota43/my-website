import Terminal from "./components/Terminal";
import NavBar from "./components/NavBar";
import "./App.css";

function App() {
  return (
    <div classname="page">
      <header className="topbar">
        <NavBar />
      </header>

      <main className="content">
        <section className="hero">
          <div className="terminal-wrap">
            <Terminal />
          </div>
        </section>
      </main>
    </div>
  )
}

export default App;