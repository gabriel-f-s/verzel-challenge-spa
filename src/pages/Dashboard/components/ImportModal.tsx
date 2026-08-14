import { useState, type FormEvent } from 'react';
import { X, Search, Loader2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchTMDB, type ExternalEvent } from '../../../services/integrations';
import { importEvent } from '../../../services/events';
import { ImageWithFallback } from './ImageWithFallback';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
}

export function ImportModal({
  isOpen,
  onClose,
  onImportSuccess,
}: ImportModalProps) {
  const [query, setQuery] = useState('');
  const [searchedQuery, setSearchedQuery] = useState('');
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [results, setResults] = useState<ExternalEvent[]>([]);
  const [error, setError] = useState('');

  const [selectedMovie, setSelectedMovie] = useState<ExternalEvent | null>(
    null,
  );

  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('35.00');
  const [capacity, setCapacity] = useState('120');
  const [type, setType] = useState<'SEATED' | 'GENERAL'>('SEATED');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoadingSearch(true);
      setError('');
      setSearchedQuery(query.trim());
      const data = await searchTMDB(query);
      setResults(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao buscar filmes no TMDB');
    } finally {
      setLoadingSearch(false);
    }
  }

  function handleSelectMovie(movie: ExternalEvent) {
    setSelectedMovie(movie);
    setError('');

    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    defaultDate.setHours(20, 0, 0, 0);
    const isoLocal = new Date(
      defaultDate.getTime() - defaultDate.getTimezoneOffset() * 60000,
    )
      .toISOString()
      .slice(0, 16);

    setDate(isoLocal);
    setLocation('Cinemark Sala 01 - Shopping SP Market');
    setPrice('35.00');
    setCapacity('120');
    setType('SEATED');
  }

  async function handleConfirmImport(e: FormEvent) {
    e.preventDefault();
    if (!selectedMovie) return;

    if (!date || !location || !price || !capacity) {
      setError('Por favor, preencha todos os campos da sessão.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const formattedDate = new Date(date).toISOString();

      await importEvent({
        externalId: selectedMovie.externalId,
        source: selectedMovie.source,
        date: formattedDate,
        location,
        price: Number(price),
        capacity: Number(capacity),
        type,
      });

      onImportSuccess();
      handleClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Erro ao importar evento no servidor.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setSelectedMovie(null);
    setResults([]);
    setQuery('');
    setSearchedQuery('');
    setError('');
    onClose();
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
        className="flex w-full max-w-4xl max-h-[90vh] flex-col rounded-md border border-primary bg-bg-card shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-border p-6">
          <div className="flex items-center gap-3">
            {selectedMovie && (
              <button
                type="button"
                onClick={() => setSelectedMovie(null)}
                className="flex items-center gap-1 rounded-lg border border-border bg-bg-input px-3 py-1.5 text-xs font-semibold text-white/80 transition-colors hover:text-white"
              >
                <ArrowLeft className="size-4" />
                Voltar à busca
              </button>
            )}
            <h2 className="font-heading text-xl font-bold text-white">
              {selectedMovie ? 'Configurar Sessão' : 'Buscar Evento'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-muted hover:text-white transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {error && (
            <p className="mb-6 text-sm text-error bg-error/10 p-4 rounded-xl border border-error/30">
              {error}
            </p>
          )}

          <AnimatePresence mode="wait">
            {!selectedMovie ? (
              <motion.div
                key="step-search"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleSearch} className="flex gap-3 mb-8">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
                    <input
                      type="text"
                      placeholder="Buscar por nome do filme (ex: Interestelar, Pulp Fiction)..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="h-12 w-full rounded-md border border-border bg-bg-input pl-10 pr-4 text-sm text-white outline-none placeholder:text-muted focus:border-border-focus focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loadingSearch}
                    className="flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:opacity-90 disabled:opacity-50"
                  >
                    {loadingSearch ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      'Buscar'
                    )}
                  </button>
                </form>

                {loadingSearch ? (
                  <div className="flex flex-col items-center justify-center py-20 text-primary">
                    <Loader2 className="size-10 animate-spin" />
                    <p className="mt-4 text-sm font-medium text-muted">
                      Buscando catálogo no TMDB...
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {results.map((movie) => (
                        <div
                          key={movie.externalId}
                          className="flex flex-col overflow-hidden rounded-md border border-border bg-bg-input transition-all hover:border-primary/50"
                        >
                          <div className="aspect-[2/3] w-full bg-black/40">
                            <ImageWithFallback
                              src={movie.imageUrl}
                              alt={movie.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex flex-1 flex-col p-4">
                            <h3 className="text-sm font-bold text-white line-clamp-1">
                              {movie.title}
                            </h3>
                            <span className="text-xs text-muted mb-4">
                              {movie.date
                                ? new Date(movie.date).getFullYear()
                                : 'TMDB'}
                            </span>
                            <button
                              onClick={() => handleSelectMovie(movie)}
                              className="mt-auto flex h-10 w-full items-center justify-center rounded-md border border-primary/50 bg-primary/10 text-xs font-bold uppercase tracking-wide text-primary transition-colors hover:bg-primary hover:text-white"
                            >
                              Configurar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {searchedQuery && results.length === 0 && !loadingSearch && (
                      <div className="py-16 text-center text-muted">
                        Nenhum filme encontrado para "{searchedQuery}".
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="step-config"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-6"
              >
                <div className="flex flex-col sm:flex-row gap-6 p-4 rounded-md border border-border bg-bg-input">
                  <div className="w-24 h-36 rounded-md overflow-hidden shrink-0 border border-border/50">
                    <ImageWithFallback
                      src={selectedMovie.imageUrl}
                      alt={selectedMovie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Filme Selecionado
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">
                      {selectedMovie.title}
                    </h3>
                    <p className="text-xs text-muted line-clamp-3 mt-2">
                      {selectedMovie.description || 'Sem sinopse disponível.'}
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleConfirmImport}
                  className="flex flex-col gap-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-white/80 flex items-center gap-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-3.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z"
                          />
                        </svg>
                        Data e Hora da Sessão
                      </label>
                      <input
                        type="datetime-local"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="h-11 rounded-lg border border-border bg-bg-input px-3 text-sm text-white outline-none focus:border-border-focus focus:ring-1 focus:ring-primary/20"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-white/80 flex items-center gap-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-3.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                          />
                        </svg>
                        Local / Sala
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Cinemark Sala 03"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="h-11 rounded-lg border border-border bg-bg-input px-3 text-sm text-white outline-none placeholder:text-muted focus:border-border-focus focus:ring-1 focus:ring-primary/20"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-white/80 flex items-center gap-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-3.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
                          />
                        </svg>
                        Preço do Ingresso (R$)
                      </label>
                      <input
                        type="number"
                        step="0.50"
                        min="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="h-11 rounded-lg border border-border bg-bg-input px-3 text-sm text-white outline-none focus:border-border-focus focus:ring-1 focus:ring-primary/20"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-white/80 flex items-center gap-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-3.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                          />
                        </svg>
                        Lotação / Capacidade
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        className="h-11 rounded-lg border border-border bg-bg-input px-3 text-sm text-white outline-none focus:border-border-focus focus:ring-1 focus:ring-primary/20"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-medium text-white/80 flex items-center gap-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-3.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5"
                          />
                        </svg>
                        Tipo de Distribuição
                      </label>
                      <select
                        value={type}
                        onChange={(e) =>
                          setType(e.target.value as 'SEATED' | 'GENERAL')
                        }
                        className="h-11 rounded-lg border border-border bg-bg-input px-3 text-sm text-white outline-none focus:border-border-focus focus:ring-1 focus:ring-primary/20"
                      >
                        <option value="SEATED">
                          Com Assentos Marcados (Cinema / Teatro)
                        </option>
                        <option value="GENERAL">
                          Entrada Geral / Pista (Sem marcação)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
                    <button
                      type="button"
                      onClick={() => setSelectedMovie(null)}
                      className="h-11 px-5 rounded-xl border border-border text-sm font-semibold text-muted hover:text-white transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-8 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:opacity-90 disabled:opacity-50 shadow-lg shadow-primary/20"
                    >
                      {submitting ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        'Publicar Evento'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
