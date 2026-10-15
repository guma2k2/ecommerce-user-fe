'use client';

import React, { useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Video as VideoIcon,
  Package,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  Button,
} from '@/components/ui';
import { isMediaVideo, getMediaThumbnailUrl } from '../utils';
import type { ProductMedia } from '../types';

interface ProductMediaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medias: ProductMedia[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  productName: string;
}

export function ProductMediaDialog({
  open,
  onOpenChange,
  medias,
  selectedIndex,
  onSelectIndex,
  productName,
}: ProductMediaDialogProps) {
  const currentMedia = medias[selectedIndex] || medias[0];
  const isVideo = isMediaVideo(currentMedia);
  const total = medias.length;

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    onSelectIndex((selectedIndex - 1 + total) % total);
  }, [selectedIndex, total, onSelectIndex]);

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    onSelectIndex((selectedIndex + 1) % total);
  }, [selectedIndex, total, onSelectIndex]);

  // Keyboard navigation inside modal
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, handlePrev, handleNext]);

  if (!medias || medias.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl lg:max-w-5xl w-[95vw] p-0 overflow-hidden rounded-2xl border-border bg-card shadow-2xl gap-0"
      >
        <div className="sr-only">
          <DialogTitle>{productName} Media Gallery</DialogTitle>
          <DialogDescription>
            Preview product photos and videos in high resolution
          </DialogDescription>
        </div>

        {/* 2-Column Shopee-style Modal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] lg:grid-cols-[1.7fr_1fr] h-[85vh] max-h-[680px]">
          {/* Left Column: Large Media Showcase with Floating Arrows */}
          <div className="relative flex items-center justify-center bg-black/95 dark:bg-black overflow-hidden h-full select-none">
            {isVideo ? (
              <video
                key={currentMedia.url}
                src={currentMedia.url}
                controls
                autoPlay
                playsInline
                className="w-full h-full max-h-[640px] object-contain"
              />
            ) : currentMedia?.url ? (
              <div className="relative w-full h-full p-4 flex items-center justify-center">
                <Image
                  src={currentMedia.url}
                  alt={currentMedia.altText || productName}
                  fill
                  sizes="(max-width: 768px) 100vw, 65vw"
                  className="object-contain p-2"
                  priority
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground/40 gap-2">
                <Package className="size-16" />
                <span className="text-xs">No media available</span>
              </div>
            )}

            {/* Navigation Arrows */}
            {total > 1 && (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handlePrev}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-xs transition-transform hover:scale-105 cursor-pointer z-10"
                >
                  <ChevronLeft className="size-6 stroke-[2.5]" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleNext}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-xs transition-transform hover:scale-105 cursor-pointer z-10"
                >
                  <ChevronRight className="size-6 stroke-[2.5]" />
                </Button>
              </>
            )}

            {/* Counter Badge */}
            <div className="absolute bottom-3 left-4 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-xs font-semibold tabular-nums z-10">
              {selectedIndex + 1} / {total}
            </div>
          </div>

          {/* Right Column: Title & Thumbnail Grid */}
          <div className="flex flex-col h-full bg-card border-t md:border-t-0 md:border-l border-border p-4 sm:p-5 overflow-y-auto">
            {/* Header info */}
            <div className="pb-4 border-b border-border/70 pr-8">
              <h2 className="text-sm sm:text-base font-bold text-foreground line-clamp-2 leading-snug">
                {productName}
              </h2>
            </div>

            {/* Thumbnails Section */}
            <div className="pt-4 flex-1">
              <div className="text-xs font-semibold text-muted-foreground mb-3 flex items-center justify-between">
                <span>All Media ({total})</span>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                {medias.map((media, idx) => {
                  const isCurrent = idx === selectedIndex;
                  const itemIsVideo = isMediaVideo(media);
                  const thumbSrc = getMediaThumbnailUrl(media);

                  return (
                    <button
                      key={media.mediaId || media.url || idx}
                      type="button"
                      onClick={() => onSelectIndex(idx)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 bg-muted/20 transition-all duration-200 cursor-pointer focus-visible:outline-none ${
                        isCurrent
                          ? 'border-primary shadow-2xs'
                          : 'border-border/60 hover:border-primary/60 opacity-80 hover:opacity-100'
                      }`}
                    >
                      {thumbSrc ? (
                        <Image
                          src={thumbSrc}
                          alt={media.altText || `${productName} thumbnail ${idx + 1}`}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted/40">
                          {itemIsVideo ? (
                            <VideoIcon className="size-5 text-muted-foreground" />
                          ) : (
                            <Package className="size-5 text-muted-foreground" />
                          )}
                        </div>
                      )}

                      {/* Video indicator badge */}
                      {itemIsVideo && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <div className="rounded-full bg-black/60 p-1 text-white shadow-2xs">
                            <Play className="size-3 fill-white" />
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
