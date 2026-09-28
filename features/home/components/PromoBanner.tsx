'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { ROUTES } from '@/shared/constants';
import { Button } from '@/components/ui';

interface PromoBannerProps {
  className?: string;
}

export function PromoBanner({ className = '' }: PromoBannerProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground p-6 sm:p-8 md:p-10 shadow-lg flex flex-col justify-between min-h-[320px] lg:min-h-[380px] ${className}`}
    >
      {/* Background Decorative Blobs */}
      <div className="absolute -right-16 -top-16 size-64 sm:size-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute right-1/4 -bottom-20 size-60 rounded-full bg-black/10 blur-2xl pointer-events-none" />

      {/* Top Tag */}
      <div className="relative z-10 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md text-white shadow-2xs">
          <Sparkles className="size-3.5" />
          Special Mega Launch Promo
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/90 text-amber-950 px-2.5 py-0.5 text-xs font-bold">
          <Zap className="size-3" /> Up to 40% OFF
        </span>
      </div>

      {/* Hero Headline & Description */}
      <div className="relative z-10 my-4 max-w-xl space-y-3">
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight drop-shadow-xs">
          Next-Gen Tech, <br className="hidden sm:inline" />
          Unbeatable Value.
        </h2>
        <p className="text-sm sm:text-base text-primary-foreground/90 max-w-md font-medium leading-relaxed">
          Upgrade your workspace with flagship laptops, smartphones, and audio gear. Authentic warranty and fast delivery guaranteed.
        </p>
      </div>

      {/* Action CTA & Highlights */}
      <div className="relative z-10 flex flex-wrap items-center gap-4 pt-2">
        <Link href={ROUTES.SHOP.SEARCH}>
          <Button
            size="lg"
            variant="secondary"
            className="rounded-xl font-bold shadow-md hover:shadow-lg hover:scale-102 transition-all gap-2"
          >
            <span>Explore Deals</span>
            <ArrowRight className="size-4" />
          </Button>
        </Link>

        <div className="flex items-center gap-4 text-xs font-medium text-primary-foreground/90">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="size-4" />
            <span>100% Genuine</span>
          </div>
          <span className="text-primary-foreground/40">•</span>
          <span>Free Return 30 Days</span>
        </div>
      </div>
    </div>
  );
}
