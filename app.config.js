import "dotenv/config";

export default ({ config }) => ({
  ...config,
  scheme: "myapp",
  android: {
    ...config.android,
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
  },
  ios: {
    ...config.ios,
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
  },
  plugins: [
    ...(config.plugins || []),
    [
      "@react-native-google-signin/google-signin",
      {
        scopes: ["email", "profile"],
        webClientId: process.env.EXPO_PUBLIC_WEBCLIENT,
        iosUrlScheme: process.env.EXPO_PUBLIC_IOS_URL_SCHEME,
      },
    ],
  ],
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
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    eas: {
      projectId: "80017a62-6f5b-48f2-ad03-e39307ef68ac",
    },
  },
});
