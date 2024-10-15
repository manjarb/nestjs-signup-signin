import { Alert, Box, Card, CardContent, Container, Typography } from '@mui/material';
import SignupForm, { SignupFormData } from './components/SignupForm/SignupForm';
import { useNavigate } from 'react-router-dom';
import { useSignup } from './hooks/useSignup';
import { useAuthStore } from '../../store/auth/useAuthStore';

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
        sx={{
          marginTop: 8,
        }}
      >
        <Card sx={{ width: '100%' }}>
          <CardContent>
            <Typography component="h1" variant="h5" align="center" gutterBottom>
              Sign Up
            </Typography>
            <SignupForm onSubmit={handleSignup} isLoading={isLoading}/>
            {error && <Alert severity="error">{error}</Alert>}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default SignupPage;
