// src/data/bridgeContent.ts

export interface BridgeContent {
  topicId: string;
  misconceptionCode: string;
  misconceptionTitle: string;
  whatStudentDid: string;
  whyTempting: string;
  conceptMeaning: string[];
  concreteExample: string;
  thinkingPrompts: string[];
  visualizationRoute: string;
  drillRoute: string;
}

export const bridgeContents: BridgeContent[] = [
  {
    topicId: "integer",
    misconceptionCode: "MC-ADD-SIGN-CONF",
    misconceptionTitle: "Apa yang sebenarnya terjadi saat menjumlahkan bilangan negatif?",
    whatStudentDid: "Kamu menjawab -2 + 3 = -5.",
    whyTempting: "Wajar jika jawaban ini terasa benar. Angka 2 ditambah 3 menghasilkan 5, dan karena ada tanda negatif di depan angka 2, kamu berpikir hasilnya harus negatif. Namun, tanda negatif bukan sekadar hiasan.",
    conceptMeaning: [
      "Bilangan negatif dan positif adalah entitas yang berlawanan, seperti air panas dan air dingin, atau api (negatif) dan es (positif).",
      "Ketika bilangan negatif dan positif dijumlahkan, mereka tidak bertambah banyak. Sebaliknya, mereka saling menetralkan (zero pair)."
    ],
    concreteExample: "Bayangkan kamu memiliki 2 kartu Api (negatif) dan mendapatkan 3 kartu Es (positif). Setiap 1 Api bertemu 1 Es akan melebur menjadi abu (nol). Dari 2 Api dan 3 Es, kamu bisa memasangkan 2 Api dengan 2 Es untuk menjadi nol. Sisa yang kamu miliki adalah 1 Es positif (+1).",
    thinkingPrompts: [
      "Jika kamu memiliki 5 Api dan mendapatkan 2 Es, manakah yang lebih banyak? Berapa banyak sisanya?",
      "Mengapa penjumlahan bilangan berbeda tanda justru mengurangi nilai mutlaknya?"
    ],
    visualizationRoute: "/student/visualizations/integer",
    drillRoute: "/student/drill/integer"
  },
  {
    topicId: "fractions",
    misconceptionCode: "MC-FRAC-ADD-NUM-DENOM",
    misconceptionTitle: "Mengapa 1/2 + 1/3 bukan 2/5?",
    whatStudentDid: "Kamu menjawab 1/2 + 1/3 = 2/5.",
    whyTempting: "Ini adalah kesalahan paling alami di dunia! Menjumlahkan angka atas (1 + 1 = 2) dan menjumlahkan angka bawah (2 + 3 = 5) terasa sangat logis karena begitulah cara kita menjumlahkan bilangan biasa.",
    conceptMeaning: [
      "Pecahan bukan merupakan dua buah bilangan yang terpisah, melainkan SATU bilangan utuh.",
      "Angka di bawah (penyebut) menunjukkan ukuran potongan, sedangkan angka di atas (pembilang) menunjukkan berapa banyak potongan yang kamu miliki.",
      "Kamu tidak bisa menjumlahkan potongan yang berbeda ukuran secara langsung tanpa menyamakan ukurannya terlebih dahulu."
    ],
    concreteExample: "Bayangkan kamu memiliki setengah (1/2) pizza ukuran raksasa dan sepertiga (1/3) pizza ukuran raksasa. Jika kamu menggabungkannya secara acak dan menyebutnya 2/5 pizza, itu tidak masuk akal karena ukuran potongannya berbeda. Untuk menggabungkannya, kamu harus memotong pizza tersebut menjadi bagian-bagian yang sama besar (seperduabelas) terlebih dahulu.",
    thinkingPrompts: [
      "Jika kamu memiliki 1 apel utuh dan 1 jeruk utuh, apakah kamu bisa menyebutnya 2 apel? Mengapa penyebut pecahan harus disamakan terlebih dahulu?",
      "Apa makna fisik dari menyamakan penyebut pecahan?"
    ],
    visualizationRoute: "/student/visualizations/fractions",
    drillRoute: "/student/drill/fractions"
  },
  {
    topicId: "percent",
    misconceptionCode: "MC-PERC-NO-100",
    misconceptionTitle: "Persen artinya per seratus — bukan hanya angka",
    whatStudentDid: "Kamu menjawab pecahan 1/4 sama dengan 14% atau pecahan 3/10 sama dengan 3%.",
    whyTempting: "Sangat menggoda untuk langsung memindahkan angka pembilang atau penyebut langsung ke simbol persen karena tampilannya yang mirip. Namun, persen adalah rasio khusus.",
    conceptMeaning: [
      "Kata 'Persen' berasal dari bahasa Latin 'per centum', yang berarti 'per seratus'.",
      "Persen menunjukkan berapa banyak bagian yang kamu ambil jika total bagiannya ada 100.",
      "Pecahan 1/4 tidak berarti 14%, melainkan kita harus mencari pecahan senilai yang memiliki penyebut 100 terlebih dahulu."
    ],
    concreteExample: "Bayangkan sebuah cokelat yang dibagi menjadi 4 bagian besar, dan kamu memakan 1 bagian (1/4). Jika kita ingin menyatakan dalam persen, bayangkan cokelat yang sama dibagi menjadi 100 bagian kecil. 1 bagian besar (seperempat) tadi setara dengan 25 bagian kecil dari 100 bagian tersebut. Maka, 1/4 = 25/100 = 25%.",
    thinkingPrompts: [
      "Mengapa penyebut pecahan harus diubah menjadi 100 terlebih dahulu sebelum kita bisa menggunakan tanda %?",
      "Jika kamu mendapat nilai 7 dari 10 soal, berapa persen nilaimu?"
    ],
    visualizationRoute: "/student/visualizations/percent",
    drillRoute: "/student/drill/percent"
  },
  {
    topicId: "algebra",
    misconceptionCode: "MC-ALG-ADD-UNLIKE",
    misconceptionTitle: "Mengapa 2x + 3y bukan 5xy?",
    whatStudentDid: "Kamu menjumlahkan suku yang tidak sejenis, seperti 2x + 3y = 5xy.",
    whyTempting: "Sangat wajar jika kamu ingin menggabungkan semua angka (2 + 3 = 5) dan semua huruf (x dan y menjadi xy) agar ekspresinya terlihat lebih sederhana dan ringkas.",
    conceptMeaning: [
      "Variabel aljabar (seperti x dan y) mewakili jenis objek yang berbeda.",
      "Kita hanya bisa menjumlahkan atau mengurangkan suku-suku yang memiliki variabel yang sama persis (suku sejenis).",
      "Suku yang tidak sejenis tidak boleh digabungkan karena mewakili kuantitas dari objek yang berbeda jenis."
    ],
    concreteExample: "Bayangkan 'x' adalah kotak Apel dan 'y' adalah kotak Jeruk. Jika kamu memiliki 2 kotak Apel dan 3 kotak Jeruk, apakah mereka bisa dilebur menjadi 5 kotak 'Apel-Jeruk'? Tidak, mereka tetaplah 2 kotak Apel dan 3 kotak Jeruk. Menuliskan 2x + 3y = 5xy adalah kekeliruan logika penggabungan objek.",
    thinkingPrompts: [
      "Dapatkah kamu menjumlahkan 3 kucing dan 2 anjing menjadi 5 kucing-anjing?",
      "Kapan kita diperbolehkan menggabungkan variabel dalam aljabar?"
    ],
    visualizationRoute: "/student/visualizations/algebra",
    drillRoute: "/student/drill/algebra"
  },
  {
    topicId: "plsv",
    misconceptionCode: "MC-PLSV-INV-OP-CONFUSION",
    misconceptionTitle: "Memindahkan ruas: mengapa tanda berubah?",
    whatStudentDid: "Kamu menyelesaikan x + 3 = 8 menjadi x = 8 + 3 = 11.",
    whyTempting: "Kamu ingat aturan bahwa angka harus dikelompokkan ke ruas kanan, tetapi kamu lupa mengganti tandanya atau menggunakan operasi kebalikannya. Rasanya lebih mudah untuk memindahkan angka begitu saja.",
    conceptMeaning: [
      "Tanda sama dengan (=) menunjukkan bahwa ruas kiri dan ruas kanan berada dalam kondisi seimbang (seperti timbangan).",
      "Untuk menjaga keseimbangan, apa pun yang kamu lakukan di ruas kiri, harus kamu lakukan juga di ruas kanan.",
      "Memindahkan angka melintasi tanda sama dengan sebenarnya merupakan singkatan dari melakukan operasi kebalikan (invers) di kedua ruas untuk mengeliminasi angka tersebut."
    ],
    concreteExample: "Bayangkan sebuah timbangan gantung. Di piring kiri ada sebuah kantong misterius (x) dan 3 koin batu (+3). Di piring kanan ada 8 koin batu. Timbangan dalam keadaan seimbang. Untuk mengetahui isi kantong misterius (x), kamu harus membuang 3 koin batu dari piring kiri. Agar timbangan tetap seimbang, kamu juga harus membuang 3 koin batu dari piring kanan. Maka, x = 8 - 3 = 5.",
    thinkingPrompts: [
      "Mengapa memindahkan penjumlahan melintasi tanda '=' berubah menjadi pengurangan? Apa hubungannya dengan menjaga keseimbangan timbangan?",
      "Jika persamaannya adalah 2x = 10, operasi kebalikan apa yang harus kamu gunakan untuk mencari nilai x?"
    ],
    visualizationRoute: "/student/visualizations/algebra",
    drillRoute: "/student/drill/plsv"
  }
];

export function getBridgeContent(topicId: string, misconceptionCode: string): BridgeContent | null {
  const match = bridgeContents.find(
    c => c.topicId === topicId && c.misconceptionCode === misconceptionCode
  );
  return match || null;
}
