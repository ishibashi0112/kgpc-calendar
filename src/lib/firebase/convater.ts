import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  WithFieldValue,
} from "firebase/firestore";

import { Post, User } from "./firestore";

export const postConverter: FirestoreDataConverter<Post> = {
  toFirestore: (post: WithFieldValue<Post>) => {
    return post;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<Post>, options) => {
    const data = snapshot.data(options);
    return data;
  },
};

export const userConverter: FirestoreDataConverter<User> = {
  toFirestore: (user: WithFieldValue<User>) => {
    return user;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<User>, options) => {
    const data = snapshot.data(options);
    return data;
  },
};
