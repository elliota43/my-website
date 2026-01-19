import { useMemo, useState } from "react";

const PROJECTS = [
    {
        name: "baremetalphp",
        description: "educational, lightweight php framework",
        stars: 2,
        status: "active",
        tags: ["php-framework"],
        updated: "2026-01-10",
        category: "web",
        links: { code: "#", demo: "#" },
    },
];

function Chip({ active, children, onClick }) {
    return (
        <button
            onClick={onClick}
            className={[
                "px-4 py-2 font-mono text-xs tracking-widest uppercase border",
                "border-terminal-border/70 rounded-md",
                active 
                    ? "bg-terminal-highlight text-terminal-base"
                    : "bg-terminal-base/40 text-slate-200 hover:bg-terminal-header/30",
            ].join(" ")}
            >
            {children}
        </button>
    );
}

function applyCompletionToInput(input, replacement) {
    const parts = input.split(" ");
    parts[parts.length - 1] = replacement;
    return parts.join(" ");
}

function RepoCard({ p }) {
    return (
        <div className="rounded-xl border border-terminal-border/60 bg-terminal-base/50 p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                <span className="text-slate-300">&lt;&gt;</span>
                <span className="inline-flex items-center gap-2 border border-terminal-border/60 px-2 py-1 rounded">
                    <span className="h-2 w-2 rounded-full bg-terminal-highlight" />
                    <span className="font-mono text-xs tracking-widest uppercase text-terminal-highlight">
                    {p.status}
                    </span>
                </span>
                </div>

                <div className="flex items-center gap-2 text-slate-300">
                <span className="text-terminal-highlight">★</span>
                <span className="font-mono">{p.stars}</span>
                </div>
            </div>

            <div className="mt-4">
                <div className="font-mono text-2xl text-terminal-highlight">{p.name}</div>
                <div className="mt-2 text-slate-300 whitespace-pre-wrap">{p.description}</div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                <span
                    key={t}
                    className="inline-flex items-center rounded border border-terminal-border/60 px-2 py-1 font-mono text-xs text-terminal-highlight"
                >
                    {t}
                </span>
                ))}
            </div>

            <div className="mt-5 border-t border-terminal-border/40 pt-3 flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-4">
                {p.links.code && (
                    <a className="underline hover:text-slate-100" href={p.links.code}>
                    Code
                    </a>
                )}
                {p.links.demo && (
                    <a className="underline hover:text-slate-100" href={p.links.demo}>
                    Demo
                    </a>
                )}
                </div>

                <div className="font-mono text-xs text-slate-400">
                Updated: {new Date(p.updated).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
}

export default function Projects() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return PROJECTS.filter((p) => {
      const matchesFilter = filter === "all" ? true : p.category === filter;
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchesFilter && matchesQuery;
    }).sort((a, b) => b.stars - a.stars);
  }, [query, filter]);

  return (
    <div className="space-y-6">
      {/* command bar */}
      <div className="rounded-xl border border-terminal-border/60 bg-terminal-base/60 px-5 py-4">
        <div className="font-mono text-terminal-highlight text-sm">
          ≡ ~/projects <span className="text-slate-400">→</span>{" "}
          <span className="text-slate-100">ls -la --sort=stars</span>
        </div>
        <div className="mt-2 font-mono text-sm text-slate-300">
          <span className="text-terminal-highlight">[INFO]</span> Displaying{" "}
          {filtered.length} projects
        </div>
      </div>

      {/* grep search */}
      <div className="rounded-xl border border-terminal-border/60 bg-terminal-base/40 px-5 py-3">
        <div className="flex items-center gap-3 font-mono text-slate-300">
          <span className="text-slate-400">$</span>
          <span className="text-slate-400">grep -i</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search projects..."
            className="w-full bg-transparent outline-none text-slate-100 placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* filters */}
      <div className="flex flex-wrap gap-3">
        <Chip active={filter === "all"} onClick={() => setFilter("all")}>
          all
        </Chip>
        <Chip active={filter === "web"} onClick={() => setFilter("web")}>
          --web
        </Chip>
        <Chip active={filter === "systems"} onClick={() => setFilter("systems")}>
          --systems
        </Chip>
        <Chip active={filter === "tools"} onClick={() => setFilter("tools")}>
          --tools
        </Chip>
      </div>

      {/* grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <RepoCard key={p.name} p={p} />
        ))}
      </div>
    </div>
  );
}
