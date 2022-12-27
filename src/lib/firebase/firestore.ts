import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  Timestamp,
} from "firebase/firestore";

import { postConverter, userConverter } from "./convater";
import { db } from "./firebase";

export type Post<T extends Date | Timestamp | string = Date> = {
  id: string;
  date: T;
  title: string;
  file: string | null;
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

export type PostUser<T extends Date | Timestamp | string = Date> = Omit<
  Post<T>,
  "userId"
> & { user: User };

export const getPosts = async (): Promise<PostUser[]> => {
  const querySnapshot = await getDocs(
    collection(db, "posts").withConverter(postConverter)
  );

  const postsData = await Promise.all(
    querySnapshot.docs.map(async (postDoc) => {
      const postData = postDoc.data();
      const user = await getUser(postData.userId);
      return {
        ...postData,
        id: postDoc.id,
        date: postData.date.toDate(),
        user,
      };
    })
  );

  return postsData;
};

export const getPost = async (id: string): Promise<PostUser<Date>> => {
  const docRef = doc(db, "posts", id).withConverter(postConverter);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error("対象の予定がありません");
  }

  const postDoc = docSnap.data();
  const user = await getUser(postDoc.userId);
  const post = {
    ...postDoc,
    date: postDoc.date.toDate(),
    id: docSnap.id,
    user,
  };

  return post;
};

export const getUser = async (id: string) => {
  const docRef = doc(db, "users", id).withConverter(userConverter);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error("対象のuser情報がありません");
  }

  const userDoc = docSnap.data();
  const user = { ...userDoc, id: docSnap.id };

  return user;
};

export const createPost = async (
  data: Omit<Post<Date>, "id">
): Promise<void> => {
  await addDoc(collection(db, "posts"), data);
};

export const createUser = async (
  id: string,
  data: Omit<User, "id">
): Promise<void> => {
  await setDoc(doc(db, "users", id), data);
};
