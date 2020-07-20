const docClientError = {
  message: 'docClientError',
  statusCode: 'docClientStatusCode',
  // others attrs
  // code:'ValidationException'
  // message:'Invalid KeyConditionExpression: Syntax error; token: "a", near: ":hashId a"'
  // name:'ValidationException'
  // requestId:'NK8J4FAAUENMV2VOMM6EBABCUFVV4KQNSO5AEMVJF66Q9ASUAAJG'
  // retryable:false
  // retryDelay:4.175250376597949
  // stack:'ValidationException: Invalid KeyConditionExpression: Syntax error; token: "a", near: ":hashId a"\n    at Request.extractError (c:\Projects\iBar\ibar-backend\ibar-sdk\node_modules\aws-sdk\lib\protocol\json.js:51:27)\n    at Request.callListeners (c:\Projects\iBar\ibar-backend\ibar-sdk\node_modules\aws-sdk\lib\sequential_executor.js:106:20)\n    at Request.emit (c:\Projects\iBar\ibar-backend\ibar-sdk\node_modules\aws-sdk\lib\sequential_executor.js:78:10)\n    at Request.emit (c:\Projects\iBar\ibar-ba…d\ibar-sdk\node_modules\aws-sdk\lib\state_machine.js:14:12)\n    at c:\Projects\iBar\ibar-backend\ibar-sdk\node_modules\aws-sdk\lib\state_machine.js:26:10\n    at Request.<anonymous> (c:\Projects\iBar\ibar-backend\ibar-sdk\node_modules\aws-sdk\lib\request.js:38:9)\n    at Request.<anonymous> (c:\Projects\iBar\ibar-backend\ibar-sdk\node_modules\aws-sdk\lib\request.js:690:12)\n    at Request.callListeners (c:\Projects\iBar\ibar-backend\ibar-sdk\node_modules\aws-sdk\lib\sequential_executor.js:116:18)'
  // statusCode:400
  // time:Mon Jun 29 2020 08:47:14 GMT-030
};


module.exports = class DocumentClient {
  constructor(isError) {
    this.isError = isError;
  }

  get(dbParams) {
    return { 
      promise: () => {
        const item = { id: 'id', historic: [{ changedBy: 'changedBy' }] };
        const returnedItem = dbParams && dbParams.Key && dbParams.Key.id == 'id' ? item : undefined;
        return this.isError
          ? Promise.reject(docClientError)
          : Promise.resolve({ Item: returnedItem })
      }

    }
  }

  query(dbParams) {
    const item = { id: 'id', historic: [{ changedBy: 'changedBy' }] };
    const returnedItem = dbParams && dbParams.ExpressionAttributeValues && dbParams.ExpressionAttributeValues.id == 'id' ? item : {};
    return {
      promise: () => this.isError
        ? Promise.reject(docClientError)
        : Promise.resolve({ Items: [returnedItem], Count: 1, ScannedCount: 1 })
    }
  }

  scan(dbParams) {
    const item = { id: 'id', historic: [{ changedBy: 'changedBy' }] };
    const returnedItem = dbParams && dbParams.ExpressionAttributeValues && dbParams.ExpressionAttributeValues.id == 'id' ? item : {};
    return {
      promise: () => this.isError
        ? Promise.reject(docClientError)
        : Promise.resolve({ Items: [returnedItem], Count: 1, ScannedCount: 1 })
    }
  };

  put(dbParams) {
    return {
      promise: () => this.isError ? Promise.reject(docClientError) : Promise.resolve({})
    }
  }

  post(dbParams) {
    return {
      promise: () => this.isError ? Promise.reject(docClientError) : Promise.resolve({})
    }
  }

  delete(dbParams) {
    return {
      promise: () => this.isError ? Promise.reject(docClientError) : Promise.resolve({})
    }
  }
};