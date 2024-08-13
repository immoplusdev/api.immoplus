const axios = require("axios");
const API_URL = bru.getEnvVar("API_URL");

async function getUserTokenBru(username, password) {
  const response = await axios.post(`${API_URL}/auth/login`, {
    username,
    password,
  });

  return response.data.data?.accessToken || null;
}

module.exports = {
  getUserToken: getUserTokenBru,
};