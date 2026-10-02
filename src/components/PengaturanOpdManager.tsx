import React, { useState, useMemo } from 'react';
import { UnitKerjaOPD, MisiRPJMD } from '../types';
import { MISI_LABELS } from '../data/mockData';

interface PengaturanOpdManagerProps {
  opdList: UnitKerjaOPD[];
  onAddOpd: (newOpd: UnitKerjaOPD) => void;
  onUpdateOpd: (updatedOpd: UnitKerjaOPD) => void;
  onDeleteOpd: (opdId: string) => void;
  onToggleOpdStatus: (opdId: string) => void;
}

export const PengaturanOpdManager: React.FC<PengaturanOpdManagerProps> = ({
  opdList,
  onAddOpd,
  onUpdateOpd,
  onDeleteOpd,
  onToggleOpdStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingOpd, setEditingOpd] = useState<UnitKerjaOPD | null>(null);
  const [deletingOpd, setDeletingOpd] = useState<UnitKerjaOPD | null>(null);
  const [isSuccessNotification, setIsSuccessNotification] = useState<string | null>(null);

  // Form input states
  const [namaOpd, setNamaOpd] = useState('');
  const [singkatan, setSingkatan] = useState('');
  const [kodeOpd, setKodeOpd] = useState('');
  const [kategori, setKategori] = useState<UnitKerjaOPD['kategori']>('dinas');
  const [kepalaNama, setKepalaNama] = useState('');
  const [kepalaNip, setKepalaNip] = useState('');
  const [kepalaJabatan, setKepalaJabatan] = useState('');
  const [alamatKantor, setAlamatKantor] = useState('');
  const [emailKontak, setEmailKontak] = useState('');
  const [teleponKontak, setTeleponKontak] = useState('');
  const [selectedMisi, setSelectedMisi] = useState<MisiRPJMD[]>(['infrastruktur_hijau']);
  const [statusAktif, setStatusAktif] = useState(true);

  // Filtered OPD List
  const filteredOpdList = useMemo(() => {
    return opdList.filter((opd) => {
      if (filterKategori !== 'all' && opd.kategori !== filterKategori) return false;
      if (filterStatus === 'aktif' && !opd.statusAktif) return false;
      if (filterStatus === 'nonaktif' && opd.statusAktif) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchNama = opd.namaOpd.toLowerCase().includes(q);
        const matchSingkatan = opd.singkatan.toLowerCase().includes(q);
        const matchKode = opd.kodeOpd.toLowerCase().includes(q);
        const matchKepala = opd.kepalaNama.toLowerCase().includes(q);
        return matchNama || matchSingkatan || matchKode || matchKepala;
      }
      return true;
    });
  }, [opdList, searchQuery, filterKategori, filterStatus]);

  // Statistics
  const totalOpd = opdList.length;
  const totalBadan = opdList.filter((o) => o.kategori === 'badan').length;
  const totalDinas = opdList.filter((o) => o.kategori === 'dinas').length;
  const totalAktif = opdList.filter((o) => o.statusAktif).length;

  const resetForm = () => {
    setNamaOpd('');
    setSingkatan('');
    setKodeOpd('');
    setKategori('dinas');
    setKepalaNama('');
    setKepalaNip('');
    setKepalaJabatan('');
    setAlamatKantor('');
    setEmailKontak('');
    setTeleponKontak('');
    setSelectedMisi(['infrastruktur_hijau']);
    setStatusAktif(true);
    setEditingOpd(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowFormModal(true);
  };

  const handleOpenEditModal = (opd: UnitKerjaOPD) => {
    setEditingOpd(opd);
    setNamaOpd(opd.namaOpd);
    setSingkatan(opd.singkatan);
    setKodeOpd(opd.kodeOpd);
    setKategori(opd.kategori);
    setKepalaNama(opd.kepalaNama);
    setKepalaNip(opd.kepalaNip || '');
    setKepalaJabatan(opd.kepalaJabatan);
    setAlamatKantor(opd.alamatKantor);
    setEmailKontak(opd.emailKontak);
    setTeleponKontak(opd.teleponKontak);
    setSelectedMisi(opd.fokusMisiRpjmd || ['infrastruktur_hijau']);
    setStatusAktif(opd.statusAktif);
    setShowFormModal(true);
  };

  const handleToggleMisi = (misi: MisiRPJMD) => {
    if (selectedMisi.includes(misi)) {
      if (selectedMisi.length > 1) {
        setSelectedMisi(selectedMisi.filter((m) => m !== misi));
      }
    } else {
      setSelectedMisi([...selectedMisi, misi]);
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaOpd.trim() || !singkatan.trim() || !kodeOpd.trim() || !kepalaNama.trim()) return;

    if (editingOpd) {
      const updated: UnitKerjaOPD = {
        ...editingOpd,
        namaOpd: namaOpd.trim(),
        singkatan: singkatan.trim().toUpperCase(),
        kodeOpd: kodeOpd.trim(),
        kategori,
        kepalaNama: kepalaNama.trim(),
        kepalaNip: kepalaNip.trim() || undefined,
        kepalaJabatan: kepalaJabatan.trim() || `Kepala ${singkatan.trim()}`,
        alamatKantor: alamatKantor.trim() || 'Kabupaten Tanggamus, Lampung',
        emailKontak: emailKontak.trim() || `${singkatan.trim().toLowerCase()}@tanggamus.go.id`,
        teleponKontak: teleponKontak.trim() || '(0722) 21000',
        fokusMisiRpjmd: selectedMisi,
        statusAktif
      };
      onUpdateOpd(updated);
      setIsSuccessNotification(`Unit Kerja ${updated.singkatan} berhasil diperbarui.`);
    } else {
      const created: UnitKerjaOPD = {
        id: `OPD-${Date.now().toString().slice(-4)}`,
        namaOpd: namaOpd.trim(),
        singkatan: singkatan.trim().toUpperCase(),
        kodeOpd: kodeOpd.trim(),
        kategori,
        kepalaNama: kepalaNama.trim(),
        kepalaNip: kepalaNip.trim() || undefined,
        kepalaJabatan: kepalaJabatan.trim() || `Kepala ${singkatan.trim()}`,
        alamatKantor: alamatKantor.trim() || 'Kabupaten Tanggamus, Lampung',
        emailKontak: emailKontak.trim() || `${singkatan.trim().toLowerCase()}@tanggamus.go.id`,
        teleponKontak: teleponKontak.trim() || '(0722) 21000',
        fokusMisiRpjmd: selectedMisi,
        statusAktif,
        jumlahAspirasiDitinjau: 0
      };
      onAddOpd(created);
      setIsSuccessNotification(`Unit Kerja ${created.singkatan} berhasil ditambahkan.`);
    }

    setShowFormModal(false);
    resetForm();
    setTimeout(() => {
      setIsSuccessNotification(null);
    }, 3000);
  };

  const handleConfirmDelete = () => {
    if (!deletingOpd) return;
    const deletedName = deletingOpd.singkatan;
    onDeleteOpd(deletingOpd.id);
    setDeletingOpd(null);
    setIsSuccessNotification(`Unit Kerja ${deletedName} berhasil dihapus.`);
    setTimeout(() => {
      setIsSuccessNotification(null);
    }, 3000);
  };

  const getKategoriBadgeColor = (kat: UnitKerjaOPD['kategori']) => {
    switch (kat) {
      case 'badan':
        return 'bg-purple-100 text-purple-900 border-purple-200';
      case 'dinas':
        return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'sekretariat':
        return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      case 'inspektorat':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
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
            <span>Master Data Penelaah RPJMD</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
            Pengaturan Unit Kerja / Perangkat Daerah (OPD)
          </h2>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
            Kelola data induk Organisasi Perangkat Daerah (OPD) Kabupaten Tanggamus, penanggung jawab teknis disposisi aspirasi warga, serta penyelarasan program Misi RPJMD.
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
          <span>Tambah OPD Baru</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <p className="text-xs font-medium text-stone-500">Total Unit Kerja (OPD)</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-stone-900">{totalOpd}</span>
            <span className="text-[11px] text-stone-400 font-mono">Lembaga</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <p className="text-xs font-medium text-stone-500">Dinas Teknis Daerah</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-blue-900">{totalDinas}</span>
            <span className="text-[11px] text-stone-400 font-mono">Dinas</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <p className="text-xs font-medium text-stone-500">Badan Daerah</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-purple-900">{totalBadan}</span>
            <span className="text-[11px] text-stone-400 font-mono">Badan</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <p className="text-xs font-medium text-stone-500">OPD Aktif Bertugas</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-emerald-900">{totalAktif}</span>
            <span className="text-[11px] text-emerald-600 font-semibold font-mono">/ {totalOpd} Siap Telaah</span>
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
              placeholder="Cari berdasarkan nama OPD, singkatan, kode, atau nama kepala..."
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
          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-stone-600">
              <span>Kategori:</span>
              <select
                value={filterKategori}
                onChange={(e) => setFilterKategori(e.target.value)}
                className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-800 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-800"
              >
                <option value="all">Semua Kategori</option>
                <option value="badan">Badan Daerah</option>
                <option value="dinas">Dinas Teknis</option>
                <option value="sekretariat">Sekretariat Daerah</option>
                <option value="inspektorat">Inspektorat Daerah</option>
              </select>
            </div>
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
          <span>Menampilkan <strong>{filteredOpdList.length}</strong> dari total {totalOpd} Perangkat Daerah Kabupaten Tanggamus</span>
        </div>
      </div>

      {/* OPD Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-mono">
                <th className="p-3.5 font-semibold">Kode & Lembaga OPD</th>
                <th className="p-3.5 font-semibold">Pimpinan / Kepala OPD</th>
                <th className="p-3.5 font-semibold">Kontak & Alamat</th>
                <th className="p-3.5 font-semibold">Misi RPJMD Diampu</th>
                <th className="p-3.5 font-semibold text-center">Status</th>
                <th className="p-3.5 font-semibold text-right">Aksi Pengaturan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOpdList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-500">
                    Tidak ditemukan data Unit Kerja / Perangkat Daerah yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredOpdList.map((opd) => (
                  <tr key={opd.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-stone-500 font-bold bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                          {opd.kodeOpd}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] rounded-md font-semibold border ${getKategoriBadgeColor(opd.kategori)}`}>
                          {opd.singkatan}
                        </span>
                      </div>
                      <p className="font-bold text-stone-900 mt-1 text-xs">{opd.namaOpd}</p>
                    </td>
                    <td className="p-3.5">
                      <p className="font-bold text-stone-900">{opd.kepalaNama}</p>
                      <p className="text-[11px] text-stone-500">{opd.kepalaJabatan}</p>
                      {opd.kepalaNip && (
                        <p className="text-[10px] font-mono text-stone-400 mt-0.5">NIP. {opd.kepalaNip}</p>
                      )}
                    </td>
                    <td className="p-3.5 text-stone-600">
                      <p className="text-[11px] font-mono flex items-center gap-1 text-stone-700">
                        <span>✉</span> {opd.emailKontak}
                      </p>
                      <p className="text-[11px] font-mono flex items-center gap-1 text-stone-600 mt-0.5">
                        <span>☎</span> {opd.teleponKontak}
                      </p>
                      <p className="text-[10px] text-stone-400 line-clamp-1 mt-0.5" title={opd.alamatKantor}>
                        {opd.alamatKantor}
                      </p>
                    </td>
                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {opd.fokusMisiRpjmd.map((m) => (
                          <span
                            key={m}
                            className="px-1.5 py-0.5 bg-stone-100 text-stone-700 rounded text-[10px] font-mono border border-stone-200"
                            title={MISI_LABELS[m]?.judul}
                          >
                            {MISI_LABELS[m]?.nomor}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => onToggleOpdStatus(opd.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer border ${
                          opd.statusAktif
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-stone-100 text-stone-600 border-stone-300 hover:bg-stone-200'
                        }`}
                        title="Klik untuk mengubah status keaktifan OPD"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${opd.statusAktif ? 'bg-emerald-600' : 'bg-stone-400'}`}></span>
                        <span>{opd.statusAktif ? 'Aktif' : 'Non-Aktif'}</span>
                      </button>
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(opd)}
                          className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 border border-stone-300 rounded text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                          title="Edit Data OPD"
                        >
                          <svg className="w-3 h-3 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingOpd(opd)}
                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-xs font-semibold transition-colors cursor-pointer"
                          title="Hapus OPD"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Form Tambah / Edit OPD */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  {editingOpd ? `Edit Perangkat Daerah: ${editingOpd.singkatan}` : 'Tambah Perangkat Daerah (OPD) Baru'}
                </h3>
                <p className="text-[11px] text-stone-500">
                  Kabupaten Tanggamus, Provinsi Lampung • Penanggung Jawab Disposisi RPJMD
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
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nama Resmi Unit Kerja / OPD *
                  </label>
                  <input
                    type="text"
                    required
                    value={namaOpd}
                    onChange={(e) => setNamaOpd(e.target.value)}
                    placeholder="Contoh: Dinas Pekerjaan Umum dan Perumahan Rakyat"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Singkatan / Akronim *
                  </label>
                  <input
                    type="text"
                    required
                    value={singkatan}
                    onChange={(e) => setSingkatan(e.target.value)}
                    placeholder="Contoh: DINAS PUPR"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Kode Unit Kerja / Rekening *
                  </label>
                  <input
                    type="text"
                    required
                    value={kodeOpd}
                    onChange={(e) => setKodeOpd(e.target.value)}
                    placeholder="Contoh: 1.03.01.01"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Kategori Kelembagaan *
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value as UnitKerjaOPD['kategori'])}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  >
                    <option value="dinas">Dinas Teknis Daerah</option>
                    <option value="badan">Badan Perencanaan / Pendapatan / Bencana</option>
                    <option value="sekretariat">Sekretariat Daerah / Dewan</option>
                    <option value="inspektorat">Inspektorat Daerah</option>
                    <option value="unit_khusus">Satuan Khusus / Kantor Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nama Pimpinan / Kepala OPD *
                  </label>
                  <input
                    type="text"
                    required
                    value={kepalaNama}
                    onChange={(e) => setKepalaNama(e.target.value)}
                    placeholder="Contoh: Ir. Riski Septiansyah, S.T., M.T."
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    NIP Kepala OPD
                  </label>
                  <input
                    type="text"
                    value={kepalaNip}
                    onChange={(e) => setKepalaNip(e.target.value)}
                    placeholder="19760920 200212 1 005"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Jabatan Resmi Pimpinan
                </label>
                <input
                  type="text"
                  value={kepalaJabatan}
                  onChange={(e) => setKepalaJabatan(e.target.value)}
                  placeholder="Contoh: Kepala Dinas Pekerjaan Umum dan Penataan Ruang Kab. Tanggamus"
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Kontak Resmi
                  </label>
                  <input
                    type="email"
                    value={emailKontak}
                    onChange={(e) => setEmailKontak(e.target.value)}
                    placeholder="pupr@tanggamus.go.id"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nomor Telepon Kantor
                  </label>
                  <input
                    type="text"
                    value={teleponKontak}
                    onChange={(e) => setTeleponKontak(e.target.value)}
                    placeholder="(0722) 21155"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Alamat Kantor
                </label>
                <input
                  type="text"
                  value={alamatKantor}
                  onChange={(e) => setAlamatKantor(e.target.value)}
                  placeholder="Jl. Merdeka No. 45, Kuripan, Kota Agung, Kab. Tanggamus"
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Keterkaitan Misi RPJMD (Pilih minimal 1 Misi Utama)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  {(['sdm_kesehatan', 'ekonomi_umkm', 'infrastruktur_hijau', 'tata_kelola_digital', 'sosial_budaya'] as MisiRPJMD[]).map((m) => {
                    const isChecked = selectedMisi.includes(m);
                    return (
                      <label
                        key={m}
                        className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer border text-[11px] transition-colors ${
                          isChecked ? 'bg-white border-emerald-600 shadow-2xs' : 'bg-transparent border-transparent text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleMisi(m)}
                          className="mt-0.5 rounded text-emerald-800 focus:ring-emerald-800 cursor-pointer"
                        />
                        <div>
                          <strong className="block text-stone-900">{MISI_LABELS[m]?.nomor}: {MISI_LABELS[m]?.judul}</strong>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="statusAktifCheck"
                  checked={statusAktif}
                  onChange={(e) => setStatusAktif(e.target.checked)}
                  className="rounded text-emerald-800 focus:ring-emerald-800 cursor-pointer"
                />
                <label htmlFor="statusAktifCheck" className="text-xs font-semibold text-stone-800 cursor-pointer">
                  Unit Kerja Aktif (Dapat menerima dan mendisposisikan telaah aspirasi)
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
                  {editingOpd ? 'Simpan Perubahan OPD' : 'Daftarkan OPD Baru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Konfirmasi Hapus OPD */}
      {deletingOpd && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <div className="text-center">
              <h4 className="text-base font-serif font-bold text-stone-900">
                Hapus Perangkat Daerah (OPD)?
              </h4>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Anda akan menghapus data <strong>{deletingOpd.namaOpd} ({deletingOpd.singkatan})</strong>.
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingOpd(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-2xs cursor-pointer"
              >
                Ya, Hapus OPD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
