import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Stack } from '@mui/material';

const style = {
  position: 'absolute', top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)', width: 400,
  bgcolor: 'background.paper', border: '2px solid #000',
  boxShadow: 24, p: 4, borderRadius: 2,
};

const EditPostModal = ({ open, onClose, post, onSave }) => {
  const [caption, setCaption] = useState('');

  useEffect(() => {
    if (post) setCaption(post.caption);
  }, [post]);

  const handleSave = () => {
    onSave(caption);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" gutterBottom>Edit Post</Typography>
        <Stack spacing={2}>
          <TextField label="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} multiline rows={4} />
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>Save Changes</Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};

export default EditPostModal;