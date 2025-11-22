import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "SEARCH_HISTORY";

export const incrementSearchCount = async (symbol: string) => {
  const data = await AsyncStorage.getItem(KEY);
  let history = data ? JSON.parse(data) : {};

  // Increment but cap max at 5
  const current = history[symbol] || 0;
  history[symbol] = Math.min(current + 1, 5);

  // Keep only top 3 symbols
  const sortedEntries = Object.entries(history)
    .sort((a, b) => b[1] - a[1]) // highest count first
    .slice(0, 3); // keep only 3 symbols

  const trimmed = Object.fromEntries(sortedEntries);

  await AsyncStorage.setItem(KEY, JSON.stringify(trimmed));
};

export const getSearchHistory = async () => {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : {};
};

export const clearSearchHistory = async () => {
  try {
    await AsyncStorage.removeItem(KEY);
    console.log("SEARCH_HISTORY cleared successfully.");
  } catch (error) {
    console.error("Failed to clear SEARCH_HISTORY:", error);
  }
};

 export const logAllStorage = async () => {
  const keys = await AsyncStorage.getAllKeys();
  console.log("All keys:", keys);

  const stores = await AsyncStorage.multiGet(keys);
  stores.forEach(([key, value]) => {
    console.log(key, JSON.parse(value || "{}"));
  });
};