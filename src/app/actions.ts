'use server';

import { getPinRecommendations } from '@/ai/flows/ai-security-advisor';
import { z } from 'zod';

export async function getPinAdvice(pin: string) {
  if (pin.length < 2) return { recommendations: "" };
  try {
    const result = await getPinRecommendations({ userInput: pin });
    return result;
  } catch (error) {
    console.error(error);
    return { recommendations: "Could not get recommendations at this time." };
  }
}

const sendEmailSchema = z.object({
    to: z.string().email(),
    subject: z.string().min(1, "Subject is required."),
    body: z.string().min(1, "Body is required."),
    pin: z.string().min(4, "PIN must be at least 4 digits."),
});

// This is a mock action. It doesn't actually send an email.
// The client will use a local store to simulate the inbox.
export async function sendEmail(data: {to: string, subject: string, body: string, pin: string}) {
    const validation = sendEmailSchema.safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }
    
    console.log("Simulating sending email:", validation.data);
    
    return { success: true };
}
