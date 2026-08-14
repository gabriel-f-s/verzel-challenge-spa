import { useState } from 'react';
import { Loader2, ImageOff } from 'lucide-react';

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  className?: string;
}

export function ImageWithFallback({
  src,
  alt,
  className = '',
}: ImageWithFallbackProps) {
  const [loading, setLoading] = useState(true);
  const isInvalidUrl = !src || src.includes('placeholder.com') || src === '';
  const [error, setError] = useState(isInvalidUrl);

  if (error || isInvalidUrl) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-black/40 p-4 text-center text-muted select-none ${className}`}
      >
        <ImageOff className="size-7 opacity-50 mb-1.5 text-muted" />
        <span className="text-[11px] font-medium text-white/50">
          Filme sem capa
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        className={`h-full w-full object-cover transition-opacity duration-300 ${
          loading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
}
