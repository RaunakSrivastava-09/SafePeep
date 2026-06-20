"use client";

import Link from "next/link";

export default function Sidebar({ setSidebarOpen }) {
  return (
    <aside
      className="
        min-h-screen w-64 flex-col
        border-r border-border bg-card
        px-5 py-6 text-foreground shadow-lg
        transition-colors

        /* MOBILE: slide drawer */
        fixed sm:static top-0 left-0 z-50
        h-full

        /* animation */
        transform transition-transform duration-300

        /* default hidden on mobile */
        -translate-x-full sm:translate-x-0
      "
    >
      <h1 className="mb-10 text-2xl font-bold tracking-tight text-foreground">
        SafePeep
      </h1>

      <nav className="flex flex-col gap-2 text-sm">

        <Link
          href="/profile"
          onClick={() => setSidebarOpen?.(false)}
          className="rounded-lg px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          Profile
        </Link>

        <Link
          href="/dashboard"
          onClick={() => setSidebarOpen?.(false)}
          className="rounded-lg px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          Dashboard
        </Link>

        <Link
          href="/alerts"
          onClick={() => setSidebarOpen?.(false)}
          className="rounded-lg px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          Alerts
        </Link>

        <Link
          href="/map"
          onClick={() => setSidebarOpen?.(false)}
          className="rounded-lg px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          Map
        </Link>

        <Link
          href="/ai"
          onClick={() => setSidebarOpen?.(false)}
          className="rounded-lg px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          AI Assistant
        </Link>

        <Link
          href="/settings"
          onClick={() => setSidebarOpen?.(false)}
          className="rounded-lg px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          Settings
        </Link>

      </nav>
    </aside>
  );
}