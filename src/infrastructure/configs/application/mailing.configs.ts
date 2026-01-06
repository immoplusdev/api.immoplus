const dotenv = require("dotenv").config();
export const NODE_MAILER_HOST = process.env.NODE_MAILER_HOST;
export const NODE_MAILER_PORT = parseInt(process.env.NODE_MAILER_PORT);
export const NODE_MAILER_SECURE = true; // process.env.NODE_MAILER_SECURE == "true";
export const NODE_MAILER_IGNORE_TLS =
  process.env.NODE_MAILER_IGNORE_TLS == "true";
export const NODE_MAILER_USER = process.env.NODE_MAILER_USER;
export const NODE_MAILER_PASSWORD = process.env.NODE_MAILER_PASSWORD;
