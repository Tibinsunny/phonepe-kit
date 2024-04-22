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

2. Create an instance of the PhonePe class by providing your merchant key, merchant ID, callback URL, and secret key:

```javascript
const initilizePhonePe = new PhonePe(
  "YOUR_MERCHANT_ID",
  "YOUR_MERCHANT_USER_ID",
  "YOUR_CALLBACK_URL",
  "YOUR_SECRET_KEY"
);
```

3. Generate the PAY_PAGE link by providing the amount and calling the generate() method:

```javascript
let generate_data = {
  amount: 100,
  returnUrl: "https://example.com/return-url",
  mobileNumber: "+91234567890",
  redirectMode: "GET",
  paymentInstrumentType: "PAY_PAGE"
};

initilizePhonePe.generate(generate_data).then((data) => {
  console.log(data);
});
```

### Parameters

    YOUR_MERCHANT_ID: Your PhonePe Payments Gateway merchant key.
    YOUR_MERCHANT_USER_ID: Your PhonePe Payments Gateway merchant ID.
    YOUR_CALLBACK_URL: The URL to which PhonePe will send the payment response callback.
    YOUR_SECRET_SALT_KEY: Your secret key for secure communication with PhonePe.

## Sample Code

```javascript
const PhonePe = require("phonepe-kit");

const initilizePhonePe = new PhonePe(
  "PGTESTPAYUAT80",
  "YOUR_SECRET_SALT_KEY",
  "https://callbackurl.com",
  "YOUR_SECRET_SALT_KEY"
);

let generate_data = {
  amount: 100,
};

initilizePhonePe.generate(generate_data).then((data) => {
  console.log(data);
});
```

## Response

The generate() method will return a promise that, when resolved, will provide you with the PAY_PAGE link. This link can be used to redirect users to the PhonePe payment page for completing the transaction.

# Support

If you encounter any issues or have questions regarding the package, please feel free to [create an issue](https://github.com/Tibinsunny/phonpe-sdk/issues).

## License

This package is open-source and available under the [MIT License](https://opensource.org/license/mit/).
