import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, CircularProgress } from '@mui/material';
import FormInput from '../../../../components/FormInput/FormInput';
import { SigninFormData, signinSchema } from '../../../../validations/signinValidation';


interface SigninFormProps {
  isLoading: boolean;
  onSubmit: (data: SigninFormData) => void;
}

const SigninForm: React.FC<SigninFormProps> = ({ isLoading, onSubmit }) => {
  const { handleSubmit, control } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
  });

  const onFormSubmit = (data: SigninFormData) => {
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
        name="email"
        control={control}
        label="Email"
        aria-label="Enter your email address"
        aria-describedby="email-error"
        aria-required={true}
      />
      <FormInput
        name="password"
        control={control}
        label="Password"
        type="password"
        aria-label="Enter your password"
        aria-describedby="password-error"
        aria-required={true}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isLoading}
        aria-busy={isLoading ? 'true' : 'false'}
        aria-disabled={isLoading ? 'true' : 'false'}
        aria-label="Sign In button"
        startIcon={isLoading ? <CircularProgress size={20} /> : null}
      >
        Sign In
      </Button>
    </Box>
  );
};

export default SigninForm;
