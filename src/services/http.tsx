import axios from 'axios';

const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL;

export const http = axios.create({
    baseURL: backendBaseUrl,
    headers: {
        'Content-Type': 'application/json',
    }
});

const requestHandler = (request: any) => {
    request.headers = {
        ...request.headers,
    };
    return request;
};

const responseHandler = (response: any) => {
    return response?.data;
};

const errorHandler = (error: any) => {
    return Promise.reject(error);
};
//
http.interceptors.request.use(
    (request) => requestHandler(request),
    (error) => errorHandler(error),
);

http.interceptors.response.use(
    (response) => responseHandler(response),
    (error) => errorHandler(error),
);