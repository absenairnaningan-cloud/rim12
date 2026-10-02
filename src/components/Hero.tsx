import React from 'react';
import heroImg from '../assets/images/hero_rpjmd_forum_1790917456565.jpg';

interface HeroProps {
  onOpenFormAspirasi: () => void;
  onExploreAspirasi: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenFormAspirasi, onExploreAspirasi }) => {
  return (
    <section className="relative bg-stone-100/70 border-b border-stone-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Editorial Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold tracking-wider text-emerald-900 uppercase">
              <img
                src="/logo_warung_rimbun.jpg"
                alt="Logo WARUNG RIMBUN"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-contain bg-white shadow-xs border border-emerald-300 p-0.5 shrink-0"
                referrerPolicy="no-referrer"
              />
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 font-mono text-[11px] font-bold border border-emerald-300">
                WARUNG RIMBUN
              </span>
              <span aria-hidden="true" className="hidden sm:inline">
                •
              </span>
              <span>Bapperida & Tim RPJMD Tanggamus</span>
              <span aria-hidden="true">•</span>
              <span>Periode 2025–2029</span>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight leading-[1.15]"
              style={{ textWrap: 'balance' }}
            >
              Wadah Urun Rembuk Perencanaan & Inovasi Pembangunan Daerah (WARUNG RIMBUN)
            </h1>

            <p className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-2xl">
              Melalui <strong className="text-emerald-950 font-semibold">WARUNG RIMBUN</strong>, Pemerintah Daerah memfasilitasi partisipasi kolaboratif multipihak: menjaring aspirasi warga, komitmen CSR dunia usaha, riset akademisi, dan inisiatif organisasi masyarakat sipil langsung ke dalam perencanaan teknis dokumen RPJMD dan RKPD tahunan.
            </p>

            {/* Micro Call-to-Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenFormAspirasi}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-900 hover:bg-emerald-950 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Sampaikan Aspirasi Anda
              </button>
              <button
                onClick={onExploreAspirasi}
                className="px-5 py-2.5 text-sm font-semibold text-stone-800 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg transition-colors cursor-pointer"
              >
                Telusuri 4.820+ Usulan
              </button>
            </div>

            {/* Authentic Tabular Numerals Strip */}
            <div className="pt-6 border-t border-stone-300/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">Aspirasi Masuk</p>
                <p className="text-2xl font-serif font-bold text-stone-900 font-mono tabular-nums">4.824</p>
                <p className="text-[11px] text-stone-500 mt-0.5">Dari 20 kecamatan</p>
              </div>
              <div>
                <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">Komitmen CSR</p>
                <p className="text-2xl font-serif font-bold text-emerald-900 font-mono tabular-nums">Rp 18,4 M</p>
                <p className="text-[11px] text-stone-500 mt-0.5">24 Entitas bisnis</p>
              </div>
              <div>
                <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">Kajian Kampus</p>
                <p className="text-2xl font-serif font-bold text-stone-900 font-mono tabular-nums">38</p>
                <p className="text-[11px] text-stone-500 mt-0.5">Naskah rekomendasi</p>
              </div>
              <div>
                <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">Respon OPD</p>
                <p className="text-2xl font-serif font-bold text-emerald-900 font-mono tabular-nums">89,2%</p>
                <p className="text-[11px] text-stone-500 mt-0.5">Terdisposisi teknis</p>
              </div>
            </div>
          </div>

          {/* Right: High-Fidelity Image Presentation with Editorial Caption */}
          <div className="lg:col-span-5">
            <div className="relative rounded-xl overflow-hidden border border-stone-300/90 shadow-md bg-stone-200">
              <img
                src={heroImg}
                alt="Sidang Konsultasi Publik RPJMD Multipihak"
                className="w-full h-72 sm:h-80 lg:h-96 object-cover"
                loading="eager"
              />
              <div className="p-3.5 bg-stone-900/90 text-white backdrop-blur-xs">
                <div className="flex items-center justify-between text-xs text-stone-300">
                  <span className="font-semibold text-emerald-300">Konsultasi Publik Multipihak</span>
                  <span className="font-mono tabular-nums">Aula Gedung Bapperida Tanggamus</span>
                </div>
                <p className="text-xs text-stone-200 mt-1 leading-snug">
                  Pertemuan koordinasi penyelarasan visi kepala daerah bersama perwakilan asosiasi usaha, rektorat, aktivis OMS, dan tokoh masyarakat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
