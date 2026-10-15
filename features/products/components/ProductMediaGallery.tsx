'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  Package,
  ChevronLeft,
  ChevronRight,
  Play,
  Video as VideoIcon,
} from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from '@/components/ui';
import { isMediaVideo, getMediaThumbnailUrl } from '../utils';
import { ProductMediaDialog } from './ProductMediaDialog';
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Combine product medias and active variant media into a unified list
  const allMedias = useMemo<ProductMedia[]>(() => {
    const list: ProductMedia[] = [];

    // If active variant has its own specific media, make it first
    if (activeVariant?.mediaUrl) {
      list.push({
        mediaId: activeVariant.mediaId || 'variant-media',
        url: activeVariant.mediaUrl,
        position: 0,
        type: 'IMAGE',
        altText: activeVariant.title,
      });
    }

    if (medias && medias.length > 0) {
      medias.forEach((m) => {
        if (!list.some((item) => item.url === m.url)) {
          list.push(m);
        }
      });
    }

    return list;
  }, [medias, activeVariant]);

  // Selected media index
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prevVariantMedia, setPrevVariantMedia] = useState<string | null | undefined>(
    activeVariant?.mediaUrl
  );

  // When active variant's media changes, reset index to 0 so variant media is shown
  if (activeVariant?.mediaUrl !== prevVariantMedia) {
    setPrevVariantMedia(activeVariant?.mediaUrl);
    setSelectedIndex(0);
  }

  // Active media item
  const activeMedia = allMedias[selectedIndex] || allMedias[0];
  const isCurrentVideo = isMediaVideo(activeMedia);

  // Sync carousel position when selected index changes
  useEffect(() => {
    if (!api) return;
    api.scrollTo(selectedIndex);
  }, [api, selectedIndex]);

  const handleSelectThumbnail = (index: number) => {
    setSelectedIndex(index);
    api?.scrollTo(index);
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
    api?.scrollTo(index);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Showcase Frame */}
      <div className="relative aspect-[4/3] max-h-[420px] w-full overflow-hidden rounded-xl border border-border/80 bg-muted/20 shadow-2xs group">
        {isCurrentVideo && activeMedia?.url ? (
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            <video
              key={activeMedia.url}
              src={activeMedia.url}
              controls
              autoPlay
              muted
              playsInline
              className="w-full h-full object-contain"
            />
          </div>
        ) : activeMedia?.url ? (
          <div
            onClick={() => setIsDialogOpen(true)}
            className="relative w-full h-full cursor-pointer"
            title="Click to view full preview"
          >
            <Image
              src={activeMedia.url}
              alt={activeMedia.altText || productName}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
            <Package className="size-16" />
          </div>
        )}
      </div>

      {/* Thumbnails Carousel Row */}
      {allMedias.length > 1 && (
        <Carousel
          setApi={setApi}
          opts={{
            align: 'start',
            containScroll: 'trimSnaps',
            dragFree: true,
          }}
          className="relative group w-full overflow-hidden rounded-xl py-1"
        >
          <CarouselContent className="-ml-2.5">
            {allMedias.map((media, idx) => {
              const isSelected = selectedIndex === idx;
              const isItemVideo = isMediaVideo(media);
              const thumbUrl = getMediaThumbnailUrl(media);

              return (
                <CarouselItem key={media.mediaId || media.url || idx} className="pl-2.5 basis-auto">
                  <button
                    type="button"
                    onClick={() => handleThumbnailClick(idx)}
                    onMouseEnter={() => handleSelectThumbnail(idx)}
                    className={`relative size-14 sm:size-16 shrink-0 overflow-hidden rounded-lg border-2 bg-card transition-all duration-200 cursor-pointer focus-visible:outline-none ${
                      isSelected
                        ? 'border-primary shadow-2xs'
                        : 'border-border/60 hover:border-primary/50 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="relative w-full h-full bg-muted/20">
                      {thumbUrl ? (
                        <Image
                          src={thumbUrl}
                          alt={media.altText || `${productName} thumbnail ${idx + 1}`}
                          fill
                          sizes="64px"
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted/30">
                          {isItemVideo ? (
                            <VideoIcon className="size-5 text-muted-foreground" />
                          ) : (
                            <Package className="size-5 text-muted-foreground" />
                          )}
                        </div>
                      )}

                      {/* Video overlay badge with Play Icon only */}
                      {isItemVideo && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <div className="rounded-full bg-black/60 p-1 text-white shadow-2xs">
                            <Play className="size-3 fill-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {/* Left Arrow Button */}
          <CarouselPrevious
            variant="ghost"
            className="absolute left-0 top-0 bottom-0 h-full w-6 rounded-l-xl rounded-r-none translate-y-0 bg-black/35 hover:bg-black/60 text-white border-none z-20 backdrop-blur-[2px] transition-all disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronLeft className="size-4 stroke-[2.5]" />
          </CarouselPrevious>

          {/* Right Arrow Button */}
          <CarouselNext
            variant="ghost"
            className="absolute right-0 top-0 bottom-0 h-full w-6 rounded-r-xl rounded-l-none translate-y-0 bg-black/35 hover:bg-black/60 text-white border-none z-20 backdrop-blur-[2px] transition-all disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronRight className="size-4 stroke-[2.5]" />
          </CarouselNext>
        </Carousel>
      )}

      {/* Shopee-style Full Preview Dialog */}
      <ProductMediaDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        medias={allMedias}
        selectedIndex={selectedIndex}
        onSelectIndex={setSelectedIndex}
        productName={productName}
      />
    </div>
  );
}
