import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-bg-card py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-20 md:flex-row">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-tight text-white">Elite<span className="text-primary">Tickets</span></span>
          <span className="text-sm text-muted">© {new Date().getFullYear()}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted">
          <span>Desenvolvido com</span>
          <Heart className="size-4 text-primary fill-primary" />
          <span>por Gabriel Fonseca (Desafio Verzel)</span>
        </div>
      </div>
    </footer>
  );
}
