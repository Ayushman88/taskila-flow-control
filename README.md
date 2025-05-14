
# Taskila - Project Management App

## Firebase Setup Instructions

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup steps
   - Enable Google Analytics if needed

2. **Set up Authentication**:
   - Go to Authentication section in Firebase Console
   - Enable Email/Password and Google authentication methods
   - Add authorized domains if deploying to a custom domain

3. **Set up Firestore Database**:
   - Go to Firestore Database section
   - Create a database in production or test mode
   - Set up indexes as needed for complex queries

4. **Set up Storage**:
   - Go to Storage section
   - Initialize Storage with default rules

5. **Set up Firebase Functions** (for Razorpay integration):
   - Install Firebase CLI: `npm install -g firebase-tools`
   - Login to Firebase: `firebase login`
   - Initialize Firebase in your project: `firebase init`
   - Deploy functions: `firebase deploy --only functions`

6. **Copy Firebase Configuration to .env file**:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Copy the Firebase SDK configuration values to your .env file

7. **Set up Firebase Security Rules**:
   - Copy the rules from firebase-rules.txt to your Firebase Console
   - Go to Firestore Database > Rules and update
   - Go to Storage > Rules and update

8. **Razorpay Integration**:
   - Create a Razorpay account at [Razorpay](https://razorpay.com)
   - Get your API keys from the Dashboard
   - Add these keys to your .env file

## Running the Application

1. Install dependencies:
   ```
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```

3. For production build:
   ```
   npm run build
   ```

## Firebase Emulators (Optional)

If you want to use Firebase Emulators for local development:

1. Install Firebase CLI and login as mentioned above
2. Start emulators:
   ```
   firebase emulators:start
   ```
3. Set `VITE_USE_FIREBASE_EMULATORS=true` in your .env file
