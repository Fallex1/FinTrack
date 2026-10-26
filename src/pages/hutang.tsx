import { useState } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import { fmtRp } from "@/lib/types";
import { IconPlus, IconTrash } from "@/components/Icons";
import type { Debt } from "@/lib/types";

export default function Hutang() {
  const { store, addDebt, update } = useApp();
  const [form, setForm] = useState({ person: "", total: "", paid: "0", note: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = parseFloat(form.total);
    const paid = parseFloat(form.paid) || 0;
    if (!form.person || isNaN(total) || total <= 0) return;
    addDebt({ person: form.person, total, paid, note: form.note });
    setForm({ person: "", total: "", paid: "0", note: "" });
  };

  const removeDebt = (id: string) => update({ debts: store.debts.filter((d) => d.id !== id) });
  const totalDebt = store.debts.reduce((a, d) => a + (d.total - d.paid), 0);

  return (
    <Layout>
      <div className="flex flex-col gap-6 pb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-dark">Hutang</h1>
          <span className="text-sm text-muted">Sisa: {fmtRp(totalDebt)}</span>
        </div>

        {store.debts.length === 0 ? (
          <p className="text-muted text-center py-10">Belum ada hutang.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {store.debts.map((d: Debt) => (
              <div key={d.id} className="bg-white rounded-xl border border-light p-4 shadow-sm flex justify-between">
                <div>
                  <p className="font-medium text-dark">{d.person}</p>
                  <p className="text-sm text-muted">Total {fmtRp(d.total)} · Dibayar {fmtRp(d.paid)}</p>
                  {d.note && <p className="text-xs text-muted">{d.note}</p>}
                </div>
                <button onClick={() => removeDebt(d.id)} className="text-muted hover:text-red-500 transition">
                  <IconTrash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-xl border border-light p-6 shadow-sm">
          <h2 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
            <IconPlus className="w-5 h-5 text-primary" />
            Tambah Hutang
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div><label className="text-xs text-muted">Orang/Badan</label><input type="text" placeholder="Nama" value={form.person} onChange={(e) => setForm({ ...form, person: e.target.value })} className="mt-1 w-full px-3 py-2 border border-light rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary text-sm" /></div>
            <div><label className="text-xs text-muted">Total</label><input type="number" placeholder="0" value={form.total} onChange={(e) => setForm({ ...form, total: e.target.value })} className="mt-1 w-full px-3 py-2 border border-light rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary text-sm" /></div>
            <div><label className="text-xs text-muted">Dibayar</label><input type="number" placeholder="0" value={form.paid} onChange={(e) => setForm({ ...form, paid: e.target.value })} className="mt-1 w-full px-3 py-2 border border-light rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary text-sm" /></div>
            <div><label className="text-xs text-muted">Catatan</label><input type="text" placeholder="opsional" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="mt-1 w-full px-3 py-2 border border-light rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary text-sm" /></div>
            <button type="submit" className="h-9 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary/80 transition">Simpan</button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
