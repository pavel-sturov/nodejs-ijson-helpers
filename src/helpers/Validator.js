const { Connection } = require('../services');
const { Op }         = require('sequelize');


/**
 * Validator for sequelize models class
 */
class Validator
{
	/**
	 * Check is field|fields unique
	 *
	 * @param {string} modelName
	 * @param {string|Array} fields
	 * @param {string} fieldName
	 * @param {string} value
	 *
	 * @return {undefined}
	 */
	static isUnique = async (modelName, fields) => {
		const Model = Connection.getInstance().getModels()[modelName];
		let obj     = null;

		if (Array.isArray(fields)) {
			obj = await Model.findOne({ where: { [Op.and]: fields } });
		}

		if (!Array.isArray(fields) && Object.values(fields)[0]) {
			obj = await Model.findOne({ where: fields });
		}

		if (obj) {
			throw new Error(`Такая запись уже создана.`);
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
		if (value?.trim()?.length < length) {
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
		if (value?.length > length) {
			next(`${fieldName} не может быть длиннее ${length} символов.`);
		} else {
			next();
		}
	};

	/**
	 * Set is not empty validation
	 *
	 * @param {string} value
	 * @param {string} fieldName
	 *
	 * @return {Object}
	 */
	static isNotEmpty = (value, fieldName) => {
		if (!value || !value?.trim()?.length) {
			throw new Error(`Заполните поле "${fieldName}".`);
		}
	};

	/**
	 * Set is integer value validation
	 *
	 * @param fieldName
	 *
	 * @return {Object}
	 */
	static isInt = fieldName => ({
		value: true,
		msg:   `Поле "${fieldName}" должено содержать только числа.`,
	});
}

module.exports = Validator;
