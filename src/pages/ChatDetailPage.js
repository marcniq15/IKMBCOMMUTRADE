import React, { useState, useEffect, useRef } from 'react';
import { Box, AppBar, Toolbar, IconButton, Avatar, Typography, Paper, TextField, CircularProgress } from '@mui/material';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

const Message = ({ text, senderId, currentUser }) => {
  const isMe = senderId === currentUser.uid;
  return (
    <Box sx={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', mb: 1 }}>
      <Paper
        variant="outlined"
        sx={{
          p: 1.5,
          backgroundColor: isMe ? 'primary.main' : 'background.paper',
          color: isMe ? 'primary.contrastText' : 'text.primary',
          borderRadius: isMe ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
          maxWidth: '70%',
        }}
      >
        {text}
      </Paper>
    </Box>
  );
};

const ChatDetailPage = () => {
  const { currentUser, clearChatNotification } = useAuth();
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!currentUser || !chatId) {
      setIsLoading(false);
      return;
    }
    clearChatNotification(chatId);
    const messagesQuery = query(collection(db, 'chats', chatId, 'messages'), orderBy('timestamp'));
    const unsubscribeMessages = onSnapshot(messagesQuery, (querySnapshot) => {
      const messagesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(messagesData);
    });
    const fetchChatInfo = async () => {
      const chatDocRef = doc(db, 'chats', chatId);
      const chatDocSnap = await getDoc(chatDocRef);
      if (chatDocSnap.exists()) {
        const otherUserId = chatDocSnap.data().participants.find(id => id !== currentUser.uid);
        if (otherUserId) {
          const userDocRef = doc(db, 'users', otherUserId);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setOtherUser({ id: userDocSnap.id, ...userDocSnap.data() });
          }
        }
      }
      setIsLoading(false);
    };
    fetchChatInfo();
    return () => unsubscribeMessages();
  }, [chatId, currentUser, clearChatNotification]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (newMessage.trim() === '' || !currentUser) return;
    const trimmedMessage = newMessage.trim();
    setNewMessage('');
    const messagesCol = collection(db, 'chats', chatId, 'messages');
    await addDoc(messagesCol, {
      text: trimmedMessage,
      senderId: currentUser.uid,
      timestamp: serverTimestamp()
    });
    const chatDocRef = doc(db, 'chats', chatId);
    await updateDoc(chatDocRef, {
      lastMessageText: trimmedMessage,
      lastMessageTimestamp: serverTimestamp(),
      lastMessageSenderId: currentUser.uid
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!otherUser) {
    return (
      <Typography sx={{textAlign: 'center', mt: 4}}>
        Chat not found or user does not exist.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 56px)' }}>
      <AppBar
        position="static"
        elevation={1}
        sx={{ backgroundColor: 'rgba(30, 30, 30, 0.7)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}><ArrowBackIcon /></IconButton>
          <Avatar src={otherUser.avatarUrl} sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Link to={`/profile/${otherUser.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              {otherUser.username}
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, backgroundColor: 'background.default' }}>
        {messages.map((msg) => (
          <Message key={msg.id} text={msg.text} senderId={msg.senderId} currentUser={currentUser} />
        ))}
        <div ref={bottomRef} />
      </Box>
      <Paper sx={{ p: '8px 16px', display: 'flex', alignItems: 'center' }} elevation={2}>
        <TextField
          fullWidth variant="outlined" placeholder="Type a message..."
          value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()} size="small"
        />
        <IconButton color="primary" sx={{ ml: 1 }} onClick={handleSend}><SendIcon /></IconButton>
      </Paper>
    </Box>
  );
};
export default ChatDetailPage;