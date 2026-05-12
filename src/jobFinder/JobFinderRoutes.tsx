import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../auth/components/protected-route';
import JobFinderProfileGuard from './components/JobFinderProfileGuard';
import CompanyRoute from './components/CompanyRoute';
import JobListingPage from './pages/JobListingPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import OfferDetailPage from './pages/OfferDetailPage';
import ApplyPage from './pages/ApplyPage';
import ApplicationSuccessPage from './pages/ApplicationSuccessPage';
import MyApplicationsPage from "./pages/MyApplicationsPage";
import CompanyDashboardPage from './pages/company/CompanyDashboardPage';
import CompanyOfferFormPage from "./pages/company/CompanyOfferFormPage";
import CompanyOfferApplicationsPage from './pages/company/CompanyOfferApplicationsPage';
import AdminRoute from './components/AdminRoute';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import SavedOffersPage from './pages/SavedOffersPage';
import { useAuth } from '../auth/store/useAuth';
import JobFinderLoader from './components/JobFinderLoader';
import NotificationsPage from './pages/NotificationsPage';
import MyProfilePage from './pages/MyProfilePage';


const JobFinderRoutes: React.FC = () => {
    const { loading: authLoading } = useAuth();

    if (authLoading) return <JobFinderLoader />;

    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<JobListingPage />} />

            {/* Profile setup — protected but no profile guard */}
            <Route
                path="/profile/setup"
                element={
                    <ProtectedRoute>
                        <ProfileSetupPage />
                    </ProtectedRoute>
                }
            />

            {/* Offer details — public */}
            <Route path="/offers/:id" element={<OfferDetailPage />} />

            {/* Application */}
            <Route
                path="/offers/:id/apply"
                element={
                    <ProtectedRoute>
                        <JobFinderProfileGuard>
                            <ApplyPage />
                        </JobFinderProfileGuard>
                    </ProtectedRoute>
                }
            />

            {/* Application success */}
            <Route
                path="/offers/:id/apply/success"
                element={
                    <ProtectedRoute>
                        <ApplicationSuccessPage />
                    </ProtectedRoute>
                }
            />

            {/* User applications */}
            <Route
                path="/applications"
                element={
                    <ProtectedRoute>
                        <JobFinderProfileGuard>
                            <MyApplicationsPage />
                        </JobFinderProfileGuard>
                    </ProtectedRoute>
                }
            />

            {/* Company dashboard */}
            <Route
                path="/company"
                element={
                    <ProtectedRoute>
                        <CompanyRoute>
                            <JobFinderProfileGuard>
                                <CompanyDashboardPage />
                            </JobFinderProfileGuard>
                        </CompanyRoute>
                    </ProtectedRoute>
                }
            />

            {/* Company — new offer */}
            <Route
                path="/company/offers/new"
                element={
                    <ProtectedRoute>
                        <CompanyRoute>
                            <JobFinderProfileGuard>
                                <CompanyOfferFormPage />
                            </JobFinderProfileGuard>
                        </CompanyRoute>
                    </ProtectedRoute>
                }
            />

            {/* Company — edit offer */}
            <Route
                path="/company/offers/:id/edit"
                element={
                    <ProtectedRoute>
                        <CompanyRoute>
                            <JobFinderProfileGuard>
                                <CompanyOfferFormPage />
                            </JobFinderProfileGuard>
                        </CompanyRoute>
                    </ProtectedRoute>
                }
            />

            {/* Company — offer applicants */}
            <Route
                path="/company/offers/:id/applications"
                element={
                    <ProtectedRoute>
                        <CompanyRoute>
                            <JobFinderProfileGuard>
                                <CompanyOfferApplicationsPage />
                            </JobFinderProfileGuard>
                        </CompanyRoute>
                    </ProtectedRoute>
                }
            />

            {/* Company — applications received → redirect to dashboard */}
            <Route
                path="/company/applications"
                element={
                    <ProtectedRoute>
                        <CompanyRoute>
                            <JobFinderProfileGuard>
                                <Navigate to="/jobfinder/company" replace />
                            </JobFinderProfileGuard>
                        </CompanyRoute>
                    </ProtectedRoute>
                }
            />

            {/* Admin */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <AdminRoute>
                            <AdminDashboardPage />
                        </AdminRoute>
                    </ProtectedRoute>
                }
            />

            {/* Saved Offers */}
            <Route
                path="/saved-offers"
                element={
                    <ProtectedRoute>
                        <JobFinderProfileGuard>
                            <SavedOffersPage />
                        </JobFinderProfileGuard>
                    </ProtectedRoute>
                }
            />

            {/* Notifications */}

            <Route
                path="/notifications"
                element={
                    <ProtectedRoute>
                        <NotificationsPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/profile/me"
                element={
                    <ProtectedRoute>
                        <MyProfilePage />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default JobFinderRoutes;