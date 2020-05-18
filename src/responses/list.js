const PaginationResponse = require('./pagination');

/**
 * @apiDefine DefaultListResponse
 * Default list response
 *
 * @apiSuccess {Object[]} list Models.
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
	list = [];

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
		this.list = result.rows || [];

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
			list:     this.list,
			pagination: this.pagination,
		};
	}
}

module.exports = ListResponse;
