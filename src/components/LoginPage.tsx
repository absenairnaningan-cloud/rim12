import React, { useState } from 'react';
import { UserAccount } from '../types';

interface LoginPageProps {
  usersList?: UserAccount[];
  onLoginSuccess: (user: UserAccount) => void;
  onBackToPortal: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ usersList = [], onLoginSuccess, onBackToPortal }) => {
  const [email, setEmail] = useState('bidangpme@gmail.com');
  const [password, setPassword] = useState('pemerintah2026');
  const [selectedRole, setSelectedRole] = useState<'bapperida_admin' | 'bappeda_admin' | 'opd_verifikator' | 'pemangku_kepentingan'>('bapperida_admin');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Quick preset accounts for testing
  const presets = [
    {
      role: 'bapperida_admin' as const,
      name: 'Tim Bidang PME (Bapperida Tanggamus)',
      email: 'bidangpme@gmail.com',
      agency: 'Bapperida Tanggamus - Bidang PME',
      nip: '19840315 200801 1 003',
      desc: 'Administrator Perencanaan, Pengendalian & Evaluasi RPJMD'
    },
    {
      role: 'opd_verifikator' as const,
      name: 'Dra. Endang Sulistyowati, M.M.',
      email: 'verifikator.opd@daerah.go.id',
      agency: 'Dinas Koperasi, UKM, Perindustrian dan Perdagangan',
      nip: '19790512 200501 2 006',
      desc: 'Tim Verifikator Teknis Telaah Usulan OPD'
    },
    {
      role: 'pemangku_kepentingan' as const,
      name: 'Dr. Retno Wulandari',
      email: 'retno.akademisi@kampus.ac.id',
      agency: 'Pusat Studi Pembangunan LPPM Universitas',
      nip: 'NIDN: 0015088201',
      desc: 'Delegasi Akademisi / Peneliti & Mitra CSR'
    }
  ];

  const handleSelectPreset = (preset: typeof presets[0]) => {
    setEmail(preset.email);
    setSelectedRole(preset.role);
    setPassword('pemerintah2026');
    setErrorMsg('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Silakan lengkapi surel dan kata sandi Anda.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const fromDynamicList = usersList.find((u) => u.email.toLowerCase() === email.toLowerCase());
      const existing = fromDynamicList || presets.find((p) => p.email.toLowerCase() === email.toLowerCase());

      const accountData = existing || {
        role: selectedRole,
        name: email.split('@')[0].toUpperCase(),
        email: email,
        agency: selectedRole === 'bapperida_admin' || selectedRole === 'bappeda_admin' ? 'Bapperida Tanggamus' : selectedRole === 'opd_verifikator' ? 'Dinas Teknis Terkait' : 'Mitra Pemangku Kepentingan',
        nip: '19870101 201001 1 001',
        desc: 'Pengguna Terdaftar WARUNG RIMBUN'
      };

      const userAccount: UserAccount = {
        id: `USR-${Date.now().toString().slice(-4)}`,
        name: accountData.name,
        email: accountData.email,
        role: accountData.role,
        agency: accountData.agency,
        nip: accountData.nip,
        lastLogin: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB, ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      };

      setIsLoading(false);
      onLoginSuccess(userAccount);
    }, 600);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Return button */}
      <div className="mb-6">
        <button
          onClick={onBackToPortal}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 px-3 py-1.5 rounded-md transition-colors shadow-2xs cursor-pointer"
        >
          ← Kembali ke Portal Publik
        </button>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Editorial Banner */}
        <div className="lg:col-span-5 bg-stone-900 text-stone-200 p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-800">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img
                src="/logo_warung_rimbun.jpg"
                alt="Logo Resmi WARUNG RIMBUN"
                className="w-12 h-12 rounded-full object-contain bg-white p-0.5 border border-stone-700 shadow-md shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  WARUNG RIMBUN
                </div>
                <div className="text-xs text-stone-300">
                  Kabupaten Tanggamus
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-serif font-bold text-white tracking-tight mb-3">
              Portal Akses Terpadu Aparatur & Pemangku Kebijakan
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed">
              Wadah Urun Rembuk Perencanaan dan Inovasi Pembangunan – Kanal resmi penelaahan teknis OPD, validasi program Renja/RKPD, kurasi usulan CSR non-APBD, dan rekapitulasi berita acara Musrenbang Kabupaten Tanggamus.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-800/80 space-y-3">
            <div className="text-xs">
              <span className="text-stone-400 block text-[10px] uppercase font-mono">Keamanan & Otorisasi</span>
              <span className="text-stone-200 font-medium">Single Sign-On (SSO) Pemerintahan Terintegrasi</span>
            </div>
            <div className="text-xs">
              <span className="text-stone-400 block text-[10px] uppercase font-mono">Helpdesk Bapperida</span>
              <span className="text-stone-300 font-mono text-[11px]">bidangpme@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-serif font-bold text-stone-900">
                Masuk ke Dasbor Pengelola
              </h3>
              <span className="text-[11px] font-mono text-emerald-900 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Akses Terverifikasi
              </span>
            </div>

            {/* Quick Preset Selector for Easy Testing */}
            <div className="mb-5 bg-stone-50 p-3 rounded-lg border border-stone-200/90 text-xs">
              <span className="font-semibold text-stone-700 block mb-2 text-[11px] uppercase tracking-wide">
                Pilih Akun Percontohan (Demo Cepat):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.role}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-2 rounded text-left border transition-all cursor-pointer ${
                      selectedRole === preset.role && email === preset.email
                        ? 'bg-emerald-900 text-white border-emerald-950 font-medium'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <p className="font-bold text-[11px] leading-tight truncate">{preset.name.split('(')[0]}</p>
                    <p className={`text-[10px] truncate mt-0.5 ${selectedRole === preset.role && email === preset.email ? 'text-emerald-200' : 'text-stone-500'}`}>
                      {preset.role === 'bapperida_admin' ? 'Admin Bapperida PME' : preset.role === 'opd_verifikator' ? 'Verifikator OPD' : 'Akademisi / Mitra'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-800 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Alamat Surel (Email) Resmi *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@daerah.go.id atau email terdaftar"
                  className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-stone-700 font-semibold">Kata Sandi (Password) *</label>
                  <button
                    type="button"
                    onClick={() => alert('Fitur pemulihan kata sandi telah dikirimkan ke email terdaftar.')}
                    className="text-[11px] text-emerald-900 hover:underline cursor-pointer"
                  >
                    Lupa sandi?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Tingkat Wewenang / Peran Akses *
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as any)}
                  className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                >
                  <option value="bapperida_admin">Bapperida - Pengendalian, Monitoring & Evaluasi (PME)</option>
                  <option value="opd_verifikator">OPD / Dinas Teknis - Penelaah Rencana Kerja (Renja)</option>
                  <option value="pemangku_kepentingan">Pemangku Kepentingan - Mitra CSR / Kampus / OMS</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-emerald-900 hover:bg-emerald-950 text-white rounded font-semibold text-xs transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Mengotentikasi Akun...</span>
                    </>
                  ) : (
                    'Masuk ke Dasbor Kerja'
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="pt-6 border-t border-stone-200 mt-6 text-[11px] text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Bapperida Kabupaten Tanggamus • 2026</span>
            <span>Amanat UU No. 25/2004 tentang SPPN</span>
          </div>
        </div>
      </div>
    </div>
  );
};
