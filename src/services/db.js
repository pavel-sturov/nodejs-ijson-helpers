const mysql     = require('mysql2/promise');
const Sequelize = require('sequelize');
const _         = require('lodash');

const BaseConnection = require('./baseDb');

// Disable warning operatorsAliases
require('sequelize/lib/utils/deprecations').noStringOperators = () => {
};

const operatorsAliases = {
	$eq:            Sequelize.Op.eq,
	$ne:            Sequelize.Op.ne,
	$gte:           Sequelize.Op.gte,
	$gt:            Sequelize.Op.gt,
	$lte:           Sequelize.Op.lte,
	$lt:            Sequelize.Op.lt,
	$not:           Sequelize.Op.not,
	$in:            Sequelize.Op.in,
	$notIn:         Sequelize.Op.notIn,
	$is:            Sequelize.Op.is,
	$like:          Sequelize.Op.like,
	$notLike:       Sequelize.Op.notLike,
	$iLike:         Sequelize.Op.iLike,
	$notILike:      Sequelize.Op.notILike,
	$regexp:        Sequelize.Op.regexp,
	$notRegexp:     Sequelize.Op.notRegexp,
	$iRegexp:       Sequelize.Op.iRegexp,
	$notIRegexp:    Sequelize.Op.notIRegexp,
	$between:       Sequelize.Op.between,
	$notBetween:    Sequelize.Op.notBetween,
	$overlap:       Sequelize.Op.overlap,
	$contains:      Sequelize.Op.contains,
	$contained:     Sequelize.Op.contained,
	$adjacent:      Sequelize.Op.adjacent,
	$strictLeft:    Sequelize.Op.strictLeft,
	$strictRight:   Sequelize.Op.strictRight,
	$noExtendRight: Sequelize.Op.noExtendRight,
	$noExtendLeft:  Sequelize.Op.noExtendLeft,
	$and:           Sequelize.Op.and,
	$or:            Sequelize.Op.or,
	$any:           Sequelize.Op.any,
	$all:           Sequelize.Op.all,
	$values:        Sequelize.Op.values,
	$col:           Sequelize.Op.col,
};

/**
 * Create db connection class
 */
class Connection extends BaseConnection
{
	/**
	 * @inheritDoc
	 */
	getSequelize() {
		return Sequelize;
	}

	/**
	 * @inheritDoc
	 */
	createDbConnection() {
		this.db = new Sequelize(_.merge({
			dialect:  'mysql',
			timezone: '+00:00',

			define: {
				charset:    'utf8',
				collate:    'utf8_general_ci',
				timestamps: false,
			},

			pool: {
				max: 5,
				min: 0,
			},

			operatorsAliases,

		}, this.config));
	}

	/**
	 * @inheritDoc
	 */
	async checkDatabaseExist() {
		const connection = await mysql.createConnection({
			host:     this.config.host,
			port:     this.config.port,
			user:     this.config.username,
			password: this.config.password,
		});

		return await connection.query(`CREATE DATABASE IF NOT EXISTS ${this.config.database} CHARACTER SET utf8 COLLATE utf8_general_ci;`);
	};
};

module.exports = Connection;
