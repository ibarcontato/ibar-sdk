const ErrorResponseModel  = require('../models/error-response-model')
const  isObject  = require('../validations/is-object');

exports.createInvokeParams = (functionName, method, tableName, stage = 'dev', dbParams = {}) => {
  const inputData = { functionName, method, tableName, stage, dbParams };
  if (typeof functionName != 'string') throw JSON.stringify(new ErrorResponseModel(inputData, '"functionName" should be string.', 400));
  if (typeof stage != 'string' && stage !== undefined)
  throw JSON.stringify(new ErrorResponseModel(inputData, '"stage" should be string or undefined.', 400));
  if (!isObject(dbParams)) throw JSON.stringify(new ErrorResponseModel(inputData, '"dbParams" should be object or undefined.', 400));

  const payload = {
    tableName: tableName,
    method: method, 
    body: dbParams.body,
    projectionExpression: dbParams.projectionExpression,
    keyConditionExpression: dbParams.keyConditionExpression,
    filterExpression: dbParams.filterExpression,
    expressionAttributeNames: dbParams.expressionAttributeNames,
    expressionAttributeValues: dbParams.expressionAttributeValues,
    params: dbParams.params,
    keys: dbParams.keys
  };

  return {
    FunctionName: functionName,
    Qualifier: stage,
    Payload: JSON.stringify(payload),
  };

}