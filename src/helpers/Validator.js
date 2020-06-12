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
	 * @param {Object|Array} fields
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

	/**
	 * Get message for null|empty validation
	 *
	 * @param {string} fieldName
	 *
	 * @return {Object}
	 */
	static getEmptyMessage = fieldName => ({ msg: `Заполните поле "${fieldName}".` });

	/**
	 * Not null | empty validation
	 *
	 * @param {string} fieldName
	 *
	 * @return {Object}
	 */
	static notEmpty = fieldName => ({
		notNull:  this.getEmptyMessage(fieldName),
		notEmpty: this.getEmptyMessage(fieldName),
	});
}

module.exports = Validator;
