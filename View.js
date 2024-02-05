/**
 * Module providing View class of the application.
 *
 * @module View
 */

/**
 * @class View
 * @classdesc Class representing the view of the application.
 */
export class View {
    /**
     * Constructor for the View class.
     * Initializes DOM elements and event listeners.
     */
    constructor() {
        /**
         * The input element for search functionality.
         * @type {HTMLInputElement}
         */
        this.searchInput = document.querySelector(".search-container__search-input");
        /**
         * The button element for triggering search.
         * @type {HTMLButtonElement}
         */
        this.searchButton = document.querySelector(".search-container__input-elements__button[title='Search']");
        /**
         * The button element for refreshing the view.
         * @type {HTMLButtonElement}
         */
        this.refreshButton = document.querySelector(".search-container__input-elements__button[title='Refresh']");
        /**
         * The list element for rendering stores.
         * @type {HTMLUListElement}
         */
        this.storesList = document.querySelector(".stores-list");
        /**
         * The section element for rendering store details.
         * @type {HTMLElement}
         */
        this.mainSection = document.querySelector(".store-detail-container");
        /**
         * The loader element for indicating loading state.
         * @type {HTMLElement}
         */
        this.loader = document.querySelector("#loader");

        /**
         * Represents the currently selected store element in the DOM.
         * @type {HTMLLIElement|null}
         */
        this.selectedStore = null;
        /**
         * Represents the currently selected filter status button element in the DOM.
         * @type {HTMLButtonElement|null}
         */
        this.selectedStatus = null;
        /**
         * Represents the column by which the table is currently sorted.
         * @type {string|null}
         */
        this.currentSortColumn = null;
        /**
         * Represents the sort direction of the table ('asc' or 'desc').
         * @type {string}
         * @default 'asc'
         */
        this.sortDirection = "asc";
        /**
         * Represents the ID of the currently selected store.
         * @type {string|null}
         */
        this.selectedStoreId = null;
        /**
         * Represents information about the selected store.
         * @type {Array}
         */
        this.selectedStoreInfo = [];

        /**
         * Event listener for DOMContentLoaded event.
         * @private
         */
        document.addEventListener("DOMContentLoaded", this.init);
        /**
         * Event listener for click on the search button.
         * @private
         */
        this.searchButton.addEventListener("click", () => this.handleSearch());
        /**
         * Event listener for click on the refresh button.
         * @private
         */
        this.refreshButton.addEventListener("click", () => this.handleRefresh());
        /**
         * Event listener for keydown on the search input.
         * @private
         * @param {KeyboardEvent} event - The keydown event object.
         */
        this.searchInput.addEventListener("keydown", (event) => this.handleSearchKeydown(event));
        /**
         * Event listener for click anywhere on the document.
         * @private
         * @param {MouseEvent} event - The click event object.
         */
        document.addEventListener("click", (event) => this.handleTableExpandText(event));
        /**
         * Event listener for click anywhere on the document to handle table sorting.
         * @private
         * @param {MouseEvent} event - The click event object.
         */
        document.addEventListener("click", (event) => this.handleSortTable(event));
        /**
         * Adds a click event listener to the "Create Store" button.
         * Triggers the `createStoreButtonHandler` method when the button is clicked.
         * @listens click
         */
        document.querySelector(".show-create-store-form-button").addEventListener("click", () => this.createStoreButtonHandler());
        /**
         * Adds a click event listener to the "Create Store" form submit button.
         * Triggers the `createStoreSubmit` method when the button is clicked.
         * @listens click
         */
        document.querySelector(".create-store-submit-button").addEventListener("click", () => this.createStoreSubmit());
        /**
         * Adds a click event listener to the "Cancel Create Store Form" button.
         * Triggers the `closeCreateStoreForm` method when the button is clicked.
         * @listens click
         */
        document.querySelector(".cancel-create-store-form-button").addEventListener("click", () => this.closeCreateStoreForm());
        /**
         * Adds a click event listener to the "Create Product" form submit button.
         * Triggers the `createProductSubmit` method when the button is clicked.
         * @listens click
         */
        document.querySelector(".create-product-submit-button").addEventListener("click", () => this.createProductSubmit());
        /**
         * Adds a click event listener to the "Cancel Create Product Form" button.
         * Triggers the `closeCreateProductForm` method when the button is clicked.
         * @listens click
         */
        document.querySelector(".cancel-create-product-form-button").addEventListener("click", () => this.closeCreateProductForm());
        /**
         * Adds a click event listener to the "Close Confirm Delete Store Popup" button.
         * Triggers the `closeDeleteStoreConfirmPopup` method when the button is clicked.
         * @listens click
         */
        document.querySelector(".close-confirm-delete-store-popup-button").addEventListener("click", () => this.closeDeleteStoreConfirmPopup());
        /**
         * Adds a click event listener to the "Cancel Edit Product Form" button.
         * Triggers the `closeEditProductForm` method when the button is clicked.
         * @listens click
         */
        document.querySelector(".cancel-edit-product-form-button").addEventListener("click", () => this.closeEditProductForm());
        /**
         * Adds a click event listener to the "Close Confirm Delete Product Popup" button.
         * Triggers the `closeDeleteProductConfirmPopup` method when the button is clicked.
         * @listens click
         */
        document.querySelector(".close-confirm-delete-product-popup-button").addEventListener("click",  () => this.closeDeleteProductConfirmPopup())

        /**
         * Empty function to be assigned later as an event handler for store item clicks.
         * This function will be implemented in the Controller class.
         * @private
         */
        this.handleStoreItemClick = () => {};
        /**
         * Empty function to be assigned later as an event handler for quick search actions.
         * This function will be implemented in the Controller class.
         * @private
         */
        this.handleQuickSearch = () => {};
        /**
         * Empty function to be assigned later as an event handler for product filtering.
         * This function will be implemented in the Controller class.
         * @private
         */
        this.filterProducts = () => {};
        /**
        * Empty function to be assigned later as an event handler for displaying an edit popup.
        * This function will be implemented in the Controller class.
        * @private
        */
        this.showEditPopUp = () => {};
        /**
         * Empty function to be assigned later as an event handler for displaying a delete product confirmation popup.
         * This function will be implemented in the Controller class.
         * @private
         */
        this.showDeleteProductConfirmPopup = () => {};
    }

    /**
     * Shows or hides the loader based on the provided boolean value.
     * @param {boolean} isTrue - Boolean value indicating whether to show or hide the loader.
     * @returns {void}
     * @public
     */
    showLoader = (isTrue) => {
        if (isTrue) {
            this.loader.style.display = "flex";
        } else {
            this.loader.style.display = "none";
        }
    }

    /**
     * Renders the list of stores in the UI.
     * @param {Object[]} stores - An array of store objects to be rendered.
     * @returns {void}
     * @public
     */
    renderStores(stores) {
        this.storesList.innerHTML = "";
    
        if (stores.length === 0) {
            this.storesList.innerHTML = "<div class='stores-list__no-matching'>No matching stores found.</div>";
            return;
        }
    
        stores.forEach(store => {
            const storeItem = document.createElement("li");
            storeItem.classList.add("stores-list__item");
            storeItem.innerHTML = `
                <div class="stores-list__item__left">
                    <p class="stores-list__item__item-name">${store.Name}</p>
                    <p class="stores-list__item__item-address">${store.Address}</p>
                </div>
                <p class="stores-list__item__item-square">${store.FloorArea}</p>
            `;
    
            storeItem.addEventListener("click", () => {
                this.handleStoreItemClick(storeItem, store);
            });
    
            this.storesList.append(storeItem);
        });
    }

    /**
     * Renders the detailed information about a store and its products in the UI.
     * @param {Object} store - The store object to be rendered.
     * @param {Object[]} products - An array of product objects associated with the store.
     * @returns {void}
     * @public
     */
    renderStoreDetails(store, products) {
        const storeInfoSection = this.renderStoreInfo(store);
        const actionButtons = this.renderActionButtons();
        const filterButtons = this.renderFilterButtons(products);
    
        const productsTable = this.renderProductsTable(products);
    
        this.renderStoreHeader(store);
        this.renderTableSpace(storeInfoSection, actionButtons, filterButtons, productsTable);
        
        
        document.querySelector('.filter-buttons').addEventListener('click', (event) => this.handleFilterStatus(event));
        document.querySelector('.show-create-product-form-button').addEventListener("click", () => this.createProductButtonHandler());
        document.querySelector('.show-delete-store-form-button').addEventListener("click", () => this.showDeleteStoreConfirmPopup());
        document.querySelector("#products-table-id").addEventListener("click", (event) => this.handleEditPopUp(event));
        document.querySelector("#products-table-id").addEventListener("click", (event) => this.handleDeleteProductPopUp(event));
    }

    /**
     * Handles the click event on the "Edit" icon in the products table.
     * @param {Event} event - The click event object.
     * @returns {void}
     * @public
     */
    handleEditPopUp(event) {
        if (event.target.classList.contains("edit-product-icon")) {
            const id = event.target.getAttribute('data-product-id');
            this.showEditPopUp(id, this.selectedStoreId);
        }
    }

    /**
     * Handles the click event on the "Delete" button in the products table.
     * @param {Event} event - The click event object.
     * @returns {void}
     * @public
     */
    handleDeleteProductPopUp(event) {
        if (event.target.classList.contains("js-delete-product-button")) {
            const id = event.target.getAttribute('data-product-id');
            this.showDeleteProductConfirmPopup(id, this.selectedStoreId);
        }
    }

    /**
     * Handles the click event on the filter buttons to filter products by status.
     * @param {Event} event - The click event object.
     * @returns {void}
     * @public
     */
    handleFilterStatus(event) {
        if (event.target.classList.contains("filter-buttons__filter-button")) {
            const status = event.target.getAttribute('data-status');
            this.filterProducts(status);
        }
    }

    /**
     * Renders the header section of the store details.
     * @param {Object} store - The store information.
     * @returns {void}
     * @public
     */
    renderStoreHeader(store) {
        this.mainSection.innerHTML = `
            <header class="store-detail__header">
                <h3>${store.Name}</h3>
            </header>`;
    }

    /**
     * Renders the main table space, including store information, action buttons, filter buttons, and the products table.
     * @param {string} storeInfoSection - HTML representation of the store information section.
     * @param {string} actionButtons - HTML representation of the action buttons.
     * @param {string} filterButtons - HTML representation of the filter buttons.
     * @param {string} productsTable - HTML representation of the products table.
     * @returns {void}
     * @public
     */
    renderTableSpace(storeInfoSection, actionButtons, filterButtons, productsTable) {
        this.mainSection.innerHTML += `
            <div class="table-space">
                <div class="store-detail__titleandbuttons">
                    ${storeInfoSection}
                    ${actionButtons}
                    ${filterButtons}
                </div>
                <table class="products-table">
                    <thead>
                        <tr>
                            <th colspan="8" class="products-table__header">
                                <span class="header-left">Products</span>
                                <input class="header-right" type="text" id="quickSearchInput" placeholder="Quick Search">
                            </th>
                        </tr>
                        <tr class="products-table__column-names">
                            <th class="products-table__column-names__cell-header__name js-sort-header"><span class="js-sort-icon"></span>Name</th>
                            <th class="products-table__column-names__cell-header__price js-sort-header"><span class="js-sort-icon"></span>Price</th>
                            <th class="products-table__column-names__cell-header__specs js-sort-header"><span class="js-sort-icon"></span>Specs</th>
                            <th class="products-table__column-names__cell-header__supplier-info js-sort-header"><span class="js-sort-icon"></span>Supplier Info</th>
                            <th class="products-table__column-names__cell-header__country js-sort-header"><span class="js-sort-icon"></span>Country of origin</th>
                            <th class="products-table__column-names__cell-header__prod-company js-sort-header"><span class="js-sort-icon"></span>Prod. company</th>
                            <th class="products-table__column-names__cell-header__rating js-sort-header"><span class="js-sort-icon"></span>Rating</th>
                            <th class="products-table__column-names__cell-header__expand"></th>
                        </tr>
                    </thead>
                    <tbody id="products-table-id">
                        ${productsTable}
                    </tbody>
                </table>
                ${this.renderFooter()}
            </div>
        `;

        this.mainSection.querySelector("#quickSearchInput").addEventListener("input", this.handleQuickSearch);
    }

    /**
     * Renders the store information section.
     * @param {Object} store - The store information.
     * @returns {string} - HTML representation of the store information section.
     * @public
     */
    renderStoreInfo(store) {
        return `
            <div class="store-detail__header__title">
                <div class="store-info">
                    <div class="store-info__left">
                        <div class="store-info__email"><span class="store-info__item">Email:
                            </span>${store.Email}</div>
                        <div class="store-info__phone"><span class="store-info__item">Phone
                                Number: </span>${store.PhoneNumber}
                        </div>
                        <div class="store-info__address"><span class="store-info__item">Address: </span>${store.Address}</div>
                    </div>
                    <div class="store-info__right">
                        <div class="store-info__date"><span class="store-info__item">Established Date: </span>${new Date(store.Established).toLocaleDateString()}</div>
                        <div class="store-info__square"><span class="store-info__item">Floor Area: </span>${store.FloorArea}</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renders the action buttons section.
     * @returns {string} - HTML representation of the action buttons section.
     * @public
     */
    renderActionButtons() {
        return `
            <div class="action-buttons-main">
                <button class="action-buttons__button" title="Collapse"><span class="collapse-icon"></span></button>
                <button class="action-buttons__button" title="Pin"><span class="pin-icon"></span></button>
            </div>
        `;
    }

    /**
     * Calculates the counts of products based on their status.
     * @param {Object[]} products - Array of product objects.
     * @returns {Object} - Object containing counts for total, ok, storage, and out-of-stock products.
     * @public
     */
    calculateStatusCounts(products) {
        const totalProducts = products.length;
        const okProducts = products.filter(product => product.Status === "OK").length;
        const storageProducts = products.filter(product => product.Status === "STORAGE").length;
        const outOfStockProducts = products.filter(product => product.Status === "OUT_OF_STOCK").length;
    
        return {
            totalProducts,
            okProducts,
            storageProducts,
            outOfStockProducts
        };
    }

    /**
     * Renders the filter buttons section based on product status counts.
     * @param {Object[]} products - Array of product objects.
     * @returns {string} - HTML representation of the filter buttons section.
     * @public
     */
    renderFilterButtons(products) {
        const {
            totalProducts,
            okProducts,
            storageProducts,
            outOfStockProducts
        } = this.calculateStatusCounts(products);
    
        return `
            <div class="filter-buttons">
                <div class="filter-buttons__all"><button class="filter-buttons__filter-button filter-buttons__filter-button-all" data-status="ALL"><p>${totalProducts}</p><span>All</span></button></div>
                <div class="filter-buttons__sort">
                    <button class="filter-buttons__filter-button filter-buttons__filter-button-ok" data-status="OK"><span class="ok-status-icon"></span><p>${okProducts}</p><span>Ok</span></button>
                    <button class="filter-buttons__filter-button filter-buttons__filter-button-storage" data-status="STORAGE"><span class="storage-status-icon"></span><p>${storageProducts}</p><span>Storage</span></button>
                    <button class="filter-buttons__filter-button filter-buttons__filter-button-out_of_stock" data-status="OUT_OF_STOCK"><span class="out-status-icon"></span><p>${outOfStockProducts}</p><span>Out of Stock</span></button>
                </div>
            </div>
        `;
    }

    /**
     * Toggles the sort icon in the table header for a given column.
     * @param {HTMLElement} sortIcon - The sort icon element.
     * @param {number} columnIndex - The index of the column.
     * @returns {void}
     * @public
     */
    toggleSortIcon(sortIcon, columnIndex) {
        if (this.currentSortColumn !== null && this.currentSortColumn !== columnIndex) {
            this.resetSortIcon(this.currentSortColumn);
        }
    
        const isAsc = sortIcon.classList.contains("js-sort-icon-asc");
        const isDesc = sortIcon.classList.contains("js-sort-icon-desc");
    
        if (isAsc) {
            sortIcon.classList.remove("js-sort-icon-asc");
            sortIcon.classList.add("js-sort-icon-desc");
            this.sortDirection = "desc";
        } else if (isDesc) {
            sortIcon.classList.remove("js-sort-icon-desc");
            sortIcon.classList.add("js-sort-icon-asc");
            this.sortDirection = "asc";
        } else {
            sortIcon.classList.add("js-sort-icon-asc");
            this.sortDirection = "asc";
        }
    
        this.currentSortColumn = columnIndex;
    }

    /**
     * Resets the sort icon for a given column to its default state.
     * @param {number} columnIndex - The index of the column.
     * @returns {void}
     * @public
     */
    resetSortIcon(columnIndex) {
        const headers = document.querySelectorAll(".js-sort-header");
        headers[columnIndex].querySelector(".js-sort-icon").classList.remove("js-sort-icon-asc", "js-sort-icon-desc");
    }

    /**
     * Renders the products table based on an array of product objects.
     * @param {Object[]} products - Array of product objects.
     * @returns {string} - HTML representation of the products table.
     * @public
     */
    renderProductsTable(products) {
        return products.map((product) => `
            <tr class="table-row-product">
                <td class="products-table__cell__name js-expandable-cell" title="${product.Name}" data-sort="${product.Name}" data-sort-status="${product.Status}">
                    <p>${product.Name}</p>
                </td>
                <td class="products-table__cell__price" data-sort="${product.Price}">
                    <p>${product.Price}<span class="usd-span">USD</span></p>
                </td>
                <td class="products-table__cell__specs js-expandable-cell" title="${product.Specs}" data-sort="${product.Specs}">${product.Specs}</td>
                <td class="products-table__cell__supplier-info js-expandable-cell" title="${product.SupplierInfo}" data-sort="${product.SupplierInfo}">${product.SupplierInfo}</td>
                <td class="products-table__cell__country js-expandable-cell" data-sort="${product.MadeIn}">${product.MadeIn}</td>
                <td class="products-table__cell__prod-company js-expandable-cell" data-sort="${product.ProductionCompanyName}">${product.ProductionCompanyName}</td>
                <td class="products-table__cell__rating" data-sort="${product.Rating}">${product.Rating}</td>
                <td class="products-table__cell__js-scenario-buttons">
                    <span class="edit-product-icon" data-product-id="${product.id}"></span>
                    <span class="js-delete-product-button" id="js-delete-product-button" data-product-id="${product.id}"></span>
                </td>
            </tr>
        `).join("");
    }

    /**
     * Renders the footer section of the store details.
     * @returns {string} - HTML representation of the footer section.
     * @public
     */
    renderFooter() {
        return `
            <footer class="store-detail__footer">
                <button class="stores-footer__button--create show-create-product-form-button" id="create-product-button"><span class="stores-footer__button--create-icon"></span><span> Create</span></button>
                <button class="stores-footer__button--delete show-delete-store-form-button" id="delete-store-button"><span class="stores-footer__button--delete-icon"></span><span> Delete</span></button>
            </footer>
        `;
    }
}