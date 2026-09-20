import Link from "next/link";
import { UserNav } from "@/features/auth";
import { Button } from "@/components/ui";
import { ROUTES } from "@/shared/constants";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-extrabold text-sm">
              E
            </div>
            <span>Storefront</span>
          </div>

          <nav className="flex items-center gap-4">
            <UserNav />
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            Storefront Customer Portal
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Customer Authentication & Profile Platform
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Complete authentication lifecycle integrated with backend APIs: Sign In, Sign Up, Email OTP Verification, Social Login (Google, Facebook, GitHub), Password Recovery, Silent Refresh, and Customer Profile Management.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link href={ROUTES.AUTH.LOGIN}>
              <Button size="lg">Sign In</Button>
            </Link>
            <Link href={ROUTES.AUTH.REGISTER}>
              <Button variant="outline" size="lg">Create Account</Button>
            </Link>
            <Link href={ROUTES.ACCOUNT.PROFILE}>
              <Button variant="secondary" size="lg">My Profile</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
