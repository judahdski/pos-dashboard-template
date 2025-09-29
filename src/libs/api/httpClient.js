import api from "./axios/api";

const GET = async (url, queryParams) => {
    return await api.get(url, { params: queryParams });
};

const GET_AUTH = async (url, queryParams) => {
    return await api.get(url, { params: queryParams, isAuthRequired: false });
};

const POST = async (url, data, options = {}) => {
    return await api.post(url, data, options);
};

const POST_AUTH = async (url, data) => {
    return await api.post(url, data, { isAuthRequired: false });
};

const PUT = async (url, data, options = {}) => {
    return await api.put(url, data, options);
};

const DELETE = async (url) => {
    return await api.delete(url);
};

export { GET, GET_AUTH, POST, POST_AUTH, PUT, DELETE };

/**
 * TODO: buat function untuk handle method lain, tapi jangan explisit semacam PATCH, DELETE, dsb biar bisa dipake di semua method, misal: request(url, method, data, options) untuk handle semua method selain yang udah ada di atas
 */
