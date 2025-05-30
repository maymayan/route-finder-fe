// src/App.tsx

import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import CityPage from './components/city/city-page.tsx';
import CountryPage from './components/country/country-page.tsx';
import LocationPage from "./components/location/location-page.tsx";
import TransportationPage from "./components/transportation/transportation-page.tsx";
import {JSX, Suspense} from "react";
import LoginPage from "./components/login/LoginPage.tsx";
import MainLayout from "./components/dashboard/main-layout.tsx";
import {RoleRoute} from "./context/protected-route.tsx";
import RoutePage from "./components/route/RoutePage.tsx";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({children}) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login"/>;
};
export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>

                <Route path="/" element={
                    <ProtectedRoute>
                        <MainLayout/>
                    </ProtectedRoute>
                }>
                    <Route index element={<div>Ana Sayfa</div>}/>
                    <Route path="/cities" element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <RoleRoute allowedRoles="ADMIN">
                                <CityPage/>
                            </RoleRoute>
                        </Suspense>
                    }/>
                    <Route path="/countries" element={
                        <RoleRoute allowedRoles="ADMIN">
                            <CountryPage/>
                        </RoleRoute>
                    }/>
                    <Route path="/location" element={
                        <RoleRoute allowedRoles="ADMIN">
                            <LocationPage/>
                        </RoleRoute>
                    }/>
                    <Route path="/transportation" element={
                        <RoleRoute allowedRoles="ADMIN">
                            <TransportationPage/>
                        </RoleRoute>
                    }/>
                    <Route path="/route" element={
                        <RoleRoute allowedRoles={['ADMIN', 'USER']}>
                            <RoutePage/>
                        </RoleRoute>
                    }/>
                </Route>

                <Route path="*" element={<Navigate to="/"/>}/>
            </Routes>
        </BrowserRouter>
        /*
        <Router>
            <MainLayout>
                <Routes>
                    <Route path="/" element={<LoginPage/>}/>
                    <Route
                        path="/route-calculation"
                        element={
                            <ProtectedRoute>
                                <CityPage/>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/cities" element={<CityPage/>}/>
                    <Route path="/countries" element={<CountryPage/>}/>
                    <Route path="/location" element={<LocationPage/>}/>
                    <Route path="/transportation" element={<TransportationPage/>}/>
                    {/!* Diğer sayfaları burada tanımlayabilirsin *!/}
                </Routes>
            </MainLayout>
        </Router>*/
    );
}
