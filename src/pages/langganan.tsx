import { useState } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import { fmtRp } from "@/lib/types";
import { IconPlus, IconTrash } from "@/components/Icons";
import type { Subscription } from "@/lib/types";

export default function Langganan() {
  const { store, addSubscription, update } = useApp();
  const [form, setForm] = useState({ name: "", amount: "", cycle: "bulan", note: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(form.amount);
    if (!form.name || isNaN(amt) || amt <= 0) return;
    addSubscription({ name: form.name, amount: amt, cycle: form.cycle, note: form.note });
    setForm({ name: "", amount: "", cycle: "bulan", note: "" });
  };

  const removeSub = (id: string) => update({ subscriptions: store.subscriptions.filter((s) => s.id !== id) });
  const totalSub = store.subscriptions.reduce((a, s) => a + s.amount, 0);

  return (
    <Layout>
      <div className="flex flex-col gap-6 pb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-dark">Langganan</h1>
          <span className="text-sm text-muted">Total {fmtRp(totalSub)}</span>
        </div>

        {store.subscriptions.length === 0 ? (
          <p className="text-muted text-center py-10">Belum ada langganan.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {store.subscriptions.map((s: Subscription) => (
              <div key={s.id} className="bg-white rounded-xl border border-light p-4 shadow-sm flex justify-between">
                <div>
                  <p className="font-medium text-dark">{s.name}</p>
                  <p className="text-sm text-muted">{fmtRp(s.amount)} / {s.cycle}</p>
                  {s.note && <p className="text-xs text-muted">{s.note}</p>}
                </div>
                <button onClick={() => removeSub(s.id)} className="text-muted hover:text-red-500 transition">
                  <IconTrash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-xl border border-light p-6 shadow-sm">
          <h2 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
            <IconPlus className="w-5 h-5 text-primary" />
            Tambah Langganan
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div><label className="text-xs text-muted">Nama</label><input type="text" placeholder="Netflix" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full px-3 py-2 border border-light rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary text-sm" /></div>
            <div><label className="text-xs text-muted">Jumlah</label><input type="number" placeholder="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="mt-1 w-full px-3 py-2 border border-light rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary text-sm" /></div>
            <div><label className="text-xs text-muted">Siklus</label><select value={form.cycle} onChange={(e) => setForm({ ...form, cycle: e.target.value })} className="mt-1 w-full px-3 py-2 border border-light rounded-lg text-dark bg-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"><option value="bulan">Bulan</option><option value="tahun">Tahun</option><option value="minggu">Minggu</option></select></div>
            <div><label className="text-xs text-muted">Catatan</label><input type="text" placeholder="opsional" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="mt-1 w-full px-3 py-2 border border-light rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary text-sm" /></div>
            <button type="submit" className="h-9 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary/80 transition">Simpan</button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
