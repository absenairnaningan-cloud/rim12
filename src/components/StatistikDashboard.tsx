import React from 'react';

interface StatistikDashboardProps {
  onExportCSV: () => void;
  onPrintReport: () => void;
}

export const StatistikDashboard: React.FC<StatistikDashboardProps> = ({
  onExportCSV,
  onPrintReport,
}) => {
  const stakeholderDistribution = [
    { label: 'Masyarakat & Komunitas Warga', count: 2984, share: 61.8, trend: '+14% thd RPJMD lalu' },
    { label: 'Dunia Usaha & Asosiasi Bisnis', count: 684, share: 14.2, trend: '+28% thd RPJMD lalu' },
    { label: 'Akademisi & Peneliti Kampus', count: 576, share: 11.9, trend: '+35% thd RPJMD lalu' },
    { label: 'Organisasi Masyarakat Sipil (OMS)', count: 580, share: 12.1, trend: '+22% thd RPJMD lalu' },
  ];

  const opdPerformance = [
    { opd: 'Dinas Pekerjaan Umum & Penataan Ruang (PUPR)', masuk: 1240, ditelaah: 1180, masukRkpd: 342, rate: '95,1%' },
    { opd: 'Dinas Pendidikan dan Kebudayaan', masuk: 980, ditelaah: 920, masukRkpd: 288, rate: '93,8%' },
    { opd: 'Dinas Kesehatan & Pengendalian Penduduk', masuk: 860, ditelaah: 830, masukRkpd: 310, rate: '96,5%' },
    { opd: 'Dinas Lingkungan Hidup (DLH)', masuk: 720, ditelaah: 685, masukRkpd: 194, rate: '95,1%' },
    { opd: 'Dinas Koperasi, Perindustrian dan Perdagangan', masuk: 624, ditelaah: 590, masukRkpd: 215, rate: '94,5%' },
    { opd: 'Dinas Sosial Kabupaten Tanggamus', masuk: 400, ditelaah: 385, masukRkpd: 165, rate: '96,2%' },
  ];

  const macroIndicators = [
    { indicator: 'Indeks Pembangunan Manusia (IPM)', baseline2024: '74,80', target2029: '78,50', status: 'On Track' },
    { indicator: 'Tingkat Kemiskinan Makro', baseline2024: '8,42%', target2029: '5,10%', status: 'Akselerasi' },
    { indicator: 'Pertumbuhan Ekonomi Daerah', baseline2024: '5,28%', target2029: '6,20%', status: 'Moderat' },
    { indicator: 'Indeks Kualitas Lingkungan Hidup (IKLH)', baseline2024: '71,15', target2029: '76,00', status: 'On Track' },
    { indicator: 'Indeks Reformasi Birokrasi', baseline2024: 'BB (72,4)', target2029: 'A (82,0)', status: 'On Track' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-stone-200 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 uppercase tracking-wider mb-1">
            <span>Satu Data Perencanaan Pembangunan</span>
            <span aria-hidden="true">•</span>
            <span>Dashboard Akuntabilitas Partisipasi Publik Tanggamus</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
            Transparansi Data Sinergi & Penelaahan RPJMD
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
            Memonitor secara real-time bagaimana setiap masukan warga, proposal kemitraan swasta, kajian kampus, dan inisiatif sipil diproses oleh jajaran birokrasi pemerintah daerah.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={onExportCSV}
            className="px-3.5 py-2 text-xs font-semibold text-stone-800 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg transition-colors cursor-pointer"
          >
            Ekspor Data (CSV)
          </button>
          <button
            onClick={onPrintReport}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-950 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            Cetak Ringkasan Eksekutif
          </button>
        </div>
      </div>

      {/* Row 1: Distribution Across Stakeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white rounded-lg border border-stone-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif font-bold text-stone-900">
              Distribusi Partisipasi per Pilar Pemangku
            </h3>
            <span className="text-xs font-mono text-stone-500 tabular-nums">4.824 Total Input</span>
          </div>
          <div className="space-y-3 pt-2">
            {stakeholderDistribution.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-stone-800">{item.label}</span>
                  <div className="flex items-center gap-2 font-mono tabular-nums">
                    <span className="text-stone-900 font-bold">{item.count}</span>
                    <span className="text-stone-500">({item.share}%)</span>
                  </div>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-900 h-2 rounded-full"
                    style={{ width: `${item.share}%` }}
                  />
                </div>
                <div className="text-[11px] text-stone-400 font-mono text-right">
                  {item.trend}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Target Makro IKU RPJMD 2025-2029 */}
        <div className="lg:col-span-6 bg-white rounded-lg border border-stone-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif font-bold text-stone-900">
              Sasaran Makro IKU RPJMD 2025–2029
            </h3>
            <span className="text-xs font-mono text-emerald-900 font-semibold">RPJMD Baseline</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-mono">
                  <th className="pb-2 font-medium">Indikator Kinerja Utama (IKU)</th>
                  <th className="pb-2 font-medium text-right">2024</th>
                  <th className="pb-2 font-medium text-right">Target 2029</th>
                  <th className="pb-2 font-medium text-right">Proyeksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {macroIndicators.map((row, i) => (
                  <tr key={i} className="hover:bg-stone-50/50">
                    <td className="py-2.5 font-medium text-stone-800">{row.indicator}</td>
                    <td className="py-2.5 text-right font-mono tabular-nums text-stone-600">{row.baseline2024}</td>
                    <td className="py-2.5 text-right font-mono font-bold tabular-nums text-emerald-900">{row.target2029}</td>
                    <td className="py-2.5 text-right text-[11px] font-mono text-stone-700">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Row 2: OPD Response & Processing Table */}
      <div className="bg-white rounded-lg border border-stone-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-serif font-bold text-stone-900">
              Matriks Kinerja Respon Perangkat Daerah (OPD) atas Aspirasi Multipihak
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Rasio disposisi teknis dan penyerapan usulan ke dalam Rancangan Rencana Kerja Pemerintah Daerah (RKPD).
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-900 font-semibold tabular-nums">
            Rata-rata Respon: 95,2%
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 font-mono">
                <th className="p-3 font-semibold">Nama Instansi / OPD Teknis</th>
                <th className="p-3 font-semibold text-right">Total Masuk</th>
                <th className="p-3 font-semibold text-right">Tertelaah</th>
                <th className="p-3 font-semibold text-right">Diakomodasi RKPD</th>
                <th className="p-3 font-semibold text-right">Tingkat Respon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {opdPerformance.map((row, idx) => (
                <tr key={idx} className="hover:bg-stone-50">
                  <td className="p-3 font-medium text-stone-900">{row.opd}</td>
                  <td className="p-3 text-right font-mono tabular-nums text-stone-600">{row.masuk}</td>
                  <td className="p-3 text-right font-mono tabular-nums text-stone-800">{row.ditelaah}</td>
                  <td className="p-3 text-right font-mono font-bold tabular-nums text-emerald-900">{row.masukRkpd}</td>
                  <td className="p-3 text-right font-mono font-semibold tabular-nums text-stone-800">{row.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
