'use server';
/**
 * @fileOverview Explains why a book was recommended to a user.
 *
 * - explainRecommendation - A function that generates an explanation for a book recommendation.
 * - ExplainRecommendationInput - The input type for the explainRecommendation function.
 * - ExplainRecommendationOutput - The return type for the explainRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainRecommendationInputSchema = z.object({
  bookTitle: z.string().describe('The title of the book that was recommended.'),
  userProfile: z.string().describe('The user profile, including their interests, favorite genres, and past behavior.'),
});
export type ExplainRecommendationInput = z.infer<typeof ExplainRecommendationInputSchema>;

const ExplainRecommendationOutputSchema = z.object({
  explanation: z.string().describe('The explanation of why the book was recommended to the user.'),
});
export type ExplainRecommendationOutput = z.infer<typeof ExplainRecommendationOutputSchema>;

export async function explainRecommendation(input: ExplainRecommendationInput): Promise<ExplainRecommendationOutput> {
  return explainRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainRecommendationPrompt',
  input: {schema: ExplainRecommendationInputSchema},
  output: {schema: ExplainRecommendationOutputSchema},
  prompt: `You are an AI book recommendation expert. A user has been recommended the book "{{{bookTitle}}}". Based on the following user profile:

{{{userProfile}}}

Explain why this book was recommended to the user. Focus on how the book aligns with their interests, favorite genres, and past behavior.`,
});

const explainRecommendationFlow = ai.defineFlow(
  {
    name: 'explainRecommendationFlow',
    inputSchema: ExplainRecommendationInputSchema,
    outputSchema: ExplainRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
