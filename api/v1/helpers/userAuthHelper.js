const promise = require("bluebird");
const dateHelper = require("../../utils/dateHelper");
const db = require("./../../utils/db");
const bcrypt = require("bcrypt");


class adminAuthHelper {



  async getPasswordHash(password) {
    return bcrypt.hash(password, 10);
  }

  async checkPassword(enteredPassword, storedPassword) {
    try {

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

  async signUp(body) {
    try {
      try {
        let data = {
          user_name: body.user_name,
          password: body.password,
          password: await this.getPasswordHash(body.password),
          role: body.role,
          qualification: body.qualification,
          city: body.city,
          phone_number: body.phone_number,
          created_date: `now()`,
          modified_date: `now()`,
        };
        let eventDetails = await db.insert("user_data", data);
        return eventDetails;
      } catch (error) {
        return promise.reject(error);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async isExists(body) {
    try {
      let selectParams = `user_name`;
      let where = `user_name = '${body.user_name}'`;
      let userDetails = await db.select("user_data", selectParams, where);

      if (userDetails.length !== 0) {
        throw "USER_WITH_USERNAME_ALREADY_EXISTS";
      } else {
        return userDetails[0];
      }
    } catch (error) {
      return promise.reject(error);
    }
  }

  async signin(user_id) {
    try {
      const where = ` user_id = ${user_id}`,
        params = {
          Is_login: 1,
        };
      await db.update(`user_data`, where, params);
      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findByUserName(user_name) {
    try {
      let selectParams = `*`;
      let where = `user_name = '${user_name}'`;
      let userDetails = await db.select("user_data", selectParams, where);
      return userDetails[0];
    } catch (error) {
      return promise.reject(error);
    }
  }

  async validatePassword(db_password, body_password) {
    try {
      if (db_password != body_password) {
        throw "INCORRECT_PASSWORD";
      }
      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getHome(user_id) {
    try {
      let selectParams = `user_name,qualification,city,phone_number,images`;
      let where = `user_id = ${user_id} AND is_login = 1`;
      let userDetails = await db.select("user_data", selectParams, where);

      if (userDetails.length > 0) {
        return userDetails[0];
      } else {
        throw "ACCOUNT_EXPIRED";
      }
    } catch (error) {
      return promise.reject(error);
    }
  }

  async uploadImage(user_id, image) {
    try {
      let where = `user_id = ${user_id}`;
      let data = {
        images: image ? image : null,
        modified_date: `now()`,
      };
      await db.update("user_data", where, data);
      return true;
    } catch (error) {
      return promise.reject(error);
    }
  }

  async getUser(user_id) {
    try {
      let selectParams = `role`;
      let where = `user_id = ${user_id}`;
      let userDetails = await db.select("user_data", selectParams, where);

      if (userDetails.role == 1) {
        throw "NOT_ADMIN";
      } else {
        return true;
      }
    } catch (error) {
      return promise.reject(error);
    }
  }

  async logOut(body) {
    try {
      const where = ` user_id = ${body.user_id}`,
        params = {
          Is_login: 0,
        };
      await db.update(`user_data`, where, params);
      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

module.exports = new adminAuthHelper();
