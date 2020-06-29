const  SuccessResponseModel = require('./success-response-model');

describe('constructor(payload, statusCode)', () => {
  test('should return a new model when request is valid', async () => {
    const statusCode = 'statusCode';
    const payload = {
      Item: 'item',
      Items: [],
      Count: 'count',
      ScannedCount: 'scannedCount'
    };

    const expected = {
      statusCode: 'statusCode',
      item: 'item',
      items: [],
      count: 'count',
      scannedCount: 'scannedCount'
    };

    const received = new SuccessResponseModel({
      item: payload.Item,
      items: payload.Items,
      count: payload.Count,
      scannedCount: payload.ScannedCount,
      statusCode: statusCode
    });
    expect(received).toEqual(expected);
  })
})  