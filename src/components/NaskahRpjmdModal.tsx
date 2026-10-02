import React, { useState, useEffect } from 'react';

const GOOGLE_DRIVE_RPJMD_URL = 'https://drive.google.com/drive/folders/1RMzU0FivUeGJZvDJUUkwLrScRO-pa4Gr';

interface NaskahRpjmdModalProps {
  isOpen: boolean;
  onClose: () => void;
  externalPdfUrl?: string;
  onUpdatePdfUrl?: (newUrl: string) => void;
}

export const NaskahRpjmdModal: React.FC<NaskahRpjmdModalProps> = ({
  isOpen,
  onClose,
  externalPdfUrl = GOOGLE_DRIVE_RPJMD_URL,
  onUpdatePdfUrl
}) => {
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'batang_tubuh' | 'sistematika' | 'unduh'>('ringkasan');
  const [isCopied, setIsCopied] = useState(false);
  const [customUrl, setCustomUrl] = useState(externalPdfUrl || GOOGLE_DRIVE_RPJMD_URL);
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (externalPdfUrl) {
      setCustomUrl(externalPdfUrl);
    }
  }, [externalPdfUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(customUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdatePdfUrl && customUrl.trim()) {
      onUpdatePdfUrl(customUrl.trim());
    }
    setIsEditingUrl(false);
  };

  const handleTriggerDownload = () => {
    setIsDownloading(true);
    const documentContent = `================================================================================
PERATURAN DAERAH KABUPATEN TANGGAMUS
NOMOR 7 TAHUN 2025
TENTANG
RENCANA PEMBANGUNAN JANGKA MENENGAH DAERAH (RPJMD)
KABUPATEN TANGGAMUS TAHUN 2025–2029
================================================================================

DENGAN RAHMAT TUHAN YANG MAHA ESA
BUPATI TANGGAMUS,

Menimbang: bahwa untuk melaksanakan ketentuan Pasal 264 ayat (1) Undang-Undang Nomor 23 Tahun 2014 
tentang Pemerintahan Daerah sebagaimana telah diubah beberapa kali terakhir dengan 
Undang-Undang Nomor 6 Tahun 2023 tentang Penetapan Peraturan Pemerintah Pengganti 
Undang-Undang Nomor 2 tahun 2022 tentang Cipta Kerja, perlu menetapkan Peraturan Daerah 
tentang Rencana Pembangunan Jangka Menengah Daerah Tahun 2025-2029;

Mengingat:
1. Pasal 18 ayat (6) UUD 1945;
2. UU No. 2 Tahun 1997 tentang Pembentukan Kabupaten Daerah Tingkat II Tanggamus;
3. UU No. 25 Tahun 2004 tentang Sistem Perencanaan Pembangunan Nasional;
4. UU No. 23 Tahun 2014 tentang Pemerintahan Daerah;
5. UU No. 59 Tahun 2024 tentang RPJPN 2025-2045;
6. Perpres No. 12 Tahun 2025 tentang RPJMN Tahun 2025-2029;
7. Permendagri No. 86 Tahun 2017 tentang Tata Cara Perencanaan, Pengendalian, dan Evaluasi;
8. Instruksi Mendagri No. 2 Tahun 2025 tentang Pedoman Penyusunan RPJMD 2025-2029;
9. Perda Provinsi Lampung No. 17 Tahun 2024 tentang RPJPD Lampung 2025-2045;
10. Perda Kabupaten Tanggamus No. 9 Tahun 2024 tentang RPJPD Tanggamus 2025-2045.

MEMUTUSKAN:
Menetapkan: PERATURAN DAERAH TENTANG RENCANA PEMBANGUNAN JANGKA MENENGAH DAERAH TAHUN 2025-2029.

--------------------------------------------------------------------------------
BAB I: KETENTUAN UMUM (Pasal 1)
BAB II: RENCANA PEMBANGUNAN JANGKA MENENGAH DAERAH (Pasal 2 - Pasal 3)
Sistematika RPJMD:
- Bab I : Pendahuluan
- Bab II : Gambaran Umum Kondisi Daerah
- Bab III : Visi, Misi, dan Program Prioritas Pembangunan Daerah
- Bab IV : Program Perangkat Daerah dan Kinerja Penyelenggaraan Pemerintah Daerah
- Bab V : Penutup

BAB III: PENGENDALIAN DAN EVALUASI (Pasal 4)
BAB IV: PERUBAHAN RENCANA PEMBANGUNAN JANGKA MENENGAH DAERAH (Pasal 5)
BAB V: KETENTUAN PENUTUP (Pasal 6)

Ditetapkan di Kota Agung pada tanggal: 19 Agustus 2025
BUPATI TANGGAMUS,
MOH. SALEH ASNAWI

Diundangkan di Kota Agung pada tanggal: 19 Agustus 2025
SEKRETARIS DAERAH KABUPATEN,
SUAIDI

LEMBARAN DAERAH KABUPATEN TANGGAMUS TAHUN 2025 NOMOR 237
================================================================================
Tautan Dokumen Utuh: ${customUrl}
Dikelola oleh: Badan Perencanaan Pembangunan, Riset dan Inovasi Daerah (BAPPERIDA) Kabupaten Tanggamus
`;

    const blob = new Blob([documentContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'PERDA_NO_7_2025_RPJMD_KABUPATEN_TANGGAMUS.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setTimeout(() => {
      setIsDownloading(false);
    }, 1200);
  };

  const handleOpenDirectUrl = () => {
    const targetUrl = customUrl || 'https://drive.google.com/drive/folders/1RMzU0FivUeGJZvDJUUkwLrScRO-pa4Gr';
    const a = document.createElement('a');
    a.href = targetUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl border border-stone-300 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER MODAL */}
        <div className="p-4 sm:p-6 bg-stone-900 text-white flex items-start justify-between gap-4 border-b border-stone-800">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-emerald-400">
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700/60 font-bold">
                DOKUMEN RESMI HUKUM DAERAH
              </span>
              <span>•</span>
              <span className="text-stone-300">LEMBARAN DAERAH TAHUN 2025 NOMOR 237</span>
            </div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-white tracking-tight">
              Peraturan Daerah Kabupaten Tanggamus Nomor 7 Tahun 2025
            </h2>
            <p className="text-xs text-stone-300 line-clamp-2">
              Tentang Rencana Pembangunan Jangka Menengah Daerah (RPJMD) Kabupaten Tanggamus Tahun 2025–2029. Ditetapkan oleh Bupati Tanggamus Moh. Saleh Asnawi.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer text-lg leading-none"
            title="Tutup Modal"
          >
            ✕
          </button>
        </div>

        {/* QUICK ACTION BAR */}
        <div className="bg-stone-50 px-4 sm:px-6 py-3 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('ringkasan')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'ringkasan'
                  ? 'bg-emerald-900 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
              }`}
            >
              Identitas & Ringkasan
            </button>
            <button
              onClick={() => setActiveTab('batang_tubuh')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'batang_tubuh'
                  ? 'bg-emerald-900 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
              }`}
            >
              Batang Tubuh Perda
            </button>
            <button
              onClick={() => setActiveTab('sistematika')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'sistematika'
                  ? 'bg-emerald-900 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
              }`}
            >
              Daftar Isi 5 Bab (532 Halaman)
            </button>
            <button
              onClick={() => setActiveTab('unduh')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'unduh'
                  ? 'bg-emerald-900 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
              }`}
            >
              Opsi Unduhan & Tautan
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerDownload}
              disabled={isDownloading}
              className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>{isDownloading ? 'Menyiapkan...' : 'Unduh Ringkasan Resmi'}</span>
            </button>
            <a
              href={customUrl || GOOGLE_DRIVE_RPJMD_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                try {
                  window.open(customUrl || GOOGLE_DRIVE_RPJMD_URL, '_blank', 'noopener,noreferrer');
                } catch {
                  // Fallback
                }
              }}
              className="px-3 py-1.5 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-900 rounded-lg font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer text-xs sm:text-sm"
              title="Buka Folder Google Drive Dokumen RPJMD Kabupaten Tanggamus"
            >
              <span>Buka Tautan Dokumen</span>
              <svg className="w-3.5 h-3.5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        {/* MODAL CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-stone-800 text-xs sm:text-sm">
          {/* TAB 1: IDENTITAS & RINGKASAN */}
          {activeTab === 'ringkasan' && (
            <div className="space-y-6">
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-950 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Keterangan Legalitas Peraturan Daerah</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-emerald-100">
                    <span className="text-stone-400 block text-[11px] font-mono">NOMOR & TAHUN</span>
                    <strong className="text-stone-900 font-serif text-sm">Perda No. 7 Tahun 2025</strong>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-emerald-100">
                    <span className="text-stone-400 block text-[11px] font-mono">LEMBARAN DAERAH</span>
                    <strong className="text-stone-900 font-serif text-sm">Nomor 237 Tahun 2025</strong>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-emerald-100">
                    <span className="text-stone-400 block text-[11px] font-mono">TANGGAL PENETAPAN</span>
                    <strong className="text-stone-900 font-serif text-sm">19 Agustus 2025</strong>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-emerald-100">
                    <span className="text-stone-400 block text-[11px] font-mono">PENETAP / KEPALA DAERAH</span>
                    <strong className="text-stone-900 font-serif text-sm">Moh. Saleh Asnawi</strong>
                  </div>
                </div>
              </div>

              {/* Visi Misi Highlight Card */}
              <div className="bg-stone-900 text-stone-200 p-5 rounded-xl border border-stone-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-emerald-400 font-bold uppercase tracking-wider">VISI DAERAH 2025–2029</span>
                  <span className="text-stone-500 font-mono">Bab III Halaman 1-5</span>
                </div>
                <blockquote className="text-base sm:text-lg font-serif font-bold text-white border-l-3 border-emerald-400 pl-3 italic">
                  "Bersama Tanggamus Maju Menuju Indonesia Emas"
                </blockquote>
                <p className="text-xs text-stone-300 leading-relaxed">
                  <strong>Bersama:</strong> Akronim dari Berdaya, Sejahtera, Adil, dan Bermartabat.<br />
                  <strong>Maju:</strong> Manifestasi daerah berdaya saing tinggi berbasis pengetahuan, inovasi, dan akar budaya (Modern, Tangguh, Inovatif, Berkelanjutan).
                </p>
                <div className="pt-3 border-t border-stone-800 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-stone-300">
                  <div className="bg-stone-800/80 p-2.5 rounded-lg border border-stone-700">
                    <strong className="text-emerald-300 block mb-1">1. TANGGAMUS SIGAP!</strong>
                    <span>Transformasi tata kelola pemerintahan yang responsif, partisipatif, kolaboratif & digital.</span>
                  </div>
                  <div className="bg-stone-800/80 p-2.5 rounded-lg border border-stone-700">
                    <strong className="text-amber-300 block mb-1">2. TANGGAMUS MAKMUR!</strong>
                    <span>Transformasi ekonomi kerakyatan, agropolitan, minapolitan, dan kepastian investasi.</span>
                  </div>
                  <div className="bg-stone-800/80 p-2.5 rounded-lg border border-stone-700">
                    <strong className="text-blue-300 block mb-1">3. TANGGAMUS NYAMAN!</strong>
                    <span>Transformasi sosial, layanan dasar inklusif, kerukunan budaya, dan ketangguhan bencana.</span>
                  </div>
                </div>
              </div>

              {/* Highlight Dokumen */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-stone-900 text-sm">
                  Substansi Pokok Naskah Utuh RPJMD
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <li className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <strong className="text-stone-900 block mb-0.5">5 Misi Panca Cita & 5 Prioritas Daerah:</strong>
                    Pendidikan & kesehatan, pertumbuhan ekonomi, pemerataan infrastruktur, reformasi birokrasi, dan lingkungan aman berkelanjutan.
                  </li>
                  <li className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <strong className="text-stone-900 block mb-0.5">Program Quick Wins:</strong>
                    Kartu Tanggamus Sehat, Kartu Tanggamus Cerdas, MBG (Makan Bergizi Gratis), dan Program TanggamusNet konektivitas wilayah.
                  </li>
                  <li className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <strong className="text-stone-900 block mb-0.5">4 Koridor Ekonomi Kewilayahan:</strong>
                    Koridor 1 (Tanaman Pangan & Minapolitan), Koridor 2 (Agroindustri & EBT Ulu Belu), Koridor 3 (Agropolitan Gisting), Koridor 4 (Industri Maritim & Wisata Semaka).
                  </li>
                  <li className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <strong className="text-stone-900 block mb-0.5">Pagu & Indikator Kinerja 2026–2030:</strong>
                    Memuat 20 Indikator Kinerja Utama (IKU), Indikator Kinerja Daerah (IKD), serta proyeksi APBD dan pagu indikatif perangkat daerah.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: BATANG TUBUH PERDA */}
          {activeTab === 'batang_tubuh' && (
            <div className="space-y-5 font-sans">
              <div className="text-center pb-4 border-b border-stone-200 space-y-1">
                <p className="text-xs font-mono text-stone-500 uppercase">SALINAN RESMI</p>
                <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                  PERATURAN DAERAH KABUPATEN TANGGAMUS
                </h3>
                <p className="text-xs font-mono font-semibold text-emerald-900">
                  NOMOR 7 TAHUN 2025
                </p>
                <p className="text-xs text-stone-600 max-w-xl mx-auto">
                  TENTANG RENCANA PEMBANGUNAN JANGKA MENENGAH DAERAH TAHUN 2025–2029
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-200 font-serif">
                <div>
                  <h5 className="font-bold text-stone-900">BAB I • KETENTUAN UMUM</h5>
                  <p className="mt-1">
                    <strong>Pasal 1:</strong> Dalam Peraturan Daerah ini yang dimaksud dengan Daerah adalah Kabupaten Tanggamus; Bupati adalah Bupati Tanggamus; Pemerintah Daerah adalah Pemerintah Kabupaten Tanggamus; RPJMD adalah dokumen perencanaan Daerah untuk periode 5 (lima) tahun; RKPD adalah rencana tahunan; Renstra-PD dan Renja-PD adalah dokumen perangkat daerah.
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-200">
                  <h5 className="font-bold text-stone-900">BAB II • RENCANA PEMBANGUNAN JANGKA MENENGAH DAERAH</h5>
                  <p className="mt-1">
                    <strong>Pasal 2:</strong> Program Pembangunan Daerah Periode Tahun 2025-2029 dilaksanakan sesuai dengan RPJMD Tahun 2025-2029 dengan sistematika: Bab I Pendahuluan; Bab II Gambaran Umum Daerah; Bab III Visi, Misi, dan Program Prioritas Pembangunan Daerah; Bab IV Program Perangkat Daerah dan Kinerja Penyelenggaraan Pemerintah Daerah; Bab V Penutup.
                  </p>
                  <p className="mt-1">
                    <strong>Pasal 3:</strong> RPJMD menjadi pedoman dalam penyusunan Renstra-PD dan RKPD.
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-200">
                  <h5 className="font-bold text-stone-900">BAB III • PENGENDALIAN DAN EVALUASI</h5>
                  <p className="mt-1">
                    <strong>Pasal 4:</strong> Pemerintah Daerah melakukan pengendalian dan evaluasi pelaksanaan RPJMD sesuai dengan ketentuan peraturan perundang-undangan.
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-200">
                  <h5 className="font-bold text-stone-900">BAB IV • PERUBAHAN RENCANA PEMBANGUNAN JANGKA MENENGAH DAERAH</h5>
                  <p className="mt-1">
                    <strong>Pasal 5:</strong> Perubahan RPJMD dapat dilakukan apabila hasil evaluasi tidak sesuai dengan perundang-undangan, substansi tidak sesuai, atau terjadi perubahan mendasar (bencana alam, goncangan politik, krisis ekonomi, perubahan kebijakan nasional). Tidak dapat dilakukan jika sisa masa berlaku kurang dari 3 (tiga) tahun.
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-200">
                  <h5 className="font-bold text-stone-900">BAB V • KETENTUAN PENUTUP</h5>
                  <p className="mt-1">
                    <strong>Pasal 6:</strong> Peraturan Daerah ini mulai berlaku pada tanggal diundangkan. Ditetapkan di Kota Agung pada tanggal 19 Agustus 2025 oleh Bupati Tanggamus MOH. SALEH ASNAWI dan diundangkan oleh Sekretaris Daerah SUAIDI (Lembaran Daerah Tahun 2025 Nomor 237).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SISTEMATIKA & DAFTAR ISI LENGKAP */}
          {activeTab === 'sistematika' && (
            <div className="space-y-4">
              <div className="p-3 bg-stone-100 rounded-lg border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
                <span>Total 532 Halaman Naskah Resmi Perda No. 7 Tahun 2025</span>
                <span className="font-mono text-emerald-800 font-bold">5 Bab + Lampiran Tabel</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-1">
                  <span className="font-mono text-emerald-800 font-bold">BAB I • PENDAHULUAN (Halaman I-1 s/d I-46)</span>
                  <p className="text-stone-700">
                    Latar belakang penyelenggaraan Pemilu Serentak 2024, dasar hukum perundangan, penyelarasan dengan RPJPN 2025-2045 & RPJMN 2025-2029, RTRW Provinsi & Kabupaten, integrasi KLHS 6 Isu Paling Strategis, serta maksud & tujuan penyusunan.
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-1">
                  <span className="font-mono text-emerald-800 font-bold">BAB II • GAMBARAN UMUM KONDISI DAERAH (Halaman II-1 s/d II-279)</span>
                  <p className="text-stone-700">
                    Geografi & demografi 20 kecamatan, 299 pekon, 3 kelurahan. Neraca keuangan daerah APBD 2020-2024, proyeksi kerangka pendanaan 2026-2030, SPM (Pendidikan, Kesehatan, PU, Perumahan, Trantibumlinmas, Sosial), kinerja 4 BUMD (BPRS, PDAM Way Agung, AUTJ, Bank Lampung), dan perumusan 9 isu strategis daerah.
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-1">
                  <span className="font-mono text-emerald-800 font-bold">BAB III • VISI, MISI, & PROGRAM PRIORITAS (Halaman III-1 s/d III-92)</span>
                  <p className="text-stone-700">
                    Visi "Bersama Tanggamus Maju Menuju Indonesia Emas", 5 Misi Panca Cita, 3 Fokus Kerja (Tanggamus Sigap, Makmur, Nyaman), 5 Program Quick Wins (Kartu Sehat, Cerdas, MBG, TanggamusNet), 4 Koridor Ekonomi, Penahapan Pembangunan 2025-2029, dan Cascading Kinerja ke Renstra PD.
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-1">
                  <span className="font-mono text-emerald-800 font-bold">BAB IV • PROGRAM PERANGKAT DAERAH & KINERJA (Halaman IV-1 s/d IV-77)</span>
                  <p className="text-stone-700">
                    Tabel matriks program perangkat daerah 2026–2030, pagu indikatif tahunan, 20 Indikator Kinerja Utama (IKU), Indikator Kinerja Daerah (IKD), IKK, dan penyandingan dukungan terhadap Prioritas Nasional Asta Cita serta Program Unggulan Provinsi Lampung.
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-1">
                  <span className="font-mono text-emerald-800 font-bold">BAB V • PENUTUP & KAIDAH PELAKSANAAN (Halaman V-1 s/d V-7)</span>
                  <p className="text-stone-700">
                    Kaidah pelaksanaan berbasis Kerangka Kerja Logis (KKL) dan prinsip SMART, skema pendanaan & APBD, mekanisme pengendalian dan evaluasi perencanaan/pelaksanaan, serta penutup komitmen pembangunan berlandaskan semboyan 'Begawi Jejama' dan 'Budaya Jalan Lurus'.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: OPSI UNDUHAN & TAUTAN */}
          {activeTab === 'unduh' && (
            <div className="space-y-6">
              <div className="bg-stone-50 p-5 rounded-xl border border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-stone-900 text-sm">
                      Tautan Pengalihan Berkas Digital Resmi
                    </h4>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Tautan akses dokumen yang akan dibuka saat tombol di-klik oleh warga atau aparatur.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditingUrl(!isEditingUrl)}
                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                  >
                    {isEditingUrl ? 'Batal Ubah' : 'Ubah Tautan URL'}
                  </button>
                </div>

                {isEditingUrl ? (
                  <form onSubmit={handleSaveCustomUrl} className="space-y-2.5">
                    <label className="block text-xs font-mono text-stone-700">
                      Masukkan URL Tujuan Baru (misal: Google Drive, Website JDIH, atau Server Bapperida):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                        placeholder="https://..."
                        className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                        required
                      />
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Simpan
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-stone-300 gap-3">
                    <div className="flex items-center gap-2 min-w-0 font-mono text-xs text-stone-800">
                      <svg className="w-4 h-4 text-emerald-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span className="truncate">{customUrl}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={handleCopyLink}
                        className="px-2.5 py-1 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded transition-colors cursor-pointer"
                      >
                        {isCopied ? '✓ Tersalin' : 'Salin URL'}
                      </button>
                      <a
                        href={customUrl || 'https://drive.google.com/drive/folders/1RMzU0FivUeGJZvDJUUkwLrScRO-pa4Gr'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-xs font-semibold bg-emerald-900 hover:bg-emerald-950 text-white rounded transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        Buka ↗
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Download Option Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="font-mono text-xs text-emerald-800 font-bold">OPSI 1: UNDUH LANGSUNG</span>
                    <h5 className="font-bold text-stone-900 text-sm">Salinan Ringkasan Dokumen Legal</h5>
                    <p className="text-xs text-stone-600">
                      Unduh berkas ringkasan resmi batang tubuh Perda Nomor 7 Tahun 2025 lengkap dengan dasar hukum, struktur 5 bab, dan metadata pengesahan.
                    </p>
                  </div>
                  <button
                    onClick={handleTriggerDownload}
                    disabled={isDownloading}
                    className="w-full py-2 bg-emerald-900 hover:bg-emerald-950 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer text-center"
                  >
                    {isDownloading ? 'Menyiapkan Berkas...' : '⬇ Unduh Berkas Salinan'}
                  </button>
                </div>

                <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="font-mono text-xs text-blue-800 font-bold">OPSI 2: DOKUMEN ASLI LENGKAP</span>
                    <h5 className="font-bold text-stone-900 text-sm">Google Drive Dokumen RPJMD</h5>
                    <p className="text-xs text-stone-600">
                      Akses langsung berkas dan naskah utuh Perda No 7/2025 melalui repositori resmi Google Drive Bapperida Tanggamus.
                    </p>
                  </div>
                  <a
                    href={customUrl || 'https://drive.google.com/drive/folders/1RMzU0FivUeGJZvDJUUkwLrScRO-pa4Gr'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer text-center block"
                  >
                    ↗ Buka Folder Google Drive
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-500 font-mono text-[11px]">
            <span>Bapperida Kabupaten Tanggamus</span>
            <span>•</span>
            <span>Bidang Pengendalian & Evaluasi (PME)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleTriggerDownload}
              className="px-4 py-1.5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-lg font-semibold transition-colors cursor-pointer shadow-2xs"
            >
              Unduh Salinan Naskah
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 bg-white hover:bg-stone-200 border border-stone-300 text-stone-700 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
