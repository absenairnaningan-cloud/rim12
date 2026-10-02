import React, { useState, useEffect } from 'react';
import { AspirasiPublik, StakeholderType, MisiRPJMD } from '../types';
import { KECAMATAN_TANGGAMUS, PEKON_TANGGAMUS_MAP } from '../data/mockData';

interface FormAspirasiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newAspirasi: AspirasiPublik) => void;
  defaultKecamatan?: string;
}

export const FormAspirasiModal: React.FC<FormAspirasiModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultKecamatan,
}) => {
  const [tipePemangku, setTipePemangku] = useState<StakeholderType>('masyarakat');
  const [misiId, setMisiId] = useState<MisiRPJMD>('sdm_kesehatan');
  const [nama, setNama] = useState('');
  const [institusi, setInstitusi] = useState('');
  const [kecamatan, setKecamatan] = useState<string>(defaultKecamatan || KECAMATAN_TANGGAMUS[0]);
  const [pekon, setPekon] = useState<string>('');
  const [detailAlamat, setDetailAlamat] = useState<string>('');
  const [judul, setJudul] = useState('');
  const [ringkasan, setRingkasan] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [anggaranEstimasi, setAnggaranEstimasi] = useState('');
  const [bentukKolaborasi, setBentukKolaborasi] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (defaultKecamatan) {
      setKecamatan(defaultKecamatan);
      setPekon('');
    }
  }, [defaultKecamatan, isOpen]);

  const availablePekonList = kecamatan ? PEKON_TANGGAMUS_MAP[kecamatan] || [] : [];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !judul.trim() || !ringkasan.trim() || !deskripsi.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const generatedId = `ASP-2026-${Math.floor(100 + Math.random() * 900)}`;
      const newEntry: AspirasiPublik = {
        id: generatedId,
        judul,
        ringkasan,
        deskripsiLengkap: deskripsi,
        pengusulNama: nama,
        pengusulInstitusi: institusi || undefined,
        tipePemangku,
        misiId,
        kecamatan,
        pekon: pekon || undefined,
        detailAlamat: detailAlamat || undefined,
        tanggalDiajukan: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        dukunganSuara: 1,
        hasVoted: true,
        status: 'ditelaah',
        anggaranEstimasi: anggaranEstimasi || 'Dalam Kajian Teknis Pemda',
        bentukKolaborasiDitawarkan: bentukKolaborasi || 'Bersedia hadir dalam musrenbang kecamatan/tematik lanjutan.',
        tanggapanOPD: [
          {
            id: `TGP-${Date.now()}`,
            opdNama: 'Bapperida - Sekretariat Tim Penyusun RPJMD',
            pejabatNama: 'Tim Verifikasi Masukan Publik',
            pejabatJabatan: 'Verifikator Pokja Perencanaan',
            tanggal: new Date().toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }),
            isiTanggapan: 'Aspirasi telah diterima dan masuk ke dalam buku kendali telaah Renja Perangkat Daerah terkait.',
            statusPenetapan: 'ditelaah'
          }
        ],
        komentarPublik: []
      };

      onSubmit(newEntry);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 400);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setNama('');
    setInstitusi('');
    setPekon('');
    setDetailAlamat('');
    setJudul('');
    setRingkasan('');
    setDeskripsi('');
    setAnggaranEstimasi('');
    setBentukKolaborasi('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-emerald-900 font-semibold uppercase tracking-wider">
              Formulir Partisipasi Resmi
            </span>
            <h3 className="text-lg font-serif font-bold text-stone-900">
              Sampaikan Aspirasi & Usulan Program RPJMD
            </h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer text-base leading-none"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h4 className="text-xl font-serif font-bold text-stone-900">
              Aspirasi Berhasil Didaftarkan!
            </h4>
            <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              Usulan Anda telah tercatat dalam sistem kendali Bapperida dan langsung terbit di Ruang Rembuk Publik agar dapat didukung oleh warga lain.
            </p>
            <div className="pt-4">
              <button
                onClick={handleResetAndClose}
                className="px-6 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-sm"
              >
                Lihat di Daftar Aspirasi
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
            {/* Tipe Pemangku & Misi Target */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Kategori Pemangku Kepentingan *
                </label>
                <select
                  value={tipePemangku}
                  onChange={(e) => setTipePemangku(e.target.value as StakeholderType)}
                  className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                >
                  <option value="masyarakat">Masyarakat / Komunitas Warga</option>
                  <option value="swasta">Dunia Usaha / Asosiasi Bisnis</option>
                  <option value="akademisi">Akademisi / Peneliti Kampus</option>
                  <option value="oms">Organisasi Masyarakat Sipil (OMS)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Misi RPJMD yang Dituju *
                </label>
                <select
                  value={misiId}
                  onChange={(e) => setMisiId(e.target.value as MisiRPJMD)}
                  className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                >
                  <option value="sdm_kesehatan">Misi 1: SDM Unggul & Kesehatan Universal</option>
                  <option value="ekonomi_umkm">Misi 2: Transformasi Ekonomi & UMKM</option>
                  <option value="infrastruktur_hijau">Misi 3: Infrastruktur & Lingkungan Hidup</option>
                  <option value="tata_kelola_digital">Misi 4: Tata Kelola & Digitalisasi</option>
                  <option value="sosial_budaya">Misi 5: Ketahanan Sosial & Inklusi</option>
                </select>
              </div>
            </div>

            {/* Profil Pengusul: Nama & Institusi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nama Lengkap Pengusul *
                </label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Institusi / Asosiasi / RT/RW
                </label>
                <input
                  type="text"
                  value={institusi}
                  onChange={(e) => setInstitusi(e.target.value)}
                  placeholder="Contoh: Forum Warga / Kadin / Karang Taruna"
                  className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>
            </div>

            {/* Lokus Wilayah Usulan: Kecamatan & Pekon Sejajar, Detail Alamat Selebar 2 Kolom di Bawahnya */}
            <div className="space-y-3 p-3.5 bg-stone-50/90 rounded-xl border border-stone-200">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-stone-800">
                  Lokus Wilayah Usulan (Kecamatan / Pekon) *
                </label>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Kabupaten Tanggamus
                </span>
              </div>

              {/* Baris 1: Kolom 1 (Kecamatan) dan Kolom 2 (Desa / Pekon) Sejajar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    1. Kecamatan di Tanggamus *
                  </label>
                  <select
                    required
                    value={kecamatan}
                    onChange={(e) => {
                      setKecamatan(e.target.value);
                      setPekon('');
                    }}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 text-xs shadow-2xs font-medium"
                  >
                    <option value="">-- Pilih Kecamatan --</option>
                    {KECAMATAN_TANGGAMUS.map((kec) => (
                      <option key={kec} value={kec}>
                        {kec}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    2. Desa / Pekon di Tanggamus *
                  </label>
                  <select
                    value={pekon}
                    onChange={(e) => setPekon(e.target.value)}
                    disabled={!kecamatan}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 text-xs disabled:bg-stone-100 disabled:text-stone-400 shadow-2xs font-medium"
                  >
                    <option value="">{kecamatan ? '-- Pilih Pekon / Desa --' : '-- Pilih Kecamatan Dulu --'}</option>
                    {availablePekonList.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                    <option value="Seluruh Pekon di Wilayah Kecamatan">Seluruh Pekon di Wilayah Kecamatan</option>
                  </select>
                </div>
              </div>

              {/* Baris 2: Kolom 3 (Detail Alamat) di bawah kolom pertama & kedua dengan ukuran penuh selebar 2 kolom di atas */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  3. Detail Alamat
                </label>
                <input
                  type="text"
                  value={detailAlamat}
                  onChange={(e) => setDetailAlamat(e.target.value)}
                  placeholder="Contoh: Dusun Sukamaju RT 03, Jl. Lintas Barat Km 45, dekat Balai Pertemuan..."
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 text-xs shadow-2xs"
                />
                <p className="text-[10px] text-stone-500 mt-1">
                  Tuliskan nama dusun, RT/RW, jalan poros pekon, atau penanda geografis spesifik lokus usulan program.
                </p>
              </div>
            </div>

            {/* Judul & Ringkasan */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Judul Program / Usulan *
              </label>
              <input
                type="text"
                required
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Contoh: Pengadaan Fasilitas Pengolahan Sampah Organik Terpadu Tingkat Pekon"
                className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Ringkasan Usulan (1-2 kalimat) *
              </label>
              <input
                type="text"
                required
                value={ringkasan}
                onChange={(e) => setRingkasan(e.target.value)}
                placeholder="Jelaskan secara singkat esensi solusi dan target penerima manfaat..."
                className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
              />
            </div>

            {/* Deskripsi Lengkap */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Uraian Latar Belakang Masalah & Solusi Nyata *
              </label>
              <textarea
                required
                rows={4}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Jelaskan secara rinci permasalahan yang dihadapi, mengapa perlu masuk ke RPJMD, serta bagaimana program ini harus dieksekusi oleh Pemda..."
                className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 leading-relaxed"
              />
            </div>

            {/* Kolaborasi & Estimasi Anggaran */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Estimasi Anggaran / Skema Pembiayaan
                </label>
                <input
                  type="text"
                  value={anggaranEstimasi}
                  onChange={(e) => setAnggaranEstimasi(e.target.value)}
                  placeholder="Misal: Rp 450 Juta / Swadaya / CSR / APBD Murni"
                  className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Bentuk Sinergi / Kolaborasi yang Ditawarkan
                </label>
                <input
                  type="text"
                  value={bentukKolaborasi}
                  onChange={(e) => setBentukKolaborasi(e.target.value)}
                  placeholder="Misal: Penyediaan tenaga relawan / Hibah lahan / Pendampingan lab"
                  className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>
            </div>

            {/* Form Footer Action */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-white border border-stone-300 rounded transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-950 rounded transition-colors cursor-pointer shadow-xs"
              >
                {isSubmitting ? 'Memproses...' : 'Kirim Aspirasi ke Bapperida'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
