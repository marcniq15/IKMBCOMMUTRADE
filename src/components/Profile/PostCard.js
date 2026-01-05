import React from 'react';
import { Card, CardHeader, Avatar, CardMedia, CardContent, Typography, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';

const PostCard = ({ post, profile }) => {
  const postDate = post.timestamp?.toDate().toLocaleDateString();

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', width: '100%' }}>
      <CardActionArea component={Link} to={`/post/${post.id}`}>
        <CardHeader
          avatar={<Avatar src={profile.avatarUrl} />}
          title={<Typography sx={{ fontWeight: 'bold' }}>{profile.username}</Typography>}
          subheader={postDate}
        />
        <CardMedia
          component="img" image={post.imageUrl} alt="User post"
          sx={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover' }}
        />
        {post.caption && (
          <CardContent><Typography variant="body1">{post.caption}</Typography></CardContent>
        )}
      </CardActionArea>
    </Card>
  );
};

export default PostCard;