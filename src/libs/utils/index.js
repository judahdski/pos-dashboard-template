const LOGGER = (msg, type = "info") => {
    // if (process.env.NODE_ENV === "production") return;

    if (type == "info") {
        console.log(msg);
    } else if (type == "success") {
        console.log(`%c${msg}`, "color: green;");
    } else if (type == "error") {
        console.error(`%c${msg}`, "color: red;");
    }
};

const INFO_LOGGER = (msg) => LOGGER(msg, "info");
const SUCCESS_LOGGER = (msg) => LOGGER(msg, "success");
const ERROR_LOGGER = (msg) => LOGGER(msg, "error");
const SEPARATOR_LOGGER = () =>
    LOGGER("=====================================================");

export { INFO_LOGGER, SUCCESS_LOGGER, ERROR_LOGGER, SEPARATOR_LOGGER };
