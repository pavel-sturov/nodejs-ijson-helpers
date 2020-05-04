/**
 * @api {Object} JsonQuery
 * JsonQuery
 *
 * @apiGroup TYPES
 *
 * @apiParam {Object} [where] Where condition
 * @apiParam {Number} [page=1] current page
 * @apiParam {Number} [perPage=20] page size
 * @apiParam {String[]} [orderBy] sorting. E.g.: `["-age", "id"]`
 * @apiParam {String[]} [expands] expands. E.g.: `["pictures", {"name": "pictures", "where": {}}]`
 *
 * @apiVersion 1.0.0
 */

/**
 * Json mysql query
 */
class JsonQuery
{
	/**
	 * @param {function} Get models callback
	 *
	 * @private
	 */
	models;

	/**
	 * @type {number}
	 *
	 * @private
	 */
	page = 1;

	/**
	 * @type {number}
	 *
	 * @private
	 */
	perPage = 20;

	/**
	 * @type {Array.<string>}
	 *
	 * @private
	 */
	orderBy = [];

	/**
	 * @type {Array}
	 */
	expands = [];

	/**
	 * @constructor
	 *
	 * @param {Object} config
	 * @param {function} models
	 */
	constructor(config = {}, getModels = () => null) {
		this.models = getModels;

		this.page    = typeof config.page === 'number' && config.page > 0 ? config.page : this.page;
		this.perPage = typeof config.perPage === 'number' && config.perPage > 0 ? config.perPage : this.perPage;
		this.orderBy = Array.isArray(config.orderBy) ? config.orderBy : this.orderBy;
		this.expands = Array.isArray(config.expands) ? config.expands : this.expands;

		// @TODO add where filter
		// @TODO add attributes select
	}

	/**
	 * Get query offset
	 *
	 * @return {number}
	 */
	getOffset() {
		return (this.page - 1) * this.perPage;
	}

	/**
	 * Get query order by
	 *
	 * @return {Array.<string|Array>}
	 */
	getOrderBy() {
		const columns = this.orderBy.map(query => {
			return query.substr(0, 1) === '-'
				   ? [query.substr(1), 'DESC']
				   : [query, 'ASC'];
		});

		return columns;
	}

	/**
	 * Get page
	 *
	 * @return {number}
	 */
	getPage() {
		return this.page;
	}

	/**
	 * Get per page
	 *
	 * @return {number}
	 */
	getPerPage() {
		return this.perPage;
	}

	/**
	 * Get include query
	 *
	 * @return {Array.<Object>}
	 */
	getInclude() {
		const includes = [];
		const models   = this.models();

		this.expands.forEach(expand => {
			switch (typeof expand) {
				case 'string':
					includes.push(expand);
					break;
				case 'object':
					const { name, where, required } = expand;

					if (name && models[name]) {
						includes.push({
							model: models[name],
							as:    name,
							...(required !== undefined ? { required } : {}),
							// @TODO validate where object
							...(where ? { where } : {}),
						});
					}
					break;
			}
		});

		return includes;
	}

	/**
	 * Get mysql query
	 *
	 * @param {Object} queryConfig
	 * @param {boolean} isOne
	 *
	 * @return {Object}
	 */
	getQuery(queryConfig = {}, isOne = false) {
		queryConfig.offset  = isOne ? null : this.getOffset();
		queryConfig.limit   = isOne ? null : this.perPage;
		queryConfig.order   = isOne ? null : this.getOrderBy();
		queryConfig.include = this.getInclude();

		return queryConfig;
	}

	/**
	 * Convert instance to json object
	 *
	 * @return {Object}
	 */
	toJSON() {
		return this.getQuery();
	}
}

module.exports = JsonQuery;
