import { ERROR_LOGGER, INFO_LOGGER, SEPARATOR_LOGGER } from "../../utils";

const requestSuccessHandler = (config) => {
    config.metadata = {
        startTime: Date.now(),
    };

    const fullURL = `${config.baseURL?.replace(/\/$/, "")}${config.url}`;
    const method = (config.method || "-").toUpperCase();

    SEPARATOR_LOGGER();
    INFO_LOGGER(`Requesting [${method}] ${fullURL}`);

    if (config.params) INFO_LOGGER(`Params: ${JSON.stringify(config.params)}`);
    if (config.data)
        INFO_LOGGER(`Data: ${JSON.stringify(config.data).slice(0, 500)}...`);

    // Get token
    const token = localStorage.getItem("access_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        const tokenErr = new Error("Access token is invalid!");
        tokenErr.isTokenError = true;

        return Promise.reject(tokenErr);
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
