import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import {
  SigninPayload,
  SigninResponseData,
} from '../../../interfaces/auth.interface';
import { GenericResponse } from '../../../interfaces/general.interface';
import config from '../../../configs/config';
import { SigninFormData } from '../../../validations/signinValidation';

export const useSignin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const computeSigninPayload = (data: SigninFormData): SigninPayload => {
    const { email, password } = data;
    return { email, password };
  };

  const signin = async(
    data: SigninFormData,
  ): Promise<SigninResponseData | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post<GenericResponse<SigninResponseData>>(
        `${config.apiBaseUrl}/v1/auth/signin`,
        computeSigninPayload(data),
      );
      return response.data.data;
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        setError(
          err.response.data?.message || 'Signin failed. Please try again.',
        );
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { signin, isLoading, error };
};
