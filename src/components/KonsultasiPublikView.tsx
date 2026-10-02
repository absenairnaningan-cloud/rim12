import React, { useState } from 'react';
import { BabRPJMD, KonsultasiAgenda, StakeholderType, KonfirmasiKehadiranSidang } from '../types';
import { NaskahRpjmdModal } from './NaskahRpjmdModal';

interface KonsultasiPublikViewProps {
  agendaList: KonsultasiAgenda[];
  babList: BabRPJMD[];
  kehadiranList?: KonfirmasiKehadiranSidang[];
  onAddCatatanBab: (nomorBab: string, nama: string, institusi: string, tipe: StakeholderType, pasal: string, komentar: string) => void;
  onAddKehadiran?: (rsvp: KonfirmasiKehadiranSidang) => void;
}

export const KonsultasiPublikView: React.FC<KonsultasiPublikViewProps> = ({
  agendaList,
  babList,
  kehadiranList = [],
  onAddCatatanBab,
  onAddKehadiran,
}) => {
  const [activeBab, setActiveBab] = useState<string>(babList[0]?.nomorBab || 'Bab I');
  const [selectedAgenda, setSelectedAgenda] = useState<KonsultasiAgenda | null>(null);

  // RSVP Modal State
  const [rsvpAgenda, setRsvpAgenda] = useState<KonsultasiAgenda | null>(null);
  const [rsvpNama, setRsvpNama] = useState('');
  const [rsvpInstansi, setRsvpInstansi] = useState('');
  const [rsvpUnsur, setRsvpUnsur] = useState<StakeholderType | 'pemerintah'>('masyarakat');
  const [rsvpJabatan, setRsvpJabatan] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpNomorKontak, setRsvpNomorKontak] = useState('');
  const [rsvpBentukKehadiran, setRsvpBentukKehadiran] = useState<'luring' | 'daring'>('luring');
  const [rsvpPokokPikiran, setRsvpPokokPikiran] = useState('');
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  // Note form state
  const [nama, setNama] = useState('');
  const [institusi, setInstitusi] = useState('');
  const [tipe, setTipe] = useState<StakeholderType>('masyarakat');
  const [pasal, setPasal] = useState('');
  const [komentar, setKomentar] = useState('');
  const [submittedNote, setSubmittedNote] = useState(false);

  // Naskah Utuh RPJMD (PDF) Modal State
  const [isNaskahModalOpen, setIsNaskahModalOpen] = useState(false);
  const [customPdfUrl, setCustomPdfUrl] = useState('https://drive.google.com/drive/folders/1RMzU0FivUeGJZvDJUUkwLrScRO-pa4Gr');

  const currentBabData = babList.find((b) => b.nomorBab === activeBab) || babList[0];

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !pasal.trim() || !komentar.trim()) return;
    onAddCatatanBab(activeBab, nama, institusi, tipe, pasal, komentar);
    setSubmittedNote(true);
    setPasal('');
    setKomentar('');
    setTimeout(() => {
      setSubmittedNote(false);
    }, 2000);
  };

  const handleOpenRsvp = (agenda: KonsultasiAgenda) => {
    setRsvpAgenda(agenda);
    setRsvpSuccess(false);
  };

  const handleSubmitRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpAgenda || !rsvpNama.trim() || !rsvpEmail.trim()) return;

    const newRsvp: KonfirmasiKehadiranSidang = {
      id: `RSVP-${Date.now().toString().slice(-4)}`,
      agendaId: rsvpAgenda.id,
      judulSidang: rsvpAgenda.judulSidang,
      namaLengkap: rsvpNama.trim(),
      instansi: rsvpInstansi.trim() || 'Masyarakat Umum',
      unsurPentahelix: rsvpUnsur,
      jabatan: rsvpJabatan.trim() || 'Peserta',
      email: rsvpEmail.trim(),
      nomorKontak: rsvpNomorKontak.trim() || '-',
      bentukKehadiran: rsvpBentukKehadiran,
      statusVerifikasi: 'terkonfirmasi',
      pokokPikiran: rsvpPokokPikiran.trim() || undefined,
      waktuDaftar: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }) + `, ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`
    };

    if (onAddKehadiran) {
      onAddKehadiran(newRsvp);
    }
    setRsvpSuccess(true);
    setTimeout(() => {
      setRsvpSuccess(false);
      setRsvpAgenda(null);
      setRsvpNama('');
      setRsvpInstansi('');
      setRsvpJabatan('');
      setRsvpEmail('');
      setRsvpNomorKontak('');
      setRsvpPokokPikiran('');
    }, 1500);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="pb-4 border-b border-stone-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 uppercase tracking-wider mb-1">
          <span>Kanal Uji Publik Dokumen Perencanaan Daerah</span>
          <span aria-hidden="true">•</span>
          <span>Tahapan Konsultasi Publik RPJMD 2025–2029 Tanggamus</span>
        </div>
        <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
          Konsultasi Publik Terbuka & Telaah Bab RPJMD
        </h2>
        <p className="text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
          Sesuai amanat Permendagri No. 86 Tahun 2017, Rancangan Awal RPJMD wajib dikonsultasikan secara terbuka kepada seluruh pemangku kepentingan untuk memperoleh masukan penyempurnaan sebelum diajukan ke DPRD.
        </p>
      </div>

      {/* Agenda Sidang & Musrenbang Tematik */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif font-bold text-stone-900">
            Jadwal Sidang Konsultasi Publik & Musrenbang Tematik
          </h3>
          <span className="text-xs text-stone-500 font-mono">Format Hybrid (Tatap Muka & Daring)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {agendaList.map((agenda) => (
            <div
              key={agenda.id}
              className="p-5 bg-white rounded-lg border border-stone-200 hover:border-stone-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-900">{agenda.tipeAgenda}</span>
                  <span className="font-mono text-stone-500 text-[11px]">
                    {agenda.statusPendaftaran === 'buka' ? 'Pendaftaran Dibuka' : 'Segera Hadir'}
                  </span>
                </div>

                <h4 className="text-base font-serif font-bold text-stone-900 leading-snug">
                  {agenda.judulSidang}
                </h4>

                <div className="space-y-1.5 text-xs text-stone-600 pt-1">
                  <div>
                    <span className="text-stone-400 font-medium">Waktu: </span>
                    <span className="text-stone-800 font-mono tabular-nums">{agenda.tanggalWaktu}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 font-medium">Tempat: </span>
                    <span className="text-stone-800">{agenda.tempat}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 font-medium">Peserta Kunci: </span>
                    <span className="text-stone-800">{agenda.pemangkuUtama}</span>
                  </div>
                </div>

                {/* Topik Bahasan */}
                <div className="pt-2 border-t border-stone-100 text-xs">
                  <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">Agenda Utama:</p>
                  <ul className="text-stone-600 space-y-0.5">
                    {agenda.topikKunci.map((topik, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-800">•</span>
                        <span>{topik}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono">
                  <span>Kapasitas: {agenda.kapasitas}</span>
                  <span className="text-emerald-800 font-semibold">{kehadiranList.filter((k) => k.agendaId === agenda.id).length} Terkonfirmasi</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedAgenda(agenda)}
                    className="flex-1 py-2 px-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded transition-colors text-center cursor-pointer"
                  >
                    Rincian & Akses
                  </button>
                  <button
                    onClick={() => handleOpenRsvp(agenda)}
                    className="flex-1 py-2 px-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded transition-colors text-center cursor-pointer shadow-2xs"
                  >
                    + Konfirmasi Hadir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Telaah Substansi Per Bab Dokumen RPJMD */}
      <div className="space-y-4 pt-6 border-t border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h3 className="text-lg font-serif font-bold text-stone-900">
              Telaah Substansi Per Bab Dokumen RPJMD 2025–2029
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              Pilih bab di bawah untuk membaca intisari dan memberikan catatan kritis pasal demi pasal.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNaskahModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-400 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-2xs flex items-center gap-1.5"
              title="Buka Penampil Dokumen & Unduh Naskah Utuh RPJMD Tanggamus (Perda No 7/2025)"
            >
              <svg className="w-3.5 h-3.5 text-emerald-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Unduh Naskah Utuh RPJMD (PDF)</span>
            </button>
          </div>
        </div>

        {/* Tab Selector Bab */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200 text-xs">
          {babList.map((bab) => (
            <button
              key={bab.nomorBab}
              onClick={() => setActiveBab(bab.nomorBab)}
              className={`px-4 py-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeBab === bab.nomorBab
                  ? 'text-stone-900 font-bold border-b-2 border-emerald-800 bg-stone-100/60 rounded-t'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {bab.nomorBab}: {bab.judulBab.split('&')[0]}
            </button>
          ))}
        </div>

        {/* Active Bab Detail Card */}
        {currentBabData && (
          <div className="bg-white rounded-lg border border-stone-200 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs font-mono text-emerald-900 font-semibold uppercase">
                  {currentBabData.nomorBab} • {currentBabData.halamanTerkait}
                </span>
                <h4 className="text-xl font-serif font-bold text-stone-900 mt-1">
                  {currentBabData.judulBab}
                </h4>
                <p className="text-xs sm:text-sm text-stone-700 mt-2 leading-relaxed">
                  {currentBabData.fokusBahasan}
                </p>
              </div>
              <div className="p-3 bg-stone-50 rounded border border-stone-200 text-center shrink-0">
                <p className="text-stone-400 font-medium text-[10px] uppercase">Catatan Kritis Masuk</p>
                <p className="text-xl font-serif font-bold text-stone-900 font-mono tabular-nums">
                  {currentBabData.catatanKritis.length}
                </p>
              </div>
            </div>

            {/* List of Critical Notes on this Bab */}
            <div className="space-y-3">
              <h5 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                Catatan Kritis & Telaah Substansi dari Pemangku Kepentingan:
              </h5>
              {currentBabData.catatanKritis.map((note) => (
                <div key={note.id} className="p-4 bg-stone-50 rounded-lg border border-stone-200/80 text-xs space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-stone-500">
                    <span className="font-semibold text-stone-800">
                      {note.nama} ({note.institusi})
                    </span>
                    <span className="font-mono text-[11px]">{note.tanggal}</span>
                  </div>
                  <p className="font-medium text-emerald-950 text-xs">
                    Sub-Bab / Pasal: {note.pasalBagian}
                  </p>
                  <p className="text-stone-700 leading-relaxed italic">
                    "{note.komentar}"
                  </p>
                </div>
              ))}
            </div>

            {/* Form Tambah Catatan Kritis Bab */}
            <form onSubmit={handleAddNote} className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-800">
                  Ajukan Catatan Kritis untuk {currentBabData.nomorBab}
                </span>
                {submittedNote && (
                  <span className="text-emerald-800 font-bold font-mono">
                    ✓ Catatan Berhasil Dicatat ke Berita Acara!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Nama Lengkap *"
                  className="bg-white border border-stone-300 rounded px-2.5 py-1.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
                <input
                  type="text"
                  value={institusi}
                  onChange={(e) => setInstitusi(e.target.value)}
                  placeholder="Instansi / Kampus / Organisasi"
                  className="bg-white border border-stone-300 rounded px-2.5 py-1.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
                <select
                  value={tipe}
                  onChange={(e) => setTipe(e.target.value as StakeholderType)}
                  className="bg-white border border-stone-300 rounded px-2.5 py-1.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                >
                  <option value="masyarakat">Masyarakat Umum</option>
                  <option value="akademisi">Akademisi / Dosen</option>
                  <option value="swasta">Dunia Usaha / Kadin</option>
                  <option value="oms">Organisasi Masyarakat Sipil</option>
                </select>
              </div>

              <div>
                <input
                  type="text"
                  required
                  value={pasal}
                  onChange={(e) => setPasal(e.target.value)}
                  placeholder="Nomor Bagian / Pasal / Tabel Spesifik (Contoh: Sub-Bab 3.2 Program Unggulan Ketahanan Pangan)"
                  className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>

              <div>
                <textarea
                  required
                  rows={2}
                  value={komentar}
                  onChange={(e) => setKomentar(e.target.value)}
                  placeholder="Uraikan catatan kritis, ketidaksinkronan data, atau usulan pasal alternatif..."
                  className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
                >
                  Simpan Catatan ke Pokja Bapperida
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Agenda Detail Modal */}
      {selectedAgenda && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-900 font-semibold">{selectedAgenda.tipeAgenda}</span>
              <button onClick={() => setSelectedAgenda(null)} className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer">✕</button>
            </div>
            <div className="p-6 space-y-4 text-xs text-stone-700">
              <h3 className="text-lg font-serif font-bold text-stone-900">
                {selectedAgenda.judulSidang}
              </h3>
              <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-2">
                <p><strong>Waktu Pelaksanaan:</strong> {selectedAgenda.tanggalWaktu}</p>
                <p><strong>Tempat Sidang Fisik:</strong> {selectedAgenda.tempat}</p>
                <p><strong>Kapasitas Peserta:</strong> {selectedAgenda.kapasitas}</p>
                {selectedAgenda.tautanDaring && (
                  <p>
                    <strong>Tautan Virtual:</strong>{' '}
                    <a href={selectedAgenda.tautanDaring} target="_blank" rel="noreferrer" className="text-emerald-900 underline">
                      {selectedAgenda.tautanDaring}
                    </a>
                  </p>
                )}
              </div>
              <div>
                <h4 className="font-semibold text-stone-900 uppercase text-[11px] mb-1">Rundown & Pokok Diskusi:</h4>
                <ul className="space-y-1 list-disc list-inside">
                  {selectedAgenda.topikKunci.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-950 rounded border border-emerald-200 text-[11px]">
                Sidang ini terbuka untuk perwakilan ormas, akademisi, dan warga yang telah mendaftarkan diri. Berita acara hasil sidang ditandatangani bersama dan menjadi lampiran wajib Perda RPJMD.
              </div>
            </div>
            <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  const ag = selectedAgenda;
                  setSelectedAgenda(null);
                  handleOpenRsvp(ag);
                }}
                className="px-4 py-1.5 bg-emerald-900 text-white rounded font-semibold hover:bg-emerald-950 text-xs cursor-pointer shadow-2xs"
              >
                Konfirmasi Kehadiran Sidang
              </button>
              <button
                onClick={() => setSelectedAgenda(null)}
                className="px-3.5 py-1.5 bg-white border border-stone-300 rounded text-stone-700 hover:bg-stone-50 text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RSVP Modal Form */}
      {rsvpAgenda && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-emerald-900 font-semibold uppercase">
                  Registrasi Kehadiran Sidang
                </span>
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Konfirmasi Kehadiran Delegasi
                </h3>
              </div>
              <button onClick={() => setRsvpAgenda(null)} className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer">✕</button>
            </div>

            {rsvpSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h4 className="text-lg font-serif font-bold text-stone-900">
                  Konfirmasi Kehadiran Berhasil Dikirim!
                </h4>
                <p className="text-xs text-stone-600 max-w-md mx-auto">
                  Terima kasih atas partisipasi Anda. Data kehadiran Anda telah dicatat ke dalam sistem dan terhubung pada Buku Presensi Resmi Bapperida Tanggamus.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitRsvp} className="p-6 space-y-3.5 text-xs">
                <div className="p-3 bg-stone-50 border border-stone-200 rounded">
                  <span className="text-[10px] text-stone-400 font-semibold uppercase block">Sidang yang Diikuti:</span>
                  <p className="font-bold text-stone-900 text-sm mt-0.5">{rsvpAgenda.judulSidang}</p>
                  <p className="text-stone-500 font-mono text-[11px] mt-0.5">{rsvpAgenda.tanggalWaktu} • {rsvpAgenda.tempat}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Nama Lengkap & Gelar *</label>
                    <input
                      type="text"
                      required
                      value={rsvpNama}
                      onChange={(e) => setRsvpNama(e.target.value)}
                      placeholder="Nama Lengkap Anda"
                      className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Instansi / Organisasi *</label>
                    <input
                      type="text"
                      required
                      value={rsvpInstansi}
                      onChange={(e) => setRsvpInstansi(e.target.value)}
                      placeholder="Instansi / Ormas / Lembaga"
                      className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Unsur Pemangku *</label>
                    <select
                      value={rsvpUnsur}
                      onChange={(e) => setRsvpUnsur(e.target.value as StakeholderType | 'pemerintah')}
                      className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    >
                      <option value="masyarakat">Masyarakat Umum</option>
                      <option value="oms">Organisasi Masyarakat Sipil (OMS)</option>
                      <option value="akademisi">Akademisi / Perguruan Tinggi</option>
                      <option value="swasta">Dunia Usaha / Kadin</option>
                      <option value="pemerintah">Pemerintah / OPD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Jabatan / Peran</label>
                    <input
                      type="text"
                      value={rsvpJabatan}
                      onChange={(e) => setRsvpJabatan(e.target.value)}
                      placeholder="Contoh: Perwakilan Warga / Peneliti"
                      className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Alamat Email *</label>
                    <input
                      type="email"
                      required
                      value={rsvpEmail}
                      onChange={(e) => setRsvpEmail(e.target.value)}
                      placeholder="email@domain.com"
                      className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Nomor WhatsApp *</label>
                    <input
                      type="text"
                      required
                      value={rsvpNomorKontak}
                      onChange={(e) => setRsvpNomorKontak(e.target.value)}
                      placeholder="0812-xxxx-xxxx"
                      className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Bentuk Kehadiran *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className={`flex items-center gap-2 p-2.5 rounded border cursor-pointer ${rsvpBentukKehadiran === 'luring' ? 'bg-emerald-50 border-emerald-800 text-emerald-900 font-semibold' : 'border-stone-200'}`}>
                      <input
                        type="radio"
                        name="publicBentuk"
                        value="luring"
                        checked={rsvpBentukKehadiran === 'luring'}
                        onChange={() => setRsvpBentukKehadiran('luring')}
                      />
                      <span>🏢 Luring (Fisik Venue)</span>
                    </label>
                    <label className={`flex items-center gap-2 p-2.5 rounded border cursor-pointer ${rsvpBentukKehadiran === 'daring' ? 'bg-blue-50 border-blue-800 text-blue-900 font-semibold' : 'border-stone-200'}`}>
                      <input
                        type="radio"
                        name="publicBentuk"
                        value="daring"
                        checked={rsvpBentukKehadiran === 'daring'}
                        onChange={() => setRsvpBentukKehadiran('daring')}
                      />
                      <span>💻 Daring (Zoom)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Pokok Pikiran / Usulan Ringkas (Opsional)</label>
                  <textarea
                    rows={2}
                    value={rsvpPokokPikiran}
                    onChange={(e) => setRsvpPokokPikiran(e.target.value)}
                    placeholder="Masukan ringkas yang ingin Anda sampaikan..."
                    className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRsvpAgenda(null)}
                    className="px-3 py-1.5 bg-white border border-stone-300 rounded text-stone-700 hover:bg-stone-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-900 hover:bg-emerald-950 text-white rounded font-semibold cursor-pointer shadow-2xs"
                  >
                    Kirim Konfirmasi Hadir
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal Penampil Dokumen Resmi & Pengalihan Unduh RPJMD Tanggamus */}
      <NaskahRpjmdModal
        isOpen={isNaskahModalOpen}
        onClose={() => setIsNaskahModalOpen(false)}
        externalPdfUrl={customPdfUrl}
        onUpdatePdfUrl={setCustomPdfUrl}
      />
    </div>
  );
};
