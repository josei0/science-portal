import { readFileSync } from 'node:fs';

const image = readFileSync(new URL('../illustrations/living-things.svg', import.meta.url)).toString('base64');
const q = (question, options, correctAnswerIndex, explanation) => ({ question, options, correctAnswerIndex, explanation, timeLimit: 75 });

export const livingThingsModule = {
  title: 'Makhluk Hidup dan Benda Tak Hidup',
  description: 'Kucing tidur dan robot bergerak: mana yang hidup? Amati cirinya, lalu pecahkan catatan detektif kecil!',
  category: 'sd_1_3',
  game_slug: 'sd13-makhluk-hidup-dan-benda-tak-hidup',
  game_type: 'fill_blanks',
  kkm_score: 70,
  xp_theory: 15,
  xp_pass: 35,
  xp_perfect: 60,
  badge_name: 'Detektif Makhluk Hidup',
  is_published: true,
  theory_content: `<h1>Makhluk Hidup dan Benda Tak Hidup 🐱🤖</h1>
<p>Kucing sedang tidur, sedangkan robot mainan berjalan. Apakah yang bergerak pasti hidup? Yuk, perhatikan beberapa cirinya!</p>
<p><strong>Tujuan:</strong> membedakan makhluk hidup dan benda tak hidup berdasarkan ciri yang diamati.</p>
<p><img src="data:image/svg+xml;base64,${image}" alt="Kucing dan tanaman adalah makhluk hidup; robot mainan dan batu adalah benda tak hidup. Bergerak saja belum berarti hidup." width="720" style="max-width:100%;height:auto"/></p>
<h3>1. Makhluk Hidup 🐱</h3>
<p>Manusia, hewan, dan tumbuhan termasuk <strong>makhluk hidup</strong>. Makhluk hidup bernapas, membutuhkan air, memperoleh makanan, dan dapat tumbuh. Kucing yang tidur tetap hidup: ia masih bernapas walaupun sedang diam.</p>
<h3>2. Tumbuhan Juga Hidup 🌱</h3>
<p>Tanaman tidak berjalan seperti kucing, tetapi tetap hidup. Tanaman dapat <strong>tumbuh</strong> dan menghasilkan daun baru. Tanaman hijau memerlukan air, udara, dan cahaya untuk membuat makanannya.</p>
<h3>3. Benda Tak Hidup 🤖</h3>
<p>Batu, bola, dan robot mainan termasuk <strong>benda tak hidup</strong>. Benda-benda ini tidak bernapas atau tumbuh seperti makhluk hidup. Robot dapat bergerak karena tenaga baterai. Bola dapat bergulir karena didorong atau tertiup angin.</p>
<h3>4. Jangan Menilai dari Gerak Saja 🔎</h3>
<p>Tanaman asli dan tanaman plastik bisa sama-sama berwarna hijau. Namun, tanaman plastik tidak tumbuh atau memerlukan air untuk hidup. <strong>Warna, ukuran, dan gerak saja belum cukup</strong> untuk menentukan apakah sesuatu hidup.</p>
<p>Coba amati tanaman asli dan tanaman plastik bersama pendamping selama beberapa hari. Mana yang menghasilkan daun baru? Gunakan beberapa <strong>ciri</strong>, bukan hanya satu tebakan.</p>
<p><a href="https://www.youtube.com/embed/zrcPraGdnpY">Video: Benda Hidup dan Benda Tak Hidup</a></p>`,
  quiz_data: { questions: [
    q('Kucing tidur dan tampak diam. Kucing itu ...', ['Tak hidup karena diam', 'Tetap hidup dan bernapas', 'Berubah menjadi mainan', 'Tidak membutuhkan air'], 1, 'Kucing tetap bernapas saat tidur. Diam saja tidak berarti tak hidup.'),
    q('Robot berjalan dengan baterai. Mengapa robot bukan makhluk hidup?', ['Warnanya berbeda', 'Ukurannya kecil', 'Tidak bernapas dan tidak tumbuh', 'Memiliki kaki'], 2, 'Gerak robot berasal dari tenaga baterai, bukan proses kehidupan.'),
    q('Tanaman asli menghasilkan daun baru. Ini menunjukkan tanaman ...', ['Tumbuh', 'Menjadi plastik', 'Berjalan', 'Berubah menjadi batu'], 0, 'Pertumbuhan daun baru adalah salah satu ciri makhluk hidup.'),
    q('Tanaman asli dan tanaman plastik sama-sama hijau. Apa yang perlu diamati?', ['Harga potnya', 'Nama pemiliknya', 'Warna mejanya', 'Pertumbuhan dan kebutuhan airnya'], 3, 'Warna saja tidak cukup; periksa beberapa ciri kehidupan.'),
    q('Bola bergulir setelah tertiup angin. Kesimpulan yang tepat?', ['Bola hidup karena bergerak', 'Bola tak hidup meskipun bergerak', 'Bola sedang bernapas', 'Bola membutuhkan makanan'], 1, 'Benda tak hidup dapat bergerak karena dorongan atau angin.'),
    q('Manakah kelompok yang semuanya makhluk hidup?', ['Robot, kucing, batu', 'Bola, batu, robot', 'Anak, kucing, tanaman', 'Tanaman plastik, bola, kucing'], 2, 'Manusia, hewan, dan tumbuhan termasuk makhluk hidup.'),
  ] },
  game_data: { fill_blanks: [
    { sentence: 'Kucing yang tidur tetap [BLANK] karena masih bernapas.', answer: 'hidup', options: [] },
    { sentence: 'Robot tidak tumbuh atau bernapas, jadi termasuk benda [BLANK].', answer: 'tak hidup', options: [] },
    { sentence: 'Daun baru menunjukkan bahwa tanaman asli dapat [BLANK].', answer: 'tumbuh', options: ['mengecil'] },
    { sentence: 'Robot mainan berjalan memakai tenaga [BLANK], bukan makanan.', answer: 'baterai', options: [] },
    { sentence: 'Bola bergulir karena tertiup [BLANK], bukan karena hidup.', answer: 'angin', options: [] },
    { sentence: 'Tanaman asli disiram karena membutuhkan [BLANK].', answer: 'air', options: ['cat'] },
    { sentence: 'Tanaman hijau memerlukan [BLANK] untuk membuat makanan.', answer: 'cahaya', options: ['suara'] },
    { sentence: 'Detektif memeriksa beberapa [BLANK] kehidupan, bukan hanya warna.', answer: 'ciri', options: ['harga'] },
  ] },
};
