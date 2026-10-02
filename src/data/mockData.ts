import { AspirasiPublik, KemitraanCSR, RisetAkademisi, InisiatifOMS, BabRPJMD, KonsultasiAgenda, UserAccount, KonfirmasiKehadiranSidang, UnitKerjaOPD, MisiRPJMDItem } from '../types';

export const KECAMATAN_TANGGAMUS = [
  'Kecamatan Kota Agung',
  'Kecamatan Kota Agung Barat',
  'Kecamatan Kota Agung Timur',
  'Kecamatan Talang Padang',
  'Kecamatan Gisting',
  'Kecamatan Pulau Panggung',
  'Kecamatan Air Naningan',
  'Kecamatan Ulu Belu',
  'Kecamatan Sumberejo',
  'Kecamatan Pugung',
  'Kecamatan Gunung Alip',
  'Kecamatan Wonosobo',
  'Kecamatan Semaka',
  'Kecamatan Bandar Negeri Semuong',
  'Kecamatan Pematang Sawa',
  'Kecamatan Cukuh Balak',
  'Kecamatan Kelumbayan',
  'Kecamatan Kelumbayan Barat',
  'Kecamatan Limau',
  'Kecamatan Bulok',
  'Lintas Wilayah / Seluruh Daerah Tanggamus'
] as const;

export type KecamatanTanggamus = typeof KECAMATAN_TANGGAMUS[number];

export const PEKON_TANGGAMUS_MAP: Record<string, string[]> = {
  'Kecamatan Kota Agung': [
    'Kelurahan Kuripan', 'Kelurahan Pasar Madang', 'Kelurahan Baros', 'Kelurahan Kuta Dalom',
    'Pekon Terbaya', 'Pekon Teratas', 'Pekon Kota Agung', 'Pekon Campang Tiga',
    'Pekon Kelapa Nur', 'Pekon Kota Batu', 'Pekon Penanggungan', 'Pekon Benteng Jaya',
    'Pekon Terdana', 'Pekon Kandang Besi', 'Pekon Kedamaian', 'Pekon Pardasuka'
  ],
  'Kecamatan Kota Agung Barat': [
    'Pekon Payung', 'Pekon Kanyangan', 'Pekon Belu', 'Pekon Kalimiring',
    'Pekon Rajabasa', 'Pekon Negara Batin', 'Pekon Maja', 'Pekon Taba',
    'Pekon Sedayu', 'Pekon Kesugihan', 'Pekon Gedung Jambu'
  ],
  'Kecamatan Kota Agung Timur': [
    'Pekon Umbul Buah', 'Pekon Menggala', 'Pekon Sukabanjar', 'Pekon Teba',
    'Pekon Kagungan', 'Pekon Tanjung Anom', 'Pekon Batu Keramat', 'Pekon Kampung Baru',
    'Pekon Talang Rejo', 'Pekon Teba Lumbu', 'Pekon Karta'
  ],
  'Kecamatan Talang Padang': [
    'Pekon Talang Padang', 'Pekon Sukarame', 'Pekon Kalibening', 'Pekon Banding Agung',
    'Pekon Sinar Banten', 'Pekon Sinar Betung', 'Pekon Kejayan', 'Pekon Sinar Semendo',
    'Pekon Sukamaju', 'Pekon Way Halom', 'Pekon Singosari'
  ],
  'Kecamatan Gisting': [
    'Pekon Gisting Bawah', 'Pekon Gisting Atas', 'Pekon Landbaw', 'Pekon Campang',
    'Pekon Purwodadi', 'Pekon Sidokaton', 'Pekon Banjarmanis', 'Pekon Kuta Dalom',
    'Pekon Simpang Kanan'
  ],
  'Kecamatan Pulau Panggung': [
    'Pekon Pulau Panggung', 'Pekon Muara Dua', 'Pekon Tekad', 'Pekon Gunung Megang',
    'Pekon Way Jaha', 'Pekon Tanjung Begelung', 'Pekon Penantian', 'Pekon Gedung Cahya',
    'Pekon Batu Tegi', 'Pekon Sinar Mulyo'
  ],
  'Kecamatan Air Naningan': [
    'Pekon Air Naningan', 'Pekon Datar Lebuay', 'Pekon Karang Anyar', 'Pekon Way Harong',
    'Pekon Sinar Jawa', 'Pekon Air Kubang', 'Pekon Margomulyo', 'Pekon Batutegi Air Naningan'
  ],
  'Kecamatan Ulu Belu': [
    'Pekon Ngarip', 'Pekon Gunung Tiga', 'Pekon Air Abang', 'Pekon Pagar Alam',
    'Pekon Karang Rejo', 'Pekon Muara Dua Ulu Belu', 'Pekon Sirna Galih', 'Pekon Petai Kayu',
    'Pekon Datarajan'
  ],
  'Kecamatan Sumberejo': [
    'Pekon Sumberejo', 'Pekon Margodadi', 'Pekon Argopeni', 'Pekon Wonoharjo',
    'Pekon Dadapan', 'Pekon Tegal Binangun', 'Pekon Sidomulyo', 'Pekon Margoyoso'
  ],
  'Kecamatan Pugung': [
    'Pekon Rantau Tijang', 'Pekon Sukamaju', 'Pekon Tangkit Serdang', 'Pekon Babakan',
    'Pekon Tiuh Memon', 'Pekon Gunung Tiga', 'Pekon Way Jaha', 'Pekon Banjar Agung Udik'
  ],
  'Kecamatan Gunung Alip': [
    'Pekon Banjar Negeri', 'Pekon Suka Banjar', 'Pekon Pariaman', 'Pekon Kedaloman',
    'Pekon Sukamernah', 'Pekon Penanggungan', 'Pekon Darussalam'
  ],
  'Kecamatan Wonosobo': [
    'Pekon Sinar Rejeki', 'Pekon Padang Ratu', 'Pekon Balak', 'Pekon Soponyono',
    'Pekon Dadirejo', 'Pekon Kalisari', 'Pekon Karang Anyar', 'Pekon Bandar Kejadian'
  ],
  'Kecamatan Semaka': [
    'Pekon Sukaraja', 'Pekon Kanoman', 'Pekon Tugupapak', 'Pekon Sri Purnomo',
    'Pekon Bangun Rejo', 'Pekon Pardawaras', 'Pekon Margomulyo', 'Pekon Sedayu'
  ],
  'Kecamatan Bandar Negeri Semuong': [
    'Pekon Sanggi', 'Pekon Bandar Sukabumi', 'Pekon Negeri Ngarip', 'Pekon Simpang Kanan',
    'Pekon Atar Lebar', 'Pekon Gunung Dohar'
  ],
  'Kecamatan Pematang Sawa': [
    'Pekon Way Asahan', 'Pekon Betung', 'Pekon Teluk Brak', 'Pekon Kaur Gading',
    'Pekon Karang Brak', 'Pekon Pesanggrahan', 'Pekon Tampang Muda', 'Pekon Tirom'
  ],
  'Kecamatan Cukuh Balak': [
    'Pekon Putih Doh', 'Pekon Sukamaju', 'Pekon Kubulangka', 'Pekon Tanjung Betuah',
    'Pekon Pekondoh', 'Pekon Banjar Manis', 'Pekon Gedung Sukarame'
  ],
  'Kecamatan Kelumbayan': [
    'Pekon Kiluan Negeri', 'Pekon Paku', 'Pekon Penyandingan', 'Pekon Umbar',
    'Pekon Negeri', 'Pekon Napal'
  ],
  'Kecamatan Kelumbayan Barat': [
    'Pekon Batu Patah', 'Pekon Lengkukai', 'Pekon Merbau', 'Pekon Sidoharjo'
  ],
  'Kecamatan Limau': [
    'Pekon Kuripan', 'Pekon Badak', 'Pekon Antar Brak', 'Pekon Tegineneng',
    'Pekon Pariaman', 'Pekon Padang Ratu'
  ],
  'Kecamatan Bulok': [
    'Pekon Sukamaju', 'Pekon Pematang Nebak', 'Pekon Napal', 'Pekon Sinar Petir',
    'Pekon Banjar Masin'
  ],
  'Lintas Wilayah / Seluruh Daerah Tanggamus': [
    'Seluruh Pekon se-Kabupaten Tanggamus', 'Kawasan Agropolitan Ulu Belu & Gisting',
    'Kawasan Pesisir Teluk Semaka', 'Kawasan Hutan Lindung & Hulu DAS Sekampung'
  ]
};

export const INITIAL_MISI_RPJMD: MisiRPJMDItem[] = [
  {
    id: 'sdm_kesehatan',
    nomor: 'Misi 1',
    judul: 'Peningkatan Kualitas SDM & Kesehatan Universal',
    fokus: 'Pendidikan inklusif, penurunan stunting terintegrasi, jaminan kesehatan semesta (UHC), dan link-and-match vokasi kerja.',
    sasaranPokok: [
      'Peningkatan Indeks Pembangunan Manusia (IPM) dan akses pendidikan berkualitas',
      'Penurunan angka prevalensi stunting hingga di bawah 10%',
      'Cakupan kepesertaan JKN/BPJS Universal Health Coverage (UHC) 100%'
    ],
    indikatorKinerjaUtama: [
      'Indeks Pembangunan Manusia (IPM)',
      'Angka Harapan Hidup (AHH)',
      'Rata-rata Lama Sekolah (RLS)'
    ],
    opdPengampuUtama: 'Dinas Pendidikan & Kebudayaan, Dinas Kesehatan, Bapperida',
    warnaTema: 'blue',
    urutan: 1,
    statusAktif: true
  },
  {
    id: 'ekonomi_umkm',
    nomor: 'Misi 2',
    judul: 'Transformasi Ekonomi Kerakyatan & Hilirisasi UMKM',
    fokus: 'Pemberdayaan klaster UMKM digital, akses permodalan tanpa agunan, ekonomi kreatif, dan revitalisasi pasar tradisional.',
    sasaranPokok: [
      'Penguatan daya saing produk perkebunan kopi robusta, lada hitam & perikanan tangkap',
      'Digitalisasi dan fasilitasi legalitas izin NIB serta sertifikasi halal gratis bagi pelaku mikro',
      'Revitalisasi sarana pasar pekon dan penguatan kelembagaan koperasi produsen'
    ],
    indikatorKinerjaUtama: [
      'Laju Pertumbuhan Ekonomi Daerah',
      'Tingkat Pengangguran Terbuka (TPT)',
      'Kontribusi PDRB Sektor Pertanian & UMKM'
    ],
    opdPengampuUtama: 'Diskoperindag, Dinas Pertanian & Ketahanan Pangan, Dinas Perikanan',
    warnaTema: 'amber',
    urutan: 2,
    statusAktif: true
  },
  {
    id: 'infrastruktur_hijau',
    nomor: 'Misi 3',
    judul: 'Infrastruktur Berkelanjutan & Ketahanan Lingkungan',
    fokus: 'Konektivitas jalan mantap antardesa, mitigasi bencana hidrometeorologi, pengelolaan sampah sirkular, dan transisi energi bersih.',
    sasaranPokok: [
      'Peningkatan kemantapan jalan lingkar pekon dan akses sentra produksi agropolitan',
      'Mitigasi banjir pesisir Semaka dan pencegahan longsor lereng Gunung Tanggamus',
      'Penyediaan sanitasi komunal dan perluasan jaringan SPAM air minum perdesaan'
    ],
    indikatorKinerjaUtama: [
      'Persentase Kemantapan Jalan Kabupaten',
      'Indeks Kualitas Lingkungan Hidup (IKLH)',
      'Cakupan Akses Sanitasi & Air Minum Layak'
    ],
    opdPengampuUtama: 'Dinas PUPR, Dinas Lingkungan Hidup, BPBD Tanggamus',
    warnaTema: 'emerald',
    urutan: 3,
    statusAktif: true
  },
  {
    id: 'tata_kelola_digital',
    nomor: 'Misi 4',
    judul: 'Tata Kelola Pemerintahan Akuntabel & Digitalisasi',
    fokus: 'Keterbukaan informasi publik, satu data daerah terintegrasi, pencegahan korupsi, dan reformasi birokrasi berorientasi dampak.',
    sasaranPokok: [
      'Penyelenggaraan SPBE terpadu dan interoperabilitas Satu Data Tanggamus',
      'Penguatan akuntabilitas kinerja SAKIP bernilai A dan maturitas SPIP level 3',
      'Digitalisasi administrasi kependudukan dan perizinan terintegrasi jemput bola'
    ],
    indikatorKinerjaUtama: [
      'Indeks SPBE Kabupaten Tanggamus',
      'Nilai SAKIP & Reformasi Birokrasi (RB)',
      'Indeks Kepuasan Masyarakat (IKM)'
    ],
    opdPengampuUtama: 'Diskominfo, Inspektorat, Bagian Organisasi Setdakab, Bapperida',
    warnaTema: 'purple',
    urutan: 4,
    statusAktif: true
  },
  {
    id: 'sosial_budaya',
    nomor: 'Misi 5',
    judul: 'Ketahanan Sosial, Inklusi Rentan & Pelestarian Budaya',
    fokus: 'Perlindungan lansia dan penyandang disabilitas, perlindungan anak & perempuan, revitalisasi cagar budaya daerah, dan kohesi sosial.',
    sasaranPokok: [
      'Penanggulangan kemiskinan ekstrem melalui bansos adaptif dan jaring pengaman sosial',
      'Penyediaan fasilitas ramah disabilitas, ruang ramah anak, dan pencegahan kekerasan perempuan',
      'Pemajuan kebudayaan Lampung Saibatin, cagar megalitik Batu Bedil, dan kearifan lokal'
    ],
    indikatorKinerjaUtama: [
      'Tingkat Kemiskinan Makro',
      'Indeks Pembangunan Gender (IPG)',
      'Indeks Pembangunan Kebudayaan (IPK)'
    ],
    opdPengampuUtama: 'Dinas Sosial, Dinas PMD, Dinas Pariwisata & Kebudayaan',
    warnaTema: 'rose',
    urutan: 5,
    statusAktif: true
  }
];

export const MISI_LABELS: Record<string, { nomor: string; judul: string; fokus: string }> = {
  sdm_kesehatan: {
    nomor: 'Misi 1',
    judul: 'Peningkatan Kualitas SDM & Kesehatan Universal',
    fokus: 'Pendidikan inklusif, penurunan stunting terintegrasi, jaminan kesehatan semesta (UHC), dan link-and-match vokasi kerja.'
  },
  ekonomi_umkm: {
    nomor: 'Misi 2',
    judul: 'Transformasi Ekonomi Kerakyatan & Hilirisasi UMKM',
    fokus: 'Pemberdayaan klaster UMKM digital, akses permodalan tanpa agunan, ekonomi kreatif, dan revitalisasi pasar tradisional.'
  },
  infrastruktur_hijau: {
    nomor: 'Misi 3',
    judul: 'Infrastruktur Berkelanjutan & Ketahanan Lingkungan',
    fokus: 'Konektivitas jalan mantap antardesa, mitigasi bencana hidrometeorologi, pengelolaan sampah sirkular, dan transisi energi bersih.'
  },
  tata_kelola_digital: {
    nomor: 'Misi 4',
    judul: 'Tata Kelola Pemerintahan Akuntabel & Digitalisasi',
    fokus: 'Keterbukaan informasi publik, satu data daerah terintegrasi, pencegahan korupsi, dan reformasi birokrasi berorientasi dampak.'
  },
  sosial_budaya: {
    nomor: 'Misi 5',
    judul: 'Ketahanan Sosial, Inklusi Rentan & Pelestarian Budaya',
    fokus: 'Perlindungan lansia dan penyandang disabilitas, perlindungan anak & perempuan, revitalisasi cagar budaya daerah, dan kohesi sosial.'
  }
};

export const INITIAL_ASPIRASI: AspirasiPublik[] = [
  {
    id: 'ASP-2025-001',
    judul: 'Penyediaan Sentra Inkubasi Desain Kemasan & Sertifikasi Halal Gratis untuk UMKM Pangan',
    ringkasan: 'Usulan pembentukan hub pelatihan kemasan standar ekspor dan fasilitasi pembiayaan sertifikasi halal bagi 1.200 pelaku usaha mikro di 5 kecamatan binaan.',
    deskripsiLengkap: 'Kelemahan mendasar pelaku UMKM lokal kita saat ini berada pada kualitas packaging, higienitas standar BPOM, serta sertifikasi halal. Dalam dokumen rancangan RPJMD Misi 2, kami menyarankan agar tidak sekadar memberikan bantuan modal tunai, melainkan menyediakan sentra inkubasi kemasan bersama (packaging house) serta pendampingan langsung uji lab secara cuma-cuma.',
    pengusulNama: 'H. Sudarmanto, S.E.',
    pengusulInstitusi: 'Forum Komunikasi Pengusaha UMKM Berdaya',
    tipePemangku: 'swasta',
    misiId: 'ekonomi_umkm',
    kecamatan: 'Kecamatan Gisting',
    tanggalDiajukan: '24 Maret 2026',
    dukunganSuara: 342,
    status: 'masuk_rkpd',
    anggaranEstimasi: 'Rp 1,4 Miliar (Skema Kolaborasi APBD + TJSLP Perbankan)',
    bentukKolaborasiDitawarkan: 'Asosiasi bersedia memfasilitasi 20 kurator produk senior dan jaringan ritel modern lokal untuk menampung produk lulus inkubasi.',
    opdDitunjuk: 'Dinas Koperasi, Perindustrian dan Perdagangan',
    tanggalDisposisi: '25 Maret 2026',
    catatanOpd: 'Aspirasi dinilai sangat strategis dan selaras dengan Indikator Kinerja Utama (IKU) Peningkatan Rasio Wirausaha Mapan. Usulan telah diverifikasi dan dimasukkan ke dalam Renja-PD Tahun Anggaran 2027 melalui kegiatan Unit Layanan Kemasan Terpadu.',
    statusRekomendasiOpd: 'masuk_renja_pd',
    tanggalTanggapanOpd: '26 Maret 2026',
    pejabatPenelaahOpd: 'Dra. Endang Sulistyowati, M.M.',
    tanggapanOPD: [
      {
        id: 'TGP-01',
        opdNama: 'Dinas Koperasi, Perindustrian dan Perdagangan',
        pejabatNama: 'Dra. Endang Sulistyowati, M.M.',
        pejabatJabatan: 'Kepala Bidang Pemberdayaan UMKM',
        tanggal: '26 Maret 2026',
        isiTanggapan: 'Aspirasi dinilai sangat strategis dan selaras dengan Indikator Kinerja Utama (IKU) Peningkatan Rasio Wirausaha Mapan. Usulan telah diverifikasi dan dimasukkan ke dalam Rencana Kerja Pemerintah Daerah (RKPD) Tahun Anggaran 2027 melalui kegiatan Unit Layanan Kemasan Terpadu.',
        statusPenetapan: 'masuk_rkpd',
        rencanaAksiTahun: 2027
      }
    ],
    komentarPublik: [
      {
        id: 'KOM-01',
        nama: 'Ahmad Fauzi',
        institusi: 'Koperasi Produsen Keripik Tempe',
        tipe: 'masyarakat',
        tanggal: '25 Maret 2026',
        isi: 'Sangat kami dukung! Kemasan kami saat ini masih plastik tipis polos sehingga sulit masuk minimarket jejaring.'
      },
      {
        id: 'KOM-02',
        nama: 'Dr. Retno Wulandari',
        institusi: 'Pusat Studi Ekonomi Kerakyatan Kampus Merdeka',
        tipe: 'akademisi',
        tanggal: '26 Maret 2026',
        isi: 'Laboratorium Teknologi Pangan kami bersedia bermitra sebagai mitra penguji umur simpan dan kandungan gizi (nutrition facts).'
      }
    ]
  },
  {
    id: 'ASP-2025-002',
    judul: 'Audit Aksesibilitas Trotoar dan Halte Transportasi Publik bagi Penyandang Disabilitas Netra & Pengguna Kursi Roda',
    ringkasan: 'Mendesak RPJMD mengunci target 100% fasilitas publik protokol dan koridor transit terintegrasi guiding block standar internasional dan bidang miring aman.',
    deskripsiLengkap: 'Berdasarkan pemantauan lapangan sepanjang 2025, 68% guiding block di jalan protokol terputus oleh tiang listrik atau pohon, serta kemiringan ram kursi roda di gedung layanan publik melebihi standar aman 8 derajat. RPJMD wajib memuat indikator spesifik: Indeks Aksesibilitas Infrastruktur Ramah Disabilitas.',
    pengusulNama: 'Maya Trisna Dewi',
    pengusulInstitusi: 'Koalisi Warga Inklusi & Difabel Mandiri',
    tipePemangku: 'oms',
    misiId: 'sosial_budaya',
    kecamatan: 'Kecamatan Kota Agung',
    tanggalDiajukan: '22 Maret 2026',
    dukunganSuara: 489,
    status: 'ditelaah',
    anggaranEstimasi: 'Rp 3,2 Miliar per koridor prioritas',
    bentukKolaborasiDitawarkan: 'Tim relawan difabel siap dilibatkan dalam joint-audit bersama pengawas teknis Dinas PUPR sebelum serah terima proyek fisik.',
    opdDitunjuk: 'Dinas Pekerjaan Umum, Penataan Ruang & Kawasan Permukiman',
    tanggalDisposisi: '23 Maret 2026',
    catatanOpd: 'Berdasarkan telaah teknis lapangan, usulan perbaikan kemiringan ram dan guiding block difabel sangat krusial. Telah dimasukkan ke usulan Renja-PD PUPR 2027 bidang Bina Marga.',
    statusRekomendasiOpd: 'masuk_renja_pd',
    tanggalTanggapanOpd: '27 Maret 2026',
    pejabatPenelaahOpd: 'Ir. Bambang Triharto, M.T.',
    tanggapanOPD: [
      {
        id: 'TGP-02',
        opdNama: 'Bapperida & Dinas PUPRPKP',
        pejabatNama: 'Ir. Bambang Triharto, M.T.',
        pejabatJabatan: 'Kepala Bidang Infrastruktur & Kewilayahan',
        tanggal: '27 Maret 2026',
        isiTanggapan: 'Bapperida mengapresiasi audit partisipatif ini. Kami telah menerbitkan nota rekomendasi revisi Bab III RPJMD agar memasukkan "Kepatuhan Permen PUPR No 14/2017 tentang Bangunan Gedung Ramah Difabel" sebagai prasyarat pencairan DPA teknis.',
        statusPenetapan: 'ditelaah',
        rencanaAksiTahun: 2026
      }
    ],
    komentarPublik: [
      {
        id: 'KOM-03',
        nama: 'Surya Prasetya',
        tipe: 'masyarakat',
        tanggal: '23 Maret 2026',
        isi: 'Bukan hanya untuk difabel, lansia dan orang tua dengan stroller bayi juga sangat terbantu jika trotoar rata dan bebas hambatan.'
      }
    ]
  },
  {
    id: 'ASP-2025-003',
    judul: 'Rekomendasi Kebijakan Berbasis Geospasial: Zonasi Resapan Air & Pengendalian Banjir Sub-DAS Hulu',
    ringkasan: 'Naskah akademik pemodelan limpasan air hujan dan penetapan moratorium alih fungsi lahan lereng perbukitan di atas elevasi 800 mdpl.',
    deskripsiLengkap: 'Hasil kajian tim peneliti Fakultas Teknik Pengairan menunjukkan peningkatan laju sedimentasi sungai hingga 140% akibat alih fungsi kebun perbukitan menjadi kawasan vila/perumahan komersial. Naskah RPJMD harus memperkuat instrumen insentif-disinsentif tata ruang serta menetapkan sabuk hijau (green belt) konservasi seluas 450 hektar.',
    pengusulNama: 'Prof. Dr. Ir. Hariadi Suparno, M.Sc.',
    pengusulInstitusi: 'Lembaga Penelitian & Pengabdian Masyarakat (LPPM) Universitas Daerah',
    tipePemangku: 'akademisi',
    misiId: 'infrastruktur_hijau',
    kecamatan: 'Kecamatan Ulu Belu',
    tanggalDiajukan: '20 Maret 2026',
    dukunganSuara: 512,
    status: 'masuk_rkpd',
    anggaranEstimasi: 'Rp 4,8 Miliar (Kombinasi Pembebasan Kawasan Resapan & Reboisasi Bibir Tebing)',
    bentukKolaborasiDitawarkan: 'Penyediaan sistem early warning banjir berbasis sensor IoT dan pembaruan citra satelit resolusi tinggi secara berkala tanpa biaya lisensi.',
    opdDitunjuk: 'Badan Penanggulangan Bencana Daerah (BPBD)',
    tanggalDisposisi: '21 Maret 2026',
    catatanOpd: 'Rekomendasi data spasial telah disinkronkan ke dalam matriks KLHS RPJMD 2025-2029 dan menjadi acuan revisi RDTR koridor timur.',
    statusRekomendasiOpd: 'masuk_renja_pd',
    tanggalTanggapanOpd: '25 Maret 2026',
    pejabatPenelaahOpd: 'Drs. H. Mulyono, M.Si.',
    tanggapanOPD: [
      {
        id: 'TGP-03',
        opdNama: 'Badan Penanggulangan Bencana Daerah (BPBD) & Dinas Lingkungan Hidup',
        pejabatNama: 'Drs. H. Mulyono, M.Si.',
        pejabatJabatan: 'Kepala Pelaksana BPBD',
        tanggal: '25 Maret 2026',
        isiTanggapan: 'Rekomendasi data spasial telah disinkronkan ke dalam matriks KLHS (Kajian Lingkungan Hidup Strategis) RPJMD 2025-2029 dan menjadi acuan revisi RDTR koridor timur.',
        statusPenetapan: 'masuk_rkpd',
        rencanaAksiTahun: 2026
      }
    ],
    komentarPublik: [
      {
        id: 'KOM-04',
        nama: 'Wahyu Nugroho',
        institusi: 'Relawan Sungai Bersih',
        tipe: 'oms',
        tanggal: '21 Maret 2026',
        isi: 'Data riset ini sangat akurat dengan apa yang kami alami di bantaran sungai setiap musim penghujan.'
      }
    ]
  },
  {
    id: 'ASP-2025-004',
    judul: 'Perluasan Beasiswa Satu Keluarga Satu Sarjana bagi Warga Kurang Mampu di Kantong Kemiskinan Ekstrem',
    ringkasan: 'Usulan program afirmatif pembiayaan kuliah penuh dan uang saku untuk generasi muda dari keluarga desil 1 dan 2 agar mampu memutus rantai kemiskinan antargenerasi.',
    deskripsiLengkap: 'Banyak anak-anak berprestasi di wilayah kelurahan pelosok harus putus sekolah di tingkat SMA karena biaya kuliah yang tidak terjangkau. Kami masyarakat mengusulkan agar RPJMD mengalokasikan kuota minimal 250 mahasiswa per tahun dengan ikatan pengabdian 2 tahun di desa asal setelah lulus.',
    pengusulNama: 'Siti Aminah, S.Pd.',
    pengusulInstitusi: 'Pengurus Karang Taruna Pekon Terbangi',
    tipePemangku: 'masyarakat',
    misiId: 'sdm_kesehatan',
    kecamatan: 'Kecamatan Semaka',
    tanggalDiajukan: '18 Maret 2026',
    dukunganSuara: 620,
    status: 'ditelaah',
    anggaranEstimasi: 'Rp 6,5 Miliar / tahun',
    bentukKolaborasiDitawarkan: 'Komunitas warga siap membentuk posko bimbingan belajar dan pendaftaran SNBP/SNBT gratis di balai RT/RW.',
    opdDitunjuk: 'Dinas Pendidikan',
    tanggalDisposisi: '20 Maret 2026',
    tanggapanOPD: [],
    komentarPublik: [
      {
        id: 'KOM-05',
        nama: 'Prof. Hermanto',
        institusi: 'Dewan Pendidikan Daerah',
        tipe: 'akademisi',
        tanggal: '19 Maret 2026',
        isi: 'Skema pemutusan kemiskinan struktural paling terbukti di Asia Timur adalah pendidikan tinggi anak pertama. Kami siap mengawal formulasi regulasinya.'
      }
    ]
  },
  {
    id: 'ASP-2025-005',
    judul: 'Penyediaan Pembangkit Listrik Surya Atap (Solar Rooftop) dan Pengolahan Kompos di 14 Pasar Tradisional',
    ringkasan: 'Program sinergi konsorsium perbankan & asosiasi energi terbarukan untuk efisiensi beban listrik pedagang dan zero waste pasar.',
    deskripsiLengkap: 'Pasar tradisional menghasilkan rata-rata 3,8 ton sampah organik setiap hari dan membebani tagihan listrik operasional pedagang. Kami dari konsorsium swasta mengusulkan program kemitraan TJSLP instalasi solar rooftop berkapasitas 120 kWp dan biodigester mini untuk mengubah limbah sayur menjadi energi gas masak pedagang kaki lima.',
    pengusulNama: 'Ir. Hendra Gunawan',
    pengusulInstitusi: 'Kadin Bidang Energi Bersih & Investasi Berkelanjutan',
    tipePemangku: 'swasta',
    misiId: 'infrastruktur_hijau',
    kecamatan: 'Kecamatan Talang Padang',
    tanggalDiajukan: '15 Maret 2026',
    dukunganSuara: 288,
    status: 'sinergi_csr',
    anggaranEstimasi: 'Rp 2,8 Miliar (100% Didanai Konsorsium Swasta CSR)',
    bentukKolaborasiDitawarkan: 'Investasi perangkat dan instalasi ditanggung swasta; Pemkab cukup menyediakan izin atap aset pasar dan pendampingan paguyuban pedagang.',
    tanggapanOPD: [
      {
        id: 'TGP-05',
        opdNama: 'Dinas Lingkungan Hidup & Diskopindag',
        pejabatNama: 'Dra. Hj. Nurul Farida, M.Eng.',
        pejabatJabatan: 'Kepala Dinas Lingkungan Hidup',
        tanggal: '19 Maret 2026',
        isiTanggapan: 'Pemkab menyambut baik dan telah menyepakati penyusunan nota kesepahaman (MoU) Tripartit. Proyek percontohan ditetapkan di Pasar Talang Padang mulai Triwulan III 2026.',
        statusPenetapan: 'sinergi_csr',
        rencanaAksiTahun: 2026
      }
    ],
    komentarPublik: [
      {
        id: 'KOM-06',
        nama: 'Budi Santoso',
        institusi: 'Paguyuban Pedagang Pasar Talang Padang',
        tipe: 'masyarakat',
        tanggal: '16 Maret 2026',
        isi: 'Alhamdulillah, jika sampah sayur bisa langsung diolah di tempat, pasar tidak lagi bau busuk saat pembeli datang.'
      }
    ]
  },
  {
    id: 'ASP-2025-006',
    judul: 'Platform Satu Data Kemiskinan Terbuka dengan Fitur Sanggahan Warga Real-Time Berbasis NIK',
    ringkasan: 'Mencegah bantuan sosial salah sasaran dengan mekanisme transparansi digital yang dapat diawasi bersama oleh RT, RW, dan OMS.',
    deskripsiLengkap: 'Masalah klasik bantuan sosial di daerah adalah data DTKS yang lambat dimutakhirkan sehingga penerima yang sudah mampu masih tercatat, sementara yang baru jatuh miskin terlewatkan. RPJMD Misi 4 harus memprioritaskan integrasi Satu Data Sosial dengan tombol sanggahan mandiri dan verifikasi geospasial oleh musyawarah pekon terbuka.',
    pengusulNama: 'Doni Pratama, M.Sc.',
    pengusulInstitusi: 'Transparansi Inovasi Publik & Tata Kelola Bersih',
    tipePemangku: 'oms',
    misiId: 'tata_kelola_digital',
    kecamatan: 'Kecamatan Wonosobo',
    tanggalDiajukan: '12 Maret 2026',
    dukunganSuara: 395,
    status: 'masuk_rkpd',
    anggaranEstimasi: 'Rp 750 Juta (Pengembangan Modul Satu Data & Pelatihan Operator Pekon)',
    bentukKolaborasiDitawarkan: 'Komunitas relawan data siap mengadakan workshop literasi input data bagi 500 kader Posyandu dan aparat pekon.',
    tanggapanOPD: [
      {
        id: 'TGP-06',
        opdNama: 'Dinas Komunikasi & Informatika bersama Dinas Sosial',
        pejabatNama: 'M. Taufiq, S.T., M.Kom.',
        pejabatJabatan: 'Kepala Bidang Aplikasi Informatika',
        tanggal: '17 Maret 2026',
        isiTanggapan: 'Akan diintegrasikan ke dalam Portal Satu Data Terpadu Daerah yang menjadi program unggulan transformasi digital RPJMD 2025-2029.',
        statusPenetapan: 'masuk_rkpd',
        rencanaAksiTahun: 2026
      }
    ],
    komentarPublik: [
      {
        id: 'KOM-07',
        nama: 'Ratna Kusuma',
        tipe: 'masyarakat',
        tanggal: '14 Maret 2026',
        isi: 'Sangat setuju, di lingkungan kami masih banyak lansia sebatang kara yang tidak menerima bansos karena NIK belum online.'
      }
    ]
  }
];

export const KEMITRAAN_CSR_DATA: KemitraanCSR[] = [
  {
    id: 'CSR-01',
    namaProgram: 'Revitalisasi Hutan Lindung & Koridor RTH Terpadu Ramah Anak',
    bidang: 'Lingkungan Hidup & Fasilitas Publik',
    misiId: 'infrastruktur_hijau',
    deskripsi: 'Penataan kembali ruang terbuka hijau seluas 3,2 hektar dilengkapi jogging track resapan air, playground inklusif, dan 500 pohon peneduh lokal.',
    targetLokasi: 'Kawasan Hutan Lindung Gunung Tanggamus & Koridor Pesisir Teluk Semaka',
    kebutuhanEstimasi: 'Rp 3.500.000.000',
    komitmenTerkumpul: 'Rp 2.800.000.000',
    persentaseTercapai: 80,
    mitraBergabung: ['PT Bank Lampung', 'PT Pertamina Geothermal Energy Ulu Belu', 'Yayasan Bakti'],
    opdPendamping: 'Dinas Lingkungan Hidup',
    status: 'proses_mou',
    impactMetrics: '45.000 Warga per tahun mendapat akses RTH berkualitas; serapan CO2 12 ton/tahun'
  },
  {
    id: 'CSR-02',
    namaProgram: 'Pusat Vokasi Digital & Inkubasi Talenta Kecerdasan Buatan Remaja Desa',
    bidang: 'Pendidikan & Tenaga Kerja',
    misiId: 'sdm_kesehatan',
    deskripsi: 'Pembangunan 3 hub laboratorium komputer dan kurikulum coding intensif untuk 600 lulusan SMK/SMA non-kuliah agar terserap industri teknologi.',
    targetLokasi: 'Kecamatan Kota Agung, Talang Padang, dan Gisting',
    kebutuhanEstimasi: 'Rp 2.100.000.000',
    komitmenTerkumpul: 'Rp 2.100.000.000',
    persentaseTercapai: 100,
    mitraBergabung: ['Telkom Regional Lampung', 'PT Paragon Technology', 'Asosiasi Game Developer'],
    opdPendamping: 'Dinas Tenaga Kerja & Diskominfo',
    status: 'berjalan',
    impactMetrics: '600 Remaja terlatih, target penempatan kerja 82% dalam 6 bulan pasca kelulusan'
  },
  {
    id: 'CSR-03',
    namaProgram: 'Intervensi Sanitasi Terpadu & Air Bersih Pencegah Stunting 20 Pekon',
    bidang: 'Kesehatan Masyarakat',
    misiId: 'sdm_kesehatan',
    deskripsi: 'Pembangunan jamban sehat keluarga dan sambungan pipa air minum bersih bagi 1.400 KK kategori risiko stunting tinggi.',
    targetLokasi: 'Kecamatan Pematang Sawa, Cukuh Balak, dan Limau (Kantong Prioritas Stunting Pesisir)',
    kebutuhanEstimasi: 'Rp 4.200.000.000',
    komitmenTerkumpul: 'Rp 1.950.000.000',
    persentaseTercapai: 46,
    mitraBergabung: ['Danone Aqua', 'Rotary Club Peduli', 'PDAM Way Agung Tanggamus'],
    opdPendamping: 'Dinas Kesehatan & Dinas PUPR',
    status: 'terbuka',
    impactMetrics: '1.400 Balita terbebas dari ancaman infeksi diare kronis, proyeksi penurunan prevalensi stunting 4,5%'
  },
  {
    id: 'CSR-04',
    namaProgram: 'Sentra Logistik Dingin (Cold Storage) & Pengering Kopi/Gabah Ramah Lingkungan',
    bidang: 'Ketahanan Pangan & Pertanian',
    misiId: 'ekonomi_umkm',
    deskripsi: 'Penyediaan fasilitas pendingin solar panel untuk petani cabai, sayuran, dan kopi dataran tinggi guna mencegah anjloknya harga saat panen raya.',
    targetLokasi: 'Sentra Agropolitan Gisting, Pulau Panggung, dan Air Naningan',
    kebutuhanEstimasi: 'Rp 1.800.000.000',
    komitmenTerkumpul: 'Rp 900.000.000',
    persentaseTercapai: 50,
    mitraBergabung: ['PT Pupuk Indonesia', 'Koperasi Tani Makmur Tanggamus'],
    opdPendamping: 'Dinas Pertanian & Ketahanan Pangan',
    status: 'terbuka',
    impactMetrics: 'Menekan susut hasil panen (food loss) dari 28% menjadi di bawah 6%'
  }
];

export const RISET_AKADEMISI_DATA: RisetAkademisi[] = [
  {
    id: 'RST-01',
    judulKajian: 'Analisis Dampak Fiskal Desentralisasi dan Pemetaan Potensi Pajak Daerah Berbasis Kecerdasan Spasial',
    penulis: 'Prof. Dr. Candra Fajri Ananda, S.E., M.Sc. & Tim Peneliti',
    universitas: 'Universitas Lampung (Unila)',
    fakultas: 'Fakultas Ekonomi dan Bisnis',
    tahun: 2025,
    misiId: 'tata_kelola_digital',
    ringkasanEksekutif: 'Studi empiris komprehensif atas elastisitas PAD terhadap belanja modal daerah selama 10 tahun terakhir. Menemukan celah penerimaan pajak bumi bangunan (PBB) dan retribusi parkir yang dapat dioptimalkan hingga 34% melalui digitalisasi tapping box dan validasi NJOP berbasis NJOP pasar wajar.',
    rekomendasiKunci: [
      'Penerapan self-assessment pajak restoran berbasis interoperabilitas sistem POS',
      'Penyusunan peta zona nilai tanah (ZNT) terintegrasi sistem perizinan berusaha',
      'Alokasi earmarking 15% dari kenaikan PAD khusus untuk pemeliharaan jalan mantap'
    ],
    statusAdopsi: 'diadopsi_rkpd',
    opdPengkaji: 'Badan Pendapatan Daerah (Bapenda) & Bapperida',
    jumlahUnduhan: 642,
    urlDokumen: 'https://drive.google.com/file/d/1Bapenda-Tanggamus-Fiskal-2025/view'
  },
  {
    id: 'RST-02',
    judulKajian: 'Strategi Akselerasi Penurunan Stunting Terintegrasi: Evaluasi Pola Asuh & Fortifikasi Pangan Lokal',
    penulis: 'Dr. dr. Dian Nugraheni, M.Kes., Sp.GK',
    universitas: 'Universitas Airlangga',
    fakultas: 'Fakultas Kedokteran & Kesehatan Masyarakat',
    tahun: 2025,
    misiId: 'sdm_kesehatan',
    ringkasanEksekutif: 'Intervensi gizi spesifik berbasis daun kelor, ikan kembung, dan telur lokal pada 800 balita selama 180 hari membuktikan kenaikan tinggi badan rata-rata 2,4 cm di atas kelompok kontrol. Menghasilkan formula PMT lokal hemat biaya.',
    rekomendasiKunci: [
      'Peralihan pengadaan PMT pabrikan biskuit menuju olahan pangan segar Posyandu',
      'Peningkatan insentif kader Posyandu menjadi Rp 300.000/bulan dengan modul audit',
      'Kolaborasi rutin bidan desa dengan dokter spesialis anak melalui telemedicine puskesmas'
    ],
    statusAdopsi: 'diadopsi_rkpd',
    opdPengkaji: 'Dinas Kesehatan & Tim Percepatan Penurunan Stunting (TPPS)',
    jumlahUnduhan: 810,
    urlDokumen: 'https://drive.google.com/file/d/1Stunting-Tanggamus-Gizi-2025/view'
  },
  {
    id: 'RST-03',
    judulKajian: 'Manajemen Risiko Kebencanaan Perkotaan: Model Hidrodinamika 2D Genangan Air & Masterplan Drainase Hijau',
    penulis: 'Dr. Eng. Ir. Donny Harisusanto, S.T., M.T.',
    universitas: 'Institut Teknologi Sepuluh Nopember (ITS)',
    fakultas: 'Teknik Sipil, Perencanaan, dan Kebumian',
    tahun: 2026,
    misiId: 'infrastruktur_hijau',
    ringkasanEksekutif: 'Simulasi genangan hujan kala ulang 10 tahunan menunjukkan bahwa penyempitan penampang melintang drainase akibat okupasi bangunan liar berkontribusi 52% terhadap genangan di 18 titik persimpangan utama.',
    rekomendasiKunci: [
      'Pembangunan 4 kolam retensi alami (boezem) multifungsi taman rekreasi',
      'Kewajiban sumur resapan modular per 100 m2 luas atap bangunan komersial baru',
      'Normalisasi drainase primer dengan metode bio-engineering ramah ekosistem'
    ],
    statusAdopsi: 'dalam_kajian',
    opdPengkaji: 'Dinas Pekerjaan Umum, Penataan Ruang, Perumahan dan Kawasan Permukiman',
    jumlahUnduhan: 538,
    urlDokumen: 'https://drive.google.com/file/d/1Drainase-Tanggamus-Bencana-2026/view'
  }
];

export const INISIATIF_OMS_DATA: InisiatifOMS[] = [
  {
    id: 'OMS-01',
    namaOrganisasi: 'Lembaga Advokasi Hak Perempuan & Anak Melati Harapan',
    fokusAdvokasi: 'Perlindungan Korban Kekerasan & Rumah Perlindungan Aman Desa',
    judulInisiatif: 'Pembentukan Pos Sahabat Perempuan & Anak di 45 Balai Pekon Rawan KDRT',
    misiId: 'sosial_budaya',
    wilayahDampingan: 'Kecamatan Kota Agung dan Wonosobo',
    kelompokSasaran: '1.200 Perempuan rentan dan anak korban kekerasan rumah tangga',
    hasilCapaian: 'Penanganan 138 kasus psikologis, 94% korban berhasil didampingi hingga pemulihan ekonomi mandiri',
    tuntutanKebijakan: 'RPJMD wajib mengalokasikan unit respon darurat 24 jam di Puskesmas serta dana bantuan hukum cuma-cuma dari Pemda.',
    responPemda: 'Dinas P3AP2KB telah memasukkan Unit Layanan Pengaduan Terpadu ke rancangan program prioritas RPJMD 2026.',
    kontakPerson: 'Nur Halimah, S.H. (0812-3456-7890)',
    tanggalMulai: 'Januari 2024 - Sekarang'
  },
  {
    id: 'OMS-02',
    namaOrganisasi: 'Komunitas Peduli Lingkungan & Sabuk Hijau Sungai',
    fokusAdvokasi: 'Gerakan Warga Kelola Sampah Mandiri & Perlindungan Sempadan Air',
    judulInisiatif: 'Bank Sampah Digital Berbasis Barter Sayuran Organik & Maggot Black Soldier Fly',
    misiId: 'infrastruktur_hijau',
    wilayahDampingan: 'Bantaran Sungai Way Semaka & Teluk Semaka (12 Pekon)',
    kelompokSasaran: '850 Keluarga pemukiman padat tepi sungai',
    hasilCapaian: 'Merestrukturisasi 1,8 ton sampah dapur per minggu menjadi pupuk organik cair dan pakan ternak lele',
    tuntutanKebijakan: 'Insentif fiskal pembebasan retribusi sampah bagi RW/Pekon yang berhasil mereduksi sampah ke TPA di atas 40%.',
    responPemda: 'Dinas Lingkungan Hidup mengadopsi skema insentif ini ke dalam Peraturan Bupati tentang Pengurangan Sampah.',
    kontakPerson: 'Kurniawan Prasetyo (0821-9876-5432)',
    tanggalMulai: 'Agustus 2024 - Berlanjut'
  },
  {
    id: 'OMS-03',
    namaOrganisasi: 'Forum Inklusi & Aksesibilitas Indonesia (FIAI)',
    fokusAdvokasi: 'Hak Ketenagakerjaan Difabel & Fasilitas Publik Inklusif',
    judulInisiatif: 'Akademi Pelatihan Barista & Desain Grafis Mandiri Pemuda Tuli',
    misiId: 'sdm_kesehatan',
    wilayahDampingan: 'Kawasan Agribisnis Gisting dan Talang Padang',
    kelompokSasaran: '80 Pemuda disabilitas rungu wicara',
    hasilCapaian: 'Mendirikan 4 coffee shop inklusi bersertifikat dan menyalurkan 28 desainer ke industri kreatif',
    tuntutanKebijakan: 'Penegakan kuota wajib 2% tenaga kerja disabilitas pada BUMD dan instansi pemerintah daerah sesuai UU No 8/2016.',
    responPemda: 'BKPSDM dan Disnaker menyepakati formasi khusus PPPK bagi penyandang disabilitas pada rekrutmen tahun mendatang.',
    kontakPerson: 'Rizki Amanda, S.Kom. (0813-1122-3344)',
    tanggalMulai: 'Maret 2025 - Berlanjut'
  }
];

export const BAB_RPJMD_DATA: BabRPJMD[] = [
  {
    id: 'BAB-01',
    nomorBab: 'Bab I',
    judulBab: 'Pendahuluan & Gambaran Umum Kondisi Daerah',
    fokusBahasan: 'Analisis demografi, geografi, capaian RPJMD periode sebelumnya, isu strategis regional, dan proyeksi tantangan 2025-2029.',
    halamanTerkait: 'Halaman 1 - 84',
    totalMasukan: 148,
    catatanKritis: [
      {
        id: 'CK-01',
        nama: 'Dr. Irfan Santoso',
        institusi: 'Pusat Studi Demografi Universitas',
        tipe: 'akademisi',
        pasalBagian: 'Sub-Bab 1.4: Bonus Demografi & Produktivitas Usia Muda',
        komentar: 'Data proyeksi usia produktif perlu mencerminkan fenomena NEET (Not in Education, Employment, or Training) yang mencapai 18,2% agar program penanggulangan tidak bias kelompok kelas menengah saja.',
        tanggal: '26 Maret 2026'
      },
      {
        id: 'CK-02',
        nama: 'Agus Salim',
        institusi: 'Forum Warga Pantura',
        tipe: 'masyarakat',
        pasalBagian: 'Sub-Bab 1.6: Analisis Kerentanan Abrasi & Bencana Pesisir',
        komentar: 'Belum terpotret data penurunan muka tanah (land subsidence) tahunan yang menyebabkan rob permanen di 3 desa kami. Harap dimasukkan sebagai isu genting.',
        tanggal: '25 Maret 2026'
      }
    ]
  },
  {
    id: 'BAB-02',
    nomorBab: 'Bab II',
    judulBab: 'Visi, Misi, dan Tujuan Pembangunan Daerah',
    fokusBahasan: 'Formulasi visi jangka menengah daerah, elaborasi 5 misi strategis pentahelix, indikator tujuan makro, dan keterkaitan dengan RPJPN 2045.',
    halamanTerkait: 'Halaman 85 - 142',
    totalMasukan: 215,
    catatanKritis: [
      {
        id: 'CK-03',
        nama: 'Dewi Lestari, S.Sos.',
        institusi: 'Jaringan Perempuan Penggerak Pesisir',
        tipe: 'oms',
        pasalBagian: 'Misi 5: Ketahanan Sosial & Kesetaraan Gender',
        komentar: 'Harus ada komitmen eksplisit indikator Indeks Pembangunan Gender (IPG) minimal 92,0 dan persentase kepemimpinan perempuan dalam musrenbang desa di atas 30%.',
        tanggal: '24 Maret 2026'
      }
    ]
  },
  {
    id: 'BAB-03',
    nomorBab: 'Bab III',
    judulBab: 'Strategi, Arah Kebijakan, dan Program Prioritas',
    fokusBahasan: 'Rincian 24 program unggulan kepala daerah, matriks integrasi OPD, skema kolaborasi lintas aktor, dan lokus kewilayahan.',
    halamanTerkait: 'Halaman 143 - 290',
    totalMasukan: 382,
    catatanKritis: [
      {
        id: 'CK-04',
        nama: 'Bambang Widjanarko',
        institusi: 'Asosiasi Logistik & Rantai Pasok',
        tipe: 'swasta',
        pasalBagian: 'Program Prioritas 7: Revitalisasi Jalur Logistik Industri',
        komentar: 'Perlu jaminan ketepatan waktu perbaikan jalan kelas III menuju sentra industri kecil agar biaya pemeliharaan armada truk tidak membengkak.',
        tanggal: '27 Maret 2026'
      }
    ]
  },
  {
    id: 'BAB-04',
    nomorBab: 'Bab IV',
    judulBab: 'Kerangka Pendanaan Pembangunan & Indikator Kinerja Utama (IKU)',
    fokusBahasan: 'Proyeksi kapasitas riil fiskal daerah, skema creative financing (KPBU, obligasi daerah, zakat produktif, CSR), serta target numerik IKU 2025-2029.',
    halamanTerkait: 'Halaman 291 - 368',
    totalMasukan: 167,
    catatanKritis: [
      {
        id: 'CK-05',
        nama: 'Dr. Faisal Basri Jr.',
        institusi: 'Institut Riset Kebijakan Publik',
        tipe: 'akademisi',
        pasalBagian: 'Tabel 4.3: Proyeksi Penerimaan Bukan Pajak & KPBU',
        komentar: 'Asumsi pertumbuhan investasi swasta 7,5% terlalu optimis tanpa reformasi simplifikasi perizinan PBG/SLF. Sebaiknya gunakan proyeksi konservatif 5,2%.',
        tanggal: '28 Maret 2026'
      }
    ]
  }
];

export const KONSULTASI_AGENDA_DATA: KonsultasiAgenda[] = [
  {
    id: 'AGD-01',
    judulSidang: 'Musrenbang Tematik Kelompok Rentan, Disabilitas, Anak & Lansia',
    tipeAgenda: 'Musrenbang Tematik',
    pemangkuUtama: 'Organisasi Masyarakat Sipil, Komunitas Difabel, Forum Anak',
    tanggalWaktu: 'Kamis, 02 April 2026   Pukul 09.00 - 14.30 WIB',
    tempat: 'Ruang Rapat Utama Bapperida Lt. 3 & Ruang Hybrid Zoom',
    tautanDaring: 'https://bapperida.daerah.go.id/live-musrenbang-rentan',
    statusPendaftaran: 'buka',
    kapasitas: '150 Kursi Fisik   500 Peserta Virtual',
    topikKunci: ['Aksesibilitas Fasilitas Publik', 'Perlindungan Jaminan Sosial Anak Terlantar', 'Layanan Posyandu Lansia Holistik']
  },
  {
    id: 'AGD-02',
    judulSidang: 'Rembuk Kemitraan Dunia Usaha: Optimalisasi CSR untuk Pengentasan Kemiskinan',
    tipeAgenda: 'FGD Multipihak',
    pemangkuUtama: 'Kadin, APINDO, BUMD, Perbankan, BUMN Regional',
    tanggalWaktu: 'Senin, 06 April 2026   Pukul 13.00 - 17.00 WIB',
    tempat: 'Grand Ballroom Hotel Majapahit & Siaran Live Streaming',
    tautanDaring: 'https://bapperida.daerah.go.id/csr-investment-forum',
    statusPendaftaran: 'buka',
    kapasitas: '200 Perwakilan Korporasi',
    topikKunci: ['Peta Peluang Investasi Hijau', 'Matchmaking Program TJSLP Desa Dampingan', 'Skema KPBU Fasilitas Air Bersih']
  },
  {
    id: 'AGD-03',
    judulSidang: 'Sidang Pleno Terbuka Konsultasi Publik Rancangan Awal RPJMD 2025-2029',
    tipeAgenda: 'Konsultasi Publik Terbuka',
    pemangkuUtama: 'Seluruh Elemen Masyarakat, DPRD, Rektorat Kampus, Media Massa',
    tanggalWaktu: 'Rabu, 15 April 2026   Pukul 08.30 - 16.00 WIB',
    tempat: 'Gedung Sasana Praja Pemda & Saluran YouTube Pemerintah Daerah',
    tautanDaring: 'https://youtube.com/@pemda-resmi/live',
    statusPendaftaran: 'segera',
    kapasitas: '600 Delegasi Sidang',
    topikKunci: ['Paparan Visi-Misi Kepala Daerah Terpilih', 'Uji Publik Target IKU Makro', 'Penandatanganan Berita Acara Kesepakatan Multipihak']
  }
];

export const INITIAL_PRIORITAS_DATA = [
  { id: 'sdm', label: 'Menguatkan Kualitas Manusia Melalui Pendidikan dan Kesehatan', bobot: 25, konsensusWarga: 26.4 },
  { id: 'ekonomi', label: 'Meningkatkan Pertumbuhan Ekonomi Daerah', bobot: 20, konsensusWarga: 19.5 },
  { id: 'infrastruktur', label: 'Pemerataan Infrastruktur yang Berkeadilan', bobot: 25, konsensusWarga: 16.2 },
  { id: 'tata_kelola', label: 'Peningkatan Reformasi Birokrasi', bobot: 10, konsensusWarga: 6.8 },
  { id: 'lingkungan', label: 'Pengelolaan Sampah & Sabuk Hijau Tangguh Bencana', bobot: 20, konsensusWarga: 9.3 }
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'USR-001',
    name: 'Tim Bidang PME (Bapperida)',
    email: 'bidangpme@gmail.com',
    role: 'bapperida_admin',
    agency: 'Bapperida Litbang Daerah - Bidang PME',
    nip: '19840315 200801 1 003',
    jabatan: 'Kepala Bidang Pengendalian & Evaluasi',
    noHp: '0812-3456-7890',
    statusAktif: true,
    lastLogin: 'Aktif saat ini',
    createdAt: '15 Januari 2026'
  },
  {
    id: 'USR-002',
    name: 'Dra. Endang Sulistyowati, M.M.',
    email: 'verifikator.opd@daerah.go.id',
    role: 'opd_verifikator',
    agency: 'Dinas Koperasi, Perindustrian dan Perdagangan',
    nip: '19790512 200501 2 006',
    jabatan: 'Kepala Bidang Pemberdayaan UMKM',
    noHp: '0813-9876-5432',
    statusAktif: true,
    lastLogin: 'Kemarin, 14.20 WIB',
    createdAt: '20 Januari 2026'
  },
  {
    id: 'USR-003',
    name: 'Ir. Bambang Triharto, M.T.',
    email: 'bambang.pupr@daerah.go.id',
    role: 'opd_verifikator',
    agency: 'Dinas Pekerjaan Umum, Penataan Ruang & Kawasan Permukiman',
    nip: '19760820 200212 1 004',
    jabatan: 'Kepala Bidang Bina Marga & Drainase',
    noHp: '0811-2233-4455',
    statusAktif: true,
    lastLogin: '2 hari lalu',
    createdAt: '22 Januari 2026'
  },
  {
    id: 'USR-004',
    name: 'Dr. Retno Wulandari',
    email: 'retno.akademisi@kampus.ac.id',
    role: 'pemangku_kepentingan',
    agency: 'Pusat Studi Pembangunan LPPM Universitas',
    nip: 'NIDN: 0015088201',
    jabatan: 'Koordinator Riset Terapan LPPM',
    noHp: '0852-6789-0123',
    statusAktif: true,
    lastLogin: '3 hari lalu',
    createdAt: '01 Februari 2026'
  }
];

export const INITIAL_KEHADIRAN_SIDANG: KonfirmasiKehadiranSidang[] = [
  {
    id: 'RSVP-01',
    agendaId: 'AGD-01',
    judulSidang: 'Musrenbang Tematik Kelompok Rentan, Disabilitas, Anak & Lansia',
    namaLengkap: 'Rizki Amanda, S.Kom.',
    instansi: 'Forum Inklusi & Aksesibilitas Indonesia (FIAI)',
    unsurPentahelix: 'oms',
    jabatan: 'Koordinator Advokasi Aksesibilitas',
    email: 'rizki.fiai@organisasi.or.id',
    nomorKontak: '0813-1122-3344',
    bentukKehadiran: 'luring',
    statusVerifikasi: 'terkonfirmasi',
    pokokPikiran: 'Menyerahkan draf naskah rekomendasi aksesibilitas trotoar sentra kota dan implementasi 2% kuota disabilitas di BUMD.',
    waktuDaftar: '29 Maret 2026, 10.15 WIB'
  },
  {
    id: 'RSVP-02',
    agendaId: 'AGD-01',
    judulSidang: 'Musrenbang Tematik Kelompok Rentan, Disabilitas, Anak & Lansia',
    namaLengkap: 'Siti Aminah, M.Pd.',
    instansi: 'Lembaga Perlindungan Hak Anak & Lansia Peduli',
    unsurPentahelix: 'masyarakat',
    jabatan: 'Fasilitator Forum Anak Daerah',
    email: 'siti.aminah@forumanak.id',
    nomorKontak: '0812-9988-7766',
    bentukKehadiran: 'daring',
    statusVerifikasi: 'terkonfirmasi',
    pokokPikiran: 'Perluasan cakupan beasiswa anak yatim/piatu dan integrasi data posyandu lansia dengan program permakanan dinsos.',
    waktuDaftar: '29 Maret 2026, 14.30 WIB'
  },
  {
    id: 'RSVP-03',
    agendaId: 'AGD-02',
    judulSidang: 'Rembuk Kemitraan Dunia Usaha: Optimalisasi CSR untuk Pengentasan Kemiskinan',
    namaLengkap: 'Hendrawan Kusuma, M.B.A.',
    instansi: 'KADIN Komite Tetap CSR & Keberlanjutan',
    unsurPentahelix: 'swasta',
    jabatan: 'Wakil Ketua Bidang Investasi Sosial',
    email: 'hendrawan@kadin-daerah.org',
    nomorKontak: '0811-9876-5432',
    bentukKehadiran: 'luring',
    statusVerifikasi: 'terkonfirmasi',
    pokokPikiran: 'Memaparkan komitmen konsorsium 12 korporasi untuk program elektrifikasi PLTS microgrid di 8 desa tertinggal.',
    waktuDaftar: '28 Maret 2026, 16.45 WIB'
  },
  {
    id: 'RSVP-04',
    agendaId: 'AGD-03',
    judulSidang: 'Sidang Pleno Terbuka Konsultasi Publik Rancangan Awal RPJMD 2025-2029',
    namaLengkap: 'Prof. Dr. Ir. Suyitno, M.Sc.',
    instansi: 'Konsorsium Perguruan Tinggi Negeri Regional',
    unsurPentahelix: 'akademisi',
    jabatan: 'Guru Besar Perencanaan Wilayah & Kota',
    email: 'suyitno.pwk@univ-negeri.ac.id',
    nomorKontak: '0818-0234-5678',
    bentukKehadiran: 'luring',
    statusVerifikasi: 'terkonfirmasi',
    pokokPikiran: 'Penyampaian telaah kritis pembiayaan inovatif (Municipal Bond) dan validasi proyeksi pertumbuhan fiskal 5 tahun.',
    waktuDaftar: '27 Maret 2026, 11.20 WIB'
  },
  {
    id: 'RSVP-05',
    agendaId: 'AGD-01',
    judulSidang: 'Musrenbang Tematik Kelompok Rentan, Disabilitas, Anak & Lansia',
    namaLengkap: 'Agus Salim',
    instansi: 'Forum Warga Pantura Pesisir',
    unsurPentahelix: 'masyarakat',
    jabatan: 'Ketua Paguyuban Nelayan & Warga Tanggul',
    email: 'agus.pantura@warga.id',
    nomorKontak: '0853-4455-6677',
    bentukKehadiran: 'daring',
    statusVerifikasi: 'menunggu',
    pokokPikiran: 'Usulan shelter evakuasi rob ramah lansia dan kelompok rentan di pesisir utara.',
    waktuDaftar: '30 Maret 2026, 08.10 WIB'
  }
];

export const INITIAL_OPD_TANGGAMUS: UnitKerjaOPD[] = [
  {
    id: 'OPD-01',
    kodeOpd: '1.01.01.01',
    namaOpd: 'Badan Perencanaan Pembangunan, Riset dan Inovasi Daerah (BAPPERIDA)',
    singkatan: 'BAPPERIDA',
    kategori: 'badan',
    kepalaNama: 'H. Hendra Wijaya Mega, S.T., M.T., M.M.',
    kepalaNip: '19740512 199903 1 004',
    kepalaJabatan: 'Kepala Bapperida Kab. Tanggamus',
    alamatKantor: 'Kompleks Perkantoran Pemkab Tanggamus, Jl. Jenderal Sudirman No. 1, Kota Agung',
    emailKontak: 'bapperida@tanggamus.go.id',
    teleponKontak: '(0722) 21012',
    fokusMisiRpjmd: ['sdm_kesehatan', 'ekonomi_umkm', 'infrastruktur_hijau', 'tata_kelola_digital', 'sosial_budaya'],
    statusAktif: true,
    jumlahAspirasiDitinjau: 48
  },
  {
    id: 'OPD-02',
    kodeOpd: '1.03.01.01',
    namaOpd: 'Dinas Pekerjaan Umum dan Perumahan Rakyat (PUPR)',
    singkatan: 'DINAS PUPR',
    kategori: 'dinas',
    kepalaNama: 'Ir. Riski Septiansyah, S.T., M.T.',
    kepalaNip: '19760920 200212 1 005',
    kepalaJabatan: 'Kepala Dinas PUPR Kab. Tanggamus',
    alamatKantor: 'Jl. Merdeka No. 45, Kuripan, Kota Agung, Kab. Tanggamus',
    emailKontak: 'pupr@tanggamus.go.id',
    teleponKontak: '(0722) 21155',
    fokusMisiRpjmd: ['infrastruktur_hijau'],
    statusAktif: true,
    jumlahAspirasiDitinjau: 34
  },
  {
    id: 'OPD-03',
    kodeOpd: '1.02.01.01',
    namaOpd: 'Dinas Kesehatan Kabupaten Tanggamus',
    singkatan: 'DINKES',
    kategori: 'dinas',
    kepalaNama: 'Taufik Hidayat, S.K.M., M.Kes.',
    kepalaNip: '19710315 199503 1 002',
    kepalaJabatan: 'Kepala Dinas Kesehatan',
    alamatKantor: 'Jl. Samudera No. 12, Pasar Madang, Kota Agung',
    emailKontak: 'dinkes@tanggamus.go.id',
    teleponKontak: '(0722) 21088',
    fokusMisiRpjmd: ['sdm_kesehatan'],
    statusAktif: true,
    jumlahAspirasiDitinjau: 29
  },
  {
    id: 'OPD-04',
    kodeOpd: '1.01.02.01',
    namaOpd: 'Dinas Pendidikan dan Kebudayaan',
    singkatan: 'DISDIKBUD',
    kategori: 'dinas',
    kepalaNama: 'Yadi Mulyadi, S.Pd., M.M.',
    kepalaNip: '19690814 199412 1 003',
    kepalaJabatan: 'Kepala Dinas Pendidikan & Kebudayaan',
    alamatKantor: 'Jl. Pemda Raya Blok B, Kompleks Islamic Center, Kota Agung',
    emailKontak: 'disdik@tanggamus.go.id',
    teleponKontak: '(0722) 21320',
    fokusMisiRpjmd: ['sdm_kesehatan', 'sosial_budaya'],
    statusAktif: true,
    jumlahAspirasiDitinjau: 26
  },
  {
    id: 'OPD-05',
    kodeOpd: '2.01.01.01',
    namaOpd: 'Dinas Koperasi, UKM, Perindustrian dan Perdagangan',
    singkatan: 'DISKOPERINDAG',
    kategori: 'dinas',
    kepalaNama: 'Hj. Retno Damayanti, S.E., M.M.',
    kepalaNip: '19731102 199803 2 006',
    kepalaJabatan: 'Kepala Diskoperindag',
    alamatKantor: 'Jl. Ir. H. Juanda No. 88, Terbangi, Kota Agung',
    emailKontak: 'diskoperindag@tanggamus.go.id',
    teleponKontak: '(0722) 21411',
    fokusMisiRpjmd: ['ekonomi_umkm'],
    statusAktif: true,
    jumlahAspirasiDitinjau: 22
  },
  {
    id: 'OPD-06',
    kodeOpd: '2.02.01.01',
    namaOpd: 'Dinas Pertanian dan Ketahanan Pangan',
    singkatan: 'DISTAN-KP',
    kategori: 'dinas',
    kepalaNama: 'Ir. Catur Agus Dewanto, M.Si.',
    kepalaNip: '19700428 199603 1 001',
    kepalaJabatan: 'Kepala Dinas Pertanian & KP',
    alamatKantor: 'Jl. Raya Gisting Blok 18, Gisting Bawah, Tanggamus',
    emailKontak: 'pertanian@tanggamus.go.id',
    teleponKontak: '(0722) 32104',
    fokusMisiRpjmd: ['ekonomi_umkm', 'infrastruktur_hijau'],
    statusAktif: true,
    jumlahAspirasiDitinjau: 19
  },
  {
    id: 'OPD-07',
    kodeOpd: '2.03.01.01',
    namaOpd: 'Dinas Perikanan dan Kelautan',
    singkatan: 'DISKANLUT',
    kategori: 'dinas',
    kepalaNama: 'Darmansyah, S.Pi., M.Si.',
    kepalaNip: '19750119 200003 1 003',
    kepalaJabatan: 'Kepala Dinas Perikanan',
    alamatKantor: 'Kawasan Pelabuhan Perikanan Kota Agung, Tanggamus',
    emailKontak: 'perikanan@tanggamus.go.id',
    teleponKontak: '(0722) 21900',
    fokusMisiRpjmd: ['ekonomi_umkm'],
    statusAktif: true,
    jumlahAspirasiDitinjau: 15
  },
  {
    id: 'OPD-08',
    kodeOpd: '1.04.01.01',
    namaOpd: 'Dinas Lingkungan Hidup Kabupaten Tanggamus',
    singkatan: 'DLH',
    kategori: 'dinas',
    kepalaNama: 'Kemal Pasha, S.H., M.H.',
    kepalaNip: '19721208 199903 1 002',
    kepalaJabatan: 'Kepala Dinas Lingkungan Hidup',
    alamatKantor: 'Jl. Samudera No. 24, Kuripan, Kota Agung',
    emailKontak: 'dlh@tanggamus.go.id',
    teleponKontak: '(0722) 21244',
    fokusMisiRpjmd: ['infrastruktur_hijau'],
    statusAktif: true,
    jumlahAspirasiDitinjau: 21
  },
  {
    id: 'OPD-09',
    kodeOpd: '1.08.01.01',
    namaOpd: 'Dinas Komunikasi, Informatika, Statistik dan Persandian',
    singkatan: 'DISKOMINFO',
    kategori: 'dinas',
    kepalaNama: 'Suprayitno, S.Kom., M.T.I.',
    kepalaNip: '19790214 200501 1 008',
    kepalaJabatan: 'Kepala Diskominfo Kab. Tanggamus',
    alamatKantor: 'Gedung Otonom Lt. 2, Kompleks Pemkab Tanggamus, Kota Agung',
    emailKontak: 'diskominfo@tanggamus.go.id',
    teleponKontak: '(0722) 21777',
    fokusMisiRpjmd: ['tata_kelola_digital'],
    statusAktif: true,
    jumlahAspirasiDitinjau: 18
  },
  {
    id: 'OPD-10',
    kodeOpd: '1.06.01.01',
    namaOpd: 'Dinas Sosial Kabupaten Tanggamus',
    singkatan: 'DINSOS',
    kategori: 'dinas',
    kepalaNama: 'Drs. Zulfadli, M.M.',
    kepalaNip: '19680710 199303 1 005',
    kepalaJabatan: 'Kepala Dinas Sosial',
    alamatKantor: 'Jl. Melati No. 05, Kota Agung Timur, Tanggamus',
    emailKontak: 'dinsos@tanggamus.go.id',
    teleponKontak: '(0722) 21633',
    fokusMisiRpjmd: ['sosial_budaya'],
    statusAktif: true,
    jumlahAspirasiDitinjau: 17
  },
  {
    id: 'OPD-11',
    kodeOpd: '1.05.01.01',
    namaOpd: 'Badan Penanggulangan Bencana Daerah (BPBD)',
    singkatan: 'BPBD',
    kategori: 'badan',
    kepalaNama: 'Ir. Ediyan M. Toha, M.Si.',
    kepalaNip: '19701005 199703 1 004',
    kepalaJabatan: 'Kepala Pelaksana BPBD Kab. Tanggamus',
    alamatKantor: 'Jl. Lintas Barat KM 112, Kampung Baru, Kota Agung Timur',
    emailKontak: 'bpbd@tanggamus.go.id',
    teleponKontak: '(0722) 21999',
    fokusMisiRpjmd: ['infrastruktur_hijau'],
    statusAktif: true,
    jumlahAspirasiDitinjau: 16
  },
  {
    id: 'OPD-12',
    kodeOpd: '4.01.01.01',
    namaOpd: 'Sekretariat Daerah Kabupaten Tanggamus',
    singkatan: 'SETDAKAB',
    kategori: 'sekretariat',
    kepalaNama: 'Drs. Suaidi, M.M.',
    kepalaNip: '19660412 199203 1 007',
    kepalaJabatan: 'Sekretaris Daerah Kab. Tanggamus',
    alamatKantor: 'Kantor Bupati Tanggamus, Jl. Jend. Sudirman No. 1, Kota Agung',
    emailKontak: 'setdakab@tanggamus.go.id',
    teleponKontak: '(0722) 21001',
    fokusMisiRpjmd: ['tata_kelola_digital', 'sdm_kesehatan', 'ekonomi_umkm', 'infrastruktur_hijau', 'sosial_budaya'],
    statusAktif: true,
    jumlahAspirasiDitinjau: 25
  },
  {
    id: 'OPD-13',
    kodeOpd: '4.02.01.01',
    namaOpd: 'Inspektorat Daerah Kabupaten Tanggamus',
    singkatan: 'INSPEKTORAT',
    kategori: 'inspektorat',
    kepalaNama: 'Ernalia, S.Sos., M.Si.',
    kepalaNip: '19710817 199603 2 002',
    kepalaJabatan: 'Inspektur Daerah Kab. Tanggamus',
    alamatKantor: 'Kompleks Pemkab Tanggamus, Kota Agung',
    emailKontak: 'inspektorat@tanggamus.go.id',
    teleponKontak: '(0722) 21008',
    fokusMisiRpjmd: ['tata_kelola_digital'],
    statusAktif: true,
    jumlahAspirasiDitinjau: 12
  }
];
