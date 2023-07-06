/**
 * A simple Express server that handles CORS, JSON parsing, and routing.
 * @module server
 */

import express from "express";
import cors from "cors";
import route from "./routes/routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(route);

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
app.listen(8085, () => {
  console.log("Server is running on port 3000 http://localhost:8085");
});
