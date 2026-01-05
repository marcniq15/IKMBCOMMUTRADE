import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Stack, Divider } from '@mui/material';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

const AdminAnnouncementPanel = ({ userProfile }) => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !message || !currentUser) return;
    setIsLoading(true);
    try {
      await addDoc(collection(db, 'announcements'), {
        title: title,
        message: message,
        authorName: userProfile?.username || 'Admin',
        timestamp: serverTimestamp(),
      });
      setTitle('');
      setMessage('');
      alert('Announcement posted!');
    } catch (error) {
      console.error("Error posting announcement: ", error);
      alert("Failed to post announcement.");
    }
    setIsLoading(false);
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Admin Panel: Post Announcement</Typography>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={2}>
          <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <TextField label="Message" multiline rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
          <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Posting...' : 'Post Announcement'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AdminAnnouncementPanel;