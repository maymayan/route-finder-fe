import {createTheme} from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#9c27b0',
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        h1: {
            fontSize: '2rem',
            fontWeight: 600,
        },
        h2: {
            fontSize: '1.5rem',
            fontWeight: 500,
        },
        h4: {
            fontWeight: 600,
        },
        button: {
            textTransform: 'none',
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    padding: '1rem',
                },
            },
        },
        MuiTypography: {
            variants: [
                {
                    props: {variant: 'h4'},
                    style: {
                        borderBottom: '3px solid #1976d2',
                        paddingBottom: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginTop: '1rem',
                    },
                },
            ],
        },
    },
});

export default theme;
