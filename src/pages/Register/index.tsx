import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Tag, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

export function Register() {
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CLIENTE' | 'ORGANIZADOR'>('CLIENTE');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!name || !email || !password) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await signUp({ name, email, password, role });
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Ocorreu um erro ao criar a conta.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Conteúdo centralizado */}
      <div className="relative flex min-h-screen items-center justify-center px-6 py-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex w-full max-w-md flex-col gap-6"
        >
          {/* Logo / Branding */}
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Elite<span className="text-primary">Tickets</span>
            </h1>
            <span className="text-xs tracking-[0.2em] text-white/40 uppercase">
              Plataforma de Eventos
            </span>
          </div>

          {/* Card do formulário */}
          <div className="rounded-3xl border border-white/10 bg-bg-card p-8 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)]">
            <div className="mb-6">
              <h2 className="text-xl font-semibold tracking-tight text-white">Criar conta</h2>
              <p className="mt-1 text-sm text-muted leading-relaxed">
                Junte-se à plataforma e comece a explorar eventos.
              </p>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {error && (
                <div className="text-sm text-error bg-error/10 p-3 rounded-lg border border-error/30">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/80" htmlFor="name">
                  Nome completo
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                  <input
                    className="h-11 w-full rounded-lg border border-border bg-bg-input pl-10 pr-4 text-sm text-white transition-colors outline-none placeholder:text-muted focus:border-border-focus focus:ring-2 focus:ring-primary/20"
                    id="name"
                    type="text"
                    placeholder="João da Silva"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/80" htmlFor="email">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                  <input
                    className="h-11 w-full rounded-lg border border-border bg-bg-input pl-10 pr-4 text-sm text-white transition-colors outline-none placeholder:text-muted focus:border-border-focus focus:ring-2 focus:ring-primary/20"
                    id="email"
                    type="email"
                    placeholder="voce@email.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/80" htmlFor="password">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                  <input
                    className="h-11 w-full rounded-lg border border-border bg-bg-input pl-10 pr-4 text-sm text-white transition-colors outline-none placeholder:text-muted focus:border-border-focus focus:ring-2 focus:ring-primary/20"
                    id="password"
                    type="password"
                    placeholder="Crie uma senha forte"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/80" htmlFor="role">
                  Perfil
                </label>
                <div className="relative">
                  <Tag className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                  <select
                    className="h-11 w-full appearance-none rounded-lg border border-border bg-bg-input pl-10 pr-10 text-sm text-white transition-colors outline-none focus:border-border-focus focus:ring-2 focus:ring-primary/20"
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                  >
                    <option className="bg-bg-card" value="CLIENTE">Cliente — comprar ingressos</option>
                    <option className="bg-bg-card" value="ORGANIZADOR">Organizador — criar eventos</option>
                  </select>
                  {/* Seta customizada para o select */}
                  <svg className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="relative mt-2 flex h-12 w-full items-center overflow-hidden rounded-2xl border border-white/15 bg-neutral-950 text-white transition-colors hover:border-primary/45 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-main disabled:pointer-events-none disabled:opacity-50"
              >
                <span className="flex h-full w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                  <UserPlus className="size-5" />
                </span>
                <span className="flex-1 pr-4 text-center font-heading text-sm font-medium tracking-[0.12em] uppercase">
                  {loading ? 'Criando conta...' : 'Cadastrar'}
                </span>
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
              Já possui uma conta?{' '}
              <Link className="text-white underline underline-offset-4 transition-colors hover:text-primary" to="/login">
                Fazer login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
