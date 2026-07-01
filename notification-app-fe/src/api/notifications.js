import axios from "axios";

const API = "http://4.224.186.213/evaluation-service";

const TOKEN = "your_token_here"; // Replace with your actual token  

export async function fetchNotifications(
  page = 1,
  limit = 10,
  notificationType = ""
) {
  try {
    const response = await axios.get(`${API}/notifications`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
      params: {
        page,
        limit,
        notification_type:
          notificationType === "All" ? "" : notificationType,
      },
    });

    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}