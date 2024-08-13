const axios = require("axios");
const API_URL = bru.getEnvVar("API_URL");

async function getUserTokenBru(username, password) {
  const response = await axios.post(`${API_URL}/auth/login`, {
    username,
    password,
  });

  return response.data.data?.accessToken || null;
}

async function getUserIdAndToken(username, password) {
  const response = await axios.post(`${API_URL}/auth/login`, {
    username,
    password,
  });
  const token = response.data.data?.accessToken;
  const id = response.data.data?.user?.id;
  return id ? { id, token } : null;
}

module.exports = {
  getUserTokenBru: getUserTokenBru,
  getUserIdAndToken: getUserIdAndToken,
};