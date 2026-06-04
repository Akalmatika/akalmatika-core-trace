// src/data/foundationQuestions.ts

export interface FoundationQuestion {
  id: string;
  topicId: 'integer' | 'fractions' | 'percent' | 'algebra' | 'plsv';
  areaTitle: string;
  expression: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  misconceptionMappings: Record<string, string>; // Memetakan opsi salah ke kode miskonsepsi
  explanation: string;
}

export const foundationQuestions: FoundationQuestion[] = [
  {
    id: "fond-int-1",
    topicId: "integer",
    areaTitle: "Bilangan Bulat",
    expression: "-2 + 3",
    questionText: "Berapakah hasil penjumlahan bilangan bulat berikut?",
    options: ["1", "-5", "5", "-1"],
    correctAnswer: "1",
    misconceptionMappings: {
      "-5": "MC-ADD-SIGN-CONF",
      "-1": "MC-SIGN-FIRST-NUM",
      "5": "MC-ADD-ABS-SUM"
    },
    explanation: "Ketika menjumlahkan bilangan negatif dan positif, bayangkan es (positif) dan api (negatif). 2 api bertemu 3 es akan saling menetralkan (zero pair), menyisakan 1 es positif (+1)."
  },
  {
    id: "fond-int-2",
    topicId: "integer",
    areaTitle: "Bilangan Bulat",
    expression: "4 - (-2)",
    questionText: "Hitunglah hasil operasi pengurangan bilangan bulat berikut:",
    options: ["6", "2", "-6", "-2"],
    correctAnswer: "6",
    misconceptionMappings: {
      "2": "MC-SUB-IGNORE-NEG"
    },
    explanation: "Mengurangkan suatu bilangan sama artinya dengan menambahkan lawannya. Mengurangkan negatif 2 (-2) sama dengan menambahkan positif 2 (+2). Jadi, 4 - (-2) = 4 + 2 = 6."
  },
  {
    id: "fond-frac-1",
    topicId: "fractions",
    areaTitle: "Pecahan",
    expression: "\\frac{1}{2} + \\frac{1}{4}",
    questionText: "Berapakah hasil penjumlahan pecahan berikut?",
    options: ["\\frac{3}{4}", "\\frac{2}{6}", "\\frac{2}{4}", "\\frac{1}{6}"],
    correctAnswer: "\\frac{3}{4}",
    misconceptionMappings: {
      "\\frac{2}{6}": "MC-FRAC-ADD-NUM-DENOM",
      "\\frac{2}{4}": "MC-FRAC-DIFF-DENOM-IGNORE"
    },
    explanation: "Penyebut pecahan menunjukkan ukuran potongan. Kita tidak bisa langsung menjumlahkan pembilang jika ukuran potongannya berbeda. Ubah dahulu 1/2 menjadi pecahan senilai yaitu 2/4. Setelah itu, jumlahkan pembilangnya: 2/4 + 1/4 = 3/4."
  },
  {
    id: "fond-frac-2",
    topicId: "fractions",
    areaTitle: "Pecahan",
    expression: "\\frac{1}{3} + \\frac{1}{4}",
    questionText: "Jumlahkan kedua pecahan di bawah ini:",
    options: ["\\frac{7}{12}", "\\frac{2}{7}", "\\frac{2}{4}", "\\frac{7}{7}"],
    correctAnswer: "\\frac{7}{12}",
    misconceptionMappings: {
      "\\frac{2}{7}": "MC-FRAC-ADD-NUM-DENOM",
      "\\frac{2}{4}": "MC-FRAC-DIFF-DENOM-IGNORE"
    },
    explanation: "Samakan penyebut dengan mencari KPK dari 3 dan 4, yaitu 12. Pecahan 1/3 menjadi 4/12, dan 1/4 menjadi 3/12. Hasil penjumlahannya adalah 4/12 + 3/12 = 7/12."
  },
  {
    id: "fond-perc-1",
    topicId: "percent",
    areaTitle: "Persen",
    expression: "\\frac{1}{4}",
    questionText: "Berapa persenkah nilai pecahan berikut?",
    options: ["25\\%", "14\\%", "10\\%", "40\\%"],
    correctAnswer: "25\\%",
    misconceptionMappings: {
      "14\\%": "MC-PERC-NO-100",
      "10\\%": "MC-PERC-ADD-ZERO"
    },
    explanation: "Persen berarti 'per seratus'. Untuk mengubah 1/4 menjadi persen, kita buat penyebutnya menjadi 100 dengan mengalikan pembilang dan penyebut dengan 25. Sehingga diperoleh 25/100, yang setara dengan 25%."
  },
  {
    id: "fond-perc-2",
    topicId: "percent",
    areaTitle: "Persen",
    expression: "\\frac{3}{10}",
    questionText: "Bentuk persen dari pecahan di bawah ini adalah:",
    options: ["30\\%", "3\\%", "13\\%", "300\\%"],
    correctAnswer: "30\\%",
    misconceptionMappings: {
      "3\\%": "MC-PERC-NO-100",
      "300\\%": "MC-PERC-ADD-ZERO"
    },
    explanation: "Untuk mengubah 3/10 ke per seratus, kalikan pembilang dan penyebut dengan 10. Didapatkan 30/100, yang setara dengan 30%."
  },
  {
    id: "fond-alg-1",
    topicId: "algebra",
    areaTitle: "Aljabar Dasar",
    expression: "2x + 3y",
    questionText: "Manakah bentuk yang paling sederhana dari ekspresi aljabar ini?",
    options: ["2x+3y", "5xy", "5x", "5y"],
    correctAnswer: "2x+3y",
    misconceptionMappings: {
      "5xy": "MC-ALG-ADD-UNLIKE"
    },
    explanation: "Dalam aljabar, kita hanya bisa menjumlahkan suku yang sejenis (variabelnya sama). Karena x dan y berbeda, ekspresi 2x + 3y sudah berada dalam bentuk paling sederhana dan tidak bisa digabungkan menjadi 5xy."
  },
  {
    id: "fond-alg-2",
    topicId: "algebra",
    areaTitle: "Aljabar Dasar",
    expression: "4y - y",
    questionText: "Sederhanakan bentuk aljabar di bawah ini:",
    options: ["3y", "4y", "4", "3"],
    correctAnswer: "3y",
    misconceptionMappings: {
      "4y": "MC-ALG-IGNORE-VAR",
      "4": "MC-ALG-IGNORE-VAR"
    },
    explanation: "Variabel tanpa angka koefisien di depannya secara implisit memiliki nilai koefisien 1 (y artinya 1y). Jadi, 4y - y sama dengan 4y - 1y = 3y."
  },
  {
    id: "fond-plsv-1",
    topicId: "plsv",
    areaTitle: "Makna Tanda Sama Dengan / PLSV",
    expression: "x + 3 = 8",
    questionText: "Tentukan nilai x yang memenuhi persamaan berikut:",
    options: ["5", "11", "24", "3"],
    correctAnswer: "5",
    misconceptionMappings: {
      "11": "MC-PLSV-INV-OP-CONFUSION"
    },
    explanation: "Untuk mengisolasi x (membuat x sendirian di satu sisi), pindahkan angka 3 ke sisi kanan dengan operasi inversnya (kebalikannya). Lawan dari penjumlahan (+3) adalah pengurangan (-3). Jadi, x = 8 - 3 = 5."
  },
  {
    id: "fond-plsv-2",
    topicId: "plsv",
    areaTitle: "Makna Tanda Sama Dengan / PLSV",
    expression: "x - 4 = 6",
    questionText: "Berapakah nilai x dari persamaan berikut:",
    options: ["10", "2", "24", "-2"],
    correctAnswer: "10",
    misconceptionMappings: {
      "2": "MC-PLSV-INV-OP-CONFUSION"
    },
    explanation: "Untuk mengisolasi x, lakukan operasi invers terhadap pengurangan 4 (-4), yaitu dengan menjumlahkan 4 (+4) pada ruas kanan. Maka x = 6 + 4 = 10."
  }
];
