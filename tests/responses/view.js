const assert         = require('assert');
const {ViewResponse} = require('../../index').responses;

describe('ViewResponse class testing', () => {
	it('should return correct data', () => {
		const result = {
			id:          1,
			alias:       'test',
			description: 'test description',
			domain:      'test domain',
		};

		const response = new ViewResponse(result);

		assert.deepEqual(response.model, result);
	});
});
