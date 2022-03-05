const promise = require("bluebird");
const jwt = require("jsonwebtoken");

const config = require("./config");

class CodeHelper {


  //Math.floor(Math.random()*90000) + 10000;

  getJwtToken(user_id, for_admin) {
    try {
      let expirationTime = 15 * 60,
        sign = {
          user_id: user_id,
        };
      if (for_admin) {
        sign.is_admin = true;
        expirationTime = 60 * 60 * 60;
      }
      let token = jwt.sign(sign, config.JWTSecretKey, {
        expiresIn: expirationTime,
      });
      return token;
    } catch (error) {
      return promise.reject(error);
    }
  }
 
 
  refreshToken(old_token, refresh_token, for_admin) {
    try {
      console.log("old_token ::: ", old_token);
      let token,
        decoded = jwt.decode(old_token);
      console.log("decoded ::: ", decoded);
      if (refresh_token == config.refresh_token && decoded) {
        token = this.getJwtToken(decoded.user_id, for_admin);
      } else {
        throw "TOKEN_MALFORMED";
      }
      return token;
    } catch (error) {
      return promise.reject(error);
    }
  }
  decodeToken(token) {
    try {
      return new promise((resolve, reject) => {
        jwt.verify(token, config.JWTSecretKey, async (error, decoded) => {
          if (error) {
            console.log(error);
            reject("TOKEN_EXPIRED");
          } else {
            resolve(decoded);
          }
        });
      });
    } catch (error) {
      return promise.reject(error);
    }
  }
  getDigitCode() {
    let date = new Date();
    let code = parseInt(date.getTime() / 1000).toString(16);
    return code;
  }
  getUniqueCode() {
    return String(Math.floor(Math.random() * 10000)).padEnd(4, 0);
  }
  validateRequestImage(req, name, type, min, max, isEssential) {
    return new promise((resolve, reject) => {
      if (Object.keys(req.files).length == 0) {
        resolve({ message: "IMAGE_NOT_FOUND" });
      }
      console.log("undefined==================", req.files.images);
      //console.log("\n\n\nreq.files.images ::: ", req.files.images.length);
      for (let i = 0; i < req.files.images.length; i++) {
        if (type) {
          let type = req.files.images[i].name.split(".").pop();
          let extensionArray = ["png", "jpg", "jpeg"];
          if (!extensionArray.includes(type.toString().toLowerCase())) {
            reject({ message: "WRONG_FILE_EXTENSION" });
          }
        }
        if (max) {
          //console.log(req.files.images[i].size);
          if (req.files.images[0].size > max) {
            // For icon only. And icon must be come in first in array at 0 index...
            reject({ message: "ICON_SIZE_LARGE" });
          }
        }
        if (req.files.images[i].size > 5000000) {
          // Byte to mb. Max 5 MB file size.
          reject({ message: "FILE_SIZE_LARGE" });
        }
        if (isEssential && Object.keys(req.files).length == 0) {
          reject({ message: "IMAGE_NOT_FOUND" });
        }
      }
      resolve({ message: "IMAGE_FOUND" });
    });
  }

  validateRequestImageFilter(
    req,
    name,
    type,
    min,
    max,
    isEssential,
    arrayName,
    demo_type
  ) {
    return new promise((resolve, reject) => {
      if (Object.keys(req.files).length == 0) {
        resolve({ message: "IMAGE_NOT_FOUND" });
      }
      console.log("req files", req.files);
      for (let i = 0; i < req.files.length; i++) {
        if (type) {
          let type = req.files[i].originalname.split(".").pop();
          let extensionArray;
          if (demo_type == 1) {
            extensionArray = ["png", "jpg", "jpeg"];
          } else {
            extensionArray = ["x-m4v", "mp4"];
          }
          if (!extensionArray.includes(type.toString().toLowerCase())) {
            reject({ message: "WRONG_FILE_EXTENSION" });
          }
        }
        if (max) {
          //console.log(req.files.images[i].size);
          if (req.files[0].size > max) {
            // For icon only. And icon must be come in first in array at 0 index...
            reject({ message: "ICON_SIZE_LARGE" });
          }
        }
        console.log("size================================", req.files[i].size);
        if (req.files[i].size > 5000000) {
          // Byte to mb. Max 5 MB file size.
          reject({ message: "FILE_SIZE_LARGE" });
        }
        if (isEssential && Object.keys(req.files).length == 0) {
          reject({ message: "IMAGE_NOT_FOUND" });
        }
      }
      resolve({ message: "IMAGE_FOUND" });
    });
  }
}

module.exports = new CodeHelper();
