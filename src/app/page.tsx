import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Image
        src="https://placehold.co/1920x1080"
        alt="A cozy library with shelves full of books"
        data-ai-hint="cozy library"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2">
            <Icons.logo className="h-8 w-8 text-primary" />
            <span className="font-headline text-2xl font-bold text-foreground">
              LiteraryLens
            </span>
          </div>
        </header>
        <main className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="container mx-auto px-4">
            <h1 className="font-headline text-5xl font-bold tracking-tight text-foreground md:text-7xl">
              Discover Your Next Favorite Book
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/80 md:text-xl">
              Our AI-powered engine analyzes your unique tastes to provide personalized book recommendations. Stop searching, start reading.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="font-headline text-lg">
                <Link href="/dashboard">Find Your Next Read</Link>
              </Button>
            </div>
          </div>
        </main>
        <footer className="py-6 text-center text-sm text-foreground/60">
          <p>&copy; {new Date().getFullYear()} LiteraryLens. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
