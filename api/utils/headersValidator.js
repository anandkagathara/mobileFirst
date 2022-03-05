const jwt = require("jsonwebtoken");
const semver = require("semver");
const promise = require("bluebird");

const config = require("./config");
const db = require("./db");
const responseHelper = require("./responseHelper");

class HeaderValidator {
  validateHeaders(headers) {
    let error;
    if (!headers.auth_token) {
      error = { param: "auth_token", type: "required" };
    } else if (!headers.web_app_version) {
    }
    return error;
  }

  nonAuthValidation(req, res, next) {
    console.log("======BODY========");
    console.log(req.body);
    let error = HV.validateHeaders(req.headers);
    if (error) {
      responseHelper.error(res, error, req.headers.language);
    } else if (req.headers.auth_token !== config.default_auth_token) {
      responseHelper.error(res, "INVALID_TOKEN", req.headers.language);
    } else {
      next();
    }
  }

  authValidation(req, res, next) {
    console.log("======BODY========");
    let error = HV.validateHeaders(req.headers);
    if (error) {
      responseHelper.error(res, error, req.headers.language);
    } else {
      let token = req.headers.auth_token;
      console.log("======token========", token);
      jwt.verify(token, config.JWTSecretKey, (err, decoded) => {
        console.log("decoded ::: ", decoded);
        if (err) {
          console.log("error==============", err);
          if (req.route.path === "/refreshToken") {
            next();
          } else {
            if (err.toString().indexOf("JsonWebTokenError:") !== -1) {
              responseHelper.error(
                res,
                "TOKEN_MALFORMED",
                req.headers.language
              );
            } else {
              responseHelper.error(res, "TOKEN_EXPIRED", req.headers.language);
            }
          }
        } else if (decoded && decoded.user_id) {
          req.user_id = decoded.user_id;
          req.body.user_id = decoded.user_id;
          console.log(" req.body", req.body);
          if (decoded.is_admin) {
            delete req.body.user_id;
            req.is_admin = decoded.is_admin;
            next();
          } else {
            HV.isUserActive(req, res, next, decoded);
          }
        } else {
          responseHelper.error(res, "TOKEN_MALFORMED", req.headers.language);
        }
      });
    }
  }



  authValidation(req, res, next) {
    console.log("======BODY========");
    let error = HV.validateHeaders(req.headers);
    if (error) {
      responseHelper.error(res, error, req.headers.language);
    } else {
      let token = req.headers.auth_token;
      console.log("======token========", token);
      jwt.verify(token, config.JWTSecretKey, (err, decoded) => {
        console.log("decoded ::: ", decoded);
        if (err) {
          console.log("error==============", err);
          if (req.route.path === "/refreshToken") {
            next();
          } else {
            if (err.toString().indexOf("JsonWebTokenError:") !== -1) {
              responseHelper.error(
                res,
                "TOKEN_MALFORMED",
                req.headers.language
              );
            } else {
              responseHelper.error(res, "TOKEN_EXPIRED", req.headers.language);
            }
          }
        } else if (decoded && decoded.user_id) {
          req.user_id = decoded.user_id;
          req.body.user_id = decoded.user_id;
          console.log(" req.body", req.body);
          if (decoded.is_admin) {
            delete req.body.user_id;
            req.is_admin = decoded.is_admin;
            next();
          } else {
            HV.isUserActive(req, res, next, decoded);
          }
        } else {
          responseHelper.error(res, "TOKEN_MALFORMED", req.headers.language);
        }
      });
    }
  }

  async isUserActive(req, res, next, decoded) {
    let selectParams = "is_active",
      where = `user_id='${decoded.user_id}'`,
      user = "";
    user = await db.select("garage_user_account", selectParams, where);

    console.log(" user[0].is_active", user);

    if (user[0] && user[0].is_active == 1) {
      next();
    } else {
      responseHelper.error(res, "USER_BLOCKED", req.headers.language);
    }
  }

  adminAuthValidation(req, res, next) {
    console.log("======BODY========");
    let error = HV.validateHeaders(req.headers);
    if (error) {
      responseHelper.error(res, error, req.headers.language);
    } else {
      let token = req.headers.auth_token;
      console.log("======token========", token);
      jwt.verify(token, config.JWTSecretKey, (err, decoded) => {
        console.log("decoded ::: ", decoded);
        if (err) {
          console.log("error==============", err);
          responseHelper.error(res, "TOKEN_EXPIRED", req.headers.language);
        } else if (decoded && decoded.user_id) {
          req.is_admin = decoded.is_admin;
          next();
        } else {
          responseHelper.error(res, "TOKEN_MALFORMED", req.headers.language);
        }
      });
    }
  }

  isAdmin(req, res, next) {
    if (req.is_admin) {
      next();
    } else {
      responseHelper.error(res, "NOT_AUTHORISED", req.headers.language);
    }
  }
}

const HV = new HeaderValidator();
module.exports = HV;
