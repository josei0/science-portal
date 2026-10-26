import { readFileSync } from 'node:fs';

const figure = (file, alt, caption) => {
  const svg = readFileSync(new URL(`../illustrations/${file}`, import.meta.url));
  return `<p><img src="data:image/svg+xml;base64,${svg.toString('base64')}" alt="${alt}" width="720" style="max-width:100%;height:auto"/></p><p><em>${caption}</em></p>`;
};
const q = (question, options, correctAnswerIndex, explanation) => ({ question, options, correctAnswerIndex, explanation, timeLimit: 75 });
const section = (title, text) => `<h3>${title}</h3>${text}`;
const source = (url, label) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
const base = { category: 'sd_1_3', kkm_score: 70, xp_theory: 15, xp_pass: 35, xp_perfect: 60, is_published: true };
const support = '<p><em>IPA • SD kelas 1–3. Mintalah bantuan guru atau orang tua jika perlu dibacakan.</em></p>';

export const modules = [
  {
    ...base,
    title: 'Daur Hidup Kupu-Kupu',
    description: 'Ayo kenali perubahan telur, ulat, kepompong, dan kupu-kupu, lalu susun urutan pertumbuhannya!',
    game_slug: 'sd13-detektif-daur-hidup-kupu-kupu',
    game_type: 'sequence',
    badge_name: 'Detektif Metamorfosis',
    theory_content: `<h1>Daur Hidup Kupu-Kupu 🐛🦋</h1>
${support}
<p>Pernah melihat ulat di daun? Ulat kupu-kupu akan berubah menjadi kupu-kupu dewasa. Perubahan bentuk ini disebut <strong>metamorfosis</strong>.</p>
<p><strong>Tujuan:</strong> mengenali empat tahap hidup dan mengurutkan perubahan yang terjadi.</p>
${figure('butterfly-cycle.svg', 'Urutan telur, ulat, kepompong, dan kupu-kupu dewasa. Dewasa menghasilkan telur untuk generasi berikutnya.', 'Ikuti arah panah untuk melihat urutannya.')}
${section('1. Telur di Daun 🥚', '<p>Kupu-kupu betina meletakkan telur pada tumbuhan yang sesuai. Dari telur, menetas ulat kecil.</p>')}
${section('2. Ulat yang Tumbuh 🐛', '<p>Ulat disebut juga <strong>larva</strong>. Ulat makan dan tumbuh semakin besar. Banyak ulat kupu-kupu memakan daun.</p>')}
${section('3. Kepompong atau Pupa 🌿', '<p>Ulat berubah menjadi <strong>pupa</strong>. Dari luar tampak diam, tetapi tubuhnya sedang berubah. Jangan membuka atau mengguncang pupa.</p>')}
${section('4. Kupu-Kupu Dewasa 🦋', '<p>Kupu-kupu keluar dari pupa. Setelah sayapnya siap, ia dapat terbang. Banyak kupu-kupu minum nektar bunga. Betina dewasa dapat menghasilkan telur baru, sehingga daur hidup berulang.</p>')}
${section('Ayo Mengamati 🔎', '<p>Bersama pendamping, amati kebun tanpa menyentuh hewannya. Gambar tahap yang kamu temukan. Jika hanya melihat kupu-kupu, jangan menambahkan ulat yang tidak terlihat.</p><p><strong>Coba pikirkan:</strong> mana yang terjadi lebih dahulu, ulat menetas atau ulat tumbuh besar? Jelaskan alasanmu.</p>')}
${section('Ingat dan Mainkan 🎮', '<p><strong>Telur → ulat → pupa → dewasa.</strong> Kupu-kupu dewasa menghasilkan telur, bukan berubah kembali menjadi telur.</p><p>Di game, susun enam kartu mulai dari telur. Ada dua kartu tentang ulat dan dua tentang kupu-kupu. Perhatikan apa yang terjadi lebih dahulu!</p>')}
<p>Bacaan pendamping: ${source('https://www.floridamuseum.ufl.edu/educators/resource/butterfly-life-cycle/', 'Florida Museum')} dan ${source('https://naturalhistory.si.edu/education/teaching-resources/life-science/butterflies-and-beyond', 'Smithsonian')}. Ilustrasi asli Science Portal.</p>`,
    quiz_data: { questions: [
      q('Apa yang keluar saat telur kupu-kupu menetas?', ['Kupu-kupu dewasa', 'Ulat kecil', 'Bunga', 'Pupa'], 1, 'Telur menetas menjadi ulat kecil.'),
      q('Setelah ulat, tahap berikutnya adalah ...', ['Telur', 'Biji', 'Pupa', 'Daun'], 2, 'Ulat menjadi pupa sebelum menjadi kupu-kupu dewasa.'),
      q('Pupa tampak diam. Apa yang terjadi di dalamnya?', ['Tubuh berubah', 'Sayap menjadi daun', 'Ulat bertelur', 'Tubuh menjadi batu'], 0, 'Tubuh berkembang menjadi bentuk dewasa di dalam pupa.'),
      q('Mana urutan yang benar?', ['Ulat besar → telur menetas', 'Terbang → keluar dari pupa', 'Pupa → ulat menetas', 'Ulat menetas → ulat tumbuh'], 3, 'Ulat menetas dahulu, lalu makan dan tumbuh.'),
      q('Mengapa daur hidup bisa berulang?', ['Sayap berubah menjadi telur', 'Pupa berubah menjadi daun', 'Kupu-kupu betina bertelur', 'Telur kembali menjadi ulat besar'], 2, 'Telur yang dihasilkan betina memulai generasi berikutnya.'),
      q('Ada pupa di ranting. Apa yang sebaiknya kamu lakukan?', ['Membukanya', 'Mengamati tanpa menyentuh', 'Mengguncang ranting', 'Menariknya dari ranting'], 1, 'Amati dan catat tanpa mengganggu pertumbuhannya.'),
    ] },
    game_data: { sequence: [
      { id: 'egg', content: 'Telur utuh di daun', icon: '🥚' },
      { id: 'hatch', content: 'Ulat kecil menetas', icon: '🐛' },
      { id: 'grow', content: 'Ulat makan dan tumbuh', icon: '🌿' },
      { id: 'pupa', content: 'Ulat menjadi pupa', icon: '🟤' },
      { id: 'emerge', content: 'Kupu-kupu keluar dari pupa', icon: '🦋' },
      { id: 'fly', content: 'Sayap siap untuk terbang', icon: '🌼' },
    ] },
  },
  {
    ...base,
    title: 'Benda Terapung dan Tenggelam',
    description: 'Amati benda di air, bandingkan hasil percobaan, dan lengkapi catatan perahu mini!',
    game_slug: 'sd13-laboratorium-terapung-tenggelam',
    game_type: 'fill_blanks',
    badge_name: 'Penyelidik Perahu Mini',
    theory_content: `<h1>Benda Terapung dan Tenggelam 🪵💧</h1>
${support}
<p>Raka meletakkan kayu dan batu ke dalam baskom. Kayu tetap di permukaan, sedangkan batu turun. Mengapa hasilnya berbeda?</p>
<p><strong>Tujuan:</strong> membedakan terapung dan tenggelam serta mencatat hasil percobaan.</p>
${figure('float-lab.svg', 'Contoh pengamatan: kayu dan perahu berada di permukaan air, batu berada di dasar baskom.', 'Sebagian benda terapung boleh masuk ke air.')}
${section('1. Terapung 🪵', '<p>Benda <strong>terapung</strong> tetap berada di permukaan air. Sebagian benda dapat terendam. Contohnya potongan kayu pada percobaan Raka.</p>')}
${section('2. Tenggelam 🪨', '<p>Benda <strong>tenggelam</strong> turun ke bawah. Di baskom dangkal, batu Raka sampai ke dasar. Ukuran saja tidak menentukan hasil: batu kecil bisa tenggelam, sedangkan kayu lebih besar bisa terapung.</p>')}
${section('3. Bentuk dan Beban Perahu ⛵', '<p>Bahan, bentuk, dan beban ikut memengaruhi hasil. Perahu aluminium dibuat <strong>berongga</strong> dengan tepi terangkat. Bentuk ini membantunya terapung.</p><p>Perahu bisa tenggelam jika air masuk atau bebannya terlalu banyak. Letakkan beban <strong>merata</strong> agar tidak berat sebelah.</p>')}
${section('Ayo Mencoba 🔎', '<p>Bersama pendamping, gunakan baskom dangkal, sedikit air, kayu, dan batu yang cukup besar agar tidak tertelan. Pendamping menyiapkan perahu aluminium. Jauhkan percobaan dari listrik.</p><ol><li>Tulis <strong>dugaan</strong> sebelum mencoba.</li><li>Letakkan benda perlahan, tanpa menekan.</li><li>Catat <strong>hasil</strong> yang terlihat. Jika ragu, ulangi.</li></ol><p>Jika membandingkan bentuk perahu, gunakan jumlah aluminium yang <strong>sama</strong>. Bersihkan tumpahan setelah selesai.</p>')}
${section('Ingat dan Mainkan 🎮', '<p>Dugaan boleh keliru. Catatan harus sesuai hasil yang terlihat.</p><p>Lengkapi delapan kalimat pengamatan di game. Pilih kata yang sesuai; beberapa kata adalah pengecoh.</p>')}
${section('Video Pendukung 🎬', `<p>Amati perahu saat bebannya ditambah. Video berbahasa Inggris; tonton bersama pendamping.</p><iframe class="ql-video" src="https://www.youtube.com/embed/s7bopU_N_fQ" title="Science Buddies: How Much Weight Can Boats Float?" frameborder="0" allowfullscreen="true"></iframe><p>${source('https://www.youtube.com/watch?v=s7bopU_N_fQ', 'Buka video Science Buddies di YouTube')}.</p>`)}
<p>Bacaan pendamping: ${source('https://www.noaa.gov/office-education/outreach-communication/hands-on-science-activities/build-a-boat', 'NOAA: Build a Boat')} dan ${source('https://www.acs.org/education/resources/k-8/inquiryinaction/second-grade.html', 'ACS kelas 2')}. Ilustrasi asli Science Portal.</p>`,
    quiz_data: { questions: [
      q('Kayu tetap di permukaan, meski sebagian masuk ke air. Kayu itu ...', ['Tenggelam', 'Terapung', 'Menguap', 'Mencair'], 1, 'Terapung tidak berarti seluruh benda berada di atas air.'),
      q('Batu kecil tenggelam, kayu besar terapung. Apa yang kita pelajari?', ['Ukuran saja tidak cukup', 'Semua benda kecil terapung', 'Semua benda besar tenggelam', 'Batu berubah menjadi air'], 0, 'Bahan dan bentuk juga memengaruhi hasil.'),
      q('Kamu menduga batu terapung, tetapi batu tenggelam. Catat hasil ...', ['Terapung agar dugaan benar', 'Sesuai jawaban teman', 'Tanpa melihat percobaan', 'Tenggelam sesuai pengamatan'], 3, 'Catatan harus sesuai kejadian yang diamati.'),
      q('Perahu miring karena beban menumpuk di kiri. Coba ...', ['Tambah beban di kiri', 'Sebarkan beban merata', 'Lubangi perahu', 'Tekan perahu'], 1, 'Beban merata membantu perahu seimbang.'),
      q('Perahu terapung. Setelah terlalu banyak beban, perahu tenggelam. Apa yang berubah?', ['Warna air', 'Nama perahu', 'Jumlah beban', 'Bahan baskom'], 2, 'Beban yang ditambahkan dapat mengubah hasil.'),
      q('Bagaimana cara menguji benda di air?', ['Letakkan perlahan lalu amati', 'Lempar sekuatnya', 'Tekan terus ke dasar', 'Pegang di atas air'], 0, 'Lepaskan benda perlahan agar hasil tidak dipengaruhi tangan.'),
    ] },
    game_data: { fill_blanks: [
      { sentence: 'Kayu terapung di [BLANK] air.', answer: 'permukaan', options: ['langit'] },
      { sentence: 'Batu tenggelam sampai ke [BLANK] baskom.', answer: 'dasar', options: [] },
      { sentence: 'Sebelum mencoba, Raka menulis [BLANK].', answer: 'dugaan', options: [] },
      { sentence: 'Setelah mencoba, Raka mencatat [BLANK] yang terlihat.', answer: 'hasil', options: [] },
      { sentence: 'Perahu dibuat [BLANK], dengan tepi terangkat.', answer: 'berongga', options: ['berlubang'] },
      { sentence: 'Beban dibagi [BLANK] agar perahu tidak berat sebelah.', answer: 'merata', options: ['menumpuk'] },
      { sentence: 'Saat membandingkan bentuk perahu, jumlah aluminium dibuat [BLANK].', answer: 'sama', options: ['berbeda'] },
      { sentence: 'Jika hasil belum jelas, Raka [BLANK] percobaan.', answer: 'mengulangi', options: ['menghapus'] },
    ] },
  },
  {
    ...base,
    title: 'Bahan yang Menyerap Air',
    description: 'Pilih bahan untuk mengelap tumpahan atau melindungi buku. Gunakan hasil pengamatanmu!',
    game_slug: 'sd13-misi-tetes-air-daya-serap',
    game_type: 'dynamic_match',
    badge_name: 'Ahli Pemilih Bahan',
    theory_content: `<h1>Bahan yang Menyerap Air 🧽💧</h1>
${support}
<p>Nina ingin mengelap meja basah. Bimo ingin melindungi buku dari tetesan air. Apakah mereka memerlukan bahan yang sama?</p>
<p><strong>Tujuan:</strong> mengenali penyerapan air dan memilih bahan sesuai kegunaannya.</p>
${figure('water-materials.svg', 'Air masuk ke kain, tetesan tertahan di plastik utuh, dan bahan baru perlu diuji dahulu.', 'Perhatikan airnya, bukan hanya warna bahannya.')}
${section('1. Bahan Penyerap 🧽', '<p><strong>Menyerap</strong> berarti air masuk ke dalam bahan. Kain katun kering, tisu, dan spons dapat menyerap tumpahan. Kain menjadi basah karena air masuk, bukan karena air menghilang.</p>')}
${section('2. Bahan Penahan Air ☔', '<p>Plastik utuh, karet utuh, dan aluminium foil tidak menyerap seperti kain. Tetesan dapat tetap berada di atasnya. Plastik utuh dapat melindungi buku dari tetesan.</p><p>Jika plastik berlubang, air bisa lewat lubang. Itu berbeda dari menyerap.</p>')}
${section('3. Pilih Sesuai Kegunaan 🔎', '<ul><li><strong>Meja basah:</strong> pilih kain kering yang menyerap.</li><li><strong>Pelindung buku:</strong> pilih plastik utuh yang menahan air.</li><li><strong>Bahan baru:</strong> uji dahulu. Warna tidak menunjukkan daya serap.</li></ul><p>Kertas atau kain yang diberi lapisan bisa memiliki sifat berbeda. Jangan menebak dari namanya saja.</p>')}
${section('Ayo Mencoba 💧', '<p>Bersama pendamping, siapkan kain katun, tisu, dan plastik utuh berukuran sebanding di atas piring.</p><ol><li>Beri masing-masing tiga tetes air.</li><li>Tunggu selama waktu yang sama.</li><li>Amati: air masuk ke bahan atau tetap di atas?</li></ol><p>Gunakan sedikit air, jauh dari listrik. Lap meja setelah selesai.</p>')}
${section('Ingat dan Mainkan 🎮', '<p><strong>Tantangan:</strong> mengapa tisu cocok untuk tumpahan, tetapi kurang cocok melindungi buku?</p><p>Di game, pilih kelompok lalu kartu yang sesuai. Kelompoknya: <strong>Menyerap air</strong>, <strong>Menahan air</strong>, dan <strong>Perlu diuji</strong>. Ada kartu nama bahan dan kartu petunjuk pengamatan. Baca petunjuknya dahulu!</p>')}
<p>Bacaan pendamping: ${source('https://www.acs.org/education/resources/k-8/inquiryinaction/second-grade/chapter-1/designing-an-absorbency-test.html/1000', 'ACS: uji penyerapan air')} dan ${source('https://www.acs.org/content/dam/acsorg/education/k-8/inquiry-in-action/second-grade/g2-l1.3-bkgd.pdf', 'penjelasan untuk pendamping')}. Ilustrasi asli Science Portal.</p>`,
    quiz_data: { questions: [
      q('Air tumpah di meja. Pilih bahan untuk mengelapnya.', ['Plastik utuh', 'Kain katun kering', 'Aluminium foil', 'Piring'], 1, 'Kain katun kering menyerap air tumpahan.'),
      q('Mengapa plastik utuh cocok melindungi buku dari tetesan?', ['Membuat buku berat', 'Mengubah air menjadi es', 'Menahan air', 'Menyerap seperti tisu'], 2, 'Plastik menahan tetesan agar tidak langsung mengenai buku.'),
      q('Air lewat lubang plastik. Air itu ...', ['Lewat lubang, bukan diserap', 'Diserap semua plastik', 'Berubah menjadi plastik', 'Berhenti bergerak'], 0, 'Melewati lubang berbeda dari masuk ke bahan penyerap.'),
      q('Kertas berlapis baru belum diuji. Apa yang kamu lakukan?', ['Anggap sama dengan tisu', 'Tebak dari warna', 'Tebak dari harga', 'Uji dengan tetesan air'], 3, 'Pengujian menunjukkan pengaruh lapisan pada bahan.'),
      q('Saat membandingkan bahan, apa yang dibuat sama?', ['Warna bahan', 'Jumlah tetes dan waktu', 'Nama bahan', 'Harga bahan'], 1, 'Jumlah tetes dan waktu yang sama membuat perbandingan lebih adil.'),
      q('Kain menjadi basah saat mengelap. Ke mana sebagian air pergi?', ['Hilang begitu saja', 'Berubah menjadi kain', 'Masuk ke dalam kain', 'Menjadi batu'], 2, 'Air masuk ke kain melalui penyerapan.'),
    ] },
    game_data: { dynamic_match: { pairs: [
      { category: 'Menyerap air', items: ['Kain katun kering', 'Tisu kering', 'Spons kering', 'Bahan A: air masuk ke dalamnya'] },
      { category: 'Menahan air', items: ['Plastik utuh', 'Aluminium foil utuh', 'Karet utuh', 'Bahan B: air tertahan, belakang kering'] },
      { category: 'Perlu diuji', items: ['Kertas berlapis yang belum dicoba', 'Bahan C: hanya warnanya diketahui', 'Kain berlapis yang belum dicoba', 'Bahan D: belum ada hasil pengamatan'] },
    ] } },
  },
];
