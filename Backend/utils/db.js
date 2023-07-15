import dotenv from "dotenv";

dotenv.config();

const {
  APP_HOST,
  PORT,
  HOST,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  JWT_SECRET,
} = process.env;

export const sqlConfig = {
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  server: DB_HOST,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  jwt_secret: JWT_SECRET,
};

export const config = {
  port: PORT,
  host: HOST,
  url: APP_HOST,
  jwt_secret: JWT_SECRET,
};
