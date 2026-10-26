export default function Header() {
  return (
    <header className="h-20 flex items-center justify-between px-8 border-b border-light bg-white">
      <div>
        <h1 className="text-2xl font-bold text-dark">Dashboard</h1>
        <p className="text-sm text-muted">Ringkasan keuangan Anda</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="px-3 py-1.5 rounded-full bg-light text-secondary text-sm font-medium">
          Bulan ini
        </span>
        <span className="w-9 h-9 rounded-full bg-primary/30 flex items-center justify-center text-primary font-bold">
          L
        </span>
      </div>
    </header>
  );
}
