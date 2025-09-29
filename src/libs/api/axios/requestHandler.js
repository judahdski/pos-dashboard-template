import { ERROR_LOGGER, INFO_LOGGER, SEPARATOR_LOGGER } from "../../utils";
import { isJsonString, resolveFormData } from "../utils";
import qs from "qs";

// Tugas interceptor ini:
// 1. Set content-type dan sesuaikan dengan data yang dikirim
// 2. Set Authorization header kalo perlu
// 3. Logging request
const requestSuccessHandler = (config) => {
    config.metadata = {
        startTime: Date.now(),
    };

    // set headers
    if (config.method == "post" || config.method == "put") {
        config = postRequestInterceptorHandler(config);
        // apakah return Promise.reject() di atas akan masuk ke requestErrorHandler() di bawah?
    }

    // Set Authorization header
    config = authTokenChecker(config);

    // LOGGING
    const fullURL = `${config.baseURL?.replace(/\/$/, "")}${config.url}`;
    const method = (config.method || "-").toUpperCase();

    SEPARATOR_LOGGER();
    INFO_LOGGER(`Requesting [${config.startTime}] [${method}] ${fullURL}...`);

    if (config.params) {
        const stringified = JSON.stringify(config.params);
        INFO_LOGGER(
            `Params: ${
                stringified.length > 300
                    ? stringified.slice(0, 300) + "..."
                    : stringified
            }`
        );
    }
    if (config.data) {
        const stringified = JSON.stringify(config.data);
        INFO_LOGGER(
            `Data: ${
                stringified.length > 500
                    ? stringified.slice(0, 500) + "..."
                    : stringified
            }`
        );
    }

    INFO_LOGGER(`Content-Type: ${config.headers["Content-Type"]}`);

    return config;
};

const authTokenChecker = (config) => {
    const headers = config.headers || {};

    // Get token
    if (config.isAuthRequired === undefined) config.isAuthRequired = true;
    const token = localStorage.getItem("access_token");

    if (config.isAuthRequired) {
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        } else {
            const tokenErr = new Error("Access token is invalid!");
            tokenErr.isTokenError = true;

            return Promise.reject(tokenErr);
        }
    }

    config.headers = { ...headers, ...config.headers };
    return config;
};

const postRequestInterceptorHandler = (config) => {
    config.timeout = 20000; // default timeout untuk POST/PUT

    const headers = config.headers || {};
    let data = config.data;

    if (data === undefined || data === null)
        return Promise.reject(new Error("Data is required!"));
    if (typeof data === "string" && !isJsonString(data))
        return Promise.reject(
            new Error(
                "Data is not a valid JSON string! Give object, FormData, URLSearchParams, or JSON string instead."
            )
        );

    // cek apakah ada content-type (case insensitive)
    const contentTypeHeaderKey = Object.keys(headers).find(
        (key) => key.toLowerCase() === "content-type"
    );

    // Set default content-type
    if (data instanceof URLSearchParams) {
        headers[contentTypeHeaderKey] = "application/x-www-form-urlencoded";
    } else if (data instanceof FormData) {
        headers[contentTypeHeaderKey] = "multipart/form-data";
    } else headers[contentTypeHeaderKey] = "application/json";

    // cek content-type dan sesuaikan data-nya
    if (headers[contentTypeHeaderKey] === "application/x-www-form-urlencoded") {
        // cara handling json string kalo content-type x-www-form-urlencoded?
        if (!(data instanceof URLSearchParams)) {
            if (data instanceof FormData) {
                return Promise.reject(
                    new Error(
                        "Invalid: Cannot send FormData with x-www-form-urlencoded Content-Type"
                    )
                );
            } else if (typeof data === "string" && isJsonString(data)) {
                return Promise.reject(
                    new Error(
                        "Invalid: Cannot send string JSON with x-www-form-urlencoded Content-Type"
                    )
                );
            }

            if (Array.isArray(data)) {
                data = qs.stringify(data, {
                    arrayFormat: "brackets",
                }); // a[]=1&a[]=2
            } else {
                data = qs.stringify(data); // key1=value1&key2=value2
            }
        }
    } else if (headers[contentTypeHeaderKey] === "multipart/form-data") {
        if (!(data instanceof FormData)) {
            if (data instanceof URLSearchParams) {
                return Promise.reject(
                    new Error(
                        "Invalid: Cannot send URLSearchParams with multipart/form-data Content-Type"
                    )
                );
            } else if (typeof data !== "object") {
                return Promise.reject(
                    new Error(
                        "Invalid: Cannot send non-object with multipart/form-data Content-Type"
                    )
                );
            }

            data = resolveFormData(data);
        }

        delete headers[contentTypeHeaderKey]; // axios yang set
    } else if (headers[contentTypeHeaderKey] === "application/json") {
        if (typeof data !== "string") {
            if (data instanceof FormData) {
                return Promise.reject(
                    new Error(
                        "Invalid: Cannot send FormData with application/json Content-Type"
                    )
                );
            } else if (data instanceof URLSearchParams) {
                return Promise.reject(
                    new Error(
                        "Invalid: Cannot send URLSearchParams with application/json Content-Type"
                    )
                );
            } else if (typeof data === "string" && !isJsonString(data)) {
                return Promise.reject(
                    new Error(
                        "Invalid: Cannot send string non-JSON with application/json Content-Type"
                    )
                );
            }

            data = JSON.stringify(data);
        }
    }

    config.data = data;
    config.headers = { ...headers, ...config.headers }; //apakah kalo config.headers udah ada isinya, dia bakal merge atau overwrite? apakah kalo config.headers null/undefined bakal error?

    return config;
};

const requestErrorHandler = (error) => {
    ERROR_LOGGER("Request failed!");

    if (error.isTokenError)
        INFO_LOGGER(`Error name: Token error;\nMessage: ${error.message}`);
    else INFO_LOGGER(`Error name: ${error.name};\nMessage: ${error.message}`);

    SEPARATOR_LOGGER();
    return Promise.reject(error);
};

export { requestSuccessHandler, requestErrorHandler };
