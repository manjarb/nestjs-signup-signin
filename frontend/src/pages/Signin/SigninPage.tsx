import {
  Alert,
  Box,
  Card,
  CardContent,
  Container,
  Link,
  Typography,
} from '@mui/material';
import SigninForm from './components/SigninForm/SigninForm';
import { useNavigate } from 'react-router-dom';
import { useSignin } from './hooks/useSignin';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { SigninFormData } from '../../validations/signinValidation';

function SigninPage() {
  const { signin, isLoading, error } = useSignin();
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSignin = async(data: SigninFormData) => {
    const result = await signin(data);
    if (result) {
      const { user, accessToken, refreshToken } = result;
      setAuth(user, accessToken, refreshToken);
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
              Sign In
            </Typography>
            <SigninForm onSubmit={handleSignin} isLoading={isLoading} />
            {error && (
              <Alert severity="error" role="alert" aria-live="assertive">
                {error}
              </Alert>
            )}
          </CardContent>
        </Card>
      </Box>

      <Typography variant="body2" align="center">
        Don't have an account?{' '}
        <Link
          onClick={() => navigate('/signup')}
          style={{ cursor: 'pointer' }}
          role="link"
          tabIndex={0}
          aria-label="Navigate to Sign Up page"
        >
          Sign Up
        </Link>
      </Typography>
    </Container>
  );
}

export default SigninPage;
