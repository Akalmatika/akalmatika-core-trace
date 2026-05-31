import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuizContainerProps {
  title?: string;
  questionText: React.ReactNode;
  children: React.ReactNode;
  evalResult: 'none' | 'correct' | 'wrong';
  onNext: () => void;
  isLastQuestion: boolean;
  nextPath: string;
  nextLabel: string;
  isFinished: boolean;
  score: number;
  totalQuestions: number;
  onRetry: () => void;
}

export function QuizContainer({
  title = "Evaluasi Konsep",
  questionText,
  children,
  evalResult,
  onNext,
  isLastQuestion,
  nextPath,
  nextLabel,
  isFinished,
  score,
  totalQuestions,
  onRetry,
}: QuizContainerProps) {
  if (isFinished) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-16 shadow-sm relative overflow-hidden flex flex-col items-center justify-center min-h-[400px] animate-fadeIn">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-3xl font-black text-slate-900 mb-2">Evaluasi Selesai!</h3>
        <p className="text-slate-500 mb-8">
          Skor kamu: <span className="font-black text-indigo-600 text-xl">{score}</span> / {totalQuestions}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button 
            onClick={onRetry}
            className="flex-1 py-3 px-6 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} /> Ulangi
          </button>
          {nextPath && (
            <Link 
              to={nextPath}
              className="flex-[2] py-3 px-6 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {nextLabel} <ArrowRight size={18} />
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-12 shadow-sm relative overflow-hidden flex flex-col items-center min-h-[450px]">
      
      <div className="text-center max-w-2xl mb-12">
        <h3 className="text-2xl font-black text-slate-900 mb-3">{title}</h3>
        <div className="text-slate-600 leading-relaxed text-sm md:text-base">
          {questionText}
        </div>
      </div>

      {evalResult === 'correct' && (
        <div className="absolute top-6 right-6 md:top-8 md:right-8 z-20 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 animate-bounce shadow-sm border border-emerald-200">
          <CheckCircle2 size={20} /> Tepat Sekali!
        </div>
      )}

      {evalResult === 'wrong' && (
        <div className="absolute top-6 right-6 md:top-8 md:right-8 z-20 bg-rose-100 text-rose-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 animate-shake shadow-sm border border-rose-200">
          <XCircle size={20} /> Coba perhatikan lagi!
        </div>
      )}

      <div className="w-full flex-1 flex flex-col items-center justify-center">
        {children}
      </div>

      {evalResult === 'correct' && (
        <div className="mt-12 animate-fadeIn w-full flex justify-center border-t border-slate-100 pt-8">
          <button
            onClick={onNext}
            className="py-3 px-8 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-md"
          >
            {isLastQuestion ? 'Lihat Hasil' : 'Soal Selanjutnya'} <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
