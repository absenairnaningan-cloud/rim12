import React, { useState, useEffect } from 'react';
import { UserAccount, AspirasiPublik, KemitraanCSR, StatusTindakLanjut, KonsultasiAgenda, KonfirmasiKehadiranSidang, UnitKerjaOPD, MisiRPJMDItem, InisiatifOMS } from '../types';
import { MISI_LABELS } from '../data/mockData';
import { SidangMusrenbangManager } from './SidangMusrenbangManager';
import { PengaturanOpdManager } from './PengaturanOpdManager';
import { PengaturanMisiManager } from './PengaturanMisiManager';
import { PenyelarasanCsrManager } from './PenyelarasanCsrManager';
import { RuangInisiatifOmsManager } from './RuangInisiatifOmsManager';

interface UserDashboardProps {
  currentUser: UserAccount;
  usersList: UserAccount[];
  aspirasiList: AspirasiPublik[];
  csrPrograms: KemitraanCSR[];
  agendaList: KonsultasiAgenda[];
  kehadiranList: KonfirmasiKehadiranSidang[];
  opdList: UnitKerjaOPD[];
  misiList: MisiRPJMDItem[];
  inisiatifList: InisiatifOMS[];
  initialSubTab?: 'verifikasi' | 'sidang_musrenbang' | 'inisiatif_oms' | 'pengaturan_user' | 'pengaturan_opd' | 'pengaturan_misi' | 'rekapitulasi' | 'profil';
  onLogout: () => void;
  onUpdateAspirasiStatus: (
    id: string,
    newStatus: StatusTindakLanjut,
    catatanOPD: string,
    extra?: {
      opdDitunjuk?: string;
      catatanOpd?: string;
      statusRekomendasiOpd?: 'masuk_renja_pd' | 'ditolak';
      rencanaAksiTahun?: number;
      isDisposisiOnly?: boolean;
      finalStatus?: StatusTindakLanjut;
    }
  ) => void;
  onAddUser: (newUser: UserAccount) => void;
  onUpdateUser?: (updatedUser: UserAccount) => void;
  onToggleUserStatus: (id: string) => void;
  onDeleteUser: (id: string) => void;
  onAddAgenda: (newAgenda: KonsultasiAgenda) => void;
  onDeleteAgenda: (agendaId: string) => void;
  onUpdateAgendaStatus: (agendaId: string, status: 'buka' | 'segera' | 'selesai') => void;
  onAddKehadiran: (rsvp: KonfirmasiKehadiranSidang) => void;
  onUpdateKehadiranStatus: (id: string, status: 'terkonfirmasi' | 'hadir' | 'menunggu') => void;
  onDeleteKehadiran: (id: string) => void;
  onAddOpd: (newOpd: UnitKerjaOPD) => void;
  onUpdateOpd: (updatedOpd: UnitKerjaOPD) => void;
  onDeleteOpd: (opdId: string) => void;
  onToggleOpdStatus: (opdId: string) => void;
  onAddMisi: (newMisi: MisiRPJMDItem) => void;
  onUpdateMisi: (updatedMisi: MisiRPJMDItem) => void;
  onDeleteMisi: (misiId: string) => void;
  onToggleMisiStatus: (misiId: string) => void;
  onAddCsrProgram: (newProgram: KemitraanCSR) => void;
  onUpdateCsrProgram: (updatedProgram: KemitraanCSR) => void;
  onDeleteCsrProgram: (programId: string) => void;
  onAddInisiatif: (newInit: InisiatifOMS) => void;
  onUpdateInisiatif: (updatedInit: InisiatifOMS) => void;
  onDeleteInisiatif: (id: string) => void;
  onGoToPortal: () => void;
  onOpenFormAspirasi: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  usersList,
  aspirasiList,
  csrPrograms,
  agendaList,
  kehadiranList,
  opdList,
  misiList,
  inisiatifList,
  initialSubTab,
  onLogout,
  onUpdateAspirasiStatus,
  onAddUser,
  onUpdateUser,
  onToggleUserStatus,
  onDeleteUser,
  onAddAgenda,
  onDeleteAgenda,
  onUpdateAgendaStatus,
  onAddKehadiran,
  onUpdateKehadiranStatus,
  onDeleteKehadiran,
  onAddOpd,
  onUpdateOpd,
  onDeleteOpd,
  onToggleOpdStatus,
  onAddMisi,
  onUpdateMisi,
  onDeleteMisi,
  onToggleMisiStatus,
  onAddCsrProgram,
  onUpdateCsrProgram,
  onDeleteCsrProgram,
  onAddInisiatif,
  onUpdateInisiatif,
  onDeleteInisiatif,
  onGoToPortal,
  onOpenFormAspirasi,
}) => {
  const isAdmin = currentUser.role === 'bapperida_admin' || currentUser.role === 'bappeda_admin';
  const isOpdVerifikator = currentUser.role === 'opd_verifikator';

  const [activeTab, setActiveTab] = useState<'verifikasi' | 'sidang_musrenbang' | 'inisiatif_oms' | 'pengaturan_user' | 'pengaturan_opd' | 'pengaturan_misi' | 'rekapitulasi' | 'profil'>(
    initialSubTab || 'verifikasi'
  );
  const [isPengaturanOpen, setIsPengaturanOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Check if an aspirasi is assigned to current user's OPD
  const isAspirasiAssignedToCurrentOpd = (item: AspirasiPublik) => {
    if (!item.opdDitunjuk || !item.opdDitunjuk.trim()) return false;
    if (!currentUser.agency) return false;
    const target = item.opdDitunjuk.toLowerCase();
    const userAgency = currentUser.agency.toLowerCase();
    if (userAgency.includes(target) || target.includes(userAgency)) return true;
    const keywords = ['koperasi', 'pupr', 'kesehatan', 'pendidikan', 'sosial', 'lingkungan', 'bpbd', 'pariwisata', 'pertanian', 'perikanan', 'kominfo', 'dukcapil', 'perhubungan'];
    for (const kw of keywords) {
      if (target.includes(kw) && userAgency.includes(kw)) {
        return true;
      }
    }
    return false;
  };

  // Usulan yang masuk TIDAK AKAN masuk ke OPD sebelum akun admin mendisposisikan usulan ke OPD yang ditunjuk
  const aspirasiAvailableForUser = React.useMemo(() => {
    if (isOpdVerifikator) {
      return aspirasiList.filter((item) => Boolean(item.opdDitunjuk && item.opdDitunjuk.trim() !== '' && isAspirasiAssignedToCurrentOpd(item)));
    }
    return aspirasiList;
  }, [aspirasiList, isOpdVerifikator, currentUser.agency]);

  useEffect(() => {
    if (isOpdVerifikator) {
      if (
        activeTab === 'sidang_musrenbang' ||
        activeTab === 'rekapitulasi' ||
        activeTab === 'inisiatif_oms' ||
        activeTab.startsWith('pengaturan_')
      ) {
        setActiveTab('verifikasi');
      }
    }
  }, [isOpdVerifikator, activeTab]);

  useEffect(() => {
    if (initialSubTab) {
      if (isOpdVerifikator && (initialSubTab === 'sidang_musrenbang' || initialSubTab === 'rekapitulasi' || initialSubTab.startsWith('pengaturan_'))) {
        setActiveTab('verifikasi');
      } else {
        setActiveTab(initialSubTab);
        if (initialSubTab === 'pengaturan_user' || initialSubTab === 'pengaturan_opd' || initialSubTab === 'pengaturan_misi') {
          setIsPengaturanOpen(true);
        }
      }
    }
  }, [initialSubTab, isOpdVerifikator]);

  const [selectedAspirasiForReview, setSelectedAspirasiForReview] = useState<AspirasiPublik | null>(null);
  const [reviewStatus, setReviewStatus] = useState<StatusTindakLanjut>('masuk_rkpd');
  const [reviewCatatan, setReviewCatatan] = useState('');
  const [reviewTahun, setReviewTahun] = useState<number>(2027);
  const [reviewOpdDitunjuk, setReviewOpdDitunjuk] = useState<string>('');
  const [reviewStatusRekomendasiOpd, setReviewStatusRekomendasiOpd] = useState<'masuk_renja_pd' | 'ditolak'>('masuk_renja_pd');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  // State for User Management (Add & Edit User)
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'bapperida_admin' | 'opd_verifikator' | 'pemangku_kepentingan'>('opd_verifikator');
  const [newUserAgency, setNewUserAgency] = useState('');
  const [newUserJabatan, setNewUserJabatan] = useState('');
  const [newUserNip, setNewUserNip] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [userCreatedSuccess, setUserCreatedSuccess] = useState(false);

  // Statistics calculation for user view
  const totalMasuk = aspirasiAvailableForUser.length;
  const masukRkpd = aspirasiAvailableForUser.filter((a) => a.status === 'masuk_rkpd' || a.status === 'masuk_renja_pd').length;
  const sinergiCsr = aspirasiAvailableForUser.filter((a) => a.status === 'sinergi_csr').length;
  const butuhTelaah = aspirasiAvailableForUser.filter((a) => a.status === 'ditelaah' || !a.catatanOpd).length;

  const handleOpenAddUser = () => {
    setEditingUser(null);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('opd_verifikator');
    setNewUserAgency('');
    setNewUserJabatan('');
    setNewUserNip('');
    setNewUserPhone('');
    setShowAddUserModal(true);
  };

  const handleOpenEditUser = (user: UserAccount) => {
    setEditingUser(user);
    setNewUserName(user.name);
    setNewUserEmail(user.email);
    setNewUserRole(user.role === 'bappeda_admin' ? 'bapperida_admin' : user.role);
    setNewUserAgency(user.agency || '');
    setNewUserJabatan(user.jabatan || '');
    setNewUserNip(user.nip || '');
    setNewUserPhone(user.noHp || '');
    setShowAddUserModal(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    if (editingUser) {
      const updated: UserAccount = {
        ...editingUser,
        name: newUserName.trim(),
        email: newUserEmail.trim(),
        role: newUserRole,
        agency: newUserAgency.trim() || editingUser.agency,
        jabatan: newUserJabatan.trim() || editingUser.jabatan,
        nip: newUserNip.trim() || undefined,
        noHp: newUserPhone.trim() || undefined,
      };
      if (onUpdateUser) {
        onUpdateUser(updated);
      }
      setUserCreatedSuccess(true);
      setTimeout(() => {
        setUserCreatedSuccess(false);
        setShowAddUserModal(false);
        setEditingUser(null);
      }, 1000);
    } else {
      const created: UserAccount = {
        id: `USR-${Date.now().toString().slice(-4)}`,
        name: newUserName.trim(),
        email: newUserEmail.trim(),
        role: newUserRole,
        agency: newUserAgency.trim() || (newUserRole === 'bapperida_admin' ? 'Bapperida Tanggamus' : newUserRole === 'opd_verifikator' ? 'Dinas Teknis Daerah' : 'Mitra Pembangunan'),
        jabatan: newUserJabatan.trim() || 'Staf Verifikator',
        nip: newUserNip.trim() || undefined,
        noHp: newUserPhone.trim() || undefined,
        statusAktif: true,
        lastLogin: 'Belum pernah login',
        createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      };
      onAddUser(created);
      setUserCreatedSuccess(true);
      setTimeout(() => {
        setUserCreatedSuccess(false);
        setShowAddUserModal(false);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserAgency('');
        setNewUserJabatan('');
        setNewUserNip('');
        setNewUserPhone('');
      }, 1000);
    }
  };

  const filteredUsers = usersList.filter((u) => {
    if (!searchUserQuery.trim()) return true;
    const q = searchUserQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.agency && u.agency.toLowerCase().includes(q)) ||
      (u.nip && u.nip.toLowerCase().includes(q))
    );
  });

  const handleOpenReview = (item: AspirasiPublik) => {
    setSelectedAspirasiForReview(item);
    setReviewStatus(item.status);
    setReviewCatatan(item.catatanOpd || item.tanggapanOPD?.[0]?.isiTanggapan || '');
    setReviewTahun(item.tanggapanOPD?.[0]?.rencanaAksiTahun || 2027);
    setReviewOpdDitunjuk(item.opdDitunjuk || '');
    setReviewStatusRekomendasiOpd(
      item.statusRekomendasiOpd || (item.status === 'ditolak' ? 'ditolak' : 'masuk_renja_pd')
    );
    setIsSavedSuccess(false);
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAspirasiForReview) return;

    const hasOpdFilledNotes = Boolean(
      (selectedAspirasiForReview.catatanOpd && selectedAspirasiForReview.catatanOpd.trim() !== '') ||
      (selectedAspirasiForReview.tanggapanOPD && selectedAspirasiForReview.tanggapanOPD.length > 0)
    );

    if (isAdmin) {
      if (!reviewOpdDitunjuk.trim()) {
        alert('Silakan pilih Perangkat Daerah (OPD) yang ditunjuk untuk mendisposisikan usulan ini.');
        return;
      }

      if (!hasOpdFilledNotes) {
        // Disposisi ke OPD saja karena OPD belum mengisi catatan
        onUpdateAspirasiStatus(
          selectedAspirasiForReview.id,
          selectedAspirasiForReview.status || 'ditelaah',
          selectedAspirasiForReview.catatanOpd || '',
          {
            opdDitunjuk: reviewOpdDitunjuk,
            isDisposisiOnly: true,
            rencanaAksiTahun: reviewTahun,
          }
        );
      } else {
        // OPD sudah mengisi catatan, Admin baru bisa memilih Status Penetapan Tindak Lanjut
        onUpdateAspirasiStatus(
          selectedAspirasiForReview.id,
          reviewStatus,
          selectedAspirasiForReview.catatanOpd || reviewCatatan,
          {
            opdDitunjuk: reviewOpdDitunjuk,
            finalStatus: reviewStatus,
            rencanaAksiTahun: reviewTahun,
          }
        );
      }
    } else if (isOpdVerifikator) {
      if (!reviewCatatan.trim()) {
        alert('Silakan isi Catatan Resmi OPD / Tanggapan Tindak Lanjut.');
        return;
      }

      onUpdateAspirasiStatus(
        selectedAspirasiForReview.id,
        reviewStatusRekomendasiOpd as StatusTindakLanjut,
        reviewCatatan,
        {
          catatanOpd: reviewCatatan,
          statusRekomendasiOpd: reviewStatusRekomendasiOpd,
          finalStatus: reviewStatusRekomendasiOpd as StatusTindakLanjut,
          rencanaAksiTahun: reviewTahun,
        }
      );
    } else {
      onUpdateAspirasiStatus(selectedAspirasiForReview.id, reviewStatus, reviewCatatan);
    }

    setIsSavedSuccess(true);
    setTimeout(() => {
      setSelectedAspirasiForReview(null);
      setIsSavedSuccess(false);
    }, 1200);
  };

  const filteredAspirasi = aspirasiAvailableForUser.filter((item) => {
    if (filterStatus === 'all') return true;
    return item.status === filterStatus;
  });

  // Primary navigation menu items
  const rawPrimaryMenuItems = [
    {
      id: 'verifikasi' as const,
      label: 'Meja Verifikasi Aspirasi',
      shortLabel: 'Verifikasi',
      hint: isOpdVerifikator ? 'Telaah Teknis & Renja-PD' : 'Telaah & Disposisi RKPD',
      badge: aspirasiAvailableForUser.length,
      badgeColor: 'bg-emerald-600',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    {
      id: 'sidang_musrenbang' as const,
      label: 'Jadwal Sidang & Musrenbang',
      shortLabel: 'Sidang & Musrenbang',
      hint: 'Agenda Konsultasi Publik',
      badge: agendaList.length,
      badgeColor: 'bg-blue-600',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'inisiatif_oms' as const,
      label: 'Ruang Inisiatif & Advokasi Masyarakat Sipil',
      shortLabel: 'Inisiatif OMS',
      hint: 'Advokasi Warga & Komunitas',
      badge: inisiatifList.length,
      badgeColor: 'bg-emerald-600',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 'rekapitulasi' as const,
      label: 'Penyelarasan Misi & CSR',
      shortLabel: 'Penyelarasan CSR',
      hint: 'Sinkronisasi Non-APBD',
      badge: csrPrograms.length,
      badgeColor: 'bg-amber-600',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'profil' as const,
      label: 'Informasi Satker & Otoritas',
      shortLabel: 'Satker & Otoritas',
      hint: 'Profil Akun & Mandat',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    }
  ];

  // Pada akun verifikator OPD teknis: tidak menampilkan menu Jadwal Sidang, Penyelarasan CSR, dan Pengaturan
  const primaryMenuItems = isOpdVerifikator
    ? rawPrimaryMenuItems.filter((item) => item.id === 'verifikasi' || item.id === 'profil')
    : rawPrimaryMenuItems;

  // Sub-menu items for Pengaturan
  const pengaturanSubMenuItems = [
    {
      id: 'pengaturan_user' as const,
      label: 'Kelola & Tambah User',
      shortLabel: 'Kelola User',
      hint: 'Hak Akses & Aparatur',
      badge: usersList.length,
      badgeColor: 'bg-purple-600',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      id: 'pengaturan_opd' as const,
      label: 'Unit Kerja / Perangkat Daerah (OPD)',
      shortLabel: 'Pengaturan OPD',
      hint: 'Tambah, Edit & Hapus OPD',
      badge: opdList.length,
      badgeColor: 'bg-emerald-600',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      id: 'pengaturan_misi' as const,
      label: 'Misi RPJMD Daerah',
      shortLabel: 'Misi RPJMD',
      hint: 'Tambah, Edit & Hapus Misi',
      badge: misiList.length,
      badgeColor: 'bg-amber-600',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    }
  ];

  const allMenuItems = [
    ...primaryMenuItems,
    ...(isAdmin ? pengaturanSubMenuItems : [])
  ];

  const currentTabObj = allMenuItems.find((m) => m.id === activeTab);

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row font-sans text-stone-900 w-full">
      {/* MOBILE BACKDROP OVERLAY */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-stone-950/70 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* LEFT SIDEBAR */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-50 md:z-30 bg-stone-900 text-stone-200 border-r border-stone-800 flex flex-col justify-between transition-all duration-300 ease-in-out select-none shadow-xl md:shadow-none ${
          isMobileSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
        } ${isSidebarCollapsed ? 'md:w-20' : 'md:w-64 lg:w-72'}`}
      >
        {/* SIDEBAR HEADER */}
        <div className="p-4 border-b border-stone-800/80">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src="/logo_warung_rimbun.jpg"
                alt="Logo Resmi WARUNG RIMBUN"
                className="w-10 h-10 rounded-full object-contain bg-white shadow-md flex-shrink-0 border border-stone-600/50 p-0.5"
                referrerPolicy="no-referrer"
              />
              {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                <div className="min-w-0 transition-opacity duration-200">
                  <div className="font-serif text-sm font-bold tracking-tight text-white whitespace-nowrap leading-none">
                    WARUNG RIMBUN
                  </div>
                  <div className="text-[10px] font-mono font-medium text-emerald-400 uppercase tracking-wider mt-1 truncate">
                    PORTAL VERIFIKASI
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Minimize Button */}
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
              title={isSidebarCollapsed ? 'Perluas Menu (Expand)' : 'Perkecil Menu (Minimize)'}
            >
              {isSidebarCollapsed ? (
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              )}
            </button>

            {/* Close Mobile Button */}
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden p-1.5 text-stone-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* SIDEBAR NAVIGATION ITEMS */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1.5 no-scrollbar">
          {/* Primary items */}
          {primaryMenuItems.slice(0, 2).map((item) => {
            const isActive = activeTab === item.id;
            return (
              <div key={item.id} className="relative group">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center rounded-xl transition-all cursor-pointer ${
                    isSidebarCollapsed
                      ? 'justify-center p-3'
                      : 'justify-between px-3.5 py-3'
                  } ${
                    isActive
                      ? 'bg-emerald-900 text-white font-bold shadow-sm border-l-4 border-emerald-400'
                      : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/80 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`transition-colors ${isActive ? 'text-emerald-300' : 'text-stone-400 group-hover:text-stone-200'}`}>
                      {item.icon}
                    </div>
                    {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                      <div className="text-left min-w-0">
                        <p className="text-xs leading-snug truncate">{item.label}</p>
                        <p className="text-[10px] text-stone-500 font-normal truncate mt-0.5">{item.hint}</p>
                      </div>
                    )}
                  </div>
                  {item.badge !== undefined && (!isSidebarCollapsed || isMobileSidebarOpen) && (
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                        isActive
                          ? 'bg-emerald-800 text-emerald-100 border border-emerald-600'
                          : 'bg-stone-800 text-stone-300 border border-stone-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.badge !== undefined && isSidebarCollapsed && !isMobileSidebarOpen && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400" />
                  )}
                </button>
                {isSidebarCollapsed && !isMobileSidebarOpen && (
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-2 px-3 py-1.5 bg-stone-950 text-stone-100 text-xs font-semibold rounded-lg shadow-2xl border border-stone-700 whitespace-nowrap z-50 pointer-events-none">
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-800 text-emerald-100 border border-emerald-600">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Group 2: MENU PENGATURAN (Hanya untuk Admin Bapperida) */}
          {isAdmin && (
            <div className="pt-2 pb-1">
              {(!isSidebarCollapsed || isMobileSidebarOpen) ? (
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setIsPengaturanOpen(!isPengaturanOpen)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      activeTab === 'pengaturan_user' || activeTab === 'pengaturan_opd' || activeTab === 'pengaturan_misi'
                        ? 'bg-stone-800/90 text-emerald-300'
                        : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Pengaturan</span>
                    </div>
                    <span className="text-[10px] font-mono text-stone-400">
                      {isPengaturanOpen ? '▲' : '▼'}
                    </span>
                  </button>

                  {isPengaturanOpen && (
                    <div className="pl-3 space-y-1 border-l-2 border-stone-800 ml-3.5 my-1">
                      {pengaturanSubMenuItems.map((sub) => {
                        const isSubActive = activeTab === sub.id;
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => {
                              setActiveTab(sub.id);
                              setIsMobileSidebarOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                              isSubActive
                                ? 'bg-emerald-900/90 text-white font-semibold border border-emerald-700 shadow-2xs'
                                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/70'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={isSubActive ? 'text-emerald-300' : 'text-stone-500'}>
                                {sub.icon}
                              </span>
                              <span className="truncate">{sub.label}</span>
                            </div>
                            {sub.badge !== undefined && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                                {sub.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1 pt-1 border-t border-stone-800">
                  {pengaturanSubMenuItems.map((sub) => {
                    const isSubActive = activeTab === sub.id;
                    return (
                      <div key={sub.id} className="relative group">
                        <button
                          type="button"
                          onClick={() => setActiveTab(sub.id)}
                          className={`w-full flex items-center justify-center p-3 rounded-xl transition-all cursor-pointer ${
                            isSubActive
                              ? 'bg-emerald-900 text-white font-bold border-l-4 border-emerald-400'
                              : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/80'
                          }`}
                        >
                          {sub.icon}
                        </button>
                        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-2 px-3 py-1.5 bg-stone-950 text-stone-100 text-xs font-semibold rounded-lg shadow-2xl border border-stone-700 whitespace-nowrap z-50 pointer-events-none">
                          <span>Pengaturan: {sub.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Group 3: Items */}
          {primaryMenuItems.slice(2).map((item) => {
            const isActive = activeTab === item.id;
            return (
              <div key={item.id} className="relative group">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center rounded-xl transition-all cursor-pointer ${
                    isSidebarCollapsed
                      ? 'justify-center p-3'
                      : 'justify-between px-3.5 py-3'
                  } ${
                    isActive
                      ? 'bg-emerald-900 text-white font-bold shadow-sm border-l-4 border-emerald-400'
                      : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/80 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`transition-colors ${isActive ? 'text-emerald-300' : 'text-stone-400 group-hover:text-stone-200'}`}>
                      {item.icon}
                    </div>
                    {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                      <div className="text-left min-w-0">
                        <p className="text-xs leading-snug truncate">{item.label}</p>
                        <p className="text-[10px] text-stone-500 font-normal truncate mt-0.5">{item.hint}</p>
                      </div>
                    )}
                  </div>
                  {item.badge !== undefined && (!isSidebarCollapsed || isMobileSidebarOpen) && (
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                        isActive
                          ? 'bg-emerald-800 text-emerald-100 border border-emerald-600'
                          : 'bg-stone-800 text-stone-300 border border-stone-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.badge !== undefined && isSidebarCollapsed && !isMobileSidebarOpen && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400" />
                  )}
                </button>
                {isSidebarCollapsed && !isMobileSidebarOpen && (
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-2 px-3 py-1.5 bg-stone-950 text-stone-100 text-xs font-semibold rounded-lg shadow-2xl border border-stone-700 whitespace-nowrap z-50 pointer-events-none">
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-800 text-emerald-100 border border-emerald-600">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* SIDEBAR FOOTER */}
        <div className="p-3 border-t border-stone-800/80 space-y-2">
          {/* Back to Public Portal Button */}
          <div className="relative group">
            <button
              type="button"
              onClick={onGoToPortal}
              className={`w-full flex items-center rounded-lg text-xs font-medium text-stone-400 hover:text-stone-100 hover:bg-stone-800/90 transition-colors cursor-pointer ${
                isSidebarCollapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2'
              }`}
            >
              <svg className="w-4 h-4 flex-shrink-0 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                <span className="truncate">Tampilan Publik</span>
              )}
            </button>
            {isSidebarCollapsed && !isMobileSidebarOpen && (
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex px-2.5 py-1 bg-stone-950 text-stone-200 text-xs rounded shadow-lg border border-stone-700 whitespace-nowrap z-50 pointer-events-none">
                Lihat Tampilan Publik
              </div>
            )}
          </div>

          {/* Logout Button */}
          <div className="relative group">
            <button
              type="button"
              onClick={onLogout}
              className={`w-full flex items-center rounded-lg text-xs font-medium text-rose-300/80 hover:text-rose-200 hover:bg-rose-950/40 border border-transparent hover:border-rose-900/60 transition-colors cursor-pointer ${
                isSidebarCollapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2'
              }`}
            >
              <svg className="w-4 h-4 flex-shrink-0 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                <span className="truncate font-semibold">Keluar (Logout)</span>
              )}
            </button>
            {isSidebarCollapsed && !isMobileSidebarOpen && (
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex px-2.5 py-1 bg-rose-950 text-rose-100 text-xs rounded shadow-lg border border-rose-800 whitespace-nowrap z-50 pointer-events-none">
                Keluar (Logout)
              </div>
            )}
          </div>

          {/* User Profile Mini Card */}
          {(!isSidebarCollapsed || isMobileSidebarOpen) && (
            <div className="pt-2 border-t border-stone-800/60 flex items-center gap-2.5 px-2 py-1">
              <div className="w-8 h-8 rounded-full bg-emerald-900 text-emerald-200 flex items-center justify-center font-bold text-xs border border-emerald-600 flex-shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                <p className="text-[10px] text-stone-400 font-mono truncate">{currentUser.agency}</p>
              </div>
            </div>
          )}

          {/* Minimize / Expand Bar Indicator Button */}
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden md:flex w-full items-center justify-center gap-2 py-1 text-[11px] font-mono text-stone-500 hover:text-stone-300 transition-colors cursor-pointer"
          >
            <span>{isSidebarCollapsed ? '▶' : '◀'}</span>
            {!isSidebarCollapsed && <span>Perkecil Navbar</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT PANE */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-stone-100">
        {/* TOP APP BAR */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-stone-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              title="Buka Menu Sidebar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Desktop Minimize/Expand Button on Top Bar */}
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors cursor-pointer shadow-2xs"
              title={isSidebarCollapsed ? 'Perluas Sidebar' : 'Perkecil Sidebar (Minimize)'}
            >
              {isSidebarCollapsed ? (
                <>
                  <svg className="w-3.5 h-3.5 text-emerald-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                  <span className="font-semibold text-[11px]">Perluas Menu</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                  <span className="font-semibold text-[11px]">Perkecil Menu</span>
                </>
              )}
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="hidden sm:inline text-xs font-mono text-stone-400 uppercase">Dasbor Internal</span>
              <span className="hidden sm:inline text-stone-300">/</span>
              <h1 className="text-sm sm:text-base font-serif font-bold text-stone-900 truncate">
                {currentTabObj?.label}
              </h1>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {/* Officer Status Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-stone-50 rounded-lg border border-stone-200 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="font-semibold text-stone-800">{currentUser.name.split(' ')[0]}</span>
              <span className="text-[10px] font-mono text-stone-500 uppercase">({currentUser.role === 'bappeda_admin' || currentUser.role === 'bapperida_admin' ? 'Admin Bapperida' : 'OPD Verifikator'})</span>
            </div>

            {/* Input Usulan Internal Quick Button */}
            <button
              type="button"
              onClick={onOpenFormAspirasi}
              className="px-3 py-1.5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
            >
              + Input Usulan
            </button>

            {/* Portal Link */}
            <button
              type="button"
              onClick={onGoToPortal}
              className="hidden sm:inline-flex px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-700 rounded-lg text-xs font-semibold border border-stone-300 transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
            >
              Portal Publik
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 sm:px-3 sm:py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
              title="Keluar dari sesi"
            >
              <span className="hidden sm:inline">Keluar</span>
              <svg className="w-4 h-4 sm:hidden text-rose-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </header>

        {/* MAIN BODY AREA */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Welcome Banner */}
          <div className="bg-stone-900 text-stone-200 rounded-xl p-5 sm:p-6 border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 text-[11px]">
                  WARUNG RIMBUN
                </span>
                <span className="text-stone-500">•</span>
                <span className="px-2 py-0.5 rounded font-mono font-semibold bg-stone-800 text-stone-300 text-[11px]">
                  {currentUser.role === 'bappeda_admin' || currentUser.role === 'bapperida_admin'
                    ? 'ADMINISTRATOR BAPPERIDA PME'
                    : currentUser.role === 'opd_verifikator'
                    ? 'VERIFIKATOR OPD TEKNIS'
                    : 'MITRA PEMANGKU KEBIJAKAN'}
                </span>
                {currentUser.nip && (
                  <>
                    <span className="text-stone-500">•</span>
                    <span className="font-mono text-stone-400 text-[11px]">NIP: {currentUser.nip}</span>
                  </>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                Selamat Datang, {currentUser.name}
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 max-w-2xl">
                {currentUser.agency} — Dasbor kerja internal pemantauan tindak lanjut masukan masyarakat dan penyelarasan dokumen RKPD tahunan Kabupaten Tanggamus.
              </p>
            </div>
            <div className="text-right flex md:flex-col items-center md:items-end justify-between gap-1 flex-shrink-0 text-xs text-stone-400 font-mono pt-2 md:pt-0 border-t md:border-t-0 border-stone-800">
              <span className="text-[11px]">Status Akses: <strong className="text-emerald-400">Aktif & Terverifikasi</strong></span>
              <span className="text-[10px] text-stone-500">Login: {currentUser.lastLogin}</span>
            </div>
          </div>

          {/* KPI METRIC CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 bg-white rounded-xl border border-stone-200/90 shadow-2xs hover:shadow-xs transition-shadow">
              <span className="text-xs text-stone-500 font-semibold uppercase tracking-wider block">Total Usulan</span>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 font-mono tabular-nums mt-1">
                {totalMasuk}
              </p>
              <span className="text-[11px] text-stone-500 mt-1 block">Aspirasi seluruh pemangku</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-stone-200/90 shadow-2xs hover:shadow-xs transition-shadow">
              <span className="text-xs text-emerald-800 font-semibold uppercase tracking-wider block">Masuk RKPD</span>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-emerald-800 font-mono tabular-nums mt-1">
                {masukRkpd}
              </p>
              <span className="text-[11px] text-emerald-700 mt-1 block">Diakomodasi kerja tahunan</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-stone-200/90 shadow-2xs hover:shadow-xs transition-shadow">
              <span className="text-xs text-blue-800 font-semibold uppercase tracking-wider block">Sinergi CSR</span>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-blue-800 font-mono tabular-nums mt-1">
                {sinergiCsr}
              </p>
              <span className="text-[11px] text-blue-700 mt-1 block">Pembiayaan non-APBD</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-stone-200/90 shadow-2xs hover:shadow-xs transition-shadow">
              <span className="text-xs text-amber-800 font-semibold uppercase tracking-wider block">Antrean Telaah</span>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-amber-800 font-mono tabular-nums mt-1">
                {butuhTelaah}
              </p>
              <span className="text-[11px] text-amber-700 mt-1 block">Perlu disposisi OPD</span>
            </div>
          </div>

          {/* TAB 1: MEJA VERIFIKASI ASPIRASI */}
          {activeTab === 'verifikasi' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-stone-500 font-semibold">Saring Status:</span>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-stone-50 border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  >
                    <option value="all">Semua Status Telaah ({aspirasiAvailableForUser.length})</option>
                    <option value="ditelaah">Belum Selesai / Ditelaah ({butuhTelaah})</option>
                    <option value="masuk_rkpd">Sudah Masuk RKPD ({masukRkpd})</option>
                    <option value="sinergi_csr">Sinergi CSR ({sinergiCsr})</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onOpenFormAspirasi}
                    className="px-3.5 py-1.5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                  >
                    + Input Usulan OPD Internal
                  </button>
                </div>
              </div>

              {/* Table of Aspirations for Review */}
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-mono">
                        <th className="p-3.5 font-semibold">ID & Misi</th>
                        <th className="p-3.5 font-semibold">Judul Program & Pengusul</th>
                        <th className="p-3.5 font-semibold">Kecamatan</th>
                        <th className="p-3.5 font-semibold">Disposisi OPD</th>
                        <th className="p-3.5 font-semibold text-center">Dukungan</th>
                        <th className="p-3.5 font-semibold">Status Tindak Lanjut</th>
                        <th className="p-3.5 font-semibold text-right">Aksi Telaah</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredAspirasi.map((item) => (
                        <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                          <td className="p-3.5 font-mono">
                            <span className="font-bold text-stone-900">{item.id}</span>
                            <span className="block text-[11px] text-stone-500">
                              {MISI_LABELS[item.misiId]?.nomor}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <p className="font-bold text-stone-900 line-clamp-1">{item.judul}</p>
                            <p className="text-[11px] text-stone-500 mt-0.5">
                              {item.pengusulNama} {item.pengusulInstitusi ? `(${item.pengusulInstitusi})` : ''}
                            </p>
                          </td>
                          <td className="p-3.5 text-stone-600 whitespace-nowrap">{item.kecamatan}</td>
                          <td className="p-3.5 whitespace-nowrap">
                            {item.opdDitunjuk ? (
                              <div className="space-y-0.5">
                                <span className="font-semibold text-emerald-950 block text-[11px] leading-tight max-w-[200px] truncate" title={item.opdDitunjuk}>
                                  {item.opdDitunjuk}
                                </span>
                                {item.catatanOpd ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                    ✓ Sudah Ditelaah OPD
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                    ⏳ Menunggu Catatan OPD
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-rose-50 text-rose-800 border border-rose-200">
                                Belum Didisposisikan
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-center font-mono tabular-nums font-semibold text-stone-800">
                            ▲ {item.dukunganSuara}
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                item.status === 'masuk_rkpd'
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  : item.status === 'sinergi_csr'
                                  ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                  : item.status === 'masuk_renja_pd'
                                  ? 'bg-teal-100 text-teal-900 border border-teal-300'
                                  : item.status === 'ditolak'
                                  ? 'bg-rose-100 text-rose-900 border border-rose-300'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300'
                              }`}
                            >
                              {item.status === 'masuk_rkpd'
                                ? '✓ Masuk RKPD'
                                : item.status === 'sinergi_csr'
                                ? '✓ Skema CSR'
                                : item.status === 'masuk_renja_pd'
                                ? '✓ Renja-PD'
                                : item.status === 'ditolak'
                                ? '✕ Ditolak'
                                : '⏳ Perlu Telaah'}
                            </span>
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleOpenReview(item)}
                              className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
                            >
                              {isOpdVerifikator ? 'Telaah Teknis OPD →' : 'Telaah & Disposisi →'}
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredAspirasi.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-stone-500">
                            {isOpdVerifikator
                              ? 'Belum ada usulan aspirasi yang didisposisikan oleh Bapperida ke OPD Anda.'
                              : 'Tidak ada data usulan yang sesuai dengan penyaringan saat ini.'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: JADWAL SIDANG & MUSRENBANG TEMATIK */}
          {activeTab === 'sidang_musrenbang' && (
            <SidangMusrenbangManager
              currentUser={currentUser}
              agendaList={agendaList}
              kehadiranList={kehadiranList}
              onAddAgenda={onAddAgenda}
              onDeleteAgenda={onDeleteAgenda}
              onUpdateAgendaStatus={onUpdateAgendaStatus}
              onAddKehadiran={onAddKehadiran}
              onUpdateKehadiranStatus={onUpdateKehadiranStatus}
              onDeleteKehadiran={onDeleteKehadiran}
            />
          )}

          {/* TAB: RUANG INISIATIF & ADVOKASI MASYARAKAT SIPIL */}
          {activeTab === 'inisiatif_oms' && (
            <RuangInisiatifOmsManager
              inisiatifList={inisiatifList}
              misiList={misiList}
              onAddInisiatif={onAddInisiatif}
              onUpdateInisiatif={onUpdateInisiatif}
              onDeleteInisiatif={onDeleteInisiatif}
            />
          )}

          {/* TAB 3: SUB-MENU PENGATURAN - KELOLA & TAMBAH USER */}
          {activeTab === 'pengaturan_user' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 uppercase tracking-wider mb-0.5">
                    <span>Manajemen Hak Akses & Akun Pengguna</span>
                    <span aria-hidden="true">•</span>
                    <span>Otoritas Administrator</span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-stone-900">
                    Daftar Pengguna & Penambahan Akun Aparatur/Mitra
                  </h3>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Kelola hak akses verifikator OPD, tim penelaah Bapperida, serta perwakilan pemangku kepentingan dalam pengawalan dokumen RPJMD Tanggamus.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddUser}
                  className="px-4 py-2 bg-emerald-900 hover:bg-emerald-950 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5 self-start sm:self-center whitespace-nowrap"
                >
                  <span>+ Tambah User Baru</span>
                </button>
              </div>

              {/* Search & Statistics Strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200 shadow-2xs">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={searchUserQuery}
                    onChange={(e) => setSearchUserQuery(e.target.value)}
                    placeholder="Cari nama, email, NIP, atau OPD..."
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                  {searchUserQuery && (
                    <button
                      onClick={() => setSearchUserQuery('')}
                      className="absolute right-2.5 top-1.5 text-xs text-stone-400 hover:text-stone-600 cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-stone-600 font-mono">
                  <span>Total: <strong>{usersList.length}</strong></span>
                  <span>•</span>
                  <span>Aktif: <strong className="text-emerald-800">{usersList.filter((u) => u.statusAktif !== false).length}</strong></span>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-mono">
                        <th className="p-3.5 font-semibold">Nama Pejabat / Petugas</th>
                        <th className="p-3.5 font-semibold">Unit Kerja & Jabatan</th>
                        <th className="p-3.5 font-semibold">Peran Akses</th>
                        <th className="p-3.5 font-semibold">Kontak & NIP</th>
                        <th className="p-3.5 font-semibold text-center">Status</th>
                        <th className="p-3.5 font-semibold text-right">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-stone-500">
                            Tidak ada akun pengguna yang sesuai dengan pencarian.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-stone-50/70 transition-colors">
                            <td className="p-3.5">
                              <p className="font-bold text-stone-900">{user.name}</p>
                              <p className="font-mono text-stone-500 text-[11px]">{user.email}</p>
                              <span className="font-mono text-stone-400 text-[10px]">ID: {user.id}</span>
                            </td>
                            <td className="p-3.5">
                              <p className="font-medium text-stone-800">{user.agency || 'Pemerintah Daerah'}</p>
                              <p className="text-stone-500 text-[11px]">{user.jabatan || 'Staf Teknis'}</p>
                            </td>
                            <td className="p-3.5 whitespace-nowrap">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                  user.role === 'bappeda_admin' || user.role === 'bapperida_admin'
                                    ? 'bg-purple-100 text-purple-900 border border-purple-300'
                                    : user.role === 'opd_verifikator'
                                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                    : 'bg-blue-100 text-blue-900 border border-blue-300'
                                }`}
                              >
                                {user.role === 'bappeda_admin' || user.role === 'bapperida_admin'
                                  ? 'Admin Bapperida PME'
                                  : user.role === 'opd_verifikator'
                                  ? 'Verifikator OPD'
                                  : 'Mitra Pemangku'}
                              </span>
                            </td>
                            <td className="p-3.5 font-mono text-[11px] text-stone-600">
                              {user.nip ? <p>NIP: {user.nip}</p> : <p className="text-stone-400 italic">Non-PNS</p>}
                              {user.noHp && <p className="text-stone-500">{user.noHp}</p>}
                            </td>
                            <td className="p-3.5 text-center whitespace-nowrap">
                              <button
                                onClick={() => onToggleUserStatus(user.id)}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border cursor-pointer transition-colors ${
                                  user.statusAktif !== false
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                    : 'bg-stone-100 text-stone-500 border-stone-300 hover:bg-stone-200'
                                }`}
                                title="Klik untuk mengubah status aktif"
                              >
                                {user.statusAktif !== false ? '✓ Aktif' : '✕ Dinonaktifkan'}
                              </button>
                            </td>
                            <td className="p-3.5 text-right whitespace-nowrap space-x-1">
                              <button
                                onClick={() => handleOpenEditUser(user)}
                                className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg transition-colors text-xs font-semibold cursor-pointer border border-stone-200"
                                title="Edit Akun Pengguna"
                              >
                                Edit
                              </button>
                              {user.id !== currentUser.id ? (
                                <button
                                  onClick={() => {
                                    if (confirm(`Apakah Anda yakin ingin menghapus akun ${user.name}?`)) {
                                      onDeleteUser(user.id);
                                    }
                                  }}
                                  className="px-2.5 py-1 text-rose-700 hover:text-rose-900 hover:bg-rose-50 rounded-lg transition-colors text-xs font-semibold cursor-pointer"
                                >
                                  Hapus
                                </button>
                              ) : (
                                <span className="text-[11px] text-stone-400 italic px-2">Akun Anda</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB SUB-MENU PENGATURAN: UNIT KERJA / PERANGKAT DAERAH (OPD) */}
          {activeTab === 'pengaturan_opd' && (
            <PengaturanOpdManager
              opdList={opdList}
              onAddOpd={onAddOpd}
              onUpdateOpd={onUpdateOpd}
              onDeleteOpd={onDeleteOpd}
              onToggleOpdStatus={onToggleOpdStatus}
            />
          )}

          {/* TAB SUB-MENU PENGATURAN: MISI RPJMD DAERAH */}
          {activeTab === 'pengaturan_misi' && (
            <PengaturanMisiManager
              misiList={misiList}
              onAddMisi={onAddMisi}
              onUpdateMisi={onUpdateMisi}
              onDeleteMisi={onDeleteMisi}
              onToggleMisiStatus={onToggleMisiStatus}
            />
          )}

          {/* TAB 4: PENYELARASAN MISI RPJMD & PROGRAM CSR */}
          {activeTab === 'rekapitulasi' && (
            <PenyelarasanCsrManager
              csrPrograms={csrPrograms}
              misiList={misiList}
              opdList={opdList}
              onAddCsrProgram={onAddCsrProgram}
              onUpdateCsrProgram={onUpdateCsrProgram}
              onDeleteCsrProgram={onDeleteCsrProgram}
            />
          )}

          {/* TAB 5: INFORMASI SATKER & OTORITAS */}
          {activeTab === 'profil' && (
            <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-6 max-w-3xl shadow-2xs">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 uppercase tracking-wider mb-0.5">
                  <span>Informasi Instansi & Hak Akses</span>
                  <span aria-hidden="true">•</span>
                  <span>Otoritas Resmi</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Profil Akun & Hak Akses Sistem WARUNG RIMBUN
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  Informasi identitas kedinasan, unit kerja, dan tingkat wewenang penelaahan usulan pembangunan daerah.
                </p>
              </div>

              <div className="space-y-3 text-xs divide-y divide-stone-100">
                <div className="flex justify-between py-2.5">
                  <span className="text-stone-500">Nama Petugas / Pejabat:</span>
                  <span className="font-bold text-stone-800">{currentUser.name}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-stone-500">Alamat Surel (Email):</span>
                  <span className="font-mono text-stone-800">{currentUser.email}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-stone-500">Instansi / Unit Kerja:</span>
                  <span className="text-stone-800 font-semibold">{currentUser.agency}</span>
                </div>
                {currentUser.nip && (
                  <div className="flex justify-between py-2.5">
                    <span className="text-stone-500">Nomor Induk Pegawai (NIP):</span>
                    <span className="font-mono text-stone-800">{currentUser.nip}</span>
                  </div>
                )}
                <div className="flex justify-between py-2.5">
                  <span className="text-stone-500">Peran Sistem:</span>
                  <span className="font-semibold text-emerald-900 uppercase">{currentUser.role}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-stone-500">Wewenang Disposisi:</span>
                  <span className="text-stone-800">Menetapkan usulan ke rancangan awal RKPD & Forum CSR</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-stone-500">Status Keamanan:</span>
                  <span className="text-emerald-800 font-semibold font-mono">✓ SSO Terotentikasi Pemerintah Daerah</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* REVIEW & DISPOSISI MODAL */}
      {selectedAspirasiForReview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-emerald-900 font-semibold uppercase">
                  Lembar Telaah & Disposisi Resmi Bapperida
                </span>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  {selectedAspirasiForReview.id}: {selectedAspirasiForReview.judul}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAspirasiForReview(null)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {isSavedSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-lg font-bold">
                  ✓
                </div>
                <h4 className="text-lg font-serif font-bold text-stone-900">
                  Telaah Berhasil Disimpan & Diterbitkan!
                </h4>
                <p className="text-xs text-stone-600">
                  Status resmi telah diperbarui dan langsung tampil di portal publik untuk transparansi warga.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSaveReview} className="p-6 space-y-4 text-xs">
                {/* Information of the Proposal */}
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-stone-700 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-stone-500 pb-1 border-b border-stone-200/70">
                    <span>Pengusul: <strong>{selectedAspirasiForReview.pengusulNama}</strong> ({selectedAspirasiForReview.pengusulInstitusi || 'Masyarakat'})</span>
                    <span>Wilayah: <strong>{selectedAspirasiForReview.kecamatan}</strong></span>
                  </div>
                  <p className="text-[11px] text-emerald-900 font-mono pt-0.5">
                    {MISI_LABELS[selectedAspirasiForReview.misiId]?.nomor} - {MISI_LABELS[selectedAspirasiForReview.misiId]?.judul}
                  </p>
                  <p className="text-stone-700 italic pt-1 leading-relaxed">
                    "{selectedAspirasiForReview.deskripsiLengkap}"
                  </p>
                </div>

                {/* FORM FOR ADMIN BAPPERIDA */}
                {isAdmin && (
                  <div className="space-y-4">
                    {/* Disposisi Usulan ke OPD yang Ditunjuk */}
                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">
                        Disposisi Usulan ke OPD yang Ditunjuk *
                      </label>
                      <select
                        required
                        value={reviewOpdDitunjuk}
                        onChange={(e) => setReviewOpdDitunjuk(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 font-medium"
                      >
                        <option value="">-- Pilih Perangkat Daerah (OPD) Pengampu --</option>
                        {opdList.map((opd) => (
                          <option key={opd.id} value={opd.namaOpd}>
                            {opd.namaOpd} {opd.kodeOpd ? `(${opd.kodeOpd})` : ''}
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-stone-500 mt-1">
                        * Usulan yang masuk tidak akan masuk ke meja verifikasi OPD sebelum Anda mendisposisikan ke OPD yang ditunjuk.
                      </p>
                    </div>

                    {/* Isi Catatan Resmi OPD - Admin TIDAK BISA mengisi catatan karena hanya OPD yang bisa isi catatan */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-stone-700 font-semibold">
                          Isi Catatan Resmi OPD / Tanggapan Tindak Lanjut
                        </label>
                        <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Hanya Diisi oleh OPD
                        </span>
                      </div>

                      {Boolean(
                        (selectedAspirasiForReview.catatanOpd && selectedAspirasiForReview.catatanOpd.trim() !== '') ||
                        (selectedAspirasiForReview.tanggapanOPD && selectedAspirasiForReview.tanggapanOPD.length > 0)
                      ) ? (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 space-y-1">
                          <div className="flex items-center justify-between text-xs font-semibold text-emerald-900 border-b border-emerald-200/60 pb-1">
                            <span>✓ Catatan Resmi dari {selectedAspirasiForReview.opdDitunjuk || 'OPD Terkait'}</span>
                            {selectedAspirasiForReview.pejabatPenelaahOpd && (
                              <span className="text-[10px] font-mono text-emerald-700">
                                Penelaah: {selectedAspirasiForReview.pejabatPenelaahOpd}
                              </span>
                            )}
                          </div>
                          <p className="whitespace-pre-line text-xs text-stone-800 leading-relaxed font-sans pt-1">
                            {selectedAspirasiForReview.catatanOpd || reviewCatatan}
                          </p>
                          {selectedAspirasiForReview.statusRekomendasiOpd && (
                            <div className="pt-1.5 flex items-center gap-2 text-xs">
                              <span className="text-stone-600 font-medium">Rekomendasi Telaah OPD:</span>
                              <span
                                className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                                  selectedAspirasiForReview.statusRekomendasiOpd === 'masuk_renja_pd'
                                    ? 'bg-emerald-200 text-emerald-900'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {selectedAspirasiForReview.statusRekomendasiOpd === 'masuk_renja_pd'
                                  ? '✓ Disetujui: Masuk Rencana Kerja (Renja-PD)'
                                  : '✕ Ditolak'}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-amber-950">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                            <span>Menunggu Catatan Teknis dari OPD</span>
                          </div>
                          <p className="text-amber-800 text-[11px] leading-relaxed">
                            Akun Admin Bapperida tidak dapat mengisi catatan teknis. Hanya aparatur OPD yang ditunjuk yang berwenang mengisi telaah lapangan dan catatan resmi.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Status Penetapan Tindak Lanjut - Jika OPD belum isi catatan, Admin belum bisa memilih */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-stone-700 font-semibold">
                            Status Penetapan Tindak Lanjut *
                          </label>
                          {!Boolean(
                            (selectedAspirasiForReview.catatanOpd && selectedAspirasiForReview.catatanOpd.trim() !== '') ||
                            (selectedAspirasiForReview.tanggapanOPD && selectedAspirasiForReview.tanggapanOPD.length > 0)
                          ) && (
                            <span className="text-[10px] font-mono text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                              Terkunci (Menunggu OPD)
                            </span>
                          )}
                        </div>
                        <select
                          disabled={
                            !Boolean(
                              (selectedAspirasiForReview.catatanOpd && selectedAspirasiForReview.catatanOpd.trim() !== '') ||
                              (selectedAspirasiForReview.tanggapanOPD && selectedAspirasiForReview.tanggapanOPD.length > 0)
                            )
                          }
                          value={reviewStatus}
                          onChange={(e) => setReviewStatus(e.target.value as StatusTindakLanjut)}
                          className={`w-full border rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 ${
                            !Boolean(
                              (selectedAspirasiForReview.catatanOpd && selectedAspirasiForReview.catatanOpd.trim() !== '') ||
                              (selectedAspirasiForReview.tanggapanOPD && selectedAspirasiForReview.tanggapanOPD.length > 0)
                            )
                              ? 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed'
                              : 'bg-white border-stone-300 font-semibold text-stone-900'
                          }`}
                        >
                          <option value="ditelaah">⏳ Masih Dalam Telaah Teknis OPD</option>
                          <option value="masuk_rkpd">Disetujui: Masuk Rencana Kerja (RKPD)</option>
                          <option value="sinergi_csr">Disetujui: Dialihkan ke Sinergi CSR / TJSLP</option>
                          <option value="pendalaman_teknis">Perlu Pendalaman Survei Lapangan OPD</option>
                          <option value="ditolak">Ditolak / Belum Memenuhi Kriteria</option>
                        </select>
                        {!Boolean(
                          (selectedAspirasiForReview.catatanOpd && selectedAspirasiForReview.catatanOpd.trim() !== '') ||
                          (selectedAspirasiForReview.tanggapanOPD && selectedAspirasiForReview.tanggapanOPD.length > 0)
                        ) && (
                          <p className="text-[11px] text-amber-700 mt-1 leading-tight">
                            * Admin baru dapat memilih status penetapan setelah OPD yang ditunjuk mengisi catatan telaah teknis.
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">
                          Target Tahun Rencana Aksi *
                        </label>
                        <select
                          value={reviewTahun}
                          onChange={(e) => setReviewTahun(Number(e.target.value))}
                          className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                        >
                          <option value={2026}>Tahun Anggaran 2026 (Perubahan)</option>
                          <option value={2027}>Tahun Anggaran 2027 (RKPD Murni)</option>
                          <option value={2028}>Tahun Anggaran 2028</option>
                          <option value={2029}>Tahun Anggaran 2029</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedAspirasiForReview(null)}
                        className="px-3.5 py-1.5 text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-emerald-900 text-white rounded-lg font-semibold hover:bg-emerald-950 cursor-pointer shadow-xs"
                      >
                        {Boolean(
                          (selectedAspirasiForReview.catatanOpd && selectedAspirasiForReview.catatanOpd.trim() !== '') ||
                          (selectedAspirasiForReview.tanggapanOPD && selectedAspirasiForReview.tanggapanOPD.length > 0)
                        )
                          ? 'Simpan & Publikasikan Penetapan RKPD'
                          : 'Simpan Disposisi ke OPD'}
                      </button>
                    </div>
                  </div>
                )}

                {/* FORM FOR VERIFIKATOR OPD TEKNIS */}
                {isOpdVerifikator && (
                  <div className="space-y-4">
                    {/* Disposisi Bapperida Info */}
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-xs">
                      <span className="font-semibold text-blue-950 block">
                        Didisposisikan oleh Bapperida kepada:
                      </span>
                      <span className="font-bold text-blue-900 text-sm">
                        {selectedAspirasiForReview.opdDitunjuk || currentUser.agency || 'Dinas Teknis Terkait'}
                      </span>
                      {selectedAspirasiForReview.tanggalDisposisi && (
                        <span className="block text-[10px] text-blue-700 font-mono mt-0.5">
                          Tanggal Disposisi Bapperida: {selectedAspirasiForReview.tanggalDisposisi}
                        </span>
                      )}
                    </div>

                    {/* Isi Catatan Resmi OPD / Tanggapan Tindak Lanjut */}
                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">
                        Isi Catatan Resmi OPD / Tanggapan Tindak Lanjut *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={reviewCatatan}
                        onChange={(e) => setReviewCatatan(e.target.value)}
                        placeholder="Uraikan hasil telaah teknis lapangan, kesiapan program/kegiatan pada Renja-PD OPD bersangkutan, atau justifikasi jika usulan ditolak..."
                        className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                      />
                    </div>

                    {/* Status Penetapan Tindak Lanjut - Hanya pilihan di setujui :masuk Rencana Kerja (renja-PD) dan di tolak */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">
                          Status Penetapan Tindak Lanjut *
                        </label>
                        <select
                          value={reviewStatusRekomendasiOpd}
                          onChange={(e) => {
                            const val = e.target.value as 'masuk_renja_pd' | 'ditolak';
                            setReviewStatusRekomendasiOpd(val);
                            setReviewStatus(val);
                          }}
                          className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 font-semibold"
                        >
                          <option value="masuk_renja_pd">Disetujui: Masuk Rencana Kerja (Renja-PD)</option>
                          <option value="ditolak">Ditolak</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">
                          Target Tahun Rencana Aksi *
                        </label>
                        <select
                          value={reviewTahun}
                          onChange={(e) => setReviewTahun(Number(e.target.value))}
                          className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                        >
                          <option value={2026}>Tahun Anggaran 2026 (Perubahan)</option>
                          <option value={2027}>Tahun Anggaran 2027 (Renja-PD Murni)</option>
                          <option value={2028}>Tahun Anggaran 2028</option>
                          <option value={2029}>Tahun Anggaran 2029</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedAspirasiForReview(null)}
                        className="px-3.5 py-1.5 text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-emerald-900 text-white rounded-lg font-semibold hover:bg-emerald-950 cursor-pointer shadow-xs"
                      >
                        Simpan Catatan & Rekomendasi Renja-PD
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL TAMBAH & EDIT USER */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-emerald-900 font-semibold uppercase tracking-wider">
                  {editingUser ? 'Perbarui Data Pengguna' : 'Registrasi Hak Akses Pengguna'}
                </span>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  {editingUser ? `Edit Data Akun: ${editingUser.name}` : 'Tambah Akun Pengguna / Aparatur Baru'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  setEditingUser(null);
                }}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {userCreatedSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-lg font-bold">
                  ✓
                </div>
                <h4 className="text-lg font-serif font-bold text-stone-900">
                  {editingUser ? 'Perubahan Data Akun Berhasil Disimpan!' : 'Akun Pengguna Berhasil Dibuat!'}
                </h4>
                <p className="text-xs text-stone-600">
                  Data hak akses pengguna telah diperbarui dan langsung aktif di sistem WARUNG RIMBUN.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSaveUser} className="p-6 space-y-3.5 text-xs">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Nama Lengkap & Gelar *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Contoh: Ir. Muhammad Yusuf, M.T."
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Alamat Surel (Email) Resmi *
                    </label>
                    <input
                      type="email"
                      required
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="nama@daerah.go.id"
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Peran & Tingkat Wewenang *
                    </label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as any)}
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    >
                      <option value="opd_verifikator">Verifikator OPD Teknis (Dinas)</option>
                      <option value="bapperida_admin">Administrator Bapperida (PME)</option>
                      <option value="pemangku_kepentingan">Mitra Pemangku (CSR/Kampus/OMS)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Unit Kerja / Perangkat Daerah (OPD) *
                    </label>
                    <input
                      type="text"
                      required
                      value={newUserAgency}
                      onChange={(e) => setNewUserAgency(e.target.value)}
                      placeholder="Contoh: Dinas Kesehatan Kabupaten Tanggamus"
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Jabatan Struktural / Fungsional
                    </label>
                    <input
                      type="text"
                      value={newUserJabatan}
                      onChange={(e) => setNewUserJabatan(e.target.value)}
                      placeholder="Contoh: Kepala Bidang Kesehatan Masyarakat"
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Nomor Induk Pegawai (NIP) / NIDN
                    </label>
                    <input
                      type="text"
                      value={newUserNip}
                      onChange={(e) => setNewUserNip(e.target.value)}
                      placeholder="Contoh: 19850612 201001 1 008"
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Nomor HP / WhatsApp Dinas
                    </label>
                    <input
                      type="text"
                      value={newUserPhone}
                      onChange={(e) => setNewUserPhone(e.target.value)}
                      placeholder="Contoh: 0812-3456-7890"
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-600 text-[11px]">
                  <strong>Catatan Hak Akses:</strong> Akun yang didaftarkan akan secara otomatis terintegrasi dengan basis login sistem WARUNG RIMBUN dan dapat langsung melakukan penelaahan usulan.
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddUserModal(false);
                      setEditingUser(null);
                    }}
                    className="px-3.5 py-1.5 text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-900 text-white rounded-lg font-semibold hover:bg-emerald-950 shadow-2xs cursor-pointer"
                  >
                    {editingUser ? 'Simpan Perubahan Akun' : 'Simpan Akun Pengguna'}
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
