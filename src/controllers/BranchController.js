import Logger from "../util/logger.js";
import Validator from "../util/validator.js";

import MysqlService from "../services/MysqlService.js";

export default {
  /**
   * List of branches
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

    const { show, page } = req.query;

    let query = `
      SELECT
        *
      FROM branches
      WHERE deleted_at IS NULL
    `;

    MysqlService.paginate(query, "id", show, page)
      .then((response) => {
        res.status(200);

        let message = {
          endpoint: `${req.method} ${req.originalUrl} ${res.statusCode}`,
          branches: response,
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
