import { useState } from "react";
import Layout from "@/components/Layout";
import NumberInput from "@/components/NumberInput";
import { useApp } from "@/context/AppContext";
import { fmtRp } from "@/lib/types";
import { IconPlus, IconTrash, IconWallet } from "@/components/Icons";
import type { Saving } from "@/lib/types";

export default function Tabungan() {
  const { store, addSaving, updateSaving, update } = useApp();
  const [form, setForm] = useState({ name: "", goal: 0, note: "" });
  const [setor, setSetor] = useState({ savingId: "", amount: 0 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || form.goal <= 0) return;
    addSaving({ name: form.name, goal: form.goal, saved: 0, note: form.note });
    setForm({ name: "", goal: 0, note: "" });
  };

  const handleSetor = (e: React.FormEvent) => {
    e.preventDefault();
    const id = setor.savingId || store.savings[0]?.id;
    if (!id || setor.amount <= 0) return;
    updateSaving(id, setor.amount);
    setSetor({ savingId: id, amount: 0 });
  };

  const removeSave = (id: string) => update({ savings: store.savings.filter((s) => s.id !== id) });

  const totalSaved = store.savings.reduce((a, s) => a + s.saved, 0);
  const totalGoal = store.savings.reduce((a, s) => a + s.goal, 0);

  return (
    <Layout>
      <div className="flex flex-col gap-6 pb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-dark">Tabungan</h1>
          <span className="text-sm text-muted">{fmtRp(totalSaved)} / {fmtRp(totalGoal)}</span>
        </div>

        {store.savings.length === 0 ? (
          <p className="text-muted text-center py-10">Belum ada target tabungan.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {store.savings.map((s: Saving) => {
              const pct = Math.min(100, (s.saved / s.goal) * 100);
              return (
                <div key={s.id} className="bg-white rounded-xl border border-light p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-dark">{s.name}</p>
                    <button onClick={() => removeSave(s.id)} className="text-muted hover:text-red-500 transition">
                      <IconTrash className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="w-full bg-light rounded-full h-3 mb-1">
                    <div className="h-3 rounded-full bg-primary" style={{ width: pct + "%" }} />
                  </div>
                  <p className="text-sm text-muted">{fmtRp(s.saved)} / {fmtRp(s.goal)}</p>
                  {s.note && <p className="text-xs text-muted">{s.note}</p>}
                </div>
              );
            })}
          </div>
        )}

        <div className="bg-white rounded-xl border border-light p-6 shadow-sm">
          <h2 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
            <IconPlus className="w-5 h-5 text-primary" />
            Tambah Target Tabungan
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div><label className="text-xs text-muted">Nama</label><input type="text" placeholder="Liburan" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full px-3 py-2 border border-light rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary text-sm" /></div>
            <NumberInput label="Target" value={form.goal} onChange={(v) => setForm({ ...form, goal: v })} placeholder="0" />
            <div className="md:col-span-2"><label className="text-xs text-muted">Catatan</label><input type="text" placeholder="opsional" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="mt-1 w-full px-3 py-2 border border-light rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary text-sm" /></div>
            <button type="submit" className="h-9 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary/80 transition">Simpan Target</button>
          </form>
        </div>

        {store.savings.length > 0 && (
          <div className="bg-white rounded-xl border border-light p-6 shadow-sm">
            <h2 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
              <IconWallet className="w-5 h-5 text-primary" />
              Setor Tabungan
            </h2>
            <form onSubmit={handleSetor} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="text-xs text-muted">Tabungan</label>
                <select value={setor.savingId} onChange={(e) => setSetor({ ...setor, savingId: e.target.value })} className="mt-1 w-full px-3 py-2 border border-light rounded-lg text-dark bg-white focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                  {store.savings.map((s: Saving) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <NumberInput label="Jumlah" value={setor.amount} onChange={(v) => setSetor({ ...setor, amount: v })} placeholder="0" />
              <button type="submit" className="h-9 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary/80 transition">Setor</button>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}
