 
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Ticket, X, CheckCircle2, Copy } from 'lucide-react';
import { getMyTickets, type TicketData } from '../../services/tickets';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import toast from 'react-hot-toast';

export function MyTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [copied, setCopied] = useState(false);

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMyTickets();
      setTickets(data);
    } catch (error) {
      console.error('Erro ao carregar ingressos:', error);
      toast.error('Não foi possível carregar seus ingressos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleCopyLink = (token: string) => {
    const link = `${window.location.origin}/ticket/share/${token}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex min-h-screen flex-col text-white"
    >
      <Header />

      <main className="mx-auto max-w-7xl px-20 py-10">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" className="size-8">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"/>
              </svg>
              <h2 className="font-heading text-3xl font-bold uppercase">
                Meus Ingressos
              </h2>
            </div>

            <p className="mt-1 text-sm text-muted">Acesse seus ingressos adquiridos e os QR Codes para entrada.</p>
          </div>
        </div>

        {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        ) : tickets.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket) => (
              <motion.div
                key={ticket.id}
                whileHover={{ scale: 1.02 }}
                className="group relative flex flex-col overflow-hidden rounded-md border border-border bg-bg-card shadow-lg transition-all hover:border-primary/50 cursor-pointer"
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="relative aspect-[21/9] w-full overflow-hidden bg-bg-input">
                  {ticket.eventImageUrl ? (
                    <img src={ticket.eventImageUrl} alt={ticket.eventTitle} className="h-full w-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-bg-input text-muted">
                      <Ticket className="size-8 opacity-20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent" />
                  
                  {ticket.seatNumber && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="bg-primary text-white text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md shadow-lg border border-primary/50">
                        Assento {ticket.seatNumber}
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-4 right-4 z-10">
                    <h3 className="font-heading text-xl font-bold text-white line-clamp-1">{ticket.eventTitle}</h3>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Data</span>
                    <span className="text-white font-semibold">
                      {new Date(ticket.eventDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Local</span>
                    <span className="text-white font-semibold line-clamp-1 max-w-[60%] text-right">{ticket.eventLocation}</span>
                  </div>
                  {ticket.seatNumber && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted">Assento</span>
                      <span className="text-primary font-bold">{ticket.seatNumber}</span>
                    </div>
                  )}
                  <div className="mt-2 flex items-center justify-between text-sm pt-3 border-t border-border">
                    <span className="text-muted">Status</span>
                    <span className={`font-bold uppercase tracking-wider text-[10px] px-2 py-1 rounded-md border ${
                      ticket.status === 'VALIDATED' ? 'bg-green-500/20 text-green-500 border-green-500/20' :
                      ticket.status === 'PAID' ? 'bg-primary/20 text-primary border-primary/20' :
                      ticket.status === 'CANCELLED' ? 'bg-red-500/20 text-red-500 border-red-500/20' :
                      'bg-yellow-500/20 text-yellow-500 border-yellow-500/20'
                    }`}>
                      {ticket.status === 'VALIDATED' ? 'Utilizado' : 
                       ticket.status === 'PAID' ? 'Disponível' : 
                       ticket.status === 'CANCELLED' ? 'Cancelado' : 'Reservado'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border bg-bg-card/50 py-24 px-16 text-center">
            <Ticket className="mb-4 size-12 text-muted" />
            <h3 className="text-lg font-bold text-white">Nenhum ingresso encontrado</h3>
            <p className="mt-2 max-w-md text-sm text-muted">
              Você ainda não adquiriu ingressos. Acesse o catálogo e garanta seu lugar!
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-6 rounded-md bg-primary px-6 py-2.5 text-sm font-bold tracking-wide text-white transition-all hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              Ir para o Catálogo
            </button>
          </div>
        )}
      </main>

      <Footer />

      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative w-full max-w-md rounded-md border border-border bg-bg-card shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="rounded-md p-1 bg-black/40 text-white/80 transition-colors hover:bg-black/80 hover:text-white"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="p-8 pb-6 flex flex-col items-center justify-center bg-white">
                <div className="mb-4 text-center">
                  <h2 className="text-xl font-bold text-black font-heading line-clamp-1">{selectedTicket.eventTitle}</h2>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedTicket.eventDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="bg-white p-2 rounded-md shadow-sm border border-gray-100">
                  <QRCodeSVG 
                    value={selectedTicket.qrCodeData} 
                    size={220} 
                    level="Q"
                    className={selectedTicket.status !== 'PAID' ? 'opacity-30' : ''}
                  />
                  {selectedTicket.status === 'VALIDATED' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="bg-black/80 text-green-400 font-bold px-4 py-2 rounded-md text-lg transform -rotate-12 border-2 border-green-400 shadow-xl">
                        UTILIZADO
                      </div>
                    </div>
                  )}
                </div>

                {selectedTicket.seatNumber && (
                  <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Assento</p>
                    <p className="text-3xl font-black text-primary font-heading">{selectedTicket.seatNumber}</p>
                  </div>
                )}
              </div>

              <div className="p-6 bg-bg-card border-t border-border flex flex-col gap-3">
                <button
                  onClick={() => handleCopyLink(selectedTicket.shareToken)}
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-bg-input py-3 text-sm font-bold text-white transition-all hover:border-primary/50"
                >
                  {copied ? <CheckCircle2 className="size-4 text-green-500" /> : <Copy className="size-4" />}
                  {copied ? 'Link Copiado!' : 'Copiar Link Compartilhável'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
