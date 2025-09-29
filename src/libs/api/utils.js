// Tujuan: Convert object data to FormData kalo ada File/Blob dan data masih berbentuk object biasa
// Catatan: kalo data sudah berbentuk FormData, URLSearchParams, atau string, ga perlu diapa-apain
// Catatan: kalo data berupa Blob/File, langsung convert ke FormData
// Catatan: kalo data berupa object biasa, cek apakah ada value yang berupa Blob/File, kalo ada convert ke FormData
// Catatan: kalo data berupa object biasa, dan ga ada value yang berupa Blob/File, biarkan tetap sebagai object biasa
export const resolveFormData = (data) => {
    if (
        data instanceof FormData ||
        data instanceof URLSearchParams ||
        typeof data === "string"
    )
        return data;

    if (data instanceof Blob || data instanceof File) {
        // Axios bakal ngeset content-type ke multipart/form-data dan boundary-nya kalo data kedetect FormData
        const fd = new FormData();
        fd.append("file", data);
        return fd;
    }

    const hasFile = Object.values(data).some(
        (element) => element instanceof File || element instanceof Blob
    );

    if (hasFile) {
        const formData = new FormData();

        for (const key in data) {
            if (!Object.hasOwn(data, key)) continue;
            const value = data[key] ?? {};

            appendFormData(formData, key, value);
        }

        return formData;
    }

    return data;
};

const appendFormData = (formData, key, value) => {
    if (Array.isArray(value)) {
        value.forEach((item, index) => {
            appendFormData(formData, `arr[${index}].${key}`, item);
        });
    } else if (typeof value === "object") {
        formData.append(key, JSON.stringify(value)); // default: JSON-encode object/array
    } else {
        formData.append(key, value);
    }
};

// Tujuan: Cek apakah sebuah string adalah JSON yang valid dan hasil parse-nya adalah object atau array
// Catatan: string JSON yang valid tapi hasil parse-nya adalah number/string/boolean/null dianggap bukan JSON yang valid
export const isJsonString = (str) => {
    if (typeof str !== "string") return false;

    str = str.trim();

    try {
        if (str.startsWith("{") || str.startsWith("[")) {
            const parsed = JSON.parse(str);
            // JSON harus hasilin object atau array, bukan number/string/boolean/null
            return typeof parsed === "object" && parsed !== null;
        }
    } catch {
        return false;
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
