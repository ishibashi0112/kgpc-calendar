import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Timestamp,
  WithFieldValue,
} from "firebase/firestore";
import { Post, User } from "src/type/types";

export const postConverter: FirestoreDataConverter<Post<Timestamp>> = {
  toFirestore: (post: WithFieldValue<Post<Timestamp>>) => {
    return post;
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<Post<Timestamp>>,
    options
  ) => {
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
