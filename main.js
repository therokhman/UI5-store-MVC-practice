/**
 * Entry point for the application.
 *
 * @module main
 */

/**
 * Represents the Model component of the application.
 *
 * @external Model
 * @see {@link ./Model.js}
 */

/**
 * Represents the View component of the application.
 *
 * @external View
 * @see {@link ./View.js}
 */

/**
 * Represents the Controller component of the application.
 *
 * @external Controller
 * @see {@link ./Controller.js}
 */

/**
 * Import of the Model class.
 *
 * @type {external:Model}
 */
import { Model } from "./Model.js";

/**
 * Import of the View class.
 *
 * @type {external:View}
 */
import { View } from "./View.js";

/**
 * Import of the Controller class.
 *
 * @type {external:Controller}
 */
import { Controller } from "./Controller.js";

/**
 * The main application instance.
 *
 * @type {Controller}
 */
const app = new Controller(new Model(), new View());

/**
 * Initializes the application.
 *
 * @function
 * @memberof module:main
 */
app.init();