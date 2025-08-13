'use server';
/**
 * @fileOverview Generates book recommendations based on user profile.
 *
 * - generateRecommendations - A function that generates a list of book recommendations.
 * - GenerateRecommendationsInput - The input type for the generateRecommendations function.
 * - GenerateRecommendationsOutput - The return type for the generateRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BookRecommendationSchema = z.object({
    title: z.string().describe('The title of the recommended book.'),
    author: z.string().describe('The author of the recommended book.'),
    summary: z.string().describe('A short, compelling summary of the book (2-3 sentences).'),
    genres: z.array(z.string()).describe('A list of genres for the book.'),
    themes: z.array(z.string()).describe('A list of key themes in the book.'),
    rating: z.number().describe('An estimated rating for the book out of 5.'),
});

const GenerateRecommendationsInputSchema = z.object({
  userProfile: z.string().describe('The user profile, including their interests, favorite genres, and past behavior.'),
});
export type GenerateRecommendationsInput = z.infer<typeof GenerateRecommendationsInputSchema>;

const GenerateRecommendationsOutputSchema = z.object({
  recommendations: z.array(BookRecommendationSchema).max(10).describe('A list of 10 book recommendations.'),
});
export type GenerateRecommendationsOutput = z.infer<typeof GenerateRecommendationsOutputSchema>;


export async function generateRecommendations(input: GenerateRecommendationsInput): Promise<GenerateRecommendationsOutput> {
  return generateRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecommendationsPrompt',
  input: {schema: GenerateRecommendationsInputSchema},
  output: {schema: GenerateRecommendationsOutputSchema},
  prompt: `You are an AI book recommendation expert. Based on the following user profile, generate a list of 10 unique and interesting book recommendations. Do not repeat books. For each book, provide a title, author, a short 2-3 sentence summary, a list of genres, key themes, and an estimated rating.

User Profile:
{{{userProfile}}}

Ensure the recommendations are tailored to the user's specific interests and desired tone.`,
});


const generateRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateRecommendationsFlow',
    inputSchema: GenerateRecommendationsInputSchema,
    outputSchema: GenerateRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
