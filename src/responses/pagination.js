/**
 * @api {Object} Pagination
 * Pagination
 *
 * @apiGroup TYPES
 *
 * @apiParam {Number} totalItems=0 total count items.
 * @apiParam {Number} page=1 current page.
 * @apiParam {Number} perPage=20 page size.
 * @apiParam {Number} pageCount=1 cout all pages.
 *
 * @apiVersion 1.0.0
 */

/**
 * Pagination response class
 */
class PaginationResponse
{
	/**
	 * @type {number}
	 *
	 * @private
	 */
	totalItems = 0;

	/**
	 * @type {number}
	 */
	page = 1;

	/**
	 * @type {number}
	 */
	perPage = 20;

	/**
	 * @type {number}
	 */
	pageCount = 1;

	/**
	 * Pagination constructor
	 *
	 * @param {JsonQuery} query
	 * @param {number} count
	 *
	 * @return {undefined}
	 */
	constructor(query, count = 0) {
		/**
		 * @private
		 */
		this.totalItems = count;

		/**
		 * @private
		 */
		this.page = query.getPage();

		/**
		 * @private
		 */
		this.perPage = query.getPerPage();

		/**
		 * @private
		 */
		this.pageCount = Math.ceil(this.totalItems / this.perPage);
	}

	/**
	 * Get total items
	 *
	 * @return {number}
	 */
	getTotalItems = () => {
		return this.totalItems;
	};

	/**
	 * Get page count
	 *
	 * return {number}
	 */
	getPageCount = () => {
		return this.pageCount;
	};

	/**
	 * Get current page
	 *
	 * return {number}
	 */
	getPage = () => {
		return this.page;
	};

	/**
	 * Get per page
	 *
	 * return {number}
	 */
	getPerPage = () => {
		return this.perPage;
	};

	/**
	 * Convert instance to json object
	 *
	 * @return {Object}
	 */
	toJSON() {
		return {
			page:       this.page,
			perPage:    this.perPage,
			pageCount:  this.pageCount,
			totalItems: this.totalItems,
		};
	}
}

module.exports = PaginationResponse;
