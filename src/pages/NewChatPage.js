// src/pages/NewChatPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { Box, Typography, List, ListItemButton, ListItemAvatar, Avatar, ListItemText, CircularProgress, AppBar, Toolbar, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const NewChatPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }
      const usersQuery = query(collection(db, 'users'), where('__name__', '!=', currentUser.uid));
      const usersSnapshot = await getDocs(usersQuery);
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
      setIsLoading(false);
    };
    fetchUsers();
  }, [currentUser]);

  const handleStartChat = async (otherUserId) => {
    if (!currentUser) return;
    const chatsQuery = query(collection(db, 'chats'), where('participants', 'array-contains', currentUser.uid));
    const chatsSnapshot = await getDocs(chatsQuery);
    const existingChat = chatsSnapshot.docs.find(doc => doc.data().participants.includes(otherUserId));

    if (existingChat) {
      navigate(`/chats/${existingChat.id}`);
    } else {
      const newChatRef = await addDoc(collection(db, 'chats'), {
        participants: [currentUser.uid, otherUserId],
        lastMessageText: 'New conversation started',
        lastMessageTimestamp: serverTimestamp()
      });
      navigate(`/chats/${newChatRef.id}`);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">Start a New Chat</Typography>
        </Toolbar>
      </AppBar>
      <List>
        {users.map(user => (
          <ListItemButton key={user.id} onClick={() => handleStartChat(user.id)}>
            <ListItemAvatar>
              <Avatar src={user.avatarUrl} />
            </ListItemAvatar>
            <ListItemText primary={user.username} secondary={user.email} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};
export default NewChatPage;