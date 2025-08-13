// This file uses server-side code.
'use server';

/**
 * @fileOverview Analyzes user interests from free-form text input.
 *
 * This file defines a Genkit flow that takes free-form text describing a user's interests
 * and returns a structured analysis of those interests, including dominant themes and desired tone.
 *
 * @exports {
 *   analyzeInterests,
 *   AnalyzeInterestsInput,
 *   AnalyzeInterestsOutput
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Input schema for the analyzeInterests function.
 */
const AnalyzeInterestsInputSchema = z.object({
  interestsText: z.string().describe('A free-form text description of the user\'s interests.'),
});
export type AnalyzeInterestsInput = z.infer<typeof AnalyzeInterestsInputSchema>;

/**
 * Output schema for the analyzeInterests function.
 */
const AnalyzeInterestsOutputSchema = z.object({
  dominantThemes: z.array(z.string()).describe('A list of dominant themes identified in the user\'s interests.'),
  desiredTone: z.string().describe('The desired tone or mood expressed by the user (e.g., lighthearted, gritty, serious).'),
});
export type AnalyzeInterestsOutput = z.infer<typeof AnalyzeInterestsOutputSchema>;

/**
 * Analyzes user interests based on free-form text input.
 * @param input - The input containing the user's interests in text format.
 * @returns A promise resolving to the analysis of the user's interests.
 */
export async function analyzeInterests(input: AnalyzeInterestsInput): Promise<AnalyzeInterestsOutput> {
  return analyzeInterestsFlow(input);
}

const analyzeInterestsPrompt = ai.definePrompt({
  name: 'analyzeInterestsPrompt',
  input: {
    schema: AnalyzeInterestsInputSchema,
  },
  output: {
    schema: AnalyzeInterestsOutputSchema,
  },
  prompt: `You are an AI assistant designed to analyze user interests from free-form text.

  Your goal is to identify the dominant themes and the desired tone expressed in the user's input.

  Input: {{{interestsText}}}

  Output the dominant themes as a list of strings and the desired tone as a single string.
  The desired tone should be one of the following values: lighthearted, gritty, serious.

  Format your response as a JSON object matching the following schema:
  ${JSON.stringify(AnalyzeInterestsOutputSchema.shape, null, 2)}`,
});

const analyzeInterestsFlow = ai.defineFlow(
  {
    name: 'analyzeInterestsFlow',
    inputSchema: AnalyzeInterestsInputSchema,
    outputSchema: AnalyzeInterestsOutputSchema,
  },
  async input => {
    const {output} = await analyzeInterestsPrompt(input);
    return output!;
  }
);
