const SequelizeMock  = require('sequelize-mock');
const BaseConnection = require('../services/baseDb');

/**
 * Create db connection class
 */
class Connection extends BaseConnection
{
	/**
	 * @inheritDoc
	 */
	createDbConnection(dbConfig) {
		this.db = new SequelizeMock();
	}
};

module.exports = Connection;
