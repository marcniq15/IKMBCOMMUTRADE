import React, { useState, useEffect } from 'react';
import { Box, Grid, Avatar, Typography, Button, Tabs, Tab, Card, CardMedia, Stack, CircularProgress, IconButton, CardContent } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import EditProfileModal from '../components/Profile/EditProfileModal';
import PostCard from '../components/Profile/PostCard';
import ListingCard from '../components/Profile/ListingCard';

// Icon Imports
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';

// Firebase Imports
import { db, auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc, collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const StatItem = ({ count, label }) => (
  <Button sx={{ p: 0, textTransform: 'none', color: 'text.primary' }}>
    <Stack direction="column" alignItems="center">
      <Typography variant="h6" component="div" sx={{ lineHeight: 1.2 }}>{count || 0}</Typography>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
    </Stack>
  </Button>
);

const ProfilePage = () => {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState('grid');

  const isOwner = currentUser && currentUser.uid === userId;

  useEffect(() => {
    if (userId) {
      const fetchProfileData = async () => {
        setIsLoading(true);
        // Fetch User Profile
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) { setProfile(userDocSnap.data()); } else { setProfile(null); }

        // Fetch Personal Posts
        const postsQuery = query(collection(db, 'posts'), where("authorId", "==", userId), orderBy('timestamp', 'desc'));
        const postsSnapshot = await getDocs(postsQuery);
        setPosts(postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // Fetch Marketplace Listings
        const listingsQuery = query(collection(db, 'products'), where("authorId", "==", userId), orderBy('createdAt', 'desc'));
        const listingsSnapshot = await getDocs(listingsQuery);
        setListings(listingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        setIsLoading(false);
      };
      fetchProfileData();
    } else {
        setIsLoading(false);
    }
  }, [userId]);

  const handleTabChange = (event, newValue) => setActiveTab(newValue);
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleSaveProfile = async (updatedProfile) => {
    if (!isOwner) return;
    const userDocRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userDocRef, updatedProfile);
    setProfile(updatedProfile);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out: ", error);
    }
  };

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (!profile) {
    return <Box sx={{ textAlign: 'center', mt: 4 }}><Typography>User profile not found.</Typography></Box>;
  }

  return (
    <Box>
      <Grid container spacing={4} sx={{ mb: 2 }} alignItems="center">
        <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Avatar alt={profile.username} src={profile.avatarUrl} sx={{ width: 150, height: 150 }} />
        </Grid>
        <Grid item xs={12} md={9}>
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Typography variant="h4" component="h1">{profile.username}</Typography>
            {isOwner && (
              <>
                <Button variant="outlined" onClick={handleOpenModal}>Edit Profile</Button>
                <Button variant="contained" color="error" onClick={handleLogout}>Logout</Button>
              </>
            )}
          </Stack>
          <Stack direction="row" spacing={4} mb={2}>
            <StatItem count={posts.length} label="Posts" />
            <StatItem count={listings.length} label="Listings" />
            <StatItem count={profile.followers} label="Followers" />
            <StatItem count={profile.following} label="Following" />
          </Stack>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{profile.username}</Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{profile.bio}</Typography>
          <Typography component="a" href={`https://${profile.website}`} target="_blank" sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 'bold' }}>
            {profile.website}
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction="row" justifyContent="center" alignItems="center" position="relative">
          <Tabs value={activeTab} onChange={handleTabChange} centered sx={{ flexGrow: 1 }}>
            <Tab label="Posts" />
            <Tab label="Marketplace" />
          </Tabs>
          <Box position="absolute" right={0}>
            <IconButton onClick={() => setViewMode('grid')} color={viewMode === 'grid' ? 'primary' : 'default'}><GridViewIcon /></IconButton>
            <IconButton onClick={() => setViewMode('list')} color={viewMode === 'list' ? 'primary' : 'default'}><ViewListIcon /></IconButton>
          </Box>
        </Stack>
      </Box>

      {activeTab === 0 && (
        viewMode === 'grid' ? (
          <Grid container spacing={1} sx={{ mt: 2 }}>
            {posts.map((post) => (
              <Grid item xs={4} key={post.id}>
                <Link to={`/post/${post.id}`} style={{ textDecoration: 'none' }}>
                  <Card sx={{ aspectRatio: '1 / 1', width: '100%' }}>
                    <CardMedia
                      component="img" image={post.imageUrl} alt="User post"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Stack spacing={2} sx={{ mt: 2 }}>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} profile={profile} />
            ))}
          </Stack>
        )
      )}

      {activeTab === 1 && (
        viewMode === 'grid' ? (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {listings.map((listing) => (
              <Grid item xs={6} sm={4} key={listing.id}>
                <Link to={`/listing/${listing.id}`} style={{ textDecoration: 'none' }}>
                  <Card>
                    <CardMedia
                      component="img" image={listing.image} alt={listing.name}
                      sx={{ aspectRatio: '1 / 1', objectFit: 'cover' }}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div" noWrap>{listing.name}</Typography>
                      <Typography variant="body2" color="primary">{listing.price}</Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Stack spacing={2} sx={{ mt: 2 }}>
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} profile={profile} />
            ))}
          </Stack>
        )
      )}

      {isOwner && profile && (
        <EditProfileModal
          open={isModalOpen}
          onClose={handleCloseModal}
          profile={profile}
          onSave={handleSaveProfile}
        />
      )}
    </Box>
  );
};

export default ProfilePage;