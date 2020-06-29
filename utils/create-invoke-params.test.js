const { createInvokeParams } = require('./create-invoke-params');

describe('createInvokeParams = (functionName, method, tableName, stage = "dev", dbParams = {})', () => {
  test('should return a successful object when all params sended are valid.', async () => {
    const functionName = 'functionName';
    const method = 'method';
    const tableName = 'tableName';
    const stage = 'stage';
    const body = {};
    const projectionExpression = 'projectionExpression';
    const keyConditionExpression = 'keyConditionExpression';
    const filterExpression = 'keyConditionExpression';
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};
    const params = { path: {} };

    const dbParams = {
      body: body,
      projectionExpression: projectionExpression,
      keyConditionExpression: keyConditionExpression,
      expressionAttributeNames: expressionAttributeNames,
      expressionAttributeValues: expressionAttributeValues,
      params: params
    }

    const payload = {
      tableName: tableName,
      method: method,
      body: body,
      projectionExpression: projectionExpression,
      keyConditionExpression: keyConditionExpression,
      expressionAttributeNames: expressionAttributeNames,
      expressionAttributeValues: expressionAttributeValues,
      params: params
    };

    const expected = {
      FunctionName: functionName,
      Qualifier: stage,
      Payload: JSON.stringify(payload),
    };

    const received = createInvokeParams(functionName, method, tableName, stage, dbParams);
    expect(received).toEqual(expected);
  })

  test('should return an error message when "functionName" is not a string', async () => {
    const functionNames = [1, true, null, undefined, {}, [], () => { }];
    const method = 'method';
    const tableName = 'tableName';
    const stage = 'stage';
    const dbParams = { key: 'value' };

    for (let functionName of functionNames) {
      const inputData = { functionName, method, tableName, stage, dbParams };
      if (typeof functionName == 'function') inputData.functionName = undefined;

      const expected = {
        errorMessage: '"functionName" should be a string.',
        statusCode: 400,
        inputData: inputData
      };

      try { createInvokeParams(functionName, method, tableName, stage, dbParams) } 
      catch (received) { expect(JSON.parse(received)).toEqual(expected) }
    }
  })

  test('should return an error message when "method" is not a string', async () => {
    const functionName = 'functionName';
    const methods = [1, true, null, undefined, {}, [], () => { }];
    const tableName = 'tableName';
    const stage = 'stage';
    const dbParams = { key: 'value' };

    for (let method of methods) {
      const inputData = { functionName, method, tableName, stage, dbParams };
      if (typeof method == 'function') inputData.method = undefined;

      const expected = {
        errorMessage: '"method" should be a string.',
        statusCode: 400,
        inputData: inputData
      };

      try { createInvokeParams(functionName, method, tableName, stage, dbParams) }
      catch (received) { expect(JSON.parse(received)).toEqual(expected) }
    }
  })

  test('should return an error message when "tableName" is not a string', async () => {
    const functionName = 'functionName';
    const method = 'method';
    const tableNames = [1, true, null, undefined, {}, [], () => { }];
    const stage = 'stage';
    const dbParams = { key: 'value' };

    for (let tableName of tableNames) {
      const inputData = { functionName, method, tableName, stage, dbParams };
      if (typeof tableName == 'function') {
        inputData.tableName = undefined
      };

      const expected = {
        errorMessage: '"tableName" should be a string.',
        statusCode: 400,
        inputData: inputData
      };

      try { createInvokeParams(functionName, method, tableName, stage, dbParams) } 
      catch (received) { expect(JSON.parse(received)).toEqual(expected) }
    }
  })
  test('should return an error message when "stage" is not a string or undefined', async () => {
    const functionName = 'functionName';
    const method = 'method';
    const tableName = 'tableName';
    const stages = [1, true, null, {}, [], () => { }];
    const dbParams = { key: 'value' };

    for (let stage of stages) {
      const payload = {
        method: method,
        dbParams: dbParams
      };
      payload.dbParams.TableName = tableName;

      const inputData = { functionName, method, tableName, stage, dbParams };
      if (typeof inputData.stage == 'function') inputData.stage = undefined;

      const expected = {
        errorMessage: '"stage" should be a string or undefined.',
        statusCode: 400,
        inputData: inputData
      };

      try { createInvokeParams(functionName, method, tableName, stage, dbParams) } 
      catch (received) { expect(JSON.parse(received)).toEqual(expected) }
    }
  })
  test('should return an error message when "dbParams" is not an object or undefined', async () => {
    const functionName = 'functionName';
    const method = 'method';
    const tableName = 'tableName';
    const stage = 'stage';
    const dbParamsList = [1, true, null, '', [], () => { }];

    for (let dbParams of dbParamsList) {
      const inputData = { functionName, method, tableName, stage, dbParams };
      if (typeof inputData.dbParams == 'function') inputData.dbParams = undefined;

      const expected = JSON.stringify({
        inputData: typeof inputData == 'function' ? undefined : inputData,
        errorMessage: '"dbParams" should be an object or undefined.',
        statusCode: 400,
      });

      try { createInvokeParams(functionName, method, tableName, stage, dbParams) } catch (received) {
        expect(JSON.parse(received)).toEqual(JSON.parse(expected))
      }
    } 
  })
  
})

