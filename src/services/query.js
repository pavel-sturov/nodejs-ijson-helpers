const JsonQuerySequelize = require('../adapters/JsonQuerySequelize');
const _                  = require('lodash');

/**
 * @api {Object} JsonQuery
 * JsonQuery
 *
 * @apiGroup TYPES
 *
 * @apiParam {Object} [filter] Where condition
 * @apiParam {String[]} [attributes] Selected attribures. Default: all
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
	 * @type {Array.<string>}
	 */
	attributes = [];

	/**
	 * @type {Object}
	 */
	filter = {};

	/**
	 * @type {Object} add AND to filter. E.g. filter AND additionalFilter. (ABAC)
	 */
	additionalFilter = {};

	/**
	 * @constructor
	 *
	 * @param {Object} config
	 * @param {function} getModels
	 */
	constructor(config = {}, getModels = () => null)
	{
		this.models = getModels;

		this.page             = typeof config.page === 'number' && config.page > 0 ? config.page : this.page;
		this.perPage          = typeof config.perPage === 'number' && config.perPage > 0 ? config.perPage : this.perPage;
		this.orderBy          = Array.isArray(config.orderBy) ? config.orderBy : this.orderBy;
		this.expands          = Array.isArray(config.expands) ? config.expands : this.expands;
		this.attributes       = Array.isArray(config.attributes) ? this._validateAttributes(config.attributes) : this.attributes;
		this.filter           = this._parseWhere(config?.filter ?? {});
		this.additionalFilter = this._parseWhere(config?.additionalFilter ?? {});
	}

	/**
	 * Get query offset
	 *
	 * @return {number}
	 */
	getOffset()
	{
		return (this.page - 1) * this.perPage;
	}

	/**
	 * Get query order by
	 *
	 * @param {Array.<string>} field another order input field
	 *
	 * @return {Array.<string|Array>}
	 */
	getOrderBy(field)
	{
		return (field || this.orderBy).map(query => {
			return query.substr(0, 1) === '-'
				   ? [query.substr(1), 'DESC']
				   : [query, 'ASC'];
		});
	}

	/**
	 * Get page
	 *
	 * @return {number}
	 */
	getPage()
	{
		return this.page;
	}

	/**
	 * Get per page
	 *
	 * @return {number}
	 */
	getPerPage()
	{
		return this.perPage;
	}

	/**
	 * Get include query
	 *
	 * @return {Array.<Object>}
	 */
	getInclude()
	{
		const includes = [];
		const models   = this.models();

		this.expands.forEach(expand => {
			switch (typeof expand) {
				case 'string':
					includes.push(expand);
					break;
				case 'object':
					const { name, where, required, limit, separate, order, attributes } = expand;

					if (name && models[name]) {
						includes.push({
							model: models[name],
							as:    name,
							...(typeof required === 'boolean' ? { required } : {}),
							...(typeof limit === 'number' ? { limit } : {}),
							...(typeof separate === 'boolean' ? { separate } : {}),
							...(order ? { order: this.getOrderBy(order) } : {}),
							...(attributes ? { attributes: this._validateAttributes(attributes) } : {}),
							...(where ? { where: this._parseWhere(where) } : {}),
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
	 * @param {boolean} isOne is query one row
	 *
	 * @return {Object}
	 */
	getQuery(queryConfig = {}, isOne = false)
	{
		queryConfig.offset  = isOne ? null : (queryConfig?.offset ?? this.getOffset());
		queryConfig.limit   = isOne ? null : (queryConfig?.limit ?? this.perPage);
		queryConfig.order   = isOne ? null : (queryConfig?.order ?? this.getOrderBy());
		queryConfig.include = _.merge(queryConfig?.include ?? [], this.getInclude());

		const attributes = _.merge(queryConfig?.attributes ?? [], this.attributes);
		if (attributes.length > 0) {
			queryConfig.attributes = attributes;
		}

		if (this.filter) {
			queryConfig.where = _.merge(queryConfig?.where ?? {}, {
				'$and': this.filter,
			});
		}

		if (this.additionalFilter) {
			queryConfig.where = _.merge(queryConfig?.where ?? {}, {
				'$and': this.additionalFilter,
			});
		}

		return queryConfig;
	}

	/**
	 * Validate attributes
	 *
	 * @param {Array.<string>} attributes
	 *
	 * @return {Array.<string>}
	 * @private
	 */
	_validateAttributes(attributes)
	{
		return attributes;
	}

	/**
	 * Parse where conditions
	 *
	 * @param {Object} conditions
	 *
	 * @return {Object}
	 * @private
	 */
	_parseWhere(conditions)
	{
		return JsonQuerySequelize.toQuery(conditions);
	}

	/**
	 * Convert instance to json object
	 *
	 * @return {Object}
	 */
	toJSON()
	{
		return this.getQuery();
	}
}

module.exports = JsonQuery;
