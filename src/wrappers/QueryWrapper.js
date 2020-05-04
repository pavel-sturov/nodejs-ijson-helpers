const Connection = require('../services/db');
const JsonQuery  = require('../services/query');

/**
 * Replace or add mysql json query to JsonQuery instanse
 *
 * @param {function} method
 *
 * @return {Function}
 */
module.exports = method => async (data = {}, req, ...params) => {
	data.query = new JsonQuery(data?.query || {}, () => Connection.getInstance().getModels());

	return await method(data, req, ...params);
};
