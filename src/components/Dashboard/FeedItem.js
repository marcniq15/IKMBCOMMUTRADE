import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ListItemButton, ListItemIcon, ListItemText, Avatar, Badge, Typography } from '@mui/material';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';

const FeedItem = ({ item }) => {
  const navigate = useNavigate();

  const renderIcon = () => {
    switch (item.type) {
      case 'chat':
        return <Badge color="primary" variant="dot" invisible={!item.unread}><Avatar sx={{ bgcolor: 'info.main' }}><ChatBubbleIcon /></Avatar></Badge>;
      case 'listing':
        return <Avatar sx={{ bgcolor: 'success.main' }}><StorefrontIcon /></Avatar>;
      case 'post':
        return <Avatar sx={{ bgcolor: 'secondary.main' }}><PhotoCameraBackIcon /></Avatar>;
      default: return null;
    }
  };

  const handleClick = () => {
    switch (item.type) {
      case 'chat': navigate(`/chats/${item.id}`); break;
      case 'listing': navigate(`/listing/${item.id}`); break;
      case 'post': navigate(`/post/${item.id}`); break;
      default: break;
    }
  };

  return (
    <ListItemButton onClick={handleClick}>
      <ListItemIcon>{renderIcon()}</ListItemIcon>
      <ListItemText
        primary={<Typography noWrap sx={{ fontWeight: 'medium' }}>{item.title}</Typography>}
        secondary={<Typography noWrap color="text.secondary">{item.subtitle}</Typography>}
      />
      {item.price && <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{item.price}</Typography>}
    </ListItemButton>
  );
};

export default FeedItem;