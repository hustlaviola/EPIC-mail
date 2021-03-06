import messages from '../models/messageModel';

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

    const id = messages.length > 0
      ? messages[messages.length - 1].id + 1 : 1;

    const createdOn = new Date();
    const parentMessageId = messages.length > 0
      ? messages[messages.length - 1].parentMessageId + 1 : 1;
    const status = 'sent';

    const mail = {
      id, createdOn, subject, message, parentMessageId, status,
    };

    messages.push(mail);
    return res.status(201).send({
      status: res.statusCode,
      data: mail,
    });
  }

  /**
  * @method getMessages
  * @description Retrieve all received messages
  * @static
  * @param {object} req - The request object
  * @param {object} res - The response object
  * @returns {object} JSON response
  * @memberof MessageController
  */
  static getMessages(req, res) {
    const receivedMessages = [];

    messages.forEach(message => {
      if (message.status === 'read' || message.status === 'unread') {
        receivedMessages.push(message);
      }
    });

    return res.status(200).send({
      status: res.statusCode,
      data: receivedMessages,
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
    const mails = [];
    const mailType = req.url.split('/')[2];

    messages.forEach(message => {
      if (message.status === mailType) {
        mails.push(message);
      }
    });

    return res.status(200).send({
      status: res.statusCode,
      data: mails,
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
    const mail = messages.find(message => message.id === parseInt(id, 10));

    return res.status(200).send({
      status: res.statusCode,
      data: mail,
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
    const mail = messages
      .find(message => message.id === parseInt(id, 10));

    const index = messages.indexOf(mail);

    messages.splice(index, 1);
    return res.status(200).send({
      status: res.statusCode,
      message: 'Message with the given id has been deleted',
    });
  }
}

export default MessageController;
