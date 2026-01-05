import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActionArea, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const ListingCard = ({ listing }) => {
  const listingDate = listing.createdAt?.toDate().toLocaleDateString();

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', width: '100%' }}>
      <CardActionArea component={Link} to={`/listing/${listing.id}`}>
        <Box sx={{ display: 'flex' }}>
          <CardMedia
            component="img" image={listing.image} alt={listing.name}
            sx={{ width: 150, height: 150, objectFit: 'cover', flexShrink: 0 }}
          />
          <CardContent sx={{ flex: '1 1 auto' }}>
            <Typography gutterBottom variant="h5" component="div" noWrap>{listing.name}</Typography>
            <Typography variant="h6" color="primary" sx={{ mb: 1 }}>{listing.price}</Typography>
            <Typography variant="body2" color="text.secondary" noWrap>{listing.description || 'No description.'}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              Listed on {listingDate}
            </Typography>
          </CardContent>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default ListingCard;