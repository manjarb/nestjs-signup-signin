import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import FormInput from './FormInput';
import { cloneElement } from 'react';

const Wrapper = ({ children }: { children: React.ReactElement }) => {
  const methods = useForm();
  const childWithProps = cloneElement(children, {
    control: methods.control,
  });
  return <FormProvider {...methods}>{childWithProps}</FormProvider>;
};

describe('FormInput', () => {
  it('should render the input field with the correct label', () => {
    render(
      <Wrapper>
        <FormInput name="email" control={{}} label="Email Address" />
      </Wrapper>,
    );

    const inputElement = screen.getByLabelText('Email Address');
    expect(inputElement).toBeInTheDocument();
  });

  it('should render the input field with the correct default value', () => {
    render(
      <Wrapper>
        <FormInput
          name="email"
          control={{}}
          label="Email Address"
          defaultValue="test@example.com"
        />
      </Wrapper>,
    );

    const inputElement = screen.getByDisplayValue('test@example.com');
    expect(inputElement).toBeInTheDocument();
  });

  it('should display an error message when there is a validation error', () => {
    const TestComponent = () => {
      const methods = useForm({
        defaultValues: {
          email: '',
        },
      });

      methods.setError('email', {
        type: 'manual',
        message: 'Invalid email address',
      });

      return (
        <FormProvider {...methods}>
          <FormInput name="email" control={methods.control} label="Email Address" />
        </FormProvider>
      );
    };

    render(<TestComponent />);

    const errorMessage = screen.getByText('Invalid email address');
    expect(errorMessage).toBeInTheDocument();
  });
});
