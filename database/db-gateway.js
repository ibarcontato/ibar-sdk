const { mergeObjects, throwErrorResponseModel } = require('../index').utils;
const { isObject, isEmptyObject, isClassOf } = require('../index').validations;
const { SuccessResponseModel } = require('../index').models;


const dbGateway = function dbGateway(docClient, tableName) {
  const _dbGatewayInputValidation = () => {
    if (!isClassOf(docClient, 'DocumentClient'))
      throwErrorResponseModel(docClient, '"docClient" should be a DocumentClient');

    if (typeof tableName != 'string')
      throwErrorResponseModel(tableName, '"tableName" should be string');
  }

  const _doRequest = async function (method, dbParams) {
    dbParams.TableName = tableName;
    const result = await docClient[method](dbParams).promise().catch(result => result)

    if (result.message || result.Payload && result.Payload.errorMessage)
      throwErrorResponseModel(result, result.message, result.statusCode);

    return new SuccessResponseModel({
      item: result.Item,
      items: result.Items,
      count: result.Count,
      scannedCount: result.ScannedCount,
      statusCode: 200
    });
  }

  const _getUpdatedHistoric = function (actualItem, changedBy) {
    if (!isObject(actualItem))
      throwErrorResponseModel(actualItem, '"actualItem" should be an object.')

    if (isEmptyObject(actualItem))
      throwErrorResponseModel(actualItem, '"actualItem" should not be an empty object.')

    if (typeof changedBy != 'string')
      throwErrorResponseModel(changedBy, '"changedBy" should be a string.');

    const actualHistoricList = actualItem.historic == undefined ? [] : Object.assign([], actualItem.historic);
    actualItem.historic = undefined;
    const newHistoricItem = {
      changedWhen: `${new Date()}`,
      changedBy: changedBy,
      item: Object.assign({}, actualItem)
    }

    actualHistoricList.push(newHistoricItem);
    return actualHistoricList;
  }

  const get = async function ({ keys, projectionExpression }) {
    _dbGatewayInputValidation();

    if (!isObject(keys))
      throwErrorResponseModel(keys, '"keys" should be an object.')

    if (isEmptyObject(keys))
      throwErrorResponseModel(keys, '"keys" should not be an empty object.')

    if (!(projectionExpression === undefined || typeof projectionExpression == 'string'))
      throwErrorResponseModel(projectionExpression, '"projectionExpression" should be a string or undefined');


    const dbParams = {
      Key: keys,
      ProjectionExpression: projectionExpression
    }

    return await _doRequest('get', dbParams);
  }

  const query = async function ({ keyConditionExpression, expressionAttributeValues, expressionAttributeNames, projectionExpression }) {
    _dbGatewayInputValidation();

    if (typeof keyConditionExpression != 'string')
      throwErrorResponseModel(keyConditionExpression, '"keyConditionExpression" should be a string.');

    if (!isObject(expressionAttributeValues))
      throwErrorResponseModel(expressionAttributeValues, '"expressionAttributeValues" should be an object.');

    if (isEmptyObject(expressionAttributeValues))
      throwErrorResponseModel(expressionAttributeValues, 'expressionAttributeValues should be an empty object.');

    if (!(projectionExpression === undefined || typeof projectionExpression == 'string'))
      throwErrorResponseModel(projectionExpression, '"projectionExpression" should be a string or undefined');

    if (!(expressionAttributeNames === undefined || isObject(expressionAttributeNames)))
      throwErrorResponseModel(expressionAttributeNames, '"expressionAttributeNames" should be an object or undefined');

    const dbParams = {
      ProjectionExpression: projectionExpression,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
    }

    return await _doRequest('query', dbParams);
  }

  const scan = async function ({ filterExpression, expressionAttributeValues, expressionAttributeNames, projectionExpression }) {
    _dbGatewayInputValidation();

    if (typeof filterExpression != 'string')
      throwErrorResponseModel(filterExpression, 'filterExpression attribute must be a string.');

    if (!isObject(expressionAttributeValues))
      throwErrorResponseModel(expressionAttributeValues, '"expressionAttributeValues" should be an object.');

    if (isEmptyObject(expressionAttributeValues))
      throwErrorResponseModel(expressionAttributeValues, 'expressionAttributeValues should be an empty object.');

    if (!(projectionExpression === undefined || typeof projectionExpression == 'string'))
      throwErrorResponseModel(projectionExpression, '"projectionExpression" should be a string or undefined');

    if (!(expressionAttributeNames === undefined || isObject(expressionAttributeNames)))
      throwErrorResponseModel(expressionAttributeNames, '"expressionAttributeNames" should be an object or undefined');

    const dbParams = {
      ProjectionExpression: projectionExpression,
      FilterExpression: filterExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
    }

    return await _doRequest('scan', dbParams);
  }

  const del = async function ({ keys }) {
    _dbGatewayInputValidation();

    if (!isObject(keys))
      throwErrorResponseModel(keys, '"keys" should be an object.')

    if (isEmptyObject(keys))
      throwErrorResponseModel(keys, '"keys" should not be an empty object.')

    const dbParams = {
      Key: keys
    }

    return await _doRequest('delete', dbParams);
  }


  const put = async function ({ updateObject, keys, changedBy }) {
    _dbGatewayInputValidation();

    if (!isObject(updateObject))
      throwErrorResponseModel(updateObject, '"updateObject" should be an object.')

    if (isEmptyObject(updateObject))
      throwErrorResponseModel(updateObject, '"updateObject" should not be an empty object.')

    let actualItem = await get({ keys });
    actualItem = actualItem.item;

    if (!isObject(actualItem))
      throwErrorResponseModel(actualItem, '"actualItem" should be an object.')

    const updatedHistoric = _getUpdatedHistoric(actualItem, changedBy);
    updateObject.historic = updatedHistoric;
    updateObject = mergeObjects(updateObject, keys);

    const item = mergeObjects(actualItem, updateObject);

    const dbParams = {
      Item: item
    }

    return await _doRequest('put', dbParams);
  }

  return { get, query, scan, del, put }

  // if (!(projectionExpression === undefined || typeof projectionExpression == 'string'))
  //   throwErrorResponseModel(projectionExpression, '"projectionExpression" should be string or undefined');

  // if (!(expressionAttributeNames === undefined || isObject(expressionAttributeNames)))
  //   throwErrorResponseModel(expressionAttributeNames, '"expressionAttributeNames" should be an object or undefined');

  // if (!(method == 'get' || method == 'put' || method == 'delete' || method == 'scan' || method == 'query'))
  //   throwErrorResponseModel(method, 'method attribute must be "get", "put", "delete", "query" or "scan".')

  // if ((method == 'get' || method == 'delete') && isEmptyObject(path))
  //   throwErrorResponseModel(path, '"path" should not be an empty object.')

  // if (method == 'query' && !(typeof keyConditionExpression == 'string' && keyConditionExpression.length != 0))
  //   throwErrorResponseModel(keyConditionExpression, 'keyConditionExpression attribute must have at least one character in query methods.');

  // if (method == 'query' && !isObject(expressionAttributeValues))
  //   throwErrorResponseModel(expressionAttributeValues, 'expressionAttributeValues attribute must be an object in query methods.');

  // if (method == 'query' && isEmptyObject(expressionAttributeValues))
  //   throwErrorResponseModel(expressionAttributeValues, 'expressionAttributeValues attribute must not be an empty object in query methods.');

  // if (method == 'scan' && typeof filterExpression != 'string')
  //   throwErrorResponseModel(filterExpression, 'filterExpression attribute must be a string in scan methods.');

  // if (method == 'scan' && !isObject(expressionAttributeValues))
  //   throwErrorResponseModel(expressionAttributeValues, 'expressionAttributeValues attribute must be an object in scan methods.');

  // if (method == 'scan' && isEmptyObject(expressionAttributeValues))
  //   throwErrorResponseModel(expressionAttributeValues, 'expressionAttributeValues attribute must not be an empty object in scan methods.');


  // let item;
  // if (method == 'put')
  //   item = await createItem(docClient, body, path, header, tableName);

  // const dbParams = {
  //   TableName: tableName,
  //   Key: path,
  //   Item: item,
  //   ProjectionExpression: projectionExpression,
  //   KeyConditionExpression: keyConditionExpression,
  //   ExpressionAttributeValues: expressionAttributeValues,
  //   ExpressionAttributeNames: expressionAttributeNames,
  //   FilterExpression: filterExpression,
  // error: error
  // }

  // const result = await docClient[method](dbParams).promise().catch(result => result)

  // // ==================================================
  // // VERIFICATING IF THE BELOW PART IS NECESSARY 27/06
  // // ==================================================
  // // if (result.Payload && typeof result.Payload == 'string')
  // //   result.Payload = JSON.parse(result.Payload);

  // if (result.message || result.Payload && result.Payload.errorMessage)
  //   throwErrorResponseModel(result, result.message, result.statusCode);



  // return new SuccessResponseModel({
  //   item: result.Item,
  //   items: result.Items,
  //   count: result.Count,
  //   scannedCount: result.ScannedCount,
  //   statusCode: 200
  // });
};









module.exports = {
  dbGateway,
} 
