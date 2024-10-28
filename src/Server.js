import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { createServer as createHttpServer } from "http";
import { createServer as createHttpsServer } from "https";
import { readFileSync } from "fs";

import Logger from "./util/logger.js";

const env = process.env.APP_ENV;
const appName = process.env.APP_NAME;

const app = express();

const path = {
  cert: env === "uat" ? readFileSync(process.env.CERT_PATH) : "",
  key: env === "uat" ? readFileSync(process.env.KEY_PATH) : "",
};

const port = {
  http: process.env.HTTP_PORT,
  https: process.env.HTTPS_PORT,
};

const options = {
  http: { port: port.http },
  https: {
    port: port.https,
    cert: path.cert,
    key: path.key,
  },
};

const acceptedDomains = [
  "user-service.skhillz.com"
]

const corsConfig = {
  optionsSuccessStatus: 200,
  origin: (origin, callback) => {
    const isOriginWhitelisted = origin && acceptedDomains.includes(origin);
    callback(null, isOriginWhitelisted);
  }
}

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

app.use(bodyParser.json());

const server = {
  http: createHttpServer(app),
  https: createHttpsServer(options.https, app),
};

server.http.listen(options.http.port, () => {
  Logger.out([`${appName} is listening on port ${options.http.port}`]);
});

server.https.listen(options.https.port, () => {
  Logger.out([`${appName} is listening on secured port ${options.https.port}`]);
});

export { app };
