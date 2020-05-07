/**
 * @apiDefine DefaultUpdateResponse
 * Default update response
 *
 * @apiSuccess {Object} model Model.
 *
 * @apiVersion 1.0.0
 */

/**
 * Create response class
 */
class UpdateResponse
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
	constructor(result)
	{
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
	toJSON()
	{
		return {
			model: this.model,
		};
	}
}

module.exports = UpdateResponse;
