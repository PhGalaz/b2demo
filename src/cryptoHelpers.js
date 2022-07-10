const base64 = require('base64-js');
const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const { subtle } = require('node:crypto').webcrypto;


/**
 * Makes string from Uint8Array.
 *
 * @param buffer - Uint8Array with random char codes.
 * @returns String from symbols of given array.
 */
 function bufferToString(buffer) {
    const state = [];
    for (let i = 0; i < buffer.byteLength; i += 1) {
        const index = buffer[i] % CHARSET.length;
        state.push(CHARSET[index]);
    }
    return state.join('');
}


/**
 * Makes Base64 encoded string from Uint8Array of char codes.
 *
 * @param buffer - Hash as Uint8Array.
 * @returns Base64 encoded string without symbols which can affect url.
 */
 function urlSafe(buffer) {
    const encoded = base64.fromByteArray(new Uint8Array(buffer));
    return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}


/**
 * Makes Uint8Array from given string.
 *
 * @param str - Generated string of random symbols.
 * @returns Uint8Array of symbols codes in string.
 */
 function textEncodeLite(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0; i < str.length; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return bufView;
}



/**
 * This method generates fixed-length string with random symbols.
 *
 * @param size - Initial empty Uint8Array.
 * @returns String filled with random symbols.
 */
function generateRandomString(size) {
    const buffer = new Uint8Array(size);

    // fall back to Math.random() if the global crypto object is not available
    for (let i = 0; i < size; i += 1) {
        buffer[i] = (Math.random() * CHARSET.length) | 0;
    }

    return bufferToString(buffer);
}



/**
 * This function generates SHA-256 hash from some random code.
 *
 * @param code - Random code string.
 * @returns Url safe string, or error if code length is incorrect.
 */
 function deriveChallenge(code) {
    if (code.length < 43 || code.length > 128) {
        return Promise.reject('Invalid code length.');
    }
    // if (!hasSubtleCrypto) {
    //     return Promise.reject('window.crypto.subtle is unavailable.');
    // }
    return new Promise((resolve, reject) => {
        subtle.digest('SHA-256', textEncodeLite(code)).then(buffer => {
            return resolve(urlSafe(new Uint8Array(buffer)));
        }, error => reject(error));
    });
}


module.exports = {
    generateRandomString,
    deriveChallenge
}
