const assert           = require('assert');
const {RemoveResponse} = require('../../index').responses;

describe('RemoveResponse class testing', () => {
	it('should return correct data', () => {
		const id = 'test';
		const result = true;

		const responseResult = {
			id,
			result
		};

		const response = new RemoveResponse(id, result);

		assert.deepEqual(response, responseResult);
	});
});
