import { useEffect, useRef, useState, type ReactNode } from "react";

export type WindowState = {
  id: string;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized?: boolean;
  maximized?: boolean;
};

type Props = {
  state: WindowState;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMax: () => void;
  onMove: (x: number, y: number) => void;
  active: boolean;
  children: ReactNode;
};

export function MacWindow({
  state,
  onFocus,
  onClose,
  onMinimize,
  onToggleMax,
  onMove,
  active,
  children,
}: Props) {
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    function move(e: PointerEvent) {
      if (!drag.current) return;
      onMove(
        Math.max(0, Math.min(window.innerWidth - 120, e.clientX - drag.current.dx)),
        Math.max(28, Math.min(window.innerHeight - 80, e.clientY - drag.current.dy)),
      );
    }
    function up() {
      drag.current = null;
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [onMove]);

  const maximized = state.maximized;

  return (
    <section
      onPointerDown={onFocus}
      aria-label={state.title}
      className="mac-window fixed flex flex-col overflow-hidden rounded-xl"
      style={{
        left: maximized ? 12 : state.x,
        top: maximized ? 36 : state.y,
        width: maximized ? "calc(100vw - 24px)" : state.w,
        height: maximized ? "calc(100vh - 140px)" : state.h,
        zIndex: state.z,
        opacity: state.minimized ? 0 : mounted ? 1 : 0,
        pointerEvents: state.minimized ? "none" : "auto",
        transform: state.minimized
          ? "scale(.85) translateY(40px)"
          : mounted
            ? "scale(1)"
            : "scale(.96)",
        transition:
          "opacity .28s cubic-bezier(.2,.8,.2,1), transform .32s cubic-bezier(.2,.8,.2,1), width .3s, height .3s, left .3s, top .3s",
        boxShadow: active
          ? "var(--shadow-window-active)"
          : "var(--shadow-window)",
      }}
    >
      <header
        onPointerDown={(e) => {
          if (maximized) return;
          drag.current = { dx: e.clientX - state.x, dy: e.clientY - state.y };
        }}
        onDoubleClick={onToggleMax}
        className="flex h-10 shrink-0 cursor-grab select-none items-center gap-2 border-b border-[var(--glass-border)] bg-[var(--titlebar)] px-3.5 active:cursor-grabbing"
      >
        <div className="group flex items-center gap-2">
          <button
            aria-label="Close window"
            onClick={onClose}
            className="size-3 rounded-full bg-[oklch(0.68_0.19_25)] transition hover:brightness-110"
          />
          <button
            aria-label="Minimize window"
            onClick={onMinimize}
            className="size-3 rounded-full bg-[oklch(0.82_0.16_85)] transition hover:brightness-110"
          />
          <button
            aria-label="Maximize window"
            onClick={onToggleMax}
            className="size-3 rounded-full bg-[oklch(0.72_0.17_145)] transition hover:brightness-110"
          />
        </div>
        <p className="flex-1 truncate text-center text-[13px] font-medium text-foreground/80">
          {state.title}
        </p>
        <div className="w-14" />
      </header>
      <div className="mac-scroll flex-1 overflow-y-auto">{children}</div>
    </section>
  );
}
