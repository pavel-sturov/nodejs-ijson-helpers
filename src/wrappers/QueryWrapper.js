const Connection = require('../services/db');
const JsonQuery  = require('../services/query');

/**
 * Replace or add mysql json query to JsonQuery instance
 *
 * @param {function} method
 *
 * @return {Function}
 */
module.exports = method => async (data = {}, req, ...params) => {
	const query = {
		filter:           data?.query ?? {},
		additionalFilter: data?.payload?.authorization?.filter ?? {},
	};

	data.query = new JsonQuery(query, () => Connection.getInstance().getModels());

	return await method(data, req, ...params);
};
