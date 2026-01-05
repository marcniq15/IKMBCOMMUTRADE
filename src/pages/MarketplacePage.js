// src/pages/MarketplacePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Box, Grid, Card, CardMedia, CardContent, Fab, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const MarketplacePage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const productsQuery = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const productSnapshot = await getDocs(productsQuery);
      const productsList = productSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsList);
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Marketplace
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Link to={`/listing/${product.id}`} style={{ textDecoration: 'none' }}>
              <Card>
                <CardMedia
                  component="img"
                  height="194"
                  image={product.image}
                  alt={product.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" noWrap>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    {product.price}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>

      <Fab
        color="primary"
        aria-label="add listing"
        component={Link}
        to="/marketplace/new"
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
export default MarketplacePage;