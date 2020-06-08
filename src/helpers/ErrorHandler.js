const { Connection } = require('../services');

const { ValidationError } = Connection.getInstance().getSequelize();

/**
 * Error handler class
 */
class ErrorHandler
{
	/**
	 * Build validation error
	 *
	 * @param {Object} error
	 *
	 * @return {undefined}
	 */
	static buildValidationError = error => {
		if (error instanceof ValidationError) {
			error.code    = 422;
			error.payload = error.errors.map(item => {
				let { message, path, value } = item;

				return { message, path, value };
			});

			throw error;
		}
	};
};

module.exports = ErrorHandler;
