// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Tabs, Tab, Paper } from '@mui/material';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from "firebase/firestore";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (tab === 1) { // Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create a user document in the 'users' collection
        await setDoc(doc(db, "users", user.uid), {
          username: email.split('@')[0],
          email: email,
          bio: "Welcome to my profile!",
          website: "",
          avatarUrl: "https://via.placeholder.com/150",
          followers: "0",
          following: "0",
          isAdmin: false, // Ensure new users are not admins
        });

      } else { // Login
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/');

    } catch (error) {
      console.error("Authentication error: ", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          IKMBCOMMUTRADE
        </Typography>
        <Tabs value={tab} onChange={handleTabChange} centered sx={{ mb: 2 }}>
          <Tab label="Login" />
          <Tab label="Sign Up" />
        </Tabs>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal" required fullWidth id="email"
            label="Email Address" name="email" autoComplete="email"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal" required fullWidth name="password"
            label="Password" type="password" id="password"
            autoComplete="current-password"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            {tab === 0 ? 'Login' : 'Sign Up'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;