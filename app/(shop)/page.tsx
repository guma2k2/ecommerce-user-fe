import React from 'react';
import type { Metadata } from 'next';
import { CategorySidebar } from '@/features/categories';
import { PromoBanner, BestSellersSection } from '@/features/home';

export const metadata: Metadata = {
  title: 'Storefront | Discover Authentic Tech & Lifestyle Products',
  description: 'Shop genuine laptops, electronics, and lifestyle products with fast shipping and authentic warranty.',
};

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10 max-w-7xl">
      {/* Top Section: Left Category Sidebar + Right Promo Banner */}
      <section className="flex flex-col lg:flex-row gap-6 items-stretch">
        {/* Left Sidebar: Parent Categories */}
        <CategorySidebar />

        {/* Right Hero Banner */}
        <div className="flex-1 min-w-0">
          <PromoBanner className="h-full" />
        </div>
      </section>

      {/* Best Seller Products Section */}
      <BestSellersSection limit={8} />
    </div>
  );
}
