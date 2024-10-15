import { Container, Typography } from '@mui/material';

function ApplicationPage() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Welcome to the Application
      </Typography>
      <Typography>
        This is the main application page that users will see after signing in.
      </Typography>
    </Container>
  );
}

export default ApplicationPage;
