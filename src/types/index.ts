export type StakeholderType = 'masyarakat' | 'swasta' | 'akademisi' | 'oms' | 'pemerintah';
export type MisiRPJMD = string;

export interface MisiRPJMDItem {
  id: string;
  nomor: string;
  judul: string;
  fokus: string;
  sasaranPokok?: string[];
  indikatorKinerjaUtama?: string[];
  opdPengampuUtama?: string;
  warnaTema?: 'emerald' | 'blue' | 'amber' | 'purple' | 'rose' | 'teal' | 'indigo';
  urutan: number;
  statusAktif: boolean;
}

export type StatusTindakLanjut = 
  | 'menunggu_disposisi'
  | 'ditelaah' 
  | 'masuk_rkpd' 
  | 'masuk_renja_pd'
  | 'ditolak'
  | 'sinergi_csr' 
  | 'pendalaman_teknis' 
  | 'selesai';

export interface TanggapanOPD {
  id: string;
  opdNama: string;
  pejabatNama: string;
  pejabatJabatan: string;
  tanggal: string;
  isiTanggapan: string;
  statusPenetapan: StatusTindakLanjut;
  rencanaAksiTahun?: number;
}

export interface AspirasiPublik {
  id: string;
  judul: string;
  ringkasan: string;
  deskripsiLengkap: string;
  pengusulNama: string;
  pengusulInstitusi?: string;
  tipePemangku: StakeholderType;
  misiId: MisiRPJMD;
  kecamatan: string;
  pekon?: string;
  detailAlamat?: string;
  tanggalDiajukan: string;
  dukunganSuara: number;
  hasVoted?: boolean;
  status: StatusTindakLanjut;
  anggaranEstimasi?: string;
  bentukKolaborasiDitawarkan?: string;
  opdDitunjuk?: string;
  tanggalDisposisi?: string;
  catatanDisposisiBapperida?: string;
  catatanOpd?: string;
  statusRekomendasiOpd?: 'masuk_renja_pd' | 'ditolak';
  tanggalTanggapanOpd?: string;
  pejabatPenelaahOpd?: string;
  tanggapanOPD?: TanggapanOPD[];
  komentarPublik: {
    id: string;
    nama: string;
    institusi?: string;
    tipe: StakeholderType;
    tanggal: string;
    isi: string;
  }[];
}

export interface KemitraanCSR {
  id: string;
  namaProgram: string;
  bidang: string;
  misiId: MisiRPJMD;
  deskripsi: string;
  targetLokasi: string;
  kebutuhanEstimasi: string;
  komitmenTerkumpul: string;
  persentaseTercapai: number;
  mitraBergabung: string[];
  opdPendamping: string;
  status: 'terbuka' | 'proses_mou' | 'berjalan';
  impactMetrics: string;
}

export interface RisetAkademisi {
  id: string;
  judulKajian: string;
  penulis: string;
  universitas: string;
  fakultas: string;
  tahun: number;
  misiId: MisiRPJMD;
  ringkasanEksekutif: string;
  rekomendasiKunci: string[];
  statusAdopsi: 'diadopsi_rkpd' | 'dalam_kajian' | 'referensi_naskah';
  opdPengkaji: string;
  jumlahUnduhan: number;
  urlDokumen?: string;
}

export interface InisiatifOMS {
  id: string;
  namaOrganisasi: string;
  fokusAdvokasi: string;
  judulInisiatif: string;
  misiId: MisiRPJMD;
  wilayahDampingan: string;
  kelompokSasaran: string;
  hasilCapaian: string;
  tuntutanKebijakan: string;
  responPemda: string;
  kontakPerson: string;
  tanggalMulai: string;
}

export interface BabRPJMD {
  id?: string;
  nomorBab: string;
  judulBab: string;
  fokusBahasan: string;
  halamanTerkait: string;
  totalMasukan: number;
  catatanKritis: {
    id: string;
    nama: string;
    institusi: string;
    tipe: StakeholderType;
    pasalBagian: string;
    komentar: string;
    tanggal: string;
  }[];
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'bapperida_admin' | 'bappeda_admin' | 'opd_verifikator' | 'pemangku_kepentingan';
  agency?: string;
  avatar?: string;
  nip?: string;
  jabatan?: string;
  noHp?: string;
  statusAktif?: boolean;
  lastLogin: string;
  createdAt?: string;
}

export interface KonsultasiAgenda {
  id: string;
  judulSidang: string;
  tipeAgenda: 'Konsultasi Publik Terbuka' | 'Musrenbang Tematik' | 'FGD Multipihak';
  pemangkuUtama: string;
  tanggalWaktu: string;
  tempat: string;
  tautanDaring?: string;
  statusPendaftaran: 'buka' | 'segera' | 'selesai';
  kapasitas: string;
  topikKunci: string[];
}

export interface KonfirmasiKehadiranSidang {
  id: string;
  agendaId: string;
  judulSidang: string;
  namaLengkap: string;
  instansi: string;
  unsurPentahelix: StakeholderType | 'pemerintah';
  jabatan: string;
  email: string;
  nomorKontak: string;
  bentukKehadiran: 'luring' | 'daring';
  statusVerifikasi: 'terkonfirmasi' | 'hadir' | 'menunggu';
  pokokPikiran?: string;
  waktuDaftar: string;
}

export interface UnitKerjaOPD {
  id: string;
  kodeOpd: string;
  namaOpd: string;
  singkatan: string;
  kategori: 'badan' | 'dinas' | 'sekretariat' | 'kecamatan' | 'inspektorat' | 'unit_khusus';
  kepalaNama: string;
  kepalaNip?: string;
  kepalaJabatan: string;
  alamatKantor: string;
  emailKontak: string;
  teleponKontak: string;
  fokusMisiRpjmd: MisiRPJMD[];
  statusAktif: boolean;
  jumlahAspirasiDitinjau?: number;
}
