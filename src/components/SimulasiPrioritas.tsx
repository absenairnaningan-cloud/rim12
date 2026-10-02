import React, { useState } from 'react';
import { INITIAL_PRIORITAS_DATA } from '../data/mockData';

export const SimulasiPrioritas: React.FC = () => {
  const [prioritas, setPrioritas] = useState(INITIAL_PRIORITAS_DATA);
  const [hasVoted, setHasVoted] = useState(false);
  const [voterCount, setVoterCount] = useState(12840);

  const totalUserWeight = prioritas.reduce((acc, curr) => acc + curr.bobot, 0);

  const handleSliderChange = (id: string, newVal: number) => {
    setPrioritas((prev) =>
      prev.map((item) => (item.id === id ? { ...item, bobot: newVal } : item))
    );
  };

  const handleVoteSubmit = () => {
    setPrioritas((prev) =>
      prev.map((item) => {
        const updatedConsensus = Number(
          ((item.konsensusWarga * voterCount + item.bobot) / (voterCount + 1)).toFixed(1)
        );
        return {
          ...item,
          konsensusWarga: updatedConsensus,
        };
      })
    );
    setVoterCount((prev) => prev + 1);
    setHasVoted(true);
  };

  return (
    <div id="simulasi-prioritas" className="bg-white rounded-xl border border-stone-200 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 uppercase tracking-wider mb-1">
            <span>Rembuk Alokasi Anggaran Partisipatif</span>
            <span aria-hidden="true">•</span>
            <span>Citizen Priority Budgeting Tanggamus</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight">
            Simulasi Pembobotan Prioritas Pembangunan Daerah
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
            Jika Anda memiliki wewenang menentukan fokus pembangunan 5 tahun ke depan, sektor mana yang paling mendesak dibesarkan alokasinya? Geser pengatur bobot di bawah dan bandingkan dengan suara ribuan warga lainnya.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-stone-500 font-mono">Total Partisipan Warga</p>
          <p className="text-2xl font-serif font-bold text-stone-900 font-mono tabular-nums">
            {voterCount.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {prioritas.map((item) => (
          <div key={item.id} className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-900">{item.label}</span>
              <div className="flex items-center gap-3 font-mono">
                <span className="text-emerald-900 font-bold tabular-nums">
                  Pilihan Anda: {item.bobot}%
                </span>
                <span className="text-stone-400">|</span>
                <span className="text-stone-600 tabular-nums">
                  Publik: {item.konsensusWarga}%
                </span>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="0"
              max="50"
              value={item.bobot}
              onChange={(e) => handleSliderChange(item.id, Number(e.target.value))}
              className="w-full accent-emerald-800 cursor-pointer h-1.5 bg-stone-300 rounded-lg"
            />

            {/* Visual Comparative Bar */}
            <div className="space-y-1 pt-1 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-20 text-stone-500 shrink-0">Usulan Anda:</span>
                <div className="flex-1 bg-stone-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-800 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(item.bobot * 2, 100)}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-20 text-stone-500 shrink-0">Rata-rata:</span>
                <div className="flex-1 bg-stone-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-stone-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(item.konsensusWarga * 2, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action and Summary */}
      <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs">
          <span className="text-stone-600">Total Akumulasi Pembobotan Anda:</span>
          <span
            className={`font-mono font-bold text-sm tabular-nums ${
              totalUserWeight === 100 ? 'text-emerald-800' : 'text-amber-800'
            }`}
          >
            {totalUserWeight}% {totalUserWeight === 100 ? '(Pas 100%)' : '(Idealnya pas 100%)'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {hasVoted ? (
            <span className="text-xs text-emerald-900 font-bold font-mono">
              ✓ Pilihan Anda telah tercatat ke basis konsensus warga Bapperida!
            </span>
          ) : (
            <button
              onClick={handleVoteSubmit}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-950 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Kirimkan Suara Prioritas Saya
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
