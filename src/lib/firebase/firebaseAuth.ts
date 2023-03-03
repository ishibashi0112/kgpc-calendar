import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  UserCredential,
} from "firebase/auth";
import { SignInValues, SignUpValues } from "src/type/types";

import { auth } from "./firebase";
import { createUser } from "./firestore";

export const signIn = async (data: SignInValues): Promise<UserCredential> => {
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
    firstName: data.firstName,
    lastName: data.lastName,
    name: data.name,
    email: data.email,
    type: data.type,
  };

  await createUser(user.user.uid, userData);
};

export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};
