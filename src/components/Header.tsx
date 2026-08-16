import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ScanFace } from 'lucide-react';

const NavLink = ({ to, label, isActive }: { to: string; label: string; isActive: boolean }) => (
  <Link
    to={to}
    className={`transition-colors font-semibold text-sm ${
      isActive
        ? 'text-white hover:text-primary'
        : 'text-muted hover:text-white'
    }`}
  >
    {label}
  </Link>
);

export function Header() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const roleLabel =
    user?.role === 'ORGANIZADOR'
      ? 'Organizador'
      : user?.role === 'PORTARIA'
        ? 'Portaria'
        : 'Cliente';

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 border-b border-primary bg-bg-card shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-20">
        <div className="flex items-center gap-6">
          <h1
            className="text-xl font-bold tracking-tight pr-3 text-white cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            Elite<span className="text-primary">Tickets</span>
          </h1>

          <nav className="hidden md:flex items-center gap-4 uppercase">
            {user?.role === 'CLIENTE' && (
              <>
                <NavLink to="/dashboard" label="Catálogo" isActive={isActive('/dashboard')} />
                <NavLink to="/my-tickets" label="Meus Ingressos" isActive={isActive('/my-tickets')} />
              </>
            )}
            {user?.role === 'PORTARIA' && (
              <>
                <NavLink to="/dashboard" label="Eventos do Dia" isActive={isActive('/dashboard')} />
                <NavLink to="/scanner" label="Validador" isActive={isActive('/scanner')} />
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user?.role === 'CLIENTE' || user?.role === 'ORGANIZADOR' ? (
            <button
              type="button"
              title="Notificações"
              className="relative flex size-9 items-center justify-center rounded-full border border-border bg-bg-input text-muted transition-colors hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
              <span className="absolute top-2 right-2 size-2 rounded-full bg-primary" />
            </button>
          ) : null}

          {(user?.role === 'CLIENTE' || user?.role === 'ORGANIZADOR') && (
            <div className="h-5 w-px bg-border" />
          )}

          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full border border-primary/40 bg-primary/20 text-xs font-bold text-primary">
              {user?.role === 'PORTARIA' ? (
                <ScanFace className="size-5" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              )}
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
            className="flex items-center gap-2 rounded-xl bg-bg-input px-3 py-2 text-xs font-semibold text-muted transition-colors hover:border-error/40 hover:text-error"
          >
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
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
              />
            </svg>
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
}
