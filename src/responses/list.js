const PaginationResponse = require('./pagination');

/**
 * @apiDefine DefaultListResponse
 * Default list response
 *
 * @apiSuccess {Object[]} models Models.
 * @apiSuccess {[Pagination](#api-TYPES-ObjectPagination)} pagination List pagination.
 *
 * @apiVersion 1.0.0
 */

/**
 * List response class
 */
class ListResponse
{
	/**
	 * @type {Array}
	 *
	 * @private
	 */
	models = [];

	/**
	 * @type {PaginationResponse}
	 */
	pagination = {};

	/**
	 * @constructor
	 *
	 * @param {{ rows: Array, count: number }} result
	 * @param {JsonQuery} query
	 */
	constructor(result, query) {
		/**
		 * @private
		 */
		this.models = result.rows || [];

		/**
		 * @private
		 */
		this.pagination = new PaginationResponse(query, result.count);
	}

	/**
	 * Convert instance to json object
	 *
	 * @return {Object}
	 */
	toJSON() {
		return {
			models:     this.models,
			pagination: this.pagination,
		};
	}
}

module.exports = ListResponse;
