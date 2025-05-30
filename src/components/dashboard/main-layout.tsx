import type {PropsWithChildren} from "react";
import * as React from 'react';
import {AppProvider, type Navigation, type Router, Session} from '@toolpad/core/AppProvider';
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PublicIcon from '@mui/icons-material/Public';
import PlaceIcon from '@mui/icons-material/Place';
import CommuteIcon from '@mui/icons-material/Commute';
import RouteIcon from '@mui/icons-material/Route';
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "../../context/auth-context.tsx";
import {createTheme} from "@mui/material/styles";
import {DashboardLayout} from "@toolpad/core";
import {Box, Typography} from "@mui/material";
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

export const getNavigation = (): Navigation => {
    const commonItems: Navigation = [
        {
            segment: 'route',
            title: 'Route Search',
            icon: <RouteIcon/>,
        },
    ];

    const adminOnlyItems: Navigation = [
        {
            segment: 'cities',
            title: 'Cities',
            icon: <LocationCityIcon/>,
        },
        {
            segment: 'countries',
            title: 'Countries',
            icon: <PublicIcon/>,
        },
        {
            segment: 'location',
            title: 'Location',
            icon: <PlaceIcon/>,
        },
        {
            segment: 'transportation',
            title: 'Transportation',
            icon: <CommuteIcon/>,
        },
    ];

    return localStorage.getItem('role') === "ADMIN" ? [...adminOnlyItems, ...commonItems] : commonItems;
};


const demoTheme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: {light: true, dark: true},
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },
});


export default function MainLayout({children}: PropsWithChildren) {
    const {userRole, logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();           // Token'ı temizle
        navigate('/login'); // Login sayfasına yönlendir
    };

    const location = useLocation();

    const router = React.useMemo<Router>(() => {
        return {
            pathname: location.pathname,
            searchParams: new URLSearchParams(location.search),
            navigate: (path) => navigate(path),
        };
    }, [location, navigate]);

    function dashboardTitle() {
        return <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
        }}>
            <Typography fontWeight="bold" maxWidth={"max-content"} variant="h5" sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mt: 2,
                mb: 2,
                color: 'primary.main',
                pb: 1,
            }}>
                <TravelExploreIcon/>
                Route Finder
            </Typography>

        </Box>
    }

    const [session, setSession] = React.useState<Session | null>({
        user: {
            name: localStorage.getItem('username') || 'Guest',
            email: '',
            image: '<AccountCircleIcon/>',
        },
    });
    const authentication = React.useMemo(() => {
        return {
            signIn: () => {
                setSession(null);
            },
            signOut: () => {
                handleLogout();
            },
        };
    }, []);

    return (
        <AppProvider navigation={getNavigation()} router={router} theme={demoTheme} session={session}
                     authentication={authentication}
        >
            <DashboardLayout disableCollapsibleSidebar={true}
                             slots={{
                                 appTitle: dashboardTitle,
                             }}
            >
                <Outlet/>
            </DashboardLayout>
        </AppProvider>
    );
}