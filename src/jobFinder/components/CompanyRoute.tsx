import React from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
    children: React.ReactNode;
}

const CompanyRoute: React.FC<Props> = ({ children }) => {
    const token = sessionStorage.getItem('auth_token') ?? localStorage.getItem('auth_token');

    if (!token) return <Navigate to="/login" replace />;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role !== 'COMPANY') return <Navigate to="/jobfinder" replace />;
    } catch {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default CompanyRoute;