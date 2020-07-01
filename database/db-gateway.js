const { mergeObjects, throwErrorResponseModel } = require('../index').utils;
const { isObject, isEmptyObject, isClassOf } = require('../index').validations;
const { SuccessResponseModel } = require('../index').models;
const { throwIfIsNotObject, throwIfIsNotClassOf, throwIfIsNotString, throwIfIsEmptyObject } = require('../index').throws;


module.exports = function dbGateway(docClient, tableName) {
  const _dbGatewayInputValidation = () => {
    throwIfIsNotClassOf(docClient, 'DocumentClient', '"docClient" should be DocumentClient.')
    throwIfIsNotString(tableName, '"tableName" should be string.')
  }

  const _doRequest = async function (method, dbParams) {
    throwIfIsNotObject(dbParams, '"dbParams" should be object.')
    throwIfIsEmptyObject(dbParams, '"dbParams" should not be empty object.')

    if (!(method == 'get' || method == 'put' || method == 'delete' || method == 'scan' || method == 'query'))
      throwErrorResponseModel(method, '"method" should be "get", "put", "delete", "query" or "scan".')

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
    throwIfIsNotObject(actualItem, '"actualItem" should be object.')
    throwIfIsEmptyObject(actualItem, '"actualItem" should not be empty object.')
    throwIfIsNotString(changedBy, '"changedBy" should be string.');

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

    throwIfIsNotObject(keys, '"keys" should be object.')
    throwIfIsEmptyObject(keys, '"keys" should not be empty object.')

    if (!(projectionExpression === undefined || typeof projectionExpression == 'string'))
      throwErrorResponseModel(projectionExpression, '"projectionExpression" should be string or undefined');

    const dbParams = {
      Key: keys,
      ProjectionExpression: projectionExpression
    }

    return await _doRequest('get', dbParams);
  }

  const query = async function ({ keyConditionExpression, expressionAttributeValues, expressionAttributeNames, projectionExpression }) {
    _dbGatewayInputValidation();

    throwIfIsNotString(keyConditionExpression, '"keyConditionExpression" should be string.');
    throwIfIsNotObject(expressionAttributeValues, '"expressionAttributeValues" should be object.');
    throwIfIsEmptyObject(expressionAttributeValues, '"expressionAttributeValues" should not be empty object.');
    throwIfIsNotString(projectionExpression, '"projectionExpression" should be string or undefined.');
    throwIfIsNotObject(expressionAttributeNames, '"expressionAttributeNames" should be object or undefined.');
    throwIfIsEmptyObject(expressionAttributeNames, '"expressionAttributeNames" should not be empty object.');

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

    throwIfIsNotString(filterExpression, '"filterExpression" should be string.');
    throwIfIsNotObject(expressionAttributeValues, '"expressionAttributeValues" should be object.');
    throwIfIsEmptyObject(expressionAttributeValues, '"expressionAttributeValues" should not be empty object.');
    throwIfIsNotString(projectionExpression, '"projectionExpression" should be string or undefined.');
    throwIfIsNotObject(expressionAttributeNames, '"expressionAttributeNames" should be object or undefined.');
    throwIfIsEmptyObject(expressionAttributeNames, '"expressionAttributeNames" should not be empty object.');

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

    throwIfIsNotObject(keys, '"keys" should be object.')
    throwIfIsEmptyObject(keys, '"keys" should not be empty object.')

    const dbParams = {
      Key: keys
    }

    return await _doRequest('delete', dbParams);
  }


  const put = async function ({ updateObject, keys, changedBy }) {
    _dbGatewayInputValidation();

    throwIfIsNotObject(updateObject, '"updateObject" should be object.')
    throwIfIsEmptyObject(updateObject, '"updateObject" should not be empty object.')

    let actualItem = await get({ keys });
    actualItem = actualItem.item;
    throwIfIsNotObject(actualItem, '"actualItem" should be object.')

    const updatedHistoric = _getUpdatedHistoric(actualItem, changedBy);
    updateObject.historic = updatedHistoric;
    updateObject = mergeObjects(updateObject, keys);

    const item = mergeObjects(actualItem, updateObject);

    const dbParams = {
      Item: item
    }

    return await _doRequest('put', dbParams);
  }

  return { get, query, scan, del, put, _dbGatewayInputValidation, _doRequest, _getUpdatedHistoric }
};
