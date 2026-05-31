export interface VisualizationItem {
  id: string;
  categoryId: string;
  title: string;
  materialTopic: string;
  strengthens: string;
  description: string;
  href: string;
}

export const integerVisualizations: VisualizationItem[] = [
  {
    id: "int-zero-pair",
    categoryId: "integer",
    title: "Es–Api / Zero-Pair",
    materialTopic: "Memahami bilangan bulat",
    strengthens: "+1, -1, pasangan nol, netralisasi, penjumlahan, dan pengurangan sebagai menambahkan lawannya melalui manipulatif Es–Api.",
    description: "Gunakan token positif (Api) dan negatif (Es) untuk memahami netralisasi dan operasi dasar, termasuk konsep pengurangan sebagai menambahkan lawan.",
    href: "/student/visualizations/integer/zero-pair"
  },
  {
    id: "int-number-line",
    categoryId: "integer",
    title: "Garis Bilangan",
    materialTopic: "Arah gerak pada operasi",
    strengthens: "Arah gerak kanan-kiri, termasuk pengurangan yang diubah menjadi penjumlahan lawannya.",
    description: "Pahami penjumlahan dan pengurangan bilangan bulat dengan model pergerakan di sepanjang garis bilangan.",
    href: "/student/visualizations/integer/number-line"
  }
];

export const fractionVisualizations: VisualizationItem[] = [
  {
    id: "frac-area-model",
    categoryId: "fractions",
    title: "Fraction Area Model",
    materialTopic: "Makna pecahan",
    strengthens: "Pembilang, penyebut, bagian dari keseluruhan",
    description: "Representasi area/bar model untuk memahami bagian dari keseluruhan.",
    href: "/student/visualizations/fractions/area-model"
  },
  {
    id: "frac-split-merge",
    categoryId: "fractions",
    title: "Pecahan Senilai: Split & Merge",
    materialTopic: "Pecahan senilai",
    strengthens: "Bentuk berbeda, nilai tetap sama",
    description: "Pecah atau gabungkan bagian untuk menemukan pecahan senilai.",
    href: "/student/visualizations/fractions/split-merge"
  },
  {
    id: "frac-simplify",
    categoryId: "fractions",
    title: "Mesin Menyederhanakan Pecahan",
    materialTopic: "Menyederhanakan pecahan",
    strengthens: "Pembagian pembilang dan penyebut oleh faktor yang sama",
    description: "Gunakan mesin ini untuk membagi pembilang dan penyebut secara adil.",
    href: "/student/visualizations/fractions/simplify"
  },
  {
    id: "frac-compare",
    categoryId: "fractions",
    title: "Pembanding & Pengurut Pecahan",
    materialTopic: "Membandingkan dan mengurutkan pecahan",
    strengthens: "Mencari penyebut persekutuan, letak di garis bilangan",
    description: "Bandingkan dua pecahan mana yang lebih besar.",
    href: "/student/visualizations/fractions/compare"
  },
  {
    id: "frac-add-same",
    categoryId: "fractions",
    title: "Operasi Pecahan Penyebut Sama",
    materialTopic: "Tambah/kurang penyebut sama",
    strengthens: "Hanya pembilang yang dioperasikan",
    description: "Pahami mengapa penyebut tidak ikut dijumlahkan.",
    href: "/student/visualizations/fractions/add-same"
  },
  {
    id: "frac-add-diff",
    categoryId: "fractions",
    title: "Operasi Pecahan Penyebut Beda",
    materialTopic: "Tambah/kurang penyebut beda",
    strengthens: "Penyamaan penyebut sebelum dijumlahkan",
    description: "Ubah bentuk sebelum melakukan operasi.",
    href: "/student/visualizations/fractions/add-diff"
  }
];

export const percentVisualizations: VisualizationItem[] = [
  {
    id: "perc-grid-100",
    categoryId: "percent",
    title: "Grid 100 Persen",
    materialTopic: "Persen sebagai per seratus",
    strengthens: "x% = x/100",
    description: "Representasi grid 10x10 untuk memvisualisasikan persen.",
    href: "/student/visualizations/percent/grid-100"
  },
  {
    id: "perc-fraction-converter",
    categoryId: "percent",
    title: "Konverter Pecahan ke Persen",
    materialTopic: "Pecahan ke persen",
    strengthens: "Ubah penyebut ke 100",
    description: "Transformasi dari pecahan menjadi bentuk per 100 lalu menjadi persen.",
    href: "/student/visualizations/percent/converter"
  }
];

export const algebraVisualizations: VisualizationItem[] = [
  {
    id: "alg-term-cards",
    categoryId: "algebra",
    title: "Kartu Suku Aljabar",
    materialTopic: "Bagian bentuk aljabar",
    strengthens: "Suku, variabel, koefisien, konstanta",
    description: "Identifikasi setiap bagian dari suatu bentuk aljabar.",
    href: "/student/visualizations/algebra/term-cards"
  },
  {
    id: "alg-term-sign",
    categoryId: "algebra",
    title: "Tanda Milik Suku",
    materialTopic: "Tanda pada suku",
    strengthens: "Tanda positif/negatif ikut menjadi bagian suku",
    description: "Visualisasikan bagaimana tanda menempel pada suku.",
    href: "/student/visualizations/algebra/term-sign"
  },
  {
    id: "alg-term-sorter",
    categoryId: "algebra",
    title: "Sorter Suku Sejenis",
    materialTopic: "Suku sejenis",
    strengthens: "Variabel dan pangkat harus sama",
    description: "Pisahkan suku-suku mana yang sejenis dan tidak.",
    href: "/student/visualizations/algebra/term-sorter"
  },
  {
    id: "alg-term-grouper",
    categoryId: "algebra",
    title: "Pengelompokan Suku Sejenis",
    materialTopic: "Mengelompokkan suku",
    strengthens: "Mempersiapkan operasi bentuk aljabar",
    description: "Kelompokkan suku-suku sebelum dioperasikan.",
    href: "/student/visualizations/algebra/term-grouper"
  },
  {
    id: "alg-term-machine",
    categoryId: "algebra",
    title: "Mesin Operasi Suku Sejenis",
    materialTopic: "Penjumlahan/pengurangan suku sejenis",
    strengthens: "Hanya koefisien yang berubah, variabel tetap",
    description: "Operasikan suku-suku yang sejenis.",
    href: "/student/visualizations/algebra/term-machine"
  },
  {
    id: "alg-bracket-machine",
    categoryId: "algebra",
    title: "Mesin Membuka Kurung",
    materialTopic: "Membuka kurung",
    strengthens: "Pengaruh tanda dan distribusi sederhana",
    description: "Distribusikan tanda dan pengali ke dalam kurung.",
    href: "/student/visualizations/algebra/bracket-machine"
  },
  {
    id: "alg-substitution",
    categoryId: "algebra",
    title: "Substitution Machine",
    materialTopic: "Substitusi nilai",
    strengthens: "Mengganti variabel dengan angka secara hati-hati",
    description: "Ganti variabel dengan sebuah angka konkrit.",
    href: "/student/visualizations/algebra/substitution"
  },
  {
    id: "alg-sentence-builder",
    categoryId: "algebra",
    title: "Kalimat ke Bentuk Aljabar Builder",
    materialTopic: "Terjemahan bahasa ke bentuk aljabar",
    strengthens: "“Jumlah”, “selisih”, “dua kali”, “lebih dari”, “kurang dari”",
    description: "Terjemahkan kalimat sehari-hari ke dalam bahasa matematika.",
    href: "/student/visualizations/algebra/sentence-builder"
  }
];
