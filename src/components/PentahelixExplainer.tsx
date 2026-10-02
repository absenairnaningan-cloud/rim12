import React from 'react';
import { StakeholderType } from '../types';

interface PentahelixExplainerProps {
  onSelectPillar?: (pillar: StakeholderType) => void;
  onNavigatePillar: (pillar: 'masyarakat' | 'swasta' | 'akademisi' | 'oms') => void;
  onQuickAction?: (pillar: 'masyarakat' | 'swasta' | 'akademisi' | 'oms') => void;
}

export const PentahelixExplainer: React.FC<PentahelixExplainerProps> = ({
  onSelectPillar,
  onNavigatePillar,
  onQuickAction,
}) => {
  const handlePrimaryClick = (id: 'masyarakat' | 'swasta' | 'akademisi' | 'oms') => {
    onNavigatePillar(id);
    if (onSelectPillar) {
      onSelectPillar(id as StakeholderType);
    }
  };

  const pillars = [
    {
      id: 'masyarakat' as const,
      title: 'Masyarakat & Warga',
      role: 'Kekuatan Demokrasi & Pengawal Kebutuhan Riil',
      deskripsi: 'Menyampaikan kebutuhan langsung dari akar rumput, pekon, RT/RW, kelompok pemuda, dan perempuan melalui rembuk warga dan survei kepuasan.',
      output: 'Usulan program kewilayahan, aduan kualitas layanan, dan partisipasi gotong royong.',
      badgeText: '4.824 Usulan Warga',
      badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      ctaText: 'Lihat Usulan Warga',
      quickActionText: '+ Sampaikan Aspirasi Baru',
      hint: 'Buka kanal usulan warga di ruang rembuk',
    },
    {
      id: 'swasta' as const,
      title: 'Dunia Usaha & Industri',
      role: 'Akselerator Ekonomi, Investasi & CSR',
      deskripsi: 'Mendorong pertumbuhan sektor produktif, penyediaan lapangan kerja, pembiayaan kreatif non-APBD melalui TJSLP/CSR, serta skema KPBU.',
      output: 'Pemberdayaan vokasi kerja, revitalisasi fasilitas publik, dan kemitraan rantai pasok UMKM.',
      badgeText: 'Rp 18,4 M Komitmen',
      badgeClass: 'bg-blue-100 text-blue-900 border-blue-300',
      ctaText: 'Bursa Kemitraan CSR',
      quickActionText: '+ Ajukan Kemitraan CSR',
      hint: 'Buka bursa pembiayaan proyek non-APBD',
    },
    {
      id: 'akademisi' as const,
      title: 'Akademisi & Peneliti',
      role: 'Landasan Ilmiah & Kebijakan Berbasis Bukti',
      deskripsi: 'Menyediakan kajian empiris (evidence-based policy), evaluasi dampak program, pemodelan geospasial, dan transfer teknologi terapan bagi daerah.',
      output: 'Naskah akademik (Policy Brief), riset aksi partisipatif, dan pengabdian masyarakat tematik.',
      badgeText: '38 Policy Brief',
      badgeClass: 'bg-purple-100 text-purple-900 border-purple-300',
      ctaText: 'Kajian Ilmiah',
      quickActionText: '+ Unggah Policy Brief Kampus',
      hint: 'Buka repositori riset kebijakan daerah',
    },
    {
      id: 'oms' as const,
      title: 'Organisasi Masyarakat Sipil',
      role: 'Penjaga Inklusi, Keadilan Sosial & Akuntabilitas',
      deskripsi: 'Mengadvokasi hak kelompok rentan (disabilitas, perempuan, anak, lansia, masyarakat adat) serta memastikan tata kelola yang transparan dan bersih.',
      output: 'Pemantauan independen, sekolah inklusi, pendampingan hukum, dan aksi lingkungan berbasis komunitas.',
      badgeText: '19 Inisiatif Komunitas',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
      ctaText: 'Inisiatif Sipil',
      quickActionText: '+ Daftarkan Inisiatif Komunitas',
      hint: 'Buka ruang advokasi & aksi masyarakat sipil',
    },
  ];

  return (
    <section className="bg-white border-b border-stone-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 uppercase tracking-wider mb-1">
            <span>Kerangka Kerja Pentahelix</span>
            <span aria-hidden="true">•</span>
            <span>Amanat Permendagri No. 86/2017</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Empat Pilar Sinergi Pembangunan Daerah
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2 leading-relaxed">
            Pembangunan tidak lagi dapat dijalankan secara eksklusif oleh birokrasi pemerintah. WARUNG RIMBUN mengintegrasikan empat kanal partisipasi strategis agar setiap kontribusi langsung bermuara pada program nyata daerah.
          </p>
        </div>

        {/* 4 Pilar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => (
            <div
              key={item.id}
              className="p-5 rounded-xl border border-stone-200 bg-stone-50/60 hover:bg-stone-50/90 hover:border-emerald-300/80 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-mono text-stone-400 font-semibold">0{idx + 1}</span>
                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${item.badgeClass}`}>
                    {item.badgeText}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-stone-900 font-serif mb-1 group-hover:text-emerald-950 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs font-semibold text-emerald-800 mb-2.5">
                  {item.role}
                </p>

                <p className="text-xs text-stone-600 leading-relaxed mb-3">
                  {item.deskripsi}
                </p>

                <div className="pt-3 border-t border-stone-200/80 mb-5">
                  <p className="text-[11px] text-stone-500 font-medium">Bentuk Kontribusi Nyata:</p>
                  <p className="text-xs text-stone-700 mt-0.5 italic">{item.output}</p>
                </div>
              </div>

              {/* Action Buttons Group */}
              <div className="space-y-2 pt-2 border-t border-stone-200/60">
                <button
                  type="button"
                  onClick={() => handlePrimaryClick(item.id)}
                  title={item.hint}
                  className="w-full py-2.5 px-3.5 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-950 active:bg-emerald-900 rounded-lg transition-colors flex items-center justify-between shadow-2xs cursor-pointer group-hover:shadow-xs"
                >
                  <span>{item.ctaText}</span>
                  <span className="font-sans text-emerald-200 group-hover:translate-x-0.5 transition-transform">→</span>
                </button>
                {onQuickAction && (
                  <button
                    type="button"
                    onClick={() => onQuickAction(item.id)}
                    className="w-full py-1.5 px-2 text-[11px] font-medium text-stone-600 hover:text-emerald-900 hover:bg-emerald-50/70 border border-dashed border-stone-300 hover:border-emerald-300 rounded transition-colors text-center cursor-pointer block"
                  >
                    {item.quickActionText}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
