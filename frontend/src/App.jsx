import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage.jsx';
import RegisterPage from './pages/Auth/RegisterPages.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import DashboardPage from './pages/Dashboard/DashboardPage.jsx';
import DocumemntListPage from './pages/Documents/DocumentListPage.jsx';
import DocumentDetailPage from './pages/Documents/DocumentDetailPage.jsx';
import FlashcardsListPage from './pages/Flashcards/FlashcardsListPage.jsx';
import FlashcardPage from './pages/Flashcards/FlashcardPage.jsx';
import QuizTakePage from './pages/Quizzes/QuizTakePage.jsx';
import QuizResultPage from './pages/Quizzes/QuizResultPage.jsx';
import ProfilePage from './pages/Profile/ProfilePage.jsx';
import { useEffect } from 'react';

const App = () => {
  const isAuthenticated = true;
  const loading = false;

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OGMyYjg3MzU3NzllNWM2MjY4MDU2MSIsImlhdCI6MTc3MDgwMzMzNiwiZXhwIjoxNzcxNDA4MTM2fQ.Sd8NOiH2lWdLyKvNhLqKObEZ6lH05187ZVFD5VV7MXE'
      }
    };

    fetch('http://localhost:8000/api/documents/698dc141a59c5d18cb0289d6', options)
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
  }, []);

  if (loading) {
    return (
      <div className="">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/documents" element={<DocumemntListPage />} />
        <Route path="/documents/:id" element={<DocumentDetailPage />} />
        <Route path="/flashcards" element={<FlashcardsListPage />} />
        <Route path="/documents/:id/flashcards" element={<FlashcardPage />} />
        <Route path="/quizzes/:quizId" element={<QuizTakePage />} />
        <Route path="/quizzes/:quizId/results" element={<QuizResultPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
