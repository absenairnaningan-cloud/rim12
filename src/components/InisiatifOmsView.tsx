import React, { useState, useEffect } from 'react';
import { InisiatifOMS } from '../types';
import { MISI_LABELS, KECAMATAN_TANGGAMUS, PEKON_TANGGAMUS_MAP } from '../data/mockData';
import communityImg from '../assets/images/community_initiative.jpg';

interface InisiatifOmsViewProps {
  omsList: InisiatifOMS[];
  onAddInisiatif: (newInit: InisiatifOMS) => void;
  openSubmitModal?: boolean;
  onCloseSubmitModal?: () => void;
}

export const InisiatifOmsView: React.FC<InisiatifOmsViewProps> = ({
  omsList,
  onAddInisiatif,
  openSubmitModal,
  onCloseSubmitModal,
}) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (openSubmitModal) {
      setShowModal(true);
    }
  }, [openSubmitModal]);

  const handleCloseModal = () => {
    setShowModal(false);
    if (onCloseSubmitModal) {
      onCloseSubmitModal();
    }
  };

  const [namaOrg, setNamaOrg] = useState('');
  const [fokus, setFokus] = useState('');
  const [judul, setJudul] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState('');
  const [selectedPekon, setSelectedPekon] = useState('');
  const [detailAlamat, setDetailAlamat] = useState('');
  const [sasaran, setSasaran] = useState('');
  const [capaian, setCapaian] = useState('');
  const [tuntutan, setTuntutan] = useState('');
  const [kontak, setKontak] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const availablePekonList = selectedKecamatan ? PEKON_TANGGAMUS_MAP[selectedKecamatan] || [] : [];

  const handleKecamatanChange = (kec: string) => {
    setSelectedKecamatan(kec);
    setSelectedPekon('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaOrg.trim() || !judul.trim() || !tuntutan.trim()) return;

    const wilayahGabungan = [
      selectedPekon,
      selectedKecamatan,
      detailAlamat ? `(${detailAlamat})` : ''
    ].filter(Boolean).join(', ') || 'Kabupaten Tanggamus';

    const newEntry: InisiatifOMS = {
      id: `OMS-0${omsList.length + 1}`,
      namaOrganisasi: namaOrg,
      fokusAdvokasi: fokus || 'Inklusi Sosial & Tata Kelola Partisipatif',
      judulInisiatif: judul,
      misiId: 'sosial_budaya',
      wilayahDampingan: wilayahGabungan,
      kelompokSasaran: sasaran || 'Masyarakat rentan dan marjinal',
      hasilCapaian: capaian || 'Inisiatif rintisan komunitas berjalan swadaya',
      tuntutanKebijakan: tuntutan,
      responPemda: 'Diterima oleh Sekretariat Bapperida Tanggamus untuk disinkronkan dalam agenda Musrenbang Tematik Kelompok Rentan.',
      kontakPerson: kontak || 'Narahubung Komunitas',
      tanggalMulai: 'Tahun 2026 - Aktif'
    };

    onAddInisiatif(newEntry);
    setIsSuccess(true);
    setTimeout(() => {
      handleCloseModal();
      setIsSuccess(false);
      setNamaOrg('');
      setFokus('');
      setJudul('');
      setSelectedKecamatan('');
      setSelectedPekon('');
      setDetailAlamat('');
      setSasaran('');
      setCapaian('');
      setTuntutan('');
      setKontak('');
    }, 1200);
  };

  return (
    <div id="inisiatif-oms" className="space-y-8 scroll-mt-24">
      {/* Editorial Header */}
      <div className="pb-4 border-b border-stone-200 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 uppercase tracking-wider mb-1">
            <span>Pilar Organisasi Masyarakat Sipil & Komunitas</span>
            <span aria-hidden="true">•</span>
            <span>Inklusi, Keadilan Iklim & Pengawasan Tata Kelola</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
            Ruang Inisiatif & Advokasi Masyarakat Sipil
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
            Menghimpun aksi akar rumput yang digerakkan oleh OMS, yayasan nirlaba, komunitas difabel, forum anak, dan pegiat lingkungan untuk memastikan RPJMD berpihak nyata kepada kelompok yang rentan termarjinalkan.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-950 rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
        >
          + Daftarkan Inisiatif Komunitas
        </button>
      </div>

      {/* Featured Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 rounded-xl border border-stone-300/80 bg-white overflow-hidden shadow-xs items-center">
        <div className="lg:col-span-6 relative bg-stone-100/80 flex items-center justify-center p-3 sm:p-4.5 overflow-hidden">
          <img
            src={communityImg}
            alt="Komunitas Sipil dan Warga Berkolaborasi"
            className="w-full h-auto max-h-[380px] object-contain rounded-lg shadow-xs"
          />
        </div>
        <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
              <span>Prinsip "No One Left Behind"</span>
              <span aria-hidden="true">•</span>
              <span>SDGs Desa & Perkotaan</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-stone-900">
              Menjembatani Suara Komunitas ke Dalam Anggaran Daerah
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Advokasi OMS tidak boleh hanya berhenti pada spanduk atau petisi. Portal ini menyediakan format 'Tuntutan Kebijakan vs Respon OPD' yang mewajibkan pemerintah daerah memberikan tanggapan resmi dan terikat dalam penyusunan Rencana Kerja (Renja) tahunan.
            </p>
          </div>

          <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center gap-6 text-xs text-stone-700">
            <div>
              <p className="text-stone-400 font-medium uppercase text-[10px]">Komunitas Terdaftar</p>
              <p className="text-lg font-bold font-mono text-emerald-900 tabular-nums">72 Lembaga / OMS</p>
            </div>
            <div>
              <p className="text-stone-400 font-medium uppercase text-[10px]">Warga Penerima Manfaat</p>
              <p className="text-lg font-bold font-mono text-stone-900 tabular-nums">14.200+ Jiwa</p>
            </div>
            <div>
              <p className="text-stone-400 font-medium uppercase text-[10px]">Tingkat Adopsi Regulasi</p>
              <p className="text-lg font-bold font-mono text-emerald-900 tabular-nums">76,8% Perda/Perbup</p>
            </div>
          </div>
        </div>
      </div>

      {/* List of Initiatives */}
      <div className="space-y-6">
        <h3 className="text-lg font-serif font-bold text-stone-900">
          Inisiatif Komunitas & Lacak Respon Pemerintah Daerah
        </h3>

        <div className="space-y-4">
          {omsList.map((init) => (
            <div
              key={init.id}
              className="p-6 bg-white rounded-lg border border-stone-200 hover:border-stone-300 transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-stone-500">
                  <span className="font-bold text-emerald-900">{init.namaOrganisasi}</span>
                  <span aria-hidden="true">•</span>
                  <span>{init.fokusAdvokasi}</span>
                  <span aria-hidden="true">•</span>
                  <span>{MISI_LABELS[init.misiId]?.nomor}</span>
                </div>
                <span className="text-stone-400 font-mono text-[11px]">{init.tanggalMulai}</span>
              </div>

              {/* Title & Core Activity */}
              <div>
                <h4 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                  {init.judulInisiatif}
                </h4>
                <p className="text-xs text-stone-600 mt-1">
                  <strong>Wilayah Gerakan:</strong> {init.wilayahDampingan} • <strong>Sasaran:</strong> {init.kelompokSasaran}
                </p>
              </div>

              {/* Output / Capaian Lapangan */}
              <div className="p-3 bg-stone-50 rounded border border-stone-200/80 text-xs">
                <span className="text-stone-500 font-semibold uppercase text-[10px] block mb-1">
                  Bukti Capaian Lapangan yang Telah Dihasilkan:
                </span>
                <p className="text-stone-800 leading-relaxed font-medium">
                  {init.hasilCapaian}
                </p>
              </div>

              {/* Two Column Grid: Tuntutan Kebijakan vs Respon Pemda */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-lg">
                  <span className="text-amber-950 font-bold uppercase tracking-wide text-[10px] block mb-1">
                    Tuntutan Mandat ke Dokumen RPJMD:
                  </span>
                  <p className="text-stone-800 leading-relaxed">
                    "{init.tuntutanKebijakan}"
                  </p>
                </div>

                <div className="p-3.5 bg-emerald-50/80 border border-emerald-200/90 rounded-lg">
                  <span className="text-emerald-950 font-bold uppercase tracking-wide text-[10px] block mb-1">
                    Respon & Komitmen Resmi Pemda:
                  </span>
                  <p className="text-stone-800 leading-relaxed">
                    "{init.responPemda}"
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-100">
                <span>Narahubung Advokasi: {init.kontakPerson}</span>
                <span className="font-mono text-emerald-800 font-medium">✓ Terverifikasi Tim Partisipasi Daerah</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-stone-900">
                Registrasi Inisiatif Komunitas / Organisasi Masyarakat Sipil
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer">✕</button>
            </div>

            {isSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-lg font-bold">✓</div>
                <h4 className="text-lg font-serif font-bold text-stone-900">Inisiatif Terdaftar!</h4>
                <p className="text-xs text-stone-600">Bapperida Tanggamus akan memasukkan tuntutan kebijakan Anda ke dalam matriks Musrenbang Tematik.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Nama Organisasi / Komunitas *</label>
                    <input
                      type="text"
                      required
                      value={namaOrg}
                      onChange={(e) => setNamaOrg(e.target.value)}
                      placeholder="Contoh: Yayasan Lingkar Inklusi"
                      className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Fokus Bidang Advokasi *</label>
                    <input
                      type="text"
                      required
                      value={fokus}
                      onChange={(e) => setFokus(e.target.value)}
                      placeholder="Contoh: Hak Disabilitas / Kelestarian DAS"
                      className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Judul Gerakan / Inisiatif Komunitas *</label>
                  <input
                    type="text"
                    required
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    placeholder="Contoh: Gerakan Bersih Selokan & Pemilahan Sampah Mandiri di Pekon"
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>

                {/* Wilayah Dampingan: Kecamatan & Pekon Sejajar, Detail Alamat Selebar 2 Kolom di Bawahnya */}
                <div className="space-y-3 p-3.5 bg-stone-50/90 rounded-xl border border-stone-200">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-stone-800">
                      Wilayah Dampingan (Kecamatan / Pekon) *
                    </label>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Lokus Tanggamus
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
                        value={selectedKecamatan}
                        onChange={(e) => handleKecamatanChange(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 text-xs shadow-2xs font-medium"
                      >
                        <option value="">-- Pilih Kecamatan --</option>
                        {KECAMATAN_TANGGAMUS.map((kec) => (
                          <option key={kec} value={kec}>{kec}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        2. Desa / Pekon di Tanggamus *
                      </label>
                      <select
                        required
                        value={selectedPekon}
                        onChange={(e) => setSelectedPekon(e.target.value)}
                        disabled={!selectedKecamatan}
                        className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 text-xs disabled:bg-stone-100 disabled:text-stone-400 shadow-2xs font-medium"
                      >
                        <option value="">{selectedKecamatan ? '-- Pilih Pekon / Desa --' : '-- Pilih Kecamatan Dulu --'}</option>
                        {availablePekonList.map((pekon) => (
                          <option key={pekon} value={pekon}>{pekon}</option>
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
                      placeholder="Contoh: RT 02 / Dusun Sinar Baru, Jalur Lintas Barat Km 12..."
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 text-xs shadow-2xs"
                    />
                    <p className="text-[10px] text-stone-500 mt-1">
                      Tuliskan nama dusun, RT/RW, atau penanda geografis spesifik wilayah dampingan kegiatan.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Kelompok Sasaran Penerima Manfaat</label>
                  <input
                    type="text"
                    value={sasaran}
                    onChange={(e) => setSasaran(e.target.value)}
                    placeholder="Contoh: 400 Kepala Keluarga Prasejahtera"
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Bukti Capaian Lapangan Swadaya yang Telah Ada</label>
                  <textarea
                    rows={2}
                    value={capaian}
                    onChange={(e) => setCapaian(e.target.value)}
                    placeholder="Contoh: Telah melatih 60 kader lingkungan dan mengurangi 2 ton timbulan sampah..."
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Tuntutan Kebijakan / Program ke dalam Dokumen RPJMD *</label>
                  <textarea
                    required
                    rows={2}
                    value={tuntutan}
                    onChange={(e) => setTuntutan(e.target.value)}
                    placeholder="Sebutkan pasal, arah kebijakan, atau alokasi anggaran yang diharapkan dari Pemda..."
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Narahubung & Nomor Kontak</label>
                  <input
                    type="text"
                    value={kontak}
                    onChange={(e) => setKontak(e.target.value)}
                    placeholder="Nama Koordinator & HP (Contoh: Rian - 081234xxx)"
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-3.5 py-1.5 text-stone-700 bg-white border border-stone-300 rounded hover:bg-stone-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-900 text-white rounded font-semibold hover:bg-emerald-950 cursor-pointer"
                  >
                    Simpan Inisiatif Komunitas
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
