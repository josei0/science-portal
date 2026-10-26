# Acuan dan ralat modul IPA SD kelas 1–3

Ditinjau pada 26 Oktober 2026 sebelum mengubah modul 33–35.

## Acuan yang dipelajari

Inventaris database mencakup 35 modul (maksimum ID 35), termasuk 32 modul sebelum paket ini. Contoh IPA SD kelas 1–3 yang dibaca: Panca Indra (1), Habitat Hewan (2), Cuaca (6), Bagian Tumbuhan (13), Wujud Benda (14), dan Waktu dan Musim (30). Struktur data seluruh kategori juga dibandingkan.

- Materi lama memakai judul topik langsung, pengantar singkat, subjudul bernomor, paragraf pendek, contoh, serta gambar/video bila tersedia.
- Modul IPA kelas awal umumnya sekitar 100–170 kata, dengan 3 soal pilihan ganda. Paket baru sebelumnya sekitar 415–469 kata. Revisi menjadi sekitar 237–272 kata termasuk petunjuk, aktivitas, dan sumber.
- Alur siswa: teori → kuis pembuka → game → skor/XP. Kuis memakai `quiz_data.questions`, empat pilihan, indeks jawaban, dan waktu per soal.
- Format game harus diperiksa pada komponen siswa **dan** `GameBuilder`. `FillBlanksGame` mendukung format `passage/answers`, tetapi editor hanya membaca `fill_blanks: [{sentence, answer, options}]`. Karena itu, format lama paket ini menampilkan editor kosong meskipun game dapat dimainkan.
- Tidak semua modul lama merupakan contoh yang sesuai: PKn (31–32) berada di kategori SD, tetapi bukan IPA. Proyek video (25–27) tidak memiliki kuis/game. Pengecualian tersebut tidak dijadikan standar paket lengkap atau otomatis diubah dalam tugas ini.

## Hasil revisi

| ID | Judul | Game | Isi |
| --- | --- | --- | --- |
| 33 | Daur Hidup Kupu-Kupu | `sequence` | Empat tahap utama; enam kartu pengamatan pendek |
| 34 | Benda Terapung dan Tenggelam | `fill_blanks` | Delapan kalimat pendek dalam format editor guru |
| 35 | Bahan yang Menyerap Air | `dynamic_match` | Tiga kelompok, dua belas kartu bahan/pengamatan |

Setiap modul tetap memiliki ilustrasi asli, kegiatan pengamatan, enam soal dengan 75 detik per soal, dan tantangan penerapan. Video perahu memakai format sematan yang sudah didukung aplikasi, dengan tautan alternatif. Teks teori memakai elemen standar editor (`h1`, `h3`, `p`, daftar, `img`, `iframe`, `a`), tanpa pembungkus `section/figure` khusus.

Revisi hanya menyentuh judul, deskripsi, teori, kuis, dan data game. ID, slug, kategori, urutan, jenis game, status terbit, XP, KKM, badge, serta tabel progres tetap dipertahankan. Salinan sebelum revisi dan receipt verifikasi disimpan bersama sumber modul.

## Pemeriksaan

- `node scripts/publish-sd13-discovery.mjs`: validasi konten, kuis, ilustrasi, dan skema game.
- `node scripts/check-sd13-components.mjs`: memuat komponen TSX aktual melalui TypeScript, memeriksa editor guru/kuis, serta menjalankan inisialisasi game siswa dengan hook pengujian. Animasi dan penyimpanan skor tidak dijalankan; ini bukan pengujian browser penuh.
- `node scripts/revise-sd13-discovery.mjs --preflight`: pemeriksaan baseline dan duplikasi tanpa perubahan database.
- `node scripts/revise-sd13-discovery.mjs --apply`: pembaruan terbatas dengan cadangan, verifikasi isi, dan perbandingan seluruh modul lain. Menolak perubahan baseline yang belum ditinjau; mengenali revisi yang sudah diterapkan.

Aturan jenjang: kelas 1–3 dan 4–6 adalah **IPA**; kelas 7–9 dan 10–12 khusus **Fisika**.
