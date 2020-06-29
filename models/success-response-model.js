module.exports= class SuccessResponseModel {
  constructor({item, items, count, scannedCount, statusCode}) {
    this.statusCode = statusCode;
    this.item = item;
    this.items = items;
    this.count = count;
    this.scannedCount = scannedCount
  }
}   