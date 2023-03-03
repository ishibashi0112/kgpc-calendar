import { collection, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";

import { db } from "../firebase/firebase";

export const useFirestoreSnapshot = () => {
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          // console.log("New posts: ", change.doc.data());
        }
        if (change.type === "modified") {
          console.log("Modified city: ", change.doc.data());
        }
        if (change.type === "removed") {
          console.log("Removed city: ", change.doc.data());
        }
      });

      const postsDocs = snapshot.docs;
      const posts = postsDocs.map((postsDoc) => ({
        ...postsDoc.data(),
        id: postsDoc.id,
      }));
      // console.log("posts snapshot", posts.length, posts);
    });

    // Later ...

    // Stop listening to changes
    return () => {
      unsubscribe();
    };
  }, []);

  return null;
};
