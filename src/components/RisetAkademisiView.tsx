import React, { useState, useEffect } from 'react';
import { RisetAkademisi, MisiRPJMD } from '../types';
import { MISI_LABELS } from '../data/mockData';

interface RisetAkademisiViewProps {
  risetList: RisetAkademisi[];
  onSubmitRiset: (newRiset: RisetAkademisi) => void;
  openSubmitModal?: boolean;
  onCloseSubmitModal?: () => void;
}

export const RisetAkademisiView: React.FC<RisetAkademisiViewProps> = ({
  risetList,
  onSubmitRiset,
  openSubmitModal,
  onCloseSubmitModal,
}) => {
  const [selectedRiset, setSelectedRiset] = useState<RisetAkademisi | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [filterMisi, setFilterMisi] = useState<string>('all');

  useEffect(() => {
    if (openSubmitModal) {
      setShowSubmitModal(true);
    }
  }, [openSubmitModal]);

  const handleCloseModal = () => {
    setShowSubmitModal(false);
    if (onCloseSubmitModal) {
      onCloseSubmitModal();
    }
  };

  // Form states
  const [judul, setJudul] = useState('');
  const [penulis, setPenulis] = useState('');
  const [univ, setUniv] = useState('');
  const [fakultas, setFakultas] = useState('');
  const [misi, setMisi] = useState<MisiRPJMD>('sdm_kesehatan');
  const [ringkasan, setRingkasan] = useState('');
  const [rekomendasi, setRekomendasi] = useState('');
  const [linkGoogleDrive, setLinkGoogleDrive] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const filteredRiset = risetList.filter((item) => {
    if (filterMisi !== 'all' && item.misiId !== filterMisi) return false;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !penulis.trim() || !univ.trim() || !ringkasan.trim()) return;

    const rekArray = rekomendasi
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const newEntry: RisetAkademisi = {
      id: `RST-0${risetList.length + 1}`,
      judulKajian: judul,
      penulis,
      universitas: univ,
      fakultas,
      tahun: 2026,
      misiId: misi,
      ringkasanEksekutif: ringkasan,
      rekomendasiKunci: rekArray.length > 0 ? rekArray : ['Kajian integrasi Renja OPD'],
      statusAdopsi: 'dalam_kajian',
      opdPengkaji: 'Bapperida Tanggamus',
      jumlahUnduhan: 0,
      urlDokumen: linkGoogleDrive.trim() || undefined
    };

    onSubmitRiset(newEntry);
    setIsSuccess(true);
    setTimeout(() => {
      handleCloseModal();
      setIsSuccess(false);
      setJudul('');
      setPenulis('');
      setUniv('');
      setFakultas('');
      setRingkasan('');
      setRekomendasi('');
      setLinkGoogleDrive('');
    }, 1200);
  };

  return (
    <div id="kajian-ilmiah" className="space-y-8 scroll-mt-24">
      {/* Editorial Header */}
      <div className="pb-4 border-b border-stone-200 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 uppercase tracking-wider mb-1">
            <span>Pilar Akademisi & Riset Terapan</span>
            <span aria-hidden="true">•</span>
            <span>Evidence-Based Policy Making Tanggamus</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
            Hub Kajian Ilmiah & Naskah Kebijakan RPJMD
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
            Menghubungkan riset perguruan tinggi dengan instrumen perencanaan daerah. Setiap policy brief yang diajukan melewati review pokja Bapperida untuk dinilai kelayakan integrasinya dalam naskah RPJMD.
          </p>
        </div>
        <button
          onClick={() => setShowSubmitModal(true)}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-950 rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
        >
          + Daftarkan Policy Brief dan Policy Paper
        </button>
      </div>

      {/* Filter Misi */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        <span className="text-stone-500 font-medium">Bidang Kajian:</span>
        {[
          { id: 'all', label: 'Semua Bidang Kajian' },
          { id: 'sdm_kesehatan', label: 'Kesehatan & SDM' },
          { id: 'ekonomi_umkm', label: 'Ekonomi Kerakyatan' },
          { id: 'infrastruktur_hijau', label: 'Drainase & Ekologi' },
          { id: 'tata_kelola_digital', label: 'Fiskal & Tata Kelola' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterMisi(tab.id)}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer whitespace-nowrap ${
              filterMisi === tab.id
                ? 'bg-stone-900 text-white font-medium'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of Research Papers */}
      <div className="space-y-4">
        {filteredRiset.map((paper) => (
          <article
            key={paper.id}
            className="p-5 bg-white rounded-lg border border-stone-200 hover:border-stone-300 transition-all"
          >
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mb-2">
              <span className="font-semibold text-emerald-900">{paper.universitas}</span>
              <span aria-hidden="true">•</span>
              <span>{paper.fakultas}</span>
              <span aria-hidden="true">•</span>
              <span>{MISI_LABELS[paper.misiId]?.nomor}</span>
              <span aria-hidden="true">•</span>
              <span className="font-mono tabular-nums">Tahun {paper.tahun}</span>
              <span aria-hidden="true">•</span>
              <span className={`font-semibold ${
                paper.statusAdopsi === 'diadopsi_rkpd' ? 'text-emerald-800' : 'text-stone-700'
              }`}>
                {paper.statusAdopsi === 'diadopsi_rkpd' ? '✓ Diadopsi Masuk RKPD' : 'Sedang Dikaji Tim Litbang'}
              </span>
            </div>

            <h3
              onClick={() => setSelectedRiset(paper)}
              className="text-lg font-serif font-bold text-stone-900 hover:text-emerald-900 transition-colors cursor-pointer leading-snug"
            >
              {paper.judulKajian}
            </h3>

            <p className="text-xs text-stone-500 mt-1 italic">
              Penulis: {paper.penulis}
            </p>

            <p className="text-xs sm:text-sm text-stone-700 mt-3 leading-relaxed">
              {paper.ringkasanEksekutif}
            </p>

            {/* Rekomendasi Kunci Box */}
            <div className="mt-4 p-3.5 bg-stone-50 rounded border border-stone-200/70 text-xs">
              <p className="font-semibold text-stone-800 uppercase tracking-wide text-[11px] mb-1.5">
                Rekomendasi Kebijakan Kunci untuk Pemda:
              </p>
              <ul className="space-y-1 text-stone-700">
                {paper.rekomendasiKunci.map((rek, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-800 font-bold">•</span>
                    <span>{rek}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Row */}
            <div className="mt-4 pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="text-stone-500">
                Ditinjau oleh OPD: <strong className="text-stone-800">{paper.opdPengkaji}</strong>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {paper.urlDokumen && paper.urlDokumen.startsWith('http') && (
                  <a
                    href={paper.urlDokumen}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded flex items-center gap-1.5 transition-colors"
                    title="Buka Naskah Asli di Google Drive"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.71 3.5L1.15 15l3.43 6h6.56l-6.43-11.2L7.71 3.5zm3.71.5h7.16l5.72 10-3.43 6H13.7l6-10.5-4.57-5.5zm-5.42 16.5l3.43-6h13.14l-3.43 6H6z"/>
                    </svg>
                    <span>Google Drive ↗</span>
                  </a>
                )}
                <span className="text-stone-500 font-mono tabular-nums">
                  {paper.jumlahUnduhan} Kali Diunduh
                </span>
                <button
                  onClick={() => setSelectedRiset(paper)}
                  className="px-3 py-1.5 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded transition-colors cursor-pointer whitespace-nowrap"
                >
                  Detail Naskah & Sitasi →
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedRiset && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-900 font-semibold">
                Naskah Kajian {selectedRiset.id}
              </span>
              <button
                onClick={() => setSelectedRiset(null)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-stone-700 max-h-[70vh] overflow-y-auto leading-relaxed">
              <h3 className="text-xl font-serif font-bold text-stone-900 leading-snug">
                {selectedRiset.judulKajian}
              </h3>
              <div className="p-3 bg-stone-50 rounded border border-stone-200">
                <p className="font-semibold text-stone-800">{selectedRiset.penulis}</p>
                <p className="text-stone-500">{selectedRiset.fakultas}, {selectedRiset.universitas}</p>
              </div>
              <div>
                <h4 className="font-semibold text-stone-900 uppercase text-[11px] mb-1">Abstrak / Ringkasan Eksekutif</h4>
                <p className="text-stone-700">{selectedRiset.ringkasanEksekutif}</p>
              </div>
              <div>
                <h4 className="font-semibold text-stone-900 uppercase text-[11px] mb-1.5">Matriks Rekomendasi Terhadap RPJMD</h4>
                <div className="space-y-1.5">
                  {selectedRiset.rekomendasiKunci.map((rek, i) => (
                    <div key={i} className="p-2.5 bg-emerald-50/50 border border-emerald-200/60 rounded">
                      <strong className="text-emerald-950">Poin 0{i + 1}:</strong> {rek}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-3 bg-stone-100 rounded text-stone-600 text-[11px]">
                <strong>Cara Mengutip (Citation Format):</strong><br />
                {selectedRiset.penulis} ({selectedRiset.tahun}). <em>{selectedRiset.judulKajian}</em>. Repository Kajian Bapperida Kabupaten Tanggamus & LPPM {selectedRiset.universitas}.
              </div>
            </div>

            <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  const content = `POLICY BRIEF & KAJIAN AKADEMIS RPJMD KABUPATEN TANGGAMUS
Judul: ${selectedRiset.judulKajian}
Penulis: ${selectedRiset.penulis} (${selectedRiset.universitas}) - ${selectedRiset.fakultas}
Tahun: ${selectedRiset.tahun}
Fokus Misi RPJMD: ${selectedRiset.misiId}
Status Adopsi: ${selectedRiset.statusAdopsi}
OPD Pengkaji: ${selectedRiset.opdPengkaji}

RINGKASAN EKSEKUTIF:
${selectedRiset.ringkasanEksekutif}

REKOMENDASI KUNCI:
${selectedRiset.rekomendasiKunci.map((r: string, i: number) => `${i + 1}. ${r}`).join('\n')}

Format Sitasi:
${selectedRiset.penulis} (${selectedRiset.tahun}). ${selectedRiset.judulKajian}. Repository Bapperida Kabupaten Tanggamus.`;
                  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `PolicyBrief_${selectedRiset.id}.txt`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className="px-4 py-1.5 bg-emerald-900 text-white rounded font-semibold hover:bg-emerald-950 text-xs cursor-pointer shadow-2xs"
              >
                Unduh Policy Brief
              </button>
              {selectedRiset.urlDokumen && selectedRiset.urlDokumen.startsWith('http') && (
                <a
                  href={selectedRiset.urlDokumen}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-900 rounded font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.71 3.5L1.15 15l3.43 6h6.56l-6.43-11.2L7.71 3.5zm3.71.5h7.16l5.72 10-3.43 6H13.7l6-10.5-4.57-5.5zm-5.42 16.5l3.43-6h13.14l-3.43 6H6z"/>
                  </svg>
                  <span>Buka di Google Drive ↗</span>
                </a>
              )}
              <button
                onClick={() => setSelectedRiset(null)}
                className="px-3.5 py-1.5 bg-white border border-stone-300 rounded text-stone-700 hover:bg-stone-50 text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-stone-900">
                Registrasi Naskah Kajian / Policy Brief Akademisi
              </h3>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {isSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-lg font-bold">✓</div>
                <h4 className="text-lg font-serif font-bold text-stone-900">Naskah Berhasil Diunggah!</h4>
                <p className="text-xs text-stone-600">Tim Litbang Bapperida Tanggamus akan mereviu relevansi kajian terhadap bab program prioritas RPJMD.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Judul Kajian / Policy Brief / Policy Paper *</label>
                  <input
                    type="text"
                    required
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    placeholder="Contoh: Evaluasi Kebijakan Tarif Air Bersih dan Subsidi Silang Penduduk Rentan"
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Nama Peneliti Utama / Tim *</label>
                    <input
                      type="text"
                      required
                      value={penulis}
                      onChange={(e) => setPenulis(e.target.value)}
                      placeholder="Contoh: Dr. Ir. Gunawan, M.T."
                      className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Asal Universitas / Lembaga *</label>
                    <input
                      type="text"
                      required
                      value={univ}
                      onChange={(e) => setUniv(e.target.value)}
                      placeholder="Contoh: Universitas Lampung (Unila) / ITERA / UGM"
                      className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Fakultas / Pusat Studi</label>
                    <input
                      type="text"
                      value={fakultas}
                      onChange={(e) => setFakultas(e.target.value)}
                      placeholder="Contoh: Fakultas Teknik Lingkungan"
                      className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Misi RPJMD Terkait *</label>
                    <select
                      value={misi}
                      onChange={(e) => setMisi(e.target.value as MisiRPJMD)}
                      className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    >
                      <option value="sdm_kesehatan">Misi 1: SDM Unggul & Kesehatan</option>
                      <option value="ekonomi_umkm">Misi 2: Ekonomi & UMKM</option>
                      <option value="infrastruktur_hijau">Misi 3: Infrastruktur & Ekologi</option>
                      <option value="tata_kelola_digital">Misi 4: Tata Kelola & Digitalisasi</option>
                      <option value="sosial_budaya">Misi 5: Ketahanan Sosial</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Ringkasan Eksekutif Temuan Riset *</label>
                  <textarea
                    required
                    rows={3}
                    value={ringkasan}
                    onChange={(e) => setRingkasan(e.target.value)}
                    placeholder="Uraikan metode, data empiris yang ditemukan, serta signifikansi dampaknya..."
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Rekomendasi Kebijakan Spesifik (Pisahkan dengan baris baru)</label>
                  <textarea
                    rows={2}
                    value={rekomendasi}
                    onChange={(e) => setRekomendasi(e.target.value)}
                    placeholder="Contoh:&#10;1. Revisi Perda Pengelolaan Air Tanah&#10;2. Penambahan alokasi subsidi silang pelanggan R-1"
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-stone-700">
                      Link Google Drive Naskah Kajian / Policy Brief (PDF/DOCX)
                    </label>
                    <span className="text-[10px] text-stone-400 font-mono">Lampiran Berkas Asli</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-emerald-700">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.71 3.5L1.15 15l3.43 6h6.56l-6.43-11.2L7.71 3.5zm3.71.5h7.16l5.72 10-3.43 6H13.7l6-10.5-4.57-5.5zm-5.42 16.5l3.43-6h13.14l-3.43 6H6z"/>
                      </svg>
                    </div>
                    <input
                      type="url"
                      value={linkGoogleDrive}
                      onChange={(e) => setLinkGoogleDrive(e.target.value)}
                      placeholder="https://drive.google.com/file/d/... atau https://docs.google.com/..."
                      className="w-full bg-white border border-stone-300 rounded pl-9 pr-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
                    <span>💡</span>
                    <span>Pastikan link disetel <strong>"Siapa saja yang memiliki link dapat melihat (Anyone with link can view)"</strong>.</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-3.5 py-1.5 text-stone-700 bg-white border border-stone-300 rounded hover:bg-stone-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-900 text-white rounded font-semibold hover:bg-emerald-950 cursor-pointer"
                  >
                    Unggah Naskah Kebijakan
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
