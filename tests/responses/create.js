const assert           = require('assert');
const {CreateResponse} = require('../../index').responses;

describe('CreateResponse class testing', () => {
	it('should return correct data', () => {
		const result = {
			id:          1,
			alias:       'test',
			description: 'test description',
			domain:      'test domain',
		};

		const response = new CreateResponse(result);

		assert.deepEqual(response.model, result);
	});
});
