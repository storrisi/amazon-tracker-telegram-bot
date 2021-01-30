"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "firebase", {
  enumerable: true,
  get: function get() {
    return _firebase["default"];
  }
});
exports.admin = void 0;

var _firebase = _interopRequireDefault(require("firebase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

require('dotenv').config();

var admin = require("firebase-admin");

exports.admin = admin;
var firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
}; // Initialize Firebase

_firebase["default"].initializeApp(firebaseConfig);

var serviceAccount = JSON.parse(Buffer.from(process.env.serviceAccountKey, 'base64').toString('utf-8'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.databaseURL
});
//# sourceMappingURL=firebaseConfig.js.map