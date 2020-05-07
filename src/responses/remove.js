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
	 * @param {Object} result
	 */
	constructor(result) {
		/**
		 * @private
		 */
		this.identity = result;
	}

	/**
	 * Convert instance to json object
	 *
	 * @return {Object}
	 */
	toJSON() {
		return {
			identity: this.identity,
		};
	}
}

module.exports = RemoveResponse;
