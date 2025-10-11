// Contoh: string acak dengan panjang 10
// console.log(stringGen(10));
const randomDigitGen = (len = 8) => {
    var text = "";
    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < len; i++) {
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return text;
};

export { randomDigitGen };
