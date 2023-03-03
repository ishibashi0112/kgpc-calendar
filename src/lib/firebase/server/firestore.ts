import { Timestamp } from "firebase/firestore";
import { Post, PostUser, User } from "src/type/types";

import { adminDB } from "./firebase";

export const getPosts = async (): Promise<PostUser[]> => {
  const querySnapshot = await adminDB.collection("posts").get();

  const postsData = await Promise.all(
    querySnapshot.docs.map(async (postDoc) => {
      const postData = postDoc.data() as Post<Timestamp>;
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
  const docSnap = await adminDB.collection("posts").doc(id).get();

  const postDoc = docSnap.data() as Post<Timestamp>;
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

export const getUserById = async (id: string): Promise<User> => {
  const docSnap = await adminDB.collection("users").doc(id).get();
  const userDoc = docSnap.data() as User;
  const user = { ...userDoc, id: docSnap.id };

  return user;
};

export const getUsers = async (): Promise<User[]> => {
  const querySnapshot = await adminDB.collection("users").get();

  const users = querySnapshot.docs.map((userDoc) => {
    const userData = userDoc.data() as User;
    return {
      ...userData,
      id: userDoc.id,
    };
  });

  return users;
};
