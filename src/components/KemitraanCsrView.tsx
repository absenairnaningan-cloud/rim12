import React, { useState } from 'react';
import { KemitraanCSR } from '../types';
import panduImg from '../assets/images/pandu.jpg';

interface KemitraanCsrViewProps {
  csrPrograms: KemitraanCSR[];
  onCommitCSR: (programId: string, namaPerusahaan: string, nilaiKomitmen: string, bentukDukungan: string) => void;
}

export const KemitraanCsrView: React.FC<KemitraanCsrViewProps> = ({
  csrPrograms,
  onCommitCSR,
}) => {
  const [selectedProgram, setSelectedProgram] = useState<KemitraanCSR | null>(null);
  const [showCommitModal, setShowCommitModal] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [commitAmount, setCommitAmount] = useState('');
  const [supportType, setSupportType] = useState('Dana CSR / TJSLP');
  const [notes, setNotes] = useState('');
  const [isCommittedSuccess, setIsCommittedSuccess] = useState(false);

  const handleOpenCommit = (prog: KemitraanCSR) => {
    setSelectedProgram(prog);
    setShowCommitModal(true);
    setIsCommittedSuccess(false);
  };

  const handleCommitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgram || !companyName.trim()) return;

    onCommitCSR(selectedProgram.id, companyName, commitAmount, supportType);
    setIsCommittedSuccess(true);
    setTimeout(() => {
      setShowCommitModal(false);
      setIsCommittedSuccess(false);
      setCompanyName('');
      setContactPerson('');
      setCommitAmount('');
      setNotes('');
    }, 1500);
  };

  return (
    <div id="kemitraan-csr" className="space-y-8 scroll-mt-24">
      {/* Editorial Header */}
      <div className="pb-4 border-b border-stone-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 uppercase tracking-wider mb-1">
          <span>Kanal Sinergi Swasta & Industri</span>
          <span aria-hidden="true">•</span>
          <span>Forum Tanggung Jawab Sosial Lingkungan Perusahaan (TJSLP) Tanggamus</span>
        </div>
        <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
          Bursa Kemitraan Strategis Dunia Usaha & CSR Daerah
        </h2>
        <p className="text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
          Pemerintah Daerah membuka ruang kolaborasi pembiayaan kreatif non-APBD melalui sinergi TJSLP, adopsi fasilitas umum, serta KPBU. Dunia usaha dapat langsung memilih proyek prioritas RPJMD yang selaras dengan nilai ESG (Environmental, Social, Governance) perusahaan.
        </p>
      </div>

      {/* Featured Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 rounded-xl border border-stone-300/80 bg-white overflow-hidden shadow-xs items-center">
        <div className="lg:col-span-6 relative bg-stone-100/80 flex items-center justify-center p-3 sm:p-4.5 overflow-hidden">
          <img
            src={panduImg}
            alt="Kolaborasi Pemerintah dan Dunia Usaha"
            className="w-full h-auto max-h-[380px] object-contain rounded-lg shadow-xs"
          />
        </div>
        <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
              <span>SK Walikota/Bupati No. 188/2025</span>
              <span aria-hidden="true">•</span>
              <span>Matching Grant APBD-CSR</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-stone-900">
              Prinsip Kemitraan: Akuntabel, Tepat Sasaran, & Bebas Tumpang Tindih
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Setiap rupiah dana CSR yang disalurkan melalui sistem ini didampingi langsung oleh OPD teknis, memiliki target lokasi berbasis data spasial kemiskinan dan lingkungan, serta mendapatkan sertifikat apresiasi resmi daerah dan insentif kemudahan perizinan terpadu.
            </p>
          </div>

          <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center gap-6 text-xs text-stone-700">
            <div>
              <p className="text-stone-400 font-medium uppercase text-[10px]">Total Komitmen Masuk</p>
              <p className="text-lg font-bold font-mono text-emerald-900 tabular-nums">Rp 18,45 Miliar</p>
            </div>
            <div>
              <p className="text-stone-400 font-medium uppercase text-[10px]">Entitas Korporasi Terlibat</p>
              <p className="text-lg font-bold font-mono text-stone-900 tabular-nums">48 Perusahaan</p>
            </div>
            <div>
              <p className="text-stone-400 font-medium uppercase text-[10px]">Penyaluran Tepat Sasaran</p>
              <p className="text-lg font-bold font-mono text-emerald-900 tabular-nums">100% Terverifikasi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Directory of Priority CSR Projects */}
      <div id="katalog-csr-proyek" className="space-y-4 scroll-mt-24">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif font-bold text-stone-900">
            Katalog Proyek Terbuka Kemitraan RPJMD 2025–2029
          </h3>
          <span className="text-xs text-stone-500 font-mono tabular-nums">
            {csrPrograms.length} Program Prioritas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {csrPrograms.map((prog) => (
            <div
              key={prog.id}
              className="p-5 bg-white rounded-lg border border-stone-200 hover:border-stone-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Metadata */}
                <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                  <span className="font-semibold text-emerald-900">{prog.bidang}</span>
                  <span aria-hidden="true">•</span>
                  <span>OPD: {prog.opdPendamping}</span>
                  <span aria-hidden="true">•</span>
                  <span className="font-mono text-stone-600">
                    {prog.status === 'terbuka' ? 'Terbuka Kemitraan' :
                      prog.status === 'proses_mou' ? 'Tahap Penyusunan MoU' : 'Berjalan'}
                  </span>
                </div>

                <h4 className="text-base font-serif font-bold text-stone-900 leading-snug mb-2">
                  {prog.namaProgram}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  {prog.deskripsi}
                </p>

                {/* Target Lokasi & Impact */}
                <div className="p-3 bg-stone-50 rounded border border-stone-200/60 text-xs space-y-1.5 mb-4">
                  <div>
                    <span className="text-stone-500 font-medium">Lokus Wilayah: </span>
                    <span className="text-stone-800">{prog.targetLokasi}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 font-medium">Indikator Dampak: </span>
                    <span className="text-emerald-900 font-medium">{prog.impactMetrics}</span>
                  </div>
                </div>

                {/* Progress Bar & Funding Numbers */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500">Target Kebutuhan: <strong className="text-stone-800 font-mono">{prog.kebutuhanEstimasi}</strong></span>
                    <span className="font-mono text-emerald-900 font-semibold tabular-nums">{prog.persentaseTercapai}%</span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-800 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(prog.persentaseTercapai, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono">
                    <span>Terkumpul: {prog.komitmenTerkumpul}</span>
                    <span>Status: {prog.persentaseTercapai >= 100 ? 'Target Terpenuhi' : 'Membutuhkan Mitra'}</span>
                  </div>
                </div>

                {/* Mitra Korporasi */}
                <div className="text-xs mb-4">
                  <span className="text-stone-500 font-medium">Mitra Bergabung: </span>
                  <span className="text-stone-800 italic">
                    {prog.mitraBergabung.length > 0 ? prog.mitraBergabung.join(', ') : 'Belum ada (Jadilah mitra perdana)'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleOpenCommit(prog)}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-950 rounded transition-colors text-center cursor-pointer shadow-xs"
              >
                + Ajukan Minat Kemitraan (LoI)
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Dialog for Commitment / LoI */}
      {showCommitModal && selectedProgram && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-emerald-900 font-semibold uppercase tracking-wider">
                  Surat Minat Kerjasama (Letter of Intent)
                </span>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  {selectedProgram.namaProgram}
                </h3>
              </div>
              <button
                onClick={() => setShowCommitModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {isCommittedSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-lg font-bold">
                  ✓
                </div>
                <h4 className="text-lg font-serif font-bold text-stone-900">
                  Pernyataan Minat Diterima!
                </h4>
                <p className="text-xs text-stone-600">
                  Sekretariat Forum CSR Bapperida Tanggamus akan segera menghubungi narahubung perusahaan Anda untuk penjadwalan pembahasan teknis MoU.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCommitSubmit} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nama Badan Usaha / Perusahaan / BUMN / BUMD *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Contoh: PT Bank Mandiri (Persero) Tbk"
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Narahubung & Kontak (Jabatan/HP) *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="Contoh: Hendra (CSR Manager - 0812xxxx)"
                      className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Estimasi Nilai / Komitmen Dukungan
                    </label>
                    <input
                      type="text"
                      required
                      value={commitAmount}
                      onChange={(e) => setCommitAmount(e.target.value)}
                      placeholder="Misal: Rp 350 Juta / 50 Unit Perangkat"
                      className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Bentuk Skema Kemitraan
                  </label>
                  <select
                    value={supportType}
                    onChange={(e) => setSupportType(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  >
                    <option value="Dana CSR / TJSLP">Dana Tunai Program CSR / TJSLP</option>
                    <option value="Penyediaan Material Fisik & Fasilitas">Penyediaan Material Fisik & Fasilitas Siap Pakai</option>
                    <option value="Kerjasama Operasional / KPBU Mini">Kerjasama Operasional / KPBU Mini</option>
                    <option value="Program Bimbingan Teknis & Pelatihan Vokasi">Program Bimbingan Teknis & Pelatihan Vokasi Karyawan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Catatan Khusus / Preferensi Lokasi Pelaksanaan
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Sebutkan jika ada preferensi wilayah desa binaan tertentu atau syarat khusus..."
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCommitModal(false)}
                    className="px-3.5 py-1.5 text-stone-700 bg-white border border-stone-300 rounded hover:bg-stone-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-900 text-white rounded font-semibold hover:bg-emerald-950 shadow-xs cursor-pointer"
                  >
                    Kirimkan Pernyataan Minat
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
