import React, {useState} from 'react';
import {Button, Container, TextField, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import baseApi from "../../services/base-api.ts";
import {useAuth} from "../../context/auth-context.tsx";

const LoginPage: React.FC = () => {
    const {login} = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await baseApi.post('/api/auth/login', {username, password});
            const {token, role} = response.data;
            login(token, role);
            localStorage.setItem('username', username);
            navigate('/route');
        } catch (err) {
            localStorage.removeItem('username');
            alert('Giriş başarısız!');
        }
    };

    return (

        <Container maxWidth="sm" sx={{mt: 10}}>
            <Typography align={"center"} color={"blue"} variant={"h1"}>Welcome To Route Finding App</Typography>

            <form onSubmit={handleLogin}>
                <TextField fullWidth label="Username" margin="normal" value={username}
                           onChange={(e) => setUsername(e.target.value)}/>
                <TextField fullWidth type="password" label="Password" margin="normal" value={password}
                           onChange={(e) => setPassword(e.target.value)}/>
                <Button type={"submit"} fullWidth variant="contained" sx={{mt: 2}}>Login</Button>
            </form>
        </Container>
    )
        ;
};

export default LoginPage;
