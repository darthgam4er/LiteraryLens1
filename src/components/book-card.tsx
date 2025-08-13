
'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Star, ShoppingCart, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Recommendation } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

function renderStars(rating: number) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="h-4 w-4 fill-amber-400 text-amber-400" />
      ))}
      {halfStar && (
        <Star
          key="half"
          className="h-4 w-4 fill-amber-400 text-amber-400"
          style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0% 100%)' }}
        />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      ))}
      <span className="ml-2 text-sm text-muted-foreground">({rating.toFixed(1)})</span>
    </div>
  );
}

export default function BookCard({ book }: { book: Recommendation }) {
  const [feedback, setFeedback] = useState<null | 'liked' | 'disliked'>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [isLoadingCover, setIsLoadingCover] = useState(true);

  useEffect(() => {
    async function fetchCover() {
      if (!book.title || !book.author) {
        setIsLoadingCover(false);
        return;
      }
      setIsLoadingCover(true);
      try {
        const res = await fetch(
          `https://openlibrary.org/search.json?title=${encodeURIComponent(book.title)}&author=${encodeURIComponent(book.author)}`
        );
        const data = await res.json();

        if (data.docs && data.docs.length > 0) {
          const bookData = data.docs[0];
          let cover = null;
          if (bookData.cover_i) {
            cover = `https://covers.openlibrary.org/b/id/${bookData.cover_i}-L.jpg`;
          } else if (bookData.isbn && bookData.isbn.length > 0) {
            cover = `https://covers.openlibrary.org/b/isbn/${bookData.isbn[0]}-L.jpg`;
          }
          setCoverUrl(cover);
        }
      } catch (error) {
        console.error('Error fetching cover:', error);
        setCoverUrl(null);
      } finally {
        setIsLoadingCover(false);
      }
    }

    fetchCover();
  }, [book.title, book.author]);


  const amazonLink = `https://www.amazon.com/s?k=${encodeURIComponent(book.title + " " + book.author)}`;

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105">
      <CardHeader className="p-0">
        <Link href={amazonLink || '#'} target="_blank" rel="noopener noreferrer" className="block">
          <div className="relative h-64 w-full bg-secondary">
            {isLoadingCover ? (
              <Skeleton className="h-full w-full" />
            ) : coverUrl ? (
              <Image
                src={coverUrl}
                alt={`Cover of ${book.title}`}
                data-ai-hint="book cover"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={() => setCoverUrl(null)}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted p-4 text-center">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
                <p className="font-headline text-lg font-semibold text-muted-foreground">{book.title}</p>
              </div>
            )}
          </div>
        </Link>
        <div className="p-4">
          <CardTitle className="font-headline text-xl leading-tight">
            <Link href={amazonLink || '#'} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {book.title}
            </Link>
          </CardTitle>
          <p className="text-sm text-muted-foreground">{book.author}</p>
          <div className="mt-2 flex items-center gap-2">{renderStars(book.rating)}</div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0">
        <p className="text-sm leading-relaxed text-foreground/80">{book.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {book.genres.map((genre) => (
            <Badge key={genre} variant="secondary">
              {genre}
            </Badge>
          ))}
        </div>
        <Accordion type="single" collapsible className="mt-4 w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-sm font-semibold">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                Why it's recommended for you
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-foreground/90">
              {book.explanation}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <Button asChild variant="outline" size="sm">
          <Link href={amazonLink || '#'} target="_blank" rel="noopener noreferrer">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Buy on Amazon
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFeedback(feedback === 'disliked' ? null : 'disliked')}
            className={cn('rounded-full', feedback === 'disliked' && 'bg-destructive/20 text-destructive')}
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFeedback(feedback === 'liked' ? null : 'liked')}
            className={cn('rounded-full', feedback === 'liked' && 'bg-primary/20 text-primary')}
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
