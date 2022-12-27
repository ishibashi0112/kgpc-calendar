import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import React, { FC, ReactNode, useEffect } from "react";
import { auth } from "src/lib/firebase/firebase";
import { setUserState, state } from "src/lib/store/valtio";

type Props = {
  children: ReactNode;
};

export const Auth: FC<Props> = ({ children }) => {
  const { pathname, push, replace } = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (!state.user) {
          setUserState(user.uid);
        }
        if (pathname === "/auth") {
          push("/");
        }
      } else {
        state.user = null;
        replace("/auth?authType=signin");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return <div>{children}</div>;
};
