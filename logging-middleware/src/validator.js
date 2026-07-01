import {
  STACKS,
  LEVELS,
  BACKEND_PACKAGES,
  FRONTEND_PACKAGES,
} from "./constants.js";

export function validateLog(stack, level, packageName, message) {
  if (!STACKS.includes(stack)) {
    throw new Error(`Invalid stack: ${stack}`);
  }

  if (!LEVELS.includes(level)) {
    throw new Error(`Invalid level: ${level}`);
  }

  if (stack === "backend" && !BACKEND_PACKAGES.includes(packageName)) {
    throw new Error(`Invalid backend package: ${packageName}`);
  }

  if (stack === "frontend" && !FRONTEND_PACKAGES.includes(packageName)) {
    throw new Error(`Invalid frontend package: ${packageName}`);
  }

  if (!message || typeof message !== "string") {
    throw new Error("Message must be a non-empty string.");
  }
}