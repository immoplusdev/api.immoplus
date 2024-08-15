import http from "k6/http";
import { check, sleep } from "k6";
import { API_URL, PRO_USERNAME, PRO_PASSWORD } from "./env.js";

export default function() {

  let res = http.post(`${API_URL}/auth/login`, { username: PRO_USERNAME, password: PRO_PASSWORD });
  console.log(API_URL);
  check(res, { "success login": (r) => r.status === 200 });

  sleep(0.3);
}
