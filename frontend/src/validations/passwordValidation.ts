import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .regex(/[a-zA-Z]/, { message: 'Password must contain at least one letter' })
  .regex(/\d/, { message: 'Password must contain at least one number' })
  .regex(/[^a-zA-Z0-9]/, {
    message: 'Password must contain at least one special character',
  });
