import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
  onAuthStateChanged, updateProfile, type User,
} from "firebase/auth";
import { auth } from "./firebase";

export class AuthService {
  async signUp(name: string, email: string, password: string): Promise<User> {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName: name });
    return user;
  }
  async signIn(email: string, password: string): Promise<User> {
    return (await signInWithEmailAndPassword(auth, email, password)).user;
  }
  signOut = () => signOut(auth);
  onChange = (cb: (u: User | null) => void) => onAuthStateChanged(auth, cb);
}
export const authService = new AuthService();