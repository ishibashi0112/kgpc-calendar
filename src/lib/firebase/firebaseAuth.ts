import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  UserCredential,
} from "firebase/auth";
import { User } from "src/type/types";

import { auth } from "./firebase";
import { createUser } from "./firestore";

type SignUpData = {
  email: string;
  password: string;
  confirmPassword: string;
};
export type SignInData = {
  email: string;
  password: string;
};

export type SignUpValues = SignUpData & Omit<User, "id">;

export const signIn = async (data: SignInData): Promise<UserCredential> => {
  const user = await signInWithEmailAndPassword(
    auth,
    data.email,
    data.password
  );
  return user;
};

export const signUp = async (data: SignUpValues): Promise<void> => {
  const user = await createUserWithEmailAndPassword(
    auth,
    data.email,
    data.password
  );

  const userData = {
    name: data.name,
    email: data.email,
    type: data.type,
  };

  await createUser(user.user.uid, userData);
};

export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};
