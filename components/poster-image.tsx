'use client';
import { useState } from 'react';
import Image from 'next/image';

export function PosterImage({
  src,
  alt,
  index,
}: {
  src?: string;
  alt: string;
  index: number;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <>
      {/* Skeleton */}
      {(!loaded || failed) && (
        <div className="absolute inset-0 rounded bg-muted animate-pulse" />
      )}

      {/* Image */}
      {src && !failed && (
        <Image
          src={src}
          alt={alt}
          fill
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`object-contain transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
          loading={index < 20 ? 'eager' : 'lazy'}
        />
      )}
    </>
  );
}
