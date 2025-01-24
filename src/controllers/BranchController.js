import Logger from "../util/logger.js";
import Validator from "../util/validator.js";

import MysqlService from "../services/MysqlService.js";

export default {
  /**
   * List of users
   * @param {*} req
   * @param {*} res
   * @returns
   */
  list: (req, res) => {
    let validation = Validator.check([
      Validator.required(req.query, "show"),
      Validator.required(req.query, "page"),
    ]);

    if (!validation.pass) {
      res.status(422);

      let message = {
        endpoint: `${req.method} ${req.originalUrl} ${res.statusCode}`,
        error: validation.result,
      };

      Logger.error([JSON.stringify(message)]);
      return res.json(message);
    }

    const { show, page, role } = req.query;

    let query = `
      SELECT
        users.id,
        users.first_name,
        users.last_name,
        users.username,
        users.gender,
        users.email,
        users.mobile,
        users.verified_at,
        users.created_at,
        users.created_at_order,
        users.updated_at,
        users.updated_at_order,
        roles.id as role_id,
        roles.name as role_name,
        roles.description as role_description
      FROM users
      INNER JOIN user_roles ON users.id = user_roles.user_id
      INNER JOIN roles ON user_roles.role_id = roles.id
      WHERE roles.name LIKE "%${role}%" 
      AND users.deleted_at IS NULL
    `;

    MysqlService.paginate(query, "users.id", show, page)
      .then((response) => {
        res.status(200);

        let message = {
          endpoint: `${req.method} ${req.originalUrl} ${res.statusCode}`,
          users: response,
        };

        Logger.out([JSON.stringify(message)]);
        return res.json(message);
      })
      .catch((error) => {
        res.status(500);

        let message = {
          endpoint: `${req.method} ${req.originalUrl} ${res.statusCode}`,
          error: error,
        };

        Logger.error([JSON.stringify(message)]);
        return res.json(message);
      });
  },

  /**
   * Create a user
   * @param {*} req
   * @param {*} res
   * @returns
   */
  create: (req, res) => {
    let validation = Validator.check([
      Validator.required(req.body, "name"),
      Validator.required(req.body, "zip_code"),
      Validator.required(req.body, "city"),
      Validator.required(req.body, "state"),
      Validator.required(req.body, "opening"),
      Validator.required(req.body, "closing"),
    ]);

    if (!validation.pass) {
      res.status(422);

      let message = {
        endpoint: `${req.method} ${req.originalUrl} ${res.statusCode}`,
        error: validation.result,
      };

      Logger.error([JSON.stringify(message)]);
      return res.json(message);
    }

    MysqlService.create("branches", req.body)
      .then((response) => {
        res.status(200);

        let message = {
          endpoint: `${req.method} ${req.originalUrl} ${res.statusCode}`,
          branch: response.insertId,
        };

        Logger.out([JSON.stringify(message)]);
        return res.json(message);
      })
      .catch((error) => {
        res.status(500);

        let message = {
          endpoint: `${req.method} ${req.originalUrl} ${res.statusCode}`,
          error: error,
        };

        Logger.error([JSON.stringify(message)]);
        return res.json(message);
      });
  },
};
