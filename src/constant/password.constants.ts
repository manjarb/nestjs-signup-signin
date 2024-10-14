export const PASSWORD_REGEX =
  /(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}/;

export const PASSWORD_ERROR_MESSAGE =
  'Password must contain at least one letter, one number, and one special character, with a minimum length of 8 characters.';
