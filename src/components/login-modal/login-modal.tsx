import React, { useState } from 'react';
import {
    Modal,
    Box,
    TextField,
    Button,
    Typography,
    IconButton,
    Link,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { default as axios } from 'axios';
import { config } from '../../config';

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};
console.log(axios)

interface LoginModalProps {
    open: boolean;
    handleClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, handleClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${config.baseURL}/auth/login`, { email, password }, {
                withCredentials: true // This is necessary to send cookies
            });
            const { token } = response.data;
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            console.log('Login successful:', response.data);
            handleClose();
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const handleSignup = async () => {
        try {
            const response = await axios.post(`${config.baseURL}/auth/signup`, { email, password }, {
                withCredentials: true // This is necessary to send cookies
            });
            console.log('Signup successful:', response.data);
            // After successful signup, switch to login
            setIsLogin(true);
        } catch (error) {
            console.error('Signup failed:', error);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" component="h2">
                    {isLogin ? 'Login' : 'Signup'}
                </Typography>
                <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={isLogin ? handleLogin : handleSignup}
                    >
                        {isLogin ? 'Login' : 'Signup'}
                    </Button>
                    <Box display="flex" justifyContent="space-between" mt={2}>
                        {isLogin ? (
                            <Link
                                href="#"
                                onClick={() => console.log('Forgot Password')}
                                variant="body2"
                            >
                                Forgot password?
                            </Link>
                        ) : null}
                        <Link
                            href="#"
                            onClick={() => setIsLogin(!isLogin)}
                            variant="body2"
                        >
                            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default LoginModal;
