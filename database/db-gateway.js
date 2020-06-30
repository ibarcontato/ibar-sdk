const { mergeObjects, throwErrorResponseModel } = require('../index').utils;
const { isObject, isEmptyObject, isClassOf } = require('../index').validations;
const { SuccessResponseModel } = require('../index').models;

const dbGateway = async function dbGateway(docClient, method, tableName,
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
) {

  if (!isClassOf(docClient, 'DocumentClient'))
    throwErrorResponseModel(docClient, '"docClient" should be a DocumentClient');

  if (!(projectionExpression === undefined || typeof projectionExpression == 'string'))
    throwErrorResponseModel(projectionExpression, '"projectionExpression" should be string or undefined');

  if (!(expressionAttributeNames === undefined || isObject(expressionAttributeNames)))
    throwErrorResponseModel(expressionAttributeNames, '"expressionAttributeNames" should be an object or undefined');

  if (!(method == 'get' || method == 'put' || method == 'delete' || method == 'scan' || method == 'query'))
    throwErrorResponseModel(method, 'method attribute must be "get", "put", "delete", "query" or "scan".')

  if ((method == 'get' || method == 'delete') && isEmptyObject(path))
    throwErrorResponseModel(path, '"path" should not be an empty object.')

  if (method == 'query' && !(typeof keyConditionExpression == 'string' && keyConditionExpression.length != 0))
    throwErrorResponseModel(keyConditionExpression, 'keyConditionExpression attribute must have at least one character in query methods.');

  if (method == 'query' && !isObject(expressionAttributeValues))
    throwErrorResponseModel(expressionAttributeValues, 'expressionAttributeValues attribute must be an object in query methods.');

  if (method == 'query' && isEmptyObject(expressionAttributeValues))
    throwErrorResponseModel(expressionAttributeValues, 'expressionAttributeValues attribute must not be an empty object in query methods.');

  if (method == 'scan' && typeof filterExpression != 'string')
    throwErrorResponseModel(filterExpression, 'filterExpression attribute must be a string in scan methods.');

  if (method == 'scan' && !isObject(expressionAttributeValues))
    throwErrorResponseModel(expressionAttributeValues, 'expressionAttributeValues attribute must be an object in scan methods.');

  if (method == 'scan' && isEmptyObject(expressionAttributeValues))
    throwErrorResponseModel(expressionAttributeValues, 'expressionAttributeValues attribute must not be an empty object in scan methods.');


  let item;
  if (method == 'put')
    item = await createItem(docClient, body, path, header, tableName);

  const dbParams = {
    TableName: tableName,
    Key: path,
    Item: item,
    ProjectionExpression: projectionExpression,
    KeyConditionExpression: keyConditionExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ExpressionAttributeNames: expressionAttributeNames,
    FilterExpression: filterExpression,
    // error: error
  }

  const result = await docClient[method](dbParams).promise().catch(result => result)

  // ==================================================
  // VERIFICATING IF THE BELOW PART IS NECESSARY 27/06
  // ==================================================
  // if (result.Payload && typeof result.Payload == 'string')
  //   result.Payload = JSON.parse(result.Payload);

  if (result.message || result.Payload && result.Payload.errorMessage)
    throwErrorResponseModel(result, result.message, result.statusCode);

  return new SuccessResponseModel({
    item: result.Item,
    items: result.Items,
    count: result.Count,
    scannedCount: result.ScannedCount,
    statusCode: 200
  });
};

const getActualItem = async function getActualItem(docClient, tableName, keys) {
  if (!isClassOf(docClient, 'DocumentClient'))
    throwErrorResponseModel(docClient, '"docClient" should be a DocumentClient');

  if (!isObject(keys))
    throwErrorResponseModel(keys, '"keys" should be an object');

  if (isEmptyObject(keys))
    throwErrorResponseModel(keys, '"keys" should not be empty');

  if (typeof tableName != 'string')
    throwErrorResponseModel(tableName, '"tableName" should be string');

  const result = await dbGateway(docClient, 'get', tableName, {
    path: keys
  })

  return result.item == undefined ? {} : result.item;
}

const createItem = async function createItem(docClient, body, path, header, tableName) {
  if (!isClassOf(docClient, 'DocumentClient'))
    throwErrorResponseModel(docClient, '"docClient" should be a DocumentClient');

  if (!isObject(body))
    throwErrorResponseModel(body, '"body" should be an object');

  if (isEmptyObject(body))
    throwErrorResponseModel(body, '"body" should not be empty');

  if (!isObject(path))
    throwErrorResponseModel(path, '"path" should be an object');

  if (!isObject(header))
    throwErrorResponseModel(header, '"header" should be an object');

  if (typeof header.changedBy != 'string')
    throwErrorResponseModel(header.changedBy, '"changedBy" should be string');

  if (typeof tableName != 'string')
    throwErrorResponseModel(tableName, '"tableName" should be string');

  let item = {};
  for (let bodyKey in body)
    item[bodyKey] = body[bodyKey];

  for (let pathKey in path)
    item[pathKey] = path[pathKey];

  if (isEmptyObject(item))
    throwErrorResponseModel(item, 'item should not be empty.')

  const changedBy = header.changedBy;

  const actualItem = await getActualItem(docClient, tableName, path);
  const actualHistoricList = actualItem.historic == undefined ? [] : Object.assign([], actualItem.historic);
  actualItem.historic = undefined;
  const newHistoricItem = {
    changedWhen: `${new Date()}`,
    changedBy: changedBy,
    item: Object.assign({}, actualItem)
  }

  actualHistoricList.push(newHistoricItem);
  actualItem.historic = actualHistoricList;

  const mergedObject = mergeObjects(actualItem, item);

  return mergedObject;
}







module.exports = {
  dbGateway,
  getActualItem,
  createItem
} 
