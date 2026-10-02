import React from 'react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenForm: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenForm }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Brand & Mandate */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo_warung_rimbun.jpg"
                alt="Logo Resmi WARUNG RIMBUN Kabupaten Tanggamus"
                className="w-9 h-9 rounded-full object-contain bg-white p-0.5 border border-stone-700 shadow-xs shrink-0"
                referrerPolicy="no-referrer"
              />
              <h4 className="text-xl font-serif font-bold text-white tracking-tight">
                WARUNG RIMBUN
              </h4>
            </div>
            <p className="text-xs text-stone-300 font-medium">
              Wadah Urun Rembuk Perencanaan dan Inovasi Pembangunan
            </p>
            <p className="text-xs text-stone-400 leading-relaxed">
              Portal Komunikasi Publik Partisipatif & Pengawalan Dokumen Rencana Pembangunan Jangka Menengah Daerah 2025–2029 Kabupaten Tanggamus.
            </p>
            <p className="text-[11px] text-stone-500 font-mono pt-2">
              Berlandaskan UU No. 25/2004 & Permendagri No. 86/2017 tentang Tata Cara Perencanaan, Pengendalian, dan Evaluasi Pembangunan Daerah.
            </p>
          </div>

          {/* Column 2: Kanal Partisipasi */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold text-white uppercase tracking-wider">
              Kanal Pemangku Kepentingan
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('rembuk')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Aspirasi & Rembuk Warga
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('csr')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Bursa Kemitraan CSR Swasta
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('riset')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Repository Policy Brief Kampus
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('oms')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Advokasi Organisasi Masyarakat Sipil
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('konsultasi')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Uji Publik Naskah RPJMD
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('login')}
                  className="text-stone-400 hover:text-emerald-300 transition-colors text-left font-mono cursor-pointer"
                >
                  Akses Masuk Aparatur (Login) →
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Kontak Bapperida & Sekretariat */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold text-white uppercase tracking-wider">
              Sekretariat Tim Penyusun RPJMD
            </h5>
            <div className="space-y-1.5 text-xs text-stone-400">
              <p className="text-stone-300 font-medium">Badan Perencanaan Pembangunan, Riset dan Inovasi Daerah (BAPPERIDA) Kabupaten Tanggamus</p>
              <p>Komplek Perkantoran Pemerintah Daerah Kabupaten Tanggamus Jl. Jend. A. Yani No. 1 Kota Agung Timur, Kabupaten Tanggamus, Lampung</p>
              <p>Email: <span className="text-stone-300 font-mono">bapperida@tanggamus.go.id</span></p>
              <p>Web: <span className="text-stone-300 font-mono">bapperida.tanggamus.go.id</span></p>
              <p>Layanan Pengaduan Partisipasi: <span className="text-stone-300 font-mono">Telp. (0722) 21843</span></p>
              <p>Hari & Jam Kerja: Senin - Jumat, 08.00 - 16.00 WIB</p>
            </div>
          </div>

          {/* Column 4: Quick Action & Transparency */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold text-white uppercase tracking-wider">
              Aksi Langsung
            </h5>
            <p className="text-xs text-stone-400 leading-relaxed">
              Punya ide konkret untuk kemajuan lingkungan atau sektor Anda? Salurkan langsung ke buku kendali bapperida.
            </p>
            <button
              onClick={onOpenForm}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded transition-colors text-center cursor-pointer shadow-xs"
            >
              + Buat Usulan Pembangunan
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 Pemerintah Daerah Kabupaten Tanggamus & Tim Koordinasi Penyelarasan RPJMD. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-4 text-stone-400">
            <span>Keterbukaan Informasi Publik</span>
            <span>•</span>
            <span>Satu Data Indonesia</span>
            <span>•</span>
            <span>PPID Daerah</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
