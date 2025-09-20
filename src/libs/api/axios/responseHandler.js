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

            ERROR_LOGGER(`[${reqMethod} | ${status}] ${fullURL}`);
            INFO_LOGGER(
                `Duration: ${duration}ms;\nData: ${JSON.stringify(data).slice(
                    0,
                    500
                )}...`
            );
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

export { responseSuccessHandler, responseErrorHandler };
