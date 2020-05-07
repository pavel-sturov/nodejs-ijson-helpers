const assert           = require('assert');
const {UpdateResponse} = require('../../index').responses;

describe('UpdateResponse class testing', () => {
	it('should return correct data', () => {
		const result = {
			alias:       'test',
			description: 'test description',
			domain:      'test domain',
		};

		const response = new UpdateResponse(result);

		assert.deepEqual(response.model, result);
	});
});
