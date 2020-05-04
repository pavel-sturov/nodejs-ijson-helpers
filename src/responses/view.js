/**
 * @apiDefine DefaultViewResponse
 * Default view response
 *
 * @apiSuccess {Object} model Model.
 *
 * @apiVersion 1.0.0
 */

/**
 * View response class
 */
class ViewResponse
{
	/**
	 * @type {Object}
	 *
	 * @private
	 */
	model = {};

	/**
	 * @constructor
	 *
	 * @param {Object} result
	 */
	constructor(result) {
		/**
		 * @private
		 */
		this.model = result;
	}

	/**
	 * Convert instance to json object
	 *
	 * @return {Object}
	 */
	toJSON() {
		return {
			model: this.model,
		};
	}
}

module.exports = ViewResponse;
