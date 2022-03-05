const promise = require("bluebird");
const joi = require("joi");
const joiValidator = require("../../utils/joiValidator");

class userAUthValidator {
  async validatesignUp(body) {
    try {
      let schema = joi.object().keys({
        user_name: joi.string().required(),
        password: joi.string().required(),
        role: joi.number().required(),
        qualification: joi.string().required(),
        city: joi.string().required(),
        phone_number: joi.number().required(),
      });
      await joiValidator.validateJoiSchema(body, schema);
    } catch (error) {
      return promise.reject(error);
    }
  }

  async validatesignIn(body) {
    try {
      let schema = joi.object().keys({
        user_name: joi.string().required(),
        password: joi.string().required(),
      });
      await joiValidator.validateJoiSchema(body, schema);
    } catch (error) {
      return promise.reject(error);
    }
  }

  async validategetHome(body) {
    try {
      let schema = joi.object().keys({
        user_id: joi.required(),
      });
      await joiValidator.validateJoiSchema(body, schema);
    } catch (error) {
      return promise.reject(error);
    }
  }

  async validateImageUpload(body) {
    try {
      let schema = await joi.object().keys({
        image: joi.optional(),
      });
      await joiValidator.validateJoiSchema(body, schema);
    } catch (error) {
      return promise.reject(error);
    }
  }

  async validateLogout(body) {
    try {
      let schema = joi.object().keys({
        user_id: joi.required(),
      });
      await joiValidator.validateJoiSchema(body, schema);
    } catch (error) {
      return promise.reject(error);
    }
  }
}

module.exports = new userAUthValidator();
