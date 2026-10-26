import { useState } from "react";
import Layout from "@/components/Layout";
import TransactionList from "@/components/TransactionList";
import NumberInput from "@/components/NumberInput";
import { useApp, inPeriod } from "@/context/AppContext";
import { IconPlus } from "@/components/Icons";
import type { Transaction, Period } from "@/lib/types";

export default function Transaksi() {
  const { store, addTransaction, updateTransaction, update, setPeriod } = useApp();
  const empty = {
    date: new Date().toISOString().slice(0, 10),
    type: "expense" as "income" | "expense",
    amount: 0,
    category: store.categories.find((c) => c.type === "expense")?.id ?? "",
    walletId: store.wallets[0]?.id ?? "",
    note: "",
  };
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<Transaction | null>(null);

  const isEdit = !!editing;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.walletId || !form.category || form.amount <= 0) return;
    if (isEdit && editing) {
      updateTransaction(editing.id, { ...form }, editing);
      setEditing(null);
    } else {
      addTransaction({ ...form });
    }
    setForm(empty);
  };

  const handleEdit = (t: Transaction) => {
    setEditing(t);
    setForm({ date: t.date, type: t.type, amount: t.amount, category: t.category, walletId: t.walletId, note: t.note });
  };

  const handleDelete = (id: string) => {
    const t = store.transactions.find((x) => x.id === id);
    if (!t) return;
    const wallets = store.wallets.map((w) =>
      w.id === t.walletId ? { ...w, balance: w.balance + (t.type === "income" ? -t.amount : t.amount) } : w
    );
    update({ wallets, transactions: store.transactions.filter((x) => x.id !== id) });
  };

  const sorted = [...store.transactions].sort((a, b) => b.date.localeCompare(a.date));
  const visible = sorted.filter((t) => inPeriod(t.date, store.period));

  return (
    <Layout>
      <div className="flex flex-col gap-6 pb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-dark">Transaksi</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted">Filter: {store.period}</span>
            <PeriodFilter value={store.period} onChange={setPeriod} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-light p-6 shadow-sm">
          <h2 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
            <IconPlus className="w-5 h-5 text-primary" />
            {isEdit ? "Edit Transaksi" : "Tambah Transaksi"}
          </h2>
          {store.wallets.length === 0 || store.categories.length === 0 ? (
            <p className="text-sm text-muted">
              Tambahkan dulu dompet (di{" "}
              <a href="/dompet" className="text-primary underline">Dompet</a>{") "}
              dan kategori.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
              <div>
                <label className="text-xs text-muted">Tanggal</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="mt-1 w-full px-3 py-2 border border-light rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted">Tipe</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "income" | "expense" })} className="mt-1 w-full px-3 py-2 border border-light rounded-lg text-dark bg-white focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                  <option value="income">Pemasukan</option>
                  <option value="expense">Pengeluaran</option>
                </select>
              </div>
              <NumberInput label="Jumlah" value={form.amount} onChange={(v) => setForm({ ...form, amount: v })} placeholder="0" />
              <div>
                <label className="text-xs text-muted">Kategori</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1 w-full px-3 py-2 border border-light rounded-lg text-dark bg-white focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                  {store.categories.filter((c) => c.type === form.type).map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted">Dompet</label>
                <select value={form.walletId} onChange={(e) => setForm({ ...form, walletId: e.target.value })} className="mt-1 w-full px-3 py-2 border border-light rounded-lg text-dark bg-white focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                  {store.wallets.map((w) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-3">
                <label className="text-xs text-muted">Catatan</label>
                <input type="text" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="mt-1 w-full px-3 py-2 border border-light rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary text-sm" placeholder="opsional" />
              </div>
              <div className="md:col-span-7 flex gap-2">
                <button type="submit" disabled={!form.walletId || form.amount <= 0} className="h-9 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary/80 disabled:opacity-50 transition">
                  {isEdit ? "Update" : "Simpan"}
                </button>
                {isEdit && (
                  <button type="button" onClick={() => { setEditing(null); setForm(empty); }} className="h-9 px-4 rounded-lg border border-light text-secondary hover:bg-light transition">Batal</button>
                )}
              </div>
            </form>
          )}
        </div>

        <div className="bg-white rounded-xl border border-light shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-dark">Semua Transaksi</h2>
            <span className="text-sm text-muted">{visible.length} transaksi</span>
          </div>
          {visible.length === 0 ? (
            <p className="text-muted text-center py-10">Tidak ada transaksi di periode ini.</p>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[640px]">
                <TransactionList transactions={visible} categories={store.categories} wallets={store.wallets} onEdit={handleEdit} onDelete={handleDelete} />
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function PeriodFilter({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  const opts: Period[] = ["minggu", "bulan", "tahun"];
  return (
    <div className="flex gap-1 bg-light rounded-lg p-1">
      {opts.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`px-2.5 py-1 rounded-md text-xs transition ${value === o ? "bg-primary text-white shadow" : "text-secondary hover:text-primary"}`}
        >
          {o.charAt(0).toUpperCase() + o.slice(1)}
        </button>
      ))}
    </div>
  );
}
