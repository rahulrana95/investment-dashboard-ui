import React from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, IconButton } from '@mui/material';
import rahulImages from '../../images/rahul.jpeg';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';

// Sample image URLs, replace these with actual creator images
const creatorImages = [
  {
    image: rahulImages,
    name: 'Rahul Rana',
    linkedin: 'https://www.linkedin.com/in/rahulrana95/',
    twitter: 'https://twitter.com/rahulrana_95',
  },
];

const HomePage: React.FC = () => {
  return (
    <Container className='page-content-area'>
      {/* Header Section */}
      <Typography variant="h2" gutterBottom align="center">
        JSWarriors
      </Typography>
      <Typography variant="h5" gutterBottom align="center">
        We talk about frontend everything 💻🚀
      </Typography>
      <Typography variant="body1" paragraph align="center" style={{ maxWidth: '60%', margin: 'auto' }}>
        Welcome to JSWarriors, where we dive deep into the world of frontend development! Whether you're a seasoned pro or just starting out, we cover everything from the basics of HTML and CSS to the latest in JavaScript frameworks and best practices. Our mission is to share knowledge, spark creativity, and help you build amazing web experiences. Join us on this exciting journey through the ever-evolving landscape of frontend technologies!
      </Typography>

      {/* Creators Section */}
      <Typography variant="h4" gutterBottom align="center" style={{ marginTop: '48px' }}>
        Meet the Creators
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid container spacing={2} justifyContent="center">
          {creatorImages.map((creator, index) => (
            <Grid item xs={12} sm={4} md={3} key={index}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={creator.image}
                  alt={`Creator ${index + 1}`}
                />
                <CardContent>
                  <Typography variant="h6" component="div" align="center">
                    {creator.name}
                  </Typography>
                  <Grid container spacing={1} justifyContent="center" marginTop={1}>
                    <Grid item>
                      <IconButton component="a" href={creator.linkedin} target="_blank" rel="noopener noreferrer">
                        <LinkedInIcon />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton component="a" href={creator.twitter} target="_blank" rel="noopener noreferrer">
                        <TwitterIcon />
                      </IconButton>
                    </Grid>

                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
