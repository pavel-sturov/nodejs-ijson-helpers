const { Connection } = require('../services');
const _              = require('lodash');

/**
 * Validator for sequelize models class
 */
class Validator
{
	/**
	 * Check is field unique
	 *
	 * @param {string} modelName
	 * @param {string} field
	 * @param {string} fieldName
	 *
	 * @return {undefined}
	 */
	static isUnique = (modelName, field, fieldName) => async (value, next) => {
		const Model = Connection.getInstance().getModels()[modelName];
		const where = { [field]: value };

		const obj = await Model.findOne({ where, attributes: [field] });

		if (obj) {
			next(`${fieldName} ${value} уже используется.`);
		} else {
			next();
		}
	};

	/**
	 * Set min length validation
	 *
	 * @param {number} length
	 * @param {string} fieldName
	 *
	 * @return {undefined}
	 */
	static min = (length, fieldName) => (value, next) => {
		if (value.trim().length < length) {
			next(`${fieldName} не может быть короче ${length} символов.`);
		} else {
			next();
		}
	};

	/**
	 * Set max length validation
	 *
	 * @param {number} length
	 * @param {string} fieldName
	 *
	 * @return {undefined}
	 */
	static max = (length, fieldName) => (value, next) => {
		if (value.length > length) {
			next(`${fieldName} не может быть длиннее ${length} символов.`);
		} else {
			next();
		}
	};

	/**
	 * Set not null validation
	 *
	 * @param {string} fieldName
	 *
	 * @return {Object}
	 */
	static notNull = fieldName => ({ msg: `${fieldName} не может быть пустым.` });
};

module.exports = Validator;
