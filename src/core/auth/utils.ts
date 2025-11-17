// core/auth/utils.ts
import * as Keychain from "react-native-keychain";
import type { TokenType } from "../../redux/slices/authSlice";

const TOKEN_KEY = "token";

/**
 * Store token securely
 */
export async function setToken(token: TokenType) {
  await Keychain.setGenericPassword(TOKEN_KEY, JSON.stringify(token), {
    service: TOKEN_KEY,
  });
}

/**
 * Get token from secure storage
 */
export async function getToken(): Promise<TokenType | null> {
  const credentials = await Keychain.getGenericPassword({ service: TOKEN_KEY });
  if (credentials) {
    try {
      return JSON.parse(credentials.password) as TokenType;
    } catch (err) {
      console.warn("Failed to parse token:", err);
      return null;
    }
  }
  return null;
}

/**
 * Remove token from secure storage
 */
export async function removeToken() {
  await Keychain.resetGenericPassword({ service: TOKEN_KEY });
}
