import Link from "next/link";

type NavItem = { label: string; href: string; icon: React.ReactNode };

function Svg({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className={className ?? "w-5 h-5"} aria-hidden="true">
      {children}
    </svg>
  );
}

const ic = {
  dashboard: <Svg><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></Svg>,
  transaksi: <Svg><path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></Svg>,
  dompet: <Svg><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></Svg>,
  kategori: <Svg><path d="M3 6h18"/><path d="M7 12h14"/><path d="M11 18h10"/><circle cx="3.5" cy="12" r=".5" fill="currentColor"/><circle cx="7.5" cy="18" r=".5" fill="currentColor"/></Svg>,
  hutang: <Svg><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></Svg>,
  langganan: <Svg><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2"/></Svg>,
  tabungan: <Svg><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5Z"/><path d="M2 9v1c0 1.1.9 2 2 2h1"/><path d="M16 11h.01"/></Svg>,
  pengaturan: <Svg><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></Svg>,
  keluar: <Svg><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></Svg>,
};

const MAIN: NavItem[] = [
  { label: "Dashboard", href: "/", icon: ic.dashboard },
  { label: "Transaksi", href: "/transaksi", icon: ic.transaksi },
  { label: "Dompet", href: "/dompet", icon: ic.dompet },
  { label: "Kategori", href: "/kategori", icon: ic.kategori },
  { label: "Hutang", href: "/hutang", icon: ic.hutang },
  { label: "Langganan", href: "/langganan", icon: ic.langganan },
  { label: "Tabungan", href: "/tabungan", icon: ic.tabungan },
];

const FOOTER: NavItem[] = [
  { label: "Pengaturan", href: "/pengaturan", icon: ic.pengaturan },
  { label: "Keluar", href: "/keluar", icon: ic.keluar },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white border-r border-light flex flex-col">
      <div className="p-6 border-b border-light">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold">
            F
          </span>
          <span className="text-lg font-bold text-dark">FinTrack</span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {MAIN.map((n) => (
          <Link
            key={n.label}
            href={n.href}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-secondary hover:bg-light hover:text-primary transition"
          >
            {n.icon}
            {n.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-light space-y-1">
        {FOOTER.map((n) => (
          <Link
            key={n.label}
            href={n.href}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted hover:bg-light hover:text-secondary transition"
          >
            {n.icon}
            {n.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
