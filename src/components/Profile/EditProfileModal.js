import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Stack, Avatar, CircularProgress } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../context/AuthContext';

const style = {
  position: 'absolute', top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)', width: 400,
  bgcolor: 'background.paper', border: '2px solid #000',
  boxShadow: 24, p: 4, borderRadius: 2,
};

const EditProfileModal = ({ open, onClose, profile, onSave }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState(profile);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (profile) setFormData(profile);
    setImageFile(null);
    setImagePreview(null);
  }, [profile, open]);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!currentUser) return;
    setIsUploading(true);
    let finalData = { ...formData };

    if (imageFile) {
      try {
        const imageRef = ref(storage, `avatars/${currentUser.uid}/${uuidv4()}-${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        finalData.avatarUrl = await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error("Error uploading new profile picture: ", error);
        setIsUploading(false);
        alert("Failed to upload new picture.");
        return;
      }
    }
    onSave(finalData);
    setIsUploading(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" gutterBottom>Edit Profile</Typography>
        <Stack spacing={2} sx={{ position: 'relative' }}>
          {isUploading && (
            <Box sx={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}><CircularProgress /></Box>
          )}
          <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
            <Avatar src={imagePreview || formData.avatarUrl} sx={{ width: 90, height: 90 }} />
            <Button variant="text" component="label" startIcon={<PhotoCamera />}>
              Change Picture
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>
          </Box>
          <TextField label="Username" name="username" value={formData.username} onChange={handleChange} />
          <TextField label="Bio" name="bio" value={formData.bio} onChange={handleChange} multiline rows={3} />
          <TextField label="Website" name="website" value={formData.website} onChange={handleChange} />
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={onClose} disabled={isUploading}>Cancel</Button>
            <Button variant="contained" onClick={handleSave} disabled={isUploading}>Save</Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};

export default EditProfileModal;