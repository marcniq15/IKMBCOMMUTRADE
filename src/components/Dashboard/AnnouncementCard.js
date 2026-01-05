import React from 'react';
import { Card, CardHeader, CardContent, Typography, Avatar } from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';

const AnnouncementCard = ({ announcement }) => {
  return (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: 'secondary.main' }}><CampaignIcon /></Avatar>}
        title={<Typography variant="h6">Latest Announcement</Typography>}
        subheader={announcement ? announcement.date : 'No new announcements'}
      />
      {announcement ? (
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>{announcement.title}</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>{announcement.message}</Typography>
        </CardContent>
      ) : (
        <CardContent>
          <Typography variant="body1" color="text.secondary">Check back here for important updates.</Typography>
        </CardContent>
      )}
    </Card>
  );
};

export default AnnouncementCard;