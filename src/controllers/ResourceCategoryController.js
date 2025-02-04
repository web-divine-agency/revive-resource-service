import Logger from "../util/logger.js";
import Validator from "../util/validator.js";

import MysqlService from "../services/MysqlService.js";

export default {
  /**
   * List all branches without pagination
   * @param {*} req
   * @param {*} res
   */
  all: (req, res) => {
    MysqlService.select(`SELECT * FROM branches WHERE deleted_at IS NULL`)
      .then((response) => {
        let message = Logger.message(req, res, 200, "branches", response);
        Logger.out([JSON.stringify(message)]);
        return res.json(message);
      })
      .catch((error) => {
        let message = Logger.message(req, res, 500, "error", error);
        Logger.error([JSON.stringify(message)]);
        return res.json(message);
      });
  },

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
      let message = Logger.message(req, res, 422, "error", validation.result);
      Logger.error([JSON.stringify(message)]);
      return res.json(message);
    }

    const { show, page } = req.query;
    let name = req.query.name || "";
    let find = req.query.find || "";
    let sort_by = req.query.sort_by || "name";

    let query = `
      SELECT
        *
      FROM branches
      WHERE deleted_at IS NULL
      AND name LIKE "%${name}%" 
      AND 
        (
          name LIKE "%${find}%" OR
          opening LIKE "%${find}%" OR
          closing LIKE "%${find}%" OR
          address_line_1 LIKE "%${find}%" OR
          address_line_2 LIKE "%${find}%" OR
          city LIKE "%${find}%" OR
          state LIKE "%${find}%"
        )
       ORDER BY ${sort_by} ASC
    `;

    MysqlService.paginate(query, "id", show, page)
      .then((response) => {
        let message = Logger.message(req, res, 200, "branches", response);
        Logger.out([JSON.stringify(message)]);
        return res.json(message);
      })
      .catch((error) => {
        let message = Logger.message(req, res, 500, "error", error);
        Logger.error([JSON.stringify(message)]);
        return res.json(message);
      });
  },

  /**
   * Create branch
   * @param {*} req
   * @param {*} res
   * @returns
   */
  create: (req, res) => {
    let validation = Validator.check([
      Validator.required(req.body, "name"),
    ]);

    if (!validation.pass) {
      let message = Logger.message(req, res, 422, "error", validation.result);
      Logger.error([JSON.stringify(message)]);
      return res.json(message);
    }

    MysqlService.create("resource_categories", req.body)
      .then((response) => {
        let message = Logger.message(req, res, 200, "resource_category", response.insertId);
        Logger.out([JSON.stringify(message)]);
        return res.json(message);
      })
      .catch((error) => {
        let message = Logger.message(req, res, 500, "error", error);
        Logger.error([JSON.stringify(message)]);
        return res.json(message);
      });
  },
};
