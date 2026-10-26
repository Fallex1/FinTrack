import { useState } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import { fmtRp } from "@/lib/types";
import { IconTrash, IconPlus } from "@/components/Icons";
import NumberInput from "@/components/NumberInput";

export default function Dompet() {
  const { store, addWallet, update } = useApp();
  const [form, setForm] = useState({ name: "", balance: 0, color: "#8686f8" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    addWallet(form.name, form.balance, form.color);
    setForm({ name: "", balance: 0, color: "#8686f8" });
  };

  const removeWallet = (id: string) => update({ wallets: store.wallets.filter((w) => w.id !== id) });
  const totalBalance = store.wallets.reduce((a, w) => a + w.balance, 0);

  return (
    <Layout>
      <div className="flex flex-col gap-6 pb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-dark">Dompet</h1>
          <span className="text-sm text-muted">Saldo total: {fmtRp(totalBalance)}</span>
        </div>

        {store.wallets.length === 0 ? (
          <p className="text-muted text-center py-10">Belum ada dompet. Tambahkan dompet pertama.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {store.wallets.map((w) => (
              <div key={w.id} className="bg-white rounded-xl border border-light p-4 shadow-sm flex justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4 rounded-full" style={{ backgroundColor: w.color }} />
                  <div>
                    <span className="font-medium text-dark block">{w.name}</span>
                    <span className="text-sm text-muted">{fmtRp(w.balance)}</span>
                  </div>
                </div>
                <button onClick={() => removeWallet(w.id)} className="text-muted hover:text-red-500 transition">
                  <IconTrash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-xl border border-light p-6 shadow-sm">
          <h2 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
            <IconPlus className="w-5 h-5 text-primary" />
            Tambah Dompet
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-xs text-muted">Nama</label>
              <input type="text" placeholder="Dompet Tunai" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full px-3 py-2 border border-light rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
            </div>
            <NumberInput label="Saldo Awal" value={form.balance} onChange={(v) => setForm({ ...form, balance: v })} placeholder="0" />
            <div>
              <label className="text-xs text-muted">Warna</label>
              <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="mt-1 w-full h-9 p-0 border border-light rounded-lg bg-transparent cursor-pointer" />
            </div>
            <button type="submit" className="h-9 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary/80 transition">Simpan</button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
