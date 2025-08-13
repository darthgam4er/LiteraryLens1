'use client';

import BookCard from '@/components/book-card';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Recommendation } from '@/lib/types';
import { Search } from 'lucide-react';

type RecommendationDashboardProps = {
  recommendations: Recommendation[];
  onReset: () => void;
};

export default function RecommendationDashboard({
  recommendations,
  onReset,
}: RecommendationDashboardProps) {
  return (
    <div className="min-h-screen w-full bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex items-center gap-2">
            <Icons.logo className="h-8 w-8 text-primary" />
            <span className="font-headline text-2xl font-bold text-foreground">
              LiteraryLens
            </span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-1">
              <Button onClick={onReset} variant="outline" className="font-headline">
                Start Over
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div>
          <h1 className="font-headline text-4xl font-bold">Your Personal Bookshelf</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Based on your interests, here are some books we think you'll love.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {recommendations.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </main>
       <footer className="py-6 text-center text-sm text-foreground/60">
          <p>&copy; {new Date().getFullYear()} LiteraryLens. All rights reserved.</p>
        </footer>
    </div>
  );
}
