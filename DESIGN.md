# FinTrack, arah desain

Design Read: buku kas pribadi untuk satu orang, dipakai di HP dan laptop, bahasa visual "statement bank yang tenang" dengan glass sebagai aksen. Dial ENERGY 2 / RHYTHM 2 / MOTION 1.

## Keputusan dan alasannya (R-31)

- **Palet:** netral kertas hangat + ink, satu aksen teal `#0B6B5D`, dua warna data (hijau pemasukan `#146B4F`, tanah liat pengeluaran `#9C3F2C`). Alasan: uang butuh arah warna yang bisa dibaca sekilas, sisa UI tetap netral supaya angka jadi fokus. Tidak pakai gradient biru-ungu atau neon (R-01).
- **Latar:** gradient muted satu keluarga warna (sage ke abu-teal), bukan pastel/neon. Alasan: memberi kedalaman untuk efek kaca tanpa jadi dekorasi.
- **Glassmorphism:** dijatah 2 elemen saja, kartu saldo dan panel form cepat. Sisanya surface solid. Ini hasil keputusan pemilik produk atas benturan R-10/R-01, dengan pengurangan dosis dari permintaan awal.
- **Tipografi:** system UI stack, angka `tabular-nums`. Alasan: nol byte font, render native di tiap OS, dan app harus jalan offline penuh. Bukan pilihan karena default model.
- **Tata letak:** bukan sidebar + 4 kartu statistik. Satu panel pernyataan saldo di atas (fokus tunggal), lalu ledger sebagai pekerjaan utama dan form cepat di sebelahnya. Alasan: keputusan user tiap hari adalah "sisa uangku berapa dan apa yang baru keluar", bukan membaca dashboard.
- **Motif identitas:** garis rambut seperti buku kas, kolom tanggal kecil di kiri, nominal rata kanan dengan angka tabular. Diulang di semua daftar.
- **Radius:** 14px untuk permukaan, 10px untuk kontrol, 999px hanya untuk chip status penyimpanan yang memang menandai keadaan.
- **Grafik:** SVG tulis sendiri, tanpa library chart. Alasan: 0 KB dependency, tetap tajam di semua layar.
- **Donut kategori:** satu ramp warna teal, identitas segmen dibawa label dan persentase, bukan warna. Alasan: menghindari 5 warna acak (R-29) sekaligus tidak bergantung pada warna saja.
- **Gerak:** transisi hover/focus 140ms saja, semua dimatikan saat `prefers-reduced-motion`. Dial MOTION 1.
- **Tema:** light default, toggle dark yang benar-benar jalan (R-21/R-34).

## Teknis

- Tanpa framework, tanpa font eksternal, tanpa CDN. Total < 40 KB.
- Data di `localStorage` key `fintrack:v1`, tema di `fintrack:theme`.
- Daftar di-cap 200 baris per render dengan tombol muat lagi, supaya DOM tetap ringan di HP murah.
- Tidak ada data contoh. Data kosong tampil sebagai empty state yang menyebut langkah berikutnya.
