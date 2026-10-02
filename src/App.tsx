import { useState, useEffect } from 'react';
import {
  INITIAL_ASPIRASI,
  KEMITRAAN_CSR_DATA,
  RISET_AKADEMISI_DATA,
  INISIATIF_OMS_DATA,
  BAB_RPJMD_DATA,
  KONSULTASI_AGENDA_DATA,
  INITIAL_USERS,
  INITIAL_KEHADIRAN_SIDANG,
  INITIAL_OPD_TANGGAMUS,
  INITIAL_MISI_RPJMD,
} from './data/mockData';
import {
  AspirasiPublik,
  KemitraanCSR,
  RisetAkademisi,
  InisiatifOMS,
  BabRPJMD,
  StakeholderType,
  UserAccount,
  StatusTindakLanjut,
  KonsultasiAgenda,
  KonfirmasiKehadiranSidang,
  UnitKerjaOPD,
  MisiRPJMDItem,
} from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PentahelixExplainer } from './components/PentahelixExplainer';
import { AspirasiList } from './components/AspirasiList';
import { AspirasiModal } from './components/AspirasiModal';
import { FormAspirasiModal } from './components/FormAspirasiModal';
import { KemitraanCsrView } from './components/KemitraanCsrView';
import { RisetAkademisiView } from './components/RisetAkademisiView';
import { InisiatifOmsView } from './components/InisiatifOmsView';
import { KonsultasiPublikView } from './components/KonsultasiPublikView';
import { SimulasiPrioritas } from './components/SimulasiPrioritas';
import { StatistikDashboard } from './components/StatistikDashboard';
import { LoginPage } from './components/LoginPage';
import { UserDashboard } from './components/UserDashboard';
import { PetaAspirasiTanggamus } from './components/PetaAspirasiTanggamus';
import { Footer } from './components/Footer';
import {
  testFirestoreConnection,
  subscribeCollection,
  saveDocumentToFirestore,
  deleteDocumentFromFirestore,
  seedInitialDataIfEmpty,
} from './firebase';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('rembuk');
  const [filterPillar, setFilterPillar] = useState<string>('all');
  const [selectedKecamatanFilter, setSelectedKecamatanFilter] = useState<string>('all');
  const [formDefaultKecamatan, setFormDefaultKecamatan] = useState<string | undefined>(undefined);
  const [selectedAspirasi, setSelectedAspirasi] = useState<AspirasiPublik | null>(null);
  const [isFormAspirasiOpen, setIsFormAspirasiOpen] = useState(false);
  const [isRisetModalOpen, setIsRisetModalOpen] = useState(false);
  const [isOmsModalOpen, setIsOmsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean | null>(null);

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('sinergi_rpjmd_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Main dynamic datasets initialized with localStorage fallback
  const [aspirasiList, setAspirasiList] = useState<AspirasiPublik[]>(() => {
    try {
      const saved = localStorage.getItem('sinergi_rpjmd_aspirasi');
      return saved ? JSON.parse(saved) : INITIAL_ASPIRASI;
    } catch {
      return INITIAL_ASPIRASI;
    }
  });

  const [csrPrograms, setCsrPrograms] = useState<KemitraanCSR[]>(() => {
    try {
      const saved = localStorage.getItem('sinergi_rpjmd_csr');
      return saved ? JSON.parse(saved) : KEMITRAAN_CSR_DATA;
    } catch {
      return KEMITRAAN_CSR_DATA;
    }
  });

  const [risetList, setRisetList] = useState<RisetAkademisi[]>(() => {
    try {
      const saved = localStorage.getItem('sinergi_rpjmd_riset');
      return saved ? JSON.parse(saved) : RISET_AKADEMISI_DATA;
    } catch {
      return RISET_AKADEMISI_DATA;
    }
  });

  const [omsList, setOmsList] = useState<InisiatifOMS[]>(() => {
    try {
      const saved = localStorage.getItem('sinergi_rpjmd_oms');
      return saved ? JSON.parse(saved) : INISIATIF_OMS_DATA;
    } catch {
      return INISIATIF_OMS_DATA;
    }
  });

  const [babList, setBabList] = useState<BabRPJMD[]>(() => {
    try {
      const saved = localStorage.getItem('sinergi_rpjmd_bab');
      return saved ? JSON.parse(saved) : BAB_RPJMD_DATA;
    } catch {
      return BAB_RPJMD_DATA;
    }
  });

  const [usersList, setUsersList] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('sinergi_rpjmd_users_list');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [agendaList, setAgendaList] = useState<KonsultasiAgenda[]>(() => {
    try {
      const saved = localStorage.getItem('sinergi_rpjmd_agenda');
      return saved ? JSON.parse(saved) : KONSULTASI_AGENDA_DATA;
    } catch {
      return KONSULTASI_AGENDA_DATA;
    }
  });

  const [kehadiranList, setKehadiranList] = useState<KonfirmasiKehadiranSidang[]>(() => {
    try {
      const saved = localStorage.getItem('sinergi_rpjmd_kehadiran');
      return saved ? JSON.parse(saved) : INITIAL_KEHADIRAN_SIDANG;
    } catch {
      return INITIAL_KEHADIRAN_SIDANG;
    }
  });

  const [opdList, setOpdList] = useState<UnitKerjaOPD[]>(() => {
    try {
      const saved = localStorage.getItem('sinergi_rpjmd_opd_list');
      return saved ? JSON.parse(saved) : INITIAL_OPD_TANGGAMUS;
    } catch {
      return INITIAL_OPD_TANGGAMUS;
    }
  });

  const [misiList, setMisiList] = useState<MisiRPJMDItem[]>(() => {
    try {
      const saved = localStorage.getItem('sinergi_rpjmd_misi_list');
      return saved ? JSON.parse(saved) : INITIAL_MISI_RPJMD;
    } catch {
      return INITIAL_MISI_RPJMD;
    }
  });

  const [dashboardSubTab, setDashboardSubTab] = useState<'verifikasi' | 'sidang_musrenbang' | 'pengaturan_user' | 'pengaturan_opd' | 'pengaturan_misi' | 'rekapitulasi' | 'profil'>('verifikasi');

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem('sinergi_rpjmd_misi_list', JSON.stringify(misiList));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [misiList]);

  useEffect(() => {
    try {
      localStorage.setItem('sinergi_rpjmd_opd_list', JSON.stringify(opdList));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [opdList]);

  useEffect(() => {
    try {
      localStorage.setItem('sinergi_rpjmd_users_list', JSON.stringify(usersList));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [usersList]);

  useEffect(() => {
    try {
      localStorage.setItem('sinergi_rpjmd_agenda', JSON.stringify(agendaList));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [agendaList]);

  useEffect(() => {
    try {
      localStorage.setItem('sinergi_rpjmd_kehadiran', JSON.stringify(kehadiranList));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [kehadiranList]);

  useEffect(() => {
    try {
      localStorage.setItem('sinergi_rpjmd_aspirasi', JSON.stringify(aspirasiList));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [aspirasiList]);

  useEffect(() => {
    try {
      localStorage.setItem('sinergi_rpjmd_csr', JSON.stringify(csrPrograms));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [csrPrograms]);

  useEffect(() => {
    try {
      localStorage.setItem('sinergi_rpjmd_riset', JSON.stringify(risetList));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [risetList]);

  useEffect(() => {
    try {
      localStorage.setItem('sinergi_rpjmd_oms', JSON.stringify(omsList));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [omsList]);

  useEffect(() => {
    try {
      localStorage.setItem('sinergi_rpjmd_bab', JSON.stringify(babList));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [babList]);

  // Connect to Google Cloud Firestore, seed if empty, and subscribe to real-time updates
  useEffect(() => {
    testFirestoreConnection().then((ok) => {
      setIsCloudConnected(ok);
      if (ok) {
        seedInitialDataIfEmpty('aspirasi', INITIAL_ASPIRASI);
        seedInitialDataIfEmpty('csr_programs', KEMITRAAN_CSR_DATA);
        seedInitialDataIfEmpty('riset', RISET_AKADEMISI_DATA);
        seedInitialDataIfEmpty('oms', INISIATIF_OMS_DATA);
        seedInitialDataIfEmpty('agenda', KONSULTASI_AGENDA_DATA);
        seedInitialDataIfEmpty('kehadiran', INITIAL_KEHADIRAN_SIDANG);
        seedInitialDataIfEmpty('bab', BAB_RPJMD_DATA as (BabRPJMD & { id: string })[]);
        seedInitialDataIfEmpty('users', INITIAL_USERS);
        seedInitialDataIfEmpty('opd', INITIAL_OPD_TANGGAMUS);
        seedInitialDataIfEmpty('misi', INITIAL_MISI_RPJMD);
      }
    });

    const unsubAspirasi = subscribeCollection<AspirasiPublik>('aspirasi', (data) => {
      if (data && data.length > 0) setAspirasiList(data);
    });
    const unsubCsr = subscribeCollection<KemitraanCSR>('csr_programs', (data) => {
      if (data && data.length > 0) setCsrPrograms(data);
    });
    const unsubRiset = subscribeCollection<RisetAkademisi>('riset', (data) => {
      if (data && data.length > 0) setRisetList(data);
    });
    const unsubOms = subscribeCollection<InisiatifOMS>('oms', (data) => {
      if (data && data.length > 0) setOmsList(data);
    });
    const unsubAgenda = subscribeCollection<KonsultasiAgenda>('agenda', (data) => {
      if (data && data.length > 0) setAgendaList(data);
    });
    const unsubKehadiran = subscribeCollection<KonfirmasiKehadiranSidang>('kehadiran', (data) => {
      if (data && data.length > 0) setKehadiranList(data);
    });
    const unsubBab = subscribeCollection<BabRPJMD & { id: string }>('bab', (data) => {
      if (data && data.length > 0) setBabList(data);
    });
    const unsubUsers = subscribeCollection<UserAccount>('users', (data) => {
      if (data && data.length > 0) setUsersList(data);
    });
    const unsubOpd = subscribeCollection<UnitKerjaOPD>('opd', (data) => {
      if (data && data.length > 0) setOpdList(data);
    });
    const unsubMisi = subscribeCollection<MisiRPJMDItem>('misi', (data) => {
      if (data && data.length > 0) setMisiList(data);
    });

    return () => {
      unsubAspirasi();
      unsubCsr();
      unsubRiset();
      unsubOms();
      unsubAgenda();
      unsubKehadiran();
      unsubBab();
      unsubUsers();
      unsubOpd();
      unsubMisi();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Upvote an aspiration (persists to Firestore)
  const handleVote = (id: string) => {
    let updatedToSave: AspirasiPublik | null = null;
    setAspirasiList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const isVoted = item.hasVoted;
          const newDukungan = isVoted ? item.dukunganSuara - 1 : item.dukunganSuara + 1;
          const updated = {
            ...item,
            dukunganSuara: newDukungan,
            hasVoted: !isVoted,
          };
          updatedToSave = updated;
          return updated;
        }
        return item;
      })
    );
    if (updatedToSave) {
      saveDocumentToFirestore('aspirasi', updatedToSave);
    }
    if (selectedAspirasi && selectedAspirasi.id === id) {
      setSelectedAspirasi((prev) =>
        prev
          ? {
              ...prev,
              dukunganSuara: prev.hasVoted ? prev.dukunganSuara - 1 : prev.dukunganSuara + 1,
              hasVoted: !prev.hasVoted,
            }
          : null
      );
    }
    showToast('Dukungan suara berhasil diperbarui dan tersimpan di cloud.');
  };

  // Add new proposal (persists to Firestore)
  const handleAddAspirasi = (newEntry: AspirasiPublik) => {
    setAspirasiList((prev) => [newEntry, ...prev]);
    saveDocumentToFirestore('aspirasi', newEntry);
    showToast('Aspirasi baru berhasil didaftarkan dan tersimpan permanen di cloud.');
  };

  // Add comment to aspiration (persists to Firestore)
  const handleAddComment = (
    aspirasiId: string,
    nama: string,
    institusi: string,
    tipe: StakeholderType,
    isi: string
  ) => {
    const newComment = {
      id: `KOM-${Date.now()}`,
      nama,
      institusi: institusi || undefined,
      tipe,
      tanggal: 'Hari ini',
      isi,
    };
    let updatedToSave: AspirasiPublik | null = null;
    setAspirasiList((prev) =>
      prev.map((item) => {
        if (item.id === aspirasiId) {
          const updated = {
            ...item,
            komentarPublik: [...item.komentarPublik, newComment],
          };
          updatedToSave = updated;
          return updated;
        }
        return item;
      })
    );
    if (updatedToSave) {
      saveDocumentToFirestore('aspirasi', updatedToSave);
    }
    if (selectedAspirasi && selectedAspirasi.id === aspirasiId) {
      setSelectedAspirasi((prev) =>
        prev
          ? {
              ...prev,
              komentarPublik: [...prev.komentarPublik, newComment],
            }
          : null
      );
    }
    showToast('Komentar berhasil dipublikasikan di cloud database.');
  };

  // CSR Expression of Interest (persists to Firestore)
  const handleCommitCSR = (
    programId: string,
    namaPerusahaan: string,
    nilaiKomitmen: string,
    bentukDukungan: string
  ) => {
    let updatedToSave: KemitraanCSR | null = null;
    setCsrPrograms((prev) =>
      prev.map((prog) => {
        if (prog.id === programId) {
          const updatedMitra = [...prog.mitraBergabung, namaPerusahaan];
          const updatedPercent = Math.min(prog.persentaseTercapai + 20, 100);
          const updated = {
            ...prog,
            mitraBergabung: updatedMitra,
            persentaseTercapai: updatedPercent,
            status: updatedPercent >= 100 ? ('berjalan' as const) : ('proses_mou' as const),
          };
          updatedToSave = updated;
          return updated;
        }
        return prog;
      })
    );
    if (updatedToSave) {
      saveDocumentToFirestore('csr_programs', updatedToSave);
    }
    showToast(`Surat Minat Kerjasama dari ${namaPerusahaan} (${bentukDukungan}: ${nilaiKomitmen}) berhasil tersimpan di cloud.`);
  };

  // Academic research submission (persists to Firestore)
  const handleSubmitRiset = (newRiset: RisetAkademisi) => {
    setRisetList((prev) => [newRiset, ...prev]);
    saveDocumentToFirestore('riset', newRiset);
    showToast('Policy Brief berhasil diunggah ke repositori cloud riset daerah.');
  };

  // OMS initiative registration (persists to Firestore)
  const handleAddInisiatif = (newInit: InisiatifOMS) => {
    setOmsList((prev) => [newInit, ...prev]);
    saveDocumentToFirestore('oms', newInit);
    showToast('Inisiatif komunitas berhasil didaftarkan dan tersimpan permanen di cloud.');
  };

  const handleUpdateInisiatif = (updatedInit: InisiatifOMS) => {
    setOmsList((prev) =>
      prev.map((i) => (i.id === updatedInit.id ? updatedInit : i))
    );
    saveDocumentToFirestore('oms', updatedInit);
    showToast(`Inisiatif "${updatedInit.judulInisiatif}" berhasil diperbarui di cloud.`);
  };

  const handleDeleteInisiatif = (id: string) => {
    setOmsList((prev) => prev.filter((i) => i.id !== id));
    deleteDocumentFromFirestore('oms', id);
    showToast('Inisiatif masyarakat sipil berhasil dihapus dari cloud.');
  };

  const handleUpdateUser = (updatedUser: UserAccount) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    saveDocumentToFirestore('users', updatedUser);
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    showToast(`Data akun "${updatedUser.name}" berhasil diperbarui di cloud.`);
  };

  // Add critical note to RPJMD Chapter (persists to Firestore)
  const handleAddCatatanBab = (
    nomorBab: string,
    nama: string,
    institusi: string,
    tipe: StakeholderType,
    pasal: string,
    komentar: string
  ) => {
    const newNote = {
      id: `CK-${Date.now()}`,
      nama,
      institusi,
      tipe,
      pasalBagian: pasal,
      komentar,
      tanggal: 'Hari ini',
    };
    let updatedToSave: BabRPJMD | null = null;
    setBabList((prev) =>
      prev.map((b) => {
        if (b.nomorBab === nomorBab) {
          const updated = {
            ...b,
            totalMasukan: b.totalMasukan + 1,
            catatanKritis: [newNote, ...b.catatanKritis],
          };
          updatedToSave = updated;
          return updated;
        }
        return b;
      })
    );
    if (updatedToSave) {
      const babToSave = updatedToSave as BabRPJMD & { id: string };
      saveDocumentToFirestore('bab', {
        ...babToSave,
        id: babToSave.id || babToSave.nomorBab,
      });
    }
    showToast(`Catatan kritis untuk ${nomorBab} berhasil dicatat ke cloud database.`);
  };

  // Login & Session handlers
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('sinergi_rpjmd_user', JSON.stringify(user));
    } catch (e) {
      console.warn(e);
    }
    setActiveTab('user_dashboard');
    showToast(`Selamat datang kembali, ${user.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('sinergi_rpjmd_user');
    } catch (e) {
      console.warn(e);
    }
    setActiveTab('rembuk');
    showToast('Anda telah keluar dari sistem.');
  };

  // Update Aspirasi status by reviewer in dashboard (persists to Firestore)
  const handleUpdateAspirasiStatus = (
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
  ) => {
    let updatedToSave: AspirasiPublik | null = null;
    setAspirasiList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nowStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
          const updated: AspirasiPublik = { ...item };
          if (extra?.opdDitunjuk) {
            updated.opdDitunjuk = extra.opdDitunjuk;
            updated.tanggalDisposisi = nowStr;
          }
          if (extra?.catatanOpd !== undefined && extra.catatanOpd.trim() !== '') {
            updated.catatanOpd = extra.catatanOpd;
            updated.tanggalTanggapanOpd = nowStr;
            updated.pejabatPenelaahOpd = currentUser?.name || 'Verifikator Teknis OPD';
          }
          if (extra?.statusRekomendasiOpd) {
            updated.statusRekomendasiOpd = extra.statusRekomendasiOpd;
          }
          const statusToApply = extra?.finalStatus || newStatus;
          updated.status = statusToApply;
          const catatanFinal = extra?.catatanOpd || catatanOPD;
          if (catatanFinal && catatanFinal.trim() !== '') {
            const updatedTanggapan = [
              {
                id: `TGP-${Date.now()}`,
                opdNama: updated.opdDitunjuk || currentUser?.agency || 'Bapperida & Tim Penyusun RPJMD Tanggamus',
                pejabatNama: currentUser?.name || 'Verifikator Perencanaan',
                pejabatJabatan:
                  currentUser?.role === 'bappeda_admin' || currentUser?.role === 'bapperida_admin'
                    ? 'Administrator Bidang PME Bapperida'
                    : 'Verifikator Teknis OPD',
                tanggal: nowStr,
                isiTanggapan: catatanFinal,
                statusPenetapan: statusToApply,
                rencanaAksiTahun: extra?.rencanaAksiTahun || 2027,
              },
              ...(item.tanggapanOPD || []).filter((t) => t.opdNama !== (updated.opdDitunjuk || currentUser?.agency)),
            ];
            updated.tanggapanOPD = updatedTanggapan;
          }
          updatedToSave = updated;
          return updated;
        }
        return item;
      })
    );
    if (updatedToSave) {
      saveDocumentToFirestore('aspirasi', updatedToSave);
    }
    if (extra?.isDisposisiOnly) {
      showToast(`Usulan ${id} berhasil didisposisikan kepada ${extra.opdDitunjuk} dan tersimpan di cloud.`);
    } else if (extra?.catatanOpd && !extra?.finalStatus) {
      showToast(`Catatan telaah teknis OPD untuk usulan ${id} berhasil disimpan ke cloud database.`);
    } else {
      showToast(`Status penetapan usulan ${id} berhasil diperbarui di cloud database.`);
    }
  };

  // Add, toggle, and delete user handlers (persists to Firestore)
  const handleAddUser = (newUser: UserAccount) => {
    setUsersList((prev) => [newUser, ...prev]);
    saveDocumentToFirestore('users', newUser);
    showToast(`Akun ${newUser.name} berhasil ditambahkan dan tersimpan di cloud.`);
  };

  const handleToggleUserStatus = (id: string) => {
    let updatedToSave: UserAccount | null = null;
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const updated = { ...u, statusAktif: u.statusAktif === false ? true : false };
          updatedToSave = updated;
          showToast(`Status akun ${u.name} sekarang ${updated.statusAktif ? 'Aktif' : 'Dinonaktifkan'} (tersimpan di cloud).`);
          return updated;
        }
        return u;
      })
    );
    if (updatedToSave) {
      saveDocumentToFirestore('users', updatedToSave);
    }
  };

  const handleDeleteUser = (id: string) => {
    setUsersList((prev) => prev.filter((u) => u.id !== id));
    deleteDocumentFromFirestore('users', id);
    showToast('Akun pengguna berhasil dihapus dari cloud database.');
  };

  // Agenda Sidang Handlers (persists to Firestore)
  const handleAddAgenda = (newAgenda: KonsultasiAgenda) => {
    setAgendaList((prev) => [newAgenda, ...prev]);
    saveDocumentToFirestore('agenda', newAgenda);
    showToast(`Jadwal sidang "${newAgenda.judulSidang}" berhasil ditambahkan ke cloud.`);
  };

  const handleDeleteAgenda = (agendaId: string) => {
    setAgendaList((prev) => prev.filter((a) => a.id !== agendaId));
    deleteDocumentFromFirestore('agenda', agendaId);
    showToast('Agenda sidang berhasil dihapus dari cloud.');
  };

  const handleUpdateAgendaStatus = (agendaId: string, status: 'buka' | 'segera' | 'selesai') => {
    let updatedToSave: KonsultasiAgenda | null = null;
    setAgendaList((prev) =>
      prev.map((a) => {
        if (a.id === agendaId) {
          const updated = { ...a, statusPendaftaran: status };
          updatedToSave = updated;
          return updated;
        }
        return a;
      })
    );
    if (updatedToSave) {
      saveDocumentToFirestore('agenda', updatedToSave);
    }
    showToast(`Status pendaftaran sidang diperbarui menjadi ${status} di cloud.`);
  };

  // Konfirmasi Kehadiran (RSVP) Handlers (persists to Firestore)
  const handleAddKehadiran = (newRsvp: KonfirmasiKehadiranSidang) => {
    setKehadiranList((prev) => [newRsvp, ...prev]);
    saveDocumentToFirestore('kehadiran', newRsvp);
    showToast(`Konfirmasi kehadiran untuk "${newRsvp.namaLengkap}" berhasil dicatat ke cloud.`);
  };

  const handleUpdateKehadiranStatus = (id: string, status: 'terkonfirmasi' | 'hadir' | 'menunggu') => {
    let updatedToSave: KonfirmasiKehadiranSidang | null = null;
    setKehadiranList((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = { ...r, statusVerifikasi: status };
          updatedToSave = updated;
          return updated;
        }
        return r;
      })
    );
    if (updatedToSave) {
      saveDocumentToFirestore('kehadiran', updatedToSave);
    }
    showToast(`Status kehadiran peserta berhasil diubah menjadi ${status} di cloud.`);
  };

  const handleDeleteKehadiran = (id: string) => {
    setKehadiranList((prev) => prev.filter((r) => r.id !== id));
    deleteDocumentFromFirestore('kehadiran', id);
    showToast('Data konfirmasi kehadiran berhasil dihapus dari cloud.');
  };

  // OPD Management Handlers (persists to Firestore)
  const handleAddOpd = (newOpd: UnitKerjaOPD) => {
    setOpdList((prev) => [newOpd, ...prev]);
    saveDocumentToFirestore('opd', newOpd);
    showToast(`Perangkat Daerah "${newOpd.singkatan}" berhasil didaftarkan ke cloud.`);
  };

  const handleUpdateOpd = (updatedOpd: UnitKerjaOPD) => {
    setOpdList((prev) =>
      prev.map((o) => (o.id === updatedOpd.id ? updatedOpd : o))
    );
    saveDocumentToFirestore('opd', updatedOpd);
    showToast(`Data Perangkat Daerah "${updatedOpd.singkatan}" berhasil diperbarui di cloud.`);
  };

  const handleDeleteOpd = (opdId: string) => {
    setOpdList((prev) => prev.filter((o) => o.id !== opdId));
    deleteDocumentFromFirestore('opd', opdId);
    showToast('Perangkat Daerah berhasil dihapus dari sistem cloud.');
  };

  const handleToggleOpdStatus = (opdId: string) => {
    let updatedToSave: UnitKerjaOPD | null = null;
    setOpdList((prev) =>
      prev.map((o) => {
        if (o.id === opdId) {
          const updated = { ...o, statusAktif: !o.statusAktif };
          updatedToSave = updated;
          return updated;
        }
        return o;
      })
    );
    if (updatedToSave) {
      saveDocumentToFirestore('opd', updatedToSave);
    }
    showToast('Status keaktifan Perangkat Daerah berhasil diperbarui di cloud.');
  };

  // Misi RPJMD Handlers (persists to Firestore)
  const handleAddMisi = (newMisi: MisiRPJMDItem) => {
    setMisiList((prev) => [...prev, newMisi]);
    saveDocumentToFirestore('misi', newMisi);
    showToast(`Misi "${newMisi.nomor}: ${newMisi.judul}" berhasil didaftarkan ke cloud RPJMD.`);
  };

  const handleUpdateMisi = (updatedMisi: MisiRPJMDItem) => {
    setMisiList((prev) =>
      prev.map((m) => (m.id === updatedMisi.id ? updatedMisi : m))
    );
    saveDocumentToFirestore('misi', updatedMisi);
    showToast(`${updatedMisi.nomor} ("${updatedMisi.judul}") berhasil diperbarui di cloud.`);
  };

  const handleDeleteMisi = (misiId: string) => {
    setMisiList((prev) => prev.filter((m) => m.id !== misiId));
    deleteDocumentFromFirestore('misi', misiId);
    showToast('Misi RPJMD berhasil dihapus dari cloud.');
  };

  const handleToggleMisiStatus = (misiId: string) => {
    let updatedToSave: MisiRPJMDItem | null = null;
    setMisiList((prev) =>
      prev.map((m) => {
        if (m.id === misiId) {
          const updated = { ...m, statusAktif: !m.statusAktif };
          updatedToSave = updated;
          return updated;
        }
        return m;
      })
    );
    if (updatedToSave) {
      saveDocumentToFirestore('misi', updatedToSave);
    }
    showToast('Status keaktifan Misi RPJMD berhasil diubah di cloud.');
  };

  // Kemitraan CSR Handlers (persists to Firestore)
  const handleAddCsrProgram = (newProgram: KemitraanCSR) => {
    setCsrPrograms((prev) => [newProgram, ...prev]);
    saveDocumentToFirestore('csr_programs', newProgram);
    showToast(`Program CSR "${newProgram.namaProgram}" berhasil ditambahkan ke cloud.`);
  };

  const handleUpdateCsrProgram = (updatedProgram: KemitraanCSR) => {
    setCsrPrograms((prev) =>
      prev.map((p) => (p.id === updatedProgram.id ? updatedProgram : p))
    );
    saveDocumentToFirestore('csr_programs', updatedProgram);
    showToast(`Program CSR "${updatedProgram.namaProgram}" berhasil diperbarui di cloud.`);
  };

  const handleDeleteCsrProgram = (programId: string) => {
    setCsrPrograms((prev) => prev.filter((p) => p.id !== programId));
    deleteDocumentFromFirestore('csr_programs', programId);
    showToast('Program CSR berhasil dihapus dari cloud database.');
  };

  const handleNavigatePengaturan = (sub: 'user' | 'opd' | 'misi') => {
    if (!currentUser) {
      setActiveTab('login');
      showToast('Silakan masuk (login) terlebih dahulu untuk mengakses menu pengaturan.');
      return;
    }
    const targetTab =
      sub === 'user' ? 'pengaturan_user' : sub === 'opd' ? 'pengaturan_opd' : 'pengaturan_misi';
    setDashboardSubTab(targetTab);
    setActiveTab('user_dashboard');
    showToast(
      `Membuka Pengaturan: ${
        sub === 'user'
          ? 'Kelola & Tambah User'
          : sub === 'opd'
          ? 'Unit Kerja / Perangkat Daerah (OPD)'
          : 'Misi RPJMD Daerah'
      }`
    );
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Judul Aspirasi',
      'Pengusul',
      'Institusi',
      'Kategori Pemangku',
      'Kecamatan',
      'Misi RPJMD',
      'Dukungan Suara',
      'Status Telaah',
    ];
    const rows = aspirasiList.map((item) => [
      item.id,
      `"${item.judul.replace(/"/g, '""')}"`,
      `"${item.pengusulNama.replace(/"/g, '""')}"`,
      `"${(item.pengusulInstitusi || '').replace(/"/g, '""')}"`,
      item.tipePemangku,
      `"${item.kecamatan}"`,
      item.misiId,
      item.dukunganSuara,
      item.status,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `data_partisipasi_rpjmd_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Data partisipasi berhasil diekspor ke CSV.');
  };

  // Print Executive Summary
  const handlePrintReport = () => {
    window.print();
  };

  const handleScrollToSimulasi = () => {
    const el = document.getElementById('simulasi-prioritas');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveTab('rembuk');
      setTimeout(() => {
        const target = document.getElementById('simulasi-prioritas');
        target?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleNavigatePillar = (pillar: 'masyarakat' | 'swasta' | 'akademisi' | 'oms') => {
    switch (pillar) {
      case 'masyarakat':
        setFilterPillar('masyarakat');
        setActiveTab('rembuk');
        showToast('Membuka Usulan Warga: menampilkan aspirasi warga & masyarakat.');
        setTimeout(() => {
          const el = document.getElementById('daftar-aspirasi');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 120);
        break;
      case 'swasta':
        setActiveTab('csr');
        showToast('Membuka Bursa Kemitraan CSR & Pembiayaan Non-APBD Daerah.');
        setTimeout(() => {
          const el = document.getElementById('kemitraan-csr');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 120);
        break;
      case 'akademisi':
        setActiveTab('riset');
        showToast('Membuka Hub Kajian Ilmiah & Rekomendasi Kebijakan Kampus.');
        setTimeout(() => {
          const el = document.getElementById('kajian-ilmiah');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 120);
        break;
      case 'oms':
        setActiveTab('oms');
        showToast('Membuka Ruang Inisiatif & Advokasi Masyarakat Sipil.');
        setTimeout(() => {
          const el = document.getElementById('inisiatif-oms');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 120);
        break;
    }
  };

  const handleQuickActionPillar = (pillar: 'masyarakat' | 'swasta' | 'akademisi' | 'oms') => {
    switch (pillar) {
      case 'masyarakat':
        setIsFormAspirasiOpen(true);
        break;
      case 'swasta':
        setActiveTab('csr');
        showToast('Pilih salah satu program prioritas CSR untuk mengajukan komitmen.');
        setTimeout(() => {
          const el = document.getElementById('katalog-csr-proyek');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 120);
        break;
      case 'akademisi':
        setActiveTab('riset');
        setIsRisetModalOpen(true);
        showToast('Membuka formulir unggah naskah Policy Brief akademisi.');
        break;
      case 'oms':
        setActiveTab('oms');
        setIsOmsModalOpen(true);
        showToast('Membuka formulir pendaftaran inisiatif masyarakat sipil.');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs px-4 py-3 rounded-lg shadow-xl border border-stone-700 flex items-center gap-2 animate-bounce-once">
          <span className="text-emerald-400 font-bold">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header: only show on public portal tabs, hide on user_dashboard */}
      {activeTab !== 'user_dashboard' && (
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenFormAspirasi={() => setIsFormAspirasiOpen(true)}
          onScrollToSimulasi={handleScrollToSimulasi}
          currentUser={currentUser}
          onOpenLogin={() => setActiveTab('login')}
          onOpenUserDashboard={() => setActiveTab('user_dashboard')}
          onNavigatePengaturan={handleNavigatePengaturan}
          isCloudConnected={isCloudConnected}
        />
      )}

      {/* Hero Section & Pentahelix (Only show on main landing/rembuk tab, hide on specific sub-tabs/login/dashboard) */}
      {activeTab === 'rembuk' && (
        <>
          <Hero
            onOpenFormAspirasi={() => setIsFormAspirasiOpen(true)}
            onExploreAspirasi={() => {
              setActiveTab('rembuk');
              const el = document.getElementById('daftar-aspirasi');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.scrollTo({ top: 600, behavior: 'smooth' });
              }
            }}
          />
          <PentahelixExplainer
            onNavigatePillar={handleNavigatePillar}
            onQuickAction={handleQuickActionPillar}
          />
        </>
      )}

      {/* Content Area */}
      {activeTab === 'user_dashboard' && currentUser ? (
        <UserDashboard
          currentUser={currentUser}
          usersList={usersList}
          aspirasiList={aspirasiList}
          csrPrograms={csrPrograms}
          agendaList={agendaList}
          kehadiranList={kehadiranList}
          opdList={opdList}
          initialSubTab={dashboardSubTab}
          onLogout={handleLogout}
          onUpdateAspirasiStatus={handleUpdateAspirasiStatus}
          onAddUser={handleAddUser}
          onUpdateUser={handleUpdateUser}
          onToggleUserStatus={handleToggleUserStatus}
          onDeleteUser={handleDeleteUser}
          onAddAgenda={handleAddAgenda}
          onDeleteAgenda={handleDeleteAgenda}
          onUpdateAgendaStatus={handleUpdateAgendaStatus}
          onAddKehadiran={handleAddKehadiran}
          onUpdateKehadiranStatus={handleUpdateKehadiranStatus}
          onDeleteKehadiran={handleDeleteKehadiran}
          onAddOpd={handleAddOpd}
          onUpdateOpd={handleUpdateOpd}
          onDeleteOpd={handleDeleteOpd}
          onToggleOpdStatus={handleToggleOpdStatus}
          misiList={misiList}
          onAddMisi={handleAddMisi}
          onUpdateMisi={handleUpdateMisi}
          onDeleteMisi={handleDeleteMisi}
          onToggleMisiStatus={handleToggleMisiStatus}
          onAddCsrProgram={handleAddCsrProgram}
          onUpdateCsrProgram={handleUpdateCsrProgram}
          onDeleteCsrProgram={handleDeleteCsrProgram}
          inisiatifList={omsList}
          onAddInisiatif={handleAddInisiatif}
          onUpdateInisiatif={handleUpdateInisiatif}
          onDeleteInisiatif={handleDeleteInisiatif}
          onGoToPortal={() => setActiveTab('rembuk')}
          onOpenFormAspirasi={() => setIsFormAspirasiOpen(true)}
        />
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
          {/* Tab: Halaman Login */}
          {activeTab === 'login' && (
            <LoginPage
              usersList={usersList}
              onLoginSuccess={handleLoginSuccess}
              onBackToPortal={() => setActiveTab('rembuk')}
            />
          )}

          {/* Tab 1: Rembuk & Aspirasi Partisipatif */}
          {activeTab === 'rembuk' && (
            <div className="space-y-12">
              {/* Komponen Peta Interaktif Geospasial Sebaran Aspirasi Tanggamus */}
              <PetaAspirasiTanggamus
                aspirasiList={aspirasiList}
                onSelectAspirasi={(item) => setSelectedAspirasi(item)}
                onFilterKecamatanChange={(kec) => {
                  setSelectedKecamatanFilter(kec);
                  showToast(`Menyaring daftar aspirasi untuk ${kec}`);
                  const el = document.getElementById('daftar-aspirasi');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                onOpenFormAspirasiWithKecamatan={(kec) => {
                  setFormDefaultKecamatan(kec);
                  setIsFormAspirasiOpen(true);
                  showToast(`Membuka formulir pengajuan aspirasi untuk ${kec}`);
                }}
                onVoteAspirasi={handleVote}
              />

              <AspirasiList
                aspirasi={aspirasiList}
                onVote={handleVote}
                onSelectAspirasi={(item) => setSelectedAspirasi(item)}
                onOpenForm={() => {
                  setFormDefaultKecamatan(undefined);
                  setIsFormAspirasiOpen(true);
                }}
                filterPillar={filterPillar}
                setFilterPillar={setFilterPillar}
                filterKecamatan={selectedKecamatanFilter}
                setFilterKecamatan={setSelectedKecamatanFilter}
              />
              <SimulasiPrioritas />
            </div>
          )}

          {/* Tab 2: Kemitraan Swasta & CSR */}
          {activeTab === 'csr' && (
            <KemitraanCsrView
              csrPrograms={csrPrograms}
              onCommitCSR={handleCommitCSR}
            />
          )}

          {/* Tab 3: Riset & Rekomendasi Akademisi */}
          {activeTab === 'riset' && (
            <RisetAkademisiView
              risetList={risetList}
              onSubmitRiset={handleSubmitRiset}
              openSubmitModal={isRisetModalOpen}
              onCloseSubmitModal={() => setIsRisetModalOpen(false)}
            />
          )}

          {/* Tab 4: Inisiatif & Advokasi OMS */}
          {activeTab === 'oms' && (
            <InisiatifOmsView
              omsList={omsList}
              onAddInisiatif={handleAddInisiatif}
              openSubmitModal={isOmsModalOpen}
              onCloseSubmitModal={() => setIsOmsModalOpen(false)}
            />
          )}

          {/* Tab 5: Konsultasi Publik & Uji Bab RPJMD */}
          {activeTab === 'konsultasi' && (
            <KonsultasiPublikView
              agendaList={agendaList}
              babList={babList}
              kehadiranList={kehadiranList}
              onAddCatatanBab={handleAddCatatanBab}
              onAddKehadiran={handleAddKehadiran}
            />
          )}

          {/* Tab 6: Dashboard Statistik & Transparansi Sinergi */}
          {activeTab === 'dashboard' && (
            <StatistikDashboard
              onExportCSV={handleExportCSV}
              onPrintReport={handlePrintReport}
            />
          )}
        </main>
      )}

      {/* Detailed Modal for Aspiration View */}
      {selectedAspirasi && (
        <AspirasiModal
          item={selectedAspirasi}
          onClose={() => setSelectedAspirasi(null)}
          onVote={handleVote}
          onAddComment={handleAddComment}
        />
      )}

      {/* Modal for Submitting New Aspiration */}
      <FormAspirasiModal
        isOpen={isFormAspirasiOpen}
        onClose={() => {
          setIsFormAspirasiOpen(false);
          setFormDefaultKecamatan(undefined);
        }}
        onSubmit={handleAddAspirasi}
        defaultKecamatan={formDefaultKecamatan}
      />

      {/* Footer */}
      {activeTab !== 'user_dashboard' && (
        <Footer
          setActiveTab={setActiveTab}
          onOpenForm={() => setIsFormAspirasiOpen(true)}
        />
      )}
    </div>
  );
}
