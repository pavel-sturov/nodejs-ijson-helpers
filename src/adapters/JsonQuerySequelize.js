const _ = require('lodash');

/**
 * JSON query to Sequelize query adapter
 */
class JsonQuerySequelize
{
	/**
	 * @type {{OR: string, AND: string}}
	 * @private
	 */
	_junctionOperators = {
		AND: 'and',
		OR:  'or',
	};

	/**
	 * @type {Object}
	 * @private
	 */
	_operators = {
		BETWEEN:          'between',
		LIKE:             'like',
		IN:               'in',
		NOT_IN:           '!in',
		NOT_EQUAL:        '!=',
		GREATER:          '>',
		GREATER_OR_EQUAL: '>=',
		LESS:             '<',
		LESS_OR_EQUAL:    '<=',
	};

	/**
	 * Get sequelize operator
	 *
	 * @param {string} operator json operator
	 *
	 * @return {string}
	 * @private
	 */
	_getSequalizeOperator(operator)
	{
		const op = {
			[this._operators.BETWEEN]:          '$between',
			[this._operators.LIKE]:             '$like',
			[this._operators.IN]:               '$in',
			[this._operators.NOT_IN]:           '$notIn',
			[this._operators.NOT_EQUAL]:        '$ne',
			[this._operators.GREATER]:          '$gt',
			[this._operators.GREATER_OR_EQUAL]: '$gte',
			[this._operators.LESS]:             '$lt',
			[this._operators.LESS_OR_EQUAL]:    '$lte',
		};

		const result = op?.[operator] ?? null;

		if (result === null) {
			throw new Error(`Неизвестный оператор: ${operator}. #2`);
		}

		return result;
	}

	/**
	 * Get sequelize query
	 *
	 * @param {Object} json
	 *
	 * @return {Object|null}
	 */
	static toQuery(json)
	{
		if (!json) {
			return null;
		}

		const instance = new this();

		if (typeof json !== 'object') {
			instance._throwError(1);
		}

		return instance.parseJSON(json);
	}

	/**
	 * Parse json query
	 *
	 * @param {Object} jsonQuery
	 *
	 * @return {Object}
	 */
	parseJSON(jsonQuery)
	{
		let result = {};

		Object.entries(jsonQuery).forEach(([key, value]) => {
			let operator = this._getJunctionOperator(key);

			// Key is junction operator
			if (operator) {
				if (!Array.isArray(value)) {
					this._throwError(2);
				}

				const conditions = value.map(nestedCondition => {
					return this.parseJSON(nestedCondition);
				});

				result = _.merge(result, {
					[`$${operator}`]: conditions,
				});
				return;
			}

			if (typeof value === 'object') {
				result = _.merge(result, this._detectOperator(key, value));
				return;
			}

			// equal operator
			result = _.merge(result, { [key]: value });
		});

		return result;
	}

	/**
	 * Get junction operator
	 *
	 * @param {string} operator
	 *
	 * @return {string|null}
	 * @private
	 */
	_getJunctionOperator(operator)
	{
		switch (operator) {
			case this._junctionOperators.AND:
				return this._junctionOperators.AND;
			case this._junctionOperators.OR:
				return this._junctionOperators.OR;
			default:
				return null;
		}
	}

	/**
	 * Detect condition operator
	 *
	 * @param {string} key
	 * @param {Object} value
	 *
	 * @return {Object}
	 * @private
	 */
	_detectOperator(key, value)
	{
		const keys           = Object.keys(value);
		const firstOperator  = keys?.[0] ?? null;
		const secondOperator = keys?.[1] ?? null;

		// Operator not found
		if (!firstOperator) {
			this._throwError(3);
		}

		// Bad condition. E.g.: {operator: value} or {operator: value, operator2: value}
		if (keys.length > 2) {
			this._throwError(4);
		}

		switch (firstOperator) {
			case this._operators.BETWEEN:
			case this._operators.LIKE:
			case this._operators.IN:
			case this._operators.NOT_IN:
			case this._operators.NOT_EQUAL:
				return {
					[key]: {
						[this._getSequalizeOperator(firstOperator)]: value[firstOperator],
					},
				};
			case this._operators.GREATER:
			case this._operators.GREATER_OR_EQUAL:
			case this._operators.LESS:
			case this._operators.LESS_OR_EQUAL:
				return {
					[key]: {
						[this._getSequalizeOperator(firstOperator)]: value[firstOperator],
						...(secondOperator ? {
							[this._getSequalizeOperator(secondOperator)]: value[secondOperator],
						} : {}),
					},
				};
		}

		throw new Error(`Неизвестный оператор: ${firstOperator}.`);
	}

	/**
	 * Throw invalid json format
	 *
	 * @param {number} code
	 *
	 * @return {undefined}
	 * @private
	 */
	_throwError(code)
	{
		throw new Error(`Не корректный формат фильтра. #${code}`);
	}
}

module.exports = JsonQuerySequelize;
