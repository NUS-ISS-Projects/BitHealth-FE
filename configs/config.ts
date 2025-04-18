import Constants from "expo-constants";

export const API_URL = Constants.expoConfig?.extra?.apiUrl ?? "";
export const FIREBASE_API_KEY =
  Constants.expoConfig?.extra?.firebaseApiKey ?? "";
export const FIREBASE_AUTH_DOMAIN =
  Constants.expoConfig?.extra?.firebaseAuthDomain ?? "";
export const FIREBASE_PROJECT_ID =
  Constants.expoConfig?.extra?.firebaseProjectId ?? "";
export const FIREBASE_STORAGE_BUCKET =
  Constants.expoConfig?.extra?.firebaseStorageBucket ?? "";
export const FIREBASE_MESSAGING_SENDER_ID =
  Constants.expoConfig?.extra?.firebaseMessagingSenderId ?? "";
export const FIREBASE_APP_ID = Constants.expoConfig?.extra?.firebaseAppId ?? "";
export const FIREBASE_MEASUREMENT_ID =
  Constants.expoConfig?.extra?.firebaseMeasurementId ?? "";
export const GOOGLE_WEB_CLIENT_ID =
  Constants.expoConfig?.extra?.webClientId ?? "";
export const GOOGLE_ANDROID_CLIENT_ID =
  Constants.expoConfig?.extra?.androidClientId ?? "";
