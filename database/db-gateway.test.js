const { dbGateway, getActualItem } = require('./db-gateway');

const mockedDocumentClient = require('./doc-client-mock');
const docClient = new mockedDocumentClient();

describe('async function getActualItem(docClient, tableName, keys)', () => {
  test('should return an item object when all input are valid', async () => {
    const tableName = 'tableName';
    const keys = { id: 'id' };

    const expected = { id: 'id' }

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

describe(`async function dbGateway(docClient, method, tableName,
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

  describe('GET', () => {
    //ALL: should return an error object when method is not "get", "put", "delete", "query" or "scan"
    //ALL: should return an error object when "tableName" is not a string
    //ALL: should return an error object when "docClient" is not a DocumentClient
    //ALL: should return an error object when "projectionExpression" is not undefined neither string
    //ALL: should return an error object when "expressionAttributeNames" is not undefined neither string
    //ALL: should return an error object when "filterExpression" is not undefined neither string
    //ALL: should return an error object when "expressionAttributeNames" is not undefined but "expressionAttributeValues" is

    //GET: should return an error object when path is empty

    //DELETE: should return an error object when path is empty

    //QUERY: should return an error object when keyConditionExpression is not a string
    //QUERY: should return an error object when expressionAttributeValues is not an object
    //QUERY: should return an error object when expressionAttributeValues is an empty object

    //SCAN: should return an error object when filterExpression is not string
    //SCAN: should return an error object when expressionAttributeValues is not string
    //SCAN: should return an error object when expressionAttributeValues is not an object
    //SCAN: should return an error object when expressionAttributeValues is an empty object

    //PUT: should return an error object when body is not an object
    //PUT: should return an error object when body is an empty object
    //PUT: should return an error object when path is not an object
    //PUT: should return an error object when path has no "modifiedBy" attribute


    test('should return a successful object when all input are valid', async () => {
      const method = 'get';
      const tableName = 'tableName';
      const path = { id: 1 };
      const header = { userId: 'userId' }

      const dbParams = {
        body: {},
        path: { id: '1' },
        header: {}
      }

      const expected = {
        statusCode: 200,
        item: {}
      }

      const received = await dbGateway(docClient, method, tableName, dbParams).catch(() => fail())

      expect(received).toEqual(expected)


    })

    // test('should return a successful object when all input are valid', async () => {
    //   const method = 'get';
    //   const tableName = 'tableName';
    //   const path = { id: 1 };
    //   const header = { userId: 'userId' }

    //   const dbParams = {
    //     body: {},
    //     path: { id: '1' },
    //     header: {}
    //   }

    //   const expected = {
    //     statusCode: 200,
    //     item: {}
    //   }

    //   const received = await dbGateway(docClient, method, tableName, dbParams)
    //     .catch(received => { fail(); return received })

    //   expect(received).toEqual('expected')


    // })
  })

  //   test('should return a successful object when request is valid, object exists and Id = 2', async () => {
  //     const event = { 
  //       method: 'get',
  //       tableName: 'tableName',
  //       params: { path: { id: 2 }, header: { userId: 'userId' } }
  //     }

  //     const expected = {
  //       statusCode: 200,
  //       item: {
  //         id: 2,
  //         name: 'Test 2'
  //       }
  //     }
  //     const received = await handler(event);
  //     expect(received).toEqual(expected)
  //   })

  //   test('should return an empty object when request is valid and object does not exist', async () => {
  //     const event = {
  //       method: 'get',
  //       tableName: 'tableName',
  //       params: { path: { id: 3 }, header: { userId: 'userId' } }
  //     }

  //     const expected = {
  //       statusCode: 200,
  //     }
  //     const received = await handler(event);
  //     expect(received).toEqual(expected)
  //   })
  // })

  // describe('put method', () => {
  //   test('should return an empty object when request is valid', async () => {
  //     const event = {
  //       method: 'put',
  //       params: { path: { id: 1 }, header: { userId: 'userId' } },
  //       body: { userId: '123456' },
  //       tableName: 'tableName',
  //       Item: {}
  //     }

  //     const expected = {
  //       statusCode: 200,
  //     }
  //     const received = await handler(event);
  //     expect(received).toEqual(expected)
  //   })

  //   test('should return an empty object when request is valid and primary key already exists', async () => {
  //     const event = {
  //       method: 'put',
  //       params: { path: { id: 1 }, header: { userId: 'userId' } },
  //       body: { userId: '123456' },
  //       tableName: 'tableName',
  //       item: { some: {} }
  //     }

  //     const expected = {
  //       statusCode: 200,
  //     }

  //     const received = await handler(event);
  //     expect(received).toEqual(expected)
  //   })
  // })

  // describe('delete method', () => {
  //   test('should return an empty object when request is valid', async () => {
  //     const event = {
  //       method: 'delete',
  //       params: { path: { id: 23 }, header: { userId: 'userId' } },
  //       tableName: 'tableName',
  //     }

  //     const expected = {
  //       statusCode: 200
  //     }
  //     const received = await handler(event);
  //     expect(received).toEqual(expected)
  //   })

  //   test('should return an empty object when request is valid and primary key does not exist', async () => {
  //     const event = {
  //       method: 'delete',
  //       params: { path: { id: 23 }, header: { userId: 'userId' } },
  //       tableName: 'tableName',
  //     }

  //     const expected = {
  //       statusCode: 200
  //     }
  //     const received = await handler(event);
  //     expect(received).toEqual(expected)
  //   })
  // })

  // describe('query method', () => {
  //   test('should return an successful object when request is valid and Id = 1', async () => {
  //     const event = {
  //       method: 'query',
  //       params: { path: {}, header: { userId: 'userId' } },
  //       tableName: 'tableName',
  //       keyConditionExpression: 'Id = :id',
  //       expressionAttributeValues: {
  //         ':id': 1
  //       },
  //     }

  //     const expected = { items: [{ id: 1, name: 'Test 1' }], count: 1, scannedCount: 1, statusCode: 200 }
  //     const received = await handler(event);
  //     expect(received).toEqual(expected)
  //   })

  //   test('should return an successful object when request is valid and Id = 2', async () => {
  //     const event = {
  //       method: 'query',
  //       params: { path: {}, header: { userId: 'userId' } },
  //       tableName: 'tableName',
  //       keyConditionExpression: 'Id = :id',
  //       expressionAttributeValues: {
  //         ':id': 2
  //       },
  //     }

  //     const expected = {
  //       items: [{ id: 2, name: 'Test 2' }],
  //       count: 1,
  //       scannedCount: 1,
  //       statusCode: 200
  //     }
  //     const received = await handler(event);
  //     expect(received).toEqual(expected)
  //   })

  //   test('should return an success object when request is valid and primary key does not exist', async () => {
  //     const event = {
  //       method: 'query',
  //       params: { path: {}, header: { userId: 'userId' } },
  //       tableName: 'tableName',
  //       keyConditionExpression: 'Id = :id',
  //       expressionAttributeValues: {
  //         ':id': 3
  //       },
  //     }

  //     const expected = { items: [], count: 0, scannedCount: 0, statusCode: 200 }
  //     const received = await handler(event);
  //     expect(received).toEqual(expected)
  //   })
  // })

  // describe('scan method', () => {
  //   test('should return an successful object when request is valid', async () => {
  //     const event = {
  //       method: 'scan',
  //       tableName: 'tableName',
  //       params: { path: {}, header: { userId: 'userId' } },
  //     }

  //     const expected = {
  //       statusCode: 200,
  //       items: [
  //         { id: 1, name: 'Test 1' },
  //         { id: 2, name: 'Test 2' },
  //       ],
  //       count: 2,
  //       scannedCount: 2
  //     }
  //     const received = await handler(event);
  //     expect(received).toEqual(expected)
  //   })
  // })

  // describe('errors', () => {
  //   test('should return an error object when event.method is not "get", "put", "delete", "query" or "scan"', async () => {
  //     const methods = [1, 's', true, null, [], () => { }];

  //     for (let method of methods) {
  //       const event = {
  //         method: method,
  //         params: { path: {}, header: { userId: 'userId' } },
  //       }
  //       const expected = JSON.stringify({
  //         inputData: event,
  //         errorMessage: 'method attribute must be "get", "put", "delete", "query" or "scan".',
  //         statusCode: 400
  //       })

  //       try { await handler(event) } catch (received) { expect(received).toEqual(expected) }
  //     }
  //   })


  //   test('should return an error object when event.tableName is not typeof string', async () => {
  //     const tableNames = [1, true, null, [], () => { }, {}];

  //     for (let tableName of tableNames) {
  //       const event = {
  //         method: 'get',
  //         tableName: tableName,
  //         params: { path: {}, header: { userId: 'userId' } },
  //       }
  //       const expected = JSON.stringify({
  //         inputData: event,
  //         errorMessage: 'tableName attribute must be a string.',
  //         statusCode: 400
  //       })
  //       try { await handler(event) } catch (received) { expect(received).toEqual(expected) }
  //     }
  //   })


  //   test('should return an error object when event.item is not an empty object and method = put', async () => {
  //     const items = [1, true, null, [], () => { }, 's', undefined, {}];

  //     for (let item of items) {
  //       const event = {
  //         method: 'put',
  //         params: { path: {}, header: { userId: 'userId' } },
  //         tableName: 'tableName',
  //         item: item
  //       }
  //       const expected = JSON.stringify({
  //         inputData: event,
  //         errorMessage: 'item should not be empty.',
  //         statusCode: 400
  //       })
  //       try { await handler(event) } catch (received) { expect(received).toEqual(expected) }
  //     }
  //   })

  //   test('should return an error object when event.keyConditionExpression is not a zero length string in query methods', async () => {
  //     const keyConditionExpressions = [1, true, null, [], () => { }, '', {}];

  //     for (let keyConditionExpression of keyConditionExpressions) {
  //       const event = {
  //         method: 'query',
  //         params: { path: {}, header: { userId: 'userId' } },
  //         tableName: 'tableName',
  //         keyConditionExpression: keyConditionExpression,
  //         expressionAttributeValues: {},
  //       }
  //       const expected = JSON.stringify({
  //         inputData: event,
  //         errorMessage: 'keyConditionExpression attribute must have at least one character in put methods.',
  //         statusCode: 400
  //       })
  //       try { await handler(event) } catch (received) { expect(received).toEqual(expected) }
  //     }
  //   })

  //   test('should return an error object when event.expressionAttributeValues is not an object in query methods', async () => {
  //     const expressionAttributeValues = [1, true, null, [], () => { }, '', undefined];

  //     for (let expressionAttributeValue of expressionAttributeValues) {
  //       const event = {
  //         method: 'query',
  //         params: { path: {}, header: { userId: 'userId' } },
  //         tableName: 'tableName',
  //         expressionAttributeValues: expressionAttributeValue,
  //         ExpressionAttributeNames: {},
  //         keyConditionExpression: 's'
  //       }
  //       const expected = JSON.stringify({
  //         inputData: event,
  //         errorMessage: 'expressionAttributeValues attribute must be an object in query methods.',
  //         statusCode: 400
  //       })
  //       try { await handler(event) } catch (received) { expect(received).toEqual(expected) }
  //     }
  //   })

  //   // test.only('should return an error object when some goes wrong on the database', async () => {
  //   //   const event = {
  //   //     method: 'get',
  //   //     params: { path: { key: 'value' }, header: { userId: 'userId' } },
  //   //     error: true,
  //   //     tableName: 'tableName',
  //   //   }

  //   //   const expected = {
  //   //     inputData: event,
  //   //     errorMessage: 'errorMessage.',
  //   //     statusCode: 'statusCode'
  //   //   }
  //   //   const [_, received] = await handler(event);
  //   //   expect(received).toEqual(expected)
  //   //   // handler(event).then(() => fail()).catch(received => expect(received).toEqual(expected));
  //   // })

  // })

  // describe('createItem', () => {
  //   // test('should return an successful object when request is valid', async () => {
  //   //   const event = {
  //   //     method: 'scan',
  //   //     tableName: 'tableName',
  //   //     params: { path: {} },
  //   //   }

  //   //   const expected = {
  //   //     items: [
  //   //       { id: 1, name: 'Test 1' },
  //   //       { id: 2, name: 'Test 2' },
  //   //     ],
  //   //     count: 2,
  //   //     scannedCount: 2
  //   //   }
  //   //   const [_, received] = await handler(event);
  //   //   expect(received).toEqual(expected)
  //   // })
})


