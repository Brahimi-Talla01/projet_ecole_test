import { z } from 'zod';

// Définition du schéma de validation
const envSchema = z.object({
      apiUrl: z.string().url(),
      isDev: z.boolean(),
      isProd: z.boolean(),
});

// Logique d'extration des variables
const nodeEnv = process.env.NODE_ENV || 'development';

export const env = envSchema.parse({
      apiUrl: process.env.NEXT_PUBLIC_API_URL,
      isDev: nodeEnv === 'development',
      isProd: nodeEnv === 'production',
});