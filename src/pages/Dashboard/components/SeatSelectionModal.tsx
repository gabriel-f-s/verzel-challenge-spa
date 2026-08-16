 
 
 
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { getOccupiedSeats, purchaseTicket } from '../../../services/tickets';
import { useNavigate } from 'react-router-dom';
import type { EventData } from '../../../services/events';
import toast from 'react-hot-toast';

interface SeatSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventData;
}

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8];

export function SeatSelectionModal({ isOpen, onClose, event }: SeatSelectionModalProps) {
  const navigate = useNavigate();
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isSeated = event.type === 'SEATED';

  async function loadOccupiedSeats() {
    try {
      setLoading(true);
      setError(null);
      const seats = await getOccupiedSeats(event.id);
      setOccupiedSeats(seats);
    } catch (err: any) {
      setError('Falha ao carregar assentos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isOpen && isSeated) {
      loadOccupiedSeats();
    } else {
      setLoading(false);
    }
     
  }, [isOpen, isSeated, event.id]);

  async function handlePurchase(simulateSuccess: boolean) {
    if (isSeated && selectedSeats.length === 0) {
      toast.error('Por favor, selecione ao menos um assento.');
      return;
    }

    try {
      setPurchasing(true);
      setError(null);
      
      if (isSeated) {
        // Compra de múltiplos assentos
        await Promise.all(
          selectedSeats.map((seat) =>
            purchaseTicket({
              eventId: event.id,
              seatNumber: seat,
              simulatePaymentSuccess: simulateSuccess,
            })
          )
        );
      } else {
        // Ingresso sem assento (pista)
        await purchaseTicket({
          eventId: event.id,
          simulatePaymentSuccess: simulateSuccess,
        });
      }

      setSuccess(true);
      toast.success(simulateSuccess ? 'Compra aprovada com sucesso!' : 'Pagamento simulado com recusa não gerou ingressos.', {
         icon: simulateSuccess ? '✅' : '❌',
      });

      setTimeout(() => {
        onClose();
        if (simulateSuccess) navigate('/my-tickets'); 
      }, 2000);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erro ao processar pagamento.';
      setError(msg);
      toast.error(msg);
    } finally {
      setPurchasing(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl rounded-md border border-border bg-bg-card p-6 shadow-2xl flex flex-col max-h-[90vh]"
      >
        <button
          onClick={onClose}
          disabled={purchasing || success}
          className="absolute right-4 top-4 rounded-md p-1 text-muted transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
        >
          <X className="size-5" />
        </button>

        <h2 className="text-2xl font-bold font-heading text-white mb-2">Comprar Ingresso</h2>
        <p className="text-sm text-muted mb-6">
          {event.title} • {new Date(event.date).toLocaleString('pt-BR')}
        </p>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : success ? (
            <div className="flex h-48 flex-col items-center justify-center text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
              >
                <CheckCircle2 className="size-16 text-green-500 mb-4" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">Pagamento Aprovado!</h3>
              <p className="text-muted">Ingresso gerado com sucesso. Redirecionando...</p>
            </div>
          ) : (
            <>
              {isSeated && (
                <div className="mb-8 flex flex-col items-center">
                  <div className="w-full max-w-md h-8 bg-gradient-to-b from-white/20 to-transparent rounded-t-[50%] mb-10 flex items-center justify-center text-xs font-bold tracking-widest text-white/50">
                    TELA
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {ROWS.map((row) => (
                      <div key={row} className="flex items-center gap-2">
                        <span className="w-6 text-center text-xs font-bold text-muted">{row}</span>
                        <div className="flex gap-2">
                          {COLS.map((col) => {
                            const seatId = `${row}${col}`;
                            const isOccupied = occupiedSeats.includes(seatId);
                            const isSelected = selectedSeats.includes(seatId);
                            
                            return (
                              <button
                                key={seatId}
                                disabled={isOccupied || purchasing}
                                onClick={() => setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId])}
                                className={`
                                  size-8 md:size-10 rounded-md text-xs font-bold transition-all
                                  ${isOccupied 
                                    ? 'bg-red-500/20 text-red-500/50 border border-red-500/20 cursor-not-allowed'
                                    : isSelected
                                      ? 'bg-primary text-white border-2 border-primary scale-110 shadow-lg shadow-primary/40'
                                      : 'bg-bg-input text-muted border border-border hover:border-primary/50 hover:text-white'
                                  }
                                `}
                              >
                                {col}
                              </button>
                            );
                          })}
                        </div>
                        <span className="w-6 text-center text-xs font-bold text-muted">{row}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex gap-6 text-xs text-muted">
                    <div className="flex items-center gap-2">
                      <div className="size-4 rounded-md bg-bg-input border border-border"></div>
                      <span>Disponível</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-4 rounded-md bg-primary border-2 border-primary"></div>
                      <span>Selecionado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-4 rounded-md bg-red-500/20 border border-red-500/20"></div>
                      <span>Ocupado</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-md border border-border bg-bg-input p-4 mb-4">
                <h4 className="font-bold text-white mb-2">Resumo da Compra</h4>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted">Ingresso ({event.type === 'SEATED' ? 'Lugar Marcado' : 'Pista Geral'}) {isSeated && selectedSeats.length > 0 ? `x${selectedSeats.length}` : ''}</span>
                  <span className="text-white font-semibold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(event.price * (isSeated ? (selectedSeats.length || 1) : 1))}
                  </span>
                </div>
                {isSeated && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Assento Selecionado</span>
                    <span className="text-white font-bold text-primary max-w-[50%] text-right">{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Nenhum'}</span>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 rounded-md border border-error/20 bg-error/10 p-3 text-sm text-error flex items-start gap-2 overflow-hidden"
                  >
                    <AlertCircle className="size-4 mt-0.5 shrink-0" />
                    <p>{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        {!loading && !success && (
          <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row gap-3 justify-end shrink-0">
            <button
              onClick={() => handlePurchase(false)}
              disabled={purchasing || (isSeated && selectedSeats.length === 0)}
              className="px-4 py-2.5 rounded-md border border-border bg-transparent text-sm font-bold text-white transition-colors hover:bg-white/5 disabled:opacity-50"
            >
              Simular Recusa
            </button>
            <button
              onClick={() => handlePurchase(true)}
              disabled={purchasing || (isSeated && selectedSeats.length === 0)}
              className="px-6 py-2.5 rounded-md bg-primary text-sm font-bold tracking-wide text-white transition-all hover:bg-primary/90 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center min-w-[200px]"
            >
              {purchasing ? (
                <div className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                'Pagar e Confirmar'
              )}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
