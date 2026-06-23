import React from "react";
import { X, BookOpen, Award, Briefcase, Sparkles } from "lucide-react";

interface ProgramsModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: {
    id: string;
    title: string;
    desc: string;
    detail: string;
    career: string[];
    icon: string;
  } | null;
}

export default function ProgramsModal({ isOpen, onClose, program }: ProgramsModalProps) {
  if (!isOpen || !program) return null;

  return (
    <div id="program-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div 
        id="program-modal-panel"
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100"
      >
        {/* Header decoration */}
        <div className="h-3 bg-gradient-to-r from-primary-dark via-primary-light to-accent-gold" />
        
        <div className="p-6 md:p-8">
          {/* Close button */}
          <button 
            id="close-program-modal-btn"
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title="Tutup"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-50 text-primary-light rounded-xl">
              <span className="text-3xl font-bold">🏫</span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-light">Program Keahlian SMK IPTEK</p>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">{program.title}</h3>
            </div>
          </div>

          <div className="space-y-6 text-gray-600 font-sans text-sm md:text-base leading-relaxed">
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                <BookOpen className="w-4 h-4 text-primary-light" /> Deskripsi Kurikulum
              </h4>
              <p>{program.detail}</p>
            </div>

            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                <Sparkles className="w-4 h-4 text-accent-gold" /> Fokus Keahlian & Praktik
              </h4>
              <p className="bg-gray-50 p-3 rounded-xl border border-gray-100 italic">
                "{program.desc}"
              </p>
            </div>

            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                <Briefcase className="w-4 h-4 text-primary-light" /> Peluang Karier & Alumni
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
                {program.career.map((job, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-blue-50/50 p-2 rounded-lg border border-blue-100/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-light" />
                    <span className="font-medium text-xs md:text-sm">{job}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <p className="text-xs text-cool-gray-400">Pendaftaran Jurusan Terbuka untuk Tahun Pelajaran 2026/2027</p>
                <p className="text-sm font-semibold text-primary-dark">Gelombang 1: Potongan Biaya SPP 20%</p>
              </div>
              <button
                id="modal-ppdb-cta"
                onClick={() => {
                  onClose();
                  const ppdbSection = document.getElementById("ppdb");
                  if (ppdbSection) ppdbSection.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-6 py-3 bg-primary-dark hover:bg-primary-light text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-900/10 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                Daftar Jurusan Ini
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
