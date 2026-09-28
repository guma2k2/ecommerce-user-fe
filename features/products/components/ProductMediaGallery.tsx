'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Package } from 'lucide-react';
import type { ProductMedia, ProductVariant } from '../types';

interface ProductMediaGalleryProps {
  medias: ProductMedia[];
  activeVariant: ProductVariant | null;
  productName: string;
}

export function ProductMediaGallery({
  medias,
  activeVariant,
  productName,
}: ProductMediaGalleryProps) {
  // Combine product medias and active variant media
  const allImages = React.useMemo(() => {
    const list: string[] = [];
    if (activeVariant?.mediaUrl) {
      list.push(activeVariant.mediaUrl);
    }
    if (medias && medias.length > 0) {
      medias.forEach((m) => {
        if (!list.includes(m.url)) {
          list.push(m.url);
        }
      });
    }
    return list;
  }, [medias, activeVariant]);

  // User manual selection override
  const [selectedImageOverride, setSelectedImageOverride] = useState<string | null>(null);
  const [prevVariantMedia, setPrevVariantMedia] = useState<string | null | undefined>(activeVariant?.mediaUrl);

  // When active variant's media changes, reset user override so variant media takes precedence
  if (activeVariant?.mediaUrl !== prevVariantMedia) {
    setPrevVariantMedia(activeVariant?.mediaUrl);
    setSelectedImageOverride(null);
  }

  // Derive the active preview image
  const selectedImage =
    (selectedImageOverride && allImages.includes(selectedImageOverride)
      ? selectedImageOverride
      : null) ||
    activeVariant?.mediaUrl ||
    allImages[0] ||
    '';

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Frame */}
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-border/80 bg-muted/20 shadow-xs">
        {selectedImage ? (
          <Image
            src={selectedImage}
            alt={productName}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-4 transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
            <Package className="size-20" />
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {allImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          {allImages.map((url, idx) => {
            const isSelected = selectedImage === url;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImageOverride(url)}
                className={`relative size-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-200 focus-visible:outline-none ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/20 scale-102 shadow-xs'
                    : 'border-border/60 hover:border-primary/40 opacity-75 hover:opacity-100'
                }`}
              >
                <Image
                  src={url}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-contain p-1.5"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
