// ── Firebase Admin Setup ──────────────────────────────────────────────
// This file initializes Firebase Admin SDK and exports Firestore database

const admin = require('firebase-admin');
const path = require('path');

// Load credentials from environment variable or file (for local development)
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Production: Use environment variable
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // Development: Use local firebase-key.json file
  serviceAccount = require(path.join(__dirname, 'firebase-key.json'));
}

// Initialize Firebase Admin with your credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Get Firestore database instance
const db = admin.firestore();

// Get Firestore Timestamp class for creating proper timestamps
const Timestamp = admin.firestore.Timestamp;

// Export the database and Timestamp so other files can use them
module.exports = { db, Timestamp };
