/**
 * A simple Express server that handles CORS, JSON parsing, and routing.
 * @module server
 */

import express from "express";
import cors from "cors";
import routes from "./routes/routes.js";
import { config } from "./utils/db.js";
import userAuthorized from "./utils/authMiddleware.js";
import http from "http";
import { Server } from "socket.io";
import chartMessage from "./controllers/chartMessageController.js";
import notificationHandler from "./controllers/notificationController.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  pingInterval: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

app.use(userAuthorized);
app.use(cors());
app.use(express.json());
app.use(routes);
chartMessage(io);
notificationHandler(io);

/**
 * A default handler that sends a greeting message.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 */
app.get("/", (req, res) => {
  res.send("Hello ");
});

/**
 * Starts the server on port 8085 and logs a message.
 */
server.listen(config.port | 8085, () => {
  console.log(`Server is running on ${config.url}`);
});
