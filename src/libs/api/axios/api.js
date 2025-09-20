import axios from "axios";
import { requestErrorHandler, requestSuccessHandler } from "./requestHandler";
import {
    responseErrorHandler,
    responseSuccessHandler,
} from "./responseHandler";

// Axios instance / config
const api = axios.create({
    baseURL: "https://jsonplaceholder.typicode.com",
    timeout: 10000,
});

// Interceptors request
api.interceptors.request.use(requestSuccessHandler, requestErrorHandler);

// Interceptors response
api.interceptors.response.use(responseSuccessHandler, responseErrorHandler);

export default api;
