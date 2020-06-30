const { dbGateway, getActualItem, createItem } = require('./db-gateway');

const mockedDocumentClient = require('./doc-client-mock');
const docClient = new mockedDocumentClient();

describe('async function getActualItem(docClient, tableName, keys)', () => {
  test('should return an item object when all input are valid', async () => {
    const tableName = 'tableName';
    const keys = { id: 'id' };

    const expected = { id: 'id', historic: [{ changedBy: 'changedBy' }] }

    const received = await getActualItem(docClient, tableName, keys)
    expect(received).toEqual(expected)
  })

  test('should return an empty object when all input are valid and item does not exist', async () => {
    const tableName = 'tableName';
    const keys = { id: 'no-id' };

    const expected = {}

    const received = await getActualItem(docClient, tableName, keys)
    expect(received).toEqual(expected)
  })

  test('should return an error object when an error occurs on resquest', async () => {
    const docClient = new mockedDocumentClient(true);

    const tableName = 'tableName';
    const keys = { id: 'id' };

    const expected = JSON.stringify({
      statusCode: 'docClientStatusCode',
      errorMessage: 'docClientError',
      inputData: {
        statusCode: 'docClientStatusCode',
        message: 'docClientError',
      }
    });

    const received = await getActualItem(docClient, tableName, keys).catch(received => received);
    expect(JSON.parse(received)).toEqual(JSON.parse(expected))
  })

  test('should return an error object when docClient is not DocumentClient', async () => {
    const docClient = class SomeWrongClass { };

    const tableName = 'tableName';
    const keys = { id: 'id' };

    const expected = JSON.stringify({
      statusCode: 400,
      errorMessage: '"docClient" should be a DocumentClient',
      inputData: docClient
    });

    const received = await getActualItem(docClient, tableName, keys).catch(received => received);
    expect(JSON.parse(received)).toEqual(JSON.parse(expected))
  })

  test('should return an error object when keys is not an object', async () => {
    const tableName = 'tableName';
    const keysList = [1, '', true, [], () => { }, undefined, null];

    for (let keys of keysList) {
      const expected = JSON.stringify({
        statusCode: 400,
        errorMessage: '"keys" should be an object',
        inputData: keys
      });

      const received = await getActualItem(docClient, tableName, keys).catch(received => received);
      expect(JSON.parse(received)).toEqual(JSON.parse(expected))
    }
  })

  test('should return an error object when keys is empty', async () => {
    const tableName = 'tableName';
    const keys = {};

    const expected = JSON.stringify({
      statusCode: 400,
      errorMessage: '"keys" should not be empty',
      inputData: keys
    });

    const received = await getActualItem(docClient, tableName, keys).catch(received => received);
    expect(JSON.parse(received)).toEqual(JSON.parse(expected))
  })

  test('should return an error object when tableName is not string', async () => {
    const tableNames = [1, {}, true, [], () => { }, undefined, null];
    const keys = { id: 'id' };

    for (let tableName of tableNames) {
      const expected = JSON.stringify({
        statusCode: 400,
        errorMessage: '"tableName" should be string',
        inputData: tableName
      });

      const received = await getActualItem(docClient, tableName, keys).catch(received => received);
      expect(JSON.parse(received)).toEqual(JSON.parse(expected))
    }
  })
})

describe('\n async function createItem(docClient, body, path, header, tableName)', () => {
  test('should return an item object when all input are valid', async () => {
    const tableName = 'tableName';
    const path = { id: 'id' };
    const header = { changedBy: 'changedBy' };
    const body = { id: 'id' };

    const expected = { id: 'id', historic: [{ changedBy: 'changedBy' }] }

    const received = await createItem(docClient, body, path, header, tableName)
    expect(received.id).toEqual(expected.id)
    expect(received.historic.changedBy).toEqual(expected.historic.changedBy)
  })

  test('should return an error object when docClient is not DocumentClient', async () => {
    const docClient = class SomeWrongClass { };

    const tableName = 'tableName';
    const path = { id: 'id' };
    const header = { changedBy: 'changedBy' };
    const body = { id: 'id' };

    const expected = JSON.stringify({
      statusCode: 400,
      errorMessage: '"docClient" should be a DocumentClient',
      inputData: docClient
    });

    const received = await createItem(docClient, body, path, header, tableName).catch(received => received);
    expect(JSON.parse(received)).toEqual(JSON.parse(expected))
  })

  test('should return an error object when body is not an object', async () => {
    const tableName = 'tableName';
    const path = { id: 'id' };
    const header = { changedBy: 'changedBy' };
    const bodies = [1, '', true, [], () => { }, undefined, null];;

    for (let body of bodies) {
      const expected = JSON.stringify({
        statusCode: 400,
        errorMessage: '"body" should be an object',
        inputData: body
      });

      const received = await createItem(docClient, body, path, header, tableName).catch(received => received);
      expect(JSON.parse(received)).toEqual(JSON.parse(expected))
    }
  })
  test('should return an error object when body is empty', async () => {
    const tableName = 'tableName';
    const path = { id: 'id' };
    const header = { changedBy: 'changedBy' };
    const body = {};

    const expected = JSON.stringify({
      statusCode: 400,
      errorMessage: '"body" should not be empty',
      inputData: body
    });

    const received = await createItem(docClient, body, path, header, tableName).catch(received => received);
    expect(JSON.parse(received)).toEqual(JSON.parse(expected))
  })

  test('should return an error object when path is not an object', async () => {
    const tableName = 'tableName';
    const header = { changedBy: 'changedBy' };
    const body = { id: 'id' };
    const paths = [1, '', true, [], () => { }, undefined, null];;

    for (let path of paths) {
      const expected = JSON.stringify({
        statusCode: 400,
        errorMessage: '"path" should be an object',
        inputData: path
      });

      const received = await createItem(docClient, body, path, header, tableName).catch(received => received);
      expect(JSON.parse(received)).toEqual(JSON.parse(expected))
    }
  })

  test('should return an error object when header is not an object', async () => {
    const tableName = 'tableName';
    const path = { id: 'id' };
    const body = { id: 'id' };
    const headers = [1, '', true, [], () => { }, undefined, null];;

    for (let header of headers) {
      const expected = JSON.stringify({
        statusCode: 400,
        errorMessage: '"header" should be an object',
        inputData: header
      });

      const received = await createItem(docClient, body, path, header, tableName).catch(received => received);
      expect(JSON.parse(received)).toEqual(JSON.parse(expected))
    }
  })


  test('should return an error object when header has no "changedBy" attribute', async () => {
    const tableName = 'tableName';
    const path = { id: 'id' };
    const changedByList = [1, {}, true, [], () => { }, undefined, null];
    const body = { id: 'id' };

    for (let changedBy of changedByList) {
      const header = { changedBy: changedBy };

      const expected = JSON.stringify({
        statusCode: 400,
        errorMessage: '"changedBy" should be string',
        inputData: changedBy
      });

      const received = await createItem(docClient, body, path, header, tableName).catch(received => received);
      expect(JSON.parse(received)).toEqual(JSON.parse(expected))
    }
  })

  test('should return an error object when tableName is not string', async () => {
    const path = { id: 'id' };
    const header = { changedBy: 'changedBy' };
    const body = { id: 'id' };
    const tableNames = [1, {}, true, [], () => { }, undefined, null];

    for (let tableName of tableNames) {
      const expected = JSON.stringify({
        statusCode: 400,
        errorMessage: '"tableName" should be string',
        inputData: tableName
      });

      const received = await createItem(docClient, body, path, header, tableName).catch(received => received);
      expect(JSON.parse(received)).toEqual(JSON.parse(expected))
    }
  })
})

describe(`\n async function dbGateway(docClient, method, tableName,
  {
    body,
    path,
    header,
    queryString,
    projectionExpression,
    expressionAttributeNames,
    keyConditionExpression,
    expressionAttributeValues,
    filterExpression
  } = {}
`, () => {

  describe('\n ALL', () => {
    test('should return an error object when "docClient" is not a DocumentClient', async () => {
      const docClient = class SomeWrongClass { };

      const tableName = 'tableName';
      const method = 'any';
      const dbParams = {};

      const expected = JSON.stringify({
        statusCode: 400,
        errorMessage: '"docClient" should be a DocumentClient',
        inputData: docClient
      });

      const received = await dbGateway(docClient, method, tableName, dbParams).catch(received => received);
      expect(JSON.parse(received)).toEqual(JSON.parse(expected))
    })

    test('should return an error object when "projectionExpression" is not undefined neither string', async () => {
      const tableName = 'tableName';
      const method = 'any';

      const projectionExpressions = [1, true, {}, () => { }, [], null];

      for (let projectionExpression of projectionExpressions) {
        const dbParams = { projectionExpression: projectionExpression };

        const expected = JSON.stringify({
          statusCode: 400,
          errorMessage: '"projectionExpression" should be string or undefined',
          inputData: projectionExpression
        });

        const received = await dbGateway(docClient, method, tableName, dbParams).catch(received => received);
        expect(JSON.parse(received)).toEqual(JSON.parse(expected))
      }
    })

    test('should return an error object when "expressionAttributeNames" is not undefined neither object', async () => {
      const tableName = 'tableName';
      const method = 'any';

      const expressionAttributeNamesList = [1, true, '', () => { }, [], null];

      for (let expressionAttributeNames of expressionAttributeNamesList) {
        const dbParams = { expressionAttributeNames: expressionAttributeNames };

        const expected = JSON.stringify({
          statusCode: 400,
          errorMessage: '"expressionAttributeNames" should be an object or undefined',
          inputData: expressionAttributeNames
        });

        const received = await dbGateway(docClient, method, tableName, dbParams).catch(received => received);
        expect(JSON.parse(received)).toEqual(JSON.parse(expected))
      }
    })
  })

  describe('\n GET', () => {
    test('should return a successful object when all input are valid', async () => {
      const method = 'get';
      const tableName = 'tableName';

      const dbParams = {
        body: {},
        path: { id: 'id' },
        header: {}
      }

      const expected = {
        statusCode: 200,
        item: { id: 'id', historic: [{ changedBy: 'changedBy' }] }
      }

      const received = await dbGateway(docClient, method, tableName, dbParams).catch(received => received)
      expect(received).toEqual(expected)
    })
    test('should return an error object when path is empty', async () => {
      const method = 'get';
      const tableName = 'tableName';

      const dbParams = {
        body: {},
        path: {},
        header: {}
      }

      const expected = JSON.stringify({
        statusCode: 400,
        errorMessage: '"path" should not be an empty object.',
        inputData: dbParams.path
      });

      const received = await dbGateway(docClient, method, tableName, dbParams).catch(received => received);
      expect(JSON.parse(received)).toEqual(JSON.parse(expected))
    })
  })

  describe('\n DELETE', () => {
    test('should return a successful object when all input are valid', async () => {
      const method = 'delete';
      const tableName = 'tableName';

      const dbParams = {
        body: {},
        path: { id: 'id' },
        header: {}
      }

      const expected = {
        statusCode: 200,
      }

      const received = await dbGateway(docClient, method, tableName, dbParams).catch(received => received)
      expect(received).toEqual(expected)
    })
    test('should return an error object when path is empty', async () => {
      const method = 'delete';
      const tableName = 'tableName';

      const dbParams = {
        body: {},
        path: {},
        header: {}
      }

      const expected = JSON.stringify({
        statusCode: 400,
        errorMessage: '"path" should not be an empty object.',
        inputData: dbParams.path
      });

      const received = await dbGateway(docClient, method, tableName, dbParams).catch(received => received);
      expect(JSON.parse(received)).toEqual(JSON.parse(expected))

    })
  })

  describe('\n QUERY', () => {
    test('should return a successful object when all input are valid', async () => {
      const method = 'query';
      const tableName = 'tableName';
      const dbParams = {
        keyConditionExpression: 'keyConditionExpression',
        expressionAttributeValues: { id: 'id' }
      }

      const expected = {
        statusCode: 200,
        items: [{ id: 'id', historic: [{ changedBy: 'changedBy' }] }],
        count: 1,
        scannedCount: 1
      }

      const received = await dbGateway(docClient, method, tableName, dbParams).catch(received => received)
      expect(received.items[0].id).toEqual(expected.items[0].id)
      expect(received.items[0].historic[0].changedBy).toEqual(expected.items[0].historic[0].changedBy)
    })

    test('should return an error object when keyConditionExpression is not a string', async () => {
      const method = 'query';
      const tableName = 'tableName';
      const keyConditionExpressions = [1, true, {}, [], () => { }, undefined, null];

      for (let keyConditionExpression of keyConditionExpressions) {
        const dbParams = {
          body: {},
          path: {},
          header: {},
          expressionAttributeValues: {},
          keyConditionExpression: keyConditionExpression
        }

        const expected = JSON.stringify({
          statusCode: 400,
          errorMessage: 'keyConditionExpression attribute must have at least one character in query methods.',
          inputData: dbParams.keyConditionExpression
        });

        const received = await dbGateway(docClient, method, tableName, dbParams).catch(received => received);
        expect(JSON.parse(received)).toEqual(JSON.parse(expected))
      }
    })

    test('should return an error object when expressionAttributeValues is not an object', async () => {
      const method = 'query';
      const tableName = 'tableName';
      const expressionAttributeValuesList = [1, true, '', [], () => { }, undefined, null];

      for (let expressionAttributeValues of expressionAttributeValuesList) {
        const dbParams = {
          body: {},
          path: {},
          header: {},
          keyConditionExpression: 'keyConditionExpression',
          expressionAttributeValues: expressionAttributeValues
        }

        const expected = JSON.stringify({
          statusCode: 400,
          errorMessage: 'expressionAttributeValues attribute must be an object in query methods.',
          inputData: dbParams.expressionAttributeValues
        });

        const received = await dbGateway(docClient, method, tableName, dbParams).catch(received => received);
        expect(JSON.parse(received)).toEqual(JSON.parse(expected))
      }
    })

    test('should return an error object when expressionAttributeValues is an empty object', async () => {
      const method = 'query';
      const tableName = 'tableName';
      const expressionAttributeValues = {};

      const dbParams = {
        body: {},
        path: {},
        header: {},
        keyConditionExpression: 'keyConditionExpression',
        expressionAttributeValues: expressionAttributeValues
      }

      const expected = JSON.stringify({
        statusCode: 400,
        errorMessage: 'expressionAttributeValues attribute must not be an empty object in query methods.',
        inputData: dbParams.expressionAttributeValues
      });

      const received = await dbGateway(docClient, method, tableName, dbParams).catch(received => received);
      expect(JSON.parse(received)).toEqual(JSON.parse(expected))
    })
  })

  describe('\n SCAN', () => {
    test('should return a successful object when all input are valid', async () => {
      const method = 'scan';
      const tableName = 'tableName';
      const dbParams = {
        filterExpression: 'filterExpression',
        expressionAttributeValues: { id: 'id' }
      }

      const expected = {
        statusCode: 200,
        items: [{ id: 'id', historic: [{ changedBy: 'changedBy' }] }],
        count: 1,
        scannedCount: 1
      }

      const received = await dbGateway(docClient, method, tableName, dbParams).catch(received => received)
      expect(received.items[0].id).toEqual(expected.items[0].id)
      expect(received.items[0].historic[0].changedBy).toEqual(expected.items[0].historic[0].changedBy)
    })

    test('should return an error object when filterExpression is not string', async () => {
      const method = 'scan';
      const tableName = 'tableName';
      const filterExpressionList = [1, true, {}, [], () => { }, undefined, null];

      for (let filterExpression of filterExpressionList) {
        const dbParams = {
          body: {},
          path: {},
          header: {},
          filterExpression: filterExpression
        }

        const expected = JSON.stringify({
          statusCode: 400,
          errorMessage: 'filterExpression attribute must be a string in scan methods.',
          inputData: dbParams.filterExpression
        });

        const received = await dbGateway(docClient, method, tableName, dbParams).catch(received => received);
        expect(JSON.parse(received)).toEqual(JSON.parse(expected))
      }
    })

    test('should return an error object when expressionAttributeValues is not an object', async () => {
      const method = 'scan';
      const tableName = 'tableName';
      const expressionAttributeValuesList = [1, true, '', [], () => { }, undefined, null];

      for (let expressionAttributeValues of expressionAttributeValuesList) {
        const dbParams = {
          body: {},
          path: {},
          header: {},
          filterExpression: 'filterExpression',
          expressionAttributeValues: expressionAttributeValues
        }

        const expected = JSON.stringify({
          statusCode: 400,
          errorMessage: 'expressionAttributeValues attribute must be an object in scan methods.',
          inputData: dbParams.expressionAttributeValues
        });

        const received = await dbGateway(docClient, method, tableName, dbParams).catch(received => received);
        expect(JSON.parse(received)).toEqual(JSON.parse(expected))
      }
    })


    test('should return an error object when expressionAttributeValues is an empty object', async () => {
      const method = 'scan';
      const tableName = 'tableName';
      const expressionAttributeValues = {};

      const dbParams = {
        body: {},
        path: {},
        header: {},
        filterExpression: 'filterExpression',
        expressionAttributeValues: expressionAttributeValues
      }

      const expected = JSON.stringify({
        statusCode: 400,
        errorMessage: 'expressionAttributeValues attribute must not be an empty object in scan methods.',
        inputData: dbParams.expressionAttributeValues
      });

      const received = await dbGateway(docClient, method, tableName, dbParams).catch(received => received);
      expect(JSON.parse(received)).toEqual(JSON.parse(expected))
    })
  })

  describe('\n PUT', () => {
    test('should return a successful object when all input are valid', async () => {
      const method = 'put';
      const tableName = 'tableName';
      const dbParams = {
        body: { key: 'value' },
        path: { id: '1' },
        header: { changedBy: 'changedBy' }
      }

      const expected = {
        statusCode: 200,
      }

      const received = await dbGateway(docClient, method, tableName, dbParams).catch(received => received)
      expect(received).toEqual(expected)
    })
  })
})


