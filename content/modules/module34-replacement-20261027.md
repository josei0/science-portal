# Penggantian modul 34 — 27 Oktober 2026

Pengguna menyatakan topik terapung dan tenggelam sudah pernah diajarkan. Modul 34 diganti menjadi **Makhluk Hidup dan Benda Tak Hidup**, IPA untuk SD kelas 1–3. Ini revisi yang diminta pengguna, bukan penyisipan modul baru.

## Acuan dan cakupan

- Inventaris database langsung, termasuk modul belum terbit, diperiksa sebelum penulisan: 35 modul, ID maksimum 35. Tidak ada modul lain dengan topik utama yang sama.
- Teori mengikuti edit langsung pengguna pada modul 33 (Daur Hidup Kupu-Kupu) dan 35 (Bahan yang Menyerap Air): judul dengan emoji, pengantar sehari-hari, satu tujuan, ilustrasi, submateri bernomor, lalu video bila tersedia. Pengamatan sederhana disisipkan ke submateri.
- Snapshot kedua modul disimpan di `sd13-user-edited-20261027.json`. Tidak ada pembaruan database terhadap keduanya. Pembandingan seluruh field setelah penggantian dan setelah pengujian memastikan edit tersebut tetap utuh.
- Data lama modul 34 dicadangkan di `module34-before-replacement-20261027.json`. Sebelum penggantian, tidak ada progres siswa pada modul tersebut. ID, urutan, dan waktu pembuatan dipertahankan.
- Skrip publikasi/pembaruan lama dibatasi agar paket yang sudah diterbitkan tidak dimasukkan ulang atau menimpa edit pengguna. `replace-module34.mjs` membatasi pembaruan ke modul 34 dan menolak konten yang berubah sejak snapshot.

## Isi dan referensi

Teori menekankan bahwa gerak saja tidak menunjukkan kehidupan: kucing tidur tetap hidup, tanaman tumbuh, sedangkan robot memakai baterai dan bola dapat bergerak karena angin. Ilustrasi SVG asli menampilkan kucing, tanaman, robot, dan batu. Enam pertanyaan kuis diberi waktu 75 detik per soal. Game memakai format `fill_blanks` yang didukung editor guru, dengan delapan isian dan empat pengecoh tanpa tekanan waktu.

- Rujukan konsep klasifikasi pada jenjang awal: [kurikulum sains sekolah dasar Inggris, Year 2](https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study/national-curriculum-in-england-science-programmes-of-study). Digunakan sebagai referensi konsep, bukan klaim kesetaraan kurikulum Indonesia.
- Video **Benda Hidup dan Benda Tak Hidup**, Anisah Ekaf: [YouTube](https://www.youtube.com/watch?v=zrcPraGdnpY), tercantum sebagai materi kelas 1 SD pada [katalog video PGSD Universitas Negeri Malang](https://pgsdfip.um.ac.id/video-pembelajaran-karya-mahasiswa/). Pemutaran embed diverifikasi pada halaman siswa produksi.

## Hasil verifikasi

- Validasi data dan inisialisasi komponen aktual editor guru, editor kuis, dan game siswa lulus.
- Modul 34 sudah diterbitkan dan dibaca kembali memakai akses publik; 34 modul lain tidak berubah saat publikasi. Bukti: `module34-replacement-20261027.receipt.json`.
- Akun siswa sementara kelas 2 menjalani alur produksi: teori, enam soal kuis (100), delapan isian game (100), dan kembali ke dashboard. Gambar termuat dan video dapat diputar.
- Database mencatat teori selesai, modul selesai, satu percobaan, skor tertinggi 100, lencana diperoleh, 95 XP game, serta total profil 110 XP termasuk 15 XP teori. Muat ulang mempertahankan akses game; dashboard menunjukkan progres 100% dan satu modul selesai.
- Akun sementara dan seluruh profil/progres pengujiannya dihapus setelah verifikasi. Hasil tanpa kredensial disimpan di `artifacts/qa-module34-replacement-20261027/result.json`; tangkapan layar ilustrasi dan kenaikan level berada pada folder yang sama.
- Batasan yang sudah ada: tampilan timer kuis masih menulis `00:75` untuk 75 detik. Pengujian ini tidak mengubah komponen timer.

Perubahan ini hanya menyentuh konten, dokumentasi, dan skrip authoring/verifikasi; tidak mengubah kode aplikasi frontend.
