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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

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
admin.get("/res/resources/:resource_slug", ResourceController.read);

admin.get("/res/resource-categories", ResourceCategoryController.list);
admin.post("/res/resource-categories", ResourceCategoryController.create);
admin.get("/res/resource-categories/:resource_category_id", ResourceCategoryController.read);
admin.put("/res/resource-categories/:resource_category_id", ResourceCategoryController.update);
admin.delete("/res/resource-categories/:resource_category_id", ResourceCategoryController.delete);

admin.get("/fn/resource-categories-all", ResourceCategoryController.all);

/**
 * Base routes
 */
app.get("/", Controller.base);
