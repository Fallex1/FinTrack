import { useState, useRef } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import { IconUpload } from "@/components/Icons";

export default function Pengaturan() {
  const { store, setProfile } = useApp();
  const [name, setName] = useState(store.profile.name ?? "");
  const fileRef = useRef<HTMLInputElement>(null);

  const saveName = () => setProfile({ name, avatar: store.profile.avatar });
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setProfile({ name, avatar: url });
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6 pb-8">
        <h1 className="text-2xl font-bold text-dark">Pengaturan</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* profile */}
          <div className="bg-white rounded-xl border border-light p-6 shadow-sm">
            <h2 className="text-lg font-bold text-dark mb-4">Profil</h2>
            <div className="flex items-center gap-4 mb-4">
              {store.profile.avatar ? (
                <img src={store.profile.avatar} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-light" />
              ) : (
                <span className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-2xl">
                  {store.profile.name?.[0] ?? "F"}
                </span>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="px-3 py-1.5 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/10 transition flex items-center gap-1"
              >
                <IconUpload className="w-4 h-4" />
                Ganti Foto
              </button>
              <input type="file" ref={fileRef} accept="image/*" onChange={onFile} className="hidden" />
            </div>
            <div className="mt-4">
              <label className="text-xs text-muted">Nama</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full px-3 py-2 border border-light rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
              <button onClick={saveName} className="mt-3 w-full h-9 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary/80 transition">Simpan</button>
            </div>
          </div>

          {/* settings */}
          <div className="bg-white rounded-xl border border-light p-6 shadow-sm">
            <h2 className="text-lg font-bold text-dark mb-4">Preferensi</h2>
            <div className="space-y-4 text-sm text-secondary">
              <p>Data disimpan otomatis di perangkat (localStorage).</p>
              <p>Data tidak dikirim ke server manapun.</p>
              <p>Format mata uang: Rupiah (Rp).</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
