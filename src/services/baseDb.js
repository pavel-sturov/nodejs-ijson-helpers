/**
 * BaseConnection class
 */
class BaseConnection
{
	/**
	 * @type {Connection}
	 *
	 * @private
	 */
	static instance = null;

	/**
	 * @type {null}
	 *
	 * @private
	 */
	db = null;

	/**
	 * @type {Array}
	 *
	 * @private
	 */
	models = {};

	/**
	 * @type {Object}
	 */
	config = {};

	/**
	 * Prepare db
	 *
	 * @param {Array.<Object>} models
	 * @param {Object} config
	 * @param {Object} modelConfig
	 *
	 * @return {Promise<{db: sequelize.Sequelize, insertDefaults: insertDefaults}|boolean>}
	 */
	static async prepare(models, config = {}, modelConfig = {}) {
		if (this.instance !== null) {
			return false;
		}

		const connection = this.getInstance(config);

		await connection.checkDatabaseExist();

		const associations   = [];
		const insertDefaults = [];

		// Create models/tables
		Object.entries(models).forEach(([name, initModel]) => {
			const model = initModel(connection.getDb(), connection.getSequelize(), modelConfig);

			connection.addModel(name, model);

			if (model.associate) {
				associations.push(model.associate);
			}

			if (model.insertDefault) {
				insertDefaults.push(model.insertDefault);
			}
		});

		// Create relations
		for (const asoc of associations) {
			await asoc(connection.getModels());
		}

		return {
			db:             connection.getDb(),
			insertDefaults: async (...params) => {
				for (const insert of insertDefaults) {
					try {
						await insert(connection.getModels(), ...params);
					} catch (e) {
						// ignore
					}
				}
			},
		};
	}

	/**
	 * Get connection instance
	 *
	 * @param {Object} config
	 *
	 * @return {Connection}
	 */
	static getInstance(config = {}) {
		if (this.instance === null) {
			this.instance = new this();

			// Normalize table prefix name
			if (config?.define?.schema) {
				config.define.schema = config.define.schema.replace(/-/g, '_');
			}

			this.instance.config = config;
			this.instance.createDbConnection();
		}

		return this.instance;
	}

	/**
	 * Create db connection
	 *
	 * @param {Object} dbConfig
	 *
	 * @return {undefined}
	 */
	createDbConnection(dbConfig) {
		this.db = {};
	}

	/**
	 * Get db connection
	 *
	 * @return {Sequelize}
	 */
	getDb() {
		return this.db;
	}

	/**
	 * Get Sequelize
	 *
	 * @return {Sequelize}
	 */
	getSequelize() {
		return {};
	}

	/**
	 * Add db model
	 *
	 * @param {string} name
	 * @param {sequelize.Model} model
	 *
	 * @return {Connection}
	 */
	addModel(name, model) {
		this.models[name] = model;

		return this;
	}

	/**
	 * Get models
	 *
	 * @return {SequelizeDbModels}
	 */
	getModels() {
		return this.models;
	}

	/**
	 * Create database if not exist
	 *
	 * @return {Promise<void>}
	 */
	async checkDatabaseExist() {
		return true;
	}
}

module.exports = BaseConnection;
