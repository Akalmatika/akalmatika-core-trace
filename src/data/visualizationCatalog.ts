import { VisualizationItem } from "../types/visualization";

export const integerVisualizations: VisualizationItem[] = [
  {
    id: "int-zero-pair",
    categoryId: "integer",
    title: "Es–Api / Zero-Pair",
    materialTopic: "Memahami bilangan bulat",
    description: "Gunakan token positif (Api) dan negatif (Es) untuk memahami netralisasi dan operasi dasar, termasuk konsep pengurangan sebagai menambahkan lawan.",
    strengthens: "+1, -1, pasangan nol, netralisasi, penjumlahan, dan pengurangan sebagai menambahkan lawannya.",
    misconceptionTarget: "Pengurangan bilangan negatif sering membingungkan jika tidak dipahami sebagai penambahan lawan.",
    representation: "Manipulatif Koin (Es-Api)",
    modes: ["Netralisasi", "Tambah", "Kurang"],
    href: "/student/visualizations/integer/zero-pair",
    status: "ready"
  },
  {
    id: "int-number-line",
    categoryId: "integer",
    title: "Garis Bilangan",
    materialTopic: "Arah gerak pada operasi",
    description: "Pahami penjumlahan dan pengurangan bilangan bulat dengan model pergerakan di sepanjang garis bilangan.",
    strengthens: "Arah gerak kanan-kiri, termasuk pengurangan yang diubah menjadi penjumlahan lawannya.",
    misconceptionTarget: "Kebingungan menentukan arah bergerak pada garis bilangan untuk nilai negatif.",
    representation: "Garis Bilangan Vektor",
    modes: ["Gerak Positif", "Gerak Negatif"],
    href: "/student/visualizations/integer/number-line",
    status: "ready"
  }
];

export const fractionVisualizations: VisualizationItem[] = [
  {
    id: "frac-area-model",
    categoryId: "fractions",
    title: "Fraction Area Model",
    materialTopic: "Makna pecahan",
    description: "Bangun pecahan dari satu keseluruhan yang dibagi menjadi bagian sama besar.",
    strengthens: "Pembilang, penyebut, bagian dari keseluruhan, syarat bagian harus sama besar.",
    misconceptionTarget: "Siswa belum paham penyebut sebagai jumlah bagian sama besar, belum paham pembilang sebagai bagian yang diambil, membaca potongan tidak sama besar sebagai pecahan biasa.",
    representation: "Area model / bar model.",
    modes: ["Bagi keseluruhan", "Arsir bagian", "Baca pecahan", "Cek pembilang dan penyebut"],
    href: "/student/visualizations/fractions/area-model",
    status: "ready"
  },
  {
    id: "frac-equivalent",
    categoryId: "fractions",
    title: "Pecahan Senilai: Split & Merge",
    materialTopic: "Pecahan senilai",
    description: "Lihat bagaimana bentuk pecahan bisa berubah, tetapi nilainya tetap sama.",
    strengthens: "1/2 = 2/4 = 4/8, bentuk berbeda tetapi nilai sama, mengalikan pembilang dan penyebut dengan bilangan yang sama.",
    misconceptionTarget: "Siswa mengira angka berbeda pasti nilai berbeda, belum paham mengapa pembilang dan penyebut harus dikali bilangan yang sama, melihat pecahan hanya sebagai angka.",
    representation: "Area model transformasional.",
    modes: ["Split bagian", "Merge bagian", "Bandingkan nilai", "Tampilkan bentuk senilai"],
    href: "/student/visualizations/fractions/equivalent-fractions",
    status: "ready"
  },
  {
    id: "frac-simplify",
    categoryId: "fractions",
    title: "Mesin Menyederhanakan Pecahan",
    materialTopic: "Menyederhanakan pecahan",
    description: "Ubah pecahan menjadi bentuk lebih sederhana tanpa mengubah nilainya.",
    strengthens: "Membagi pembilang dan penyebut dengan faktor yang sama, bentuk sederhana, nilai tetap.",
    misconceptionTarget: "Siswa mengurangi pembilang dan penyebut sembarangan, membagi hanya pembilang atau hanya penyebut, belum paham menyederhanakan tidak mengubah nilai.",
    representation: "Transformasi simbolik + area model.",
    modes: ["Cari faktor sama", "Bagi pembilang dan penyebut", "Cek nilai tetap", "Bandingkan sebelum dan sesudah"],
    href: "/student/visualizations/fractions/simplify",
    status: "ready"
  },
  {
    id: "frac-compare",
    categoryId: "fractions",
    title: "Pembanding & Pengurut Pecahan",
    materialTopic: "Membandingkan dan mengurutkan pecahan",
    description: "Bandingkan pecahan melalui ukuran potongan dan bentuk senilai.",
    strengthens: "Penyebut sama, pembilang sama, penyebut berbeda, urutan nilai pecahan.",
    misconceptionTarget: "Siswa mengira penyebut lebih besar berarti pecahan lebih besar, bingung saat pembilang sama atau penyebut berbeda, membandingkan angka tanpa memahami ukuran bagian.",
    representation: "Bar model / area model.",
    modes: ["Bandingkan penyebut sama", "Bandingkan pembilang sama", "Bandingkan penyebut berbeda", "Urutkan pecahan"],
    href: "/student/visualizations/fractions/compare-order",
    status: "ready"
  },
  {
    id: "frac-add-same",
    categoryId: "fractions",
    title: "Operasi Pecahan Penyebut Sama",
    materialTopic: "Penjumlahan dan pengurangan pecahan penyebut sama",
    description: "Lihat mengapa pembilang dijumlahkan atau dikurangkan, sementara penyebut tetap.",
    strengthens: "Penyebut sebagai ukuran bagian, pembilang sebagai jumlah bagian, operasi pada pembilang, penyebut tetap.",
    misconceptionTarget: "Siswa menjumlahkan penyebut, menjawab 2/7 + 3/7 = 5/14, belum paham ukuran potongan tidak berubah.",
    representation: "Bar model + simbolik.",
    modes: ["Tambah penyebut sama", "Kurang penyebut sama", "Hasil nol", "Sederhanakan jika perlu"],
    href: "/student/visualizations/fractions/same-denominator",
    status: "ready"
  },
  {
    id: "frac-add-diff",
    categoryId: "fractions",
    title: "Operasi Pecahan Penyebut Beda",
    materialTopic: "Penjumlahan dan pengurangan pecahan penyebut beda",
    description: "Samakan ukuran potongan terlebih dahulu sebelum menjumlahkan atau mengurangkan.",
    strengthens: "Penyebut beda berarti ukuran bagian belum sama, pecahan senilai, penyebut sama sebelum operasi, alasan di balik KPK.",
    misconceptionTarget: "Siswa langsung menjumlahkan pembilang dan penyebut, menjawab 1/2 + 1/4 = 2/6, menghafal KPK tanpa melihat makna.",
    representation: "Transformasi pecahan senilai + bar model.",
    modes: ["Samakan penyebut", "Tambah setelah setara", "Kurang setelah setara", "Bandingkan sebelum dan sesudah"],
    href: "/student/visualizations/fractions/different-denominator",
    status: "ready"
  }
];

export const percentVisualizations: VisualizationItem[] = [
  {
    id: "perc-grid-100",
    categoryId: "percent",
    title: "Grid 100 Persen",
    materialTopic: "Persen sebagai per seratus",
    description: "Gunakan grid 10x10 untuk melihat bahwa x% berarti x dari 100.",
    strengthens: "x% = x/100, persen sebagai per seratus, hubungan persen dengan bagian dari keseluruhan.",
    misconceptionTarget: "Siswa belum paham makna persen, mengira 100% berarti 1%, tidak mengaitkan persen dengan pecahan berpenyebut 100.",
    representation: "Grid 10x10.",
    modes: ["Arsir persen", "Baca sebagai x/100", "Baca sebagai x%", "Bandingkan 25%, 50%, 75%, 100%"],
    href: "/student/visualizations/percent/grid-100",
    status: "ready"
  },
  {
    id: "perc-fraction-to-percent",
    categoryId: "percent",
    title: "Konverter Pecahan ke Persen",
    materialTopic: "Pecahan ke persen",
    description: "Ubah pecahan menjadi bentuk per seratus, lalu baca sebagai persen.",
    strengthens: "Pecahan senilai menuju penyebut 100, pembilang dan penyebut dikali bilangan yang sama, hubungan pecahan dan persen.",
    misconceptionTarget: "Siswa mengubah pecahan ke persen tanpa menjaga nilai, lupa pembilang dan penyebut harus dikali sama, tidak paham 1/2 = 50%.",
    representation: "Transformasi pecahan → /100 → persen.",
    modes: ["Ubah penyebut ke 100", "Baca persen", "Bandingkan pecahan & persen", "Quick presets"],
    href: "/student/visualizations/percent/fraction-to-percent",
    status: "ready"
  }
];

export const algebraVisualizations: VisualizationItem[] = [
  {
    id: "alg-term-cards",
    categoryId: "algebra",
    title: "Kartu Suku Aljabar",
    materialTopic: "Bagian-bagian bentuk aljabar",
    description: "Pecah bentuk aljabar menjadi suku, variabel, koefisien, dan konstanta.",
    strengthens: "Suku, variabel, koefisien, konstanta.",
    misconceptionTarget: "Siswa tidak bisa membedakan suku, variabel, koefisien, konstanta, menganggap angka di depan variabel sebagai konstanta.",
    representation: "Kartu/label visual.",
    modes: ["Tandai suku", "Tandai variabel", "Tandai koefisien", "Tandai konstanta"],
    href: "/student/visualizations/algebra/term-cards",
    status: "development"
  },
  {
    id: "alg-term-sign",
    categoryId: "algebra",
    title: "Tanda Milik Suku",
    materialTopic: "Tanda pada suku",
    description: "Lihat bahwa tanda positif atau negatif ikut menjadi bagian dari suku.",
    strengthens: "Tanda melekat pada suku, -3y adalah satu suku, +2b boleh ditulis 2b.",
    misconceptionTarget: "Siswa membawa 3y tetapi meninggalkan tanda minus pada -3y, salah saat mengelompokkan suku karena tanda tidak ikut.",
    representation: "Chip/kartu bertanda.",
    modes: ["Pisahkan suku", "Bawa tanda", "Cek tanda positif implisit", "Kelompokkan dengan tanda"],
    href: "/student/visualizations/algebra/sign-belongs-to-term",
    status: "development"
  },
  {
    id: "alg-like-term-sorter",
    categoryId: "algebra",
    title: "Sorter Suku Sejenis",
    materialTopic: "Suku sejenis",
    description: "Kelompokkan suku berdasarkan variabel dan pangkat yang sama.",
    strengthens: "Variabel harus sama, pangkat harus sama, koefisien boleh berbeda, ab dan ba sejenis.",
    misconceptionTarget: "Siswa menggabungkan x dan x², atau variabel berbeda, tidak paham pangkat menentukan jenis suku.",
    representation: "Sorting bins.",
    modes: ["Sortir suku x", "Sortir suku x²", "Sortir konstanta", "Sortir campuran", "Cek tidak sejenis"],
    href: "/student/visualizations/algebra/like-term-sorter",
    status: "development"
  },
  {
    id: "alg-group-like-terms",
    categoryId: "algebra",
    title: "Pengelompokan Suku Sejenis",
    materialTopic: "Mengelompokkan suku sebelum operasi",
    description: "Lihat suku yang sejenis dipasangkan sebelum dijumlahkan atau dikurangkan.",
    strengthens: "Suku x berkumpul dengan suku x, konstanta dengan konstanta, tanda tetap ikut.",
    misconceptionTarget: "Siswa langsung menggabungkan semua suku, tidak membawa tanda saat mengelompokkan.",
    representation: "Grouping bins + highlight pairing.",
    modes: ["Kelompok x", "Kelompok konstanta", "Kelompok multi variabel", "Cek tanda"],
    href: "/student/visualizations/algebra/group-like-terms",
    status: "development"
  },
  {
    id: "alg-like-term-operations",
    categoryId: "algebra",
    title: "Mesin Operasi Suku Sejenis",
    materialTopic: "Penjumlahan dan pengurangan suku sejenis",
    description: "Operasikan koefisiennya saja, variabel tetap.",
    strengthens: "Koefisien yang berubah, variabel tetap, suku x sendirian berarti 1x, hasil nol jika koefisien saling habis.",
    misconceptionTarget: "Siswa menjawab 4x + 3x = 7x², mengubah variabel saat menjumlahkan, salah menangani koefisien negatif.",
    representation: "Langkah simbolik + grouping visual.",
    modes: ["Tambah koefisien positif", "Tambah koefisien negatif", "Pengurangan", "Hasil nol", "Suku tunggal"],
    href: "/student/visualizations/algebra/like-term-operations",
    status: "development"
  },
  {
    id: "alg-expand-brackets",
    categoryId: "algebra",
    title: "Mesin Membuka Kurung",
    materialTopic: "Membuka kurung",
    description: "Lihat bagaimana tanda di depan kurung memengaruhi semua isi kurung.",
    strengthens: "Distribusi sederhana, tanda positif dan negatif di depan kurung, semua isi terdampak.",
    misconceptionTarget: "Siswa hanya mengubah suku pertama, salah saat tanda negatif di depan kurung, menghafal tanpa melihat perubahan.",
    representation: "Distribusi visual.",
    modes: ["Kurung positif", "Kurung negatif", "Dua blok kurung", "Cek tanda tiap suku"],
    href: "/student/visualizations/algebra/expand-brackets",
    status: "development"
  },
  {
    id: "alg-substitution",
    categoryId: "algebra",
    title: "Substitution Machine",
    materialTopic: "Substitusi nilai",
    description: "Ganti variabel dengan angka dan hitung langkah demi langkah.",
    strengthens: "Variabel diganti oleh nilai, nilai negatif perlu tanda kurung, urutan operasi tetap berlaku.",
    misconceptionTarget: "Siswa asal mengganti variabel tanpa tanda kurung, salah saat nilai substitusi negatif, salah urutan operasi.",
    representation: "Slot input → ekspresi → hasil.",
    modes: ["Substitusi positif", "Substitusi negatif", "Operasi campuran", "Dua variabel"],
    href: "/student/visualizations/algebra/substitution-machine",
    status: "development"
  },
  {
    id: "alg-word-to-expression",
    categoryId: "algebra",
    title: "Kalimat ke Bentuk Aljabar Builder",
    materialTopic: "Menerjemahkan bahasa ke bentuk aljabar",
    description: "Susun blok kata menjadi bentuk aljabar.",
    strengthens: "Jumlah, selisih, dua kali, lebih dari, kurang dari, relasi bahasa dan simbol.",
    misconceptionTarget: "Salah menerjemahkan lebih dari/kurang dari, membalik urutan selisih, tidak tahu kata operasi.",
    representation: "Word blocks → symbolic expression.",
    modes: ["Jumlah", "Selisih", "Dua kali", "Lebih dari", "Kurang dari", "Campuran"],
    href: "/student/visualizations/algebra/word-to-expression",
    status: "development"
  }
];

export const allVisualizations: VisualizationItem[] = [
  ...integerVisualizations,
  ...fractionVisualizations,
  ...percentVisualizations,
  ...algebraVisualizations
];
