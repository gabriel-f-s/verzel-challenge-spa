 
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { AlertCircle } from 'lucide-react';
import { getSharedTicket, type TicketData } from '../../services/tickets';
import { Footer } from '../../components/Footer';
import { motion } from 'framer-motion';

export function SharedTicket() {
  const { token } = useParams<{ token: string }>();
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!token) return;
      try {
        setLoading(true);
        const data = await getSharedTicket(token);
        setTicket(data);
      } catch (err) {
        setError('Ingresso não encontrado ou link inválido.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center text-white">
        <AlertCircle className="mb-4 size-16 text-error" />
        <h1 className="mb-2 text-2xl font-bold font-heading">Ingresso Indisponível</h1>
        <p className="text-muted mb-8">{error}</p>
        <Link to="/" className="text-primary hover:underline font-bold">Voltar para a página inicial</Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen flex-col items-center p-4 py-12"
    >
      <div className="w-full max-w-md rounded-md border border-border bg-bg-card shadow-2xl overflow-hidden mt-auto mb-auto">
        <div className="p-8 pb-6 flex flex-col items-center justify-center bg-white relative">
          <div className="mb-4 text-center">
            <h2 className="text-xl font-bold text-black font-heading line-clamp-1">{ticket.eventTitle}</h2>
            <p className="text-sm text-gray-600">
              {new Date(ticket.eventDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-xs text-gray-500 mt-1">{ticket.eventLocation}</p>
          </div>

          <div className="bg-white p-2 rounded-md shadow-sm border border-gray-100 relative">
            <QRCodeSVG 
              value={ticket.qrCodeData} 
              size={220} 
              level="Q"
              className={ticket.status !== 'PAID' ? 'opacity-30' : ''}
            />
            {ticket.status === 'VALIDATED' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="bg-black/80 text-green-400 font-bold px-4 py-2 rounded-md text-lg transform -rotate-12 border-2 border-green-400 shadow-xl">
                  UTILIZADO
                </div>
              </div>
            )}
            {ticket.status === 'CANCELLED' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="bg-black/80 text-red-500 font-bold px-4 py-2 rounded-md text-lg transform -rotate-12 border-2 border-red-500 shadow-xl">
                  CANCELADO
                </div>
              </div>
            )}
          </div>

          {ticket.seatNumber && (
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Assento</p>
              <p className="text-3xl font-black text-primary font-heading">{ticket.seatNumber}</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-bg-card border-t border-border flex flex-col items-center text-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor" className="size-8">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"/>
          </svg>
          <h3 className="font-bold text-white text-lg">Elite<span className="text-primary">Tickets</span></h3>
          <p className="text-xs text-muted mt-1">Este é o seu ingresso oficial. Apresente este QR Code na portaria do
            evento.</p>
        </div>
      </div>
      
      <div className="w-full max-w-md mt-auto pt-8">
        <Footer />
      </div>
    </motion.div>
  );
}
