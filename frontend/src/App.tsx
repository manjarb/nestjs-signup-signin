import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';

// Lazy-load the components for code splitting
const SignupPage = lazy(() => import('./pages/Signup/SignupPage'));
const SigninPage = lazy(() => import('./pages/Signin/SigninPage'));
const ApplicationPage = lazy(
  () => import('./pages/Application/ApplicationPage'),
);

function LoadingSpinner() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress />
    </Box>
  );
}

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Navigate to="/signup" />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/application" element={<ApplicationPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
