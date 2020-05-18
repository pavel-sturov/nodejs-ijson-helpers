const assert                             = require('assert');
const {ListResponse, PaginationResponse} = require('../../index').responses;
const {JsonQuery}                        = require('../../index').services;

describe('Test List response', () => {
	it('should return correct format', () => {
		const result   = {
			rows:  [{id: 1}, {id: 2}],
			count: 2,
		};
		const query    = new JsonQuery();
		const response = new ListResponse(result, query);

		assert.deepEqual(response.list, [...result.rows]);
		assert.ok(response.pagination instanceof PaginationResponse);
	});
});
