import {Navigate} from 'react-router-dom';
import {JSX} from "react";
import {useAuth} from "./auth-context.tsx";

export const ProtectedRoute = ({children}: { children: JSX.Element }) => {
    const {isAuthenticated} = useAuth();
    return isAuthenticated ? children : <Navigate to="/login"/>;
};

export const RoleRoute = ({allowedRoles, children}: { allowedRoles: string[], children: JSX.Element }) => {
    const {userRole} = useAuth();
    return allowedRoles.includes(userRole) ? children : <Navigate to="/login"/>;
};
