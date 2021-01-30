require('dotenv').config()
import firebase from 'firebase'
var admin = require("firebase-admin");

const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);



var serviceAccount = JSON.parse(Buffer.from(process.env.serviceAccountKey, 'base64').toString('utf-8'))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.databaseURL
});

export  {firebase, admin}