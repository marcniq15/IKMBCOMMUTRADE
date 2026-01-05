import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import {
  Typography,
  Box,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  CircularProgress,
  Fab,
  Stack
} from '@mui/material';
import AddCommentIcon from '@mui/icons-material/AddComment';

const ChatsPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
        setIsLoading(false);
        return;
    };

    const chatsQuery = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.uid),
      orderBy('lastMessageTimestamp', 'desc')
    );

    const unsubscribe = onSnapshot(chatsQuery, async (querySnapshot) => {
      const chatsData = await Promise.all(querySnapshot.docs.map(async (chatDoc) => {
        const chatData = chatDoc.data();
        const otherParticipantId = chatData.participants.find(p => p !== currentUser.uid);
        if (!otherParticipantId) return null;

        const userDoc = await getDoc(doc(db, 'users', otherParticipantId));
        const otherUserData = userDoc.data();

        return {
          id: chatDoc.id,
          ...chatData,
          otherUserName: otherUserData?.username || 'Unknown User',
          otherUserAvatar: otherUserData?.avatarUrl
        };
      }));
      setChats(chatsData.filter(chat => chat !== null));
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Chats
      </Typography>

      <Stack spacing={1}>
        {chats.length > 0 ? (
          chats.map((chat) => (
            <ListItemButton
              key={chat.id}
              onClick={() => navigate(`/chats/${chat.id}`)}
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 2,
                p: 2,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                  bgcolor: 'action.hover'
                }
              }}
            >
              <ListItemAvatar>
                <Avatar alt={chat.otherUserName} src={chat.otherUserAvatar} sx={{ width: 56, height: 56, mr: 1 }} />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography noWrap sx={{ fontWeight: 'bold' }}>{chat.otherUserName}</Typography>}
                secondary={<Typography noWrap color="text.secondary">{chat.lastMessageText}</Typography>}
              />
            </ListItemButton>
          ))
        ) : (
          <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
            No conversations yet. Click the '+' button to start a new chat!
          </Typography>
        )}
      </Stack>

      <Fab
        color="primary"
        aria-label="new chat"
        component={Link}
        to="/new-chat"
        sx={{
          position: 'fixed',
          bottom: { xs: 80 },
          right: { xs: 24 },
        }}
      >
        <AddCommentIcon />
      </Fab>
    </Box>
  );
};

export default ChatsPage;