import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui';

interface AuthCardWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footerText?: string;
  footerLinkText?: string;
  footerLinkHref?: string;
}

export function AuthCardWrapper({
  title,
  description,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthCardWrapperProps) {
  return (
    <Card className="w-full max-w-md shadow-lg border-border/60 bg-card/95 backdrop-blur-sm">
      <CardHeader className="text-center space-y-1 pb-4">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl">
          E
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
      {footerText && footerLinkText && footerLinkHref && (
        <CardFooter className="flex justify-center border-t border-border/40 pt-4 text-xs text-muted-foreground">
          <span>{footerText}</span>
          <Link
            href={footerLinkHref}
            className="ml-1 font-semibold text-primary hover:underline"
          >
            {footerLinkText}
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
