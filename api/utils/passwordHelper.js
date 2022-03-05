const bcrypt = require("bcrypt");
const promise = require("bluebird");
class PasswordHelper {
  async getPasswordHash(password) {
    return bcrypt.hash(password, 10);
  }

  async checkPassword(enteredPassword, storedPassword) {
    try {
      console.log("Entered Password :", enteredPassword);
      console.log("stored Password :", storedPassword);

      let compare = await bcrypt.compare(enteredPassword, storedPassword);

      if (compare) {
        return true;
      } else {
        throw "INCORRECT_PASSWORD";
      }
    } catch (error) {
      return promise.reject(error);
    }
  }
}

module.exports = new PasswordHelper();
