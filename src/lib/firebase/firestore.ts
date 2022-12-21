import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";

import { postConverter } from "./convater";
import { db } from "./firebase";

export type Post = {
  id: string;
  date: Date;
  title: string;
  file: File | null;
  description: string;
  isCompleted: boolean;
  userId: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  type: "発注" | "部品";
};

export const getPosts = async (): Promise<Post[]> => {
  const querySnapshot = await getDocs(
    collection(db, "posts").withConverter(postConverter)
  );

  const postsData = querySnapshot.docs.map((postDoc) => ({
    ...postDoc.data(),
    id: postDoc.id,
  }));

  return postsData;
};

export const getPost = async (id: string): Promise<Post> => {
  const docRef = doc(db, "posts", id).withConverter(postConverter);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error("対象の予定がありません");
  }

  const post = docSnap.data();

  return post;
};

export const createPost = async (data: Omit<Post, "id">): Promise<void> => {
  await addDoc(collection(db, "posts"), data);
};

export const createUser = async (
  id: string,
  data: Omit<User, "id">
): Promise<void> => {
  await setDoc(doc(db, "users", id), data);
};
