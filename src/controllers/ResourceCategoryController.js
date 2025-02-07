import Logger from "../util/logger.js";
import Validator from "../util/validator.js";

import MysqlService from "../services/MysqlService.js";

export default {
  /**
   * List all resource categories without pagination
   * @param {*} req
   * @param {*} res
   */
  all: (req, res) => {
    MysqlService.select(`SELECT * FROM resource_categories WHERE deleted_at IS NULL`)
      .then((response) => {
        let message = Logger.message(req, res, 200, "resource_categories", response);
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
   * List resource categories
   * @param {*} req
   * @param {*} res
   * @returns
   */
  list: (req, res) => {
    let validation = Validator.check([
      Validator.required(req.query, "direction"),
      Validator.required(req.query, "last"),
      Validator.required(req.query, "show"),
    ]);

    if (!validation.pass) {
      let message = Logger.message(req, res, 422, "error", validation.result);
      Logger.error([JSON.stringify(message)]);
      return res.json(message);
    }

    const { last, show } = req.query;

    let find = req.query.find || "";
    let direction = req.query.direction === "next" ? "<" : ">";

    let query = `
      SELECT
        *
      FROM resource_categories
      WHERE deleted_at IS NULL
      AND 
      (
        name LIKE "%${find}%" OR
        description LIKE "%${find}%"
      )
      AND created_at_order ${direction} ${last}
      ORDER BY created_at_order DESC
      LIMIT ${show}
    `;

    MysqlService.select(query)
      .then((response) => {
        let message = Logger.message(req, res, 200, "resource_categories", response);
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
   * Create resource category
   * @param {*} req
   * @param {*} res
   * @returns
   */
  create: (req, res) => {
    let validation = Validator.check([Validator.required(req.body, "name")]);

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

  /**
   * Read resource category
   * @param {*} req
   * @param {*} res
   * @returns
   */
  read: (req, res) => {
    let validation = Validator.check([Validator.required(req.params, "resource_category_id")]);

    if (!validation.pass) {
      let message = Logger.message(req, res, 422, "error", validation.result);
      Logger.error([JSON.stringify(message)]);
      return res.json(message);
    }

    const { resource_category_id } = req.params;

    let query = `
      SELECT
        *
      FROM resource_categories
      WHERE deleted_at IS NULL
      AND id = ${resource_category_id}
    `;

    MysqlService.select(query)
      .then((response) => {
        let message = Logger.message(req, res, 200, "resource_category", response[0]);
        Logger.out([JSON.stringify(message)]);
        return res.json(message);
      })
      .catch((error) => {
        let message = Logger.message(req, res, 500, "error", error);
        Logger.error([JSON.stringify(message)]);
        return res.json(message);
      });
  },

  update: (req, res) => {
    let validation = Validator.check([
      Validator.required(req.params, "resource_category_id"),
      Validator.required(req.body, "name"),
    ]);

    if (!validation.pass) {
      let message = Logger.message(req, res, 422, "error", validation.result);
      Logger.error([JSON.stringify(message)]);
      return res.json(message);
    }

    const { resource_category_id } = req.params;
    const { name, description } = req.body;

    MysqlService.update(
      "resource_categories",
      { name: name, description: description },
      { id: resource_category_id }
    )
      .then(() => {
        let message = Logger.message(req, res, 200, "updated", true);
        Logger.error([JSON.stringify(message)]);
        return res.json(message);
      })
      .catch((error) => {
        let message = Logger.message(req, res, 500, "error", error);
        Logger.error([JSON.stringify(message)]);
        return res.json(message);
      });
  },

  /**
   * Delete resource category
   * @param {*} req
   * @param {*} res
   * @returns
   */
  delete: (req, res) => {
    let validation = Validator.check([Validator.required(req.params, "resource_category_id")]);

    if (!validation.pass) {
      let message = Logger.message(req, res, 422, "error", validation.result);
      Logger.error([JSON.stringify(message)]);
      return res.json(message);
    }

    const { resource_category_id } = req.params;

    MysqlService.delete("resource_categories", { id: resource_category_id })
      .then(() => {
        let message = Logger.message(req, res, 200, "deleted", true);
        Logger.out([JSON.stringify(message)]);
        return res.json(message);
      })
      .catch((error) => {
        let message = Logger.message(req, res, 200, "error", error);
        Logger.error([JSON.stringify(message)]);
        return res.json(message);
      });
  },
};
