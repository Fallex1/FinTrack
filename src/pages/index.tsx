import { useState } from "react";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import ChartCard from "@/components/ChartCard";
import TransactionList from "@/components/TransactionList";
import { IconTrendingUp, IconTrendingDown, IconWallet } from "@/components/Icons";
import type { Transaction, Period } from "@/lib/types";
import { useApp, inPeriod, periodDays } from "@/context/AppContext";
import { fmtRp } from "@/lib/types";

function periodLabel(p: Period): string {
  if (p === "minggu") return "Minggu Ini";
  if (p === "bulan") return "Bulan Ini";
  return "Tahun Ini";
}

function buildChartData(transactions: Transaction[], period: Period) {
  const filtered = transactions.filter((t) => inPeriod(t.date, period));
  if (filtered.length === 0) return [{ month: periodLabel(period), income: 0, expense: 0 }];

  if (period === "tahun") {
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    return months.map((m) => {
      const mm = (months.indexOf(m) + 1).toString().padStart(2, "0");
      const inc = filtered.filter((t) => t.date.slice(5, 7) === mm && t.type === "income").reduce((a, t) => a + t.amount, 0);
      const exp = filtered.filter((t) => t.date.slice(5, 7) === mm && t.type === "expense").reduce((a, t) => a + t.amount, 0);
      return { month: m, income: inc, expense: exp };
    });
  }
  if (period === "bulan") {
    const [start, end] = periodDays(period);
    const weeks: { month: string; income: number; expense: number }[] = [];
    let cur = new Date(start);
    while (cur <= end) {
      const wEnd = new Date(cur);
      wEnd.setDate(cur.getDate() + 6);
      const inc = filtered.filter((t) => new Date(t.date) >= cur && new Date(t.date) <= wEnd && t.type === "income").reduce((a, t) => a + t.amount, 0);
      const exp = filtered.filter((t) => new Date(t.date) >= cur && new Date(t.date) <= wEnd && t.type === "expense").reduce((a, t) => a + t.amount, 0);
      weeks.push({ month: `${cur.getDate()} ${cur.toLocaleDateString("id-ID", { month: "short" })}`, income: inc, expense: exp });
      cur = new Date(wEnd);
      cur.setDate(cur.getDate() + 1);
    }
    return weeks.length ? weeks : [{ month: "Minggu Ini", income: 0, expense: 0 }];
  }
  const [start] = periodDays(period);
  const days: { month: string; income: number; expense: number }[] = [];
  const cur = new Date(start);
  for (let i = 0; i < 7; i++) {
    const d = cur.toISOString().slice(0, 10);
    days.push({
      month: cur.toLocaleDateString("id-ID", { weekday: "short" }),
      income: filtered.filter((t) => t.date === d && t.type === "income").reduce((a, t) => a + t.amount, 0),
      expense: filtered.filter((t) => t.date === d && t.type === "expense").reduce((a, t) => a + t.amount, 0),
    });
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

function PeriodFilter({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  const opts: Period[] = ["minggu", "bulan", "tahun"];
  return (
    <div className="flex gap-1 bg-light rounded-lg p-1">
      {opts.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`px-3 py-1 rounded-md text-sm transition ${value === o ? "bg-primary text-white shadow" : "text-secondary hover:text-primary"}`}
        >
          {o.charAt(0).toUpperCase() + o.slice(1)}
        </button>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { store, totalBalance, setPeriod } = useApp();
  const [showAll, setShowAll] = useState(false);

  const sorted = [...store.transactions].sort((a, b) => b.date.localeCompare(a.date));
  const visible = showAll ? sorted : sorted.slice(0, 5);
  const income = store.transactions.filter((t) => inPeriod(t.date, store.period) && t.type === "income").reduce((a, t) => a + t.amount, 0);
  const expense = store.transactions.filter((t) => inPeriod(t.date, store.period) && t.type === "expense").reduce((a, t) => a + t.amount, 0);
  const chart = buildChartData(store.transactions, store.period);

  return (
    <Layout>
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-dark">Dashboard</h1>
          <PeriodFilter value={store.period} onChange={setPeriod} />
        </div>

        <div className="flex items-center gap-3">
          {store.profile.avatar ? (
            <img src={store.profile.avatar} alt="" className="w-11 h-11 rounded-full object-cover border-2 border-light" />
          ) : (
            <span className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
              {store.profile.name?.[0] || "F"}
            </span>
          )}
          <span className="font-semibold text-dark">{store.profile.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label="Saldo Total" value={fmtRp(totalBalance)} change="+0%" icon={<IconWallet className="w-5 h-5" />} iconBg="bg-primary/20" />
          <StatCard label={`Pemasukan ${periodLabel(store.period)}`} value={fmtRp(income)} change="+0%" icon={<IconTrendingUp className="w-5 h-5" />} iconBg="bg-green-100/50" />
          <StatCard label={`Pengeluaran ${periodLabel(store.period)}`} value={fmtRp(expense)} change="+0%" icon={<IconTrendingDown className="w-5 h-5" />} iconBg="bg-red-100/50" />
        </div>

        <ChartCard title="Saldo" subtitle={periodLabel(store.period)} data={chart} />

        <div className="bg-white rounded-xl border border-light shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-dark">Transaksi Terakhir</h2>
            {store.transactions.length > 5 && (
              <button onClick={() => setShowAll(!showAll)} className="text-sm font-medium text-primary hover:text-dark transition">
                {showAll ? "5 Terbaru" : "Lihat semua"}
              </button>
            )}
          </div>
          {visible.length === 0 ? (
            <p className="text-muted text-center py-10">Belum ada transaksi. Tambahkan dompet atau transaksi baru.</p>
          ) : (
            <TransactionList transactions={visible} categories={store.categories} wallets={store.wallets} />
          )}
        </div>
      </div>
    </Layout>
  );
}
