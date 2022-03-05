const userAuthHelper = require("../helpers/userAuthHelper");
const userAuthValidator = require("../validators/userAuthValidator");
const responseHelper = require("./../../utils/responseHelper");
const codeHelper = require("./../../utils/codeHelper");

class userAuth {
  async signup(req, res) {
    try {
      await userAuthValidator.validatesignUp(req.body);
      await userAuthHelper.isExists(req.body);
      let user = await userAuthHelper.signUp(req.body);
      responseHelper.success(res, "SIGNUP_SUCCESS", req.headers.language, user);
    } catch (error) {
      console.log(error);
      responseHelper.error(res, error, req.headers.language);
    }
  }

  async signin(req, res) {
    try {
      await userAuthValidator.validatesignIn(req.body);
      let userFind = await userAuthHelper.findByUserName(req.body.user_name);
      await userAuthHelper.checkPassword(req.body.password,userFind.password)
     
      await userAuthHelper.signin(userFind.user_id);
      let token = await codeHelper.getJwtToken(userFind.user_id, true);
      responseHelper.success(
        res,
        "SIGNIN_SUCCESS",
        req.headers.language,
        token
      );
    } catch (error) {
      console.log(error);
      responseHelper.error(res, error, req.headers.language);
    }
  }

  async getHome(req, res) {
    try {
      let userFind = await userAuthHelper.getHome(req.user_id);
      responseHelper.success(res, "SUCCESS", req.headers.language, userFind);
    } catch (error) {
      console.log(error);
      responseHelper.error(res, error, req.headers.language);
    }
  }

  async uploadImage(req, res) {
    try {
      console.log("Req File :: ", req.file);
      if (req.file) {
        req.body.image = req.file.originalname;
      }
      await userAuthValidator.validateImageUpload(req.body);
      await userAuthHelper.getUser(req.user_id);
      let userFind = await userAuthHelper.uploadImage(
        req.user_id,
        req.body.image
      );
      responseHelper.success(res, "SUCCESS", req.headers.language, userFind);
    } catch (error) {
      console.log(error);
      responseHelper.error(res, error, req.headers.language);
    }
  }

  async logOut(req, res) {
    try {
      await userAuthValidator.validateLogout(req.body);
      console.log(req.body.user_id);
      let logOut = await userAuthHelper.logOut(req.body);
      responseHelper.success(res, "SUCCESS", req.headers.language, logOut);
    } catch (error) {
      console.log(error);
      responseHelper.error(res, error, req.headers.language);
    }
  }
}

module.exports = new userAuth();
