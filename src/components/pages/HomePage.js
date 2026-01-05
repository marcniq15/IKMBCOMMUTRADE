// src/pages/Homepage.js
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  Card,
  CardHeader,
  CardContent,
  List,
  Divider,
  Button,
  Stack,
  CircularProgress,
  Fab
} from '@mui/material';
import { Link } from 'react-router-dom';
import AnnouncementCard from '../components/Dashboard/AnnouncementCard';
import AdminAnnouncementPanel from '../components/Dashboard/AdminAnnouncementPanel';
import FeedItem from '../components/Dashboard/FeedItem';
import AddIcon from '@mui/icons-material/Add';

// Firebase and Auth Imports
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, orderBy, onSnapshot, doc, getDoc, limit, getDocs } from 'firebase/firestore';

const HomePage = () => {
  const { currentUser } = useAuth();
  const [liveFeed, setLiveFeed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {
    if (!currentUser) {
        setIsLoading(false);
        return;
    }

    // Listener for the latest announcement
    const announcementsQuery = query(collection(db, 'announcements'), orderBy('timestamp', 'desc'), limit(1));
    const unsubscribeAnnouncements = onSnapshot(announcementsQuery, (snapshot) => {
        if (!snapshot.empty) {
            const latestAnn = snapshot.docs[0].data();
            const date = latestAnn.timestamp?.toDate().toLocaleString() || 'Just now';
            setAnnouncement({ ...latestAnn, date: date });
        } else {
            setAnnouncement(null);
        }
    });

    const fetchUserDataAndFeed = async () => {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            setUserProfile(docSnap.data());
        }

        // Fetch feed (chats & products)
        const productsQuery = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(3));
        const productSnapshot = await getDocs(productsQuery);
        const recentProducts = productSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id, type: 'listing', title: `New Listing: ${data.name}`,
                subtitle: data.description || 'Check it out!', price: data.price,
                timestamp: data.createdAt?.toDate() || new Date()
            };
        });

        const chatsQuery = query(collection(db, 'chats'), where('participants', 'array-contains', currentUser.uid), orderBy('lastMessageTimestamp', 'desc'), limit(3));
        const chatSnapshot = await getDocs(chatsQuery);
        const recentChats = await Promise.all(
            chatSnapshot.docs.map(async (chatDoc) => {
                const chatData = chatDoc.data();
                const otherParticipantId = chatData.participants.find(p => p !== currentUser.uid);
                if (!otherParticipantId) return null;
                const userDoc = await getDoc(doc(db, 'users', otherParticipantId));
                const otherUserData = userDoc.data();
                return {
                    id: chatDoc.id, type: 'chat', title: otherUserData?.username || 'Chat',
                    subtitle: chatData.lastMessageText,
                    timestamp: chatData.lastMessageTimestamp?.toDate() || new Date()
                };
            })
        );

        const combinedFeed = [...recentProducts, ...recentChats.filter(c => c !== null)];
        combinedFeed.sort((a, b) => b.timestamp - a.timestamp);
        setLiveFeed(combinedFeed);

        setIsLoading(false);
    };

    fetchUserDataAndFeed();

    return () => {
        unsubscribeAnnouncements();
    };
  }, [currentUser]);

  if (isLoading) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
        </Box>
    );
  }

  return (
    <Box>
        <Typography variant="h4" gutterBottom component="div">IKMBCOMMUTRADE</Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Your central hub for community, commerce, and connection.
        </Typography>
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <AnnouncementCard announcement={announcement} />
            </Grid>
            {userProfile && userProfile.isAdmin && (
                <Grid item xs={12}><AdminAnnouncementPanel userProfile={userProfile} /></Grid>
            )}
            <Grid item xs={12} md={8}>
                <Card>
                    <CardHeader title="What's Happening" />
                    <CardContent>
                        {liveFeed.length > 0 ? (
                            <List disablePadding>
                                {liveFeed.map((item, index) => (
                                <React.Fragment key={`${item.type}-${item.id}`}>
                                    <FeedItem item={item} />
                                    {index < liveFeed.length - 1 && <Divider component="li" />}
                                </React.Fragment>
                                ))}
                            </List>
                        ) : ( <Typography color="text.secondary">No recent activity.</Typography> )}
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardHeader title="Quick Actions" />
                    <CardContent>
                        <Stack spacing={2}>
                            <Button variant="contained" component={Link} to="/create-post">Create a New Post</Button>
                            <Button variant="outlined" component={Link} to="/marketplace/new">List an Item</Button>
                            <Button variant="text" component={Link} to="/chats">View All Chats</Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
        <Fab
            color="primary"
            aria-label="create post"
            component={Link}
            to="/create-post"
            sx={{
                position: 'fixed',
                bottom: { xs: 80 },
                right: { xs: 24 },
            }}
        >
            <AddIcon />
        </Fab>
    </Box>
  );
};

export default HomePage;