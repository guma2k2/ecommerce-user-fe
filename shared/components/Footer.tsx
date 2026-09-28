import React from 'react';

interface FooterProps {
  className?: string;
}

export function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={`border-t border-border/40 py-8 bg-muted/20 text-center text-xs text-muted-foreground mt-12 ${className}`}>
      <div className="container mx-auto px-4 max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>&copy; {new Date().getFullYear()} Storefront eCommerce. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <span>Authentic Products</span>
          <span>Fast Shipping</span>
          <span>24/7 Support</span>
        </div>
      </div>
    </footer>
  );
}
