import api from "./axios/api";

const GET = async (url, queryParams) => {
    return await api.get(url, { params: queryParams });
};

const POST = async (url, data) => {
    return await api.post(url, data);
};

const POST_FORM = async (url, data) => {
    return await api.post(url, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

const PUT = async (url, data) => {
    return await api.put(url, data);
};

const DELETE = async (url) => {
    return await api.delete(url);
};

export { GET, POST, POST_FORM, PUT, DELETE };
