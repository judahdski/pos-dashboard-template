export const resolveFormData = (data) => {
    if (data instanceof FormData) return data;

    if (data instanceof Blob || data instanceof File) {
        // Axios bakal ngeset content-type ke multipart/form-data dan boundary-nya kalo data kedetect FormData
        const fd = new FormData();
        fd.append("file", data);
        return fd;
    }

    const formData = new FormData();

    for (const key in data) {
        if (!Object.hasOwn(data, key)) continue;
        const value = data[key];

        appendFormData(formData, key, value);
    }

    return formData;
};

const appendFormData = (formData, key, value) => {
    if (Array.isArray(value)) {
        value.forEach((item, index) => {
            appendFormData(formData, `arr-${index}-${key}`, item);
        });
    } else if (value instanceof File || value instanceof Blob) {
        formData.append(key, value);
    } else if (typeof value === "object" && value !== null) {
        // default: JSON-encode object/array
        formData.append(key, JSON.stringify(value));
    } else {
        formData.append(key, value);
    }
};

// export const resolveContentType = (data) => {
//     if (data instanceof URLSearchParams) {
//         data = data.toString();
//         options.headers["Content-Type"] = "application/x-www-form-urlencoded";
//     } else if (data instanceof FormData == false)
//         options.headers["Content-Type"] = "application/json";

//     // Axios bakal ngeset content-type ke multipart/form-data dan boundary-nya kalo data kedetect FormData
// };
