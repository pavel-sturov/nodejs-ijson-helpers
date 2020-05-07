const assert               = require('assert');
const {PaginationResponse} = require('../../index').responses;
const {JsonQuery}          = require('../../index').services;

describe('PaginationResponse class testing', () => {
	const totalItems = 10;
	const config     = {
		page:    2,
		perPage: 50,
	};
	const result     = {
		totalItems,
		...config,
		pageCount: Math.ceil(totalItems / config.perPage),
	};

	const query    = new JsonQuery(config);
	const response = new PaginationResponse(query, totalItems);

	it('should return correct data', () => {
		assert.deepEqual(response.toJSON(), result);
	});

	it('should return total items', () => {
		assert.deepEqual(response.getTotalItems(), totalItems);
	});

	it('should return page count', () => {
		const {pageCount} = result;

		assert.deepEqual(response.getPageCount(), pageCount);
	});

	it('should return number of page', () => {
		const {page} = config;

		assert.deepEqual(response.getPage(), page);
	});

	it('should return count per page', () => {
		const {perPage} = config;

		assert.deepEqual(response.getPerPage(), perPage);
	});
});
