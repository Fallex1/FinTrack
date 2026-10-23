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

