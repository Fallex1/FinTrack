import { useState } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import { IconPlus, IconTrash, IconEdit } from "@/components/Icons";
import type { Category } from "@/lib/types";

export default function Kategori() {
  const { store, addCategory, update } = useApp();
  const [form, setForm] = useState({ name: "", type: "expense" as "income" | "expense", color: "#8686f8" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    addCategory(form.name, form.type, form.color);
    setForm({ name: "", type: "expense", color: "#8686f8" });
  };

  const removeCat = (id: string) => {
    update({ categories: store.categories.filter((c) => c.id !== id) });
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6 pb-8">
        <h1 className="text-2xl font-bold text-dark">Kategori</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {store.categories.map((c: Category) => (
            <div key={c.id} className="bg-white rounded-xl border border-light p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
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
              <input type="text" placeholder="Makanan" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full px-3 py-2 border border-light rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted">Tipe</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "income" | "expense" })} className="mt-1 w-full px-3 py-2 border border-light rounded-lg text-dark bg-white focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                <option value="income">Pemasukan</option>
                <option value="expense">Pengeluaran</option>
              </select>
            </div>
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
