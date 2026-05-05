import axios from "axios";

const API = axios.create({
  baseURL: "https://login-8s0t.onrender.com/api/auth"
});

export default API;