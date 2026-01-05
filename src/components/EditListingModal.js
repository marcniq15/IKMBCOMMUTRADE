import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Stack, InputAdornment } from '@mui/material';

const style = {
  position: 'absolute', top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)', width: 400,
  bgcolor: 'background.paper', border: '2px solid #000',
  boxShadow: 24, p: 4, borderRadius: 2,
};

const EditListingModal = ({ open, onClose, listing, onSave }) => {
  const [formData, setFormData] = useState({ name: '', price: '', description: '' });

  useEffect(() => {
    if (listing) {
      const priceValue = listing.price.replace('RM', '');
      setFormData({
        name: listing.name || '',
        price: priceValue || '',
        description: listing.description || ''
      });
    }
  }, [listing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" gutterBottom>Edit Listing</Typography>
        <Stack spacing={2}>
          <TextField name="name" label="Item Name" value={formData.name} onChange={handleChange} />
          <TextField name="price" label="Price" type="number" value={formData.price} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start">RM</InputAdornment> }} />
          <TextField name="description" label="Description" multiline rows={4} value={formData.description} onChange={handleChange} />
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>Save Changes</Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};

export default EditListingModal;