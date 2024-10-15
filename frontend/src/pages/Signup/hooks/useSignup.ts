import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { SignupPayload, SignupResponseData } from '../../../interfaces/auth.interface';
import { GenericResponse } from '../../../interfaces/general.interface';
import config from '../../../configs/config';
import { SignupFormData } from '../components/SignupForm/SignupForm';

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const computeSignupPayload = (data: SignupFormData): SignupPayload => {
    const { name, email, password } = data;
    return { name, email, password };
  };

  const signup = async(
    data: SignupFormData,
  ): Promise<SignupResponseData | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post<GenericResponse<SignupResponseData>>(
        `${config.apiBaseUrl}/v1/auth/signup`,
        computeSignupPayload(data),
      );
      return response.data.data;
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        setError(
          err.response.data?.message || 'Signup failed. Please try again.',
        );
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};
