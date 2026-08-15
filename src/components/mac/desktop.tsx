import { useCallback, useEffect, useState } from "react";
import { MacWindow, type WindowState } from "./mac-window";
import { FinderAbout, ProjectsApp, TerminalApp, ContactApp } from "./apps";
import { profile } from "@/data/portfolio";
import wallpaper from "@/assets/wallpaper.jpg";

type AppId = "about" | "projects" | "terminal" | "contact";

const APPS: { id: AppId; title: string; icon: string; dock: string }[] = [
  { id: "about", title: "About — Finder", icon: "🗂", dock: "About" },
  { id: "projects", title: "Projects", icon: "🚀", dock: "Projects" },
  { id: "terminal", title: "sairambn — zsh", icon: "⌘", dock: "Terminal" },
  { id: "contact", title: "Contact", icon: "✉️", dock: "Contact" },
];

const DEFAULTS: Record<AppId, { w: number; h: number; x: number; y: number }> = {
  about: { w: 860, h: 560, x: 90, y: 90 },
  projects: { w: 780, h: 460, x: 260, y: 190 },
  terminal: { w: 520, h: 280, x: 520, y: 400 },
  contact: { w: 460, h: 470, x: 660, y: 130 },
};

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 20000);
    return () => clearInterval(t);
  }, []);
  return now;
}

export function Desktop() {
  const [wins, setWins] = useState<WindowState[]>([]);
  const [top, setTop] = useState(10);
  const now = useClock();

  const open = useCallback(
    (id: AppId) => {
      setTop((z) => z + 1);
      setWins((prev) => {
        const existing = prev.find((w) => w.id === id);
        const z = top + 1;
        if (existing) {
          return prev.map((w) => (w.id === id ? { ...w, minimized: false, z } : w));
        }
        const app = APPS.find((a) => a.id === id)!;
        const d = DEFAULTS[id];
        const maxX = typeof window !== "undefined" ? window.innerWidth - d.w - 24 : d.x;
        return [
          ...prev,
          {
            id,
            title: app.title,
            z,
            w: d.w,
            h: d.h,
            x: Math.max(16, Math.min(d.x, maxX)),
            y: d.y,
          },
        ];
      });
    },
    [top],
  );

  useEffect(() => {
    const isNarrow = window.innerWidth < 860;
    setWins([]);
    const boot = isNarrow ? (["about"] as AppId[]) : (["about", "terminal"] as AppId[]);
    boot.forEach((id, i) => setTimeout(() => open(id), 250 + i * 320));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (id: string, patch: Partial<WindowState>) =>
    setWins((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w)));

  const focus = (id: string) => {
    setTop((z) => z + 1);
    update(id, { z: top + 1 });
  };

  const activeId = wins.filter((w) => !w.minimized).sort((a, b) => b.z - a.z)[0]?.id;

  const content: Record<AppId, React.ReactNode> = {
    about: <FinderAbout />,
    projects: <ProjectsApp />,
    terminal: <TerminalApp />,
    contact: <ContactApp />,
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <img
        src={wallpaper}
        alt=""
        aria-hidden
        width={1920}
        height={1200}
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-[oklch(0.12_0.03_265/0.35)]" />

      {/* Menu bar */}
      <div className="mac-menubar fixed inset-x-0 top-0 z-[1000] flex h-7 items-center gap-4 px-4 text-[13px]">
        <span className="text-base leading-none"></span>
        <span className="font-semibold">{profile.shortName}</span>
        <span className="hidden text-foreground/70 sm:inline">File</span>
        <span className="hidden text-foreground/70 sm:inline">View</span>
        <span className="hidden text-foreground/70 sm:inline">Window</span>
        <span className="ml-auto text-foreground/80">
          {now
            ? now.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }) +
              "  " +
              now.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
            : ""}
        </span>
      </div>

      {/* Desktop icons */}
      <div className="absolute right-5 top-12 z-10 hidden w-24 flex-col gap-4 md:flex">
        {APPS.map((a) => (
          <button
            key={a.id}
            onDoubleClick={() => open(a.id)}
            onClick={() => open(a.id)}
            className="group flex flex-col items-center gap-1.5 rounded-lg p-2 transition hover:bg-[oklch(1_0_0/0.1)]"
          >
            <span className="grid size-12 place-items-center rounded-xl border border-[var(--glass-border)] bg-[var(--chip)] text-xl backdrop-blur">
              {a.icon}
            </span>
            <span className="text-[11px] font-medium text-foreground drop-shadow">{a.dock}</span>
          </button>
        ))}
      </div>

      {/* Hero */}
      <div className="pointer-events-none absolute left-6 top-16 z-0 max-w-md sm:left-12 sm:top-24">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground drop-shadow-lg sm:text-5xl">
          {profile.name}
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-foreground/75">{profile.tagline}</p>
      </div>

      {wins.map((w) => (
        <MacWindow
          key={w.id}
          state={w}
          active={activeId === w.id}
          onFocus={() => focus(w.id)}
          onClose={() => setWins((prev) => prev.filter((x) => x.id !== w.id))}
          onMinimize={() => update(w.id, { minimized: true })}
          onToggleMax={() => update(w.id, { maximized: !w.maximized })}
          onMove={(x, y) => update(w.id, { x, y })}
        >
          {content[w.id as AppId]}
        </MacWindow>
      ))}

      {/* Dock */}
      <nav className="mac-dock fixed bottom-3 left-1/2 z-[1000] flex -translate-x-1/2 items-end gap-2 rounded-2xl px-3 py-2">
        {APPS.map((a) => {
          const isOpen = wins.some((w) => w.id === a.id);
          return (
            <button
              key={a.id}
              onClick={() => open(a.id)}
              aria-label={a.dock}
              title={a.dock}
              className="mac-dock-item relative grid size-12 place-items-center rounded-xl bg-[var(--gradient-dock)] text-xl sm:size-14 sm:text-2xl"
            >
              {a.icon}
              <span
                className={`absolute -bottom-1.5 size-1 rounded-full bg-foreground/80 transition-opacity ${
                  isOpen ? "opacity-100" : "opacity-0"
                }`}
              />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
