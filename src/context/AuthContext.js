// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Box, CircularProgress } from '@mui/material';

const AuthContext = createContext();
export function useAuth() { return useContext(AuthContext); }

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadChats, setUnreadChats] = useState([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    let unsubscribeChats;
    if (currentUser) {
      const chatsQuery = query(collection(db, 'chats'), where('participants', 'array-contains', currentUser.uid));
      unsubscribeChats = onSnapshot(chatsQuery, (snapshot) => {
        const newUnread = [];
        snapshot.forEach(doc => {
          const chatData = doc.data();
          if (chatData.lastMessageSenderId && chatData.lastMessageSenderId !== currentUser.uid) {
            const currentPath = window.location.pathname;
            const viewingChatId = currentPath.split('/chats/')[1];
            if (doc.id !== viewingChatId) newUnread.push(doc.id);
          }
        });
        setUnreadChats(newUnread);
      });
    } else {
      setUnreadChats([]);
    }
    return () => { if (unsubscribeChats) unsubscribeChats(); };
  }, [currentUser]);

  const clearChatNotification = (chatId) => {
    setUnreadChats(prev => prev.filter(id => id !== chatId));
  };

  const value = { currentUser, unreadChats, clearChatNotification };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}