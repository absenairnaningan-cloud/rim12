import React, { useState, useMemo } from 'react';
import { MisiRPJMDItem } from '../types';

interface PengaturanMisiManagerProps {
  misiList: MisiRPJMDItem[];
  onAddMisi: (newMisi: MisiRPJMDItem) => void;
  onUpdateMisi: (updatedMisi: MisiRPJMDItem) => void;
  onDeleteMisi: (misiId: string) => void;
  onToggleMisiStatus: (misiId: string) => void;
}

export const PengaturanMisiManager: React.FC<PengaturanMisiManagerProps> = ({
  misiList,
  onAddMisi,
  onUpdateMisi,
  onDeleteMisi,
  onToggleMisiStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedMisiForEdit, setSelectedMisiForEdit] = useState<MisiRPJMDItem | null>(null);
  const [deletingMisi, setDeletingMisi] = useState<MisiRPJMDItem | null>(null);
  const [isSuccessNotification, setIsSuccessNotification] = useState<string | null>(null);

  // Form input states
  const [nomor, setNomor] = useState('');
  const [idMisi, setIdMisi] = useState('');
  const [judul, setJudul] = useState('');
  const [fokus, setFokus] = useState('');
  const [sasaranPokokText, setSasaranPokokText] = useState('');
  const [ikuText, setIkuText] = useState('');
  const [opdPengampu, setOpdPengampu] = useState('');
  const [warnaTema, setWarnaTema] = useState<MisiRPJMDItem['warnaTema']>('emerald');
  const [urutan, setUrutan] = useState<number>(1);
  const [statusAktif, setStatusAktif] = useState(true);

  // Sorted and filtered missions
  const filteredMisiList = useMemo(() => {
    return [...misiList]
      .sort((a, b) => (a.urutan || 0) - (b.urutan || 0))
      .filter((misi) => {
        if (filterStatus === 'aktif' && !misi.statusAktif) return false;
        if (filterStatus === 'nonaktif' && misi.statusAktif) return false;
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchJudul = misi.judul.toLowerCase().includes(q);
          const matchNomor = misi.nomor.toLowerCase().includes(q);
          const matchFokus = misi.fokus.toLowerCase().includes(q);
          const matchOpd = misi.opdPengampuUtama?.toLowerCase().includes(q);
          return matchJudul || matchNomor || matchFokus || matchOpd;
        }
        return true;
      });
  }, [misiList, searchQuery, filterStatus]);

  // Statistics
  const totalMisi = misiList.length;
  const totalAktif = misiList.filter((m) => m.statusAktif).length;
  const totalSasaran = misiList.reduce((acc, curr) => acc + (curr.sasaranPokok?.length || 0), 0);
  const totalIku = misiList.reduce((acc, curr) => acc + (curr.indikatorKinerjaUtama?.length || 0), 0);

  const resetForm = () => {
    setNomor(`Misi ${misiList.length + 1}`);
    setIdMisi(`misi_${misiList.length + 1}`);
    setJudul('');
    setFokus('');
    setSasaranPokokText('');
    setIkuText('');
    setOpdPengampu('');
    setWarnaTema('emerald');
    setUrutan(misiList.length + 1);
    setStatusAktif(true);
    setSelectedMisiForEdit(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowFormModal(true);
  };

  const handleOpenEditModal = (misi: MisiRPJMDItem) => {
    setSelectedMisiForEdit(misi);
    setNomor(misi.nomor);
    setIdMisi(misi.id);
    setJudul(misi.judul);
    setFokus(misi.fokus);
    setSasaranPokokText((misi.sasaranPokok || []).join('\n'));
    setIkuText((misi.indikatorKinerjaUtama || []).join('\n'));
    setOpdPengampu(misi.opdPengampuUtama || '');
    setWarnaTema(misi.warnaTema || 'emerald');
    setUrutan(misi.urutan || 1);
    setStatusAktif(misi.statusAktif);
    setShowFormModal(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomor.trim() || !judul.trim() || !fokus.trim()) return;

    const parsedSasaran = sasaranPokokText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const parsedIku = ikuText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (selectedMisiForEdit) {
      const updated: MisiRPJMDItem = {
        ...selectedMisiForEdit,
        nomor: nomor.trim(),
        judul: judul.trim(),
        fokus: fokus.trim(),
        sasaranPokok: parsedSasaran.length > 0 ? parsedSasaran : selectedMisiForEdit.sasaranPokok,
        indikatorKinerjaUtama: parsedIku.length > 0 ? parsedIku : selectedMisiForEdit.indikatorKinerjaUtama,
        opdPengampuUtama: opdPengampu.trim() || 'Perangkat Daerah Terkait',
        warnaTema,
        urutan: Number(urutan) || 1,
        statusAktif,
      };
      onUpdateMisi(updated);
      setIsSuccessNotification(`${updated.nomor} ("${updated.judul}") berhasil diperbarui.`);
    } else {
      const cleanId = idMisi.trim().toLowerCase().replace(/\s+/g, '_') || `misi_${Date.now().toString().slice(-4)}`;
      const created: MisiRPJMDItem = {
        id: cleanId,
        nomor: nomor.trim(),
        judul: judul.trim(),
        fokus: fokus.trim(),
        sasaranPokok: parsedSasaran.length > 0 ? parsedSasaran : ['Sasaran strategis implementasi Misi RPJMD'],
        indikatorKinerjaUtama: parsedIku.length > 0 ? parsedIku : ['Indikator Capaian Kinerja Program'],
        opdPengampuUtama: opdPengampu.trim() || 'Perangkat Daerah Terkait',
        warnaTema,
        urutan: Number(urutan) || (misiList.length + 1),
        statusAktif,
      };
      onAddMisi(created);
      setIsSuccessNotification(`${created.nomor} ("${created.judul}") berhasil ditambahkan ke RPJMD.`);
    }

    setShowFormModal(false);
    resetForm();
    setTimeout(() => {
      setIsSuccessNotification(null);
    }, 3000);
  };

  const handleConfirmDelete = () => {
    if (!deletingMisi) return;
    const deletedName = `${deletingMisi.nomor} - ${deletingMisi.judul}`;
    onDeleteMisi(deletingMisi.id);
    setDeletingMisi(null);
    setIsSuccessNotification(`${deletedName} berhasil dihapus dari daftar Misi RPJMD.`);
    setTimeout(() => {
      setIsSuccessNotification(null);
    }, 3000);
  };

  const getTemaBadgeClass = (tema?: string) => {
    switch (tema) {
      case 'blue':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'amber':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'emerald':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'purple':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'rose':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'teal':
        return 'bg-teal-100 text-teal-900 border-teal-300';
      case 'indigo':
        return 'bg-indigo-100 text-indigo-900 border-indigo-300';
      default:
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Notification */}
      {isSuccessNotification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs text-emerald-900 animate-fade-in shadow-xs">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">✓</span>
            <span>{isSuccessNotification}</span>
          </div>
          <button
            onClick={() => setIsSuccessNotification(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold px-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <span>Menu Pengaturan</span>
            <span aria-hidden="true">•</span>
            <span>Rancangan RPJMD Kab. Tanggamus 2025-2029</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
            Pengaturan Misi RPJMD
          </h2>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
            Kelola rumusan Misi Pembangunan Daerah, arah kebijakan prioritas, sasaran pokok strategis, indikator kinerja utama (IKU), serta penanggung jawab OPD dalam penyelarasan aspirasi masyarakat.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="self-start md:self-auto px-4 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Tambah Misi Baru</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <p className="text-xs font-medium text-stone-500">Total Misi Terdaftar</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-stone-900">{totalMisi}</span>
            <span className="text-[11px] text-stone-400 font-mono">Misi RPJMD</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <p className="text-xs font-medium text-stone-500">Misi Aktif Digunakan</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-emerald-800">{totalAktif}</span>
            <span className="text-[11px] text-emerald-600 font-semibold font-mono">/ {totalMisi} Aktif</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <p className="text-xs font-medium text-stone-500">Sasaran Pokok Strategis</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-blue-900">{totalSasaran}</span>
            <span className="text-[11px] text-stone-400 font-mono">Sasaran</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <p className="text-xs font-medium text-stone-500">Indikator Kinerja Utama (IKU)</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-purple-900">{totalIku}</span>
            <span className="text-[11px] text-stone-400 font-mono">Indikator</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari misi berdasarkan nomor, judul, fokus kebijakan, atau OPD pengampu..."
              className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-800 focus:bg-white"
            />
            <svg className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-xs text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-stone-600">
              <span>Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-800 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-800"
              >
                <option value="all">Semua Status</option>
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Non-Aktif</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-stone-500 pt-1 border-t border-stone-100">
          <span>Menampilkan <strong>{filteredMisiList.length}</strong> Misi RPJMD Kabupaten Tanggamus</span>
        </div>
      </div>

      {/* Misi Cards List */}
      <div className="space-y-4">
        {filteredMisiList.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-stone-500">
            Tidak ditemukan Misi RPJMD yang sesuai dengan kata kunci pencarian.
          </div>
        ) : (
          filteredMisiList.map((misi) => (
            <div
              key={misi.id}
              className={`bg-white rounded-xl border transition-all duration-200 shadow-2xs hover:shadow-md p-5 ${
                misi.statusAktif ? 'border-stone-200' : 'border-stone-200 bg-stone-50/60 opacity-80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${getTemaBadgeClass(misi.warnaTema)}`}>
                    {misi.nomor}
                  </span>
                  <span className="font-mono text-[10px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                    ID: {misi.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleMisiStatus(misi.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors cursor-pointer border ${
                      misi.statusAktif
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                        : 'bg-stone-100 text-stone-600 border-stone-300 hover:bg-stone-200'
                    }`}
                    title="Klik untuk mengubah status aktif/non-aktif misi"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${misi.statusAktif ? 'bg-emerald-600' : 'bg-stone-400'}`}></span>
                    <span>{misi.statusAktif ? 'Misi Aktif' : 'Non-Aktif'}</span>
                  </button>
                </div>
                {/* Action Buttons */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(misi)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit Misi</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingMisi(misi)}
                    className="p-1.5 text-rose-700 hover:text-rose-900 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                    title="Hapus Misi"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Title & Focus */}
              <div className="pt-3">
                <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 leading-snug">
                  {misi.judul}
                </h3>
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed bg-stone-50 p-3 rounded-lg border border-stone-200/80">
                  {misi.fokus}
                </p>
              </div>

              {/* Details: Sasaran Pokok & IKU */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-3 border-t border-stone-100 text-xs">
                <div>
                  <h4 className="font-semibold text-stone-800 flex items-center gap-1.5 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>
                    <span>Sasaran Pokok Strategis ({misi.sasaranPokok?.length || 0})</span>
                  </h4>
                  {misi.sasaranPokok && misi.sasaranPokok.length > 0 ? (
                    <ul className="space-y-1.5 text-stone-600">
                      {misi.sasaranPokok.map((sasaran, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-[11px] leading-relaxed">
                          <span className="text-stone-400 font-mono mt-0.5">•</span>
                          <span>{sasaran}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-stone-400 italic text-[11px]">Belum ada sasaran pokok terinci.</p>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-stone-800 flex items-center gap-1.5 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-700"></span>
                    <span>Indikator Kinerja Utama / IKU ({misi.indikatorKinerjaUtama?.length || 0})</span>
                  </h4>
                  {misi.indikatorKinerjaUtama && misi.indikatorKinerjaUtama.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {misi.indikatorKinerjaUtama.map((iku, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-stone-100 text-stone-700 rounded-md text-[11px] font-mono border border-stone-200"
                        >
                          {iku}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-stone-400 italic text-[11px]">Belum ada IKU terdaftar.</p>
                  )}
                  {misi.opdPengampuUtama && (
                    <div className="mt-3 pt-2 border-t border-stone-100 text-[11px] text-stone-600">
                      <span className="text-stone-500 font-medium">OPD Pengampu: </span>
                      <strong className="text-stone-800">{misi.opdPengampuUtama}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL: Form Tambah / Edit Misi */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  {selectedMisiForEdit ? `Edit ${selectedMisiForEdit.nomor}: ${selectedMisiForEdit.judul}` : 'Tambah Misi RPJMD Baru'}
                </h3>
                <p className="text-[11px] text-stone-500">
                  Dokumen Perencanaan Jangka Menengah Daerah Kabupaten Tanggamus 2025-2029
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowFormModal(false);
                  resetForm();
                }}
                className="p-1 text-stone-400 hover:text-stone-700 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nomor Misi *
                  </label>
                  <input
                    type="text"
                    required
                    value={nomor}
                    onChange={(e) => setNomor(e.target.value)}
                    placeholder="Contoh: Misi 6"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Kode ID Unik *
                  </label>
                  <input
                    type="text"
                    required
                    value={idMisi}
                    onChange={(e) => setIdMisi(e.target.value)}
                    placeholder="Contoh: pariwisata_maritim"
                    disabled={!!selectedMisiForEdit}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-800 disabled:bg-stone-100 disabled:text-stone-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nomor Urut Tampilan
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={urutan}
                    onChange={(e) => setUrutan(Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Judul Rumusan Misi RPJMD *
                </label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Contoh: Pengembangan Pariwisata Bahari & Ekonomi Biru Berkelanjutan"
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Fokus & Deskripsi Kebijakan Strategis *
                </label>
                <textarea
                  required
                  rows={3}
                  value={fokus}
                  onChange={(e) => setFokus(e.target.value)}
                  placeholder="Uraikan fokus kebijakan, prioritas sasaran pembangunan, dan jangkauan program..."
                  className="w-full bg-white border border-stone-300 rounded-lg p-3 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Sasaran Pokok Strategis (Tulis satu sasaran per baris)
                </label>
                <textarea
                  rows={3}
                  value={sasaranPokokText}
                  onChange={(e) => setSasaranPokokText(e.target.value)}
                  placeholder="Contoh:&#10;Peningkatan kunjungan wisatawan domestik & mancanegara di Teluk Kiluan&#10;Pengembangan infrastruktur dermaga dan desa wisata pesisir terpadu&#10;Penguatan UMKM kuliner dan suvenir khas lokal"
                  className="w-full bg-white border border-stone-300 rounded-lg p-3 text-stone-800 font-sans focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Indikator Kinerja Utama / IKU (Tulis satu indikator per baris)
                </label>
                <textarea
                  rows={2}
                  value={ikuText}
                  onChange={(e) => setIkuText(e.target.value)}
                  placeholder="Contoh:&#10;Jumlah Kunjungan Wisatawan&#10;Pendapatan Asli Daerah (PAD) Sektor Pariwisata"
                  className="w-full bg-white border border-stone-300 rounded-lg p-3 text-stone-800 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    OPD Pengampu Utama
                  </label>
                  <input
                    type="text"
                    value={opdPengampu}
                    onChange={(e) => setOpdPengampu(e.target.value)}
                    placeholder="Contoh: Dinas Pariwisata, Diskanlut, Diskoperindag"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Warna Tema Identitas Misi
                  </label>
                  <select
                    value={warnaTema}
                    onChange={(e) => setWarnaTema(e.target.value as MisiRPJMDItem['warnaTema'])}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  >
                    <option value="emerald">Hijau (Infrastruktur / Lingkungan)</option>
                    <option value="blue">Biru (SDM / Kesehatan / Kelautan)</option>
                    <option value="amber">Kuning / Emas (Ekonomi / UMKM)</option>
                    <option value="purple">Ungu (Tata Kelola / Digital)</option>
                    <option value="rose">Merah Muda (Sosial / Budaya / Inklusi)</option>
                    <option value="teal">Teal (Pariwisata / Inovasi)</option>
                    <option value="indigo">Indigo (Hukum / Kamtibmas)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="statusMisiCheck"
                  checked={statusAktif}
                  onChange={(e) => setStatusAktif(e.target.checked)}
                  className="rounded text-emerald-800 focus:ring-emerald-800 cursor-pointer"
                />
                <label htmlFor="statusMisiCheck" className="text-xs font-semibold text-stone-800 cursor-pointer">
                  Misi Berstatus Aktif (Dapat dipilih dalam form aspirasi warga, kemitraan CSR, dan renja OPD)
                </label>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowFormModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-900 text-white rounded-lg font-semibold hover:bg-emerald-950 transition-colors shadow-2xs cursor-pointer"
                >
                  {selectedMisiForEdit ? 'Simpan Perubahan Misi' : 'Daftarkan Misi Baru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Konfirmasi Hapus Misi */}
      {deletingMisi && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <div className="text-center">
              <h4 className="text-base font-serif font-bold text-stone-900">
                Hapus Misi RPJMD?
              </h4>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Anda akan menghapus data <strong>{deletingMisi.nomor}: {deletingMisi.judul}</strong>.
                Pastikan tidak ada dokumen aspirasi atau program terkait sebelum menghapus.
              </p>
            </div>
            <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingMisi(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-2xs cursor-pointer"
              >
                Ya, Hapus Misi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
