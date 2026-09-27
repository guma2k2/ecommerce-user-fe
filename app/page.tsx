import React from 'react';
import { Header } from '@/components/layout';
import { CategorySidebar } from '@/features/categories';
import { PromoBanner, BestSellersSection } from '@/components/home';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* 1. Fixed / Sticky Header */}
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10 max-w-7xl">
        {/* 2 & 3. Top Section: Left Category Sidebar + Right Promo Banner */}
        <section className="flex flex-col lg:flex-row gap-6 items-stretch">
          {/* Left Sidebar: Parent Categories */}
          <CategorySidebar />

          {/* Right Hero Banner */}
          <div className="flex-1 min-w-0">
            <PromoBanner className="h-full" />
          </div>
        </section>

        {/* 4. Best Seller Products Section */}
        <BestSellersSection limit={8} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 bg-muted/20 text-center text-xs text-muted-foreground mt-12">
        <div className="container mx-auto px-4 max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} Storefront eCommerce. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Authentic Products</span>
            <span>Fast Shipping</span>
            <span>24/7 Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
