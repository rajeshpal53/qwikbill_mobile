import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';

const app = getApp(); // uses native firebase config (google-services.json)
const auth = getAuth(app); // this is the modular auth instance

export { app, auth };
export const firebaseApp  = getApp();          // auto-initialised native app

export const firebaseAuth = getAuth(firebaseApp);
