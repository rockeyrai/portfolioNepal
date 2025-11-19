// src/navigation/types.ts
export type AuthStackParamList = {
  Login: undefined;
  register:undefined;
  privacy:undefined
};

export type SubscriptionStackParamList = {
  Subscribe: undefined;
};

export type AppStackParamList = {
  Home: undefined;
  Profile: undefined;
  Analysis:undefined;
  Copilot:undefined;
  Service:undefined
  Notification:undefined
  Search:undefined
};

export type RootStackParamList = {
  Auth: undefined;
  Subscription: undefined;
  App: undefined;
};
