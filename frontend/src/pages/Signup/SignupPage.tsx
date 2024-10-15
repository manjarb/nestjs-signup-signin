import { Alert, Box, Card, CardContent, Container, Link, Typography } from '@mui/material';
import SignupForm from './components/SignupForm/SignupForm';
import { useNavigate } from 'react-router-dom';
import { useSignup } from './hooks/useSignup';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { SignupFormData } from '../../validations/signupValidation';

function SignupPage() {
  const { signup, isLoading, error } = useSignup();
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSignup = async(data: SignupFormData) => {
    const result = await signup(data);
    if (result) {
      const { user, accessToken, refreshToken } = result;
      setAuth(
        user,
        accessToken,
        refreshToken,
      );
      navigate('/application');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        component="section"
        sx={{
          marginTop: 8,
          marginBottom: 2,
        }}
      >
        <Card sx={{ width: '100%' }}>
          <CardContent>
            <Typography
              component="h1"
              variant="h5"
              align="center"
              gutterBottom
              role="heading"
              aria-level={1}
            >
              Sign Up
            </Typography>
            <SignupForm onSubmit={handleSignup} isLoading={isLoading} />
            {error && (
              <Alert severity="error" role="alert" aria-live="assertive">
                {error}
              </Alert>
            )}
          </CardContent>
        </Card>
      </Box>

      <Typography variant="body2" align="center">
        Already have an account?{' '}
        <Link
          onClick={() => navigate('/signin')}
          style={{ cursor: 'pointer' }}
          role="link"
          tabIndex={0}
          aria-label="Navigate to Sign In page"
        >
          Sign In
        </Link>
      </Typography>
    </Container>
  );
}

export default SignupPage;
