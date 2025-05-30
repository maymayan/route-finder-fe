import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import theme from "./theme.ts";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {AuthProvider} from "./context/auth-context.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <App/>
            </ThemeProvider>
        </AuthProvider>
    </StrictMode>
)
