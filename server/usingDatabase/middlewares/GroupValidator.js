import ErrorHandler from '../../utils/ErrorHandler';
import Helper from '../../utils/Helper';
import pool from '../models/database';

/**
 * @class GroupValidator
 * @description Validates Group endpoint details
 * @exports GroupValidator
 */
class GroupValidator {
  /**
  * @method validateCreateGroup
  * @description Check if create-group details are valid
  * @static
  * @param {object} req - The request object
  * @param {object} res - The response object
  * @param {object} next
  * @returns {object} next
  * @memberof GroupValidator
  */
  static validateGroupName(req, res, next) {
    const regEx = Helper.regEx();
    let { name } = req.body;

    if (!name) {
      return ErrorHandler.validationError(res, 400,
        'Group must have a name');
    }

    name = name.trim();

    if (name.length > 50 || name.length < 3) {
      return ErrorHandler.validationError(res, 400,
        `name contains ${name.length} characters, must be between 3 and 50`);
    }

    if (!regEx.groupname.test(name)) {
      return ErrorHandler.validationError(res, 400,
        'Invalid input! name can only contain alphabets, underscores and digits');
    }
    return next();
  }

  /**
  * @method validateExistingGroup
  * @description Check if id is in valid format and if a group already exists
  * @static
  * @param {object} req - The request object
  * @param {object} res - The response object
  * @param {object} next
  * @returns {object} next
  * @memberof GroupValidator
  */
  static validateExistingGroup(req, res, next) {
    const regEx = Helper.regEx();
    const { id } = req.params;

    if (!regEx.id.test(id) || (id === '0')) {
      return ErrorHandler.validationError(res, 400, 'The given id is invalid');
    }

    const query = 'SELECT * FROM groups WHERE id = $1';

    pool.query(query, [id], (err, data) => {
      if (err) {
        return ErrorHandler.databaseError(res);
      }
      if (data.rowCount < 1) {
        return ErrorHandler.validationError(res, 404, 'Group does not exist');
      }
      return next();
    });
  }

  /**
  * @method validateMember
  * @description Check if user is a member of the group
  * @static
  * @param {object} req - The request object
  * @param {object} res - The response object
  * @param {object} next
  * @returns {object} next
  * @memberof GroupValidator
  */
  static validateMember(req, res, next) {
    const { id } = req.params;
    const memberId = req.user.id;
    const values = [id, memberId];
    const query = `SELECT * FROM groups, group_members WHERE groups.id = $1 
      AND group_members.member_id = $2 AND groups.id = group_members.group_id`;

    pool.query(query, values, (err, data) => {
      if (err) {
        return ErrorHandler.databaseError(res);
      }
      if (data.rowCount < 1) {
        return ErrorHandler.validationError(res, 404, 'You do not belong to this group');
      }
      return next();
    });
  }

  /**
  * @method validateAdmin
  * @description Check if user is a group admin
  * @static
  * @param {object} req - The request object
  * @param {object} res - The response object
  * @param {object} next
  * @returns {object} next
  * @memberof GroupValidator
  */
  static validateAdmin(req, res, next) {
    const { id } = req.params;
    const memberId = req.user.id;
    const values = ['admin', memberId, id];
    const query = `SELECT * FROM group_members WHERE role = $1
      AND member_id = $2 AND group_id = $3`;

    pool.query(query, values, (err, data) => {
      if (err) {
        return ErrorHandler.databaseError(res);
      }
      if (data.rowCount < 1) {
        return ErrorHandler.validationError(res, 401, 'Require Admin access');
      }
      return next();
    });
  }

  /**
  * @method validateExistingUser
  * @description Check if user exist
  * @static
  * @param {object} req - The request object
  * @param {object} res - The response object
  * @param {object} next
  * @returns {object} next
  * @memberof GroupValidator
  */
  static validateExistingUser(req, res, next) {
    const { user } = req.body;
    const query = 'SELECT * FROM users WHERE id = $1';

    pool.query(query, [user], (err, data) => {
      if (err) {
        return ErrorHandler.databaseError(res);
      }
      if (data.rowCount < 1) {
        return ErrorHandler.validationError(res, 404, 'User does not exist');
      }
      return next();
    });
  }

  /**
  * @method validateExistingMember
  * @description Check if user to be added is already a member of the group
  * @static
  * @param {object} req - The request object
  * @param {object} res - The response object
  * @param {object} next
  * @returns {object} next
  * @memberof GroupValidator
  */
  static validateExistingMember(req, res, next) {
    const { id } = req.params;
    const { user } = req.body;
    const values = [id, user];
    const query = 'SELECT * FROM group_members WHERE group_id = $1 and member_id = $2';

    pool.query(query, values, (err, data) => {
      if (err) {
        return ErrorHandler.databaseError(res);
      }
      if (data.rowCount >= 1) {
        return ErrorHandler.validationError(res, 409, 'User is already a member of this group');
      }
      return next();
    });
  }
}

export default GroupValidator;
