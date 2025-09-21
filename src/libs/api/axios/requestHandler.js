import { ERROR_LOGGER, INFO_LOGGER, SEPARATOR_LOGGER } from "../../utils";

const requestSuccessHandler = (config) => {
    config.metadata = {
        startTime: Date.now(),
    };

    const fullURL = `${config.baseURL?.replace(/\/$/, "")}${config.url}`;
    const method = (config.method || "-").toUpperCase();

    SEPARATOR_LOGGER();
    INFO_LOGGER(`Requesting [${method}] ${fullURL}...`);

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

    // Set headers
    config.headers = config.headers || {};

    // Get token
    if (config.isAuthRequired === undefined) config.isAuthRequired = true;
    const token = localStorage.getItem("access_token");

    if (config.isAuthRequired) {
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            const tokenErr = new Error("Access token is invalid!");
            tokenErr.isTokenError = true;

            return Promise.reject(tokenErr);
        }
    }

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
