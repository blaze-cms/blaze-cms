import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type Auth,
} from "firebase/auth";
import type { AuthApi } from "./types.js";

export function createAuthApi(auth: Auth): AuthApi {
  return {
    async login(email, password) {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return cred.user;
    },

    async logout() {
      await signOut(auth);
    },

    onAuthChange(cb) {
      return onAuthStateChanged(auth, cb);
    },

    getCurrentUser() {
      return auth.currentUser;
    },
  };
}
