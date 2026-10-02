import React, { useState } from 'react';
import { KonsultasiAgenda, KonfirmasiKehadiranSidang, StakeholderType, UserAccount } from '../types';

interface SidangMusrenbangManagerProps {
  currentUser: UserAccount;
  agendaList: KonsultasiAgenda[];
  kehadiranList: KonfirmasiKehadiranSidang[];
  onAddAgenda: (newAgenda: KonsultasiAgenda) => void;
  onDeleteAgenda: (agendaId: string) => void;
  onUpdateAgendaStatus: (agendaId: string, status: 'buka' | 'segera' | 'selesai') => void;
  onAddKehadiran: (rsvp: KonfirmasiKehadiranSidang) => void;
  onUpdateKehadiranStatus: (id: string, status: 'terkonfirmasi' | 'hadir' | 'menunggu') => void;
  onDeleteKehadiran: (id: string) => void;
}

export const SidangMusrenbangManager: React.FC<SidangMusrenbangManagerProps> = ({
  currentUser,
  agendaList,
  kehadiranList,
  onAddAgenda,
  onDeleteAgenda,
  onUpdateAgendaStatus,
  onAddKehadiran,
  onUpdateKehadiranStatus,
  onDeleteKehadiran,
}) => {
  // Modal States
  const [showAddAgendaModal, setShowAddAgendaModal] = useState(false);
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [selectedRsvpForBadge, setSelectedRsvpForBadge] = useState<KonfirmasiKehadiranSidang | null>(null);

  // Filter States for Agenda Cards
  const [filterAgendaType, setFilterAgendaType] = useState<string>('all');

  // Filter & Search States for Attendance Table
  const [searchRsvpQuery, setSearchRsvpQuery] = useState('');
  const [filterRsvpAgenda, setFilterRsvpAgenda] = useState<string>('all');
  const [filterRsvpBentuk, setFilterRsvpBentuk] = useState<'all' | 'luring' | 'daring'>('all');
  const [filterRsvpUnsur, setFilterRsvpUnsur] = useState<string>('all');
  const [lastAddedRsvpId, setLastAddedRsvpId] = useState<string | null>(null);

  // Form State: Add Agenda
  const [agendaJudul, setAgendaJudul] = useState('');
  const [agendaTipe, setAgendaTipe] = useState<'Konsultasi Publik Terbuka' | 'Musrenbang Tematik' | 'FGD Multipihak'>('Musrenbang Tematik');
  const [agendaPemangku, setAgendaPemangku] = useState('');
  const [agendaTanggalWaktu, setAgendaTanggalWaktu] = useState('');
  const [agendaTempat, setAgendaTempat] = useState('');
  const [agendaTautanDaring, setAgendaTautanDaring] = useState('');
  const [agendaKapasitas, setAgendaKapasitas] = useState('150 Peserta Luring & 500 Daring');
  const [agendaTopikInput, setAgendaTopikInput] = useState('');
  const [agendaStatusPendaftaran, setAgendaStatusPendaftaran] = useState<'buka' | 'segera' | 'selesai'>('buka');
  const [agendaCreatedSuccess, setAgendaCreatedSuccess] = useState(false);

  // Form State: Konfirmasi Kehadiran (RSVP)
  const [rsvpAgendaId, setRsvpAgendaId] = useState<string>(agendaList[0]?.id || '');
  const [rsvpNama, setRsvpNama] = useState('');
  const [rsvpInstansi, setRsvpInstansi] = useState('');
  const [rsvpUnsur, setRsvpUnsur] = useState<StakeholderType | 'pemerintah'>('oms');
  const [rsvpJabatan, setRsvpJabatan] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpNomorKontak, setRsvpNomorKontak] = useState('');
  const [rsvpBentukKehadiran, setRsvpBentukKehadiran] = useState<'luring' | 'daring'>('luring');
  const [rsvpPokokPikiran, setRsvpPokokPikiran] = useState('');
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  // Calculations
  const totalRsvp = kehadiranList.length;
  const totalLuring = kehadiranList.filter((r) => r.bentukKehadiran === 'luring').length;
  const totalDaring = kehadiranList.filter((r) => r.bentukKehadiran === 'daring').length;

  // Filtered Agendas
  const filteredAgendas = agendaList.filter((a) => {
    if (filterAgendaType === 'all') return true;
    return a.tipeAgenda === filterAgendaType;
  });

  // Filtered RSVPs
  const filteredRsvps = kehadiranList.filter((r) => {
    if (filterRsvpAgenda !== 'all' && r.agendaId !== filterRsvpAgenda) return false;
    if (filterRsvpBentuk !== 'all' && r.bentukKehadiran !== filterRsvpBentuk) return false;
    if (filterRsvpUnsur !== 'all' && r.unsurPentahelix !== filterRsvpUnsur) return false;
    if (searchRsvpQuery.trim()) {
      const q = searchRsvpQuery.toLowerCase();
      const match =
        r.namaLengkap.toLowerCase().includes(q) ||
        r.instansi.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.nomorKontak.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        (r.pokokPikiran && r.pokokPikiran.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const handleOpenRsvpForAgenda = (agenda: KonsultasiAgenda) => {
    setRsvpAgendaId(agenda.id);
    setShowRsvpModal(true);
  };

  const handleCreateAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agendaJudul.trim() || !agendaTanggalWaktu.trim() || !agendaTempat.trim()) return;

    const topics = agendaTopikInput
      .split('\n')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newAgenda: KonsultasiAgenda = {
      id: `AGD-${Date.now().toString().slice(-4)}`,
      judulSidang: agendaJudul.trim(),
      tipeAgenda: agendaTipe,
      pemangkuUtama: agendaPemangku.trim() || 'Multipihak & Unsur Pentahelix',
      tanggalWaktu: agendaTanggalWaktu.trim(),
      tempat: agendaTempat.trim(),
      tautanDaring: agendaTautanDaring.trim() || undefined,
      statusPendaftaran: agendaStatusPendaftaran,
      kapasitas: agendaKapasitas.trim() || '150 Peserta',
      topikKunci: topics.length > 0 ? topics : ['Pembahasan Pokok Rancangan RPJMD', 'Pengesahan Berita Acara Konsultasi']
    };

    onAddAgenda(newAgenda);
    setAgendaCreatedSuccess(true);
    setTimeout(() => {
      setAgendaCreatedSuccess(false);
      setShowAddAgendaModal(false);
      setAgendaJudul('');
      setAgendaPemangku('');
      setAgendaTanggalWaktu('');
      setAgendaTempat('');
      setAgendaTautanDaring('');
      setAgendaTopikInput('');
    }, 1000);
  };

  const handleCreateRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpAgendaId || !rsvpNama.trim() || !rsvpEmail.trim()) return;

    const targetAgenda = agendaList.find((a) => a.id === rsvpAgendaId);
    const newId = `RSVP-${Date.now().toString().slice(-4)}`;
    const newRsvp: KonfirmasiKehadiranSidang = {
      id: newId,
      agendaId: rsvpAgendaId,
      judulSidang: targetAgenda ? targetAgenda.judulSidang : 'Sidang Konsultasi Publik RPJMD',
      namaLengkap: rsvpNama.trim(),
      instansi: rsvpInstansi.trim() || 'Masyarakat Peduli Daerah',
      unsurPentahelix: rsvpUnsur,
      jabatan: rsvpJabatan.trim() || 'Peserta Delegasi',
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

    onAddKehadiran(newRsvp);
    setLastAddedRsvpId(newId);
    setRsvpSuccess(true);
    setTimeout(() => {
      setRsvpSuccess(false);
      setShowRsvpModal(false);
      setRsvpNama('');
      setRsvpInstansi('');
      setRsvpJabatan('');
      setRsvpEmail('');
      setRsvpNomorKontak('');
      setRsvpPokokPikiran('');
      setSelectedRsvpForBadge(newRsvp);
    }, 1000);
  };

  const handleExportCSV = () => {
    const headers = [
      'No',
      'ID Registrasi',
      'Nama Peserta',
      'Instansi / Lembaga',
      'Unsur Pentahelix',
      'Jabatan',
      'Sidang yang Diikuti',
      'Bentuk Kehadiran',
      'Email',
      'No Kontak',
      'Pokok Pikiran / Usulan',
      'Waktu Pendaftaran',
      'Status Verifikasi'
    ];

    const rows = filteredRsvps.map((r, idx) => [
      idx + 1,
      r.id,
      `"${r.namaLengkap.replace(/"/g, '""')}"`,
      `"${r.instansi.replace(/"/g, '""')}"`,
      r.unsurPentahelix,
      `"${r.jabatan.replace(/"/g, '""')}"`,
      `"${r.judulSidang.replace(/"/g, '""')}"`,
      r.bentukKehadiran === 'luring' ? 'Luring (Fisik Venue)' : 'Daring (Virtual Zoom)',
      r.email,
      r.nomorKontak,
      `"${(r.pokokPikiran || '-').replace(/"/g, '""')}"`,
      r.waktuDaftar,
      r.statusVerifikasi
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Daftar_Presensi_Sidang_RPJMD_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPillarLabel = (p: StakeholderType | 'pemerintah') => {
    switch (p) {
      case 'masyarakat':
        return 'Masyarakat / Warga';
      case 'akademisi':
        return 'Akademisi / Pakar';
      case 'swasta':
        return 'Dunia Usaha / CSR';
      case 'oms':
        return 'OMS / NGO';
      case 'pemerintah':
        return 'Pemerintah / OPD';
      default:
        return p;
    }
  };

  const getPillarBadgeColor = (p: StakeholderType | 'pemerintah') => {
    switch (p) {
      case 'masyarakat':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'akademisi':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'swasta':
        return 'bg-stone-200 text-stone-800 border-stone-400';
      case 'oms':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'pemerintah':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-300';
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-lg border border-stone-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 uppercase tracking-wider mb-1">
            <span>Kanal Halaman Dalam Terautentikasi</span>
            <span aria-hidden="true">•</span>
            <span>Permendagri No. 86 / 2017</span>
          </div>
          <h3 className="text-xl font-serif font-bold text-stone-900">
            Jadwal Sidang Konsultasi Publik & Musrenbang Tematik
          </h3>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
            Kelola agenda musyawarah perencanaan daerah, sidang pleno RPJMD, serta pantau dan konfirmasi kehadiran delegasi multipihak (Masyarakat, Akademisi, Dunia Usaha, OMS, dan OPD) secara real-time.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              if (agendaList.length > 0) setRsvpAgendaId(agendaList[0].id);
              setShowRsvpModal(true);
            }}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
          >
            <span>+ Konfirmasi Kehadiran Sidang</span>
          </button>
          <button
            onClick={() => setShowAddAgendaModal(true)}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
          >
            <span>+ Tambah Jadwal Sidang</span>
          </button>
        </div>
      </div>

      {/* Overview Metric Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-stone-200">
          <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Total Agenda Sidang</p>
          <p className="text-2xl font-serif font-bold text-stone-900 mt-1 font-mono tabular-nums">{agendaList.length}</p>
          <p className="text-[10px] text-stone-400 mt-0.5">Sidang Pleno & Musrenbang</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-stone-200">
          <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Total Konfirmasi (RSVP)</p>
          <p className="text-2xl font-serif font-bold text-emerald-900 mt-1 font-mono tabular-nums">{totalRsvp}</p>
          <p className="text-[10px] text-emerald-700 mt-0.5">Delegasi Terdaftar</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-stone-200">
          <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Hadir Fisik (Luring)</p>
          <p className="text-2xl font-serif font-bold text-stone-900 mt-1 font-mono tabular-nums">{totalLuring}</p>
          <p className="text-[10px] text-stone-400 mt-0.5">Kursi Venue Sidang</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-stone-200">
          <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Hadir Virtual (Daring)</p>
          <p className="text-2xl font-serif font-bold text-blue-900 mt-1 font-mono tabular-nums">{totalDaring}</p>
          <p className="text-[10px] text-blue-700 mt-0.5">Saluran Hybrid Zoom</p>
        </div>
      </div>

      {/* SECTION 1: MANAJEMEN AGENDA SIDANG */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
          <div>
            <h4 className="text-base font-serif font-bold text-stone-900">
              Daftar Sidang Konsultasi Publik & Musrenbang Tematik Aktif
            </h4>
            <p className="text-xs text-stone-500">
              Pilih sidang di bawah untuk mengisi konfirmasi kehadiran langsung atau memperbarui status pendaftaran.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-stone-500 text-[11px] font-medium">Tipe:</span>
            <select
              value={filterAgendaType}
              onChange={(e) => setFilterAgendaType(e.target.value)}
              className="bg-white border border-stone-300 rounded px-2.5 py-1 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
            >
              <option value="all">Semua Tipe Forum ({agendaList.length})</option>
              <option value="Musrenbang Tematik">Musrenbang Tematik</option>
              <option value="Konsultasi Publik Terbuka">Konsultasi Publik Terbuka</option>
              <option value="FGD Multipihak">FGD Multipihak</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredAgendas.map((agenda) => {
            const countForAgenda = kehadiranList.filter((k) => k.agendaId === agenda.id).length;
            return (
              <div
                key={agenda.id}
                className="bg-white rounded-lg border border-stone-200 p-5 flex flex-col justify-between hover:border-stone-300 transition-all shadow-2xs space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {agenda.tipeAgenda}
                    </span>
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                        agenda.statusPendaftaran === 'buka'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold'
                          : agenda.statusPendaftaran === 'segera'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-stone-100 text-stone-500 border-stone-300'
                      }`}
                    >
                      {agenda.statusPendaftaran === 'buka' ? 'Pendaftaran Dibuka' : agenda.statusPendaftaran === 'segera' ? 'Segera Dibuka' : 'Selesai'}
                    </span>
                  </div>

                  <h5 className="font-serif font-bold text-stone-900 text-base leading-snug">
                    {agenda.judulSidang}
                  </h5>

                  <div className="space-y-1.5 text-xs text-stone-600">
                    <div className="flex items-start gap-1">
                      <span className="text-stone-400 font-medium shrink-0">Waktu:</span>
                      <span className="text-stone-800 font-mono">{agenda.tanggalWaktu}</span>
                    </div>
                    <div className="flex items-start gap-1">
                      <span className="text-stone-400 font-medium shrink-0">Tempat:</span>
                      <span className="text-stone-800">{agenda.tempat}</span>
                    </div>
                    <div className="flex items-start gap-1">
                      <span className="text-stone-400 font-medium shrink-0">Sasaran:</span>
                      <span className="text-stone-800">{agenda.pemangkuUtama}</span>
                    </div>
                    {agenda.tautanDaring && (
                      <div className="flex items-start gap-1">
                        <span className="text-stone-400 font-medium shrink-0">Zoom/Live:</span>
                        <a
                          href={agenda.tautanDaring}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-800 underline truncate max-w-[200px]"
                        >
                          {agenda.tautanDaring}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span>Kapasitas: <strong>{agenda.kapasitas}</strong></span>
                    <span className="font-mono text-emerald-800 font-semibold">
                      {countForAgenda} Terdaftar
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
                  <button
                    onClick={() => handleOpenRsvpForAgenda(agenda)}
                    className="w-full py-2 px-3 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded transition-colors text-center cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
                  >
                    <span>+ Konfirmasi Kehadiran Sidang Ini</span>
                  </button>
                  <div className="flex items-center justify-between gap-2 text-[11px] text-stone-500">
                    <button
                      onClick={() =>
                        onUpdateAgendaStatus(
                          agenda.id,
                          agenda.statusPendaftaran === 'buka' ? 'selesai' : 'buka'
                        )
                      }
                      className="hover:text-stone-800 underline cursor-pointer"
                    >
                      {agenda.statusPendaftaran === 'buka' ? 'Tutup Pendaftaran' : 'Buka Pendaftaran'}
                    </button>
                    {(currentUser.role === 'bapperida_admin' || currentUser.role === 'bappeda_admin') && (
                      <button
                        onClick={() => {
                          if (confirm(`Hapus agenda "${agenda.judulSidang}"?`)) {
                            onDeleteAgenda(agenda.id);
                          }
                        }}
                        className="text-rose-600 hover:text-rose-800 cursor-pointer"
                      >
                        Hapus Sidang
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: TABEL KONFIRMASI KEHADIRAN SIDANG */}
      <div className="space-y-4 pt-4 border-t border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 uppercase tracking-wider mb-0.5">
              <span>Buku Presensi Resmi Peserta</span>
              <span aria-hidden="true">•</span>
              <span>Daftar Hadir Terverifikasi</span>
            </div>
            <h4 className="text-lg font-serif font-bold text-stone-900">
              Tabel Konfirmasi Kehadiran Sidang & Rekapitulasi Delegasi
            </h4>
            <p className="text-xs text-stone-600 mt-0.5">
              Rekapitulasi seluruh peserta dan pemangku kepentingan yang telah mengisi formulir konfirmasi kehadiran sidang.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                if (agendaList.length > 0) setRsvpAgendaId(agendaList[0].id);
                setShowRsvpModal(true);
              }}
              className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-xs font-semibold transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              <span>+ Isi Form Konfirmasi Kehadiran</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-1.5 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 rounded text-xs font-semibold transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
            >
              <span>Unduh Presensi (CSV)</span>
            </button>
          </div>
        </div>

        {/* Filter Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-stone-100/70 p-3 rounded-lg border border-stone-200">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchRsvpQuery}
              onChange={(e) => setSearchRsvpQuery(e.target.value)}
              placeholder="Cari nama delegasi, instansi, nomor kontak, atau pokok pikiran..."
              className="w-full bg-white border border-stone-300 rounded px-3 py-1.5 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-800"
            />
            {searchRsvpQuery && (
              <button
                onClick={() => setSearchRsvpQuery('')}
                className="absolute right-2.5 top-1.5 text-xs text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={filterRsvpAgenda}
              onChange={(e) => setFilterRsvpAgenda(e.target.value)}
              className="bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 max-w-[200px] truncate"
            >
              <option value="all">Semua Agenda Sidang</option>
              {agendaList.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.judulSidang}
                </option>
              ))}
            </select>
            <select
              value={filterRsvpBentuk}
              onChange={(e) => setFilterRsvpBentuk(e.target.value as 'all' | 'luring' | 'daring')}
              className="bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
            >
              <option value="all">Semua Format (Luring/Daring)</option>
              <option value="luring">Luring (Fisik Venue)</option>
              <option value="daring">Daring (Virtual Zoom)</option>
            </select>
            <select
              value={filterRsvpUnsur}
              onChange={(e) => setFilterRsvpUnsur(e.target.value)}
              className="bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
            >
              <option value="all">Semua Unsur Pentahelix</option>
              <option value="masyarakat">Masyarakat</option>
              <option value="akademisi">Akademisi</option>
              <option value="swasta">Dunia Usaha / CSR</option>
              <option value="oms">Organisasi Masyarakat Sipil</option>
              <option value="pemerintah">Pemerintah / OPD</option>
            </select>
          </div>
        </div>

        {/* Tabel Data Konfirmasi Kehadiran */}
        <div className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-mono">
                  <th className="p-3 font-semibold">No / Kode RSVP</th>
                  <th className="p-3 font-semibold">Nama Peserta & Kontak</th>
                  <th className="p-3 font-semibold">Instansi & Jabatan</th>
                  <th className="p-3 font-semibold">Unsur Pentahelix</th>
                  <th className="p-3 font-semibold">Agenda Sidang yang Dihadiri</th>
                  <th className="p-3 font-semibold text-center">Bentuk Kehadiran</th>
                  <th className="p-3 font-semibold">Pokok Pikiran / Usulan</th>
                  <th className="p-3 font-semibold text-center">Status</th>
                  <th className="p-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredRsvps.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-stone-500">
                      Belum ada data konfirmasi kehadiran yang sesuai dengan penyaringan.
                      <div className="mt-2">
                        <button
                          onClick={() => {
                            if (agendaList.length > 0) setRsvpAgendaId(agendaList[0].id);
                            setShowRsvpModal(true);
                          }}
                          className="text-emerald-800 underline font-semibold cursor-pointer"
                        >
                          Klik di sini untuk mengisi konfirmasi kehadiran baru
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRsvps.map((rsvp, idx) => {
                    const isNewlyAdded = rsvp.id === lastAddedRsvpId;
                    return (
                      <tr
                        key={rsvp.id}
                        className={`hover:bg-stone-50/80 transition-colors ${
                          isNewlyAdded ? 'bg-emerald-50/60 font-medium' : ''
                        }`}
                      >
                        {/* No & ID */}
                        <td className="p-3 font-mono">
                          <span className="text-stone-400 text-[11px] block">{idx + 1}.</span>
                          <span className="font-bold text-stone-800 text-[11px] bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                            {rsvp.id}
                          </span>
                          {isNewlyAdded && (
                            <span className="block mt-1 text-[10px] text-emerald-700 font-bold uppercase">
                              ★ Baru Diisi
                            </span>
                          )}
                        </td>
                        {/* Nama & Kontak */}
                        <td className="p-3">
                          <p className="font-bold text-stone-900">{rsvp.namaLengkap}</p>
                          <p className="font-mono text-stone-500 text-[11px]">{rsvp.email}</p>
                          <p className="font-mono text-stone-400 text-[10px]">{rsvp.nomorKontak}</p>
                        </td>
                        {/* Instansi & Jabatan */}
                        <td className="p-3 max-w-[180px]">
                          <p className="font-medium text-stone-800">{rsvp.instansi}</p>
                          <p className="text-stone-500 text-[11px]">{rsvp.jabatan}</p>
                        </td>
                        {/* Unsur */}
                        <td className="p-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded border text-[11px] font-medium ${getPillarBadgeColor(
                              rsvp.unsurPentahelix
                            )}`}
                          >
                            {getPillarLabel(rsvp.unsurPentahelix)}
                          </span>
                        </td>
                        {/* Agenda */}
                        <td className="p-3 max-w-[220px]">
                          <p className="font-medium text-stone-900 leading-snug line-clamp-2">
                            {rsvp.judulSidang}
                          </p>
                          <span className="text-[10px] font-mono text-stone-400">
                            Daftar: {rsvp.waktuDaftar}
                          </span>
                        </td>
                        {/* Bentuk Kehadiran */}
                        <td className="p-3 text-center">
                          {rsvp.bentukKehadiran === 'luring' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 font-medium text-[11px]">
                              <span>🏢</span>
                              <span>Luring (Venue)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 text-blue-900 border border-blue-200 font-medium text-[11px]">
                              <span>💻</span>
                              <span>Daring (Zoom)</span>
                            </span>
                          )}
                        </td>
                        {/* Pokok Pikiran */}
                        <td className="p-3 max-w-[200px]">
                          {rsvp.pokokPikiran ? (
                            <p className="text-stone-700 italic text-[11px] line-clamp-2 leading-relaxed">
                              "{rsvp.pokokPikiran}"
                            </p>
                          ) : (
                            <span className="text-stone-400 text-[11px]">- Tidak melampirkan -</span>
                          )}
                        </td>
                        {/* Status */}
                        <td className="p-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              rsvp.statusVerifikasi === 'hadir'
                                ? 'bg-purple-100 text-purple-900 border-purple-300'
                                : rsvp.statusVerifikasi === 'terkonfirmasi'
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                : 'bg-amber-100 text-amber-900 border-amber-300'
                            }`}
                          >
                            {rsvp.statusVerifikasi === 'hadir'
                              ? 'Hadir di Lokasi'
                              : rsvp.statusVerifikasi === 'terkonfirmasi'
                              ? 'Terkonfirmasi'
                              : 'Menunggu'}
                          </span>
                        </td>
                        {/* Tindakan */}
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedRsvpForBadge(rsvp)}
                              title="Lihat Tanda Bukti / e-Badge"
                              className="px-2 py-1 text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-700 rounded border border-stone-300 transition-colors cursor-pointer"
                            >
                              e-Badge
                            </button>
                            <button
                              onClick={() =>
                                onUpdateKehadiranStatus(
                                  rsvp.id,
                                  rsvp.statusVerifikasi === 'hadir' ? 'terkonfirmasi' : 'hadir'
                                )
                              }
                              title="Tandai Presensi Fisik Sidang"
                              className={`px-2 py-1 text-[11px] rounded border transition-colors cursor-pointer ${
                                rsvp.statusVerifikasi === 'hadir'
                                  ? 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100'
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                              }`}
                            >
                              {rsvp.statusVerifikasi === 'hadir' ? 'Tandai Belum' : 'Tandai Hadir'}
                            </button>
                            {(currentUser.role === 'bapperida_admin' || currentUser.role === 'bappeda_admin') && (
                              <button
                                onClick={() => {
                                  if (confirm(`Hapus konfirmasi kehadiran untuk ${rsvp.namaLengkap}?`)) {
                                    onDeleteKehadiran(rsvp.id);
                                  }
                                }}
                                title="Hapus Data"
                                className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL 1: FORM KONFIRMASI KEHADIRAN SIDANG */}
      {showRsvpModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-emerald-900 font-semibold uppercase">
                  Formulir Presensi Delegasi
                </span>
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Form Konfirmasi Kehadiran Sidang Konsultasi Publik & Musrenbang
                </h3>
              </div>
              <button
                onClick={() => setShowRsvpModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700 text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            {rsvpSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h4 className="text-lg font-serif font-bold text-stone-900">
                  Konfirmasi Kehadiran Berhasil Disimpan!
                </h4>
                <p className="text-xs text-stone-600 max-w-md mx-auto">
                  Data kehadiran Anda telah langsung terhubung dan tercatat pada <strong>Tabel Konfirmasi Kehadiran Sidang</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateRsvp} className="p-6 space-y-4 text-xs">
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded text-emerald-950 text-[11px] leading-relaxed">
                  <strong>Pemberitahuan:</strong> Seluruh data yang diisi pada formulir ini akan terhubung langsung ke tabel rekapitulasi kehadiran sidang dan Berita Acara Kesepakatan RPJMD.
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Pilih Jadwal Sidang / Musrenbang Tematik yang Dihadiri *
                  </label>
                  <select
                    required
                    value={rsvpAgendaId}
                    onChange={(e) => setRsvpAgendaId(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 text-xs font-medium"
                  >
                    {agendaList.map((agenda) => (
                      <option key={agenda.id} value={agenda.id}>
                        [{agenda.tipeAgenda}] {agenda.judulSidang} ({agenda.tanggalWaktu})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Nama Lengkap & Gelar *
                    </label>
                    <input
                      type="text"
                      required
                      value={rsvpNama}
                      onChange={(e) => setRsvpNama(e.target.value)}
                      placeholder="Contoh: Dr. Irfan Santoso, M.Si."
                      className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Instansi / Organisasi / Komunitas *
                    </label>
                    <input
                      type="text"
                      required
                      value={rsvpInstansi}
                      onChange={(e) => setRsvpInstansi(e.target.value)}
                      placeholder="Contoh: Lembaga Bantuan Hukum / LPPM Univ"
                      className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Unsur Pemangku Kepentingan (Pentahelix) *
                    </label>
                    <select
                      value={rsvpUnsur}
                      onChange={(e) => setRsvpUnsur(e.target.value as StakeholderType | 'pemerintah')}
                      className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 font-medium"
                    >
                      <option value="oms">Organisasi Masyarakat Sipil (OMS / NGO / CSO)</option>
                      <option value="masyarakat">Masyarakat Umum / Perwakilan Warga</option>
                      <option value="akademisi">Akademisi / Pakar Perguruan Tinggi</option>
                      <option value="swasta">Dunia Usaha / Kadin / APINDO / Korporasi</option>
                      <option value="pemerintah">Pemerintah Daerah / Perangkat Daerah (OPD)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Jabatan / Peran Delegasi
                    </label>
                    <input
                      type="text"
                      value={rsvpJabatan}
                      onChange={(e) => setRsvpJabatan(e.target.value)}
                      placeholder="Contoh: Koordinator Advokasi / Dosen Ahli"
                      className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Alamat Surel (Email) Aktif *
                    </label>
                    <input
                      type="email"
                      required
                      value={rsvpEmail}
                      onChange={(e) => setRsvpEmail(e.target.value)}
                      placeholder="nama@organisasi.or.id"
                      className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Nomor Handphone / WhatsApp Dinas *
                    </label>
                    <input
                      type="text"
                      required
                      value={rsvpNomorKontak}
                      onChange={(e) => setRsvpNomorKontak(e.target.value)}
                      placeholder="0812-xxxx-xxxx"
                      className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Bentuk Kehadiran Sidang *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                        rsvpBentukKehadiran === 'luring'
                          ? 'border-emerald-800 bg-emerald-50 text-emerald-950 font-semibold'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="bentukKehadiran"
                        value="luring"
                        checked={rsvpBentukKehadiran === 'luring'}
                        onChange={() => setRsvpBentukKehadiran('luring')}
                        className="text-emerald-800"
                      />
                      <div>
                        <p className="text-xs">🏢 Hadir Luring (Tatap Muka)</p>
                        <p className="text-[10px] text-stone-500 font-normal">Hadir langsung di venue fisik ruang sidang</p>
                      </div>
                    </label>
                    <label
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                        rsvpBentukKehadiran === 'daring'
                          ? 'border-blue-800 bg-blue-50 text-blue-950 font-semibold'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="bentukKehadiran"
                        value="daring"
                        checked={rsvpBentukKehadiran === 'daring'}
                        onChange={() => setRsvpBentukKehadiran('daring')}
                        className="text-blue-800"
                      />
                      <div>
                        <p className="text-xs">💻 Hadir Daring (Virtual)</p>
                        <p className="text-[10px] text-stone-500 font-normal">Akses siaran melalui tautan Zoom Meeting</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Pokok Pikiran / Isu Strategis yang akan Disuarakan (Opsional)
                  </label>
                  <textarea
                    rows={3}
                    value={rsvpPokokPikiran}
                    onChange={(e) => setRsvpPokokPikiran(e.target.value)}
                    placeholder="Tuliskan intisari isu, data empiris, pasal RPJMD terkait, atau pertanyaan yang akan diajukan pada saat sesi interaktif..."
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 text-xs"
                  />
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRsvpModal(false)}
                    className="px-3.5 py-2 text-stone-700 bg-white border border-stone-300 rounded hover:bg-stone-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded font-semibold shadow-2xs cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Simpan & Konfirmasi Kehadiran</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: FORM TAMBAH JADWAL SIDANG BARU */}
      {showAddAgendaModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-emerald-900 font-semibold uppercase">
                  Administrator Bapperida Tanggamus / Pokja RPJMD
                </span>
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Tambah Jadwal Sidang Konsultasi Publik & Musrenbang Tematik
                </h3>
              </div>
              <button
                onClick={() => setShowAddAgendaModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700 text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            {agendaCreatedSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h4 className="text-lg font-serif font-bold text-stone-900">
                  Jadwal Sidang Berhasil Diterbitkan!
                </h4>
                <p className="text-xs text-stone-600 max-w-md mx-auto">
                  Agenda baru telah tersimpan dan siap menerima konfirmasi kehadiran dari para pemangku kepentingan.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateAgenda} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Judul Sidang / Nama Forum Tematik *
                  </label>
                  <input
                    type="text"
                    required
                    value={agendaJudul}
                    onChange={(e) => setAgendaJudul(e.target.value)}
                    placeholder="Contoh: Musrenbang Tematik Pemuda, Seni Budaya & Ekonomi Kreatif"
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Tipe Agenda Forum *
                    </label>
                    <select
                      value={agendaTipe}
                      onChange={(e) =>
                        setAgendaTipe(
                          e.target.value as 'Konsultasi Publik Terbuka' | 'Musrenbang Tematik' | 'FGD Multipihak'
                        )
                      }
                      className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 font-medium"
                    >
                      <option value="Musrenbang Tematik">Musrenbang Tematik</option>
                      <option value="Musrenbang Tematik">Musrenbang RPJMD</option>
                      <option value="Musrenbang Tematik">Musrenbang RKPD</option>
                      <option value="Konsultasi Publik Terbuka">Konsultasi Publik RPJMD</option>
                      <option value="Konsultasi Publik Terbuka">Konsultasi Publik RKPD</option>
                      <option value="Konsultasi Publik Terbuka">Konsultasi Publik Terbuka</option>
                      <option value="FGD Multipihak">FGD Multipihak</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Status Pendaftaran Awal *
                    </label>
                    <select
                      value={agendaStatusPendaftaran}
                      onChange={(e) =>
                        setAgendaStatusPendaftaran(e.target.value as 'buka' | 'segera' | 'selesai')
                      }
                      className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 font-medium"
                    >
                      <option value="buka">Pendaftaran Dibuka</option>
                      <option value="segera">Segera Dibuka</option>
                      <option value="selesai">Selesai / Terlaksana</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Hari, Tanggal & Waktu Pelaksanaan *
                    </label>
                    <input
                      type="text"
                      required
                      value={agendaTanggalWaktu}
                      onChange={(e) => setAgendaTanggalWaktu(e.target.value)}
                      placeholder="Contoh: Selasa, 14 April 2026 • 09.00 - 15.00 WIB"
                      className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Kapasitas Delegasi / Kuota Peserta *
                    </label>
                    <input
                      type="text"
                      required
                      value={agendaKapasitas}
                      onChange={(e) => setAgendaKapasitas(e.target.value)}
                      placeholder="Contoh: 150 Kursi Fisik • 500 Peserta Virtual"
                      className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Tempat / Lokasi Ruang Rapat Fisik *
                    </label>
                    <input
                      type="text"
                      required
                      value={agendaTempat}
                      onChange={(e) => setAgendaTempat(e.target.value)}
                      placeholder="Contoh: Ruang Rapat Paripurna DPRD / Bapperida Lt. 3"
                      className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Tautan Siaran Daring / Link Zoom (Opsional)
                    </label>
                    <input
                      type="text"
                      value={agendaTautanDaring}
                      onChange={(e) => setAgendaTautanDaring(e.target.value)}
                      placeholder="https://bapperida.daerah.go.id/live-sidang"
                      className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Peserta Kunci / Sasaran Pemangku Kepentingan
                  </label>
                  <input
                    type="text"
                    value={agendaPemangku}
                    onChange={(e) => setAgendaPemangku(e.target.value)}
                    placeholder="Contoh: Dewan Pemuda Daerah, Komunitas Kreatif, HIPMI, Dispora"
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Topik / Agenda Bahasan Utama (Satu baris per topik)
                  </label>
                  <textarea
                    rows={3}
                    value={agendaTopikInput}
                    onChange={(e) => setAgendaTopikInput(e.target.value)}
                    placeholder="Contoh:&#10;Inkubasi Startup & Pendanaan Kreatif Daerah&#10;Fasilitas Co-Working Space Publik di Tiap Kecamatan&#10;Perlindungan Hak Cipta & Sertifikasi Profesi Seni"
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 text-xs font-mono"
                  />
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddAgendaModal(false)}
                    className="px-3.5 py-2 text-stone-700 bg-white border border-stone-300 rounded hover:bg-stone-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded font-semibold shadow-2xs cursor-pointer"
                  >
                    Terbitkan Jadwal Sidang
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: E-BADGE / TANDA BUKTI KONFIRMASI KEHADIRAN */}
      {selectedRsvpForBadge && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            <div className="bg-emerald-900 text-white p-5 text-center">
              <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-200 block mb-1">
                Tanda Bukti Konfirmasi Kehadiran • e-Badge Sidang
              </span>
              <h4 className="font-serif font-bold text-lg">
                Forum Konsultasi Publik & Musrenbang RPJMD
              </h4>
              <p className="text-xs text-emerald-100 font-mono mt-0.5">
                KODE: {selectedRsvpForBadge.id}
              </p>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="text-center pb-3 border-b border-stone-200">
                <p className="text-stone-400 uppercase text-[10px] font-semibold">Nama Delegasi</p>
                <p className="text-base font-bold text-stone-900">{selectedRsvpForBadge.namaLengkap}</p>
                <p className="text-stone-600 font-medium">{selectedRsvpForBadge.instansi}</p>
                <span className="inline-block mt-1 text-[11px] text-stone-500">{selectedRsvpForBadge.jabatan}</span>
              </div>

              <div className="space-y-2 text-stone-700 bg-stone-50 p-3.5 rounded-lg border border-stone-200">
                <div>
                  <span className="text-stone-400 font-medium block text-[10px] uppercase">Sidang yang Diikuti:</span>
                  <p className="font-semibold text-stone-900">{selectedRsvpForBadge.judulSidang}</p>
                </div>

                <div className="flex justify-between pt-1">
                  <div>
                    <span className="text-stone-400 font-medium block text-[10px] uppercase">Bentuk Kehadiran:</span>
                    <span className="font-bold text-emerald-900">
                      {selectedRsvpForBadge.bentukKehadiran === 'luring' ? '🏢 Hadir Luring di Venue' : '💻 Hadir Daring via Zoom'}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 font-medium block text-[10px] uppercase">Unsur:</span>
                    <span className="font-medium text-stone-800 capitalize">
                      {getPillarLabel(selectedRsvpForBadge.unsurPentahelix)}
                    </span>
                  </div>
                </div>

                <div className="pt-1">
                  <span className="text-stone-400 font-medium block text-[10px] uppercase">Kontak Terdaftar:</span>
                  <span className="font-mono text-stone-800">{selectedRsvpForBadge.email} • {selectedRsvpForBadge.nomorKontak}</span>
                </div>
              </div>

              {selectedRsvpForBadge.pokokPikiran && (
                <div className="p-3 bg-stone-50 rounded border border-stone-200">
                  <span className="text-stone-400 font-medium block text-[10px] uppercase">Isu Pokok Pikiran:</span>
                  <p className="italic text-stone-800 text-[11px] mt-0.5">"{selectedRsvpForBadge.pokokPikiran}"</p>
                </div>
              )}

              <div className="p-2.5 bg-emerald-50 rounded border border-emerald-200 text-center text-[11px] text-emerald-900">
                ✓ Status: Terdaftar & Terkonfirmasi dalam Berita Acara
              </div>
            </div>

            <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex justify-between gap-2">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 bg-white border border-stone-300 rounded text-stone-700 hover:bg-stone-50 text-xs font-semibold cursor-pointer"
              >
                Cetak Tanda Terima
              </button>
              <button
                onClick={() => setSelectedRsvpForBadge(null)}
                className="px-4 py-1.5 bg-stone-900 text-white rounded text-xs font-semibold hover:bg-stone-800 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
