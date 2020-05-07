const assert           = require('assert');
const {RemoveResponse} = require('../../index').responses;

describe('RemoveResponse class testing', () => {
	it('should return correct data', () => {
		const result = {
			alias: 'test',
		};

		const response = new RemoveResponse(result);

		assert.deepEqual(response.identity, result);
	});
});
