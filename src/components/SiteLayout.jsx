import { NavLink, Outlet } from "react-router-dom";

function TabLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "px-3 py-1.5 font-mono text-xs tracking-widest uppercase border rounded-md",
          "border-terminal-border/60 text-slate-200 hover:bg-terminal-header/40",
          isActive ? "bg-terminal-header/60 text-terminal-highlight" : "bg-transparent",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

export default function SiteLayout() {
  return (
    <div className="min-h-screen bg-terminal-base text-slate-100">
      <header className="sticky top-0 z-50 border-b border-terminal-border/40 bg-terminal-base/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="font-mono text-sm text-slate-300">
            <span className="text-terminal-highlight">elliot</span>@portfolio
          </div>

          <nav className="flex items-center gap-2">
            <TabLink to="/">terminal</TabLink>
            <TabLink to="/projects">projects</TabLink>
            <TabLink to="/about">about</TabLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
