import { z } from 'zod';
import { passwordSchema } from './passwordValidation';

export const signupSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z
      .string()
      .email('Invalid email address'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords don\'t match',
    path: ['confirmPassword'],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
