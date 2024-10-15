import { Box, Container, Typography } from '@mui/material';
import { useAuthStore } from '../../store/auth/useAuthStore';

function ApplicationPage() {
  const { user } = useAuthStore();
  return (
    <Container>
      <Typography variant="h4" gutterBottom role="heading" aria-level={1}>
        Welcome to the Application
      </Typography>
      {user ? (
        <Box>
          <Typography
            variant="h6"
            role="heading"
            aria-level={2}
            aria-live="polite"
          >
            Hello, {user.name}!
          </Typography>
          <Typography aria-label={`Email: ${user.email}`}>
            Email: {user.email}
          </Typography>
        </Box>
      ) : (
        <Typography aria-live="assertive" role="alert">
          You are not logged in. Please sign in to access the application.
        </Typography>
      )}
    </Container>
  );
}

export default ApplicationPage;
