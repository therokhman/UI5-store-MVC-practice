/**
 * Module providing utility functions for making HTTP requests.
 *
 * @module apiUtils
 */

/**
 * Sends an HTTP request using XMLHttpRequest.
 * 
 * @function
 * @name sendRequest
 * @param {string} method - The HTTP method for the request (e.g., "GET", "POST", "PUT", "DELETE").
 * @param {string} requestURL - The URL to send the request to.
 * @param {Object|null} body - The request body, if applicable (default is null).
 * @param {Object} headers - The request headers as key-value pairs (default is an empty object).
 * @returns {Promise} A promise that resolves with the response data or rejects with an error.
 * @public
 * @example
 * const requestOptions = {
 *   method: 'GET',
 *   url: 'https://api.example.com/data',
 *   headers: {
 *     'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
 *   }
 * };
 * sendRequest(requestOptions.method, requestOptions.url, null, requestOptions.headers)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export function sendRequest(method, requestURL, body = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open(method, requestURL);

        if (method !== "DELETE") {
            xhr.responseType = "json";
        }

        for (const [header, value] of Object.entries(headers)) {
            xhr.setRequestHeader(header, value)
        }

        xhr.onload = function () {
            if (xhr.status >= 400) {
                reject(xhr.response);
            } else {
                resolve(xhr.response);
            }
        }

        xhr.onerror = function () {
            reject(`Error during ${method} request to ${requestURL}`);
        }

        xhr.send(body ? JSON.stringify(body) : null);
    })
}