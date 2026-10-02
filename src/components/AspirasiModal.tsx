import React, { useState } from 'react';
import { AspirasiPublik, StakeholderType } from '../types';
import { MISI_LABELS } from '../data/mockData';

interface AspirasiModalProps {
  item: AspirasiPublik | null;
  onClose: () => void;
  onVote: (id: string) => void;
  onAddComment: (aspirasiId: string, nama: string, institusi: string, tipe: StakeholderType, isi: string) => void;
}

export const AspirasiModal: React.FC<AspirasiModalProps> = ({
  item,
  onClose,
  onVote,
  onAddComment,
}) => {
  const [commentNama, setCommentNama] = useState('');
  const [commentInstitusi, setCommentInstitusi] = useState('');
  const [commentTipe, setCommentTipe] = useState<StakeholderType>('masyarakat');
  const [commentIsi, setCommentIsi] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  if (!item) return null;

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentNama.trim() || !commentIsi.trim()) return;
    setIsSubmittingComment(true);
    setTimeout(() => {
      onAddComment(item.id, commentNama, commentInstitusi, commentTipe, commentIsi);
      setCommentIsi('');
      setIsSubmittingComment(false);
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
            <span>ID: {item.id}</span>
            <span aria-hidden="true">•</span>
            <span>{MISI_LABELS[item.misiId]?.nomor} RPJMD</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer text-base leading-none"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600">
            <span className="font-semibold text-emerald-900 uppercase tracking-wide">
              {item.tipePemangku === 'masyarakat' ? 'Aspirasi Warga' :
                item.tipePemangku === 'swasta' ? 'Kemitraan Swasta/CSR' :
                item.tipePemangku === 'akademisi' ? 'Kajian Akademisi' : 'Inisiatif OMS'}
            </span>
            <span aria-hidden="true">•</span>
            <span>{item.kecamatan}{item.pekon ? ` / ${item.pekon}` : ''}</span>
            <span aria-hidden="true">•</span>
            <span className="font-mono tabular-nums">{item.tanggalDiajukan}</span>
            <span aria-hidden="true">•</span>
            <span className="font-semibold text-stone-800">
              {item.status === 'masuk_rkpd' ? '✓ Masuk RKPD' :
                item.status === 'sinergi_csr' ? '✓ Kemitraan CSR' : 'Sedang Ditelaah'}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-serif font-bold text-stone-900 leading-snug">
            {item.judul}
          </h2>

          {/* Pengusul Profile */}
          <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200/70 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-stone-500">Diusulkan oleh:</p>
              <p className="font-bold text-stone-800 text-sm">{item.pengusulNama}</p>
              {item.pengusulInstitusi && (
                <p className="text-stone-600">{item.pengusulInstitusi}</p>
              )}
            </div>
            <button
              onClick={() => onVote(item.id)}
              className={`self-start sm:self-center px-4 py-2 rounded-md border text-xs font-semibold transition-colors cursor-pointer ${
                item.hasVoted
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-white text-stone-800 border-stone-300 hover:bg-stone-100'
              }`}
            >
              ▲ Dukung Usulan Ini <span className="font-mono tabular-nums">({item.dukunganSuara})</span>
            </button>
          </div>

          {/* Lokus Geografis Spesifik (Kecamatan, Pekon, Detail Alamat) */}
          {(item.pekon || item.detailAlamat || item.kecamatan) && (
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/80 text-xs flex items-start gap-2.5">
              <span className="text-emerald-800 font-bold mt-0.5">📍</span>
              <div className="space-y-0.5">
                <span className="font-semibold text-stone-800">Lokus Geografis Tanggamus: </span>
                <span className="text-stone-700">{item.kecamatan}</span>
                {item.pekon && <span className="text-emerald-800 font-medium"> • {item.pekon}</span>}
                {item.detailAlamat && (
                  <p className="text-stone-500 text-[11px] pt-0.5 italic">
                    Detail Alamat: {item.detailAlamat}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Deskripsi Lengkap */}
          <div>
            <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-2">
              Uraian Masalah & Usulan Solusi
            </h4>
            <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
              {item.deskripsiLengkap}
            </p>
          </div>

          {/* Estimasi Anggaran & Bentuk Kolaborasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-200">
            {item.anggaranEstimasi && (
              <div>
                <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">Estimasi Kebutuhan / Skema</p>
                <p className="text-xs font-semibold text-stone-800 mt-1">{item.anggaranEstimasi}</p>
              </div>
            )}
            {item.bentukKolaborasiDitawarkan && (
              <div>
                <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">Komitmen Sinergi Pengusul</p>
                <p className="text-xs text-stone-700 mt-1 italic">{item.bentukKolaborasiDitawarkan}</p>
              </div>
            )}
          </div>

          {/* Tanggapan Resmi OPD / Perangkat Daerah */}
          <div className="pt-4 border-t border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                Tanggapan Resmi Perangkat Daerah (OPD)
              </h4>
              <span className="text-[11px] text-stone-500">Transparansi Penelaahan</span>
            </div>

            {item.tanggapanOPD && item.tanggapanOPD.length > 0 ? (
              <div className="space-y-3">
                {item.tanggapanOPD.map((tgp) => (
                  <div key={tgp.id} className="p-4 bg-emerald-50/60 rounded-lg border border-emerald-200/80">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-emerald-950 font-semibold mb-1">
                      <span>{tgp.opdNama}</span>
                      <span className="text-stone-500 font-mono text-[11px]">{tgp.tanggal}</span>
                    </div>
                    <p className="text-xs text-stone-600 mb-2">
                      {tgp.pejabatNama} • <span className="italic">{tgp.pejabatJabatan}</span>
                    </p>
                    <p className="text-xs text-stone-800 leading-relaxed">
                      "{tgp.isiTanggapan}"
                    </p>
                    {tgp.rencanaAksiTahun && (
                      <div className="mt-2 text-[11px] text-emerald-800 font-medium font-mono">
                        Target Masuk Dokumen Perencanaan: RKPD Tahun {tgp.rencanaAksiTahun}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-500 italic p-3 bg-stone-50 rounded border border-stone-200">
                Usulan telah diteruskan ke OPD teknis terkait untuk verifikasi lapangan dan sinkronisasi renja.
              </p>
            )}
          </div>

          {/* Diskusi Publik Multipihak */}
          <div className="pt-4 border-t border-stone-200 space-y-4">
            <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
              Forum Diskusi Publik ({item.komentarPublik.length} Komentar)
            </h4>

            {item.komentarPublik.length > 0 && (
              <div className="space-y-2.5">
                {item.komentarPublik.map((kom) => (
                  <div key={kom.id} className="p-3 bg-stone-50 rounded border border-stone-200/80 text-xs">
                    <div className="flex items-center justify-between text-stone-500 mb-1">
                      <span className="font-semibold text-stone-800">
                        {kom.nama} {kom.institusi && `(${kom.institusi})`}
                      </span>
                      <span className="font-mono text-[11px]">{kom.tanggal}</span>
                    </div>
                    <p className="text-stone-700 leading-normal">{kom.isi}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Form Tambah Komentar */}
            <form onSubmit={handleSubmitComment} className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-3">
              <p className="text-xs font-semibold text-stone-800">Tulis Tanggapan / Dukungan Anda</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  required
                  value={commentNama}
                  onChange={(e) => setCommentNama(e.target.value)}
                  placeholder="Nama Lengkap *"
                  className="bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
                <input
                  type="text"
                  value={commentInstitusi}
                  onChange={(e) => setCommentInstitusi(e.target.value)}
                  placeholder="Instansi / Komunitas (Opsional)"
                  className="bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
                <select
                  value={commentTipe}
                  onChange={(e) => setCommentTipe(e.target.value as StakeholderType)}
                  className="bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                >
                  <option value="masyarakat">Warga Masyarakat</option>
                  <option value="swasta">Dunia Usaha / Bisnis</option>
                  <option value="akademisi">Akademisi / Peneliti</option>
                  <option value="oms">Organisasi Masyarakat Sipil</option>
                </select>
              </div>
              <textarea
                required
                rows={2}
                value={commentIsi}
                onChange={(e) => setCommentIsi(e.target.value)}
                placeholder="Tuliskan argumen dukungan, masukan teknis, atau penawaran kerja sama..."
                className="w-full bg-white border border-stone-300 rounded px-2.5 py-2 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmittingComment}
                  className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
                >
                  {isSubmittingComment ? 'Mengirim...' : 'Kirim Tanggapan'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-white border border-stone-300 rounded-md transition-colors cursor-pointer"
          >
            Tutup Dialog
          </button>
        </div>
      </div>
    </div>
  );
};
