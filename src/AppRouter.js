import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { app } from "./Server.js";

import { authAdmin, authenticated } from "./middleware/auth.js";

import Controller from "./controllers/Controller.js";
import ResourceController from "./controllers/ResourceController.js";
import ResourceCategoryController from "./controllers/ResourceCategoryController.js";

if (process.env.APP_ENV === "dev") {
  app.use(cors());
}

app.use(bodyParser.json());

const portal = express.Router();
const admin = express.Router();

/**
 * Portal routes
 */
app.use("/portal", portal);
portal.use(authenticated);

/**
 * Admin routes
 */
app.use("/admin", admin);
admin.use(authAdmin);
admin.get("/res/resources", ResourceController.list);
admin.post("/res/resources", ResourceController.create);

admin.get("/res/resource-categories", ResourceCategoryController.list);
admin.post("/res/resource-categories", ResourceCategoryController.create);

admin.get("/fn/resource-categories-all", ResourceCategoryController.all);

/**
 * Base routes
 */
app.get("/", Controller.base);
