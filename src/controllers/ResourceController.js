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
   * List resources
   * @param {*} req
   * @param {*} res
   * @returns
   */
  list: (req, res) => {
    let validation = Validator.check([
      Validator.required(req.query, "category_id"),
      Validator.required(req.query, "show"),
      Validator.required(req.query, "page"),
    ]);

    if (!validation.pass) {
      let message = Logger.message(req, res, 422, "error", validation.result);
      Logger.error([JSON.stringify(message)]);
      return res.json(message);
    }

    const { category_id, show, page } = req.query;
    let find = req.query.find || "";
    let sort_by = req.query.sort_by || "resources.created_at_order";

    let query = `
      SELECT
        resources.id AS resource_id,
        resources.category_id,
        users.id AS user_id,
        resources.title,
        resources.slug,
        resources.body,
        resources.additional_fields,
        resources.link,
        resources.status,
        users.first_name,
        users.last_name,
        users.email
      FROM resources
      INNER JOIN users ON resources.user_id = users.id
      WHERE resources.deleted_at IS NULL
      AND resources.category_id = ${category_id}
      AND 
        (
          resources.title LIKE "%${find}%" OR
          resources.status LIKE "%${find}%" OR
          users.first_name LIKE "%${find}%" OR
          users.last_name LIKE "%${find}%" OR
          users.email LIKE "%${find}%"
        )
       ORDER BY ${sort_by} ASC
    `;

    MysqlService.paginate(query, "resources.id", show, page)
      .then((response) => {
        let message = Logger.message(req, res, 200, "resources", response);
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
      Validator.required(req.body, "user_id"),
      Validator.required(req.body, "category_id"),
      Validator.required(req.body, "title"),
      Validator.required(req.body, "slug"),
    ]);

    if (!validation.pass) {
      let message = Logger.message(req, res, 422, "error", validation.result);
      Logger.error([JSON.stringify(message)]);
      return res.json(message);
    }

    MysqlService.create("resources", req.body)
      .then((response) => {
        let message = Logger.message(req, res, 200, "resource", response.insertId);
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
