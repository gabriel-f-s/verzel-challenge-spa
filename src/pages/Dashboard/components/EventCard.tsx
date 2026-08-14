import type { EventData } from '../../../services/events';
import { ImageWithFallback } from './ImageWithFallback';

interface EventCardProps {
  event: EventData;
  isOrganizer?: boolean;
  onDelete?: (event: EventData) => void;
  onBuy?: (event: EventData) => void;
}

export function EventCard({ event, isOrganizer, onDelete, onBuy }: EventCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-md border border-border bg-bg-card shadow-[0_8px_30px_-10px_rgba(0,0,0,0.5)] transition-all hover:border-primary/50">
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-bg-input cursor-pointer">
        <ImageWithFallback
          src={event.imageUrl}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {isOrganizer && onDelete && (
          <button
            type="button"
            title="Excluir evento"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(event);
            }}
            className="absolute top-3 right-3 z-20 flex size-9 items-center justify-center rounded-md bg-black/60 text-white/80 border border-white/10 backdrop-blur-md transition-all hover:bg-error hover:text-white hover:border-error shadow-lg"
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
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="font-heading text-lg font-bold text-white line-clamp-1">
            {event.title}
          </h3>
          <p className="mt-1 text-sm text-muted line-clamp-2">
            {event.description}
          </p>
        </div>

        <div className="mt-auto flex flex-col gap-2 text-sm text-white/70">
          <div className="flex items-center gap-2">
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
                d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z"
              />
            </svg>

            <span>
              {new Date(event.date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
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
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
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
                d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
              />
            </svg>

            <span>R$ {event.price.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>

        {onBuy && (
          <button
            onClick={() => onBuy(event)}
            className="mt-4 w-full rounded-md bg-primary py-2.5 text-sm font-bold tracking-wide text-white transition-all hover:opacity-90 shadow-lg shadow-primary/20"
          >
            {event.type === 'SEATED' ? 'Comprar / Reservar' : 'Comprar Ingresso'}
          </button>
        )}
      </div>
    </div>
  );
}
