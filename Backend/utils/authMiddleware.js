import Jwt from "jsonwebtoken";
import { config } from "./db.js";

const userAuthorized = async (req, res, next) => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    Jwt.verify(
      req.headers.authorization.split(" ")[1],
      config.jwt_secret,
      (err, decode) => {
        if (err) req.user = undefined;
        req.user = decode;
        next();
      }
    );
  } else {
    req.user = undefined;
    next();
  }
};
export default userAuthorized;

export const requireLogin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({ error: "unauthorized!" });
  } else {
    next();
  }
};
