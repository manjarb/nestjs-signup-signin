import { z } from 'zod';
import { passwordSchema } from './passwordValidation';

export const signinSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: passwordSchema,
});

export type SigninFormData = z.infer<typeof signinSchema>;
