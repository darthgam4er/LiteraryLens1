// This file uses server-side code.
'use server';

/**
 * @fileOverview Finds a book cover image URL using the Open Library Covers API.
 *
 * This file defines a Genkit flow that takes a book's ISBN and constructs
 * a URL to its cover image. It uses a placeholder if no ISBN is provided.
 *
 * @exports {
 *   findBookCover,
 *   FindBookCoverInput,
 *   FindBookCoverOutput
 * }
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

/**
 * Input schema for the findBookCover function.
 */
const FindBookCoverInputSchema = z.object({
  isbn: z.string().optional().describe('The 10 or 13-digit ISBN of the book.'),
  title: z.string().describe('The title of the book, used for fallback.'),
});
export type FindBookCoverInput = z.infer<typeof FindBookCoverInputSchema>;

/**
 * Output schema for the findBookCover function.
 */
const FindBookCoverOutputSchema = z.object({
  cover_url: z.string().describe('The URL of the book cover image.'),
});
export type FindBookCoverOutput = z.infer<typeof FindBookCoverOutputSchema>;

/**
 * Finds a book cover URL from Open Library using an ISBN.
 * @param input - The input containing the book's ISBN and title.
 * @returns A promise resolving to the book cover URL.
 */
export async function findBookCover(input: FindBookCoverInput): Promise<FindBookCoverOutput> {
  return findBookCoverFlow(input);
}

const findBookCoverFlow = ai.defineFlow(
  {
    name: 'findBookCoverFlow',
    inputSchema: FindBookCoverInputSchema,
    outputSchema: FindBookCoverOutputSchema,
  },
  async (input) => {
    const fallbackImageUrl = `https://placehold.co/300x450.png`;

    if (input.isbn) {
      // Use Open Library Covers API. It doesn't require a key.
      // -L for large, -M for medium, -S for small
      const cover_url = `https://covers.openlibrary.org/b/isbn/${input.isbn}-L.jpg`;
      
      // We can't easily check if the image exists without making a client-side request
      // or a more complex server-side check. For now, we'll trust the URL is valid.
      // A more robust solution could involve a HEAD request to check for a 404.
      return { cover_url };
    }

    return { cover_url: fallbackImageUrl };
  }
);
