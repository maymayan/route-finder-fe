import React from 'react';
import {Button, Container, Typography} from '@mui/material';

const HomePage: React.FC = () => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <Container sx={{mt: 8}}>
            <Typography variant="h4" gutterBottom>Hoş Geldiniz!</Typography>
            <Button variant="outlined" onClick={handleLogout}>
                Çıkış Yap
            </Button>
        </Container>
    );
};

export default HomePage;
