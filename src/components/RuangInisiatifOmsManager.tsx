import React, { useState, useMemo } from 'react';
import { InisiatifOMS, MisiRPJMDItem } from '../types';
import { MISI_LABELS, KECAMATAN_TANGGAMUS, PEKON_TANGGAMUS_MAP } from '../data/mockData';

interface RuangInisiatifOmsManagerProps {
  inisiatifList: InisiatifOMS[];
  misiList?: MisiRPJMDItem[];
  onAddInisiatif: (newInit: InisiatifOMS) => void;
  onUpdateInisiatif: (updatedInit: InisiatifOMS) => void;
  onDeleteInisiatif: (id: string) => void;
}

export const RuangInisiatifOmsManager: React.FC<RuangInisiatifOmsManagerProps> = ({
  inisiatifList,
  misiList = [],
  onAddInisiatif,
  onUpdateInisiatif,
  onDeleteInisiatif,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMisi, setFilterMisi] = useState('all');
  const [filterKecamatan, setFilterKecamatan] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingInisiatif, setEditingInisiatif] = useState<InisiatifOMS | null>(null);
  const [deletingInisiatif, setDeletingInisiatif] = useState<InisiatifOMS | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form states
  const [idInisiatif, setIdInisiatif] = useState('');
  const [namaOrg, setNamaOrg] = useState('');
  const [kontak, setKontak] = useState('');
  const [fokus, setFokus] = useState('');
  const [misiId, setMisiId] = useState<string>('sosial_budaya');
  const [judul, setJudul] = useState('');
  
  // 3-Kolom Wilayah Dampingan
  const [selectedKecamatan, setSelectedKecamatan] = useState('');
  const [selectedPekon, setSelectedPekon] = useState('');
  const [detailAlamat, setDetailAlamat] = useState('');
  const [sasaran, setSasaran] = useState('');
  const [capaian, setCapaian] = useState('');
  const [tuntutan, setTuntutan] = useState('');
  const [responPemda, setResponPemda] = useState('');

  const availablePekons = selectedKecamatan ? PEKON_TANGGAMUS_MAP[selectedKecamatan] || [] : [];

  const handleKecamatanChange = (kec: string) => {
    setSelectedKecamatan(kec);
    setSelectedPekon('');
  };

  // Filtered inisiatif
  const filteredList = useMemo(() => {
    return inisiatifList.filter((item) => {
      if (filterMisi !== 'all' && item.misiId !== filterMisi) return false;
      if (filterKecamatan !== 'all' && !item.wilayahDampingan.toLowerCase().includes(filterKecamatan.toLowerCase())) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchJudul = item.judulInisiatif.toLowerCase().includes(q);
        const matchOrg = item.namaOrganisasi.toLowerCase().includes(q);
        const matchFokus = item.fokusAdvokasi.toLowerCase().includes(q);
        const matchWilayah = item.wilayahDampingan.toLowerCase().includes(q);
        const matchTuntutan = item.tuntutanKebijakan.toLowerCase().includes(q);
        return matchJudul || matchOrg || matchFokus || matchWilayah || matchTuntutan;
      }
      return true;
    });
  }, [inisiatifList, filterMisi, filterKecamatan, searchQuery]);

  // Statistics
  const totalInisiatif = inisiatifList.length;
  const uniqueOrgCount = new Set(inisiatifList.map((i) => i.namaOrganisasi)).size;

  const resetForm = () => {
    setIdInisiatif(`OMS-${Date.now().toString().slice(-4)}`);
    setNamaOrg('');
    setKontak('');
    setFokus('');
    setMisiId(misiList.length > 0 ? misiList[0].id : 'sosial_budaya');
    setJudul('');
    setSelectedKecamatan('');
    setSelectedPekon('');
    setDetailAlamat('');
    setSasaran('');
    setCapaian('');
    setTuntutan('');
    setResponPemda('Diterima oleh Sekretariat Bapperida Tanggamus untuk dikurasi pada forum Musrenbang Tematik.');
    setEditingInisiatif(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (item: InisiatifOMS) => {
    setEditingInisiatif(item);
    setIdInisiatif(item.id);
    setNamaOrg(item.namaOrganisasi);
    setKontak(item.kontakPerson || '');
    setFokus(item.fokusAdvokasi);
    setMisiId(item.misiId);
    setJudul(item.judulInisiatif);

    // Try to parse existing wilayahDampingan into kecamatan, pekon, detail
    const foundKec = KECAMATAN_TANGGAMUS.find((k) => item.wilayahDampingan.includes(k)) || '';
    setSelectedKecamatan(foundKec);
    
    // Parse pekon if found
    let parsedPekon = '';
    if (foundKec && PEKON_TANGGAMUS_MAP[foundKec]) {
      const matchPekon = PEKON_TANGGAMUS_MAP[foundKec].find((p) => item.wilayahDampingan.includes(p));
      if (matchPekon) parsedPekon = matchPekon;
    }
    setSelectedPekon(parsedPekon);

    // Detail alamat extract
    const detailMatch = item.wilayahDampingan.match(/\((.*?)\)/);
    setDetailAlamat(detailMatch ? detailMatch[1] : '');

    setSasaran(item.kelompokSasaran);
    setCapaian(item.hasilCapaian);
    setTuntutan(item.tuntutanKebijakan);
    setResponPemda(item.responPemda || '');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaOrg.trim() || !judul.trim() || !tuntutan.trim()) return;

    const wilayahGabungan = [
      selectedPekon,
      selectedKecamatan,
      detailAlamat ? `(${detailAlamat})` : ''
    ].filter(Boolean).join(', ') || 'Kabupaten Tanggamus';

    if (editingInisiatif) {
      const updated: InisiatifOMS = {
        ...editingInisiatif,
        namaOrganisasi: namaOrg.trim(),
        kontakPerson: kontak.trim() || 'Narahubung Komunitas',
        fokusAdvokasi: fokus.trim() || 'Inklusi Sosial & Hak Komunitas',
        misiId,
        judulInisiatif: judul.trim(),
        wilayahDampingan: wilayahGabungan,
        kelompokSasaran: sasaran.trim() || 'Masyarakat luas',
        hasilCapaian: capaian.trim() || 'Gerakan swadaya aktif',
        tuntutanKebijakan: tuntutan.trim(),
        responPemda: responPemda.trim() || 'Telah diverifikasi tim perencana Bapperida Tanggamus.',
      };
      onUpdateInisiatif(updated);
      setToastMsg(`Inisiatif "${updated.judulInisiatif}" berhasil diperbarui.`);
    } else {
      const created: InisiatifOMS = {
        id: idInisiatif.trim() || `OMS-${Date.now().toString().slice(-4)}`,
        namaOrganisasi: namaOrg.trim(),
        kontakPerson: kontak.trim() || 'Narahubung Komunitas',
        fokusAdvokasi: fokus.trim() || 'Inklusi Sosial & Hak Komunitas',
        misiId,
        judulInisiatif: judul.trim(),
        wilayahDampingan: wilayahGabungan,
        kelompokSasaran: sasaran.trim() || 'Masyarakat luas',
        hasilCapaian: capaian.trim() || 'Gerakan swadaya aktif',
        tuntutanKebijakan: tuntutan.trim(),
        responPemda: responPemda.trim() || 'Diterima oleh Sekretariat Bapperida Tanggamus untuk disinkronkan ke dokumen perencanaan daerah.',
        tanggalMulai: `Tahun ${new Date().getFullYear()} - Aktif`,
      };
      onAddInisiatif(created);
      setToastMsg(`Inisiatif "${created.judulInisiatif}" dari ${created.namaOrganisasi} berhasil ditambahkan.`);
    }

    setShowModal(false);
    resetForm();
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleConfirmDelete = () => {
    if (!deletingInisiatif) return;
    const judulDel = deletingInisiatif.judulInisiatif;
    onDeleteInisiatif(deletingInisiatif.id);
    setDeletingInisiatif(null);
    setToastMsg(`Inisiatif "${judulDel}" berhasil dihapus dari sistem.`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const getMisiName = (id: string) => {
    if (MISI_LABELS[id]) {
      return `${MISI_LABELS[id].nomor}: ${MISI_LABELS[id].judul}`;
    }
    const found = misiList.find((m) => m.id === id);
    if (found) {
      return `${found.nomor}: ${found.judul}`;
    }
    return `Misi (${id})`;
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs text-emerald-900 animate-fade-in shadow-xs">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">✓</span>
            <span>{toastMsg}</span>
          </div>
          <button
            onClick={() => setToastMsg(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold px-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <span>Pilar Pentahelix Masyarakat Sipil</span>
            <span aria-hidden="true">•</span>
            <span>Forum Komunitas & OMS Tanggamus</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
            Ruang Inisiatif & Advokasi Masyarakat Sipil
          </h2>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
            Pusat pengelolaan usulan advokasi, gerakan akar rumput, pendampingan kelompok rentan, dan pelestarian lingkungan oleh OMS/LSM untuk dikawal masuk ke dalam rumusan dokumen RPJMD & Musrenbang Tematik.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="self-start md:self-auto px-4 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>+ Tambah Inisiatif Komunitas</span>
        </button>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <p className="text-xs font-medium text-stone-500">Total Inisiatif Komunitas</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-stone-900">{totalInisiatif}</span>
            <span className="text-[11px] text-stone-400 font-mono">Gerakan</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <p className="text-xs font-medium text-stone-500">Organisasi / Komunitas</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-emerald-800">{uniqueOrgCount}</span>
            <span className="text-[11px] text-emerald-600 font-semibold font-mono">Lembaga Aktif</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <p className="text-xs font-medium text-stone-500">Kelompok Sasaran Rentan</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-blue-900">100%</span>
            <span className="text-[11px] text-stone-400 font-mono">Terpetakan</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <p className="text-xs font-medium text-stone-500">Kanal Integrasi Musrenbang</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-purple-900">Tematik</span>
            <span className="text-[11px] text-purple-600 font-semibold font-mono">Inklusi & Gender</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          <div className="relative w-full lg:max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama organisasi, judul inisiatif, wilayah, atau tuntutan..."
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

            {/* Filter Kecamatan */}
            <div className="flex items-center gap-1.5 text-xs text-stone-600">
              <span className="hidden sm:inline">Kecamatan:</span>
              <select
                value={filterKecamatan}
                onChange={(e) => setFilterKecamatan(e.target.value)}
                className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-800 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-800 max-w-[170px]"
              >
                <option value="all">Semua Wilayah</option>
                {KECAMATAN_TANGGAMUS.map((kec) => (
                  <option key={kec} value={kec}>{kec}</option>
                ))}
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
                title="Tampilan Kartu"
              >
                Kartu
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-emerald-950 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Tampilan Tabel"
              >
                Tabel
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-stone-500 pt-1 border-t border-stone-100">
          <span>Menampilkan <strong>{filteredList.length}</strong> inisiatif dan gerakan advokasi masyarakat sipil</span>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredList.length === 0 ? (
            <div className="col-span-2 bg-white rounded-xl border border-stone-200 p-8 text-center text-stone-500 text-xs">
              Tidak ada data inisiatif masyarakat sipil yang sesuai dengan pencarian.
            </div>
          ) : (
            filteredList.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-stone-200 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-stone-100">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-100 text-purple-900 border border-purple-200">
                          {item.id}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200">
                          {item.fokusAdvokasi}
                        </span>
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm mt-1.5 flex items-center gap-1.5">
                        <span>🏛️ {item.namaOrganisasi}</span>
                        {item.kontakPerson && (
                          <span className="text-[11px] text-stone-500 font-normal">({item.kontakPerson})</span>
                        )}
                      </h4>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="px-2.5 py-1 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        title="Edit Inisiatif Komunitas"
                      >
                        <svg className="w-3.5 h-3.5 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingInisiatif(item)}
                        className="p-1.5 text-rose-700 hover:text-rose-900 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Inisiatif Komunitas"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Judul Gerakan */}
                  <h3 className="text-base font-serif font-bold text-stone-900 leading-snug">
                    {item.judulInisiatif}
                  </h3>

                  {/* 3-Kolom Wilayah Dampingan Preview */}
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/90 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-stone-700">
                      <span className="font-semibold text-emerald-950">📍 Wilayah Dampingan:</span>
                      <span>{item.wilayahDampingan}</span>
                    </div>
                    <div className="text-[11px] text-stone-600">
                      <span className="font-medium text-stone-500">Kelompok Sasaran:</span> {item.kelompokSasaran}
                    </div>
                  </div>

                  {/* Bukti Capaian & Tuntutan */}
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-semibold text-stone-800 block mb-0.5">Bukti Capaian Lapangan Swadaya:</span>
                      <p className="text-stone-600 text-[11px] leading-relaxed italic bg-emerald-50/50 p-2.5 rounded border border-emerald-100">
                        "{item.hasilCapaian}"
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold text-stone-800 block mb-0.5">Tuntutan Kebijakan / Program ke Dokumen RPJMD:</span>
                      <p className="text-stone-700 text-[11px] leading-relaxed bg-amber-50/60 p-2.5 rounded border border-amber-200">
                        {item.tuntutanKebijakan}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-stone-100 text-[11px] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 font-medium">Keselarasan Misi:</span>
                    <strong className="text-emerald-900 font-bold">{getMisiName(item.misiId)}</strong>
                  </div>
                  {item.responPemda && (
                    <div className="text-stone-600 bg-stone-100/70 p-2 rounded text-[10px] leading-relaxed">
                      <span className="font-bold text-stone-800">Tanggapan Bapperida: </span>
                      {item.responPemda}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-mono">
                  <th className="p-3.5 font-semibold">Organisasi & Inisiatif</th>
                  <th className="p-3.5 font-semibold">Wilayah Dampingan (3 Kolom)</th>
                  <th className="p-3.5 font-semibold">Tuntutan Kebijakan RPJMD</th>
                  <th className="p-3.5 font-semibold">Misi RPJMD</th>
                  <th className="p-3.5 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-stone-500">
                      Tidak ada data inisiatif masyarakat sipil yang cocok.
                    </td>
                  </tr>
                ) : (
                  filteredList.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="p-3.5 max-w-xs">
                        <span className="font-mono text-[10px] text-purple-900 font-bold block">{item.id} • {item.fokusAdvokasi}</span>
                        <strong className="text-stone-900 block text-xs mt-0.5">{item.namaOrganisasi}</strong>
                        <p className="text-stone-700 text-xs font-serif font-bold mt-1">{item.judulInisiatif}</p>
                        {item.kontakPerson && (
                          <span className="text-[10px] text-stone-400 block mt-0.5">Kontak: {item.kontakPerson}</span>
                        )}
                      </td>
                      <td className="p-3.5 max-w-xs">
                        <span className="text-stone-800 font-medium block text-xs">📍 {item.wilayahDampingan}</span>
                        <span className="text-stone-500 text-[11px] block mt-0.5">Sasaran: {item.kelompokSasaran}</span>
                      </td>
                      <td className="p-3.5 max-w-sm">
                        <p className="text-stone-700 text-xs line-clamp-2">{item.tuntutanKebijakan}</p>
                        <p className="text-stone-500 text-[10px] italic line-clamp-1 mt-1">Capaian: {item.hasilCapaian}</p>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200 block max-w-[180px] truncate">
                          ✓ {getMisiName(item.misiId)}
                        </span>
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap space-x-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md text-xs font-semibold transition-colors cursor-pointer border border-stone-200"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingInisiatif(item)}
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

      {/* MODAL: Form Tambah / Edit Inisiatif OMS */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  {editingInisiatif ? `Edit Inisiatif: ${editingInisiatif.id}` : 'Tambah Inisiatif / Advokasi Masyarakat Sipil'}
                </h3>
                <p className="text-[11px] text-stone-500">
                  Integrasi usulan advokasi komunitas ke dalam dokumen perencanaan RPJMD Kabupaten Tanggamus
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-1 text-stone-400 hover:text-stone-700 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nama Komunitas / OMS *
                  </label>
                  <input
                    type="text"
                    required
                    value={namaOrg}
                    onChange={(e) => setNamaOrg(e.target.value)}
                    placeholder="Contoh: Yayasan Konservasi Teluk Semaka"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Kontak Person / Narahubung *
                  </label>
                  <input
                    type="text"
                    required
                    value={kontak}
                    onChange={(e) => setKontak(e.target.value)}
                    placeholder="Contoh: Rahmat Hidayat (0812-3456-7890)"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Fokus Bidang Advokasi *
                  </label>
                  <input
                    type="text"
                    required
                    value={fokus}
                    onChange={(e) => setFokus(e.target.value)}
                    placeholder="Contoh: Hak Disabilitas / Konservasi Hutan Mangrove"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Keterkaitan Misi RPJMD *
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
                        <option value="sdm_kesehatan">Misi 1: SDM & Kesehatan</option>
                        <option value="ekonomi_umkm">Misi 2: Ekonomi & UMKM</option>
                        <option value="infrastruktur_hijau">Misi 3: Infrastruktur & Lingkungan</option>
                        <option value="tata_kelola_digital">Misi 4: Tata Kelola & Digital</option>
                        <option value="sosial_budaya">Misi 5: Sosial & Budaya</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Judul Gerakan / Inisiatif Komunitas *
                </label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Contoh: Penguatan Perlindungan Terumbu Karang Berbasis Masyarakat Adat"
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>

              {/* WILAYAH DAMPINGAN (Kecamatan & Pekon Sejajar, Detail Alamat Selebar 2 Kolom di Bawahnya) */}
              <div className="p-3.5 bg-stone-50/90 rounded-xl border border-stone-200 space-y-3">
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
                      <option value="">{selectedKecamatan ? '-- Pilih Pekon / Desa --' : '-- Pilih Kecamatan Dahulu --'}</option>
                      {availablePekons.map((pekon) => (
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
                    placeholder="Contoh: Dusun 2, RT 04, Pesisir Teluk Semaka..."
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 text-xs shadow-2xs"
                  />
                  <p className="text-[10px] text-stone-500 mt-1">
                    Tuliskan nama dusun, RT/RW, atau penanda geografis spesifik wilayah dampingan kegiatan.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Kelompok Sasaran Penerima Manfaat
                </label>
                <input
                  type="text"
                  value={sasaran}
                  onChange={(e) => setSasaran(e.target.value)}
                  placeholder="Contoh: 15 Kelompok Nelayan Tradisional & Generasi Muda Pesisir"
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Bukti Capaian Lapangan Swadaya yang Telah Ada
                </label>
                <textarea
                  rows={2}
                  value={capaian}
                  onChange={(e) => setCapaian(e.target.value)}
                  placeholder="Uraikan aksi nyata, jumlah binaan, atau sertifikasi yang telah dicapai..."
                  className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tuntutan Kebijakan / Program ke Dokumen RPJMD *
                </label>
                <textarea
                  required
                  rows={3}
                  value={tuntutan}
                  onChange={(e) => setTuntutan(e.target.value)}
                  placeholder="Rumuskan usulan pasal, indikator program, atau alokasi APBD yang diharapkan..."
                  className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Catatan Respon / Tindak Lanjut Bapperida
                </label>
                <input
                  type="text"
                  value={responPemda}
                  onChange={(e) => setResponPemda(e.target.value)}
                  placeholder="Catatan penelaahan resmi..."
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-900 text-white rounded-lg font-semibold hover:bg-emerald-950 shadow-2xs cursor-pointer"
                >
                  {editingInisiatif ? 'Simpan Perubahan Inisiatif' : 'Daftarkan Inisiatif Baru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Konfirmasi Hapus Inisiatif OMS */}
      {deletingInisiatif && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <div className="text-center">
              <h4 className="text-base font-serif font-bold text-stone-900">
                Hapus Inisiatif Komunitas?
              </h4>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Anda akan menghapus data <strong>"{deletingInisiatif.judulInisiatif}"</strong> oleh <strong>{deletingInisiatif.namaOrganisasi}</strong> (ID: {deletingInisiatif.id}).
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingInisiatif(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-2xs cursor-pointer"
              >
                Ya, Hapus Inisiatif
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
