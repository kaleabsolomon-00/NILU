import "server-only";
import { createHmac } from "crypto";

export const DEVICE_COOKIE = "nilu_device";

export function hashDeviceId(deviceId: string) {
  const secret = process.env.DEVICE_HASH_SECRET;
  if (!secret) throw new Error("DEVICE_HASH_SECRET is not set");
  return createHmac("sha256", secret).update(deviceId).digest("hex");
}
