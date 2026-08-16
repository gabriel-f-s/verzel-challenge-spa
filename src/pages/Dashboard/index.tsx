 
 
import { useEffect, useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EventCard } from './components/EventCard';
import { ImportModal } from './components/ImportModal';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { SeatSelectionModal } from './components/SeatSelectionModal';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { fetchEvents, deleteEvent, type EventData } from '../../services/events';
import toast from 'react-hot-toast';

export function Dashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<EventData | null>(null);
  const [selectedEventForPurchase, setSelectedEventForPurchase] = useState<EventData | null>(null);

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchEvents();
      // Ordena por data mais próxima
      const sortedData = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setEvents(sortedData);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      toast.error('Não foi possível carregar os eventos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  async function handleDeleteEvent(id: string) {
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((event) => event.id !== id));
      toast.success('Evento removido com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover evento.');
    }
  }

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
                            d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5"/>
                  </svg>
                  <h2 className="font-heading text-3xl font-bold uppercase">
                      {user?.role === 'ORGANIZADOR'
                          ? 'Meus Eventos'
                          : user?.role === 'PORTARIA'
                              ? 'Eventos do Dia'
                              : 'Catálogo de Eventos'}
                  </h2>
              </div>

              <p className="mt-1 text-sm text-muted">
                  {user?.role === 'ORGANIZADOR'
                      ? 'Gerencie seus eventos importados, datas e lotações.'
                      : user?.role === 'PORTARIA'
                          ? 'Selecione o evento para validar os ingressos na entrada.'
                          : 'Encontre os melhores filmes e garanta seu ingresso.'}
              </p>
          </div>

            {user?.role === 'ORGANIZADOR' && (
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:opacity-90 shadow-lg shadow-primary/20"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                         stroke="currentColor" className="size-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                    </svg>
                    Adicionar evento
                </button>
            )}
        </div>

          {loading ? (
              <div className="flex h-64 items-center justify-center">
                  <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
          ) : events.length > 0 ? (
              <motion.div
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  transition={{duration: 0.4}}
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                  {events.map((event) => (
                      <EventCard
                key={event.id}
                event={event}
                isOrganizer={user?.role === 'ORGANIZADOR'}
                onDelete={(e) => setEventToDelete(e)}
                onBuy={user?.role === 'CLIENTE' ? (e) => setSelectedEventForPurchase(e) : undefined}
              />
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-bg-card/50 py-24 text-center">
            <Search className="mb-4 size-12 text-muted" />
            <h3 className="text-lg font-bold text-white">
              Nenhum evento encontrado
            </h3>
            <p className="mt-2 max-w-md text-sm text-muted">
              {user?.role === 'ORGANIZADOR'
                ? 'Você ainda não possui eventos. Clique no botão "Adicionar Evento" acima para começar a adicionar filmes ao seu catálogo.'
                : 'Nenhum evento disponível no momento.'}
            </p>
          </div>
        )}
      </main>

      <Footer />

      <AnimatePresence>
        {isModalOpen && (
          <ImportModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onImportSuccess={loadEvents}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {eventToDelete && (
          <DeleteConfirmationModal
            event={eventToDelete}
            onClose={() => setEventToDelete(null)}
            onConfirm={handleDeleteEvent}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedEventForPurchase && (
          <SeatSelectionModal
            isOpen={!!selectedEventForPurchase}
            onClose={() => setSelectedEventForPurchase(null)}
            event={selectedEventForPurchase}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
