import {
    ERROR_LOGGER,
    INFO_LOGGER,
    SEPARATOR_LOGGER,
    SUCCESS_LOGGER,
} from "../../utils";

const responseSuccessHandler = (response) => {
    const { config, status, data } = response;

    const reqMethod = (config.method || "-").toUpperCase();
    const fullURL = `${config.baseURL?.replace(/\/$/, "")}${config.url}`;
    const duration = Date.now() - (config.metadata.startTime || 0);

    SUCCESS_LOGGER(`[${reqMethod}] ${fullURL}`);
    INFO_LOGGER(
        `Duration: ${duration}ms;\nStatus: ${status};\nData: ${JSON.stringify(
            data
        ).slice(0, 500)}...`
    );

    SEPARATOR_LOGGER();

    return response;
};

const responseErrorHandler = (error) => {
    if (error.config) {
        const { config } = error;

        const reqMethod = (config.method || "-").toUpperCase();
        const fullURL = `${config.baseURL?.replace(/\/$/, "")}${config.url}`;
        const duration = Date.now() - (config.metadata.startTime || 0);

        if (error.response) {
            const { status, data } = error.response;

            ERROR_LOGGER(`[${reqMethod}] ${fullURL} | ${status}`);
            INFO_LOGGER(
                `Duration: ${duration}ms;\nData: ${JSON.stringify(data).slice(
                    0,
                    500
                )}...`
            );

            resolveHttpError(status);
        } else {
            ERROR_LOGGER(`[${reqMethod} | NETWORK/UNKNOWN ERROR] ${fullURL}`);
            INFO_LOGGER(`Duration: ${duration}ms;`);
        }
    } else {
        ERROR_LOGGER("Response error without config (weird case)!");
    }

    SEPARATOR_LOGGER();

    return Promise.reject(error);
};

const resolveHttpError = (status) => {
    if (status >= 400 && status < 500) {
        if (status === 400) {
            // TO-DO: what to do when 'error bad request'
        } else if (status === 401) {
            // TO-DO: what to do when 'error unauthorized'
        } else if (status === 403) {
            // TO-DO: what to do when 'error forbidden'
        } else if (status === 404) {
            // TO-DO: what to do when 'error not found'
        } else if (status === 429) {
            // TO-DO: what to do when 'error too many requests'
        } else {
            // TO-DO: what to do when 'error 4xx'
        }
    }

    if (status >= 500) {
        if (status === 500) {
            // TO-DO: what to do when 'error internal server error'
        } else if (status === 502) {
            // TO-DO: what to do when 'error bad gateway'
        } else if (status === 503) {
            // TO-DO: what to do when 'error service unavailable'
        } else if (status === 504) {
            // TO-DO: what to do when 'error gateway timeout'
        } else {
            // TO-DO: what to do when 'error 5xx'
        }
    }
};

export { responseSuccessHandler, responseErrorHandler };
