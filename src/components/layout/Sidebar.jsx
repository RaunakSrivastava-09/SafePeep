




import Link from "next/link";

export default function Sidebar() {


return (
  <aside className="flex min-h-screen w-64 flex-col border-r border-border bg-card px-5 py-6 text-foreground shadow-lg transition-colors">

  
    <h1 className="mb-10 text-2xl font-bold tracking-tight text-foreground">
      SafePeep
    </h1>

  
    <nav className="flex flex-col gap-2 text-sm">

      <Link
        href="/profile"
        className="rounded-lg px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        Profile
      </Link>

      <Link
        href="/dashboard"
        className="rounded-lg px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        Dashboard
      </Link>

      <Link
        href="/alerts"
        className="rounded-lg px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        Alerts
      </Link>

      <Link
        href="/map"
        className="rounded-lg px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        Map
      </Link>

      <Link
        href="/ai"
        className="rounded-lg px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        AI Assistant
      </Link>

      <Link
        href="/settings"
        className="rounded-lg px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        Settings
      </Link>

    </nav>

  </aside>
);
}