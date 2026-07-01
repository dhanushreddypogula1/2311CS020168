import { Log } from "./src/logger.js";

const TOKEN = "your_token_here"; // Replace with your actual JWT token
async function test() {
  try {
    const result = await Log(
      "frontend",
      "info",
      "component",
      "Logging middleware test successful",
      TOKEN
    );

    console.log(result);
  } catch (err) {
    console.error(err);
  }
}

test();