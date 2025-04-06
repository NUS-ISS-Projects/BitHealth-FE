# BitHealth 🩺

Welcome to the BitHealth app! This Expo project uses file-based routing to simplify navigation.

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure Environment Variables:**

   Create a `.env` file in the project root with all required environment variables. Make sure to prefix each variable with `EXPO_`. For example:

   ```env
   EXPO_PUBLIC_API_URL=https://your-api-url.com
   ```
   Get firebase.js and place it in app directory

3. **Start the App:**

   ```bash
   npx expo start
   ```

   Choose your preferred run option from the Expo start screen:

   - Development build
   - Android emulator
   - iOS simulator
   - Expo Go

## Building the APK

To build an Android APK:

1. **Using EAS Build (recommended):**

   Install the EAS CLI if you haven't already:

   ```bash
   npm install -g eas-cli
   ```

   Then run:

   ```bash
   eas build --platform android
   ```

   Once the build completes, you'll receive a URL to download your APK.
