/**
 * @apiDefine DefaultRemoveResponse
 * Default remove response
 *
 * @apiSuccess {Object} identity of deleted model.
 *
 * @apiVersion 1.0.0
 */

/**
 * Create response class
 */
class RemoveResponse {
	/**
	 * @constructor
	 *
	 * @param {number|string} id
	 * @param {Object} result
	 */
	constructor(id, result) {
		/**
		 * @private
		 */
		this.id = id;
		this.result = result;
	}

	/**
	 * Convert instance to json object
	 *
	 * @return {Object}
	 */
	toJSON() {
		return {
			id:     this.id,
			result: this.result,
		};
	}
}

module.exports = RemoveResponse;
