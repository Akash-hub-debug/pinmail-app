'use server';

/**
 * @fileOverview An AI-powered security advisor for PIN creation.
 *
 * - getPinRecommendations - A function that provides recommendations for creating a strong PIN.
 * - GetPinRecommendationsInput - The input type for the getPinRecommendations function.
 * - GetPinRecommendationsOutput - The return type for the getPinRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetPinRecommendationsInputSchema = z.object({
  userInput: z
    .string()
    .describe('User provided PIN or description of desired PIN.'),
});
export type GetPinRecommendationsInput = z.infer<
  typeof GetPinRecommendationsInputSchema
>;

const GetPinRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('AI-powered recommendations for creating a strong PIN based on user input.'),
});
export type GetPinRecommendationsOutput = z.infer<
  typeof GetPinRecommendationsOutputSchema
>;

export async function getPinRecommendations(
  input: GetPinRecommendationsInput
): Promise<GetPinRecommendationsOutput> {
  return getPinRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getPinRecommendationsPrompt',
  input: {schema: GetPinRecommendationsInputSchema},
  output: {schema: GetPinRecommendationsOutputSchema},
  prompt: `You are an AI-powered security advisor that provides recommendations for creating strong PINs.

  Based on the user's input, provide specific and actionable recommendations to enhance the PIN's security.
  Consider factors such as length, complexity, common patterns, and personal information that should be avoided.

  User Input: {{{userInput}}}

  Recommendations:`, 
});

const getPinRecommendationsFlow = ai.defineFlow(
  {
    name: 'getPinRecommendationsFlow',
    inputSchema: GetPinRecommendationsInputSchema,
    outputSchema: GetPinRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
