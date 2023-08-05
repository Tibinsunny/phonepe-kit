const crypto = require("crypto");
/**
 * Asynchronously generates a random transaction ID as a hexadecimal string.
 *
 * @async
 * @function
 * @returns {Promise<string>} A Promise that resolves to the generated transaction ID.
 */
const key_gen = () => {
  return new Promise((resolve, reject) => {
    let generate_tnx_id = crypto.randomBytes(8, function (err, buffer) {
      var token = buffer.toString("hex");
      resolve(token);
    });
  });
};

module.exports = key_gen;
