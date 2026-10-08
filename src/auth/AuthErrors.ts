import { FirebaseError } from "firebase/app";

export class AuthErrors {
  static message(err: unknown): string {
    const code = err instanceof FirebaseError ? err.code : "";
    switch (code) {
      case "auth/email-already-in-use": return "An account with this email already exists. Try signing in.";
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found": return "Incorrect email or password.";
      case "auth/invalid-email": return "That email address isn't valid.";
      case "auth/weak-password": return "That password is too weak. Use at least 6 characters.";
      case "auth/too-many-requests": return "Too many attempts. Wait a few minutes and try again.";
      case "auth/network-request-failed": return "Network error. Check your connection and try again.";
      case "auth/operation-not-allowed": return "Email/Password sign-in isn't enabled in the Firebase console.";
      case "auth/user-disabled": return "This account has been disabled.";
      default: return "Something went wrong. Please try again.";
    }
  }
}