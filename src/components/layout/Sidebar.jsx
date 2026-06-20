"use client";

import Link from "next/link";

export default function Sidebar({ setSidebarOpen, sidebarOpen }) {
  return (
    <aside
      className={`
        fixed md:static top-0 left-0 z-50 md:z-auto
        h-full w-64
        border-r border-border bg-card
        px-5 py-6 text-foreground shadow-lg
        transition-transform duration-300

        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
    >
      <h1 className="mb-10 text-2xl font-bold tracking-tight">
        SafePeep
      </h1>

      <nav className="flex flex-col gap-2 text-sm">

        <Link href="/profile" onClick={() => setSidebarOpen(false)}
          className="rounded-lg px-3 py-2 hover:bg-muted">
          Profile
        </Link>

        <Link href="/dashboard" onClick={() => setSidebarOpen(false)}
          className="rounded-lg px-3 py-2 hover:bg-muted">
          Dashboard
        </Link>

        <Link href="/alerts" onClick={() => setSidebarOpen(false)}
          className="rounded-lg px-3 py-2 hover:bg-muted">
          Alerts
        </Link>

        <Link href="/map" onClick={() => setSidebarOpen(false)}
          className="rounded-lg px-3 py-2 hover:bg-muted">
          Map
        </Link>

        <Link href="/ai" onClick={() => setSidebarOpen(false)}
          className="rounded-lg px-3 py-2 hover:bg-muted">
          AI Assistant
        </Link>

        <Link href="/settings" onClick={() => setSidebarOpen(false)}
          className="rounded-lg px-3 py-2 hover:bg-muted">
          Settings
        </Link>

      </nav>
    </aside>
  );
}