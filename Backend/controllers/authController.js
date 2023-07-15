import { sqlConfig, config } from "../utils/db.js";
import bcrypt from "bcrypt";
import mssql from "mssql";
import Jwt from "jsonwebtoken";
import apiJSON from "../utils/apiJson.js";
import removePassword from "../utils/removePassword.js";
import { v4 as uuidv4 } from "uuid";

export const authLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const pool = await mssql.connect(sqlConfig);
    const request = await pool
      .request()
      .input("email", mssql.VarChar, email)
      .input("password", mssql.VarChar, password)
      .query("SELECT * FROM socialClout.users WHERE email = @email");
    const results = await removePassword(request.recordset);
    if (results.length === 0) {
      res.status(401).json(apiJSON({}, "Login failed", 401));
    } else {
      if (bcrypt.compareSync(password, request.recordset[0].password)) {
        const token = Jwt.sign(results[0], config.jwt_secret, {
          expiresIn: "7h",
        });
        res
          .status(200)
          .json(apiJSON({ token: `Bearer ${token}` }, "Login successful", 200));
      }
    }
  } catch (err) {
    res.status(500).json(apiJSON({}, err, 500));
  } finally {
    mssql.close();
  }
};
//

export const authRegister = async (req, res) => {
  try {
    const { name, userName, email, password } = req.body;
    const pool = await mssql.connect(sqlConfig);
    const uuid = uuidv4();
    const hashedPassword = bcrypt.hashSync(password, 10);
    const createdAt = new Date();
    const updatedAt = new Date();
    const checkUser = await pool
      .request()
      .input("userName", mssql.VarChar, userName)
      .input("email", mssql.VarChar, email)
      .query(
        "SELECT * FROM socialClout.users WHERE userName = @userName OR email = @email"
      );

    if (checkUser.recordset.length > 0) {
      res.status(409).json(apiJSON({}, "User already exists", 409));
    } else {
      const request = await pool
        .request()
        .input("id", mssql.VarChar, uuid)
        .input("name", mssql.VarChar, name)
        .input("userName", mssql.VarChar, userName)
        .input("password", mssql.VarChar, hashedPassword)
        .input("email", mssql.VarChar, email)
        .input("joined", mssql.DateTime, createdAt)
        .input("createAt", mssql.DateTime, createdAt)
        .input("updatedAt", mssql.DateTime, updatedAt)
        .query(
          "INSERT INTO socialClout.users (id, name, userName, email, password, joined, createAt, updatedAt) VALUES (@id, @name, @userName, @email, @password, @joined, @createAt, @updatedAt)"
        );

      if (request.rowsAffected[0] === 0) {
        res.status(401).json(apiJSON({}, "Register failed", 401));
      } else {
        res.status(200).json(
          apiJSON(
            {
              id: uuid,
              name: name,
              userName: userName,
              email: email,
            },
            "Register successful",
            200
          )
        );
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(apiJSON({}, err.message, 500));
  } finally {
    mssql.close();
  }
};
