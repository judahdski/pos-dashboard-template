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
    validateStatus: (status) => status >= 200 && status < 400, // tujuannya biar '3xx' ga dianggap error
});

// Interceptors request
api.interceptors.request.use(requestSuccessHandler, requestErrorHandler);

// Interceptors response
api.interceptors.response.use(responseSuccessHandler, responseErrorHandler);

export default api;

// TODO : API error response status handling [DONE]
// TODO : API for FormData handling, convert plain object to FormData [DONE]
// TODO : API client form multipart handling [DONE]
// TODO : testing with dummy API (find on google)
// TODO : API for array handling
// TODO : set timeout berdasarkan method request
