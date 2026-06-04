// src/data/masterySets.ts

export interface MasteryQuestion {
  id: string;
  topicId: "fractions" | "percent" | "integer" | "algebra" | "plsv";
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export const masteryQuestions: MasteryQuestion[] = [
  {
    id: "mastery-frac-q1",
    topicId: "fractions",
    question: "Berapakah hasil dari $\\frac{1}{3} + \\frac{1}{2}$?",
    options: ["2/5", "5/6", "4/6", "1/5"],
    correctAnswer: "5/6",
    explanation: "KPK dari 3 dan 2 adalah 6. $\\frac{1}{3}$ diubah menjadi $\\frac{2}{6}$ dan $\\frac{1}{2}$ diubah menjadi $\\frac{3}{6}$. Hasil penjumlahannya adalah $\\frac{2}{6} + \\frac{3}{6} = \\frac{5}{6}$."
  },
  {
    id: "mastery-frac-q2",
    topicId: "fractions",
    question: "Pada pecahan $\\frac{3}{4}$, apakah arti dari angka 4 (penyebut)?",
    options: [
      "Jumlah bagian yang kita miliki atau ambil",
      "Ukuran atau jumlah total bagian sama besar yang membagi satu keutuhan",
      "Hasil penjumlahan pembilang dengan bilangan lain",
      "Nilai desimal dari pecahan tersebut"
    ],
    correctAnswer: "Ukuran atau jumlah total bagian sama besar yang membagi satu keutuhan",
    explanation: "Penyebut (angka di bawah) menunjukkan ukuran bagian, yaitu menyatakan satu keutuhan dibagi menjadi berapa banyak bagian yang sama besar."
  },
  {
    id: "mastery-frac-q3",
    topicId: "fractions",
    question: "Manakah di bawah ini pecahan yang senilai dengan $\\frac{2}{3}$?",
    options: ["4/9", "6/9", "3/2", "5/6"],
    correctAnswer: "6/9",
    explanation: "Pecahan senilai diperoleh dengan mengalikan pembilang dan penyebut dengan bilangan yang sama. $\\frac{2 \\times 3}{3 \\times 3} = \\frac{6}{9}$."
  },
  {
    id: "mastery-frac-q4",
    topicId: "fractions",
    question: "Budi memiliki kue berbentuk lingkaran. Ia memberikan $\\frac{1}{4}$ bagian kue kepada Ani dan $\\frac{1}{2}$ bagian kue kepada Didi. Berapa total bagian kue yang telah diberikan Budi?",
    options: ["2/6 bagian", "3/4 bagian", "2/4 bagian", "1/8 bagian"],
    correctAnswer: "3/4 bagian",
    explanation: "Total bagian kue yang diberikan adalah $\\frac{1}{4} + \\frac{1}{2}$. Samakan penyebut menjadi 4: $\\frac{1}{4} + \\frac{2}{4} = \\frac{3}{4}$ bagian kue."
  },
  {
    id: "mastery-frac-q5",
    topicId: "fractions",
    question: "Berapakah hasil dari $\\frac{3}{5} + \\frac{2}{10}$?",
    options: ["5/15", "8/10", "5/10", "6/10"],
    correctAnswer: "8/10",
    explanation: "KPK dari 5 dan 10 adalah 10. $\\frac{3}{5}$ senilai dengan $\\frac{6}{10}$. Hasil penjumlahannya adalah $\\frac{6}{10} + \\frac{2}{10} = \\frac{8}{10}$."
  },
  {
    id: "mastery-perc-q1",
    topicId: "percent",
    question: "Apakah arti dari simbol persen ($\\%$)?",
    options: ["Per sepuluh", "Per seratus", "Per seribu", "Per sejuta"],
    correctAnswer: "Per seratus",
    explanation: "Persen berasal dari kata Latin 'per centum' yang berarti per seratus."
  },
  {
    id: "mastery-perc-q2",
    topicId: "percent",
    question: "Ubah $40\\%$ menjadi pecahan paling sederhana.",
    options: ["4/10", "2/5", "4/5", "1/2"],
    correctAnswer: "2/5",
    explanation: "$40\\% = \\frac{40}{100}$. Bagi pembilang dan penyebut dengan FPB mereka yaitu 20, menghasilkan pecahan sederhana $\\frac{2}{5}$."
  },
  {
    id: "mastery-perc-q3",
    topicId: "percent",
    question: "Bentuk desimal yang setara dengan $12\\%$ adalah...",
    options: ["1.2", "0.12", "0.012", "12.0"],
    correctAnswer: "0.12",
    explanation: "$12\\%$ berarti $\\frac{12}{100}$, yang jika dikonversi ke desimal adalah $0,12$."
  },
  {
    id: "mastery-perc-q4",
    topicId: "percent",
    question: "Berapakah $15\\%$ dari $200$?",
    options: ["3000", "30", "15", "150"],
    correctAnswer: "30",
    explanation: "$15\\%$ dari $200 = \\frac{15}{100} \\times 200 = 15 \\times 2 = 30$."
  },
  {
    id: "mastery-perc-q5",
    topicId: "percent",
    question: "Sebuah toko memberikan diskon $25\\%$ untuk baju seharga Rp120.000. Berapakah jumlah potongan harga (diskon) baju tersebut?",
    options: ["Rp25.000", "Rp30.000", "Rp90.000", "Rp12.000"],
    correctAnswer: "Rp30.000",
    explanation: "Potongan harga yang didapat Budi adalah $25\\%$ dari Rp120.000: $\\frac{25}{100} \\times 120.000 = \\frac{1}{4} \\times 120.000 = Rp30.000$."
  },
  {
    id: "mastery-int-q1",
    topicId: "integer",
    question: "Berapakah hasil dari $-12 + 15$?",
    options: ["-3", "3", "-27", "27"],
    correctAnswer: "3",
    explanation: "Mulai dari -12 pada garis bilangan, melangkah ke kanan sebanyak 15 langkah. Karena 15 lebih besar dari 12, kita melewati nol dan berakhir di 3."
  },
  {
    id: "mastery-int-q2",
    topicId: "integer",
    question: "Suhu di sebuah kota pada malam hari adalah $-3^{\\circ}\\text{C}$. Pada siang hari, suhu tersebut naik sebesar $8^{\\circ}\\text{C}$. Berapakah suhu kota tersebut pada siang hari?",
    options: ["-11 derajat Celcius", "5 derajat Celcius", "-5 derajat Celcius", "11 derajat Celcius"],
    correctAnswer: "5 derajat Celcius",
    explanation: "Keadaan ini dapat ditulis sebagai $-3 + 8$. Mulai dari -3 pada garis bilangan, bergerak ke kanan sebanyak 8 langkah menghasilkan 5."
  },
  {
    id: "mastery-int-q3",
    topicId: "integer",
    question: "Budi memiliki saldo awal sebesar Rp50.000. Ia membeli buku seharga Rp70.000 (saldo menjadi negatif). Kemudian Budi mendapat uang saku sebesar Rp30.000 yang langsung dimasukkan ke saldonya. Berapakah saldo Budi sekarang?",
    options: ["-Rp20.000", "Rp10.000", "-Rp10.000", "Rp20.000"],
    correctAnswer: "Rp10.000",
    explanation: "Saldo awal: Rp50.000. Belanja Rp70.000: $50.000 - 70.000 = -20.000$. Tambahan uang saku Rp30.000: $-20.000 + 30.000 = 10.000$."
  },
  {
    id: "mastery-int-q4",
    topicId: "integer",
    question: "Jika sebuah kapal selam berada pada kedalaman $-15$ meter di bawah permukaan laut, lalu kapal tersebut turun lagi sedalam $10$ meter, di kedalaman berapakah kapal selam itu sekarang?",
    options: ["-5 meter", "-25 meter", "25 meter", "5 meter"],
    correctAnswer: "-25 meter",
    explanation: "Kedalaman awal adalah -15 meter. Turun lagi 10 meter artinya bergerak lebih dalam ke arah negatif: $-15 + (-10) = -25$ meter."
  },
  {
    id: "mastery-int-q5",
    topicId: "integer",
    question: "Hasil dari $(-10) + 10 + (-4)$ adalah...",
    options: ["-24", "16", "-4", "4"],
    correctAnswer: "-4",
    explanation: "Pertama, $(-10) + 10 = 0$ karena merupakan pasangan nol (zero pair). Kemudian, $0 + (-4) = -4$."
  },
  {
    id: "mastery-alg-q1",
    topicId: "algebra",
    question: "Sederhanakan bentuk aljabar berikut: $8x + 2y - 3x + y$.",
    options: ["5x + 3y", "8xy", "5x + 2y", "5x^2 + 3y"],
    correctAnswer: "5x + 3y",
    explanation: "Kelompokkan suku-suku yang sejenis: $(8x - 3x) + (2y + y)$. Suku $8x - 3x = 5x$ dan suku $2y + 1y = 3y$. Jadi, hasilnya adalah $5x + 3y$."
  },
  {
    id: "mastery-alg-q2",
    topicId: "algebra",
    question: "Budi memiliki 3 kotak kelereng merah ($x$) dan 2 kotak kelereng biru ($y$). Ani memberikan 2 kotak kelereng merah lagi kepada Budi. Berapa total kotak kelereng yang dimiliki Budi sekarang?",
    options: ["7xy kotak", "5x + 2y kotak", "3x + 4y kotak", "5x kotak"],
    correctAnswer: "5x + 2y kotak",
    explanation: "Keadaan awal: $3x + 2y$. Tambahan kelereng merah: $+ 2x$. Gabungkan suku sejenis: $(3x + 2x) + 2y = 5x + 2y$ kotak."
  },
  {
    id: "mastery-alg-q3",
    topicId: "algebra",
    question: "Bentuk sederhana dari ekspresi aljabar $y + y + y + x$ adalah...",
    options: ["3y + x", "y^3 + x", "4xy", "3x + y"],
    correctAnswer: "3y + x",
    explanation: "Penjumlahan berulang variabel yang sama dapat disederhanakan: $y + y + y = 3y$. Digabungkan dengan suku $x$ menghasilkan $3y + x$."
  },
  {
    id: "mastery-alg-q4",
    topicId: "algebra",
    question: "Manakah bentuk aljabar berikut yang TIDAK dapat disederhanakan lagi?",
    options: ["2a + 3b", "5x - x", "3p + 2p", "a + 4a"],
    correctAnswer: "2a + 3b",
    explanation: "Bentuk aljabar $2a + 3b$ terdiri atas dua suku tidak sejenis (variabel $a$ dan $b$), sehingga tidak dapat disederhanakan lebih lanjut."
  },
  {
    id: "mastery-alg-q5",
    topicId: "algebra",
    question: "Di koperasi, harga sebuah buku tulis diwakili $p$ dan harga pensil diwakili $q$. Ani membeli 5 buku tulis dan 3 pensil. Dedi membeli 2 buku tulis dan 1 pensil. Berapakah total buku tulis dan pensil yang mereka beli jika digabungkan?",
    options: ["7p + 4q", "11pq", "7p + 3q", "7p^2 + 4q"],
    correctAnswer: "7p + 4q",
    explanation: "Barang Ani: $5p + 3q$. Barang Dedi: $2p + 1q$. Gabungan total: $(5p + 2p) + (3q + 1q) = 7p + 4q$."
  },
  {
    id: "mastery-plsv-q1",
    topicId: "plsv",
    question: "Tentukan nilai $x$ dari persamaan $x + 6 = -2$!",
    options: ["x = 4", "x = -8", "x = -4", "x = 8"],
    correctAnswer: "x = -8",
    explanation: "Kurangi kedua ruas dengan 6: $x + 6 - 6 = -2 - 6$, diperoleh $x = -8$."
  },
  {
    id: "mastery-plsv-q2",
    topicId: "plsv",
    question: "Tentukan nilai $x$ dari persamaan $\\frac{x}{5} = 7$!",
    options: ["x = 35", "x = 7/5", "x = 12", "x = 2"],
    correctAnswer: "x = 35",
    explanation: "Kalikan kedua ruas dengan 5: $\\frac{x}{5} \\times 5 = 7 \\times 5$, diperoleh $x = 35$."
  },
  {
    id: "mastery-plsv-q3",
    topicId: "plsv",
    question: "Selesaikan persamaan dua langkah berikut: $2x + 7 = 19$.",
    options: ["x = 13", "x = 6", "x = 12", "x = 3"],
    correctAnswer: "x = 6",
    explanation: "Pertama, kurangi kedua ruas dengan 7 menjadi $2x = 12$. Kedua, bagi kedua ruas dengan 2 diperoleh $x = 6$."
  },
  {
    id: "mastery-plsv-q4",
    topicId: "plsv",
    question: "Tentukan nilai $x$ dari persamaan $5x = 4 + 3x$ dengan menyetarakan kedua ruas!",
    options: ["x = 2", "x = 1/2", "x = -2", "x = 8"],
    correctAnswer: "x = 2",
    explanation: "Kurangi kedua ruas dengan $3x$ agar semua variabel berkumpul di ruas kiri: $5x - 3x = 4 + 3x - 3x$, didapatkan $2x = 4$. Kemudian bagi kedua ruas dengan 2 menghasilkan $x = 2$."
  },
  {
    id: "mastery-plsv-q5",
    topicId: "plsv",
    question: "Budi memiliki 3 kantong permen yang isinya sama ($x$) ditambah 4 permen di luar kantong. Total permen Budi adalah 16 permen. Persamaan yang sesuai adalah $3x + 4 = 16$. Berapa isi permen dalam setiap kantong?",
    options: ["4 permen", "6 permen", "12 permen", "3 permen"],
    correctAnswer: "4 permen",
    explanation: "Dari persamaan $3x + 4 = 16$, kurangkan kedua ruas dengan 4 menjadi $3x = 12$. Kemudian bagi kedua ruas dengan 3, didapatkan $x = 4$."
  }
];
