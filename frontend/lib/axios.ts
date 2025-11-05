// lib/axios.ts
import axios from 'axios';
import { store } from '../redux/store';
import { login, logout } from '../redux/slices/authSlice';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({ baseURL, headers: { Accept: 'application/json', 'Content-Type': 'application/json' } });

api.interceptors.request.use(config => {
    const token = store.getState().auth.accessToken;
    if (!config.headers) config.headers = {};
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (err: any, token: string | null = null) => {
    failedQueue.forEach(p => (err ? p.reject(err) : p.resolve(token)));
    failedQueue = [];
};

api.interceptors.response.use(
    res => res,
    err => {
        const original = err.config;
        if (err.response?.status === 401 && !original._retry) {
            original._retry = true;
            if (isRefreshing) {
                return new Promise((res, rej) => failedQueue.push({ resolve: res, reject: rej })).then(token => {
                    original.headers['Authorization'] = `Bearer ${token}`;
                    return api(original);
                });
            }
            isRefreshing = true;
            const refresh = store.getState().auth.refreshToken;
            return api
                .post('/auth/refresh', { refreshToken: refresh, userUuid: store.getState().auth.user?._id })
                .then(r => {
                    const data = r.data as { accessToken: string };
                    store.dispatch(login({ accessToken: data.accessToken, refreshToken: refresh!, user: store.getState().auth.user! }));
                    processQueue(null, data.accessToken);
                    original.headers['Authorization'] = `Bearer ${data.accessToken}`;
                    return api(original);
                })
                .catch(e => {
                    processQueue(e, null);
                    store.dispatch(logout());
                    window.location.href = '/login';
                    return Promise.reject(e);
                })
                .then(
                    result => {
                        isRefreshing = false;
                        return result;
                    },
                    error => {
                        isRefreshing = false;
                        throw error;
                    }
                );
        }
        return Promise.reject(err);
    }
);

export default api;
