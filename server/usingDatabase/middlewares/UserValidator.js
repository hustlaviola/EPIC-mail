import pool from '../models/database';
import Helper from '../../utils/Helper';
import ErrorHandler from '../../utils/ErrorHandler';

/**
 * @class UserValidator
 * @description A middleware class to validate signup and signin details
 * @exports UserValidator
 */
class UserValidator {
  /**
  * @method validateExistingUser
  * @description Check if credentials are already in the database
  * @static
  * @param {object} req - The request object
  * @param {object} res - The response object
  * @param {object} next
  * @returns {object} next
  * @memberof UserValidator
  */
  static validateExistingUser(req, res, next) {
    const { email, phonenumber } = req.body;
    const query = `SELECT email, phonenumber FROM users
      WHERE email = $1 OR phonenumber = $2`;
    pool.query(query, [email, phonenumber], (err, data) => {
      if (err) {
        return ErrorHandler.databaseError(res);
      }
      const result = data.rows[0];
      if (result) {
        let conflict;
        if (result.email === email) {
          conflict = 'email';
        } else if (result.phonenumber === phonenumber) {
          conflict = 'phone number';
        }
        return ErrorHandler.validationError(res, 409,
          `${conflict} already exists`);
      }
      return next();
    });
  }

  /**
  * @method validateSignUp
  * @description Check if sign up details are valid
  * @static
  * @param {object} req - The request object
  * @param {object} res - The response object
  * @param {object} next
  * @returns {object} next
  * @memberof UserValidator
  */
  static validateSignUp(req, res, next) {
    const regEx = Helper.regEx();
    const {
      email,
      firstname,
      lastname,
      password,
      confirmpassword,
      phonenumber,
    } = req.body;

    let errorMessage;

    if (!email) {
      errorMessage = 'email field cannot be empty';
    } else if (!regEx.email.test(email)) {
      errorMessage = 'Invalid email format';
    } else if (!firstname) {
      errorMessage = 'firstname field cannot be empty';
    } else if (!regEx.name.test(firstname)) {
      errorMessage = 'first name must be alphabets only between 3 and 30';
    } else if (!lastname) {
      errorMessage = 'lastname field cannot be empty';
    } else if (!regEx.name.test(lastname)) {
      errorMessage = 'last name must be alphabets only between 3 and 30';
    } else if (!password) {
      errorMessage = 'password field cannot be empty';
    } else if (password.length < 6) {
      errorMessage = 'password must be at least 6 characters';
    } else if (!confirmpassword) {
      errorMessage = 'confirm your password';
    } else if (password !== confirmpassword) {
      errorMessage = 'password does not match';
    } else if (!phonenumber) {
      errorMessage = 'phonenumber field cannot be empty';
    } else if (!regEx.phonenumber.test(phonenumber)) {
      errorMessage = 'Invalid phone number format';
    }
    if (errorMessage) {
      return ErrorHandler.validationError(res, 400, errorMessage);
    }
    return next();
  }

  /**
  * @method validateSignIn
  * @description Check if login credentials are valid
  * @static
  * @param {object} req - The request object
  * @param {object} res - The response object
  * @param {object} next
  * @returns {object} next
  * @memberof UserValidator
  */
  static validateSignIn(req, res, next) {
    const regEx = Helper.regEx();
    const { email, password } = req.body;

    let error;

    if (!email) {
      error = 'email field cannot be empty';
    } else if (!regEx.email.test(email)) {
      error = 'Invalid email format';
    } else if (!password) {
      error = 'password field cannot be empty';
    } else if (password.length < 6) {
      error = 'password must be at least 6 characters';
    }

    if (error) {
      return ErrorHandler.validationError(res, 400, error);
    }
    const query = 'SELECT * FROM users WHERE email = $1';
    const value = [email];
    pool.query(query, value, (err, data) => {
      if (err) {
        return ErrorHandler.databaseError(res);
      }
      const user = data.rows[0];
      if (!user) {
        return ErrorHandler.validationError(res, 404,
          'User does not exist');
      }
      if (!Helper.verifyPassword(password, user.password)) {
        return ErrorHandler.validationError(res, 400,
          'Password is incorrect');
      }
      return next();
    });
  }
}

export default UserValidator;