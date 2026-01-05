import React, { useState, useEffect } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper, Badge } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../../context/AuthContext';

const BottomNavBar = () => {
  const { currentUser, unreadChats } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = '/' + location.pathname.split('/')[1];
  const [value, setValue] = useState(basePath);

  useEffect(() => { setValue(basePath); }, [basePath]);
  const handleChange = (event, newValue) => { navigate(newValue); };

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1100 }} elevation={3}>
      <BottomNavigation value={value} onChange={handleChange} showLabels>
        <BottomNavigationAction label="Dashboard" value="/" icon={<DashboardIcon />} />
        <BottomNavigationAction
          label="Chats" value="/chats"
          icon={
            <Badge color="error" variant="dot" invisible={unreadChats.length === 0}>
              <ChatBubbleOutlineIcon />
            </Badge>
          }
        />
        <BottomNavigationAction label="Marketplace" value="/marketplace" icon={<StorefrontIcon />} />
        <BottomNavigationAction
          label="Profile"
          value={currentUser ? `/profile/${currentUser.uid}` : '/login'}
          icon={<AccountCircleIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
};
export default BottomNavBar;