# PhonePe SDK - Easy PhonePe Payments Gateway Integration for Node.js

[![npm version](https://badge.fury.io/js/phonepe-kit.svg)](https://badge.fury.io/js/phonepe-kit)

## Overview

`phonepe-kit` is an easy-to-use npm package that simplifies the integration of the PhonePe Payments Gateway into your Node.js applications. With this package, you can quickly set up payment processing and generate PAY_PAGE links for seamless payment experiences.

## Installation

You can install the package using npm:

```bash
npm install phonepe-kit
```

## Usage

To get started with the PhonePe Payments Gateway integration, follow these steps:

1. Import the phonepe-kitpackage into your Node.js application:

```javascript
const PhonePe = require("phonepe-kit");
```

2. Create an instance of the PhonePe class by providing your merchant key, merchant ID, secret key and host url (test or production):

```javascript
const initilizePhonePe = new PhonePe(
  "MERCHANT_ID",
  "MERCHANT_USER_ID",
  "API_KEY",
  "API_KEY_INDEX",
  "HOST_URL"
);
```

3. Generate the PAY_PAGE link by providing the amount and calling the generatePaymentUrl() method:

```javascript
let transactionData = {
  amount: 100,
  transactionId: "ABCDEFG12345",
  callbackUrl: "https://example.com/callback-url",
  redirectUrl: "https://example.com/return-url",
  redirectMode: "GET",
  mobileNumber: "+91234567890",
  paymentInstrumentType: "PAY_PAGE",
};

initilizePhonePe.generatePaymentUrl(transactionData).then((data) => {
  //payment url will be in `data`
});

OR;

try {
  let data = await initilizePhonePe.generatePaymentUrl(transactionData);
  //payment url will be in `data`
} catch (error) {
  console.log(error);
}
```

Note: If `transactionId` is not passed it will be generated automatically.

### Parameters

    MERCHANT_ID: Your PhonePe Payments Gateway merchant key.
    MERCHANT_USER_ID: Your PhonePe Payments Gateway merchant ID.
    SECRET_SALT_KEY: Your secret key for secure communication with PhonePe.
    HOST_URL: The base url to interact with payment gateway APIs.
    callbackUrl: The URL to which PhonePe will send the payment response callback.

## Sample Code

```javascript
const PhonePe = require("phonepe-kit");

const initilizePhonePe = new PhonePe(
  "ABCDEF",
  "abcdef123",
  "12345-45679-sadfg-asdfgh",
  "1",
  "https://api-preprod.phonepe.com/apis/hermes"
);

let transactionData = {
  amount: 100,
  transactionId: "ABCDEFG12345",
  callbackUrl: "https://example.com/callback-url",
  redirectUrl: "https://example.com/return-url",
  redirectMode: "REDIRECT",
  mobileNumber: "+91234567890",
  paymentInstrumentType: "PAY_PAGE",
};

initilizePhonePe.generatePaymentUrl(transactionData).then((data) => {
  console.log(data);
});
```

## Response

The generate() method will return a promise that, when resolved, will provide you with the PAY_PAGE link. This link can be used to redirect users to the PhonePe payment page for completing the transaction.

# Support

If you encounter any issues or have questions regarding the package, please feel free to [create an issue](https://github.com/Tibinsunny/phonpe-sdk/issues).

## License

This package is open-source and available under the [MIT License](https://opensource.org/license/mit/).
