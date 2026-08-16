 
 
import { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { fetchEvents, type EventData } from '../../services/events';
import { validateTicket, type ValidationResponse } from '../../services/tickets';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { CheckCircle2, AlertTriangle, XCircle, Settings2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export function PortariaScanner() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [manualCode, setManualCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidationResponse | null>(null);
  
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const handleValidate = async (code: string) => {
    if (!selectedEventId || !code) return;
    if (loading) return;
    
    try {
      setLoading(true);
      const res = await validateTicket({ eventId: selectedEventId, qrCodeData: code });
      setResult(res);
      setManualCode('');
      
      if (res.status === 'VALID') toast.success('Entrada liberada!');
      else if (res.status === 'ALREADY_USED') toast.error('Ingresso já utilizado!');
      else toast.error('Ingresso inválido ou evento errado!');
      
      // Auto-clear result after 5 seconds if valid, to be ready for next
      if (res.status === 'VALID') {
        setTimeout(() => setResult(null), 5000);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erro de conexão.';
      setResult({
        status: 'INVALID',
        message: msg,
        ticket: null
      });
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function load() {
      const data = await fetchEvents();
      setEvents(data);
      if (data.length > 0) setSelectedEventId(data[0].id);
    }
    load();
  }, []);

  useEffect(() => {
    if (!selectedEventId) {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
      return;
    }

    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );
    }

    scannerRef.current.render(
      (decodedText: string) => {
        handleValidate(decodedText);
      },
      (_error: any) => {
      }
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
     
  }, [selectedEventId]);

  const styles = {
    VALID: 'bg-green-500/10 border-green-500/30 text-green-500',
    ALREADY_USED: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500',
    WRONG_EVENT: 'bg-orange-500/10 border-orange-500/30 text-orange-500',
    INVALID: 'bg-red-500/10 border-red-500/30 text-red-500',
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
        <div className="mb-10">
          <div className="flex items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" className="size-8">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"/>
            </svg>
            <h2 className="font-heading text-3xl font-bold uppercase">Validador de Portaria</h2>
          </div>
          <p className="mt-1 text-sm text-muted">Utilize a câmera para ler os QR Codes ou digite o código do
            ingresso.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="flex flex-col gap-6">
            <div className="rounded-md border border-border bg-bg-card p-6 shadow-lg">
              <label className="block text-sm font-bold text-white mb-2">Evento Ativo</label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full rounded-md border border-border bg-bg-input px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>{ev.title} - {new Date(ev.date).toLocaleDateString('pt-BR')}</option>
                ))}
              </select>
            </div>

            <div className="rounded-md border border-border bg-bg-card p-6 shadow-lg">
              <h3 className="font-bold text-white mb-4">Câmera (Leitor de QR Code)</h3>
              <div className="overflow-hidden rounded-md border-2 border-dashed border-border bg-black relative">
                <div id="qr-reader" className="w-full"></div>
                {loading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                     <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  </div>
                )}
              </div>
              
              <style>{`
                #qr-reader { border: none !important; }
                #qr-reader__scan_region { background: black; }
                #qr-reader__dashboard_section_csr button {
                  background-color: var(--color-primary);
                  color: white;
                  border: none;
                  padding: 8px 16px;
                  border-radius: 6px;
                  font-weight: bold;
                  cursor: pointer;
                  margin-top: 10px;
                }
              `}</style>
            </div>
          </div>

          <div>
            <div className="rounded-md border border-border bg-bg-card p-6 shadow-lg">
              <h3 className="font-bold text-white mb-4">Digitação Manual</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Cole ou digite o código/token..."
                  className="flex-1 rounded-md border border-border bg-bg-input px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={() => handleValidate(manualCode)}
                  disabled={loading || !manualCode}
                  className="rounded-md bg-primary px-6 font-bold text-white transition-colors hover:opacity-90 disabled:opacity-50"
                >
                  Validar
                </button>
              </div>
            </div>

            {result && (
              <div className={`mt-6 rounded-md border p-6 flex flex-col items-center justify-center text-center ${styles[result.status]}`}>
                {result.status === 'VALID' && <CheckCircle2 className="size-12 mb-2" />}
                {result.status === 'ALREADY_USED' && <AlertTriangle className="size-12 mb-2" />}
                {result.status === 'WRONG_EVENT' && <Settings2 className="size-12 mb-2" />}
                {result.status === 'INVALID' && <XCircle className="size-12 mb-2" />}
                
                <h3 className="text-xl font-bold mb-2">
                  {result.status === 'VALID' ? 'ENTRADA LIBERADA' : 
                   result.status === 'ALREADY_USED' ? 'JÁ UTILIZADO' :
                   result.status === 'WRONG_EVENT' ? 'EVENTO ERRADO' : 'INVÁLIDO'}
                </h3>
                <p className="text-sm font-semibold opacity-90">{result.message}</p>
                
                {result.ticket?.seatNumber && (
                  <div className="mt-4 px-4 py-2 bg-black/20 rounded-md">
                    <p className="text-xs uppercase tracking-widest opacity-80">Assento</p>
                    <p className="text-2xl font-black">{result.ticket.seatNumber}</p>
                  </div>
                )}
                
                <button 
                  onClick={() => setResult(null)} 
                  className="mt-6 px-6 py-2 bg-black/20 hover:bg-black/40 transition-colors rounded-md text-sm font-bold"
                >
                  Nova Leitura
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
}
