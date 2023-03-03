import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { Post, PostUser, Processes, User } from "src/type/types";

import { postConverter, userConverter } from "./convater";
import { db } from "./firebase";

export const getPosts = async (): Promise<PostUser[]> => {
  const querySnapshot = await getDocs(
    collection(db, "posts").withConverter(postConverter)
  );

  const postsData = await Promise.all(
    querySnapshot.docs.map(async (postDoc) => {
      const postData = postDoc.data();
      const user = await getUserById(postData.userId);
      const dateToStringInProcesses = postData.processes.map((process) => ({
        ...process,
        updatedAt: process.updatedAt.toDate(),
      }));
      return {
        ...postData,
        id: postDoc.id,
        createdAt: postData.createdAt.toDate(),
        date: postData.date.toDate(),
        processes: dateToStringInProcesses,
        user,
      };
    })
  );

  return postsData;
};

export const getPostById = async (id: string): Promise<PostUser<Date>> => {
  const docRef = doc(db, "posts", id).withConverter(postConverter);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error("対象の予定がありません");
  }

  const postDoc = docSnap.data();
  const dateToStringInProcesses = postDoc.processes.map((process) => ({
    ...process,
    updatedAt: process.updatedAt.toDate(),
  }));

  const user = await getUserById(postDoc.userId);

  const post = {
    ...postDoc,
    createdAt: postDoc.createdAt.toDate(),
    date: postDoc.date.toDate(),
    id: docSnap.id,
    user,
    processes: dateToStringInProcesses,
  };

  return post;
};

export const getUsers = async (): Promise<User[]> => {
  const querySnapshot = await getDocs(
    collection(db, "users").withConverter(userConverter)
  );

  const usersData = querySnapshot.docs.map((userDoc) => {
    const userData = userDoc.data();
    return {
      ...userData,
      id: userDoc.id,
    };
  });

  return usersData;
};

export const getUserById = async (id: string) => {
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

export const updateProcess = async (
  postId: string,
  data: Processes<Date>[]
): Promise<void> => {
  const posts = await updateDoc(doc(db, "posts", postId), { processes: data });
  console.log(posts);
};

export const updatePost = async (
  postId: string,
  data: Partial<Post<Date>>
): Promise<void> => {
  await updateDoc(doc(db, "posts", postId), data);
};

export const deletePost = async (postId: string): Promise<void> => {
  await deleteDoc(doc(db, "posts", postId));
};
