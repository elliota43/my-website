import Terminal from "./components/Terminal";
import NavBar from "./components/NavBar";

function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_circle_at_20%_-10%,rgba(34,41,56,0.7)_0%,transparent_60%),radial-gradient(900px_circle_at_85%_15%,rgba(24,39,36,0.7)_0%,transparent_55%),linear-gradient(155deg,#0b0d10_0%,#0a0c0f_100%)]">
      <header className="mx-auto w-full max-w-6xl px-6 pt-8">
        <NavBar />
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-16">
        <section className="pt-8">
          <div className="mx-auto max-w-4xl">
            <Terminal />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
