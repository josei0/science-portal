import { readFileSync } from 'node:fs';

const figure = (file, alt, caption) => {
  const svg = readFileSync(new URL(`../illustrations/${file}`, import.meta.url));
  return `<figure style="margin:24px 0"><img src="data:image/svg+xml;base64,${svg.toString('base64')}" alt="${alt}" style="width:100%;height:auto;border-radius:16px"/><figcaption style="font-size:14px;margin-top:8px">${caption} Ilustrasi asli Science Portal.</figcaption></figure>`;
};
const q = (question, options, correctAnswerIndex, explanation) => ({ question, options, correctAnswerIndex, explanation, timeLimit: 75 });
const section = (title, text) => `<section style="margin:24px 0"><h2>${title}</h2>${text}</section>`;
const source = (url, label) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
const base = { category: 'sd_1_3', kkm_score: 70, xp_theory: 15, xp_pass: 35, xp_perfect: 60, is_published: true };

export const modules = [
  {
    ...base,
    title: 'Detektif Kebun: Daur Hidup Kupu-Kupu',
    description: 'Temukan hubungan telur, ulat, kepompong, dan kupu-kupu. Pecahkan urutan catatan pengamatan dari sebuah kebun!',
    game_slug: 'sd13-detektif-daur-hidup-kupu-kupu',
    game_type: 'sequence',
    badge_name: 'Detektif Metamorfosis',
    theory_content: `<h1>Siapa yang Berubah di Kebun?</h1>
<p><strong>Untuk SD kelas 1–3 • 20–30 menit.</strong> Kelas 1 boleh membaca bersama guru atau orang tua. Kelas 2–3 mencoba menjelaskan alasan jawabannya sendiri.</p>
<p>Di daun terlihat telur kecil. Beberapa waktu kemudian, ada ulat di dekatnya. Apakah telur itu berubah menjadi hewan yang berbeda, atau masih hewan yang sama pada tahap lain? Kita akan menelusuri petunjuknya!</p>
${section('Misi belajarmu', '<ul><li>Menyebutkan empat tahap daur hidup kupu-kupu.</li><li>Menghubungkan bentuk tubuh dengan kegiatan pada tiap tahap.</li><li>Menyusun catatan pengamatan sesuai urutan kejadian.</li></ul>')}
${figure('butterfly-cycle.svg', 'Diagram empat tahap: telur di daun, ulat, kepompong, dan kupu-kupu dewasa; panah kembali dari dewasa ke telur.', 'Empat tahap utama. Arah panah menunjukkan urutan, bukan lama waktunya.')}
${section('Empat tahap, satu perjalanan', '<p><strong>Telur:</strong> induk meletakkan telur pada tumbuhan yang sesuai. <strong>Ulat atau larva:</strong> menetas dari telur, makan, dan tumbuh. Banyak ulat kupu-kupu memakan daun tumbuhan inangnya.</p><p><strong>Kepompong atau pupa:</strong> tubuh berubah menuju bentuk dewasa. Diam di luar tidak berarti tidak ada perubahan di dalam. <strong>Kupu-kupu dewasa:</strong> keluar dari pupa, mengembangkan sayap, lalu dapat terbang setelah siap. Banyak kupu-kupu dewasa minum nektar bunga.</p>')}
${section('Mengapa disebut daur hidup?', '<p>Perubahan bentuk besar ini disebut <strong>metamorfosis</strong>. Kupu-kupu betina dewasa dapat menghasilkan telur sehingga muncul generasi berikutnya. Kupu-kupu dewasa tidak menyusut kembali menjadi telur. Kita juga tidak menetapkan jumlah hari yang sama untuk semua jenis kupu-kupu.</p>')}
${section('Catatan kebun Nara', '<p>Nara membuat enam kartu: telur di daun; ulat baru menetas; ulat tumbuh; pupa terbentuk; kupu-kupu baru keluar; kupu-kupu siap terbang. Semua kartu menceritakan satu perjalanan yang dimulai dari telur. Dua kartu sama-sama menggambarkan ulat, tetapi ulat yang baru menetas datang lebih dahulu daripada ulat yang sudah tumbuh.</p><p><strong>Pikirkan:</strong> Jika Nara melihat pupa yang masih utuh, apakah ia bisa menyimpulkan bahwa kupu-kupu dewasa sudah keluar? Belum. Ia harus mengamati kejadian berikutnya.</p>')}
${section('Ayo mengamati dengan ramah', '<p>Dengan pendamping, amati daun atau bunga dari jarak yang aman. Gambar apa yang benar-benar terlihat, tulis tanggal, lalu beri nama tahap jika kamu mengenalinya. Jangan menyentuh ulat, membuka pupa, atau memindahkan telur. Jika hanya melihat kupu-kupu dewasa, catat itu saja; jangan mengarang tahap yang belum dilihat.</p>')}
${section('Tantangan sebelum bermain', '<p>Ceritakan perbedaan ulat dan kupu-kupu dewasa dengan dua petunjuk: cara bergerak dan makanan yang biasa dicari. Lalu susun enam kartu pengamatan pada game. Pilih berdasarkan sebab dan urutan, bukan posisi kartu karena letaknya diacak. Kesalahan mengurangi skor; bacalah seluruh kartu dahulu.</p>')}
${section('Ringkasan', '<p><strong>Telur → ulat → pupa → dewasa.</strong> Ulat bukan kupu-kupu kecil yang sudah bersayap. Pupa bukan telur, dan tahap dewasa bukan akhir bagi generasi berikutnya.</p>')}
<p style="font-size:14px">Bacaan pendamping: ${source('https://www.floridamuseum.ufl.edu/educators/resource/butterfly-life-cycle/', 'Florida Museum: Butterfly Life Cycle')} dan ${source('https://naturalhistory.si.edu/education/teaching-resources/life-science/butterflies-and-beyond', 'Smithsonian: Butterflies and Beyond')}. Materi, pertanyaan, dan ilustrasi ditulis khusus untuk Science Portal.</p>`,
    quiz_data: { questions: [
      q('Apa yang biasanya keluar saat telur kupu-kupu menetas?', ['Kupu-kupu dewasa', 'Ulat kecil', 'Bunga', 'Pupa'], 1, 'Telur menetas menjadi larva atau ulat.'),
      q('Tahap utama yang berada di antara ulat dan kupu-kupu dewasa adalah ...', ['Telur', 'Biji', 'Pupa atau kepompong', 'Daun'], 2, 'Ulat berubah menjadi pupa sebelum menjadi dewasa.'),
      q('Pupa tampak diam. Kesimpulan yang tepat adalah ...', ['Pasti sudah mati', 'Pasti kosong', 'Sudah kembali menjadi telur', 'Perubahan tubuh dapat berlangsung di dalamnya'], 3, 'Penampilan diam tidak berarti tidak ada perkembangan.'),
      q('Kartu A: ulat baru menetas. Kartu B: ulat sudah tumbuh. Urutan yang tepat?', ['A lalu B', 'B lalu A', 'Keduanya selalu bersamaan', 'Tidak ada hubungan'], 0, 'Menetas terjadi sebelum ulat tumbuh lebih besar.'),
      q('Mengapa gambar daur hidup memiliki panah dari kupu-kupu dewasa ke telur?', ['Dewasa berubah langsung menjadi telur', 'Sayap berubah menjadi telur', 'Betina dewasa dapat menghasilkan telur generasi berikutnya', 'Telur dapat terbang'], 2, 'Daur berulang melalui generasi berikutnya.'),
      q('Kamu menemukan pupa di ranting. Tindakan pengamat yang baik?', ['Membuka pupa agar cepat keluar', 'Mengamati dari jauh dan mencatat', 'Mengguncang ranting', 'Memindahkannya tanpa bantuan'], 1, 'Pengamatan tidak perlu merusak atau mengganggu hewan.'),
    ] },
    game_data: { sequence: [
      { id: 'egg', content: 'Telur masih utuh di daun', icon: '🥚' },
      { id: 'hatch', content: 'Ulat kecil baru menetas', icon: '🐛' },
      { id: 'grow', content: 'Ulat makan dan tumbuh', icon: '🌿' },
      { id: 'pupa', content: 'Ulat menjadi pupa', icon: '🟤' },
      { id: 'emerge', content: 'Kupu-kupu baru keluar; sayap belum siap', icon: '🦋' },
      { id: 'fly', content: 'Sayap siap; kupu-kupu terbang ke bunga', icon: '🌼' },
    ] },
  },
  {
    ...base,
    title: 'Laboratorium Air: Terapung atau Tenggelam?',
    description: 'Baca hasil percobaan, uji dugaan, dan pecahkan laporan perahu mini. Besar atau kecil saja belum menentukan hasil!',
    game_slug: 'sd13-laboratorium-terapung-tenggelam',
    game_type: 'fill_blanks',
    badge_name: 'Penyelidik Perahu Mini',
    theory_content: `<h1>Misteri di Dalam Baskom</h1>
<p><strong>Untuk SD kelas 1–3 • 20–30 menit.</strong> Pendamping dapat membacakan cerita dan membantu percobaan. Kita belajar dari hasil pengamatan, tanpa rumus.</p>
<p>Sebuah potongan kayu berada di permukaan air, sementara batu kecil turun ke dasar. Mengapa benda yang lebih besar belum tentu tenggelam? Mari menjadi penyelidik, bukan penebak!</p>
${section('Misi belajarmu', '<ul><li>Membedakan terapung dan tenggelam dari posisi benda.</li><li>Membandingkan dugaan dengan hasil yang diamati.</li><li>Menjelaskan bahwa bahan, bentuk, dan beban dapat memengaruhi hasil.</li></ul>')}
${figure('float-lab.svg', 'Kayu terlihat di permukaan air, batu berada di dasar, dan perahu berongga berada di permukaan; hasil contoh pengamatan.', 'Terapung berarti ditopang air di permukaan; sebagian benda boleh terendam.')}
${section('Dua hasil yang dapat kita lihat', '<p>Benda <strong>terapung</strong> tetap berada di permukaan, meskipun sebagian masuk ke air. Benda <strong>tenggelam</strong> turun ke bawah dan, pada baskom dangkal, sampai ke dasar. Air memberikan dorongan ke atas pada benda. Kita akan mengamati hasilnya, bukan menghitung dorongannya.</p><p>Jangan memakai aturan “semua yang kecil terapung” atau “semua yang besar tenggelam”. Bahan dan bentuk benda juga berpengaruh. Benda yang belum diuji sebaiknya diberi dugaan dahulu, bukan langsung dianggap pasti.</p>')}
${section('Perahu yang punya ruang', '<p>Aluminium dapat dibentuk menjadi perahu berongga dengan tepi terangkat. Bentuk itu membantu perahu memindahkan cukup air sehingga dapat terapung. Jika air masuk atau bebannya terlalu banyak, perahu bisa tenggelam. Jadi, bukan karena logam berubah menjadi kayu!</p><p>Letakkan beban secara merata. Semua beban di satu sisi dapat membuat perahu miring. Ubah satu hal dahulu saat membandingkan percobaan: misalnya bentuk perahu, sambil memakai jumlah bahan dan jenis beban yang sama.</p>')}
${section('Baca catatan, jangan menebak', '<p><strong>Contoh hasil kelompok Raka:</strong> kayu berada di permukaan, batu turun ke dasar, perahu kosong terapung, perahu dengan terlalu banyak beban tenggelam. Ini hasil percobaan kelompok Raka, bukan janji bahwa semua benda dari bahan yang sama selalu memberi hasil persis sama.</p><p>Jika dugaan Raka keliru, ia tidak perlu mengganti catatannya agar terlihat benar. Ilmuwan justru memperbaiki penjelasan berdasarkan bukti.</p>')}
${section('Percobaan mini bersama pendamping', '<p>Gunakan baskom dangkal, sedikit air, potongan kayu besar, batu yang cukup besar agar tidak tertelan, dan perahu aluminium yang dibentuk pendamping. Jangan memakai benda tajam, listrik, atau benda berharga. Tidak ada benda yang dimasukkan ke mulut.</p><ol><li>Tulis dugaan sebelum benda diletakkan.</li><li>Letakkan satu benda perlahan, jangan dilempar atau ditekan.</li><li>Amati setelah benda tenang. Catat hasil sebenarnya.</li><li>Ulangi bila ragu. Bersihkan tumpahan agar lantai tidak licin.</li></ol>')}
${section('Video pengamatan pilihan', `<p>Tonton bersama pendamping: ${source('https://www.youtube.com/watch?v=s7bopU_N_fQ', 'Science Buddies — How Much Weight Can Boats Float?')}. Video berbahasa Inggris; fokuslah pada perubahan posisi perahu saat beban ditambahkan. Materi di halaman ini tetap lengkap tanpa menonton video.</p>`)}
${section('Misi game: lengkapi laporan', '<p>Ada delapan bagian laporan yang hilang dan beberapa kata pengecoh. Pilih kata berdasarkan konteks kalimat. Bedakan hasil yang terlihat, dugaan sebelum percobaan, bentuk perahu, dan cara menguji. Tidak ada batas waktu game; teliti lebih penting daripada cepat.</p>')}
<p style="font-size:14px">Bacaan pendamping: ${source('https://www.noaa.gov/office-education/outreach-communication/hands-on-science-activities/build-a-boat', 'NOAA: Build a Boat')} dan ${source('https://www.acs.org/education/resources/k-8/inquiryinaction/second-grade.html', 'ACS: penyelidikan sifat bahan kelas 2')}. Percobaan disederhanakan untuk kelas awal.</p>`,
    quiz_data: { questions: [
      q('Sebagian kayu masuk ke air, tetapi kayu tetap di permukaan. Kayu itu ...', ['Tenggelam', 'Terapung', 'Menguap', 'Mencair'], 1, 'Benda terapung tidak harus seluruhnya berada di atas air.'),
      q('Batu kecil turun ke dasar. Potongan kayu besar tetap di permukaan. Apa kesimpulan terbaik?', ['Ukuran saja belum cukup untuk menebak hasil', 'Semua benda kecil terapung', 'Semua kayu pasti sama', 'Air hanya mendorong benda besar'], 0, 'Bahan dan bentuk juga berpengaruh.'),
      q('Dugaanmu: batu terapung. Hasilnya: batu tenggelam. Apa yang ditulis?', ['Dugaan saja', 'Hasil teman', 'Tidak menulis apa pun', 'Hasil sebenarnya: batu tenggelam'], 3, 'Catatan harus mengikuti pengamatan, bukan keinginan.'),
      q('Perahu mulai miring karena semua beban ada di kiri. Apa yang dicoba?', ['Menambah beban di kiri', 'Menyebarkan beban dengan seimbang', 'Melubangi perahu', 'Menekan perahu ke dasar'], 1, 'Sebaran beban membantu menjaga keseimbangan.'),
      q('Perahu aluminium dapat terapung terutama karena ...', ['Warnanya mengilap', 'Logamnya berubah menjadi kayu', 'Bentuk berongganya membantu memindahkan air', 'Semua logam selalu terapung'], 2, 'Bentuk dan air yang dipindahkan ikut menentukan hasil.'),
      q('Cara mengamati benda dalam baskom yang paling tepat?', ['Letakkan perlahan lalu amati', 'Lempar sekuatnya', 'Tekan terus ke dasar', 'Tutup mata saat mencoba'], 0, 'Dorongan tangan dapat mengubah pengamatan.'),
    ] },
    game_data: {
      passage: 'Laporan Raka: Kayu tetap di [b1] air, sedangkan batu turun ke [b2] baskom. Sebelum mencoba, Raka menulis [b3]. Setelah mencoba, ia mencatat [b4] yang terlihat. Perahu aluminium dibuat [b5], bukan sekadar gumpalan padat. Beban ditaruh secara [b6] agar tidak berat sebelah. Untuk membandingkan dua percobaan, Raka mengubah satu hal dan menjaga hal lain tetap [b7]. Saat ragu, ia [b8] percobaan, bukan mengarang hasil.',
      answers: { b1: 'permukaan', b2: 'dasar', b3: 'dugaan', b4: 'hasil', b5: 'berongga', b6: 'merata', b7: 'sama', b8: 'mengulangi' },
      decoys: ['langit', 'berlubang', 'menumpuk', 'berbeda', 'menghapus'],
    },
  },
  {
    ...base,
    title: 'Misi Tetes Air: Memilih Bahan yang Tepat',
    description: 'Bedakan bahan penyerap air, pelapis penahan air, dan benda yang belum diuji. Pilih bahan berdasarkan bukti!',
    game_slug: 'sd13-misi-tetes-air-daya-serap',
    game_type: 'dynamic_match',
    badge_name: 'Ahli Pemilih Bahan',
    theory_content: `<h1>Tumpahan Air atau Buku Kehujanan?</h1>
<p><strong>Untuk SD kelas 1–3 • 20–30 menit.</strong> Kelas 1 dapat dibantu membaca. Kelas 2–3 mencoba menjelaskan mengapa pilihan bahan bisa berbeda untuk dua tugas.</p>
<p>Nina ingin mengelap meja basah. Bimo ingin melindungi buku dari tetesan air. Apakah mereka sebaiknya memakai bahan yang sama? Belum tentu! Bahan yang baik untuk mengelap belum tentu baik sebagai pelindung air.</p>
${section('Misi belajarmu', '<ul><li>Mengenali tanda air masuk ke dalam bahan.</li><li>Memilih penyerap untuk mengelap dan pelapis untuk melindungi.</li><li>Membedakan kesimpulan berdasarkan bukti dari tebakan.</li></ul>')}
${figure('water-materials.svg', 'Tiga panel: air menyebar ke kain; tetesan tetap di atas plastik utuh; bahan baru diberi tanda tanya karena belum diuji.', 'Lihat perubahan bahan dan posisi air. Warna bahan bukan jawaban.')}
${section('Menyerap berbeda dari menahan air', '<p>Bahan <strong>menyerap</strong> ketika air masuk ke bagian dalamnya. Kain katun, tisu, dan spons kering dapat membantu mengelap tumpahan. Daerah basah dapat meluas atau berubah warna. Air tidak menghilang secara ajaib; sebagian masuk ke bahan.</p><p>Plastik utuh, karet utuh, dan aluminium foil utuh umumnya tidak menyerap air seperti kain. Air dapat tetap berupa tetesan di atasnya. Bahan semacam itu berguna sebagai <strong>pelapis penahan air</strong>. Namun, jika berlubang, air dapat lewat lubang. Itu tidak sama dengan menyerap.</p>')}
${section('Tidak semua tugas membutuhkan bahan yang sama', '<p>Untuk meja basah, Nina memilih kain kering yang sudah terbukti menyerap. Untuk buku, Bimo memakai pelapis plastik utuh yang menahan tetesan. Tisu basah bukan pelindung buku yang baik. Spons yang sudah sangat penuh air juga perlu diperas oleh pendamping sebelum menyerap lebih banyak.</p><p>Nama benda saja kadang belum cukup: dua lembar kertas bisa memiliki lapisan berbeda. Jika ada bahan baru tanpa hasil uji, jawaban ilmiah yang baik adalah <strong>perlu diuji</strong>. Kita tidak menebak sifatnya hanya dari warna atau harganya.</p>')}
${section('Uji tetes yang adil', '<p>Bersama pendamping, siapkan potongan kain katun, tisu, dan plastik utuh pada tiga piring. Gunakan potongan dengan ukuran sebanding, jumlah tetes yang sama, dan waktu pengamatan yang sama.</p><ol><li>Tulis dugaan untuk setiap bahan.</li><li>Beri tiga tetes air pada masing-masing bahan.</li><li>Amati: air menyebar ke bahan atau tetap di permukaan?</li><li>Bandingkan catatan. Jika kurang jelas, ulangi dengan bahan kering.</li></ol><p>Pakai sedikit air dan jauhkan dari listrik. Jangan mencicipi air percobaan. Pendamping membantu menyiapkan bahan; selesai bermain, lap meja dan cuci tangan.</p>')}
${section('Baca bukti sebelum memilih', '<p>Contoh: bahan A menjadi basah sampai bagian belakang setelah diberi tetesan. Bahan B tetap kering di belakang dan air berkumpul di atasnya. Dalam percobaan itu, A adalah calon pengelap, sedangkan B adalah calon pelapis. Kita belum boleh menyimpulkan tentang bahan C yang belum diuji.</p>')}
${section('Misi game: tiga stasiun bahan', '<p>Pilih stasiun terlebih dahulu, lalu cocokkan kartu yang sesuai. Ada 12 kartu dan tiga stasiun: <strong>Menyerap untuk mengelap</strong>, <strong>Menahan sebagai pelapis</strong>, dan <strong>Perlu diuji dahulu</strong>. Beberapa kartu menceritakan hasil pengamatan, bukan menyebut nama bahan. Gunakan petunjuknya; jangan hanya mencari kata yang sama.</p>')}
<p style="font-size:14px">Bacaan pendamping: ${source('https://www.acs.org/education/resources/k-8/inquiryinaction/second-grade/chapter-1/designing-an-absorbency-test.html/1000', 'ACS: Designing an Absorbency Test')} dan ${source('https://www.acs.org/content/dam/acsorg/education/k-8/inquiry-in-action/second-grade/g2-l1.3-bkgd.pdf', 'ACS: dasar penyerapan air')}. Cerita, tantangan, dan ilustrasi merupakan karya asli Science Portal.</p>`,
    quiz_data: { questions: [
      q('Air tumpah di meja. Mana yang cocok untuk menyerapnya?', ['Plastik utuh', 'Kain katun kering', 'Aluminium foil', 'Piring'], 1, 'Kain katun kering dapat menyerap air tumpahan.'),
      q('Mengapa pelapis plastik utuh cocok melindungi buku dari tetesan?', ['Membuat buku lebih berat', 'Memakan air', 'Menahan air agar tidak langsung mengenai buku', 'Mengubah air menjadi udara'], 2, 'Tujuannya menahan air, bukan menyerap ke dalam buku.'),
      q('Plastik berlubang melewatkan air. Itu berarti ...', ['Air bisa lewat lubang, belum membuktikan plastik menyerap', 'Semua plastik menyerap', 'Air selalu naik', 'Kain tidak bisa basah'], 0, 'Air melewati lubang berbeda dengan air masuk ke bahan.'),
      q('Ada kertas baru berlapis, tetapi belum pernah diuji. Sikap terbaik?', ['Pasti menyerap karena disebut kertas', 'Pasti menahan karena warnanya', 'Pasti sama dengan semua kertas', 'Uji dahulu sebelum menyimpulkan'], 3, 'Lapisan bahan dapat memengaruhi sifatnya.'),
      q('Agar uji tetes adil, apa yang perlu dibuat sama?', ['Warna semua bahan', 'Jumlah tetes dan waktu pengamatan', 'Nama pemilik bahan', 'Harga bahan'], 1, 'Perlakuan yang sama membantu perbandingan.'),
      q('Kain menjadi basah setelah menyentuh tumpahan. Airnya ...', ['Hilang tanpa jejak', 'Berubah menjadi kain', 'Sebagian masuk ke dalam kain', 'Tidak bergerak sama sekali'], 2, 'Itulah penyerapan air.'),
    ] },
    game_data: { dynamic_match: { pairs: [
      { category: 'Menyerap untuk mengelap', items: [
        'Kain katun kering untuk tumpahan meja',
        'Tisu kering yang airnya menyebar ke serat',
        'Spons kering yang menampung air di dalamnya',
        'Bahan A: air masuk dan bagian belakang ikut basah',
      ] },
      { category: 'Menahan sebagai pelapis', items: [
        'Plastik utuh untuk melindungi sampul buku',
        'Aluminium foil utuh dengan air tetap di atasnya',
        'Lembaran karet utuh dengan tetesan di permukaan',
        'Bahan B: belakang tetap kering, air berkumpul di atas',
      ] },
      { category: 'Perlu diuji dahulu', items: [
        'Kertas berlapis baru tanpa catatan percobaan',
        'Bahan C yang baru dilihat warnanya saja',
        'Kain berlapis yang belum diberi tetesan air',
        'Bahan D yang sifatnya belum diketahui',
      ] },
    ] } },
  },
];
