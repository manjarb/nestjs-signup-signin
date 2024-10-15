import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, CircularProgress } from '@mui/material';
import {
  SignupFormData,
  signupSchema,
} from '../../../../validations/signupValidation';
import FormInput from '../../../../components/FormInput/FormInput';

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
    <Box
      component="form"
      onSubmit={handleSubmit(onFormSubmit)}
      noValidate
      // Announce form status updates for screen readers
      aria-live="polite"
    >
      <FormInput
        name="name"
        control={control}
        label="Name"
        aria-label="Enter your name"
        aria-required="true"
        aria-describedby="name-error"
      />
      <FormInput
        name="email"
        control={control}
        label="Email"
        aria-label="Enter your email address"
        aria-required="true"
        aria-describedby="email-error"
      />
      <FormInput
        name="password"
        control={control}
        label="Password"
        type="password"
        aria-label="Enter your password"
        aria-required="true"
        aria-describedby="password-error"
      />
      <FormInput
        name="confirmPassword"
        control={control}
        label="Confirm Password"
        type="password"
        aria-label="Re-enter your password to confirm"
        aria-required="true"
        aria-describedby="confirm-password-error"
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="success"
        sx={{ mt: 3, mb: 2 }}
        disabled={isLoading}
        aria-busy={isLoading ? 'true' : 'false'}
        aria-disabled={isLoading ? 'true' : 'false'}
        aria-label="Sign Up button"
        startIcon={isLoading ? <CircularProgress size={20} /> : null}
      >
        Sign Up
      </Button>
    </Box>
  );
};

export default SignupForm;
