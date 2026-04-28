import jwt from "jsonwebtoken";
import { getEnv } from "@/lib/env";
import type { AuthTokenPayload } from "@/types";

const env = getEnv();

export const signAuthToken = (payload: AuthTokenPayload) => {
  const expiresIn = env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"];

  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn,
  });
};

export const verifyAuthToken = (token: string): AuthTokenPayload | null => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
  } catch {
    return null;
  }
};
