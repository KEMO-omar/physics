import React from 'react';

interface HeaderProps {
  onResetLab: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onResetLab }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <i className="fa-solid fa-atom text-xl animate-spin-slow"></i>
          </div>
          <div>
            <h1 className="font-extrabold text-xl bg-gradient-to-r from-indigo-700 via-violet-700 to-purple-600 bg-clip-text text-transparent">
              معمل المقذوفات الفيزيائي المتقدم
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              المحاكاة الشاملة للمنهج الثانوي (الحسابات المباشرة والعكسية)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetLab}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition flex items-center gap-1.5 active:scale-95"
            title="إعادة ضبط كافة المعطيات إلى القيم الافتراضية"
          >
            <i className="fa-solid fa-rotate-left"></i> إعادة ضبط
          </button>
          <div className="hidden md:flex items-center bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-indigo-100">
            <i className="fa-solid fa-graduation-cap me-1.5"></i> المنهج المصري للفيزياء
          </div>
        </div>
      </div>
    </header>
  );
};
