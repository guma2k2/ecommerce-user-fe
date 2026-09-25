import Link from "next/link";
import { UserNav } from "@/features/auth";
import { SearchBar } from "@/features/search";
import { Button } from "@/components/ui";
import { ROUTES } from "@/shared/constants";
import { Sparkles, Compass, Laptop, Smartphone, Headphones, Watch } from "lucide-react";

const POPULAR_SEARCHES = ["iPhone 15", "Gaming Laptop", "MacBook Pro", "Sony WH-1000XM5", "Asus ROG"];

const FEATURED_CATEGORIES = [
  { name: "Smartphones", slug: "smartphones", icon: Smartphone, count: "120+ products" },
  { name: "Laptops", slug: "laptops", icon: Laptop, count: "85+ products" },
  { name: "Audio & Headphones", slug: "audio", icon: Headphones, count: "60+ products" },
  { name: "Smartwatches", slug: "smartwatches", icon: Watch, count: "45+ products" },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-8 max-w-7xl">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center gap-2 font-bold text-xl tracking-tight shrink-0">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-extrabold text-sm shadow-xs">
              E
            </div>
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Storefront</span>
          </Link>

          {/* Header Search Bar (Desktop) */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <SearchBar placeholder="Search genuine products, brands..." />
          </div>

          {/* Right Navigation */}
          <nav className="flex items-center gap-3">
            <Link href={ROUTES.SHOP.SEARCH} className="hidden sm:inline-flex">
              <Button variant="ghost" size="sm" className="gap-1.5 font-medium">
                <Compass className="size-4 text-primary" />
                <span>Explore Catalog</span>
              </Button>
            </Link>
            <UserNav />
          </nav>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="md:hidden px-4 pb-3">
          <SearchBar placeholder="Search products..." />
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-24 text-center">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" />
            <span>Storefront Search & Discovery Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Find Products with <br className="hidden sm:inline" />
            <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Lightning Speed & Accuracy
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience real-time autocomplete suggestions, category faceted filtering (Color, RAM, Brand, Price Range), and SEO-optimized product discovery.
          </p>

          {/* Hero Search Bar */}
          <div className="pt-2 max-w-xl mx-auto">
            <SearchBar size="lg" placeholder="Try searching for 'iPhone', 'Dell', 'Asus'..." autoFocus />

            {/* Popular search tags */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-3">
              <span className="text-xs text-muted-foreground mr-1">Trending:</span>
              {POPULAR_SEARCHES.map((query) => (
                <Link
                  key={query}
                  href={`${ROUTES.SHOP.SEARCH}?keyword=${encodeURIComponent(query)}`}
                  className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-primary transition-colors bg-muted/50 hover:bg-muted px-2 py-0.5 rounded-md"
                >
                  {query}
                </Link>
              ))}
            </div>
          </div>

          {/* Featured Categories (CellphoneS & FPT Shop Style) */}
          <div className="pt-8">
            <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-4">
              Browse by Category
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              {FEATURED_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.slug}
                    href={ROUTES.SHOP.CATEGORY_DETAIL(cat.slug)}
                    className="group flex flex-col justify-between p-4 rounded-2xl border border-border/80 bg-card/60 hover:bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {cat.name}
                      </h2>
                      <span className="text-[11px] text-muted-foreground">{cat.count}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Direct CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-border/60">
            <Link href={ROUTES.SHOP.SEARCH}>
              <Button size="lg" className="rounded-xl shadow-xs gap-2">
                <Compass className="size-4" />
                Browse Entire Catalog
              </Button>
            </Link>
            <Link href={ROUTES.ACCOUNT.PROFILE}>
              <Button variant="outline" size="lg" className="rounded-xl">
                My Profile
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
