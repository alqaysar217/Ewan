'use server';

/**
 * @fileOverview This file defines a Genkit flow to suggest compatible versions of a missing module based on the Next.js version.
 *
 * - suggestCompatibleVersions - A function that suggests compatible versions for a given Next.js version and module.
 * - SuggestCompatibleVersionsInput - The input type for the suggestCompatibleVersions function.
 * - SuggestCompatibleVersionsOutput - The return type for the suggestCompatibleVersions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCompatibleVersionsInputSchema = z.object({
  nextJsVersion: z.string().describe('The Next.js version of the project.'),
  missingModule: z.string().describe('The name of the missing module.'),
});
export type SuggestCompatibleVersionsInput = z.infer<typeof SuggestCompatibleVersionsInputSchema>;

const SuggestCompatibleVersionsOutputSchema = z.object({
  suggestedVersions: z.string().describe('Suggested compatible versions of the module.'),
});
export type SuggestCompatibleVersionsOutput = z.infer<typeof SuggestCompatibleVersionsOutputSchema>;

export async function suggestCompatibleVersions(input: SuggestCompatibleVersionsInput): Promise<SuggestCompatibleVersionsOutput> {
  return suggestCompatibleVersionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCompatibleVersionsPrompt',
  input: {schema: SuggestCompatibleVersionsInputSchema},
  output: {schema: SuggestCompatibleVersionsOutputSchema},
  prompt: `You are a helpful AI assistant that suggests compatible versions for a missing module based on the Next.js version.

  Next.js Version: {{{nextJsVersion}}}
  Missing Module: {{{missingModule}}}

  Based on the Next.js version and the missing module, suggest compatible versions for the module. Provide a concise answer.
  `,
});

const suggestCompatibleVersionsFlow = ai.defineFlow(
  {
    name: 'suggestCompatibleVersionsFlow',
    inputSchema: SuggestCompatibleVersionsInputSchema,
    outputSchema: SuggestCompatibleVersionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
