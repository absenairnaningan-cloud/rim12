import React, { useState, useMemo } from 'react';
import { KemitraanCSR, MisiRPJMDItem, UnitKerjaOPD } from '../types';
import { MISI_LABELS } from '../data/mockData';

interface PenyelarasanCsrManagerProps {
  csrPrograms: KemitraanCSR[];
  misiList?: MisiRPJMDItem[];
  opdList?: UnitKerjaOPD[];
  onAddCsrProgram: (newProgram: KemitraanCSR) => void;
  onUpdateCsrProgram: (updatedProgram: KemitraanCSR) => void;
  onDeleteCsrProgram: (programId: string) => void;
}

export const PenyelarasanCsrManager: React.FC<PenyelarasanCsrManagerProps> = ({
  csrPrograms,
  misiList = [],
  opdList = [],
  onAddCsrProgram,
  onUpdateCsrProgram,
  onDeleteCsrProgram,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMisi, setFilterMisi] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<KemitraanCSR | null>(null);
  const [deletingProgram, setDeletingProgram] = useState<KemitraanCSR | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Form input states
  const [idProg, setIdProg] = useState('');
  const [namaProgram, setNamaProgram] = useState('');
  const [bidang, setBidang] = useState('');
  const [misiId, setMisiId] = useState<string>('sdm_kesehatan');
  const [deskripsi, setDeskripsi] = useState('');
  const [targetLokasi, setTargetLokasi] = useState('');
  const [kebutuhanEstimasi, setKebutuhanEstimasi] = useState('');
  const [komitmenTerkumpul, setKomitmenTerkumpul] = useState('');
  const [persentaseTercapai, setPersentaseTercapai] = useState<number>(0);
  const [opdPendamping, setOpdPendamping] = useState('');
  const [status, setStatus] = useState<'terbuka' | 'proses_mou' | 'berjalan'>('terbuka');
  const [impactMetrics, setImpactMetrics] = useState('');
  const [mitraInput, setMitraInput] = useState('');
  const [mitraList, setMitraList] = useState<string[]>([]);

  // Filtered programs
  const filteredPrograms = useMemo(() => {
    return csrPrograms.filter((prog) => {
      if (filterMisi !== 'all' && prog.misiId !== filterMisi) return false;
      if (filterStatus !== 'all' && prog.status !== filterStatus) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchNama = prog.namaProgram.toLowerCase().includes(q);
        const matchBidang = prog.bidang.toLowerCase().includes(q);
        const matchOpd = prog.opdPendamping.toLowerCase().includes(q);
        const matchLokasi = prog.targetLokasi.toLowerCase().includes(q);
        const matchMitra = prog.mitraBergabung.some((m) => m.toLowerCase().includes(q));
        return matchNama || matchBidang || matchOpd || matchLokasi || matchMitra;
      }
      return true;
    });
  }, [csrPrograms, filterMisi, filterStatus, searchQuery]);

  // Summary Metrics
  const totalPrograms = csrPrograms.length;
  const totalBerjalan = csrPrograms.filter((p) => p.status === 'berjalan').length;
  const totalMoU = csrPrograms.filter((p) => p.status === 'proses_mou').length;
  const totalTerbuka = csrPrograms.filter((p) => p.status === 'terbuka').length;

  const resetForm = () => {
    const defaultMisi = misiList.length > 0 ? misiList[0].id : 'sdm_kesehatan';
    const defaultOpd = opdList.length > 0 ? opdList[0].namaOpd : 'Bapperida Tanggamus';
    setIdProg(`CSR-${Date.now().toString().slice(-4)}`);
    setNamaProgram('');
    setBidang('Infrastruktur & Lingkungan');
    setMisiId(defaultMisi);
    setDeskripsi('');
    setTargetLokasi('Kabupaten Tanggamus');
    setKebutuhanEstimasi('Rp 500.000.000');
    setKomitmenTerkumpul('Rp 0');
    setPersentaseTercapai(0);
    setOpdPendamping(defaultOpd);
    setStatus('terbuka');
    setImpactMetrics('');
    setMitraInput('');
    setMitraList([]);
    setEditingProgram(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowFormModal(true);
  };

  const handleOpenEditModal = (prog: KemitraanCSR) => {
    setEditingProgram(prog);
    setIdProg(prog.id);
    setNamaProgram(prog.namaProgram);
    setBidang(prog.bidang);
    setMisiId(prog.misiId);
    setDeskripsi(prog.deskripsi);
    setTargetLokasi(prog.targetLokasi);
    setKebutuhanEstimasi(prog.kebutuhanEstimasi);
    setKomitmenTerkumpul(prog.komitmenTerkumpul);
    setPersentaseTercapai(prog.persentaseTercapai || 0);
    setOpdPendamping(prog.opdPendamping);
    setStatus(prog.status);
    setImpactMetrics(prog.impactMetrics);
    setMitraList([...prog.mitraBergabung]);
    setShowFormModal(true);
  };

  const handleAddMitraChip = () => {
    if (mitraInput.trim() && !mitraList.includes(mitraInput.trim())) {
      setMitraList([...mitraList, mitraInput.trim()]);
      setMitraInput('');
    }
  };

  const handleRemoveMitraChip = (mitraToRemove: string) => {
    setMitraList(mitraList.filter((m) => m !== mitraToRemove));
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaProgram.trim() || !deskripsi.trim()) return;

    if (editingProgram) {
      const updated: KemitraanCSR = {
        ...editingProgram,
        namaProgram: namaProgram.trim(),
        bidang: bidang.trim(),
        misiId,
        deskripsi: deskripsi.trim(),
        targetLokasi: targetLokasi.trim() || 'Kabupaten Tanggamus',
        kebutuhanEstimasi: kebutuhanEstimasi.trim() || 'Sesuai Renja',
        komitmenTerkumpul: komitmenTerkumpul.trim() || 'Rp 0',
        persentaseTercapai: Number(persentaseTercapai) || 0,
        opdPendamping: opdPendamping.trim() || 'Bapperida Tanggamus',
        status,
        impactMetrics: impactMetrics.trim() || 'Peningkatan kesejahteraan masyarakat',
        mitraBergabung: mitraList,
      };
      onUpdateCsrProgram(updated);
      setNotification(`Program CSR "${updated.namaProgram}" berhasil diperbarui.`);
    } else {
      const newProgram: KemitraanCSR = {
        id: idProg.trim() || `CSR-${Date.now().toString().slice(-4)}`,
        namaProgram: namaProgram.trim(),
        bidang: bidang.trim(),
        misiId,
        deskripsi: deskripsi.trim(),
        targetLokasi: targetLokasi.trim() || 'Kabupaten Tanggamus',
        kebutuhanEstimasi: kebutuhanEstimasi.trim() || 'Sesuai Kebutuhan',
        komitmenTerkumpul: komitmenTerkumpul.trim() || 'Rp 0',
        persentaseTercapai: Number(persentaseTercapai) || 0,
        opdPendamping: opdPendamping.trim() || 'Bapperida Tanggamus',
        status,
        impactMetrics: impactMetrics.trim() || 'Peningkatan dampak pembangunan non-APBD',
        mitraBergabung: mitraList,
      };
      onAddCsrProgram(newProgram);
      setNotification(`Program CSR "${newProgram.namaProgram}" berhasil ditambahkan.`);
    }

    setShowFormModal(false);
    resetForm();
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const handleConfirmDelete = () => {
    if (!deletingProgram) return;
    const name = deletingProgram.namaProgram;
    onDeleteCsrProgram(deletingProgram.id);
    setDeletingProgram(null);
    setNotification(`Program CSR "${name}" berhasil dihapus.`);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const getMisiLabel = (id: string) => {
    if (MISI_LABELS[id]) {
      return `${MISI_LABELS[id].nomor}: ${MISI_LABELS[id].judul}`;
    }
    const found = misiList.find((m) => m.id === id);
    if (found) {
      return `${found.nomor}: ${found.judul}`;
    }
    return `Misi (${id})`;
  };

  const getStatusBadge = (st: KemitraanCSR['status']) => {
    switch (st) {
      case 'berjalan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            Sedang Berjalan
          </span>
        );
      case 'proses_mou':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-300">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Proses MoU / PKS
          </span>
        );
      case 'terbuka':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            Terbuka untuk Mitra
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs text-emerald-900 animate-fade-in shadow-xs">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">✓</span>
            <span>{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold px-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Header Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <span>Sinkronisasi Kolaboratif Non-APBD</span>
            <span aria-hidden="true">•</span>
            <span>Forum TJSLP / CSR Tanggamus</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
            Penyelarasan Misi RPJMD & Program CSR
          </h2>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
            Kurasi dan sandingan program kemitraan dunia usaha swasta/BUMN dengan kebutuhan pembiayaan di renja masing-masing perangkat daerah agar selaras dengan sasaran Misi RPJMD tanpa tumpang tindih anggaran.
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
          <span>+ Tambah Program CSR</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <p className="text-xs font-medium text-stone-500">Total Program CSR</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-stone-900">{totalPrograms}</span>
            <span className="text-[11px] text-stone-400 font-mono">Inisiatif</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <p className="text-xs font-medium text-stone-500">Program Berjalan</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-emerald-800">{totalBerjalan}</span>
            <span className="text-[11px] text-emerald-600 font-semibold font-mono">Aktif di Lapangan</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <p className="text-xs font-medium text-stone-500">Dalam Proses MoU / PKS</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-blue-900">{totalMoU}</span>
            <span className="text-[11px] text-stone-400 font-mono">Penandatanganan</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <p className="text-xs font-medium text-stone-500">Peluang Terbuka Mitra</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-amber-800">{totalTerbuka}</span>
            <span className="text-[11px] text-amber-600 font-semibold font-mono">Menunggu Adopsi</span>
          </div>
        </div>
      </div>

      {/* Filter, Search & View Controls */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full lg:max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari program CSR, bidang, dinas pengampu, atau mitra..."
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

          {/* Filters & View Switch */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {/* Filter Misi */}
            <div className="flex items-center gap-1.5 text-xs text-stone-600">
              <span className="hidden sm:inline">Misi:</span>
              <select
                value={filterMisi}
                onChange={(e) => setFilterMisi(e.target.value)}
                className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-800 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-800"
              >
                <option value="all">Semua Misi RPJMD</option>
                {misiList.length > 0 ? (
                  misiList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nomor}: {m.judul.length > 25 ? `${m.judul.slice(0, 25)}...` : m.judul}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="sdm_kesehatan">Misi 1: SDM & Kesehatan</option>
                    <option value="ekonomi_umkm">Misi 2: Ekonomi & UMKM</option>
                    <option value="infrastruktur_hijau">Misi 3: Infrastruktur & Lingkungan</option>
                    <option value="tata_kelola_digital">Misi 4: Tata Kelola & Digital</option>
                    <option value="sosial_budaya">Misi 5: Sosial & Budaya</option>
                  </>
                )}
              </select>
            </div>

            {/* Filter Status */}
            <div className="flex items-center gap-1.5 text-xs text-stone-600">
              <span className="hidden sm:inline">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-800 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-800"
              >
                <option value="all">Semua Status</option>
                <option value="terbuka">Terbuka</option>
                <option value="proses_mou">Proses MoU</option>
                <option value="berjalan">Berjalan</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-stone-300 bg-stone-100 p-0.5 ml-auto sm:ml-0">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-emerald-950 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Tampilan Grid Kartu"
              >
                Kartu
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-emerald-950 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Tampilan Tabel Rinci"
              >
                Tabel
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-stone-500 pt-1 border-t border-stone-100">
          <span>Menampilkan <strong>{filteredPrograms.length}</strong> program kemitraan CSR disandingkan dengan Misi RPJMD</span>
        </div>
      </div>

      {/* Program Display Area: Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredPrograms.length === 0 ? (
            <div className="col-span-2 bg-white rounded-xl border border-stone-200 p-8 text-center text-stone-500 text-xs">
              Tidak ada program kemitraan CSR yang cocok dengan kriteria pencarian.
            </div>
          ) : (
            filteredPrograms.map((prog) => (
              <div
                key={prog.id}
                className="bg-white rounded-xl border border-stone-200 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-stone-100 text-stone-700 border border-stone-200">
                          {prog.id}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200">
                          {prog.bidang}
                        </span>
                        {getStatusBadge(prog.status)}
                      </div>
                      <h3 className="text-base font-serif font-bold text-stone-900 mt-2 leading-snug">
                        {prog.namaProgram}
                      </h3>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(prog)}
                        className="p-1.5 text-stone-700 hover:text-emerald-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer border border-stone-200"
                        title="Edit Program CSR"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingProgram(prog)}
                        className="p-1.5 text-rose-700 hover:text-rose-900 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border border-rose-200"
                        title="Hapus Program CSR"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    {prog.deskripsi}
                  </p>

                  {/* Keselarasan Misi RPJMD */}
                  <div className="mt-3 p-2.5 bg-stone-50 rounded-lg border border-stone-200/80 text-[11px]">
                    <div className="text-stone-500 font-medium">Keselarasan Misi RPJMD:</div>
                    <div className="font-semibold text-emerald-950 mt-0.5">
                      ✓ {getMisiLabel(prog.misiId)}
                    </div>
                  </div>

                  {/* Financial & Progress */}
                  <div className="mt-3 space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-stone-500">Komitmen: <strong className="text-emerald-900 font-bold">{prog.komitmenTerkumpul}</strong></span>
                      <span className="text-stone-500">Target: <strong className="text-stone-800">{prog.kebutuhanEstimasi}</strong></span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-700 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(prog.persentaseTercapai, 100)}%` }}
                      />
                    </div>
                    <div className="text-right text-[10px] font-mono text-stone-500">
                      Capai komitmen: <strong>{prog.persentaseTercapai}%</strong>
                    </div>
                  </div>

                  {/* Impact & Partner Info */}
                  <div className="mt-3 pt-3 border-t border-stone-100 text-xs space-y-1.5">
                    <div className="text-[11px] text-stone-600">
                      <span className="text-stone-400 font-medium">Target Lokasi:</span> {prog.targetLokasi}
                    </div>
                    <div className="text-[11px] text-stone-600">
                      <span className="text-stone-400 font-medium">Target Dampak (Impact):</span> {prog.impactMetrics}
                    </div>
                    {prog.mitraBergabung && prog.mitraBergabung.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <span className="text-[10px] text-stone-400 font-medium">Mitra Bergabung:</span>
                        {prog.mitraBergabung.map((m, i) => (
                          <span key={i} className="px-2 py-0.5 bg-stone-100 text-stone-800 rounded text-[10px] font-medium border border-stone-200">
                            • {m}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span>OPD Pendamping: <strong className="text-stone-800">{prog.opdPendamping}</strong></span>
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(prog)}
                    className="text-emerald-800 hover:text-emerald-950 font-semibold cursor-pointer"
                  >
                    Edit Program →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Program Display Area: Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-mono">
                  <th className="p-3.5 font-semibold">Program CSR & Bidang</th>
                  <th className="p-3.5 font-semibold">Misi RPJMD Diselaraskan</th>
                  <th className="p-3.5 font-semibold">OPD Pendamping & Lokasi</th>
                  <th className="p-3.5 font-semibold">Komitmen / Target</th>
                  <th className="p-3.5 font-semibold text-center">Status</th>
                  <th className="p-3.5 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredPrograms.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-stone-500">
                      Tidak ada program CSR yang sesuai.
                    </td>
                  </tr>
                ) : (
                  filteredPrograms.map((prog) => (
                    <tr key={prog.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="p-3.5">
                        <span className="font-mono text-[10px] text-stone-400 block">{prog.id}</span>
                        <strong className="text-stone-900 block text-xs">{prog.namaProgram}</strong>
                        <span className="text-[11px] text-emerald-800 font-medium">{prog.bidang}</span>
                        {prog.mitraBergabung && prog.mitraBergabung.length > 0 && (
                          <div className="text-[10px] text-stone-500 mt-1">
                            Mitra: {prog.mitraBergabung.join(', ')}
                          </div>
                        )}
                      </td>
                      <td className="p-3.5 max-w-xs">
                        <span className="text-xs text-stone-800 font-medium block">
                          ✓ {getMisiLabel(prog.misiId)}
                        </span>
                        <span className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                          {prog.impactMetrics}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-stone-800 block">{prog.opdPendamping}</span>
                        <span className="text-stone-500 text-[11px]">{prog.targetLokasi}</span>
                      </td>
                      <td className="p-3.5 font-mono text-[11px]">
                        <span className="text-emerald-900 font-bold block">{prog.komitmenTerkumpul}</span>
                        <span className="text-stone-500">Target: {prog.kebutuhanEstimasi}</span>
                        <div className="w-24 bg-stone-200 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className="bg-emerald-600 h-1.5 rounded-full"
                            style={{ width: `${Math.min(prog.persentaseTercapai, 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="p-3.5 text-center whitespace-nowrap">
                        {getStatusBadge(prog.status)}
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap space-x-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(prog)}
                          className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md text-xs font-semibold transition-colors cursor-pointer border border-stone-200"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingProgram(prog)}
                          className="px-2.5 py-1 text-rose-700 hover:text-rose-900 hover:bg-rose-50 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Form Tambah / Edit Program CSR */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  {editingProgram ? 'Edit Program Penyelarasan Misi & CSR' : 'Tambah Program CSR / TJSLP Baru'}
                </h3>
                <p className="text-[11px] text-stone-500">
                  Penyelarasan komitmen pembiayaan non-APBD dengan target Misi RPJMD Kabupaten Tanggamus
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
                    Nama Inisiatif / Program CSR *
                  </label>
                  <input
                    type="text"
                    required
                    value={namaProgram}
                    onChange={(e) => setNamaProgram(e.target.value)}
                    placeholder="Contoh: Program Sumur Bor Komunal & Sanitasi Sehat Pekon"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Kode ID Program *
                  </label>
                  <input
                    type="text"
                    required
                    value={idProg}
                    onChange={(e) => setIdProg(e.target.value)}
                    disabled={!!editingProgram}
                    placeholder="CSR-2025"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-800 disabled:bg-stone-100 disabled:text-stone-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Bidang Kolaborasi *
                  </label>
                  <input
                    type="text"
                    required
                    value={bidang}
                    onChange={(e) => setBidang(e.target.value)}
                    placeholder="Contoh: Infrastruktur & Sanitasi Air Bersih"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Penyelarasan Misi RPJMD *
                  </label>
                  <select
                    value={misiId}
                    onChange={(e) => setMisiId(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  >
                    {misiList.length > 0 ? (
                      misiList.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nomor}: {m.judul}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="sdm_kesehatan">Misi 1: Peningkatan Kualitas SDM & Kesehatan</option>
                        <option value="ekonomi_umkm">Misi 2: Transformasi Ekonomi Kerakyatan & UMKM</option>
                        <option value="infrastruktur_hijau">Misi 3: Infrastruktur Berkelanjutan & Lingkungan</option>
                        <option value="tata_kelola_digital">Misi 4: Tata Kelola Pemerintahan Akuntabel</option>
                        <option value="sosial_budaya">Misi 5: Ketahanan Sosial, Inklusi & Budaya</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Deskripsi Program & Bentuk Bantuan Non-APBD *
                </label>
                <textarea
                  required
                  rows={3}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Jelaskan kebutuhan riil, jenis bantuan (fisik/sarpras/pelatihan), dan sinerginya dengan renja..."
                  className="w-full bg-white border border-stone-300 rounded-lg p-3 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    OPD Pendamping Teknis *
                  </label>
                  <input
                    type="text"
                    required
                    list="opdListDatalist"
                    value={opdPendamping}
                    onChange={(e) => setOpdPendamping(e.target.value)}
                    placeholder="Contoh: Dinas Pekerjaan Umum dan Perumahan Rakyat (PUPR)"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                  <datalist id="opdListDatalist">
                    {opdList.map((opd) => (
                      <option key={opd.id} value={opd.namaOpd} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Target Lokasi / Wilayah *
                  </label>
                  <input
                    type="text"
                    required
                    value={targetLokasi}
                    onChange={(e) => setTargetLokasi(e.target.value)}
                    placeholder="Contoh: Kecamatan Wonosobo & Semaka"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Estimasi Kebutuhan Anggaran
                  </label>
                  <input
                    type="text"
                    value={kebutuhanEstimasi}
                    onChange={(e) => setKebutuhanEstimasi(e.target.value)}
                    placeholder="Contoh: Rp 800.000.000"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Komitmen Terkumpul Saat Ini
                  </label>
                  <input
                    type="text"
                    value={komitmenTerkumpul}
                    onChange={(e) => setKomitmenTerkumpul(e.target.value)}
                    placeholder="Contoh: Rp 350.000.000"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Persentase Capai (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={persentaseTercapai}
                    onChange={(e) => setPersentaseTercapai(Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Status Pelaksanaan Kemitraan *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as KemitraanCSR['status'])}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  >
                    <option value="terbuka">Terbuka untuk Mitra Baru (Proposal)</option>
                    <option value="proses_mou">Dalam Proses Penandatanganan MoU / PKS</option>
                    <option value="berjalan">Sudah Berjalan / Terealisasi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Indikator Target Dampak (Impact Metrics)
                  </label>
                  <input
                    type="text"
                    value={impactMetrics}
                    onChange={(e) => setImpactMetrics(e.target.value)}
                    placeholder="Contoh: 850 KK teraliri air bersih layak minum"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
              </div>

              {/* Mitra Tags Input */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mitra Perusahaan / BUMN Terlibat
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={mitraInput}
                    onChange={(e) => setMitraInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddMitraChip();
                      }
                    }}
                    placeholder="Ketik nama perusahaan / BUMN lalu klik Tambah..."
                    className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddMitraChip}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-semibold border border-stone-300 transition-colors cursor-pointer"
                  >
                    + Tambah Mitra
                  </button>
                </div>
                {mitraList.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 p-2 bg-stone-50 rounded-lg border border-stone-200">
                    {mitraList.map((m, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-stone-300 text-stone-800 text-xs shadow-2xs"
                      >
                        <span>🏢 {m}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMitraChip(m)}
                          className="text-stone-400 hover:text-rose-600 font-bold cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-stone-400 italic">Belum ada mitra yang ditambahkan.</p>
                )}
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
                  {editingProgram ? 'Simpan Perubahan Program' : 'Daftarkan Program CSR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Konfirmasi Hapus Program CSR */}
      {deletingProgram && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <div className="text-center">
              <h4 className="text-base font-serif font-bold text-stone-900">
                Hapus Program Penyelarasan CSR?
              </h4>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Anda akan menghapus data program <strong>{deletingProgram.namaProgram}</strong> (ID: {deletingProgram.id}).
                Data kemitraan ini tidak akan lagi tampil pada lembar penyelarasan dan portal CSR publik.
              </p>
            </div>
            <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingProgram(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-2xs cursor-pointer"
              >
                Ya, Hapus Program
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
