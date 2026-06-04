export interface DrillQuestion {
  id: string;
  topicId: "fractions" | "percent" | "integer" | "algebra" | "plsv";
  misconceptionCode: string;
  phase: 1 | 2 | 3;
  question: string;
  options?: string[];
  correctAnswer: string;
  workedExampleSteps?: string[];
  hints?: string[];
  guidedSolutionSteps?: string[];
  explanation: string;
}

export const drillQuestions: DrillQuestion[] = [
  // --- FASE 1: Worked Examples (Contoh Detail) ---
  {
    id: "drill-frac-p1-q1",
    topicId: "fractions",
    misconceptionCode: "MC-FRAC-ADD-NUM-DENOM",
    phase: 1,
    question: "Berapakah hasil dari $\\frac{1}{2} + \\frac{1}{3}$?",
    correctAnswer: "5/6",
    workedExampleSteps: [
      "Identifikasi penyebut dari kedua pecahan, yaitu $2$ dan $3$. Penyebut ini menunjukkan ukuran bagian pecahan.",
      "Karena ukuran bagiannya berbeda (per dua dan per tiga), kita tidak bisa langsung menjumlahkannya. Kita harus menyamakan penyebutnya menggunakan KPK dari 2 dan 3, yaitu $6$.",
      "Ubah $\\frac{1}{2}$ menjadi pecahan senilai berpenyebut $6$: $\\frac{1 \\times 3}{2 \\times 3} = \\frac{3}{6}$.",
      "Ubah $\\frac{1}{3}$ menjadi pecahan senilai berpenyebut $6$: $\\frac{1 \\times 2}{3 \\times 2} = \\frac{2}{6}$.",
      "Sekarang penyebutnya sudah sama (ukurannya sudah setara). Jumlahkan pembilangnya: $\\frac{3}{6} + \\frac{2}{6} = \\frac{3 + 2}{6} = \\frac{5}{6}$."
    ],
    explanation: "KPK dari 2 dan 3 adalah 6. Kedua pecahan diubah menjadi per enam, sehingga $\\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}$."
  },
  {
    id: "drill-frac-p1-q2",
    topicId: "fractions",
    misconceptionCode: "MC-FRAC-ADD-NUM-DENOM",
    phase: 1,
    question: "Berapakah hasil dari $\\frac{1}{4} + \\frac{3}{8}$?",
    correctAnswer: "5/8",
    workedExampleSteps: [
      "Identifikasi penyebut dari kedua pecahan, yaitu $4$ dan $8$.",
      "Samakan penyebutnya menggunakan KPK dari 4 dan 8, yaitu $8$.",
      "Ubah $\\frac{1}{4}$ menjadi pecahan senilai berpenyebut $8$: $\\frac{1 \\times 2}{4 \\times 2} = \\frac{2}{8}$.",
      "Pecahan kedua $\\frac{3}{8}$ sudah memiliki penyebut $8$, jadi tidak perlu diubah.",
      "Jumlahkan pembilangnya: $\\frac{2}{8} + \\frac{3}{8} = \\frac{2 + 3}{8} = \\frac{5}{8}$."
    ],
    explanation: "KPK dari 4 dan 8 adalah 8. $\\frac{1}{4}$ diubah menjadi $\\frac{2}{8}$, kemudian dijumlahkan dengan $\\frac{3}{8}$ menghasilkan $\\frac{5}{8}$."
  },

  // --- FASE 2: Guided Practice (Contoh Terbimbing) ---
  {
    id: "drill-frac-p2-q1",
    topicId: "fractions",
    misconceptionCode: "MC-FRAC-ADD-NUM-DENOM",
    phase: 2,
    question: "Berapakah hasil dari $\\frac{1}{3} + \\frac{1}{4}$?",
    options: ["2/7", "7/12", "5/12", "1/7"],
    correctAnswer: "7/12",
    hints: [
      "Ingat, jangan menjumlahkan pembilang dengan pembilang dan penyebut dengan penyebut secara langsung! $\\frac{1}{3} + \\frac{1}{4}$ bukan $\\frac{2}{7}$.",
      "Cari KPK dari penyebut $3$ dan $4$. KPK-nya adalah $12$.",
      "Ubah masing-masing pecahan menjadi pecahan senilai berpenyebut $12$, lalu jumlahkan pembilangnya."
    ],
    guidedSolutionSteps: [
      "KPK dari penyebut $3$ dan $4$ adalah $12$.",
      "Ubah $\\frac{1}{3}$ menjadi pecahan senilai: $\\frac{1 \\times 4}{3 \\times 4} = \\frac{4}{12}$.",
      "Ubah $\\frac{1}{4}$ menjadi pecahan senilai: $\\frac{1 \\times 3}{4 \\times 3} = \\frac{3}{12}$.",
      "Jumlahkan kedua pecahan senilai: $\\frac{4}{12} + \\frac{3}{12} = \\frac{7}{12}$."
    ],
    explanation: "KPK dari 3 dan 4 adalah 12. $\\frac{1}{3} = \\frac{4}{12}$ dan $\\frac{1}{4} = \\frac{3}{12}$. Hasilnya $\\frac{4}{12} + \\frac{3}{12} = \\frac{7}{12}$."
  },
  {
    id: "drill-frac-p2-q2",
    topicId: "fractions",
    misconceptionCode: "MC-FRAC-ADD-NUM-DENOM",
    phase: 2,
    question: "Berapakah hasil dari $\\frac{1}{2} + \\frac{1}{6}$?",
    options: ["2/8", "4/6", "3/6", "2/6"],
    correctAnswer: "4/6",
    hints: [
      "Kedua penyebutnya adalah $2$ dan $6$. KPK dari 2 dan 6 adalah $6$.",
      "Ubah pecahan $\\frac{1}{2}$ menjadi pecahan senilai berpenyebut $6$, yaitu $\\frac{3}{6}$. Pecahan $\\frac{1}{6}$ tidak perlu diubah.",
      "Sekarang jumlahkan $\\frac{3}{6}$ dengan $\\frac{1}{6}$."
    ],
    guidedSolutionSteps: [
      "KPK dari penyebut $2$ dan $6$ adalah $6$.",
      "Ubah $\\frac{1}{2}$ menjadi pecahan senilai berpenyebut $6$: $\\frac{1 \\times 3}{2 \\times 3} = \\frac{3}{6}$.",
      "Pecahan $\\frac{1}{6}$ sudah memiliki penyebut $6$, jadi tetap.",
      "Jumlahkan pembilangnya: $\\frac{3}{6} + \\frac{1}{6} = \\frac{4}{6}$."
    ],
    explanation: "$\\frac{1}{2}$ disamakan penyebutnya menjadi $\\frac{3}{6}$. Hasil penjumlahan dengan $\\frac{1}{6}$ adalah $\\frac{4}{6}$."
  },
  {
    id: "drill-frac-p2-q3",
    topicId: "fractions",
    misconceptionCode: "MC-FRAC-ADD-NUM-DENOM",
    phase: 2,
    question: "Berapakah hasil dari $\\frac{2}{5} + \\frac{1}{10}$?",
    options: ["3/15", "5/10", "3/10", "1/2"],
    correctAnswer: "5/10",
    hints: [
      "Samakan penyebut 5 dan 10 menggunakan KPK-nya, yaitu $10$.",
      "Ubah $\\frac{2}{5}$ menjadi pecahan senilai dengan penyebut $10$: kalikan pembilang dan penyebut dengan $2$ sehingga diperoleh $\\frac{4}{10}$.",
      "Jumlahkan pecahan yang baru: $\\frac{4}{10} + \\frac{1}{10}$."
    ],
    guidedSolutionSteps: [
      "KPK dari penyebut $5$ dan $10$ adalah $10$.",
      "Ubah $\\frac{2}{5}$ menjadi pecahan senilai berpenyebut $10$: $\\frac{2 \\times 2}{5 \\times 2} = \\frac{4}{10}$.",
      "Pecahan $\\frac{1}{10}$ sudah memiliki penyebut $10$, jadi tetap.",
      "Jumlahkan pembilangnya: $\\frac{4}{10} + \\frac{1}{10} = \\frac{5}{10}$."
    ],
    explanation: "$\\frac{2}{5}$ senilai dengan $\\frac{4}{10}$. Menjumlahkannya dengan $\\frac{1}{10}$ memberikan hasil $\\frac{5}{10}$."
  },

  // --- FASE 3: Independent Practice (Latihan Mandiri) ---
  {
    id: "drill-frac-p3-q1",
    topicId: "fractions",
    misconceptionCode: "MC-FRAC-ADD-NUM-DENOM",
    phase: 3,
    question: "Berapakah hasil dari $\\frac{1}{5} + \\frac{1}{2}$?",
    options: ["2/7", "7/10", "3/10", "2/10"],
    correctAnswer: "7/10",
    explanation: "KPK dari 5 dan 2 adalah 10. $\\frac{1}{5} = \\frac{2}{10}$ dan $\\frac{1}{2} = \\frac{5}{10}$. Hasilnya $\\frac{2}{10} + \\frac{5}{10} = \\frac{7}{10}$."
  },
  {
    id: "drill-frac-p3-q2",
    topicId: "fractions",
    misconceptionCode: "MC-FRAC-ADD-NUM-DENOM",
    phase: 3,
    question: "Berapakah hasil dari $\\frac{2}{3} + \\frac{1}{6}$?",
    options: ["3/9", "5/6", "3/6", "4/6"],
    correctAnswer: "5/6",
    explanation: "KPK dari 3 dan 6 adalah 6. $\\frac{2}{3} = \\frac{4}{6}$. Hasilnya $\\frac{4}{6} + \\frac{1}{6} = \\frac{5}{6}$."
  },
  {
    id: "drill-frac-p3-q3",
    topicId: "fractions",
    misconceptionCode: "MC-FRAC-ADD-NUM-DENOM",
    phase: 3,
    question: "Berapakah hasil dari $\\frac{3}{4} + \\frac{1}{12}$?",
    options: ["4/16", "10/12", "4/12", "8/12"],
    correctAnswer: "10/12",
    explanation: "KPK dari 4 dan 12 adalah 12. $\\frac{3}{4}$ diubah menjadi $\\frac{9}{12}$. Hasil penjumlahan dengan $\\frac{1}{12}$ adalah $\\frac{10}{12}$."
  },
  {
    id: "drill-frac-p3-q4",
    topicId: "fractions",
    misconceptionCode: "MC-FRAC-ADD-NUM-DENOM",
    phase: 3,
    question: "Berapakah hasil dari $\\frac{1}{3} + \\frac{2}{9}$?",
    options: ["3/12", "5/9", "3/9", "4/9"],
    correctAnswer: "5/9",
    explanation: "KPK dari 3 dan 9 adalah 9. $\\frac{1}{3} = \\frac{3}{9}$. Hasil penjumlahan dengan $\\frac{2}{9}$ adalah $\\frac{5}{9}$."
  },
  {
    id: "drill-frac-p3-q5",
    topicId: "fractions",
    misconceptionCode: "MC-FRAC-ADD-NUM-DENOM",
    phase: 3,
    question: "Berapakah hasil dari $\\frac{2}{5} + \\frac{1}{3}$?",
    options: ["3/8", "11/15", "7/15", "3/15"],
    correctAnswer: "11/15",
    explanation: "KPK dari 5 dan 3 adalah 15. $\\frac{2}{5}$ diubah menjadi $\\frac{6}{15}$ dan $\\frac{1}{3}$ diubah menjadi $\\frac{5}{15}$. Hasilnya $\\frac{11}{15}$."
  },

  // --- TOPIK PERCENT (MC-PERC-NO-100) ---
  // --- FASE 1: Worked Examples (Contoh Detail) ---
  {
    id: "drill-perc-p1-q1",
    topicId: "percent",
    misconceptionCode: "MC-PERC-NO-100",
    phase: 1,
    question: "Berapakah nilai desimal dan pecahan sederhana dari $25\\%$?",
    correctAnswer: "1/4 dan 0.25",
    workedExampleSteps: [
      "Ingat bahwa persen ($%$) berarti 'per seratus'. Jadi, $25\\%$ berarti $25$ bagian dari $100$, yaitu $\\frac{25}{100}$.",
      "Ubah $\\frac{25}{100}$ menjadi pecahan paling sederhana dengan membagi pembilang dan penyebut dengan FPB mereka, yaitu $25$: $\\frac{25 \\div 25}{100 \\div 25} = \\frac{1}{4}$.",
      "Ubah $\\frac{25}{100}$ menjadi desimal dengan menggeser tanda koma dua posisi ke kiri (karena dibagi 100): $\\frac{25}{100} = 0,25$.",
      "Jadi, $25\\%$ sama dengan $\\frac{1}{4}$ atau $0,25$. Ingat, $25\\%$ BUKAN sama dengan $25$ biasa!"
    ],
    explanation: "Persen berarti per seratus. $25\\% = \\frac{25}{100}$, yang disederhanakan menjadi $\\frac{1}{4}$ atau bentuk desimal $0,25$."
  },
  {
    id: "drill-perc-p1-q2",
    topicId: "percent",
    misconceptionCode: "MC-PERC-NO-100",
    phase: 1,
    question: "Berapakah nilai dari $50\\%$ dari $80$?",
    correctAnswer: "40",
    workedExampleSteps: [
      "Ingat bahwa $50\\%$ berarti $\\frac{50}{100}$ dari seluruh jumlah.",
      "Sederhanakan pecahan $\\frac{50}{100}$ menjadi $\\frac{1}{2}$.",
      "Untuk mencari '$50\\%$ dari $80$', kalikan pecahan tersebut dengan jumlah totalnya: $\\frac{1}{2} \\times 80$.",
      "Hitung hasil perkaliannya: $\\frac{1 \\times 80}{2} = 40$.",
      "Jadi, $50\\%$ dari $80$ adalah $40$. Ingat, $50\\%$ dari $80$ BUKAN $50 \\times 80 = 4000$!"
    ],
    explanation: "$50\\% = \\frac{1}{2}$. Setengah dari 80 adalah 40."
  },

  // --- FASE 2: Guided Practice (Contoh Terbimbing) ---
  {
    id: "drill-perc-p2-q1",
    topicId: "percent",
    misconceptionCode: "MC-PERC-NO-100",
    phase: 2,
    question: "Nyatakan $50\\%$ sebagai desimal dan pecahan sederhana.",
    options: ["50 dan 50/1", "0.5 dan 1/2", "0.05 dan 1/20", "5.0 dan 5/1"],
    correctAnswer: "0.5 dan 1/2",
    hints: [
      "Persen berarti 'per seratus'. Maka $50\\% = \\frac{50}{100}$.",
      "Sederhanakan $\\frac{50}{100}$ dengan membagi pembilang dan penyebut dengan 50.",
      "Untuk bentuk desimal, pecahan $\\frac{50}{100}$ dapat ditulis dengan meletakkan koma dua posisi dari kanan, yaitu $0,50$ atau $0,5$."
    ],
    guidedSolutionSteps: [
      "Tulis $50\\%$ sebagai pecahan per seratus: $\\frac{50}{100}$.",
      "Bagi pembilang dan penyebut dengan $50$ untuk menyederhanakan: $\\frac{50 \\div 50}{100 \\div 50} = \\frac{1}{2}$.",
      "Tulis pecahan $\\frac{50}{100}$ sebagai bentuk desimal: $0,50$ atau $0,5$.",
      "Jadi, jawaban yang tepat adalah $0,5$ dan $\\frac{1}{2}$."
    ],
    explanation: "$50\\% = \\frac{50}{100} = \\frac{1}{2}$ atau bentuk desimalnya adalah $0,5$."
  },
  {
    id: "drill-perc-p2-q2",
    topicId: "percent",
    misconceptionCode: "MC-PERC-NO-100",
    phase: 2,
    question: "Berapakah $10\\%$ dari $200$?",
    options: ["2000", "20", "2", "0.2"],
    correctAnswer: "20",
    hints: [
      "Ingat, $10\\% = \\frac{10}{100}$.",
      "Kalikan pecahan $\\frac{10}{100}$ dengan $200$.",
      "Sederhanakan perkalian: $\\frac{10}{100} \\times 200 = 10 \\times 2$."
    ],
    guidedSolutionSteps: [
      "Ubah $10\\%$ menjadi pecahan: $\\frac{10}{100}$.",
      "Kalikan dengan $200$: $\\frac{10}{100} \\times 200$.",
      "Coret nol pada penyebut dan bilangan pengali: $10 \\times 2 = 20$.",
      "Jadi, $10\\%$ dari $200$ adalah $20$."
    ],
    explanation: "$10\\%$ dari $200$ adalah $\\frac{10}{100} \\times 200 = 20$."
  },
  {
    id: "drill-perc-p2-q3",
    topicId: "percent",
    misconceptionCode: "MC-PERC-NO-100",
    phase: 2,
    question: "Berapakah $25\\%$ dari $80$?",
    options: ["2000", "20", "25", "8"],
    correctAnswer: "20",
    hints: [
      "Ingat, $25\\% = \\frac{25}{100}$ yang disederhanakan menjadi $\\frac{1}{4}$.",
      "Mencari $25\\%$ dari $80$ sama dengan membagi $80$ menjadi $4$ bagian sama besar.",
      "Hitung $\\frac{1}{4} \\times 80$."
    ],
    guidedSolutionSteps: [
      "Ubah $25\\%$ menjadi pecahan sederhana: $\\frac{25}{100} = \\frac{1}{4}$.",
      "Kalikan pecahan sederhana tersebut dengan $80$: $\\frac{1}{4} \\times 80$.",
      "Bagi $80$ dengan $4$: $80 \\div 4 = 20$.",
      "Jadi, $25\\%$ dari $80$ adalah $20$."
    ],
    explanation: "$25\\%$ dari $80$ sama dengan $\\frac{1}{4} \\times 80 = 20$."
  },

  // --- FASE 3: Independent Practice (Latihan Mandiri) ---
  {
    id: "drill-perc-p3-q1",
    topicId: "percent",
    misconceptionCode: "MC-PERC-NO-100",
    phase: 3,
    question: "Ubah $75\\%$ menjadi pecahan sederhana.",
    options: ["75/1", "3/4", "7/5", "1/4"],
    correctAnswer: "3/4",
    explanation: "$75\\% = \\frac{75}{100}$. Bagi pembilang dan penyebut dengan FPB-nya yaitu 25, menghasilkan $\\frac{3}{4}$."
  },
  {
    id: "drill-perc-p3-q2",
    topicId: "percent",
    misconceptionCode: "MC-PERC-NO-100",
    phase: 3,
    question: "Manakah nilai desimal yang setara dengan $5\\%$?",
    options: ["5", "0.5", "0.05", "0.005"],
    correctAnswer: "0.05",
    explanation: "$5\\% = \\frac{5}{100}$. Geser koma dua angka ke kiri, menghasilkan $0,05$."
  },
  {
    id: "drill-perc-p3-q3",
    topicId: "percent",
    misconceptionCode: "MC-PERC-NO-100",
    phase: 3,
    question: "Berapakah $20\\%$ dari $150$?",
    options: ["3000", "30", "15", "20"],
    correctAnswer: "30",
    explanation: "$20\\% = \\frac{20}{100} = \\frac{1}{5}$. Maka $\\frac{1}{5} \\times 150 = 30$."
  },
  {
    id: "drill-perc-p3-q4",
    topicId: "percent",
    misconceptionCode: "MC-PERC-NO-100",
    phase: 3,
    question: "Budi membeli barang seharga Rp100.000 dan mendapat diskon $10\\%$. Berapa potongan harga yang didapat Budi?",
    options: ["Rp10.000", "Rp1.000", "Rp100", "Rp90.000"],
    correctAnswer: "Rp10.000",
    explanation: "Diskon yang diperoleh adalah $10\\%$ dari Rp100.000: $\\frac{10}{100} \\times 100.000 = Rp10.000$."
  },
  {
    id: "drill-perc-p3-q5",
    topicId: "percent",
    misconceptionCode: "MC-PERC-NO-100",
    phase: 3,
    question: "Manakah pernyataan yang benar mengenai perbedaan antara angka $5$ dan $5\\%$?",
    options: [
      "Angka 5 dan 5% memiliki nilai yang sama besar",
      "5% bernilai 100 kali lebih kecil dari 5, yaitu 0.05",
      "5% bernilai 100 kali lebih besar dari 5, yaitu 500",
      "5% adalah bilangan bulat sedangkan 5 adalah pecahan"
    ],
    correctAnswer: "5% bernilai 100 kali lebih kecil dari 5, yaitu 0.05",
    explanation: "Angka $5$ bernilai 5 keutuhan, sedangkan $5\\% = \\frac{5}{100} = 0,05$ (100 kali lebih kecil dari 5)."
  },

  // --- TOPIK INTEGER (MC-ADD-SIGN-CONF) ---
  // --- FASE 1: Worked Examples (Contoh Detail) ---
  {
    id: "drill-int-p1-q1",
    topicId: "integer",
    misconceptionCode: "MC-ADD-SIGN-CONF",
    phase: 1,
    question: "Berapakah hasil dari $3 + (-5)$?",
    correctAnswer: "-2",
    workedExampleSteps: [
      "Bayangkan kamu berdiri di angka $3$ pada garis bilangan (wilayah positif).",
      "Operasi $+ (-5)$ artinya kita menambahkan bilangan negatif $5$. Menambahkan bilangan negatif sama dengan bergerak ke arah kiri (nilai berkurang) sebanyak $5$ langkah.",
      "Dari posisi $3$, melangkahlah ke kiri sebanyak $5$ kali: $2 \\rightarrow 1 \\rightarrow 0 \\rightarrow -1 \\rightarrow -2$.",
      "Posisi akhir kamu berada di $-2$. Jadi, $3 + (-5) = -2$. Ingat, tanda negatif menunjukkan arah ke kiri, dan tanda positif menunjukkan arah ke kanan!"
    ],
    explanation: "Mulai dari posisi 3 pada garis bilangan, lalu melangkah ke kiri sebanyak 5 langkah karena menjumlahkan bilangan negatif, menghasilkan posisi -2."
  },
  {
    id: "drill-int-p1-q2",
    topicId: "integer",
    misconceptionCode: "MC-ADD-SIGN-CONF",
    phase: 1,
    question: "Berapakah hasil dari $-2 + (-4)$?",
    correctAnswer: "-6",
    workedExampleSteps: [
      "Bayangkan kamu memiliki utang sebesar $2$ koin (posisi awal $-2$ di sebelah kiri nol).",
      "Operasi $+ (-4)$ artinya kamu berutang lagi sebesar $4$ koin.",
      "Karena utang kamu bertambah banyak, posisi kamu bergerak lebih jauh ke arah kiri pada garis bilangan.",
      "Dari posisi $-2$, melangkahlah ke kiri sebanyak $4$ kali: $-3 \\rightarrow -4 \\rightarrow -5 \\rightarrow -6$.",
      "Total utang kamu sekarang adalah $6$ koin, sehingga hasilnya adalah $-6$."
    ],
    explanation: "Memulai dari posisi -2 pada garis bilangan, lalu bergerak ke kiri sebanyak 4 langkah karena menjumlahkan bilangan negatif -4, sehingga berakhir di posisi -6."
  },

  // --- FASE 2: Guided Practice (Contoh Terbimbing) ---
  {
    id: "drill-int-p2-q1",
    topicId: "integer",
    misconceptionCode: "MC-ADD-SIGN-CONF",
    phase: 2,
    question: "Berapakah hasil dari $-7 + 3$?",
    options: ["-10", "-4", "4", "10"],
    correctAnswer: "-4",
    hints: [
      "Kamu memulai dari posisi negatif $-7$ (arah kiri dari nol).",
      "Menambahkan bilangan positif ($+3$) berarti bergerak ke arah kanan (nilai bertambah) sebanyak $3$ langkah.",
      "Karena langkah ke kanan ($3$) lebih sedikit daripada jarak dari $-7$ ke nol ($7$), kamu akan tetap berada di area negatif."
    ],
    guidedSolutionSteps: [
      "Tentukan posisi awal kamu pada garis bilangan, yaitu di $-7$.",
      "Karena ditambah dengan bilangan positif $3$, bergeraklah ke arah kanan sebanyak $3$ langkah.",
      "Hitung mundur langkahmu ke kanan: $-7 \\rightarrow -6 \\rightarrow -5 \\rightarrow -4$.",
      "Jadi, hasil akhir dari $-7 + 3$ adalah $-4$."
    ],
    explanation: "Mulai dari -7, melangkah ke kanan sebanyak 3 langkah menghasilkan -4."
  },
  {
    id: "drill-int-p2-q2",
    topicId: "integer",
    misconceptionCode: "MC-ADD-SIGN-CONF",
    phase: 2,
    question: "Berapakah hasil dari $5 + (-2)$?",
    options: ["7", "-3", "3", "-7"],
    correctAnswer: "3",
    hints: [
      "Menambahkan bilangan negatif $-2$ memiliki dampak yang sama dengan mengurangi bilangan positif $2$, yaitu $5 - 2$.",
      "Pada garis bilangan, mulailah dari $5$ lalu bergerak ke arah kiri (nilai berkurang) sebanyak $2$ langkah."
    ],
    guidedSolutionSteps: [
      "Tentukan posisi awal kamu pada garis bilangan, yaitu di $5$.",
      "Operasi $+ (-2)$ setara dengan pengurang biasa: $5 - 2$. Melangkahlah ke kiri sebanyak $2$ langkah.",
      "Hitung mundur langkahmu ke kiri: $5 \\rightarrow 4 \\rightarrow 3$.",
      "Jadi, hasil akhir dari $5 + (-2)$ adalah $3$."
    ],
    explanation: "Menjumlahkan dengan bilangan negatif sama dengan pengurangan biasa. $5 + (-2) = 5 - 2 = 3$."
  },
  {
    id: "drill-int-p2-q3",
    topicId: "integer",
    misconceptionCode: "MC-ADD-SIGN-CONF",
    phase: 2,
    question: "Berapakah hasil dari $-6 + 6$?",
    options: ["-12", "12", "0", "-6"],
    correctAnswer: "0",
    hints: [
      "Menjumlahkan suatu bilangan dengan lawannya (misalnya $-6$ dengan $+6$) akan saling meniadakan atau menetralkan.",
      "Konsep ini dikenal sebagai pasangan nol (zero pair). Jika kamu punya utang $6$ dan membayarnya sebesar $6$, maka sisa utangmu habis."
    ],
    guidedSolutionSteps: [
      "Mulai dari $-6$ pada garis bilangan (arah kiri).",
      "Karena ditambah $+6$, melangkahlah ke kanan sebanyak $6$ langkah.",
      "Hitung langkahmu: $-6 \\rightarrow -5 \\rightarrow -4 \\rightarrow -3 \\rightarrow -2 \\rightarrow -1 \\rightarrow 0$.",
      "Karena bilangan negatif $-6$ berpasangan dengan bilangan positif $6$, hasilnya tepat berada di $0$."
    ],
    explanation: "Bilangan negatif dan positif dengan nilai mutlak yang sama saling menetralkan (zero pair) menghasilkan 0. $-6 + 6 = 0$."
  },

  // --- FASE 3: Independent Practice (Latihan Mandiri) ---
  {
    id: "drill-int-p3-q1",
    topicId: "integer",
    misconceptionCode: "MC-ADD-SIGN-CONF",
    phase: 3,
    question: "Berapakah hasil dari $-4 + (-3)$?",
    options: ["-7", "7", "-1", "1"],
    correctAnswer: "-7",
    explanation: "Memulai dari posisi -4, kemudian melangkah ke kiri sebanyak 3 langkah menghasilkan -7. $-4 + (-3) = -7$."
  },
  {
    id: "drill-int-p3-q2",
    topicId: "integer",
    misconceptionCode: "MC-ADD-SIGN-CONF",
    phase: 3,
    question: "Berapakah hasil dari $-9 + 5$?",
    options: ["-14", "14", "-4", "4"],
    correctAnswer: "-4",
    explanation: "Memulai dari posisi -9, bergerak ke kanan sebanyak 5 langkah. Hasilnya adalah -4."
  },
  {
    id: "drill-int-p3-q3",
    topicId: "integer",
    misconceptionCode: "MC-ADD-SIGN-CONF",
    phase: 3,
    question: "Berapakah hasil dari $8 + (-10)$?",
    options: ["18", "-18", "-2", "2"],
    correctAnswer: "-2",
    explanation: "Operasi $8 + (-10)$ setara dengan $8 - 10$. Melangkah ke kiri 10 langkah dari posisi 8 berakhir di -2."
  },
  {
    id: "drill-int-p3-q4",
    topicId: "integer",
    misconceptionCode: "MC-ADD-SIGN-CONF",
    phase: 3,
    question: "Manakah dari pernyataan berikut yang menggambarkan makna dari pasangan nol (zero pair) dalam operasi bilangan bulat?",
    options: [
      "Menjumlahkan dua bilangan bulat positif yang bernilai sama menghasilkan nol",
      "Menjumlahkan suatu bilangan bulat dengan lawan negatif/positifnya menghasilkan nol",
      "Mengalikan suatu bilangan bulat dengan nol menghasilkan nol",
      "Membagi suatu bilangan bulat dengan dirinya sendiri menghasilkan satu"
    ],
    correctAnswer: "Menjumlahkan suatu bilangan bulat dengan lawan negatif/positifnya menghasilkan nol",
    explanation: "Pasangan nol terbentuk ketika bilangan positif bertemu dengan bilangan negatif bernilai sama (misal $1$ dan $-1$), sehingga saling meniadakan menjadi nol."
  },
  {
    id: "drill-int-p3-q5",
    topicId: "integer",
    misconceptionCode: "MC-ADD-SIGN-CONF",
    phase: 3,
    question: "Pada garis bilangan, jika kamu berada di posisi $-3$ lalu melakukan penjumlahan $+ (-2)$, ke mana arah gerak dan di mana posisi akhirmu?",
    options: [
      "Bergerak ke kanan sebanyak 2 langkah dan mendarat di -1",
      "Bergerak ke kiri sebanyak 2 langkah dan mendarat di -5",
      "Bergerak ke kanan sebanyak 3 langkah dan mendarat di 0",
      "Bergerak ke kiri sebanyak 3 langkah dan mendarat di -6"
    ],
    correctAnswer: "Bergerak ke kiri sebanyak 2 langkah dan mendarat di -5",
    explanation: "Penjumlahan $+ (-2)$ berarti melangkah ke kiri sebanyak 2 langkah dari posisi awal -3, sehingga mendarat di -5."
  },

  // --- TOPIK ALGEBRA (MC-ALG-ADD-UNLIKE) ---
  // --- FASE 1: Worked Examples (Contoh Detail) ---
  {
    id: "drill-alg-p1-q1",
    topicId: "algebra",
    misconceptionCode: "MC-ALG-ADD-UNLIKE",
    phase: 1,
    question: "Sederhanakan bentuk aljabar berikut: $2x + 3x$.",
    correctAnswer: "5x",
    workedExampleSteps: [
      "Identifikasi suku-suku yang ada: $2x$ dan $3x$. Keduanya memiliki variabel yang sama, yaitu $x$. Suku dengan variabel yang sama disebut **suku sejenis**.",
      "Analogi konkret: Bayangkan variabel $x$ sebagai sekeranjang **apel**. Jadi, $2x + 3x$ dapat dianalogikan sebagai **2 apel + 3 apel**.",
      "Karena sejenis, kita bisa menjumlahkan koefisiennya (angka di depan huruf): $2 + 3 = 5$.",
      "Variabelnya tetap mengikuti jenisnya. Jadi, hasil akhirnya adalah $5$ apel, yaitu $5x$."
    ],
    explanation: "Suku 2x dan 3x adalah suku sejenis. Menjumlahkan koefisiennya (2 + 3) memberikan hasil 5x."
  },
  {
    id: "drill-alg-p1-q2",
    topicId: "algebra",
    misconceptionCode: "MC-ALG-ADD-UNLIKE",
    phase: 1,
    question: "Apakah bentuk aljabar $2x + 3y$ bisa disederhanakan menjadi $5xy$?",
    correctAnswer: "Tidak bisa disederhanakan",
    workedExampleSteps: [
      "Identifikasi suku-suku yang ada: $2x$ dan $3y$. Suku pertama memiliki variabel $x$, sedangkan suku kedua memiliki variabel $y$. Keduanya adalah **suku tidak sejenis**.",
      "Analogi konkret: Bayangkan variabel $x$ sebagai **apel** dan variabel $y$ sebagai **jeruk**. Jadi, $2x + 3y$ dapat dianalogikan sebagai **2 apel + 3 jeruk**.",
      "Apakah 2 apel + 3 jeruk bisa digabungkan menjadi 5 'apeljeruk'? Tentu saja tidak! Apel tetap apel, jeruk tetap jeruk.",
      "Karena suku-sukunya tidak sejenis, ekspresi $2x + 3y$ tidak dapat disederhanakan lebih lanjut dan tetap ditulis sebagai $2x + 3y$. Jadi, $2x + 3y \\neq 5xy$."
    ],
    explanation: "Suku dengan variabel berbeda (x dan y) tidak sejenis, sehingga tidak dapat dijumlahkan atau disederhanakan lebih lanjut."
  },

  // --- FASE 2: Guided Practice (Contoh Terbimbing) ---
  {
    id: "drill-alg-p2-q1",
    topicId: "algebra",
    misconceptionCode: "MC-ALG-ADD-UNLIKE",
    phase: 2,
    question: "Sederhanakan bentuk aljabar berikut: $4a + a$.",
    options: ["4a", "5a", "4a^2", "5a^2"],
    correctAnswer: "5a",
    hints: [
      "Ingat, jika variabel ditulis sendirian seperti $a$, sebenarnya ia memiliki koefisien tersembunyi bernilai $1$. Jadi, $a$ sama dengan $1a$.",
      "Karena suku $4a$ dan $1a$ memiliki variabel yang sama, jumlahkan koefisiennya ($4 + 1$)."
    ],
    guidedSolutionSteps: [
      "Kenali koefisisan tersembunyi bernilai $1$ pada variabel $a$, sehingga persamaannya dapat ditulis: $4a + 1a$.",
      "Jumlahkan koefisiennya: $4 + 1 = 5$.",
      "Pertahankan variabelnya tetap $a$ (jangan diubah menjadi kuadrat karena ini penjumlahan, bukan perkalian).",
      "Hasil akhir penyederhanaan adalah $5a$."
    ],
    explanation: "Variabel tunggal a memiliki koefisien 1. Maka, 4a + a = 4a + 1a = 5a."
  },
  {
    id: "drill-alg-p2-q2",
    topicId: "algebra",
    misconceptionCode: "MC-ALG-ADD-UNLIKE",
    phase: 2,
    question: "Sederhanakan bentuk aljabar berikut: $5m - 2m$.",
    options: ["3", "3m", "7m", "3m^2"],
    correctAnswer: "3m",
    hints: [
      "Suku $5m$ dan $2m$ adalah suku sejenis karena variabelnya sama-sama $m$.",
      "Lakukan pengurangan koefisiennya seperti biasa: $5 - 2$.",
      "Variabel $m$ tetap dipertahankan pada hasil akhir."
    ],
    guidedSolutionSteps: [
      "Periksa apakah suku-sukunya sejenis. Keduanya memiliki variabel $m$, jadi mereka sejenis.",
      "Kurangkan koefisiennya: $5 - 2 = 3$.",
      "Pertahankan variabelnya, sehingga menjadi $3m$.",
      "Hasil akhirnya adalah $3m$."
    ],
    explanation: "Suku sejenis dapat langsung dikurangkan koefisiennya: 5m - 2m = (5 - 2)m = 3m."
  },
  {
    id: "drill-alg-p2-q3",
    topicId: "algebra",
    misconceptionCode: "MC-ALG-ADD-UNLIKE",
    phase: 2,
    question: "Sederhanakan bentuk aljabar berikut: $3p + 2q + p$.",
    options: ["6pq", "4p + 2q", "3p + 3q", "4p^2 + 2q"],
    correctAnswer: "4p + 2q",
    hints: [
      "Cari suku-suku yang sejenis. Di sini, suku $3p$ dan suku $p$ (yaitu $1p$) adalah suku sejenis.",
      "Suku $2q$ tidak sejenis dengan suku $p$, sehingga tidak boleh digabungkan dengan kelompok $p$.",
      "Jumlahkan suku sejenis $3p + 1p$, lalu biarkan suku $2q$ tetap tertulis terpisah."
    ],
    guidedSolutionSteps: [
      "Kelompokkan suku-suku sejenis terlebih dahulu: $3p + p + 2q$.",
      "Tulis koefisien tersembunyi pada $p$: $3p + 1p + 2q$.",
      "Jumlahkan suku sejenis: $3p + 1p = 4p$.",
      "Tuliskan ekspresi hasil penggabungan: $4p + 2q$."
    ],
    explanation: "Hanya suku sejenis yang dapat digabungkan. $3p + p = 4p$, sedangkan suku 2q tetap terpisah. Hasilnya 4p + 2q."
  },

  // --- FASE 3: Independent Practice (Latihan Mandiri) ---
  {
    id: "drill-alg-p3-q1",
    topicId: "algebra",
    misconceptionCode: "MC-ALG-ADD-UNLIKE",
    phase: 3,
    question: "Berapakah hasil dari $7x + 2x$?",
    options: ["9x", "9", "9x^2", "14x"],
    correctAnswer: "9x",
    explanation: "Suku 7x dan 2x sejenis. Penjumlahannya adalah (7 + 2)x = 9x."
  },
  {
    id: "drill-alg-p3-q2",
    topicId: "algebra",
    misconceptionCode: "MC-ALG-ADD-UNLIKE",
    phase: 3,
    question: "Sederhanakan bentuk aljabar berikut: $5x + 4y$.",
    options: ["9xy", "5x + 4y", "9x", "20xy"],
    correctAnswer: "5x + 4y",
    explanation: "Suku 5x dan 4y tidak sejenis karena memiliki variabel berbeda. Maka, ekspresi tersebut tidak dapat disederhanakan lagi."
  },
  {
    id: "drill-alg-p3-q3",
    topicId: "algebra",
    misconceptionCode: "MC-ALG-ADD-UNLIKE",
    phase: 3,
    question: "Berapakah hasil dari $6a - a$?",
    options: ["6", "5a", "5", "6a^2"],
    correctAnswer: "5a",
    explanation: "Koefisien tersembunyi pada a adalah 1. Maka, 6a - 1a = 5a."
  },
  {
    id: "drill-alg-p3-q4",
    topicId: "algebra",
    misconceptionCode: "MC-ALG-ADD-UNLIKE",
    phase: 3,
    question: "Manakah dari pernyataan berikut yang paling tepat menjelaskan perbedaan suku sejenis dan suku tidak sejenis?",
    options: [
      "Suku sejenis memiliki variabel dan pangkat yang sama, sedangkan suku tidak sejenis memiliki variabel atau pangkat yang berbeda",
      "Suku sejenis memiliki koefisien angka yang bernilai sama, sedangkan suku tidak sejenis memiliki koefisien berbeda",
      "Suku sejenis hanya dapat dikalikan sedangkan suku tidak sejenis hanya boleh dijumlahkan",
      "Suku sejenis memiliki huruf pembentuk yang selalu berurutan secara alfabetis"
    ],
    correctAnswer: "Suku sejenis memiliki variabel dan pangkat yang sama, sedangkan suku tidak sejenis memiliki variabel atau pangkat yang berbeda",
    explanation: "Sifat kesamaan variabel dan pangkat menentukan kesamaan suku. Suku sejenis memiliki variabel dan pangkat yang identik."
  },
  {
    id: "drill-alg-p3-q5",
    topicId: "algebra",
    misconceptionCode: "MC-ALG-ADD-UNLIKE",
    phase: 3,
    question: "Sederhanakan bentuk aljabar berikut: $2x + 5y + 3x$.",
    options: ["10xy", "5x + 5y", "2x + 8y", "5x^2 + 5y"],
    correctAnswer: "5x + 5y",
    explanation: "Suku sejenis adalah 2x dan 3x, yang jika dijumlahkan menjadi 5x. Suku 5y dibiarkan terpisah karena tidak sejenis. Hasilnya adalah 5x + 5y."
  },

  // --- TOPIK PLSV (MC-PLSV-INV-OP-CONFUSION) ---
  // --- FASE 1: Worked Examples (Contoh Detail) ---
  {
    id: "drill-plsv-p1-q1",
    topicId: "plsv",
    misconceptionCode: "MC-PLSV-INV-OP-CONFUSION",
    phase: 1,
    question: "Bagaimana kita menemukan nilai $x$ dari persamaan $x + 3 = 7$?",
    correctAnswer: "x = 4",
    workedExampleSteps: [
      "Persamaan $x + 3 = 7$ bisa dibayangkan seperti timbangan yang seimbang. Ruas kiri ($x + 3$) dan ruas kanan ($7$) memiliki berat yang sama.",
      "Tujuan kita adalah menyendirikan $x$ di ruas kiri agar kita tahu nilainya ($x = \\dots$).",
      "Untuk menghilangkan $+3$ di ruas kiri, kita gunakan **operasi invers** (kebalikan) dari penjumlahan, yaitu pengurangan dengan bilangan yang sama: kurangi dengan $3$.",
      "**PENTING**: Agar timbangan tetap seimbang, perubahan harus dilakukan pada **kedua ruas**. Kita kurangi kedua ruas dengan $3$:\n$x + 3 - 3 = 7 - 3$",
      "Sederhanakan kedua ruas: di ruas kiri $3 - 3 = 0$ (tersisa $x$), dan di ruas kanan $7 - 3 = 4$.\n$x = 4$",
      "Jadi, $x = 4$. Perhatikan bahwa \"pindah ruas tanda berubah\" hanyalah cara cepat dari mengurangkan kedua ruas dengan bilangan yang sama!"
    ],
    explanation: "Untuk menyendirikan x, kita kurangi kedua ruas dengan 3. Persamaan menjadi x + 3 - 3 = 7 - 3 sehingga diperoleh x = 4."
  },
  {
    id: "drill-plsv-p1-q2",
    topicId: "plsv",
    misconceptionCode: "MC-PLSV-INV-OP-CONFUSION",
    phase: 1,
    question: "Bagaimana cara menyelesaikan persamaan $2x = 10$ menggunakan konsep keseimbangan ruas?",
    correctAnswer: "x = 5",
    workedExampleSteps: [
      "Persamaan $2x = 10$ berarti dua kali nilai $x$ sama dengan $10$. Ini seperti timbangan dengan dua kantong misterius $x$ di ruas kiri dan sepuluh koin di ruas kanan.",
      "Kita ingin mencari tahu isi dari satu kantong $x$ saja.",
      "Operasi antara koefisien $2$ dan variabel $x$ adalah **perkalian** ($2 \\times x$). Operasi invers dari perkalian adalah **pembagian**.",
      "Agar timbangan tetap seimbang, kita harus membagi **kedua ruas** dengan bilangan yang sama, yaitu $2$:\n$\\frac{2x}{2} = \\frac{10}{2}$",
      "Di ruas kiri, $\\frac{2}{2}$ bernilai $1$, menyisakan $1x$ atau $x$. Di ruas kanan, $10$ dibagi $2$ adalah $5$.\n$x = 5$",
      "Jadi, $x = 5$. Miskonsepsi yang sering terjadi adalah mengira perkalian diselesaikan dengan perkalian lagi (sehingga $x = 10 \\times 2 = 20$), padahal operasi inversnya adalah pembagian."
    ],
    explanation: "Hubungan antara 2 dan x adalah perkalian. Operasi inversnya adalah membagi kedua ruas dengan 2, sehingga 2x / 2 = 10 / 2 menghasilkan x = 5."
  },

  // --- FASE 2: Guided Practice (Contoh Terbimbing) ---
  {
    id: "drill-plsv-p2-q1",
    topicId: "plsv",
    misconceptionCode: "MC-PLSV-INV-OP-CONFUSION",
    phase: 2,
    question: "Tentukan nilai $x$ dari persamaan $x - 5 = 2$ dengan menerapkan operasi pada kedua ruas!",
    options: ["x = -3", "x = 7", "x = 3", "x = -7"],
    correctAnswer: "x = 7",
    hints: [
      "Agar $x$ berdiri sendiri di ruas kiri, kita perlu menghilangkan $-5$.",
      "Operasi invers (kebalikan) dari pengurangan ($-5$) adalah penjumlahan ($+5$).",
      "Ingat prinsip keseimbangan: jumlahkan **kedua ruas** dengan $5$."
    ],
    guidedSolutionSteps: [
      "Identifikasi operasi invers dari $-5$ di ruas kiri, yaitu $+5$.",
      "Tambahkan $5$ pada **kedua ruas**: $x - 5 + 5 = 2 + 5$.",
      "Sederhanakan ruas kiri: $-5 + 5 = 0$, sehingga hanya tersisa $x$.",
      "Hitung hasil penjumlahan ruas kanan: $2 + 5 = 7$. Maka diperoleh $x = 7$."
    ],
    explanation: "Operasi invers dari pengurangan 5 adalah penjumlahan 5. Dengan menjumlahkan 5 pada kedua ruas, kita dapatkan x - 5 + 5 = 2 + 5, sehingga x = 7."
  },
  {
    id: "drill-plsv-p2-q2",
    topicId: "plsv",
    misconceptionCode: "MC-PLSV-INV-OP-CONFUSION",
    phase: 2,
    question: "Selesaikan persamaan $\\frac{x}{3} = 4$ dengan menjaga keseimbangan ruas!",
    options: ["x = 4/3", "x = 12", "x = 7", "x = 1"],
    correctAnswer: "x = 12",
    hints: [
      "Bentuk $\\frac{x}{3}$ menunjukkan operasi pembagian ($x$ dibagi $3$).",
      "Kebalikan (operasi invers) dari pembagian adalah perkalian.",
      "Kalikan **kedua ruas** dengan $3$ agar persamaan tetap setara dan penyebut $3$ hilang."
    ],
    guidedSolutionSteps: [
      "Temukan operasi invers dari pembagian dengan $3$, yaitu perkalian dengan $3$.",
      "Kalikan **kedua ruas** dengan $3$: $\\frac{x}{3} \\times 3 = 4 \\times 3$.",
      "Ruas kiri menjadi $x$ (karena $\\frac{3}{3} = 1$).",
      "Hitung ruas kanan: $4 \\times 3 = 12$. Maka didapatkan $x = 12$."
    ],
    explanation: "Kebalikan dari pembagian 3 adalah perkalian dengan 3. Mengalikan kedua ruas dengan 3 menghasilkan x = 4 * 3 = 12."
  },
  {
    id: "drill-plsv-p2-q3",
    topicId: "plsv",
    misconceptionCode: "MC-PLSV-INV-OP-CONFUSION",
    phase: 2,
    question: "Bagaimana cara menyelesaikan persamaan dua langkah berikut: $3x + 2 = 11$?",
    options: ["x = 3", "x = 13/3", "x = 9", "x = 27"],
    correctAnswer: "x = 3",
    hints: [
      "Kita harus menghilangkan konstanta $+2$ terlebih dahulu sebelum membagi koefisien $3$.",
      "Kurangi **kedua ruas** dengan $2$ untuk menghilangkan $+2$ di ruas kiri.",
      "Setelah tersisa $3x = 9$, lakukan pembagian **kedua ruas** dengan $3$ untuk mendapatkan nilai $x$."
    ],
    guidedSolutionSteps: [
      "Langkah 1: Kurangi kedua ruas dengan $2$ untuk mengeliminasi konstanta $+2$: $3x + 2 - 2 = 11 - 2$, sehingga $3x = 9$.",
      "Langkah 2: Identifikasi hubungan perkalian pada $3x$. Operasi inversnya adalah pembagian.",
      "Bagi kedua ruas dengan $3$: $\\frac{3x}{3} = \\frac{9}{3}$.",
      "Diperoleh hasil akhir $x = 3$."
    ],
    explanation: "Pertama, kurangkan kedua ruas dengan 2 menjadi 3x = 9. Kedua, bagi kedua ruas dengan 3 sehingga x = 3."
  },

  // --- FASE 3: Independent Practice (Latihan Mandiri) ---
  {
    id: "drill-plsv-p3-q1",
    topicId: "plsv",
    misconceptionCode: "MC-PLSV-INV-OP-CONFUSION",
    phase: 3,
    question: "Selesaikan persamaan $x + 8 = 15$.",
    options: ["x = 23", "x = 7", "x = -7", "x = 120"],
    correctAnswer: "x = 7",
    explanation: "Kurangi kedua ruas dengan 8: x + 8 - 8 = 15 - 8, sehingga diperoleh x = 7."
  },
  {
    id: "drill-plsv-p3-q2",
    topicId: "plsv",
    misconceptionCode: "MC-PLSV-INV-OP-CONFUSION",
    phase: 3,
    question: "Tentukan nilai $x$ dari persamaan $4x = 24$.",
    options: ["x = 96", "x = 6", "x = 20", "x = 28"],
    correctAnswer: "x = 6",
    explanation: "Bagi kedua ruas dengan 4 untuk mengeliminasi koefisien 4: 4x / 4 = 24 / 4, didapatkan x = 6."
  },
  {
    id: "drill-plsv-p3-q3",
    topicId: "plsv",
    misconceptionCode: "MC-PLSV-INV-OP-CONFUSION",
    phase: 3,
    question: "Selesaikan persamaan $x - 9 = -3$ menggunakan prinsip keseimbangan.",
    options: ["x = -12", "x = 6", "x = -6", "x = 12"],
    correctAnswer: "x = 6",
    explanation: "Operasi invers dari pengurangan 9 adalah penjumlahan 9. Tambahkan 9 pada kedua ruas: x - 9 + 9 = -3 + 9, sehingga didapatkan x = 6."
  },
  {
    id: "drill-plsv-p3-q4",
    topicId: "plsv",
    misconceptionCode: "MC-PLSV-INV-OP-CONFUSION",
    phase: 3,
    question: "Mengapa setiap operasi penjumlahan, pengurangan, perkalian, atau pembagian harus dilakukan pada KEDUA RUAS persamaan?",
    options: [
      "Agar nilai persamaan tetap seimbang dan setara",
      "Agar nilai x selalu menjadi bilangan bulat positif",
      "Agar ruas kiri selalu bernilai nol",
      "Karena aturan matematika melarang operasi pada satu ruas saja"
    ],
    correctAnswer: "Agar nilai persamaan tetap seimbang dan setara",
    explanation: "Persamaan menyatakan kesetaraan atau keseimbangan antara ruas kiri dan kanan. Jika kita mengubah satu ruas saja, keseimbangan akan rusak dan nilai kesetaraan tidak lagi berlaku."
  },
  {
    id: "drill-plsv-p3-q5",
    topicId: "plsv",
    misconceptionCode: "MC-PLSV-INV-OP-CONFUSION",
    phase: 3,
    question: "Tentukan solusi untuk persamaan $2x - 5 = 7$.",
    options: ["x = 1", "x = 6", "x = 4", "x = 24"],
    correctAnswer: "x = 6",
    explanation: "Pertama, tambahkan 5 ke kedua ruas: 2x = 12. Kedua, bagi kedua ruas dengan 2: x = 6."
  }
];
