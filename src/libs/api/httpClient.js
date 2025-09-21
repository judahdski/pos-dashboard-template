import api from "./axios/api";
import qs from "qs";
import { resolveFormData } from "./utils";

const GET = async (url, queryParams) => {
    return await api.get(url, { params: queryParams });
};

const POST = async (url, data, options = {}) => {
    return await api.post(url, data, options);
};

const POST_AUTH = async (url, data, options = {}) => {
    return await api.post(url, data, { ...options, isAuthRequired: false });
};

const POST_AUTO = async (url, data, options = {}) => {
    if (typeof data != "object")
        throw new Error("Invalid: Data must be object");

    const headers = { ...options.headers };

    // Convert object data to FormData kalo ada File/Blob
    const hasFile = Object.values(data).some(
        (element) => element instanceof File || element instanceof Blob
    );
    const isBlob = data instanceof Blob || data instanceof File;
    if (hasFile && isBlob) data = resolveFormData(data);

    // Set default content type
    if (!headers["Content-Type"]) {
        if (data instanceof URLSearchParams || typeof data === "string") {
            data = data.toString();
            headers["Content-Type"] = "application/x-www-form-urlencoded";
        } else if (!(data instanceof FormData))
            headers["Content-Type"] = "application/json";
    } else {
        if (headers["Content-Type"] === "application/x-www-form-urlencoded") {
            if (
                !(data instanceof URLSearchParams) ||
                typeof data !== "string"
            ) {
                if (data instanceof FormData) {
                    throw new Error(
                        "Invalid: Cannot send FormData with x-www-form-urlencoded Content-Type"
                    );
                }
                if (Array.isArray(data)) {
                    // temporary
                    throw new Error(
                        "Invalid: Cannot send array with x-www-form-urlencoded Content-Type"
                    );
                }
                if (typeof data == "object") {
                    data = qs.stringify(data);
                }
            }
        } else if (headers["Content-Type"] === "multipart/form-data") {
            if (!(data instanceof FormData)) {
                if (typeof data == "string") {
                    throw new Error(
                        "Invalid: Cannot send string with multipart/form-data Content-Type"
                    );
                } else if (Array.isArray(data)) {
                    // temporary
                    throw new Error(
                        "Invalid: Cannot send array with multipart/form-data Content-Type"
                    );
                } else {
                    data = resolveFormData(data);
                }
            }
            delete headers["Content-Type"]; // axios yang set
        } else if (headers["Content-Type"] === "application/json") {
            if (typeof data !== "string") {
                if (data instanceof FormData) {
                    throw new Error(
                        "Invalid: Cannot send FormData with application/json Content-Type"
                    );
                }
                if (typeof data == "object") {
                    data = JSON.stringify(data);
                }
            }
        }
    }

    return await api.post(url, data, { ...options, headers });
};

const PUT = async (url, data, options = {}) => {
    return await api.put(url, data, options);
};

const DELETE = async (url) => {
    return await api.delete(url);
};

export { GET, POST, POST_AUTO, PUT, DELETE };
