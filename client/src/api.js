import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 1000,
  headers: { 'Authorization': 'Bearer your_token_here' }
});
