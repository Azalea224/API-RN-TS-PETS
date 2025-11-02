import axios from "axios";

export default axios.create({
  baseURL:
    process.env.EXPO_PUBLIC_API_URL ||
    "https://pets-react-query-backend.eapi.joincoded.com",
  timeout: 10000,
});
