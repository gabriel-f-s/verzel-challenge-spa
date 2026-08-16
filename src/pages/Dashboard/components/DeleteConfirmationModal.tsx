 
import { useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import type { EventData } from '../../../services/events';

interface DeleteConfirmationModalProps {
  event: EventData | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export function DeleteConfirmationModal({
  event,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!event) return null;

  async function handleConfirm() {
    if (!event) return;
    try {
      setLoading(true);
      setError('');
      await onConfirm(event.id);
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Erro ao excluir evento. Tente novamente mais tarde.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, type: 'spring', bounce: 0.25 }}
        className="flex w-full max-w-md flex-col rounded-md border border-primary bg-bg-card p-6 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" className="size-6 text-primary">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
            </svg>
            <h3 className="font-heading text-lg font-bold text-white">
              Excluir Evento
            </h3>
          </div>
          <button
              onClick={onClose}
              className="text-muted hover:text-white transition-colors"
          >
            <X className="size-5"/>
          </button>
        </div>

        <p className="text-sm text-muted leading-relaxed mb-4">
          Tem certeza de que deseja excluir o evento{' '}
          <strong className="text-white font-semibold">{event.title}</strong>?
          Esta ação é irreversível e removerá todos os dados associados.
        </p>

        {error && (
          <p className="mb-4 text-xs text-error bg-error/10 p-3 rounded-lg border border-error/30">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="h-10 px-4 rounded-xl border border-border text-sm font-semibold text-muted hover:text-white transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-primary-hover disabled:opacity-50 shadow-lg shadow-error/20"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Excluir'
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
