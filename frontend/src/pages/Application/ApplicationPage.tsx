import { Box, Container, Typography } from '@mui/material';
import { useAuthStore } from '../../store/auth/useAuthStore';

function ApplicationPage() {
  const { user } = useAuthStore();
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Welcome to the Application
      </Typography>
      {user ? (
        <Box>
          <Typography variant="h6">Hello, {user.name}!</Typography>
          <Typography>Email: {user.email}</Typography>
        </Box>
      ) : (
        <Typography>
          You are not logged in. Please sign in to access the application.
        </Typography>
      )}
    </Container>
  );
}

export default ApplicationPage;
