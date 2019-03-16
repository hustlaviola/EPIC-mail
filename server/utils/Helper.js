import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

/**
 * @class Helper
 * @description An helper class containing utility methods
 * @exports Helper
 */
class Helper {
  /**
   * @method generateToken
   * @description Generates token for securing endpoints
   * @static
   * @param {object} data - data object
   * @returns {object} JSON response
   * @memberof Helper
   */
  static generateToken(data) {
    const token = jwt.sign(data, 'secret', {
      expiresIn: '7d',
    });
    return token;
  }

  /**
   * @method hashPassword
   * @description Hash password before saving in database
   * @static
   * @param {string} password
   * @returns {string} string response
   * @memberof Helper
   */
  static hashPassword(password) {
    return bcrypt.hashSync(password, 10);
  }

  /**
   * @method verifyPassword
   * @description verify if given and database password match
   * @static
   * @param {string} password
   * @param {string} hashed
   * @returns {boolean} boolean response
   * @memberof Helper
   */
  static verifyPassword(password, hashed) {
    return bcrypt.compareSync(password, hashed);
  }

  /**
   * @method regEx
   * @description contain regular expressions for validating user input
   * @static
   * @returns {object} json response
   * @memberof Helper
   */
  static regEx() {
    return {
      id: /^[1-9](\d+)?$/,
      name: /^[a-zA-Z]{3,30}$/,
      groupname: /^[\w\s]+$/,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phonenumber: /^\+?[0-9]{11,14}$/,
    };
  }
}

export default Helper;
