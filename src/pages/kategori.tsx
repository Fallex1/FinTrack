import { useState } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import { IconPlus, IconTrash } from "@/components/Icons";
import type { Category, TxType } from "@/lib/types";

const ICONS = [
  "https://img.icons8.com/parakeet-line/48/noodles.png",
  "https://img.icons8.com/parakeet-line/48/card-wallet.png",
  "https://img.icons8.com/parakeet-line/48/wallet.png",
  "https://img.icons8.com/parakeet-line/48/economic-improvement.png",
  "https://img.icons8.com/parakeet-line/48/pay-date.png",
  "https://img.icons8.com/parakeet-line/48/barbershop.png",
  "https://img.icons8.com/parakeet-line/48/shopping-cart.png",
];

const COLORS = ["#8686f8", "#f97316", "#3b82f6", "#ec4899", "#a855f7", "#22c55e", "#eab308", "#ef4444"];

const DEFAULT_ICON = ICONS[5];

export default function Kategori() {
  const { store, addCategory, update } = useApp();
  const [form, setForm] = useState({ name: "", type: "expense" as TxType, color: "#8686f8", icon: DEFAULT_ICON });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    addCategory(form.name, form.type, form.color, form.icon);
    setForm({ name: "", type: "expense", color: "#8686f8", icon: DEFAULT_ICON });
  };

  const removeCat = (id: string) => update({ categories: store.categories.filter((c) => c.id !== id) });

  return (
    <Layout>
      <div className="flex flex-col gap-6 pb-8">
        <h1 className="text-2xl font-bold text-dark">Kategori</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {store.categories.map((c: Category) => (
            <div key={c.id} className="bg-white rounded-xl border border-light p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={c.icon ?? DEFAULT_ICON} alt="" className="w-6 h-6" />
                <span className="font-medium text-dark">{c.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${c.type === "income" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {c.type === "income" ? "Pemasukan" : "Pengeluaran"}
                </span>
              </div>
              <button onClick={() => removeCat(c.id)} className="text-muted hover:text-red-500 transition">
                <IconTrash className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-light p-6 shadow-sm">
          <h2 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
            <IconPlus className="w-5 h-5 text-primary" />
            Tambah Kategori
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-xs text-muted">Nama</label>
              <input type="text" placeholder="Makan" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full px-3 py-2 border border-light rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted">Tipe</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as TxType })} className="mt-1 w-full px-3 py-2 border border-light rounded-lg text-dark bg-white focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                <option value="income">Pemasukan</option>
                <option value="expense">Pengeluaran</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted">Warna</label>
              <div className="mt-1 flex items-center gap-2">
                <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-8 h-8 p-0 border border-light rounded cursor-pointer" />
                <div className="flex flex-wrap gap-1">
                  {COLORS.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setForm({ ...form, color: col })}
                      className={`w-6 h-6 rounded border-2 transition ${form.color === col ? "border-dark" : "border-light"}`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted">Icon</label>
              <div className="mt-1 grid grid-cols-7 gap-1">
                {ICONS.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setForm({ ...form, icon: ic })}
                    className={`w-7 h-7 rounded border-2 transition ${form.icon === ic ? "border-primary" : "border-light"}`}
                  >
                    <img src={ic} alt="" className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </form>
          <button type="submit" disabled={!form.name} onClick={handleSubmit} className="mt-4 h-9 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary/80 disabled:opacity-50 transition">Simpan</button>
        </div>
      </div>
    </Layout>
  );
}
