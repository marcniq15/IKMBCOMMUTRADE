// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Box, CssBaseline, Toolbar, Fade, ThemeProvider } from '@mui/material';
import { theme } from './theme';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import all Components and Pages with correct casing
import BottomNavBar from './components/layout/BottomNavBar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ChatsPage from './pages/ChatsPage';
import MarketplacePage from './pages/MarketplacePage';
import ProfilePage from './pages/ProfilePage';
import PersonalPostPage from './pages/PersonalPostPage';
import CreateListingPage from './pages/CreateListingPage';
import ChatDetailPage from './pages/ChatDetailPage';
import PostDetailPage from './pages/PostDetailPage';
import ListingDetailPage from './pages/ListingDetailPage';
import NewChatPage from './pages/NewChatPage';

const PaddedPage = ({ children }) => (
  <Fade in={true} timeout={500}>
    <div>
      <Toolbar />
      <Box sx={{ p: 3 }}>
        {children}
      </Box>
    </div>
  </Fade>
);

const AppContent = () => {
    const { currentUser } = useAuth();
    const location = useLocation();
    const showNavBar = currentUser && location.pathname !== '/login';

    return (
        <>
            <Box component="main" sx={{ pb: showNavBar ? 7 : 0 }}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<ProtectedRoute><PaddedPage><HomePage /></PaddedPage></ProtectedRoute>} />
                    <Route path="/chats" element={<ProtectedRoute><PaddedPage><ChatsPage /></PaddedPage></ProtectedRoute>} />
                    <Route path="/chats/:chatId" element={<ProtectedRoute><ChatDetailPage /></ProtectedRoute>} />
                    <Route path="/marketplace" element={<ProtectedRoute><PaddedPage><MarketplacePage /></PaddedPage></ProtectedRoute>} />
                    <Route path="/marketplace/new" element={<ProtectedRoute><PaddedPage><CreateListingPage /></PaddedPage></ProtectedRoute>} />
                    <Route path="/profile/:userId" element={<ProtectedRoute><PaddedPage><ProfilePage /></PaddedPage></ProtectedRoute>} />
                    <Route path="/create-post" element={<ProtectedRoute><PaddedPage><PersonalPostPage /></PaddedPage></ProtectedRoute>} />
                    <Route path="/post/:postId" element={<ProtectedRoute><PostDetailPage /></ProtectedRoute>} />
                    <Route path="/listing/:listingId" element={<ProtectedRoute><ListingDetailPage /></ProtectedRoute>} />
                    <Route path="/new-chat" element={<ProtectedRoute><NewChatPage /></ProtectedRoute>} />
                </Routes>
            </Box>
            {showNavBar && <BottomNavBar />}
        </>
    );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <CssBaseline />
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;