import React from 'react';
import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

interface FormInputProps {
  name: string;
  // eslint-disable-next-line
  control: any;
  label: string;
  type?: string;
  defaultValue?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  name,
  control,
  label,
  type = 'text',
  defaultValue = '',
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          label={label}
          type={type}
          fullWidth
          margin="normal"
          error={!!error}
          helperText={error ? error.message : null}
        />
      )}
    />
  );
};

export default FormInput;
