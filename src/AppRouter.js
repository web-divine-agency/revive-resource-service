import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

import { app } from "./Server.js";

import { authAdmin, authenticated } from "./middleware/auth.js";

import Controller from "./controllers/Controller.js";
import ResourceController from "./controllers/ResourceController.js";
import ResourceCategoryController from "./controllers/ResourceCategoryController.js";

const portal = express.Router();
const admin = express.Router();

// Get the parent folder path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.APP_ENV === "dev") {
  app.use(cors());
}

app.use(bodyParser.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/**
 * Portal routes
 */
app.use("/portal", portal);
portal.use(authenticated);

portal.get("/resources", ResourceController.list);
portal.get("/resources/:resource_slug", ResourceController.read);

portal.get("/resource-categories/all", ResourceCategoryController.all);

portal.get("/resource-categories", ResourceCategoryController.list);
portal.get("/resource-categories/:resource_category_id", ResourceCategoryController.read);

/**
 * Admin routes
 */
app.use("/admin", admin);
admin.use(authAdmin);
admin.post("/resources", ResourceController.create);

admin.post("/resource-categories", ResourceCategoryController.create);
admin.put("/resource-categories/:resource_category_id", ResourceCategoryController.update);
admin.delete("/resource-categories/:resource_category_id", ResourceCategoryController.delete);

/**
 * Base routes
 */
app.get("/", Controller.base);
