import { useState } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import { fmtRp } from "@/lib/types";
import { IconPlus, IconTrash } from "@/components/Icons";
import NumberInput from "@/components/NumberInput";
import type { Debt } from "@/lib/types";

export default function Hutang() {
  const { store, addDebt, updateDebt, update } = useApp();
  const [bayarAmt, setBayarAmt] = useState<Record<string, number>>({});
  const [form, setForm] = useState({ person: "", total: 0, paid: 0, direction: "hutang" as "hutang" | "piutang", note: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.person || form.total <= 0) return;
    addDebt({ person: form.person, total: form.total, paid: form.paid, note: form.note, direction: form.direction });
    setForm({ person: "", total: 0, paid: 0, direction: "hutang", note: "" });
  };

  const handleBayar = (d: Debt, v: number) => { if (d.direction === "hutang") return; const np = Math.min(d.total, Math.max(d.paid, d.paid + v)); updateDebt(d.id, { paid: np }); };
  const removeDebt = (id: string) => update({ debts: store.debts.filter((d) => d.id !== id) });

  const hutang = store.debts.filter((d) => d.direction === "hutang");
  const piutang = store.debts.filter((d) => d.direction === "piutang");
  const totalHutang = hutang.reduce((a, d) => a + (d.total - d.paid), 0);
  const totalPiutang = piutang.reduce((a, d) => a + (d.total - d.paid), 0);

  return (
    <Layout>
      <div className="flex flex-col gap-6 pb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-dark">Hutang & Piutang</h1>
          <div className="flex gap-4 text-sm">
            <span className="text-red-500">Hutang: {fmtRp(totalHutang)}</span>
            <span className="text-green-600">Piutang: {fmtRp(totalPiutang)}</span>
          </div>
        </div>

        {store.debts.length === 0 ? (
          <p className="text-muted text-center py-10">Belum ada catatan hutang/piutang.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {store.debts.map((d: Debt) => (
              <div key={d.id} className="bg-white rounded-xl border border-light p-4 shadow-sm flex justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-dark">{d.person}</p>
                  <p className={`text-xs ${d.direction === "hutang" ? "text-red-500" : "text-green-600"}`}>
                    {d.direction === "hutang" ? "Hutang" : "Piutang"} · {fmtRp(d.total - d.paid)} tersisa
                  </p>
                  {d.note && <p className="text-xs text-muted truncate">{d.note}</p>}
                  {d.direction === "hutang" && d.total - d.paid > 0 && (
                    <form key={d.id+"-bayar"} onSubmit={(e) => { e.preventDefault(); handleBayar(d, bayarAmt[d.id] ?? 0); }} className="mt-2 flex gap-1 items-end">
                      <NumberInput value={bayarAmt[d.id] ?? 0} onChange={(v) => setBayarAmt((b) => ({ ...b, [d.id]: v }))} placeholder="0" />
                      <button type="submit" className="h-8 px-3 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/80">Bayar</button>
                    </form>
                  )}
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
            Tambah Hutang / Piutang
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <div><label className="text-xs text-muted">Nama</label><input type="text" placeholder="Nama" value={form.person} onChange={(e) => setForm({ ...form, person: e.target.value })} className="mt-1 w-full px-3 py-2 border border-light rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary text-sm" /></div>
            <NumberInput label="Total" value={form.total} onChange={(v) => setForm({ ...form, total: v })} placeholder="0" />
            <NumberInput label="Dibayar" value={form.paid} onChange={(v) => setForm({ ...form, paid: v })} placeholder="0" />
            <div>
              <label className="text-xs text-muted">Jenis</label>
              <select value={form.direction} onChange={(e) => setForm({ ...form, direction: e.target.value as "hutang" | "piutang" })} className="mt-1 w-full px-3 py-2 border border-light rounded-lg text-dark bg-white focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                <option value="hutang">Hutang</option>
                <option value="piutang">Piutang</option>
              </select>
            </div>
            <div><label className="text-xs text-muted">Catatan</label><input type="text" placeholder="opsional" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="mt-1 w-full px-3 py-2 border border-light rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary text-sm" /></div>
            <button type="submit" className="h-9 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary/80 transition">Simpan</button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
