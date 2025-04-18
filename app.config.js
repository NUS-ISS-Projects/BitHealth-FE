import "dotenv/config";

export default ({ config }) => ({
  ...config,
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
    firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    firebaseMessagingSenderId:
      process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    firebaseMeasurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
    webClientId: process.env.EXPO_PUBLIC_WEBCLIENT,
    eas: {
      projectId: "80017a62-6f5b-48f2-ad03-e39307ef68ac",
    },
  },
});
