// GeoJSON data and geographical metadata for Kabupaten Tanggamus, Lampung

export interface TanggamusFeatureProperties {
  id: string;
  name: string;
  alias: string;
  ibuKotaKecamatan: string;
  jumlahPekon: number;
  karakteristik: string;
  sektorUnggulan: string;
  center: [number, number]; // [longitude, latitude]
  tipeGeografis: 'pesisir' | 'pegunungan' | 'daratan_rendah' | 'lembah';
  warnaDasar: string;
}

export interface TanggamusGeoFeature {
  type: 'Feature';
  properties: TanggamusFeatureProperties;
  geometry: {
    type: 'Polygon';
    coordinates: number[][][]; // [longitude, latitude][]
  };
}

export interface TanggamusGeoJSON {
  type: 'FeatureCollection';
  features: TanggamusGeoFeature[];
}

export interface TanggamusLandmark {
  id: string;
  name: string;
  type: 'mountain' | 'water' | 'port' | 'tourism' | 'capital';
  coordinates: [number, number]; // [lng, lat]
  elevationOrInfo?: string;
  keterangan: string;
}

export interface TanggamusRiver {
  id: string;
  name: string;
  coordinates: [number, number][];
}

export interface TanggamusRoad {
  id: string;
  name: string;
  type: 'arteri_nasional' | 'kolektor_provinsi';
  coordinates: [number, number][];
}

// Landmarks in Tanggamus
export const TANGGAMUS_LANDMARKS: TanggamusLandmark[] = [
  {
    id: 'gunung-tanggamus',
    name: 'Gunung Tanggamus',
    type: 'mountain',
    coordinates: [104.715, -5.425],
    elevationOrInfo: '2.102 mdpl',
    keterangan: 'Gunung tertinggi ikonik Tanggamus dengan hutan lumut alami & hulu mata air'
  },
  {
    id: 'waduk-batutegi',
    name: 'Bendungan & PLTA Batu Tegi',
    type: 'water',
    coordinates: [104.755, -5.205],
    elevationOrInfo: 'Kapasitas 680 Juta m³',
    keterangan: 'Waduk terbesar di Asia Tenggara bagian selatan, penyedia energi & irigasi'
  },
  {
    id: 'teluk-semaka',
    name: 'Teluk Semaka',
    type: 'water',
    coordinates: [104.620, -5.630],
    elevationOrInfo: 'Kedalaman hingga 200m',
    keterangan: 'Pusat maritim, pelabuhan samudera & perikanan tangkap terintegrasi'
  },
  {
    id: 'teluk-kiluan',
    name: 'Teluk Kiluan & Pulau Gigi Hiu',
    type: 'tourism',
    coordinates: [105.120, -5.760],
    elevationOrInfo: 'Dolphin Watching',
    keterangan: 'Habitat alami lumba-lumba hidung botol & formasi batuan karang eksotis'
  },
  {
    id: 'kota-agung-pusat',
    name: 'Pusat Pemkab Tanggamus',
    type: 'capital',
    coordinates: [104.624, -5.495],
    elevationOrInfo: 'Kompleks Pemda Way Salam',
    keterangan: 'Pusat administrasi, Bapperida, DPRD, dan layanan publik daerah'
  },
  {
    id: 'geothermal-ulubelu',
    name: 'Geothermal PGE Ulu Belu',
    type: 'tourism',
    coordinates: [104.530, -5.185],
    elevationOrInfo: 'Kapasitas 220 MW',
    keterangan: 'Pembangkit listrik tenaga panas bumi hijau menyuplai jaringan kelistrikan Sumatera'
  }
];

// Major Rivers in Tanggamus
export const TANGGAMUS_RIVERS: TanggamusRiver[] = [
  {
    id: 'way-semaka',
    name: 'Sungai Way Semaka',
    coordinates: [
      [104.450, -5.280],
      [104.455, -5.330],
      [104.460, -5.380],
      [104.475, -5.430],
      [104.490, -5.470],
      [104.510, -5.500]
    ]
  },
  {
    id: 'way-sekampung-hulu',
    name: 'Sungai Way Sekampung',
    coordinates: [
      [104.650, -5.220],
      [104.700, -5.230],
      [104.745, -5.215],
      [104.790, -5.230],
      [104.840, -5.240]
    ]
  }
];

// Main Road Network: Jalan Lintas Barat Sumatera (Jalinbar)
export const TANGGAMUS_ROADS: TanggamusRoad[] = [
  {
    id: 'jalinbar-tanggamus',
    name: 'Jalan Lintas Barat Sumatera (Jalinbar)',
    type: 'arteri_nasional',
    coordinates: [
      [104.360, -5.350],
      [104.410, -5.390],
      [104.465, -5.430],
      [104.520, -5.465],
      [104.580, -5.485],
      [104.630, -5.495],
      [104.680, -5.480],
      [104.710, -5.430],
      [104.735, -5.370],
      [104.770, -5.360],
      [104.825, -5.340],
      [104.880, -5.335],
      [104.940, -5.340]
    ]
  }
];

// High-definition GeoJSON for all 20 Kecamatan in Kabupaten Tanggamus
export const TANGGAMUS_GEOJSON: TanggamusGeoJSON = {
  type: 'FeatureCollection',
  features: [
    // 1. Kota Agung (Ibukota Kabupaten Tanggamus)
    {
      type: 'Feature',
      properties: {
        id: 'kota_agung',
        name: 'Kecamatan Kota Agung',
        alias: 'Kota Agung Pusat',
        ibuKotaKecamatan: 'Kuripan',
        jumlahPekon: 16,
        karakteristik: 'Pusat ibukota kabupaten, pelabuhan perikanan samudera, dan sentra perdagangan pesisir Teluk Semaka.',
        sektorUnggulan: 'Pelayanan Publik, Perikanan Tangkap, Jasa & UMKM',
        center: [104.625, -5.480],
        tipeGeografis: 'pesisir',
        warnaDasar: '#ecfdf5'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [104.595, -5.465],
          [104.620, -5.455],
          [104.645, -5.450],
          [104.655, -5.475],
          [104.645, -5.495],
          [104.620, -5.500],
          [104.595, -5.490],
          [104.595, -5.465]
        ]]
      }
    },

    // 2. Kota Agung Barat
    {
      type: 'Feature',
      properties: {
        id: 'kota_agung_barat',
        name: 'Kecamatan Kota Agung Barat',
        alias: 'Kota Agung Barat',
        ibuKotaKecamatan: 'Negara Batin',
        jumlahPekon: 11,
        karakteristik: 'Pesisir pantai barat Teluk Semaka dengan sentra perkebunan kelapa, kakao, dan pariwisata bahari.',
        sektorUnggulan: 'Perkebunan Rakyat, Perikanan Pesisir, Agrowisata',
        center: [104.545, -5.455],
        tipeGeografis: 'pesisir',
        warnaDasar: '#f0fdf4'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [104.515, -5.425],
          [104.565, -5.420],
          [104.595, -5.465],
          [104.595, -5.490],
          [104.560, -5.485],
          [104.520, -5.470],
          [104.515, -5.425]
        ]]
      }
    },

    // 3. Kota Agung Timur
    {
      type: 'Feature',
      properties: {
        id: 'kota_agung_timur',
        name: 'Kecamatan Kota Agung Timur',
        alias: 'Kota Agung Timur',
        ibuKotaKecamatan: 'Teba Lumbu',
        jumlahPekon: 11,
        karakteristik: 'Pintu gerbang timur ibukota, perbukitan Batu Keramat, dan pusat perkantoran Pemda Way Salam.',
        sektorUnggulan: 'Perkantoran Pemerintahan, Agrowisata Buah, Hortikultura',
        center: [104.690, -5.460],
        tipeGeografis: 'pesisir',
        warnaDasar: '#ecfdf5'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [104.645, -5.450],
          [104.685, -5.430],
          [104.725, -5.435],
          [104.735, -5.470],
          [104.700, -5.485],
          [104.655, -5.475],
          [104.645, -5.450]
        ]]
      }
    },

    // 4. Wonosobo
    {
      type: 'Feature',
      properties: {
        id: 'wonosobo',
        name: 'Kecamatan Wonosobo',
        alias: 'Wonosobo',
        ibuKotaKecamatan: 'Sinar Rejeki',
        jumlahPekon: 8,
        karakteristik: 'Dataran aluvial subur muara sungai Way Semaka, lumbung swasembada padi sawah dan perikanan air tawar.',
        sektorUnggulan: 'Padi Sawah Irigasi, Penggilingan Beras, Tambak Bandeng',
        center: [104.475, -5.440],
        tipeGeografis: 'daratan_rendah',
        warnaDasar: '#f0fdf4'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [104.435, -5.395],
          [104.485, -5.385],
          [104.515, -5.440],
          [104.515, -5.495],
          [104.470, -5.495],
          [104.430, -5.455],
          [104.435, -5.395]
        ]]
      }
    },

    // 5. Semaka
    {
      type: 'Feature',
      properties: {
        id: 'semaka',
        name: 'Kecamatan Semaka',
        alias: 'Semaka',
        ibuKotaKecamatan: 'Sukaraja',
        jumlahPekon: 8,
        karakteristik: 'Pesisir barat laut Teluk Semaka, pintu masuk jalur lintas barat dari arah Bengkulu/Krui, lumbung lada dan kelapa.',
        sektorUnggulan: 'Perikanan Tangkap, Perkebunan Lada Hitam, Logistik Perbatasan',
        center: [104.395, -5.390],
        tipeGeografis: 'pesisir',
        warnaDasar: '#ecfdf5'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [104.350, -5.335],
          [104.410, -5.330],
          [104.435, -5.395],
          [104.430, -5.455],
          [104.375, -5.460],
          [104.345, -5.395],
          [104.350, -5.335]
        ]]
      }
    },

    // 6. Bandar Negeri Semuong
    {
      type: 'Feature',
      properties: {
        id: 'bandar_negeri_semuong',
        name: 'Kecamatan Bandar Negeri Semuong',
        alias: 'Bandar Negeri Semuong (BNS)',
        ibuKotaKecamatan: 'Sanggi',
        jumlahPekon: 6,
        karakteristik: 'Lembah sungai Way Semuong diapit perbukitan, penghasil cengkeh, kopi, dan peternakan kambing Saburai.',
        sektorUnggulan: 'Kambing Saburai, Rempah-Rempah, Kopi Robusta',
        center: [104.465, -5.315],
        tipeGeografis: 'lembah',
        warnaDasar: '#f0fdf4'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [104.415, -5.250],
          [104.505, -5.240],
          [104.525, -5.310],
          [104.485, -5.385],
          [104.435, -5.395],
          [104.410, -5.330],
          [104.415, -5.250]
        ]]
      }
    },

    // 7. Pematang Sawa
    {
      type: 'Feature',
      properties: {
        id: 'pematang_sawa',
        name: 'Kecamatan Pematang Sawa',
        alias: 'Pematang Sawa',
        ibuKotaKecamatan: 'Way Asahan',
        jumlahPekon: 8,
        karakteristik: 'Semenanjung panjang di barat Teluk Semaka yang berbatasan langsung dengan Taman Nasional Bukit Barisan Selatan (TNBBS).',
        sektorUnggulan: 'Konservasi TNBBS, Getah Damar Mata Kucing, Perikanan Laut Dalam',
        center: [104.430, -5.660],
        tipeGeografis: 'pesisir',
        warnaDasar: '#ecfdf5'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [104.345, -5.460],
          [104.430, -5.455],
          [104.470, -5.495],
          [104.490, -5.580],
          [104.495, -5.730],
          [104.460, -5.845],
          [104.400, -5.850],
          [104.385, -5.740],
          [104.340, -5.600],
          [104.345, -5.460]
        ]]
      }
    },

    // 8. Ulu Belu
    {
      type: 'Feature',
      properties: {
        id: 'ulu_belu',
        name: 'Kecamatan Ulu Belu',
        alias: 'Ulu Belu',
        ibuKotaKecamatan: 'Ngarip',
        jumlahPekon: 9,
        karakteristik: 'Kawasan pegunungan barat laut, sentra panas bumi (geothermal) nasional dan produsen kopi robusta premium.',
        sektorUnggulan: 'Energi Panas Bumi, Kopi Organik, Agrowisata Alam Sejuk',
        center: [104.535, -5.195],
        tipeGeografis: 'pegunungan',
        warnaDasar: '#f0fdf4'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [104.455, -5.120],
          [104.595, -5.115],
          [104.625, -5.175],
          [104.605, -5.250],
          [104.505, -5.240],
          [104.455, -5.210],
          [104.455, -5.120]
        ]]
      }
    },

    // 9. Air Naningan
    {
      type: 'Feature',
      properties: {
        id: 'air_naningan',
        name: 'Kecamatan Air Naningan',
        alias: 'Air Naningan',
        ibuKotaKecamatan: 'Air Naningan',
        jumlahPekon: 8,
        karakteristik: 'Kawasan waduk PLTA Batutegi, perikanan keramba jaring apung, dan konservasi hutan hulu DAS Sekampung.',
        sektorUnggulan: 'Energi Terbarukan PLTA, Perikanan Air Tawar, Hutan Lindung',
        center: [104.745, -5.205],
        tipeGeografis: 'pegunungan',
        warnaDasar: '#ecfdf5'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [104.685, -5.155],
          [104.785, -5.150],
          [104.815, -5.210],
          [104.775, -5.265],
          [104.710, -5.260],
          [104.680, -5.215],
          [104.685, -5.155]
        ]]
      }
    },

    // 10. Pulau Panggung
    {
      type: 'Feature',
      properties: {
        id: 'pulau_panggung',
        name: 'Kecamatan Pulau Panggung',
        alias: 'Pulau Panggung',
        ibuKotaKecamatan: 'Tekad',
        jumlahPekon: 10,
        karakteristik: 'Lembah subur aliran Way Sekampung, sentra komoditas padi dan kopi, penghubung strategis ke Batutegi.',
        sektorUnggulan: 'Padi Sawah, Perkebunan Kopi & Kakao, Konservasi DAS',
        center: [104.675, -5.285],
        tipeGeografis: 'lembah',
        warnaDasar: '#f0fdf4'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [104.605, -5.250],
          [104.710, -5.260],
          [104.730, -5.285],
          [104.715, -5.335],
          [104.635, -5.340],
          [104.605, -5.290],
          [104.605, -5.250]
        ]]
      }
    },

    // 11. Gisting
    {
      type: 'Feature',
      properties: {
        id: 'gisting',
        name: 'Kecamatan Gisting',
        alias: 'Gisting',
        ibuKotaKecamatan: 'Gisting Bawah',
        jumlahPekon: 9,
        karakteristik: 'Dataran tinggi sejuk di lereng Gunung Tanggamus (2.102 mdpl), sentra sayur hortikultura, kopi, dan vila wisata.',
        sektorUnggulan: 'Hortikultura Dataran Tinggi, Ekowisata Pegunungan, Kopi Robusta',
        center: [104.735, -5.370],
        tipeGeografis: 'pegunungan',
        warnaDasar: '#ecfdf5'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [104.695, -5.335],
          [104.755, -5.330],
          [104.770, -5.365],
          [104.755, -5.415],
          [104.705, -5.420],
          [104.685, -5.380],
          [104.695, -5.335]
        ]]
      }
    },

    // 12. Gunung Alip
    {
      type: 'Feature',
      properties: {
        id: 'gunung_alip',
        name: 'Kecamatan Gunung Alip',
        alias: 'Gunung Alip',
        ibuKotaKecamatan: 'Banjar Negeri',
        jumlahPekon: 7,
        karakteristik: 'Lembah strategis antara Gisting dan Talang Padang, pusat pelestarian adat Saibatin dan kerajinan tradisional.',
        sektorUnggulan: 'Budaya Adat Lampung, Kerajinan Tapis, Padi Sawah',
        center: [104.770, -5.365],
        tipeGeografis: 'daratan_rendah',
        warnaDasar: '#f0fdf4'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [104.755, -5.330],
          [104.795, -5.330],
          [104.805, -5.375],
          [104.785, -5.405],
          [104.755, -5.415],
          [104.770, -5.365],
          [104.755, -5.330]
        ]]
      }
    },

    // 13. Talang Padang
    {
      type: 'Feature',
      properties: {
        id: 'talang_padang',
        name: 'Kecamatan Talang Padang',
        alias: 'Talang Padang',
        ibuKotaKecamatan: 'Talang Padang',
        jumlahPekon: 11,
        karakteristik: 'Pusat perdagangan dan persimpangan niaga terbesar di wilayah tengah-timur Tanggamus.',
        sektorUnggulan: 'Perdagangan Komoditas, Industri Pangan Olahan, Jasa Distribusi',
        center: [104.825, -5.350],
        tipeGeografis: 'daratan_rendah',
        warnaDasar: '#ecfdf5'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [104.795, -5.315],
          [104.855, -5.310],
          [104.865, -5.365],
          [104.835, -5.390],
          [104.785, -5.405],
          [104.805, -5.375],
          [104.795, -5.315]
        ]]
      }
    },

    // 14. Sumberejo
    {
      type: 'Feature',
      properties: {
        id: 'sumberejo',
        name: 'Kecamatan Sumberejo',
        alias: 'Sumberejo',
        ibuKotaKecamatan: 'Sumberejo',
        jumlahPekon: 8,
        karakteristik: 'Sentra pertanian terintegrasi, lumbung palawija dan peternakan sapi potong pedesaan.',
        sektorUnggulan: 'Peternakan Sapi Potong, Palawija, Industri Rumah Tangga',
        center: [104.835, -5.265],
        tipeGeografis: 'daratan_rendah',
        warnaDasar: '#f0fdf4'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [104.775, -5.215],
          [104.875, -5.210],
          [104.890, -5.275],
          [104.855, -5.310],
          [104.795, -5.315],
          [104.775, -5.265],
          [104.775, -5.215]
        ]]
      }
    },

    // 15. Pugung
    {
      type: 'Feature',
      properties: {
        id: 'pugung',
        name: 'Kecamatan Pugung',
        alias: 'Pugung',
        ibuKotaKecamatan: 'Rantau Tijang',
        jumlahPekon: 8,
        karakteristik: 'Kawasan timur berbatasan dengan Kabupaten Pringsewu, sentra kakao, pisang mas, dan perikanan kolam.',
        sektorUnggulan: 'Perkebunan Kakao, Pisang Mas Ekspor, Perikanan Air Tawar',
        center: [104.915, -5.335],
        tipeGeografis: 'daratan_rendah',
        warnaDasar: '#ecfdf5'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [104.855, -5.285],
          [104.960, -5.280],
          [104.975, -5.350],
          [104.945, -5.395],
          [104.865, -5.365],
          [104.855, -5.285]
        ]]
      }
    },

    // 16. Bulok
    {
      type: 'Feature',
      properties: {
        id: 'bulok',
        name: 'Kecamatan Bulok',
        alias: 'Bulok',
        ibuKotaKecamatan: 'Sukamaju',
        jumlahPekon: 5,
        karakteristik: 'Kawasan perbukitan timur Tanggamus, kaya mata air pegunungan dan komoditas perkebunan karet rakyat.',
        sektorUnggulan: 'Perkebunan Karet Rakyat, Agrowisata Buah Durian, Ketahanan Air',
        center: [105.025, -5.395],
        tipeGeografis: 'pegunungan',
        warnaDasar: '#f0fdf4'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [104.960, -5.335],
          [105.085, -5.330],
          [105.105, -5.425],
          [105.060, -5.475],
          [104.975, -5.470],
          [104.945, -5.395],
          [104.960, -5.335]
        ]]
      }
    },

    // 17. Limau
    {
      type: 'Feature',
      properties: {
        id: 'limau',
        name: 'Kecamatan Limau',
        alias: 'Limau',
        ibuKotaKecamatan: 'Kuripan',
        jumlahPekon: 6,
        karakteristik: 'Pesisir timur Teluk Semaka dengan pantai landai, sentra tambak udang vaname modern dan kelapa dalam.',
        sektorUnggulan: 'Tambak Udang Vaname, Perikanan Tangkap, Kelapa Dalam',
        center: [104.815, -5.535],
        tipeGeografis: 'pesisir',
        warnaDasar: '#ecfdf5'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [104.735, -5.470],
          [104.865, -5.460],
          [104.890, -5.550],
          [104.855, -5.600],
          [104.805, -5.580],
          [104.765, -5.520],
          [104.735, -5.470]
        ]]
      }
    },

    // 18. Cukuh Balak
    {
      type: 'Feature',
      properties: {
        id: 'cukuh_balak',
        name: 'Kecamatan Cukuh Balak',
        alias: 'Cukuh Balak',
        ibuKotaKecamatan: 'Putih Doh',
        jumlahPekon: 7,
        karakteristik: 'Semenanjung tenggara menghadap Selat Sunda dan Teluk Semaka, sentra perikanan kerapu, lobster, dan cengkeh.',
        sektorUnggulan: 'Perikanan Kerapu & Lobster, Pariwisata Pantai Karang Gigi Hiu, Cengkeh',
        center: [104.910, -5.645],
        tipeGeografis: 'pesisir',
        warnaDasar: '#f0fdf4'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [104.850, -5.580],
          [104.945, -5.575],
          [104.975, -5.655],
          [104.955, -5.730],
          [104.885, -5.735],
          [104.845, -5.665],
          [104.850, -5.580]
        ]]
      }
    },

    // 19. Kelumbayan Barat
    {
      type: 'Feature',
      properties: {
        id: 'kelumbayan_barat',
        name: 'Kecamatan Kelumbayan Barat',
        alias: 'Kelumbayan Barat',
        ibuKotaKecamatan: 'Batu Patah',
        jumlahPekon: 4,
        karakteristik: 'Perbukitan penyangga kawasan pesisir tenggara, penghasil rempah pala, lada, dan peternakan sapi rakyat.',
        sektorUnggulan: 'Perkebunan Pala & Lada, Kehutanan Masyarakat, Peternakan Sapi',
        center: [105.040, -5.645],
        tipeGeografis: 'pegunungan',
        warnaDasar: '#ecfdf5'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [104.985, -5.590],
          [105.085, -5.585],
          [105.105, -5.665],
          [105.065, -5.715],
          [104.995, -5.710],
          [104.975, -5.655],
          [104.985, -5.590]
        ]]
      }
    },

    // 20. Kelumbayan
    {
      type: 'Feature',
      properties: {
        id: 'kelumbayan',
        name: 'Kecamatan Kelumbayan',
        alias: 'Kelumbayan',
        ibuKotaKecamatan: 'Kiluan Negeri',
        jumlahPekon: 6,
        karakteristik: 'Pesisir eksotis ujung tenggara Tanggamus dengan gugusan pulau Teluk Kiluan, habitat alami lumba-lumba hidung botol.',
        sektorUnggulan: 'Ekowisata Bahari Dunia (Dolphin Watching), Konservasi Penyu, Perikanan Tangkap',
        center: [105.110, -5.745],
        tipeGeografis: 'pesisir',
        warnaDasar: '#f0fdf4'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [105.045, -5.680],
          [105.155, -5.675],
          [105.195, -5.750],
          [105.170, -5.820],
          [105.085, -5.825],
          [105.035, -5.755],
          [105.045, -5.680]
        ]]
      }
    }
  ]
};
