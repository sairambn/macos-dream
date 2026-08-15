import { useEffect, useState } from "react";
import {
  profile,
  stats,
  impact,
  skillGroups,
  principles,
  projects,
} from "@/data/portfolio";
import avatar from "@/assets/avatar-head.jpg";

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[var(--glass-border)] bg-[var(--chip)] px-2.5 py-1 text-[11px] font-medium text-foreground/80">
      {children}
    </span>
  );
}

export function FinderAbout() {
  return (
    <div className="grid h-full grid-cols-[190px_1fr]">
      <aside className="hidden h-full border-r border-[var(--glass-border)] bg-[var(--sidebar-glass)] p-3 sm:block">
        <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Favorites
        </p>
        {["Profile", "Principles", "Skills", "Impact"].map((s) => (
          <a
            key={s}
            href={`#about-${s.toLowerCase()}`}
            className="block rounded-md px-2 py-1.5 text-[13px] text-foreground/80 transition hover:bg-[var(--chip)]"
          >
            {s}
          </a>
        ))}
      </aside>
      <div className="space-y-8 p-6 sm:p-8">
        <div id="about-profile" className="flex flex-wrap items-center gap-5">
          <img
            src={avatar}
            alt={`${profile.name} portrait`}
            width={80}
            height={80}
            className="size-20 rounded-2xl object-cover ring-1 ring-[var(--glass-border)]"
          />
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{profile.name}</h2>
            <p className="text-sm text-muted-foreground">{profile.headline}</p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              {profile.location} · {profile.openTo}
            </p>
          </div>
        </div>
        <p className="max-w-2xl whitespace-pre-line text-[15px] leading-relaxed text-foreground/85">
          {profile.bio}
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-[var(--glass-border)] bg-[var(--chip)] p-4">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <p className="mt-1 text-sm font-medium">{s.value}</p>
            </div>
          ))}
        </div>
        <section id="about-principles" className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Principles</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {principles.map((p) => (
              <div key={p.title} className="rounded-xl border border-[var(--glass-border)] p-4">
                <p className="font-medium">{p.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </section>
        <section id="about-skills" className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Skills</h3>
          <div className="space-y-3">
            {skillGroups.map((g) => (
              <div key={g.title}>
                <p className="mb-2 text-[13px] text-foreground/70">{g.title}</p>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((i) => (
                    <Chip key={i}>{i}</Chip>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
        <section id="about-impact" className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Impact</h3>
          <div className="divide-y divide-[var(--glass-border)] overflow-hidden rounded-xl border border-[var(--glass-border)]">
            {impact.map((i) => (
              <div key={i.title} className="p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-medium">{i.title}</p>
                  <span className="text-[12px] text-[var(--accent-mint)]">{i.result}</span>
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{i.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export function ProjectsApp() {
  const [selected, setSelected] = useState(projects[0]!.name);
  const project = projects.find((p) => p.name === selected)!;
  return (
    <div className="grid h-full grid-cols-1 sm:grid-cols-[230px_1fr]">
      <aside className="mac-scroll max-h-52 overflow-y-auto border-b border-[var(--glass-border)] bg-[var(--sidebar-glass)] p-2 sm:max-h-none sm:border-b-0 sm:border-r">
        {projects.map((p) => (
          <button
            key={p.name}
            onClick={() => setSelected(p.name)}
            className={`block w-full rounded-lg px-3 py-2 text-left transition ${
              p.name === selected ? "bg-[var(--gradient-primary)] text-[oklch(0.15_0.02_260)]" : "hover:bg-[var(--chip)]"
            }`}
          >
            <p className="truncate text-[13px] font-medium">{p.title}</p>
            <p className={`truncate text-[11px] ${p.name === selected ? "opacity-70" : "text-muted-foreground"}`}>
              {p.language}
            </p>
          </button>
        ))}
      </aside>
      <div className="space-y-5 p-6 sm:p-8">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{project.outcome}</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">{project.title}</h2>
        </div>
        <p className="max-w-2xl text-[15px] leading-relaxed text-foreground/85">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {(project.tags ?? []).map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <a className="mac-btn" href={project.url} target="_blank" rel="noreferrer">
            View source
          </a>
          {project.live && (
            <a className="mac-btn mac-btn-primary" href={project.live} target="_blank" rel="noreferrer">
              Open live site
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

const LINES = [
  "$ whoami",
  "sairambn — software engineer, CEG Chennai",
  "$ cat habits.txt",
  "one NeetCode problem a day. python · java · c++",
  "$ ls ~/shipped",
  "ai-thon  timetable-generator  stats-portal  2 client sites",
  "$ echo $STATUS",
  "open to SDE roles — bangalore · hyderabad · remote",
];

export function TerminalApp() {
  const [shown, setShown] = useState<string[]>([]);
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setShown(LINES.slice(0, i));
      if (i >= LINES.length) clearInterval(t);
    }, 420);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="h-full bg-[oklch(0.16_0.02_260/0.9)] p-5 font-mono text-[13px] leading-relaxed">
      {shown.map((l, i) => (
        <p key={i} className={l.startsWith("$") ? "text-[var(--accent-mint)]" : "text-foreground/80"}>
          {l}
        </p>
      ))}
      <span className="mac-caret" />
    </div>
  );
}

export function ContactApp() {
  const links = [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { label: "GitHub", value: "@sairambn", href: profile.github },
    { label: "LinkedIn", value: "in/sairambn", href: profile.linkedin },
    { label: "LeetCode", value: "u/sairambn", href: profile.leetcode },
    { label: "Portfolio", value: "bnsairam.vercel.app", href: profile.portfolio },
  ];
  return (
    <div className="space-y-6 p-7">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Get in touch</h2>
        <p className="mt-1 text-[13px] text-muted-foreground">{profile.tagline}</p>
      </div>
      <div className="divide-y divide-[var(--glass-border)] overflow-hidden rounded-xl border border-[var(--glass-border)]">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-4 py-3 transition hover:bg-[var(--chip)]"
          >
            <span className="text-[13px] text-muted-foreground">{l.label}</span>
            <span className="text-[13px] font-medium">{l.value}</span>
          </a>
        ))}
      </div>
      <a className="mac-btn mac-btn-primary inline-flex" href={`mailto:${profile.email}`}>
        Say hello
      </a>
    </div>
  );
}
