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
      credentials: 'include'
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
      <AppBar position="static">
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

export default App;
