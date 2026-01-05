import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, TextField, Button, Stack, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';
import { v4 as uuidv4 } from 'uuid';

// Firebase Imports
import { db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from '../context/AuthContext';

const CreateListingPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleListitem = async () => {
    if (!imageFile || !itemName || !price || !currentUser) {
      alert('Please fill out all fields and be logged in.');
      return;
    }
    setIsLoading(true);
    try {
      const imageRef = ref(storage, `products/${uuidv4()}-${imageFile.name}`);
      const snapshot = await uploadBytes(imageRef, imageFile);
      const downloadURL = await getDownloadURL(snapshot.ref);

      await addDoc(collection(db, 'products'), {
        name: itemName,
        price: `RM${price}`,
        description: description,
        image: downloadURL,
        createdAt: serverTimestamp(),
        authorId: currentUser.uid
      });
      setIsLoading(false);
      alert('Item listed successfully!');
      navigate('/marketplace');
    } catch (error) {
      setIsLoading(false);
      console.error("Error creating listing: ", error);
      alert("Failed to create listing.");
    }
  };

  const handleCancel = () => { navigate(-1); };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" component="h1">Create New Listing</Typography>
        <IconButton onClick={handleCancel} disabled={isLoading}><CloseIcon /></IconButton>
      </Box>
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Box sx={{ width: '100%', height: 300, border: '2px dashed #ccc', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', background: imagePreview ? `url(${imagePreview}) center/cover` : '#f0f0f0', position: 'relative' }}>
              {!imagePreview && <Typography color="text.secondary">Upload a Photo</Typography>}
              <Button variant="contained" component="label" startIcon={<PhotoCamera />} sx={{ position: 'absolute', bottom: 16 }}>
                Upload Photo
                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
              </Button>
            </Box>
            <TextField label="Item Name" variant="outlined" fullWidth required value={itemName} onChange={(e) => setItemName(e.target.value)} />
            <TextField label="Price" variant="outlined" fullWidth required type="number" value={price} onChange={(e) => setPrice(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">RM</InputAdornment> }} />
            <TextField label="Description" multiline rows={4} fullWidth variant="outlined" value={description} onChange={(e) => setDescription(e.target.value)} />
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="text" onClick={handleCancel} disabled={isLoading}>Cancel</Button>
              <Button variant="contained" onClick={handleListitem} disabled={!imageFile || !itemName || !price || isLoading} sx={{ position: 'relative' }}>
                List Item
                {isLoading && <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px' }} />}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateListingPage;