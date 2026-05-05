import axios from 'axios';

const JOB_API = axios.create({
    baseURL: 'http://localhost:80',
    headers: { 'Content-Type': 'application/json' },
});

const getJwtUserId = (): string | null => {
    try {
        const token = localStorage.getItem('auth_token') ?? sessionStorage.getItem('auth_token');
        if (!token) return null;
        const [, payload] = token.split('.');
        const decoded = JSON.parse(atob(payload));
        return decoded.sub ?? null;
    } catch {
        return null;
    }
};

export const getJfRole = (): string =>
    localStorage.getItem('jf_role') ?? 'USER';

export const apiGetMyProfile = (role?: string) =>
    JOB_API.get('/api/profile/me', {
        headers: {
            'X-User-Id': getJwtUserId(),
            'X-User-Role': `ROLE_${role ?? getJfRole()}`,
        },
    });

export const apiSetupProfile = (role: 'USER' | 'COMPANY', body: object) =>
    JOB_API.post('/api/profile/setup', body, {
        headers: {
            'X-User-Id': getJwtUserId(),
            'X-User-Role': `ROLE_${role}`,
        },
    });

export const apiGetOffer = (id: number) =>
    JOB_API.get<{ success: boolean; data: Offer }>(`/api/offers/${id}`);

export const apiApplyToOffer = (offerId: number, formData: FormData) =>
    JOB_API.post(`/api/offers/${offerId}/apply`, formData, {
        headers: {
            'X-User-Id': getJwtUserId(),
            'X-User-Role': 'ROLE_USER',
            'Content-Type': 'multipart/form-data',
        },
    });

export const apiGetMyApplications = () =>
    JOB_API.get('/api/applications', {
        headers: {
            'X-User-Id': getJwtUserId(),
            'X-User-Role': 'ROLE_USER',
        },
    });

export const apiGetCompanyOffers = (page = 1, limit = 10) =>
    JOB_API.get('/api/company/offers', {
        headers: {
            'X-User-Id': getJwtUserId(),
            'X-User-Role': 'ROLE_COMPANY',
        },
        params: { page, limit },
    });

export const apiDeleteOffer = (offerId: number) =>
    JOB_API.delete(`/api/company/offers/${offerId}`, {
        headers: {
            'X-User-Id': getJwtUserId(),
            'X-User-Role': 'ROLE_COMPANY',
        },
    });

export const apiCreateOffer = (payload: object) =>
    JOB_API.post('/api/company/offers', payload, {
        headers: {
            'X-User-Id': getJwtUserId(),
            'X-User-Role': 'ROLE_COMPANY',
        },
    });

export const apiUpdateOffer = (offerId: number, payload: object) =>
    JOB_API.patch(`/api/company/offers/${offerId}`, payload, {
        headers: {
            'X-User-Id': getJwtUserId(),
            'X-User-Role': 'ROLE_COMPANY',
        },
    });

export const apiGetCompanyOfferById = (offerId: number) =>
    JOB_API.get<{ success: boolean; data: Offer }>(`/api/company/offers/${offerId}`, {
        headers: {
            'X-User-Id': getJwtUserId(),
            'X-User-Role': 'ROLE_COMPANY',
        },
    });

export interface Application {
    id: number;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    coverLetter: string | null;
    cvUrl: string | null;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    appliedAt: string;
}

export interface ApplicationsResponse {
    success: boolean;
    data: Application[];
    meta: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export const apiGetOfferApplications = (offerId: number, page = 1, limit = 20) =>
    JOB_API.get<ApplicationsResponse>(`/api/company/offers/${offerId}/applications`, {
        headers: {
            'X-User-Id': getJwtUserId(),
            'X-User-Role': 'ROLE_COMPANY',
        },
        params: { page, limit },
    });

export const apiUpdateApplicationStatus = (
    applicationId: number,
    status: 'ACCEPTED' | 'REJECTED'
) =>
    JOB_API.patch(
        `/api/company/applications/${applicationId}`,
        { status },
        {
            headers: {
                'X-User-Id': getJwtUserId(),
                'X-User-Role': 'ROLE_COMPANY',
            },
        }
    );


export interface Offer {
    id: number;
    companyId: string;
    title: string;
    description: string;
    responsibilities: string | null;
    requirements: string | null;
    niceToHave: string | null;
    city: string;
    contractType: string;
    salary: string | null;
    status: string;
    createdAt: string;
}

export interface OffersResponse {
    success: boolean;
    data: Offer[];
    meta: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export const apiGetOffers = (params?: {
    q?: string;
    city?: string;
    contractType?: string;
    page?: number;
    limit?: number;
}) => JOB_API.get<OffersResponse>('/api/offers', { params });


export const apiGetPendingOffers = (page = 1, limit = 50) =>
    JOB_API.get<OffersResponse>('/api/admin/offers', {
        headers: {
            'X-User-Id': getJwtUserId(),
            'X-User-Role': 'ROLE_ADMIN',
        },
        params: { page, limit, status: 'PENDING' },
    });

export const apiAdminGetAllOffers = (page = 1, limit = 50) =>
    JOB_API.get<OffersResponse>('/api/admin/offers', {
        headers: {
            'X-User-Id': getJwtUserId(),
            'X-User-Role': 'ROLE_ADMIN',
        },
        params: { page, limit },
    });

export const apiModerateOffer = (offerId: number, status: 'APPROVED' | 'REJECTED') =>
    JOB_API.patch(
        `/api/admin/offers/${offerId}/moderate`,
        { status },
        {
            headers: {
                'X-User-Id': getJwtUserId(),
                'X-User-Role': 'ROLE_ADMIN',
            },
        }
    );
export const apiSaveOffer = (offerId: number) =>
    JOB_API.post(`/api/offers/${offerId}/save`, {}, {
        headers: {
            'X-User-Id': getJwtUserId(),
            'X-User-Role': 'ROLE_USER',
        },
    });

export const apiUnsaveOffer = (offerId: number) =>
    JOB_API.delete(`/api/offers/${offerId}/save`, {
        headers: {
            'X-User-Id': getJwtUserId(),
            'X-User-Role': 'ROLE_USER',
        },
    });

export interface NotificationItem {
    id: number;
    type: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export interface NotificationsResponse {
    success: boolean;
    unread: number;
    data: NotificationItem[];
}

export const apiGetNotifications = () =>
    JOB_API.get<NotificationsResponse>('/api/notifications', {
        headers: {
            'X-User-Id': getJwtUserId(),
            'X-User-Role': `ROLE_${getJfRole()}`,
        },
    });

export const apiMarkNotificationsRead = () =>
    JOB_API.patch('/api/notifications/read', {}, {
        headers: {
            'X-User-Id': getJwtUserId(),
            'X-User-Role': `ROLE_${getJfRole()}`,
        },
    });

// saved offers page
export const apiGetSavedOffers = () =>
    JOB_API.get('/api/saved-offers', {
        headers: {
            'X-User-Id': getJwtUserId(),
            'X-User-Role': 'ROLE_USER',
        },
    });
