'use server';

import { generateRecommendations } from '@/ai/flows/generate-recommendations';
import type { Book, Recommendation } from '@/lib/types';
import { z } from 'zod';

const OnboardingSchema = z.object({
  age: z.string().optional(),
  country: z.string().optional(),
  genres: z.array(z.string()).min(1, 'Please select at least one genre.'),
  interests: z.string().min(10, 'Please tell us a bit more about your interests.'),
  favorites: z.string().optional(),
});

type OnboardingData = z.infer<typeof OnboardingSchema>;

export async function getRecommendations(
  userInput: OnboardingData
): Promise<Recommendation[]> {
  // 1. Construct a detailed user profile
  const userProfile = `
    Selected Genres: ${userInput.genres.join(', ')}
    User Interests: ${userInput.interests}
    Favorite Books/Authors Mentioned: ${userInput.favorites || 'None'}
  `;

  // 2. Generate book recommendations using the new flow
  const recommendationResult = await generateRecommendations({ userProfile });
  
  // 3. Map to the final recommendation format
  // The cover image and explanation will be handled on the client side now.
  const finalRecommendations: Recommendation[] = recommendationResult.recommendations.map((rec, index) => ({
    ...rec,
    id: index, // Assign a temporary ID
    coverImage: '', // Will be fetched on the client
    explanation: `This book is recommended based on your interest in ${rec.genres.join(' and ')}.`, // Generic explanation
    amazonLink: `https://www.amazon.com/s?k=${encodeURIComponent(rec.title + ' ' + rec.author)}`,
    isbn: '' // Will be fetched on the client if needed
  }));

  return finalRecommendations;
}
