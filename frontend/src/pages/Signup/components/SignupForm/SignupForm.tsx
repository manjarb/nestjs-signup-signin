import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, CircularProgress } from '@mui/material';
import { z } from 'zod';
import { signupSchema } from '../../../../validations/signupValidation';
import FormInput from '../../../../components/FormInput/FormInput';

export type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  isLoading: boolean;
  onSubmit: (data: SignupFormData) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ isLoading, onSubmit }) => {
  const { handleSubmit, control } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onFormSubmit = (data: SignupFormData) => {
    onSubmit(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onFormSubmit)} noValidate>
      <FormInput name="name" control={control} label="Name" />
      <FormInput name="email" control={control} label="Email" />
      <FormInput
        name="password"
        control={control}
        label="Password"
        type="password"
      />
      <FormInput
        name="confirmPassword"
        control={control}
        label="Confirm Password"
        type="password"
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isLoading}
        startIcon={isLoading ? <CircularProgress size={20} /> : null}
      >
        Sign Up
      </Button>
    </Box>
  );
};

export default SignupForm;
