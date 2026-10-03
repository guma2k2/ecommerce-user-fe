'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Package, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from '@/components/ui';
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
  const [api, setApi] = useState<CarouselApi>();

  // Combine product medias and active variant media
  const allImages = useMemo(() => {
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

  // Smoothly scroll carousel when selected image changes
  useEffect(() => {
    if (!api || !selectedImage) return;
    const targetIndex = allImages.indexOf(selectedImage);
    if (targetIndex !== -1) {
      api.scrollTo(targetIndex);
    }
  }, [api, selectedImage, allImages]);

  const handleSelectThumbnail = (url: string, index: number) => {
    setSelectedImageOverride(url);
    api?.scrollTo(index);
  };

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

      {/* Thumbnails Carousel Row using Shadcn UI Carousel */}
      {allImages.length > 1 && (
        <Carousel
          setApi={setApi}
          opts={{
            align: 'start',
            containScroll: 'trimSnaps',
            dragFree: true,
          }}
          className="relative group w-full overflow-hidden rounded-2xl"
        >
          {/* Scrollable Carousel Track */}
          <CarouselContent className="-ml-3">
            {allImages.map((url, idx) => {
              const isSelected = selectedImage === url;
              return (
                <CarouselItem key={idx} className="pl-3 basis-auto">
                  <button
                    type="button"
                    onMouseEnter={() => setSelectedImageOverride(url)}
                    onClick={() => handleSelectThumbnail(url, idx)}
                    className={`relative size-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-200 focus-visible:outline-none cursor-pointer ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/20 scale-102 shadow-xs'
                        : 'border-border/60 hover:border-primary/50 opacity-75 hover:opacity-100'
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
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {/* Left Arrow Button */}
          <CarouselPrevious
            variant="ghost"
            className="absolute left-0 top-0 bottom-0 h-full w-7 rounded-l-2xl rounded-r-none translate-y-0 bg-black/35 hover:bg-black/60 text-white border-none z-20 backdrop-blur-[2px] transition-all disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronLeft className="size-5 stroke-[2.5]" />
          </CarouselPrevious>

          {/* Right Arrow Button */}
          <CarouselNext
            variant="ghost"
            className="absolute right-0 top-0 bottom-0 h-full w-7 rounded-r-2xl rounded-l-none translate-y-0 bg-black/35 hover:bg-black/60 text-white border-none z-20 backdrop-blur-[2px] transition-all disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronRight className="size-5 stroke-[2.5]" />
          </CarouselNext>
        </Carousel>
      )}
    </div>
  );
}
