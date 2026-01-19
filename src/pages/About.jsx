function Section({ title, children }) {
  return (
    <section className="mt-6">
      <h2 className="font-mono text-xs tracking-[0.25em] uppercase text-terminal-highlight">
        {title}
      </h2>
      <div className="mt-2 border-l border-terminal-border/50 pl-4 text-slate-200">
        {children}
      </div>
    </section>
  );
}

function Kbd({ children }) {
  return (
    <span className="rounded border border-terminal-border/60 bg-terminal-base/40 px-2 py-0.5 font-mono text-xs text-terminal-highlight">
      {children}
    </span>
  );
}

export default function About() {
  return (
    <div className="rounded-xl border border-terminal-border/60 bg-terminal-base/50 p-6">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <div className="font-mono text-2xl text-slate-100">ELLIOT(1)</div>
          <div className="font-mono text-xs text-slate-400">User Commands</div>
        </div>
        <div className="font-mono text-xs text-slate-400">
          {new Date().toLocaleDateString()}
        </div>
      </div>

      <Section title="NAME">
        <p>
          <span className="text-terminal-highlight">elliot</span> — builder of tools, systems,
          and developer-first products.
        </p>
      </Section>

      <Section title="SYNOPSIS">
        <pre className="whitespace-pre-wrap font-mono text-slate-200">
{`elliot [--projects] [--systems] [--tools]
elliot --contact
elliot --now`}
        </pre>
      </Section>

      <Section title="DESCRIPTION">
        <p>
          This is a terminal-themed portfolio. The aim is to feel like a dev tool:
          fast, readable, minimal, and honest.
        </p>
      </Section>

      <Section title="KEYBINDINGS">
        <ul className="space-y-2">
          <li>
            <Kbd>Ctrl</Kbd> + <Kbd>C</Kbd> cancels current input
          </li>
          <li>
            <Kbd>Tab</Kbd> cycles completions
          </li>
          <li>
            <Kbd>↑</Kbd>/<Kbd>↓</Kbd> navigates command history
          </li>
        </ul>
      </Section>

      <Section title="SEE ALSO">
        <p className="text-slate-200">
          <span className="font-mono text-terminal-highlight">projects(1)</span>,{" "}
          <span className="font-mono text-terminal-highlight">terminal(1)</span>
        </p>
      </Section>
    </div>
  );
}
