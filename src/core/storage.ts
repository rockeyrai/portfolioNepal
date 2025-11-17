import * as Keychain from "react-native-keychain";

export async function setItem(key: string, value: string) {
  await Keychain.setGenericPassword(key, value);
}

export async function getItem(key: string) {
  const credentials = await Keychain.getGenericPassword();
  if (credentials) return credentials.password;
  return null;
}

export async function removeItem(key: string) {
  await Keychain.resetGenericPassword();
}
