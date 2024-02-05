/**
 * Module providing Model class of the application.
 *
 * @module Model
 */

/**
 * Represents the apiUtils module of the application.
 *
 * @external sendRequest
 * @see {@link ./apiUtils.js}
 */

/**
 * Import of the sendRequest function.
 *
 * @type {external:sendRequest}
 */
import { sendRequest } from "./apiUtils.js";

/**
 * @class Model
 * @classdesc Represents a model that interacts with the API to manage stores and products.
 */
export class Model {
    /**
     * Fetches stores based on the provided query string.
     * @param {string=} queryString - The query string to filter stores.
     * @returns {Promise} A promise that resolves with the result of the API request.
     * @public
     */
    fetchStores(queryString = "") {
        const url = "http://localhost:3000/api/Stores";
        const queryJSON = queryString ? {
            "where": {
                "or": [{
                    "Name": {
                        "ilike": queryString
                    }
                }, {
                    "Address": {
                        "ilike": queryString
                    }
                }, {
                    "FloorArea": {
                        "ilike": queryString
                    }
                }]
            }
        } : null;
    
        const queryParam = queryString ? `?filter=${encodeURIComponent(JSON.stringify(queryJSON))}` : "";
    
        return sendRequest("GET", url + queryParam, null, {
            "Content-Type": "application/json"
        })
    }

    /**
     * Fetches products for a specific store and based on the provided query string.
     * @param {string} storeId - The ID of the store for which to fetch products.
     * @param {string} queryString - The query string to filter products.
     * @returns {Promise} A promise that resolves with the result of the API request.
     * @public
     */
    fetchProducts(storeId, queryString) {
        const url = `http://localhost:3000/api/Stores/${storeId}/rel_Products`;
        const queryJSON = queryString ? {
            "where": {
                "Status": queryString
            }
        } : null;
    
        const queryParam = queryString ? `?filter=${encodeURIComponent(JSON.stringify(queryJSON))}` : "";
    
        return sendRequest("GET", url + queryParam, null, {
            "Content-Type": "application/json"
        })
    }

    /**
     * Creates a new store.
     * @param {Object} storeData - The data for the new store.
     * @returns {Promise} A promise that resolves with the result of the API request.
     * @public
     */
    createStore(storeData) {
        return sendRequest("POST", "http://localhost:3000/api/Stores", storeData, {
            "Content-Type": "application/json",
            "Accept": "application/json"
        })
    }

    /**
     * Creates a new product for a specific store.
     * @param {Object} productData - The data for the new product.
     * @param {string} selectedStoreId - The ID of the store for which to create the product.
     * @returns {Promise} A promise that resolves with the result of the API request.
     * @public
     */
    createProduct(productData, selectedStoreId) {
        return sendRequest("POST", `http://localhost:3000/api/Stores/${selectedStoreId}/rel_Products`, productData, {
            "Content-Type": "application/json",
            "Accept": "application/json"
        })
    }

    /**
     * Deletes a product by its ID for a specific store.
     * @param {string} id - The ID of the product to delete.
     * @param {string} selectedStoreId - The ID of the store from which to delete the product.
     * @returns {Promise} A promise that resolves with the result of the API request.
     * @public
     */
    deleteProductById(id, selectedStoreId) {
        return sendRequest("DELETE", `http://localhost:3000/api/Stores/${selectedStoreId}/rel_Products/${id}`, null, {
            "Accept": "application/json"
        })
    }

    /**
     * Deletes a store by its ID along with its associated products.
     * @param {string} storeId - The ID of the store to delete.
     * @returns {Promise} A promise that resolves when the store and its products are deleted.
     * @public
     */
    deleteStore(storeId) {
        Promise.all([
            this._deleteProductsByStoreId(storeId),
            this._deleteStoreByStoreId(storeId)
        ])
        .catch((error) => {
            console.error("Произошла ошибка при удалении магазина: ", error);
            alert("Произошла ошибка при удалении магазина. Пожалуйста, повторите запрос позже!")
        })
        .finally(() => {
            this.closeDeleteStoreConfirmPopup();
            this.showLoader(false);
            window.location.reload();
        })
    }

    /**
     * Deletes products associated with a specific store by the store ID.
     * @param {string} storeId - The ID of the store from which to delete products.
     * @returns {Promise} A promise that resolves with the result of the API request.
     * @private
     */
    _deleteProductsByStoreId(storeId) {
        return sendRequest("DELETE", `http://localhost:3000/api/Stores/${storeId}/rel_Products`, null, {
            "Accept": "application/json"
        });
    }

    /**
     * Deletes a store by its ID.
     * @param {string} storeId - The ID of the store to delete.
     * @returns {Promise} A promise that resolves with the result of the API request.
     * @private
     */
    _deleteStoreByStoreId(storeId) {
        return sendRequest("DELETE", `http://localhost:3000/api/Stores/${storeId}`, null, {
            "Accept": "application/json"
        });
    }

    /**
     * Gets product details by its ID for a specific store.
     * @param {string} productId - The ID of the product to fetch.
     * @param {string} selectedStoreId - The ID of the store from which to fetch the product.
     * @returns {Promise} A promise that resolves with the result of the API request.
     * @public
     */
    getProductByid(productId, selectedStoreId) {
        return sendRequest("GET", `http://localhost:3000/api/Stores/${selectedStoreId}/rel_Products/${productId}`, null, {
            "Accept": "application/json"
        });
    }

    /**
     * Edits a product for a specific store by its ID.
     * @param {Object} newProductData - The updated data for the product.
     * @param {string} productId - The ID of the product to edit.
     * @param {string} selectedStoreId - The ID of the store to which the product belongs.
     * @returns {Promise} A promise that resolves with the result of the API request.
     * @public
     */
    editProduct(newProductData, productId, selectedStoreId) {
        return sendRequest("PUT", `http://localhost:3000/api/Stores/${selectedStoreId}/rel_Products/${productId}`, newProductData, {
            "Content-Type": "application/json",
            "Accept": "application/json"
        });
    }
}