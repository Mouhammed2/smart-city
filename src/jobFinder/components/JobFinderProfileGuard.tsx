import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/store/useAuth';
import { apiGetMyProfile } from '../api/jobfinder.api';
import JobFinderLoader from './JobFinderLoader';

interface Props {
    children: React.ReactNode;
}

const JobFinderProfileGuard: React.FC<Props> = ({ children }) => {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [complete, setComplete] = useState<boolean | null>(null);
    const [animationDone, setAnimationDone] = useState(false);

    useEffect(() => {
        if (authLoading || !isAuthenticated || !user) return;

        const token = localStorage.getItem('auth_token') ?? sessionStorage.getItem('auth_token');
        let roleFromToken = 'USER';
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                roleFromToken = payload.role ?? 'USER';
            } catch {
                roleFromToken = 'USER';
            }
        }

        localStorage.setItem('jf_role', roleFromToken);
        sessionStorage.setItem('jf_role', roleFromToken);

        if (roleFromToken === 'ADMIN') {
            setComplete(true);
            return;
        }

        apiGetMyProfile(roleFromToken)
            .then((res) => setComplete(res.data.data.complete))
            .catch(() => setComplete(false));
    }, [authLoading, isAuthenticated, user]);

    // Show loader if: auth loading, profile check pending, OR animation not done yet
    const showLoader = authLoading || complete === null || !animationDone;

    if (!isAuthenticated && !authLoading) return <Navigate to="/login" replace />;

    if (showLoader) {
        return (
            <JobFinderLoader
                onFinish={() => setAnimationDone(true)}
            />
        );
    }

    if (!complete) return <Navigate to="/jobfinder/profile/setup" replace />;

    return <>{children}</>;
};

export default JobFinderProfileGuard;