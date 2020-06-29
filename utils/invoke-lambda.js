const { createInvokeParams } = require('./create-invoke-params')

exports.invokeLambda = async ({lambda, functionName, method, tableName, stage = 'dev', dbParams = {}}) => {
  const invokeParams = createInvokeParams(functionName, method, tableName, stage, dbParams);
  const result = await lambda.invoke(invokeParams).promise();
  if (result.FunctionError) throw JSON.parse(result.Payload).errorMessage;
  return JSON.parse(result.Payload)
}