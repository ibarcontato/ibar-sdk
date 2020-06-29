module.exports = class ErrorResponseModel {
  constructor(inputData, errorMessage, statusCode = 400 ) {
    this.inputData = inputData;
    this.errorMessage = errorMessage;
    this.statusCode = statusCode;
  }
} 