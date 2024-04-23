//External Dependency
const sha256 = require("sha256");
const axios = require("axios");
const key_gen = require("./lib/keygen");
/**
 * Creates a new instance of the PhonePe integration.
 *
 * @constructor
 * @param {string} PHONEPE_MERCHANT_ID - The unique identifier of the merchant on PhonePe.
 * @param {string} PHONEPE_MERCHANT_USER_ID - The unique identifier of the merchant user on PhonePe.
 * @param {string} PHONEPE_API_KEY - The secret key used for secure communication with PhonePe APIs.
 * @param {string} PHONEPE_HOST_URL - The base url to interact with payment gateway APIs.
 */
class PhonePe {
  constructor(PHONEPE_MERCHANT_ID, PHONEPE_MERCHANT_USER_ID, PHONEPE_API_KEY, PHONEPE_API_KEY_INDEX, PHONEPE_HOST_URL) {
    this.merchantId = PHONEPE_MERCHANT_ID;
    this.merchantUserId = PHONEPE_MERCHANT_USER_ID;
    this.phonepeKey = PHONEPE_API_KEY;
    this.phonepeKeyIndex = PHONEPE_API_KEY_INDEX;
    this.phonepeHostUrl = PHONEPE_HOST_URL;
  }

  /**
   * Asynchronously generates a transaction ID and sets it to the instance.
   *
   * @async
   * @function
   * @param {string} transactionId - Optional. An existing transaction ID to be used. If not provided, a new transaction ID will be generated.
   * @returns {Promise<string>} The generated or existing transaction ID.
   */

  async generateTransactionId() {
    this.transactionId = await key_gen();
    return this.transactionId;
  }

  generateBase64(payload) {
    let base64 = Buffer.from(JSON.stringify(payload)).toString("base64");
    return base64;
  }

  generateSignature(base64, endPoint) {
    let preformatter = base64 + endPoint + this.phonepeKey;
    let hash = sha256(preformatter);
    let signature = hash + "###" + this.phonepeKeyIndex;
    return signature;
  }

  async sendRequest(headers, url, method, requestData) {
    return new Promise(async (resolve, reject) => {
      const options = {
        method: method,
        url: url,
        headers: headers,
        data: { request: requestData }
      };
      try {
        let { data } = await axios.request(options);
        resolve(data);
      } catch (error) {
        console.trace(`Request Failed with status ${error?.response?.data?.code}. Refer https://developer.phonepe.com/v1/reference`);
        reject(`${error?.response?.data?.code} - ${error?.response?.data?.message}`);
      }
    });
  }

  /**
   * Asynchronously generates transaction details based on the provided data and transaction ID.
   * The method must be called after initializing the instance and creating a transaction ID.
   *
   * @async
   * @function
   * @param {object} data - An object containing transaction data.
   * @param {number} data.amount - The amount associated with the transaction.
   * @throws {Error} If the transaction ID is not set, it will first attempt to create one.
   * @throws {Error} If the provided data is empty or missing the 'amount' field.
   * @returns {Promise<object>} An object containing the generated transaction details.
   */

  async generatePaymentUrl(data) {
    return new Promise(async (resolve, reject) => {
      if (!data) return reject("Transaction data cannot be empty");
      if (!data.amount) return reject("amount is required in payload");
      if (!data.callbackUrl) return reject("callbackUrl is required in payload");
      if (!data.redirectUrl) return reject("redirectUrl is required");
      if (!data.paymentInstrumentType) return reject("paymentInstrumentType is required");
      if (!this.merchantId) return reject("merchantId is required");
      if (!this.merchantUserId) return reject("merchantUserId is required");
      if (!this.phonepeKey) return reject("phonepeKey is required");
      if (!this.phonepeHostUrl) return reject("phonepeHostUrl is required");

      let payload = {
        merchantId: this.merchantId,
        merchantUserId: this.merchantUserId,
        callbackUrl: data.callbackUrl,
        amount: Number(data.amount) * 100,
        mobileNumber: data.mobileNumber,
        merchantTransactionId: data.transactionId ? data.transactionId : await this.generateTransactionId(),
        redirectUrl: data.redirectUrl,
        redirectMode: data.redirectMode ? data.redirectMode : "REDIRECT",
        paymentInstrument: {
          type: data.paymentInstrumentType ? data.paymentInstrumentType : "PAY_PAGE",
        },
      };
      let requestData = this.generateBase64(payload);
      let endPoint = "/pg/v1/pay";
      let signature = this.generateSignature(requestData, endPoint);
      let url = this.phonepeHostUrl + endPoint;
      let method = "POST";
      let headers = {
        "Content-Type": "application/json",
        "X-VERIFY": signature
      }
      try {
        let transaction_data = await this.sendRequest(headers, url, method, requestData);
        resolve(transaction_data);
      } catch (error) {
        reject(error)
      }
    });
  }

  async getTransactionStatus(data) {
    return new Promise(async (resolve, reject) => {
      if (!data) return reject("Transaction data cannot be empty");
      if (!data.transactionId) return reject("transactionId is required");
      if (!this.merchantId) return reject("merchantId is required");
      if (!this.merchantUserId) return reject("merchantUserId is required");
      if (!this.phonepeKey) return reject("phonepeKey is required");
      if (!this.phonepeHostUrl) return reject("phonepeHostUrl is required");

      let endPoint = `/pg/v1/status/${this.merchantId}/${data.transactionId}`;
      let signature = this.generateSignature("", endPoint);
      let url = this.phonepeHostUrl + endPoint;
      let method = "GET";
      let headers = {
        "Content-Type": "application/json",
        "X-VERIFY": signature,
        "X-MERCHANT-ID": this.merchantId
      }
      try {
        let transaction_data = await this.sendRequest(headers, url, method, null);
        resolve(transaction_data);
      } catch (error) {
        reject(error)
      }
    });
  }
}

module.exports = PhonePe;