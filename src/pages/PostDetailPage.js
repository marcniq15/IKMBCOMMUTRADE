import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, CardMedia, CardContent, Typography, CircularProgress, AppBar, Toolbar, IconButton, Stack, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import EditPostModal from '../components/EditPostModal';

const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      const docRef = doc(db, 'posts', postId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPost({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("No such document!");
      }
      setIsLoading(false);
    };
    if (postId) fetchPost();
  }, [postId]);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleSaveCaption = async (newCaption) => {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      caption: newCaption
    });
    setPost(prev => ({ ...prev, caption: newCaption }));
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteDoc(doc(db, 'posts', postId));
        alert("Post deleted successfully.");
        navigate('/profile');
      } catch (error) {
        console.error("Error deleting post: ", error);
        alert("Failed to delete post.");
      }
    }
  };

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (!post) {
    return <Typography sx={{ textAlign: 'center', mt: 4 }}>Post not found.</Typography>;
  }

  const isAuthor = currentUser && currentUser.uid === post.authorId;

  return (
    <Box>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}><ArrowBackIcon /></IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Post</Typography>
        </Toolbar>
      </AppBar>

      <Card sx={{ mt: 2, maxWidth: 600, mx: 'auto' }}>
        <CardMedia
          component="img"
          image={post.imageUrl}
          alt="Post image"
          sx={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover' }}
        />
        <CardContent>
          <Typography variant="body1" sx={{ mb: 2 }}>{post.caption}</Typography>
          {isAuthor && (
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={handleOpenModal}>Edit</Button>
              <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
            </Stack>
          )}
        </CardContent>
      </Card>

      {isAuthor && (
        <EditPostModal
          open={isModalOpen}
          onClose={handleCloseModal}
          post={post}
          onSave={handleSaveCaption}
        />
      )}
    </Box>
  );
};
export default PostDetailPage;