// import the necessary modules
import { sqlConfig, config } from "../utils/db.js";
import bcrypt from "bcrypt";
import mssql from "mssql";
import Jwt from "jsonwebtoken";
import apiJSON from "../utils/apiJson.js";
import removePassword from "../utils/removePassword.js";
import { v4 as uuidv4 } from "uuid";

/**
 * A controller for getting all users
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const getUsers = async (req, res) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const request = await pool
      .request()
      .query("SELECT * FROM socialClout.users ORDER BY createAt ASC");
    const results = await removePassword(request.recordset);
    res.status(200).json(apiJSON(results, "Users fetched successfully", 200));
  } catch (err) {
    res.status(500).json(apiJSON({}, err, 500));
  } finally {
    mssql.close();
  }
};

/**
 * A controller for getting a single user by id
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await mssql.connect(sqlConfig);
    const request = await pool
      .request()
      .input("id", mssql.UniqueIdentifier, id)
      .query("SELECT * FROM socialClout.users WHERE id = @id");
    const results = await removePassword(request.recordset);
    if (results.length === 0) {
      res.status(404).json(apiJSON({}, "User not found", 404));
    } else {
      res
        .status(200)
        .json(apiJSON(results[0], "User fetched successfully", 200));
    }
  } catch (err) {
    res.status(500).json(apiJSON({}, err, 500));
  } finally {
    mssql.close();
  }
};

/**
 * A controller for creating a new user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const createUser = async (req, res) => {
  try {
    const {
      name,
      userName,
      email,
      password,
      profilePic,
      bannerPic,
      bio,
      location,
      website,
      joined,
    } = req.body;
    const id = uuidv4();
    const hashedPassword = bcrypt.hashSync(password, config.salt_rounds);
    const createAt = new Date();
    const updatedAt = new Date();
    const pool = await mssql.connect(sqlConfig);
    const request = await pool
      .request()
      .input("id", mssql.UniqueIdentifier, id)
      .input("name", mssql.VarChar, name)
      .input("userName", mssql.VarChar, userName)
      .input("email", mssql.VarChar, email)
      .input("password", mssql.VarChar, hashedPassword)
      .input("profilePic", mssql.VarChar, profilePic)
      .input("bio", mssql.VarChar, bio)
      .input("location", mssql.VarChar, location)
      .input("website", mssql.VarChar, website)
      .input("joined", mssql.VarChar, joined)
      .input("createAt", mssql.DateTime, createAt)
      .input("updatedAt", mssql.DateTime, updatedAt)
      .input("bannerPic", mssql.VarChar, bannerPic)
      .query(
        "INSERT INTO socialClout.users (id, name, userName, email, password, profilePic, bio, location, website, joined, createAt, updatedAt, bannerPic) VALUES (@id, @name, @userName, @email, @password,@profilePic, @bio, @location, @website, @joined, @createAt, @updatedAt, @bannerPic)"
      );
    if (request.rowsAffected[0] === 1) {
      const userRequest = await pool
        .request()
        .input("id", mssql.UniqueIdentifier, id)
        .query("SELECT * FROM socialClout.users WHERE id = @id");
      const results = await removePassword(userRequest.recordset);
      res
        .status(201)
        .json(apiJSON(results[0], "User created successfully", 201));
    } else {
      res.status(400).json(apiJSON({}, "User creation failed", 400));
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(apiJSON({}, err, 500));
  } finally {
    mssql.close();
  }
};
/**
 * A controller for updating a user by id
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      userName,
      email,
      password,
      profilePic,
      bannerPic,
      bio,
      location,
      website,
      joined,
    } = req.body;
    const hashedPassword = password
      ? bcrypt.hashSync(password, config.salt_rounds)
      : null;
    const updatedAt = new Date();
    const pool = await mssql.connect(sqlConfig);
    const request = await pool
      .request()
      .input("id", mssql.UniqueIdentifier, id)
      .input("name", mssql.VarChar, name)
      .input("userName", mssql.VarChar, userName)
      .input("email", mssql.VarChar, email)
      .input("password", mssql.VarChar, hashedPassword)
      .input("profilePic", mssql.VarChar, profilePic)
      .input("bannerPic", mssql.VarChar, bannerPic)
      .input("bio", mssql.VarChar, bio)
      .input("location", mssql.VarChar, location)
      .input("website", mssql.VarChar, website)
      .input("joined", mssql.VarChar, joined)
      .input("updatedAt", mssql.DateTime, updatedAt)
      .query(
        `UPDATE socialClout.users SET name = @name, userName = @userName, email = @email,
        password = CASE WHEN @password IS NULL THEN password ELSE @password END,
        profilePic = @profilePic,
        bio = @bio,
        location = @location,
        website = @website,
        joined = @joined,
        bannerPic = @bannerPic,
        updatedAt = @updatedAt WHERE id = @id`
      );
    if (request.rowsAffected[0] === 1) {
      const userRequest = await pool
        .request()
        .input("id", mssql.UniqueIdentifier, id)
        .query("SELECT * FROM socialClout.users WHERE id = @id");
      const results = await removePassword(userRequest.recordset);
      res
        .status(200)
        .json(apiJSON(results[0], "User updated successfully", 200));
    } else {
      res.status(404).json(apiJSON({}, "User not found", 404));
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(apiJSON({}, err, 500));
  } finally {
    mssql.close();
  }
};

// patch user using COALESCE
/**
 * controller to patch user by id
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const patchUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      userName,
      email,
      password,
      profilePic,
      bannerPic,
      bio,
      location,
      website,
      joined,
    } = req.body;
    const hashedPassword = password
      ? bcrypt.hashSync(password, config.salt_rounds)
      : null;
    const updatedAt = new Date();
    const pool = await mssql.connect(sqlConfig);
    const request = await pool
      .request()
      .input("id", mssql.UniqueIdentifier, id)
      .input("name", mssql.VarChar, name)
      .input("userName", mssql.VarChar, userName)
      .input("email", mssql.VarChar, email)
      .input("password", mssql.VarChar, hashedPassword)
      .input("profilePic", mssql.VarChar, profilePic)
      .input("bannerPic", mssql.VarChar, bannerPic)
      .input("bio", mssql.VarChar, bio)
      .input("location", mssql.VarChar, location)
      .input("website", mssql.VarChar, website)
      .input("joined", mssql.VarChar, joined)
      .input("updatedAt", mssql.DateTime, updatedAt)
      .query(
        "UPDATE socialClout.users SET name = COALESCE(@name, name), userName = COALESCE(@userName, userName), email = COALESCE(@email, email), password = COALESCE(@password, password), profilePic = COALESCE(@profilePic, profilePic),  bio = COALESCE(@bio, bio), location = COALESCE(@location, location), website = COALESCE(@website, website), joined = COALESCE(@joined, joined), updatedAt = COALESCE(@updatedAt, updatedAt), bannerPic = COALESCE(@bannerPic, bannerPic) WHERE id = @id"
      );

    if (request.rowsAffected[0] === 1) {
      const userRequest = await pool
        .request()
        .input("id", mssql.UniqueIdentifier, id)
        .query("SELECT * FROM socialClout.users WHERE id = @id");
      const results = await removePassword(userRequest.recordset);
      res
        .status(200)
        .json(apiJSON(results[0], "User updated successfully", 200));
    } else {
      res.status(404).json(apiJSON({}, "User not found", 404));
    }
  } catch (err) {
    res.status(500).json(apiJSON({}, err.message, 500));
  } finally {
    mssql.close();
  }
};

/**
 * controller to search for a user by username
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */

export const searchUser = async (req, res) => {
  try {
    const { userName } = req.body;
    const pool = await mssql.connect(sqlConfig);
    const request = await pool
      .request()
      .input("userName", mssql.VarChar, userName)
      .query(
        "SELECT TOP 5 * FROM socialClout.users WHERE userName LIKE '%' + @userName + '%'"
      );
    if (request.recordset.length > 0) {
      const results = await removePassword(request.recordset);
      res.status(200).json(apiJSON(results, "Users found", 200));
    } else {
      res.status(404).json(apiJSON({}, "No users found", 404));
    }
  } catch (err) {
    res.status(500).json(apiJSON({}, err.message, 500));
  } finally {
    mssql.close();
  }
};

/**
 * controller to suggest users for a user by userID
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */

export const getAllUsersNotFollowingAUser = async (req, res) => {
  try {
    console.log(req.params);
    const { userId } = req.params;
    const pool = await mssql.connect(sqlConfig);
    const request = await pool
      .request()
      .input("id", mssql.UniqueIdentifier, userId)
      .query(
        `SELECT * FROM socialClout.users
            WHERE id NOT IN (
              SELECT followerId FROM socialClout.follows
              WHERE userId = @id
            );`
      );
    if (request.recordset.length > 0) {
      const results = await removePassword(request.recordset);
      res.status(200).json(apiJSON(results, "Users found", 200));
    } else {
      res.status(404).json(apiJSON({}, "No users found", 404));
    }
  } catch (err) {
    res.status(500).json(apiJSON({}, err.message, 500));
  } finally {
    mssql.close();
  }
};

/**
 * controller to get a user previous charts
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const getPreviousCharts = async (req, res) => {
  try {
    const { userId } = req.params;
    const pool = await mssql.connect(sqlConfig);
    const request = await pool
      .request()
      .input("currentUserId", mssql.UniqueIdentifier, userId)
      .query(
        `SELECT u.id, u.name, u.userName, u.email, u.profilePic, u.bio, u.location, u.website, u.joined, MAX(m.createAt) AS lastMessageTime
          FROM socialClout.users u
          JOIN socialClout.user_messages m
          ON u.id = m.senderId OR u.id = m.receiverId
          WHERE m.senderId = '71f6f045-d299-43f0-a3c5-410b202e79cc' OR m.receiverId = '71f6f045-d299-43f0-a3c5-410b202e79cc'
          GROUP BY u.id, u.name, u.userName, u.email, u.password, u.profilePic, u.bio, u.location, u.website, u.joined
          ORDER BY lastMessageTime DESC;`
      );
    if (request.recordset.length > 0) {
      const results = await removePassword(request.recordset);
      res.status(200).json(apiJSON(results, "Charts found", 200));
    } else {
      res.status(404).json(apiJSON({}, "No charts found", 404));
    }
  } catch (err) {
    res.status(500).json(apiJSON({}, err.message, 500));
  } finally {
    mssql.close();
  }
};
