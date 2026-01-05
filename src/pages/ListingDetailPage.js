import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, CardMedia, CardContent, Typography, CircularProgress, AppBar, Toolbar, IconButton, Stack, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import EditListingModal from '../components/EditListingModal';

const ListingDetailPage = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      setIsLoading(true);
      const docRef = doc(db, 'products', listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("No such listing document!");
      }
      setIsLoading(false);
    };
    if (listingId) fetchListing();
  }, [listingId]);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleSaveListing = async (formDataFromModal) => {
    const listingRef = doc(db, 'products', listingId);
    const dataToSave = {
      name: formDataFromModal.name,
      description: formDataFromModal.description,
      price: `RM${formDataFromModal.price}`
    };
    await updateDoc(listingRef, dataToSave);
    setListing(prev => ({ ...prev, ...dataToSave }));
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await deleteDoc(doc(db, 'products', listingId));
        alert("Listing deleted successfully.");
        navigate('/marketplace');
      } catch (error) {
        console.error("Error deleting listing: ", error);
        alert("Failed to delete listing.");
      }
    }
  };

  const handleMessageSeller = async () => {
    if (!currentUser || !listing || !listing.authorId || currentUser.uid === listing.authorId) return;
    const chatsQuery = query(collection(db, 'chats'), where('participants', 'array-contains', currentUser.uid));
    const chatsSnapshot = await getDocs(chatsQuery);
    const existingChat = chatsSnapshot.docs.find(doc => doc.data().participants.includes(listing.authorId));

    if (existingChat) {
      navigate(`/chats/${existingChat.id}`);
    } else {
      const newChatRef = await addDoc(collection(db, 'chats'), {
        participants: [currentUser.uid, listing.authorId],
        lastMessageText: `Regarding your listing: ${listing.name}`,
        lastMessageTimestamp: serverTimestamp()
      });
      navigate(`/chats/${newChatRef.id}`);
    }
  };

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (!listing) {
    return <Typography sx={{ textAlign: 'center', mt: 4 }}>Listing not found.</Typography>;
  }

  const isOwner = currentUser && currentUser.uid === listing.authorId;

  return (
    <Box>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}><ArrowBackIcon /></IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>IKMBCOMMUTRADE</Typography>
        </Toolbar>
      </AppBar>
      <Card sx={{ mt: 2, maxWidth: 600, mx: 'auto' }}>
        <CardMedia component="img" image={listing.image} alt={listing.name} sx={{ aspectRatio: '16/9', objectFit: 'cover' }} />
        <CardContent>
          <Typography gutterBottom variant="h4" component="div">{listing.name}</Typography>
          <Typography variant="h5" color="primary" sx={{ mb: 2 }}>{listing.price}</Typography>
          <Typography variant="body1" color="text.secondary">{listing.description}</Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            {isOwner && (
              <>
                <Button variant="outlined" onClick={handleOpenModal}>Edit</Button>
                <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
              </>
            )}
            {!isOwner && currentUser && (
              <Button variant="contained" onClick={handleMessageSeller}>
                Message Seller
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
      {isOwner && (
        <EditListingModal
          open={isModalOpen}
          onClose={handleCloseModal}
          listing={listing}
          onSave={handleSaveListing}
        />
      )}
    </Box>
  );
};

export default ListingDetailPage;