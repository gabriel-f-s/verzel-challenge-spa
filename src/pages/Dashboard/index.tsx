import { useEffect, useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { fetchEvents, deleteEvent, type EventData } from '../../services/events';
import { EventCard } from './components/EventCard';
import { ImportModal } from './components/ImportModal';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<EventData | null>(null);

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchEvents();
      setEvents(data);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  async function handleDeleteEvent(id: string) {
    await deleteEvent(id);
    setEvents((prev) => prev.filter((event) => event.id !== id));
  }

  const roleLabel =
    user?.role === 'ORGANIZADOR'
      ? 'Organizador'
      : user?.role === 'PORTARIA'
        ? 'Portaria'
        : 'Cliente';

  return (
    <div className="relative min-h-screen text-white">
      <header className="sticky top-0 z-40 border-b border-primary bg-bg-card shadow-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-white">
              Elite<span className="text-primary">Tickets</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              title="Notificações"
              className="relative flex size-9 items-center justify-center rounded-full border border-border bg-bg-input text-muted transition-colors hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"/>
              </svg>
              <span className="absolute top-2 right-2 size-2 rounded-full bg-primary"/>
            </button>

            <div className="h-5 w-px bg-border"/>

            <div className="flex items-center gap-3">
              <div
                  className="flex size-9 items-center justify-center rounded-full border border-primary/40 bg-primary/20 text-xs font-bold text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>

              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-semibold text-white leading-tight">
                  {user?.name}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  {roleLabel}
                </span>
              </div>
            </div>

            <div className="h-5 w-px bg-border" />

            <button
              onClick={signOut}
              title="Encerrar sessão"
              className="flex items-center gap-2 rounded-xl  bg-bg-input px-3 py-2 text-xs font-semibold text-muted transition-colors hover:border-error/40 hover:text-error"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" className="size-3.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"/>
              </svg>
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-20 py-10">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-3xl font-bold">
              {user?.role === 'ORGANIZADOR'
                ? 'Meus Eventos'
                : user?.role === 'PORTARIA'
                  ? 'Eventos do Dia'
                  : 'Catálogo de Eventos'}
            </h2>
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isOrganizer={user?.role === 'ORGANIZADOR'}
                onDelete={(e) => setEventToDelete(e)}
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
    </div>
  );
}
