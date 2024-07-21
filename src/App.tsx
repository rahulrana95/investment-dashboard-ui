import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Container, CssBaseline, AppBar, Toolbar, Typography, Button, CircularProgress, Chip, Avatar } from '@mui/material';
import { Link, Route, Routes } from 'react-router-dom';
import Home from './pages/home/home';
import About from './pages/about/about';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import LoginModal from './components/login-modal/login-modal';
import { config } from './config';
import useLoginStore from './components/login-modal/useLoginStore';
import AvatarMenu from './components/user-menu/user-menu';
import axios from 'axios';
import Cookies from 'js-cookie';


interface VerifyTokenResponse {
  email?: string;
}

function App() {
  const [backendStatus, setBackendStatus] = useState<'loading' | 'online' | 'offline'>('loading');
  const [isLoginOpen, setLoginOpen] = useState(false);
  const loginStore = useLoginStore();

  const handleLoginOpen = () => {
    setLoginOpen(true);
  };

  const handleLoginClose = () => {
    setLoginOpen(false);
  };

  useEffect(() => {
    const token = Cookies.get('token');
    axios.defaults.headers.common['token'] = `${token}`;

    fetch(`${config.baseURL}/api/v1/`)
      .then(response => {
        if (response.ok) {
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
        }
      })
      .catch(() => setBackendStatus('offline'));
    fetch(`${config.baseURL}/auth/verify-token`, {
      credentials: 'include',
      method: 'GET', // or 'POST', 'PUT', etc.
      headers: {
        'token': `${token}`,
        'Content-Type': 'application/json'
      },
    }).then((response) => response.json())
      .then((response: VerifyTokenResponse) => {
        if (response.email) {
          loginStore.setEmail(response.email);
        }
      })
      .catch(() => console.log('error verifcation'));
  }, []);

  const renderBackendStatusIcon = () => {
    if (backendStatus === 'loading') {
      return <CircularProgress color="inherit" size={24} style={{ marginLeft: '12px' }} />;
    }
    if (backendStatus === 'online') {
      return <CheckCircleIcon style={{ color: 'green' }} />;
    }
    return <ErrorIcon style={{ color: 'red' }} />;
  };


  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="static" style={{ backgroundColor: "#2A2D34" }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>JS Warriors  {renderBackendStatusIcon()}</Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/about">About</Button>
          <AvatarMenu handleLoginOpen={handleLoginOpen} />
          <LoginModal open={isLoginOpen} handleClose={handleLoginClose} />
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Container>
    </React.Fragment>
  );
}

// Gunmetal(#2A2D34)

// Certainly! Here’s how you can use different shades and colors effectively for various elements on your website:

// 1. Heading Text:
// Color: White(#FFFFFF) or Silver(#C0C0C0)
// Reason: Headings should stand out against the Gunmetal background, so white or a light metallic gray provides high contrast and draws attention.
// 2. Paragraph Text:
// Color: Light Gray(#D3D3D3) or Slate Gray(#708090)
// Reason: These colors offer good readability while being softer than the heading color.They are easier on the eyes for longer reading.
// 3. Points or Subheadings:
// Color: Charcoal(#2C2F36) or Dark Slate(#23272B)
// Reason: These shades are slightly lighter or darker than the Gunmetal background, making them ideal for highlighting points or subheadings without too much contrast.
// 4. Button Text:
// Color: White(#FFFFFF) or Electric Blue(#007BFF)
// Reason: For call - to - action buttons, white text provides a clean look, while Electric Blue adds a vibrant touch to make the buttons stand out.
// 5. Button Background:
// Color: Teal(#008080) or Emerald Green(#50C878)
// Reason: These colors offer a striking contrast with white text and complement the Gunmetal background.They are also eye - catching for user actions.
// 6. Links:
//   Color: Electric Blue(#007BFF) or Copper(#B87333)
// Reason: These colors are vibrant and stand out against the Gunmetal background, making links easily noticeable and inviting to click.
// 7. Accent Elements(e.g., Icons, Borders):
// Color: Steel Gray(#2E3238) or Platinum(#E5E5E5)
// Reason: These colors can add subtle accents without overwhelming the main color scheme, ensuring they enhance rather than distract from the design.
export default App;
