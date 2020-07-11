const { createInvokeParams } = require('./create-invoke-params')
const isObject = require('../validations/is-object')
const throwErrorResponseModel = require('../utils/throw-error-response-model');

module.exports = invokeLambda = async ({ lambda, functionName, stage = 'dev', payload }) => {
  const invokeParams = {
    FunctionName: functionName,
    Qualifier: stage,
    Payload: payload === undefined ? payload : JSON.stringify(payload),
  }

  let result;
  try { result = await lambda.invoke(invokeParams).promise().catch(result => result); }
  catch (err) { result = err; }

  if (result.message)
    throwErrorResponseModel(invokeParams, result.message);

  if (result.FunctionError)
    throwErrorResponseModel(invokeParams, JSON.parse(result.Payload).errorMessage);


  return JSON.parse(result.Payload) 
}