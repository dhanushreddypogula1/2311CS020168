import axios from "axios";
import { validateLog } from "./validator.js";

const LOG_API = "http://4.224.186.213/evaluation-service/logs";

export async function Log(stack, level, packageName, message, token) {
  validateLog(stack, level, packageName, message);

  try {
    const response = await axios.post(
      LOG_API,
      {
        stack,
        level,
        package: packageName,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error;
  }
}