import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import React, { FC, ReactNode, useEffect } from "react";
import { auth } from "src/lib/firebase/firebase";

type Props = {
  children: ReactNode;
};

export const Auth: FC<Props> = ({ children }) => {
  const { pathname, push, replace } = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (pathname === "/auth") {
          console.log("eeee");
          push("/");
        }
      } else {
        // alert("もう一度ログインしてください");
        replace("/auth?authType=signin");
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return <div>{children}</div>;
};
