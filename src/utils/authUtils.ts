import { JWT_TOKEN_PASS } from "@/constants";
import { jwtDecode } from "./jwtDecode";

interface DecodedToken {
  id: string;
  userEmail: string;
}

export const getAccessToken = (): string | null => {
  return localStorage.getItem(JWT_TOKEN_PASS);
};

export const getUserFromToken = (): DecodedToken | null => {
  const token = localStorage.getItem(JWT_TOKEN_PASS);
  if (!token) return null;

  try {
    return jwtDecode(token) as DecodedToken;
  } catch (error) {
    console.error("Invalid JWT token:", error);
    return null;
  }
};
