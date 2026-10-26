import { useState } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import { fmtRp } from "@/lib/types";
import { IconTrash, IconPlus } from "@/components/Icons";
import type { Wallet } from "@/lib/types";

export default function Dompet() {
  const { store, addWallet, update } = useApp();
  const [form, setForm] = useState({ name: "", balance: "", color: "#8686f8" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bal = parseFloat(form.balance);
    if (!form.name || isNaN(bal)) return;
    addWallet(form.name, bal, form.color);
    setForm({ name: "", balance: "", color: "#8686f8" });
  };

  const removeWallet = (id: string) => {
    update({ wallets: store.wallets.filter((w) => w.id !== id) });
    // recalc: move transactions? keep simple — zero wallet balance
  };

  const totalBalance = store.wallets.reduce((a, w) => a + w.balance, 0);

  return (
    <Layout>
      <div className="flex flex-col gap-6 pb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-dark">Dompet</h1>
          <span className="text-sm text-muted">Saldo total: {fmtRp(totalBalance)}</span>
        </div>

        {/* wallet list */}
        {store.wallets.length === 0 ? (
          <p className="text-muted text-center py-10">Belum ada dompet. Tambahkan dompet pertama.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {store.wallets.map((w: Wallet) => (
              <div key={w.id} className="bg-white rounded-xl border border-light p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: w.color }} />
                    <span className="font-medium text-dark">{w.name}</span>
                  </div>
                  <button onClick={() => removeWallet(w.id)} className="text-muted hover:text-red-500 transition">
                    <IconTrash className="w-4 h-4" />
                  </button>
                </div>
                <p className="mt-2 text-2xl font-bold text-primary">{fmtRp(w.balance)}</p>
              </div>
            ))}
          </div>
        )}

        {/* add form */}
        <div className="bg-white rounded-xl border border-light p-6 shadow-sm">
          <h2 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
            <IconPlus className="w-5 h-5 text-primary" />
            Tambah Dompet
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-xs text-muted">Nama</label>
              <input
                type="text"
                placeholder="Dompet Tunai"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-light rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted">Saldo Awal</label>
              <input
                type="number"
                placeholder="0"
                value={form.balance}
                onChange={(e) => setForm({ ...form, balance: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-light rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted">Warna</label>
              <input
                type="color"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="mt-1 w-full h-9 p-0 border border-light rounded-lg bg-transparent cursor-pointer"
              />
            </div>
            <button
              type="submit"
              className="h-9 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary/80 transition"
            >
              Simpan
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
