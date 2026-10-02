import React, { useState, useMemo } from 'react';
import { AspirasiPublik, StakeholderType, StatusTindakLanjut } from '../types';
import { MISI_LABELS, KECAMATAN_TANGGAMUS } from '../data/mockData';

interface AspirasiListProps {
  aspirasi: AspirasiPublik[];
  onVote: (id: string) => void;
  onSelectAspirasi: (item: AspirasiPublik) => void;
  onOpenForm: () => void;
  filterPillar: string;
  setFilterPillar: (pillar: string) => void;
  filterKecamatan?: string;
  setFilterKecamatan?: (kec: string) => void;
}

export const AspirasiList: React.FC<AspirasiListProps> = ({
  aspirasi,
  onVote,
  onSelectAspirasi,
  onOpenForm,
  filterPillar,
  setFilterPillar,
  filterKecamatan: externalFilterKecamatan,
  setFilterKecamatan: externalSetFilterKecamatan,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMisi, setFilterMisi] = useState<string>('all');
  const [internalFilterKecamatan, setInternalFilterKecamatan] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'populer' | 'terbaru'>('populer');

  const filterKecamatan = externalFilterKecamatan !== undefined ? externalFilterKecamatan : internalFilterKecamatan;
  const handleSetFilterKecamatan = (val: string) => {
    if (externalSetFilterKecamatan) {
      externalSetFilterKecamatan(val);
    } else {
      setInternalFilterKecamatan(val);
    }
  };

  const filteredList = useMemo(() => {
    return aspirasi
      .filter((item) => {
        // Pillar filter
        if (filterPillar !== 'all' && item.tipePemangku !== filterPillar) {
          return false;
        }
        // Misi filter
        if (filterMisi !== 'all' && item.misiId !== filterMisi) {
          return false;
        }
        // Kecamatan filter (Kabupaten Tanggamus)
        if (filterKecamatan !== 'all' && item.kecamatan !== filterKecamatan) {
          return false;
        }
        // Status filter
        if (filterStatus !== 'all' && item.status !== filterStatus) {
          return false;
        }
        // Search text
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.judul.toLowerCase().includes(q);
          const matchSummary = item.ringkasan.toLowerCase().includes(q);
          const matchAuthor = item.pengusulNama.toLowerCase().includes(q);
          const matchKecamatan = item.kecamatan.toLowerCase().includes(q);
          return matchTitle || matchSummary || matchAuthor || matchKecamatan;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'populer') {
          return b.dukunganSuara - a.dukunganSuara;
        }
        return b.id.localeCompare(a.id);
      });
  }, [aspirasi, filterPillar, filterMisi, filterKecamatan, filterStatus, searchQuery, sortBy]);

  const getPillarLabel = (type: StakeholderType) => {
    switch (type) {
      case 'masyarakat':
        return 'Warga / Masyarakat';
      case 'swasta':
        return 'Dunia Usaha / CSR';
      case 'akademisi':
        return 'Akademisi / Kampus';
      case 'oms':
        return 'Organisasi Masyarakat Sipil';
      default:
        return 'Pemerintah Daerah';
    }
  };

  const getStatusText = (status: StatusTindakLanjut) => {
    switch (status) {
      case 'masuk_rkpd':
        return 'Diakomodasi RKPD 2027';
      case 'sinergi_csr':
        return 'Sinergi CSR / Non-APBD';
      case 'ditelaah':
        return 'Ditelaah Teknis OPD';
      case 'pendalaman_teknis':
        return 'Kajian Lanjutan Lapangan';
      case 'selesai':
        return 'Telah Ditetapkan';
      default:
        return status;
    }
  };

  const getStatusColor = (status: StatusTindakLanjut) => {
    switch (status) {
      case 'masuk_rkpd':
        return 'text-emerald-800 font-semibold';
      case 'sinergi_csr':
        return 'text-blue-800 font-semibold';
      case 'ditelaah':
        return 'text-amber-800 font-semibold';
      default:
        return 'text-stone-700 font-medium';
    }
  };

  return (
    <div id="daftar-aspirasi" className="space-y-6 scroll-mt-24">
      {/* Top Editorial Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
            Kanal Rembuk Terbuka RPJMD 2025–2029 dan RKPD
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
            Ruang Aspirasi & Usulan Pembangunan Multipihak
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            Setiap usulan yang masuk melalui portal ini ditelaah langsung oleh perangkat daerah (OPD) teknis terkait dan direkapitulasi dalam sidang Musrenbang.
          </p>
        </div>
        <button
          onClick={onOpenForm}
          className="self-start md:self-auto px-4 py-2.5 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-950 rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
        >
          + Ajukan Aspirasi Baru
        </button>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-stone-100/80 p-3 rounded-lg border border-stone-200/90 space-y-3">
        {/* Row 1: Search & Sort */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan topik, usulan, nama pengusul, atau kecamatan..."
              className="w-full bg-white border border-stone-300 rounded-md px-3 py-2 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-xs text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-stone-500 whitespace-nowrap">Urutkan:</span>
            <div className="flex items-center bg-stone-200/70 p-0.5 rounded-md">
              <button
                onClick={() => setSortBy('populer')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                  sortBy === 'populer'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Paling Didukung
              </button>
              <button
                onClick={() => setSortBy('terbaru')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                  sortBy === 'terbaru'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Terbaru
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Stakeholder Segmented Control */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stone-200/60">
          <span className="text-xs font-medium text-stone-500 mr-1">Pemangku:</span>
          {[
            { id: 'all', label: 'Semua Elemen' },
            { id: 'masyarakat', label: 'Warga / Masyarakat' },
            { id: 'swasta', label: 'Dunia Usaha / CSR' },
            { id: 'akademisi', label: 'Akademisi / Riset' },
            { id: 'oms', label: 'OMS / Sipil' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterPillar(tab.id)}
              className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer whitespace-nowrap ${
                filterPillar === tab.id
                  ? 'bg-stone-900 text-white font-medium'
                  : 'bg-white text-stone-700 hover:bg-stone-200/70 border border-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Row 3: Misi RPJMD & Status Selectors */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-stone-500">Misi RPJMD:</span>
            <select
              value={filterMisi}
              onChange={(e) => setFilterMisi(e.target.value)}
              className="bg-white border border-stone-300 rounded px-2 py-1 text-stone-700 text-xs focus:outline-none focus:border-emerald-800"
            >
              <option value="all">Semua 5 Misi RPJMD</option>
              <option value="sdm_kesehatan">Misi 1: SDM & Kesehatan</option>
              <option value="ekonomi_umkm">Misi 2: Ekonomi & UMKM</option>
              <option value="infrastruktur_hijau">Misi 3: Infrastruktur & Lingkungan</option>
              <option value="tata_kelola_digital">Misi 4: Tata Kelola & Digital</option>
              <option value="sosial_budaya">Misi 5: Sosial, Inklusi & Budaya</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-stone-500">Kecamatan:</span>
            <select
              value={filterKecamatan}
              onChange={(e) => handleSetFilterKecamatan(e.target.value)}
              className="bg-white border border-stone-300 rounded px-2 py-1 text-stone-700 text-xs focus:outline-none focus:border-emerald-800 max-w-[180px] truncate"
            >
              <option value="all">Semua 20 Kecamatan Tanggamus</option>
              {KECAMATAN_TANGGAMUS.map((kec) => (
                <option key={kec} value={kec}>
                  {kec.replace('Kecamatan ', '')}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-stone-500">Status OPD:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white border border-stone-300 rounded px-2 py-1 text-stone-700 text-xs focus:outline-none focus:border-emerald-800"
            >
              <option value="all">Semua Status Telaah</option>
              <option value="masuk_rkpd">Masuk Rancangan RKPD</option>
              <option value="sinergi_csr">Sinergi CSR / Non-APBD</option>
              <option value="ditelaah">Sedang Ditelaah Teknis</option>
            </select>
          </div>
          <div className="ml-auto text-xs text-stone-500 font-mono tabular-nums">
            Menampilkan <strong className="text-stone-800">{filteredList.length}</strong> usulan
          </div>
        </div>
      </div>

      {/* Main List of Aspirations */}
      <div className="space-y-4">
        {filteredList.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-lg border border-stone-200">
            <p className="text-base font-serif font-medium text-stone-700">Tidak ada aspirasi yang cocok dengan filter yang dipilih</p>
            <p className="text-xs text-stone-500 mt-1">Coba sesuaikan kata kunci pencarian atau ubah kategori pemangku kepentingan.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterPillar('all');
                setFilterMisi('all');
                setFilterStatus('all');
                handleSetFilterKecamatan('all');
              }}
              className="mt-4 px-3 py-1.5 text-xs text-stone-800 bg-stone-100 hover:bg-stone-200 rounded border border-stone-300 transition-colors cursor-pointer"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          filteredList.map((item) => (
            <article
              key={item.id}
              className="p-5 bg-white rounded-lg border border-stone-200 hover:border-stone-300 transition-all hover:shadow-xs"
            >
              {/* Metadata row */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mb-2">
                <span className="font-semibold text-stone-700">{getPillarLabel(item.tipePemangku)}</span>
                <span aria-hidden="true">•</span>
                <span>{item.kecamatan}{item.pekon ? ` (${item.pekon})` : ''}</span>
                <span aria-hidden="true">•</span>
                <span>{MISI_LABELS[item.misiId]?.nomor}: {MISI_LABELS[item.misiId]?.judul.split('&')[0]}</span>
                <span aria-hidden="true">•</span>
                <span className="font-mono tabular-nums">{item.tanggalDiajukan}</span>
                <span aria-hidden="true">•</span>
                <span className={getStatusColor(item.status)}>{getStatusText(item.status)}</span>
              </div>

              {/* Title & Summary */}
              <h3
                onClick={() => onSelectAspirasi(item)}
                className="text-lg font-serif font-bold text-stone-900 hover:text-emerald-900 transition-colors cursor-pointer leading-snug"
              >
                {item.judul}
              </h3>
              <p className="text-sm text-stone-600 mt-2 leading-relaxed line-clamp-2">
                {item.ringkasan}
              </p>

              {/* Stakeholder Author and OPD Response Teaser */}
              <div className="mt-3.5 pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-stone-600">
                  <span className="font-medium text-stone-900">{item.pengusulNama}</span>
                  {item.pengusulInstitusi && (
                    <span className="text-stone-500"> ({item.pengusulInstitusi})</span>
                  )}
                </div>

                {/* Actions: Upvote button and View details */}
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <button
                    onClick={() => onVote(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      item.hasVoted
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                        : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
                    }`}
                    title="Dukung usulan ini agar menjadi prioritas pembahasan OPD"
                  >
                    <span>▲ Dukung</span>
                    <span className="font-mono tabular-nums">({item.dukunganSuara})</span>
                  </button>
                  <button
                    onClick={() => onSelectAspirasi(item)}
                    className="px-3 py-1.5 rounded border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Buka Telaah OPD ({item.tanggapanOPD?.length || 0}) →
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};
