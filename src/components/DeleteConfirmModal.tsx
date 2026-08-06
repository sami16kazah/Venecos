'use client';

import React from 'react';
import { MdDeleteForever, MdClose } from 'react-icons/md';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  title = 'تأكيد الحذف النهائي',
  description = 'هل أنت تأكد من رغبتك في حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء بعد إتمامه.',
  confirmText = 'نعم، حذف نهائياً',
  cancelText = 'إلغاء الأمر',
  onConfirm,
  onCancel,
  loading = false,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" dir="rtl">
      <div className="relative w-full max-w-md bg-venecos-black border border-red-500/40 rounded-3xl p-6 shadow-2xl space-y-6 text-center">
        <button
          onClick={onCancel}
          disabled={loading}
          className="absolute top-4 left-4 text-white/50 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <MdClose size={22} />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-500 flex items-center justify-center text-3xl mx-auto shadow-inner">
          <MdDeleteForever />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-xs text-white/70 leading-relaxed font-light px-2">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 px-4 rounded-xl border border-white/20 text-white text-xs font-bold hover:bg-white/10 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all"
          >
            {loading ? 'جاري الحذف...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
