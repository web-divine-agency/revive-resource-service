import Logger from "../util/logger.js";
import Validator from "../util/validator.js";

import multerUpload from "../config/multer.js";

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
      Validator.required(req.query, "direction"),
      Validator.required(req.query, "last"),
      Validator.required(req.query, "show"),
    ]);

    if (!validation.pass) {
      let message = Logger.message(req, res, 422, "error", validation.result);
      Logger.error([JSON.stringify(message)]);
      return res.json(message);
    }

    const { category_id, last, show } = req.query;

    let find = req.query.find || "";
    let direction = req.query.direction === "next" ? "<" : ">";

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
        users.email,
        resources.created_at_order
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
      AND resources.created_at_order ${direction} ${last}
      ORDER BY resources.created_at_order DESC
      LIMIT ${show}
    `;

    MysqlService.select(query)
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
   * Create resource
   * @param {*} req
   * @param {*} res
   * @returns
   */
  create: (req, res) => {
    multerUpload.array("media[]")(req, res, async (error) => {
      if (error) {
        let message = Logger.message(req, res, 500, "error", error);
        Logger.error([JSON.stringify(message)]);
        return res.json(message);
      }

      let resources = await MysqlService.select(
        `SELECT id FROM resources WHERE slug = "${req.body.slug}"`
      );

      let validation = Validator.check([
        Validator.required(req.body, "user_id"),
        Validator.required(req.body, "category_id"),
        Validator.required(req.body, "title"),
        Validator.unique(req.body, resources, "slug"),
      ]);

      if (!validation.pass) {
        let message = Logger.message(req, res, 422, "error", validation.result);
        Logger.error([JSON.stringify(message)]);
        return res.json(message);
      }

      req.body.media = JSON.stringify(
        req.files.map((file) => ({
          filename: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          url: `/uploads/${encodeURI(file.originalname)}`,
        }))
      );

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
    });
  },

  read: (req, res) => {
    let validation = Validator.check([Validator.required(req.params, "resource_slug")]);

    if (!validation.pass) {
      let message = Logger.message(req, res, 422, "error", validation.result);
      Logger.error([JSON.stringify(message)]);
      return res.json(message);
    }

    const { resource_slug } = req.params;

    let query = `
      SELECT
        resources.id AS resource_id,
        resources.category_id,
        users.id AS user_id,
        resources.title,
        resources.slug,
        resources.body,
        resources.media,
        resources.additional_fields,
        resources.link,
        resources.status,
        users.first_name,
        users.last_name,
        users.email
      FROM resources
      INNER JOIN users ON resources.user_id = users.id
      WHERE resources.deleted_at IS NULL
      AND resources.slug = "${resource_slug}"
    `;

    MysqlService.select(query)
      .then((response) => {
        let message = Logger.message(req, res, 200, "resource", response[0]);
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
