# FinTrack

Pencatat keuangan pribadi yang jalan penuh di browser. Tanpa akun, tanpa server, tanpa biaya. Total 47 KB, nol dependency, nol request keluar setelah halaman dimuat.

## Fitur

- Ringkasan saldo bersih, pemasukan, pengeluaran, plus status penyimpanan lokal.
- CRUD transaksi: jenis, nominal, kategori, tanggal, catatan. Edit dan hapus dengan tombol urungkan.
- Filter Hari ini / Bulan ini / Semua, pencarian teks, daftar bertahap 200 baris.
- Grafik batang pemasukan vs pengeluaran 6 bulan dan donut distribusi kategori bulan ini, digambar sebagai SVG tanpa library chart.
- Ekspor JSON (backup penuh), ekspor CSV (buka di spreadsheet), impor JSON yang menggabungkan tanpa menghapus data lama, dan reset data dengan konfirmasi.
- Tema terang dan gelap, tersimpan di perangkat.
- Data di `localStorage` key `fintrack:v1`. Tidak ada data yang keluar dari perangkat.

## Jalankan lokal

Buka `index.html` langsung, atau sajikan lewat HTTP:

```bash
py -3 -m http.server 8123
```

Lalu buka `http://127.0.0.1:8123`.

## Deploy ke GitHub Pages (gratis)

```bash
cd "C:/Users/Hype AMD/fintrack"
git init -b main
git add .
git commit -m "FinTrack: pencatat keuangan lokal"
gh repo create fintrack --public --source=. --push
```

Aktifkan Pages:

```bash
gh api -X POST repos/{owner}/fintrack/pages -f "source[branch]=main" -f "source[path]=/"
```

Atau lewat web: repo → Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)` → Save.

Situs tersedia di `https://<user>.github.io/fintrack/`.

## Struktur

| File | Isi |
| --- | --- |
| `index.html` | Shell semantik, form, dialog konfirmasi, toast |
| `styles.css` | Token tema terang/gelap, tata letak, kaca 2 elemen |
| `app.js` | State, localStorage, render daftar, SVG chart, impor/ekspor |
| `DESIGN.md` | Arah desain dan alasan tiap keputusan |

## Catatan

- Data terikat ke satu browser dan satu perangkat. Ganti perangkat, impor JSON hasil ekspor.
- Membersihkan data situs di browser menghapus catatan. Unduh JSON dulu.
- Format `id-ID`, mata uang IDR tanpa desimal.

Lisensi MIT.
