const dbGateway = require('./db-gateway');

const mockedDocumentClient = require('./doc-client-mock');
const docClient = new mockedDocumentClient();

describe('\n function dbGateway(docClient, tableName)', () => {
  test('should return an error object when "docClient" is not a DocumentClient', async () => {
    const docClient = class SomeWrongClass { };

    const tableName = 'tableName';
    const methods = ['get', 'query', 'scan', 'del', 'put'];

    const expected = JSON.stringify({
      statusCode: 400,
      errorMessage: '"docClient" should be DocumentClient.',
      inputData: docClient
    });

    for (let method of methods) {
      const received = await dbGateway(docClient, tableName)[method]({}).catch(received => received)
      expect(JSON.parse(received)).toEqual(JSON.parse(expected))
    }
  })

  test('should return an error object when "tableName" is not a string', async () => {
    const tableNames = [1, true, {}, () => { }, [], null];
    const methods = ['get', 'query', 'scan', 'del', 'put'];

    for (let tableName of tableNames) {
      const expected = JSON.stringify({
        statusCode: 400,
        errorMessage: '"tableName" should be string.',
        inputData: tableName
      });

      for (let method of methods) {
        const received = await dbGateway(docClient, tableName)[method]({}).catch(received => received)
        expect(JSON.parse(received)).toEqual(JSON.parse(expected))
      }
    }
  })
})

describe('\n _doRequest = async function (method, dbParams)', () => {
  test('should return an error object when "method" is invalid', async () => {
    const methods = [1, '', {}, null, undefined, [], () => { }];
    const dbParams = { key: 'value'};
    const tableName = 'tableName';

    for (let method of methods) {
      const expected = JSON.stringify({
        statusCode: 400,
        errorMessage: '"method" should be "get", "put", "delete", "query" or "scan".',
        inputData: method
      });
      const received = await dbGateway(docClient, tableName)._doRequest(method, dbParams).catch(received => received)
      expect(JSON.parse(received)).toEqual(JSON.parse(expected))
    }
  })

  test('should return an error object when "dbParams" is not an object', async () => {
    const method = 'get';
    const dbParamsList = [1, '', true, null, undefined, [], () => { }];
    const tableName = 'tableName';

    for (let dbParams of dbParamsList) {
      const expected = JSON.stringify({
        statusCode: 400,
        errorMessage: '"dbParams" should be object.',
        inputData: dbParams
      });
      const received = await dbGateway(docClient, tableName)._doRequest(method, dbParams).catch(received => received)
      expect(JSON.parse(received)).toEqual(JSON.parse(expected))
    }
  })

  test('should return an error object when "dbParams" is empty object', async () => {
    const method = 'get';
    const dbParams = {};
    const tableName = 'tableName';

    const expected = JSON.stringify({
      statusCode: 400,
      errorMessage: '"dbParams" should not be empty object.',
      inputData: dbParams
    });
    const received = await dbGateway(docClient, tableName)._doRequest(method, dbParams).catch(received => received)
    expect(JSON.parse(received)).toEqual(JSON.parse(expected))
  })
})

describe('\n _getUpdatedHistoric = function (actualItem, changedBy)', () => {
  test('should return an error object when "method" is invalid', async () => {
    const changedByList = [1, true, {}, null, undefined, [], () => { }];
    const actualItem = { key: 'value' };
    const tableName = 'tableName';

    for (let changedBy of changedByList) {
      const expected = JSON.stringify({
        statusCode: 400,
        errorMessage: '"changedBy" should be string.',
        inputData: changedBy
      });

      try {
        dbGateway(docClient, tableName)._getUpdatedHistoric(actualItem, changedBy);
        fail();
      } catch (received) {
        expect(JSON.parse(received)).toEqual(JSON.parse(expected))
      }
    }
  })

  test('should return an error object when "actualItem" is not an object', async () => {
    const changedBy = 'changedBy';
    const actualItemList = [1, '', true, null, undefined, [], () => { }];
    const tableName = 'tableName';

    for (let actualItem of actualItemList) {
      const expected = JSON.stringify({
        statusCode: 400,
        errorMessage: '"actualItem" should be object.',
        inputData: actualItem
      });

      try {
        dbGateway(docClient, tableName)._getUpdatedHistoric(actualItem, changedBy);
        fail();
      } catch (received) {
        expect(JSON.parse(received)).toEqual(JSON.parse(expected))
      }
    }
  })

  test('should return an error object when "actualItem" is empty object', async () => {
    const changedBy = 'changedBy';
    const actualItem = {};
    const tableName = 'tableName';

    const expected = JSON.stringify({
      statusCode: 400,
      errorMessage: '"actualItem" should not be empty object.',
      inputData: actualItem
    });

    try {
      dbGateway(docClient, tableName)._getUpdatedHistoric(actualItem, changedBy);
      fail();
    } catch (received) {
      expect(JSON.parse(received)).toEqual(JSON.parse(expected))
    }
  })

  test('should return a success object when inputs are valid', async () => {
    const changedBy = 'changedBy';
    const actualItem = { key: 'value' };
    const tableName = 'tableName';

    const expected = [{
      changedWhen: 'string',
      changedBy: 'changedBy',
      item: actualItem
    }];

    try {
      const received = dbGateway(docClient, tableName)._getUpdatedHistoric(actualItem, changedBy);
      expect(typeof received[0].changedWhen).toEqual(typeof expected[0].changedWhen)
      expect(received[0].changedBy).toEqual(expected[0].changedBy)
      expect(received[0].item).toEqual(expected[0].item)
    } catch (received) {
      fail();
    }
  })
})


describe('\n get = async function ({ keys, projectionExpression })', () => {
  test('should return a successful object when all input are valid', async () => {
    const keys = { id: 'id' };
    const tableName = 'tableName';

    const expected = {
      statusCode: 200,
      item: { id: 'id', historic: [{ changedBy: 'changedBy' }] }
    }

    const received = await dbGateway(docClient, tableName).get({ keys }).catch(received => received)
    expect(received).toEqual(expected)
  })


  test('should return an error object when "keys" is not an object', async () => {
    const tableName = 'tableName';
    const keysList = [1, true, '', [], () => { }, undefined, null];

    for (let keys of keysList) {
      const dbParams = {
        keys: keys,
      }

      const expected = JSON.stringify({
        statusCode: 400,
        errorMessage: '"keys" should be object.',
        inputData: keys
      });

      const received = await dbGateway(docClient, tableName).get(dbParams).catch(received => received)
      expect(JSON.parse(received)).toEqual(JSON.parse(expected))
    }
  })

  test('should return an error object when "keys" is empty object', async () => {
    const tableName = 'tableName';
    const keys = {};

    const dbParams = {
      keys: keys,
    }

    const expected = JSON.stringify({
      statusCode: 400,
      errorMessage: '"keys" should not be empty object.',
      inputData: keys
    });

    const received = await dbGateway(docClient, tableName).get(dbParams).catch(received => received)
    expect(JSON.parse(received)).toEqual(JSON.parse(expected))
  })

  test('should return an error object when "projectionExpression" is not undefined or string ', async () => {
    const tableName = 'tableName';
    const keys = { key: 'value' };
    const projectionExpressions = [1, true, {}, [], () => { }, null];

    for (let projectionExpression of projectionExpressions) {
      const dbParams = {
        keys: keys,
        projectionExpression: projectionExpression
      }

      const expected = JSON.stringify({
        statusCode: 400,
        errorMessage: '"projectionExpression" should be string or undefined.',
        inputData: projectionExpression
      });

      const received = await dbGateway(docClient, tableName).get(dbParams).catch(received => received)
      expect(JSON.parse(received)).toEqual(JSON.parse(expected))
    }
  })
})

describe('\n del = async function ({ keys })', () => {
  test('should return a successful object when all input are valid', async () => {
    const keys = { id: 'id' };
    const tableName = 'tableName';

    const dbParams = {
      keys: keys,
    }

    const expected = {
      statusCode: 200,
    }

    const received = await dbGateway(docClient, tableName).del(dbParams).catch(received => received)
    expect(received).toEqual(expected)
  })

  test('should return an error object when "keys" is not an object', async () => {
    const tableName = 'tableName';
    const keysList = [1, true, '', [], () => { }, undefined, null];

    for (let keys of keysList) {
      const dbParams = {
        keys: keys,
      }

      const expected = JSON.stringify({
        statusCode: 400,
        errorMessage: '"keys" should be object.',
        inputData: keys
      });

      const received = await dbGateway(docClient, tableName).del(dbParams).catch(received => received)
      expect(JSON.parse(received)).toEqual(JSON.parse(expected))
    }
  })

  test('should return an error object when "keys" is empty object', async () => {
    const tableName = 'tableName';
    const keys = {};

    const dbParams = {
      keys: keys,
    }

    const expected = JSON.stringify({
      statusCode: 400,
      errorMessage: '"keys" should not be empty object.',
      inputData: keys
    });

    const received = await dbGateway(docClient, tableName).del(dbParams).catch(received => received)
    expect(JSON.parse(received)).toEqual(JSON.parse(expected))
  })
})

describe('\n query = async function ({ keyConditionExpression, expressionAttributeValues, expressionAttributeNames, projectionExpression })', () => {
  test('should return a successful object when all input are valid', async () => {
    const keyConditionExpression = '';
    const expressionAttributeValues = { id: 'id' };
    const expressionAttributeNames = { key: 'value' };
    const projectionExpression = '';
    const tableName = 'tableName';

    const dbParams = {
      keyConditionExpression: keyConditionExpression,
      expressionAttributeValues: expressionAttributeValues,
      expressionAttributeNames: expressionAttributeNames,
      projectionExpression: projectionExpression,
    }

    const expected = {
      statusCode: 200,
      items: [{ id: 'id', historic: [{ changedBy: 'changedBy' }] }],
      count: 1,
      scannedCount: 1
    }

    const received = await dbGateway(docClient, tableName).query(dbParams).catch(received => received)
    expect(received).toEqual(expected)
  })

  test('should return an error object when "keyConditionExpression" is not a string', async () => {
    const keyConditionExpressions = [1, true, {}, [], () => { }, undefined, null];
    const expressionAttributeValues = { id: 'id' };
    const expressionAttributeNames = { key: 'value' };
    const projectionExpression = '';
    const tableName = 'tableName';

    for (let keyConditionExpression of keyConditionExpressions) {
      const dbParams = {
        keyConditionExpression: keyConditionExpression,
        expressionAttributeValues: expressionAttributeValues,
        expressionAttributeNames: expressionAttributeNames,
        projectionExpression: projectionExpression,
      }

      const expected = JSON.stringify({
        statusCode: 400,
        errorMessage: '"keyConditionExpression" should be string.',
        inputData: keyConditionExpression
      });

      const received = await dbGateway(docClient, tableName).query(dbParams).catch(received => received)
      expect(JSON.parse(received)).toEqual(JSON.parse(expected))
    }
  })

  test('should return an error object when "expressionAttributeValues" is not an object', async () => {
    const keyConditionExpression = '';
    const expressionAttributeNames = { key: 'value' };
    const projectionExpression = '';
    const tableName = 'tableName';
    const expressionAttributeValuesList = [1, true, '', [], () => { }, undefined, null];

    for (let expressionAttributeValues of expressionAttributeValuesList) {
      const dbParams = {
        keyConditionExpression: keyConditionExpression,
        expressionAttributeValues: expressionAttributeValues,
        expressionAttributeNames: expressionAttributeNames,
        projectionExpression: projectionExpression,
      }

      const expected = JSON.stringify({
        statusCode: 400,
        errorMessage: '"expressionAttributeValues" should be object.',
        inputData: expressionAttributeValues
      });

      const received = await dbGateway(docClient, tableName).query(dbParams).catch(received => received)
      expect(JSON.parse(received)).toEqual(JSON.parse(expected))
    }
  })

  test('should return an error object when "expressionAttributeValues" is empty object', async () => {
    const keyConditionExpression = '';
    const expressionAttributeNames = { key: 'value' };
    const projectionExpression = '';
    const tableName = 'tableName';
    const expressionAttributeValues = {};

    const dbParams = {
      keyConditionExpression: keyConditionExpression,
      expressionAttributeValues: expressionAttributeValues,
      expressionAttributeNames: expressionAttributeNames,
      projectionExpression: projectionExpression,
    }

    const expected = JSON.stringify({
      statusCode: 400,
      errorMessage: '"expressionAttributeValues" should not be empty object.',
      inputData: expressionAttributeValues
    });

    const received = await dbGateway(docClient, tableName).query(dbParams).catch(received => received)
    expect(JSON.parse(received)).toEqual(JSON.parse(expected))
  })

  test('should return an error object when "projectionExpression" is not undefined or string ', async () => {
    const keyConditionExpression = '';
    const expressionAttributeNames = { key: 'value' };
    const tableName = 'tableName';
    const expressionAttributeValues = { key: 'value' };
    const projectionExpressions = [1, true, {}, [], () => { }, null];

    for (let projectionExpression of projectionExpressions) {
      const dbParams = {
        keyConditionExpression: keyConditionExpression,
        expressionAttributeValues: expressionAttributeValues,
        expressionAttributeNames: expressionAttributeNames,
        projectionExpression: projectionExpression,
      }

      const expected = JSON.stringify({
        statusCode: 400,
        errorMessage: '"projectionExpression" should be string or undefined.',
        inputData: projectionExpression
      });

      const received = await dbGateway(docClient, tableName).query(dbParams).catch(received => received)
      expect(JSON.parse(received)).toEqual(JSON.parse(expected))
    }
  })

  test('should return an error object when "expressionAttributeNames" is not an object', async () => {
    const keyConditionExpression = '';
    const expressionAttributeValues = { key: 'value' };
    const projectionExpression = '';
    const tableName = 'tableName';
    const expressionAttributeNamesList = [1, true, '', [], () => { }, null];

    for (let expressionAttributeNames of expressionAttributeNamesList) {
      const dbParams = {
        keyConditionExpression: keyConditionExpression,
        expressionAttributeValues: expressionAttributeValues,
        expressionAttributeNames: expressionAttributeNames,
        projectionExpression: projectionExpression,
      }

      const expected = JSON.stringify({
        statusCode: 400,
        errorMessage: '"expressionAttributeNames" should be object or undefined.',
        inputData: expressionAttributeNames
      });

      const received = await dbGateway(docClient, tableName).query(dbParams).catch(received => received)
      expect(JSON.parse(received)).toEqual(JSON.parse(expected))
    }
  })

  test('should return an error object when "expressionAttributeNames" is empty object', async () => {
    const keyConditionExpression = '';
    const expressionAttributeValues = { key: 'value' };
    const projectionExpression = '';
    const tableName = 'tableName';
    const expressionAttributeNames = {};

    const dbParams = {
      keyConditionExpression: keyConditionExpression,
      expressionAttributeValues: expressionAttributeValues,
      expressionAttributeNames: expressionAttributeNames,
      projectionExpression: projectionExpression,
    }

    const expected = JSON.stringify({
      statusCode: 400,
      errorMessage: '"expressionAttributeNames" should not be empty object.',
      inputData: expressionAttributeNames
    });

    const received = await dbGateway(docClient, tableName).query(dbParams).catch(received => received)
    expect(JSON.parse(received)).toEqual(JSON.parse(expected))
  })
})

describe('\n scan = async function ({ filterExpression, expressionAttributeValues, expressionAttributeNames, projectionExpression })', () => {
  test('should return a successful object when all input are valid', async () => {
    const filterExpression = '';
    const expressionAttributeValues = { id: 'id' };
    const expressionAttributeNames = { key: 'value' };
    const projectionExpression = '';
    const tableName = 'tableName';

    const dbParams = {
      filterExpression: filterExpression,
      expressionAttributeValues: expressionAttributeValues,
      expressionAttributeNames: expressionAttributeNames,
      projectionExpression: projectionExpression,
    }

    const expected = {
      statusCode: 200,
      items: [{ id: 'id', historic: [{ changedBy: 'changedBy' }] }],
      count: 1,
      scannedCount: 1
    }

    const received = await dbGateway(docClient, tableName).scan(dbParams).catch(received => received)
    expect(received).toEqual(expected)
  })

  test('should return an error object when "filterExpression" is not a string', async () => {
    const filterExpressions = [1, true, {}, [], () => { }, undefined, null];
    const expressionAttributeValues = { id: 'id' };
    const expressionAttributeNames = { key: 'value' };
    const projectionExpression = '';
    const tableName = 'tableName';

    for (let filterExpression of filterExpressions) {
      const dbParams = {
        filterExpression: filterExpression,
        expressionAttributeValues: expressionAttributeValues,
        expressionAttributeNames: expressionAttributeNames,
        projectionExpression: projectionExpression,
      }

      const expected = JSON.stringify({
        statusCode: 400,
        errorMessage: '"filterExpression" should be string.',
        inputData: filterExpression
      });

      const received = await dbGateway(docClient, tableName).scan(dbParams).catch(received => received)
      expect(JSON.parse(received)).toEqual(JSON.parse(expected))
    }
  })

  test('should return an error object when "expressionAttributeValues" is not an object', async () => {
    const filterExpression = '';
    const expressionAttributeNames = { key: 'value' };
    const projectionExpression = '';
    const tableName = 'tableName';
    const expressionAttributeValuesList = [1, true, '', [], () => { }, undefined, null];

    for (let expressionAttributeValues of expressionAttributeValuesList) {
      const dbParams = {
        filterExpression: filterExpression,
        expressionAttributeValues: expressionAttributeValues,
        expressionAttributeNames: expressionAttributeNames,
        projectionExpression: projectionExpression,
      }

      const expected = JSON.stringify({
        statusCode: 400,
        errorMessage: '"expressionAttributeValues" should be object.',
        inputData: expressionAttributeValues
      });

      const received = await dbGateway(docClient, tableName).scan(dbParams).catch(received => received)
      expect(JSON.parse(received)).toEqual(JSON.parse(expected))
    }
  })

  test('should return an error object when "expressionAttributeValues" is empty object', async () => {
    const filterExpression = '';
    const expressionAttributeNames = { key: 'value' };
    const projectionExpression = '';
    const tableName = 'tableName';
    const expressionAttributeValues = {};

    const dbParams = {
      filterExpression: filterExpression,
      expressionAttributeValues: expressionAttributeValues,
      expressionAttributeNames: expressionAttributeNames,
      projectionExpression: projectionExpression,
    }

    const expected = JSON.stringify({
      statusCode: 400,
      errorMessage: '"expressionAttributeValues" should not be empty object.',
      inputData: expressionAttributeValues
    });

    const received = await dbGateway(docClient, tableName).scan(dbParams).catch(received => received)
    expect(JSON.parse(received)).toEqual(JSON.parse(expected))
  })

  test('should return an error object when "projectionExpression" is not undefined or string ', async () => {
    const filterExpression = '';
    const expressionAttributeNames = { key: 'value' };
    const tableName = 'tableName';
    const expressionAttributeValues = { key: 'value' };
    const projectionExpressions = [1, true, {}, [], () => { }, null];

    for (let projectionExpression of projectionExpressions) {
      const dbParams = {
        filterExpression: filterExpression,
        expressionAttributeValues: expressionAttributeValues,
        expressionAttributeNames: expressionAttributeNames,
        projectionExpression: projectionExpression,
      }

      const expected = JSON.stringify({
        statusCode: 400,
        errorMessage: '"projectionExpression" should be string or undefined.',
        inputData: projectionExpression
      });

      const received = await dbGateway(docClient, tableName).scan(dbParams).catch(received => received)
      expect(JSON.parse(received)).toEqual(JSON.parse(expected))
    }
  })

  test('should return an error object when "expressionAttributeNames" is not an object', async () => {
    const filterExpression = '';
    const expressionAttributeValues = { key: 'value' };
    const projectionExpression = '';
    const tableName = 'tableName';
    const expressionAttributeNamesList = [1, true, '', [], () => { }, null];

    for (let expressionAttributeNames of expressionAttributeNamesList) {
      const dbParams = {
        filterExpression: filterExpression,
        expressionAttributeValues: expressionAttributeValues,
        expressionAttributeNames: expressionAttributeNames,
        projectionExpression: projectionExpression,
      }

      const expected = JSON.stringify({
        statusCode: 400,
        errorMessage: '"expressionAttributeNames" should be object or undefined.',
        inputData: expressionAttributeNames
      });

      const received = await dbGateway(docClient, tableName).scan(dbParams).catch(received => received)
      expect(JSON.parse(received)).toEqual(JSON.parse(expected))
    }
  })

  test('should return an error object when "expressionAttributeNames" is empty object', async () => {
    const filterExpression = '';
    const expressionAttributeValues = { key: 'value' };
    const projectionExpression = '';
    const tableName = 'tableName';
    const expressionAttributeNames = {};

    const dbParams = {
      filterExpression: filterExpression,
      expressionAttributeValues: expressionAttributeValues,
      expressionAttributeNames: expressionAttributeNames,
      projectionExpression: projectionExpression,
    }

    const expected = JSON.stringify({
      statusCode: 400,
      errorMessage: '"expressionAttributeNames" should not be empty object.',
      inputData: expressionAttributeNames
    });

    const received = await dbGateway(docClient, tableName).scan(dbParams).catch(received => received)
    expect(JSON.parse(received)).toEqual(JSON.parse(expected))
  })
})

describe('\n put = async function ({ updateObject, keys, changedBy })', () => {
  test('should return a successful object when all input are valid', async () => {
    const updateObject = { key: 'value' };
    const keys = { id: 'id' };
    const changedBy = 'changedBy';

    const tableName = 'tableName';

    const dbParams = {
      updateObject: updateObject,
      keys: keys,
      changedBy: changedBy,
    }

    const expected = {
      statusCode: 200
    }

    const received = await dbGateway(docClient, tableName).put(dbParams).catch(received => received)
    expect(received).toEqual(expected)
  })

  test('should return an error object when "updateObject" is not an object', async () => {
    const keys = { id: 'id' };
    const changedBy = 'changedBy';
    const tableName = 'tableName';
    const updateObjects = [1, true, '', [], () => { }, undefined, null];

    for (let updateObject of updateObjects) {
      const dbParams = {
        updateObject: updateObject,
        keys: keys,
        changedBy: changedBy,
      }

      const expected = JSON.stringify({
        statusCode: 400,
        errorMessage: '"updateObject" should be object.',
        inputData: updateObject
      });

      const received = await dbGateway(docClient, tableName).put(dbParams).catch(received => received)
      expect(JSON.parse(received)).toEqual(JSON.parse(expected))
    }
  })

  test('should return an error object when "updateObject" is empty object', async () => {
    const keys = { id: 'id' };
    const changedBy = 'changedBy';
    const tableName = 'tableName';
    const updateObject = {};

    const dbParams = {
      updateObject: updateObject,
      keys: keys,
      changedBy: changedBy,
    }

    const expected = JSON.stringify({
      statusCode: 400,
      errorMessage: '"updateObject" should not be empty object.',
      inputData: updateObject
    });

    const received = await dbGateway(docClient, tableName).put(dbParams).catch(received => received)
    expect(JSON.parse(received)).toEqual(JSON.parse(expected))
  })

  test('should return an error object when "keys" finds no items in database', async () => {
    const keys = { id: 'no-exists' };
    const changedBy = 'changedBy';
    const tableName = 'tableName';
    const updateObject = { key: 'value'};

    const dbParams = {
      updateObject: updateObject,
      keys: keys,
      changedBy: changedBy, 
    } 

    const expected = JSON.stringify({
      statusCode: 400,
      errorMessage: '"actualItem" should be object.',
      inputData: keys 
    });

    const received = await dbGateway(docClient, tableName).put(dbParams).catch(received => received)
    expect(JSON.parse(received).statusCode).toEqual(JSON.parse(expected).statusCode)
    expect(JSON.parse(received).errorMessage).toEqual(JSON.parse(expected).errorMessage)
  })
})
