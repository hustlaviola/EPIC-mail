import pool from '../models/database';
import ErrorHandler from '../../utils/ErrorHandler';

/**
 * @class MessageController
 * @description
 * @exports MessageController
 */
class MessageController {
  /**
  * @method postMessage
  * @description Create a new message
  * @static
  * @param {object} req - The request object
  * @param {object} res - The response object
  * @returns {object} JSON response
  * @memberof MessageController
  */
  static postMessage(req, res) {
    let { subject, message } = req.body;

    subject = subject.trim();
    message = message.trim();

    const createdOn = new Date();

    const values = [createdOn, subject, message];
    const query = `INSERT INTO messages(createdon, subject, message)
      VALUES($1, $2, $3) RETURNING *`;

    pool.query(query, values, (err, data) => {
      if (err) {
        return ErrorHandler.databaseError(res);
      }

      return res.status(201).send({
        status: res.statusCode,
        data: data.rows[0],
      });
    });
  }

  /**
  * @method postMessage
  * @description Create a new message
  * @static
  * @param {object} req - The request object
  * @param {object} res - The response object
  * @returns {object} JSON response
  * @memberof MessageController
  */
  static getMessages(req, res) {
    const values = ['read', 'unread'];
    const query = 'SELECT * FROM messages WHERE status = $1 OR status = $2';

    pool.query(query, values, (err, data) => {
      if (err) {
        return ErrorHandler.databaseError(res);
      }
      return res.status(200).send({
        status: res.statusCode,
        data: data.rows,
      });
    });
  }

  /**
  * @method getMails
  * @description Retrieve all sent or unread messages
  * @static
  * @param {object} req - The request object
  * @param {object} res - The response object
  * @returns {object} JSON response
  * @memberof MessageController
  */
  static getMails(req, res) {
    const mailType = req.url.split('/')[2];

    const value = [mailType];
    const query = 'SELECT * FROM messages WHERE status = $1';

    pool.query(query, value, (err, data) => {
      if (err) {
        return ErrorHandler.databaseError(res);
      }
      const mails = data.rows;
      return res.status(200).send({
        status: res.statusCode,
        data: mails,
      });
    });
  }

  /**
  * @method getMessage
  * @description Retrieve a specific message
  * @static
  * @param {object} req - The request object
  * @param {object} res - The response object
  * @returns {object} JSON response
  * @memberof MessageController
  */
  static getMessage(req, res) {
    const { id } = req.params;

    const query = 'SELECT * FROM messages WHERE id = $1';
    pool.query(query, [id], (err, data) => {
      if (err) {
        return ErrorHandler.databaseError(res);
      }

      return res.status(200).send({
        status: res.statusCode,
        data: data.rows,
      });
    });
  }

  /**
  * @method deleteMessage
  * @description Delete a specific messages
  * @static
  * @param {object} req - The request object
  * @param {object} res - The response object
  * @returns {object} JSON response
  * @memberof MessageController
  */
  static deleteMessage(req, res) {
    const { id } = req.params;

    const query = 'DELETE FROM messages WHERE id = $1';

    pool.query(query, [id], err => {
      if (err) {
        return ErrorHandler.databaseError(res);
      }

      res.status(200).send({
        status: res.statusCode,
        data: [{ message: 'Message record has been deleted' }],
      });
    });
  }
}

export default MessageController;