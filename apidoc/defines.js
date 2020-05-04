/**
 * @apiDefine DefaultRequest
 * This is default microservice request format.
 *
 * @apiVersion 1.0.0
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *     	 "jsonrpc": "2.0",
 *     	 "id": 1,
 *     	 "method": "See method below",
 *       "params": "See params section"
 *     }
 */

/**
 * @apiDefine DefaultApiError
 * This is default microservice error response.
 *
 * @apiVersion 1.0.0
 *
 * @apiError (Error 200) {Number} code Error code error.
 * @apiError (Error 200) {Number} status Status error flag.
 * @apiError (Error 200) {String} service Service where the error occurred.
 * @apiError (Error 200) {String} message Error message.
 *
 * @apiErrorExample Error-Response:
 *     {
 *     	 "jsonrpc": "2.0",
 *       "error": {
 *           "code": 0,
 *           "status": 1,
 *           "service": "authentication",
 *           "message": "Error message"
 *       }
 *     }
 */

/**
 * @apiDefine DefaultApiSuccess
 * This is default microservice success response.
 *
 * @apiVersion 1.0.0
 *
 * @apiErrorExample Success-Response:
 *     {
 *     	 "jsonrpc": "2.0",
 *     	 "id": 1,
 *       "result": "See success 200 section"
 *     }
 */
