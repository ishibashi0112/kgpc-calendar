import { LoadingOverlay } from "@mantine/core";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { getPosts } from "src/lib/firebase/firestore";
import { state } from "src/lib/store/valtio";

type Props = {
  children: ReactNode;
};

export const Posts: FC<Props> = ({ children }) => {
  const { pathname } = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!state.posts.length && pathname !== "/") {
      const getPostsState = async () => {
        setIsLoading(true);
        const posts = await getPosts();

        const dateToStringInPosts = posts.map((post) => {
          return { ...post, date: dayjs(post.date).format("YYYY-MM-DD") };
        });

        state.posts = dateToStringInPosts;
        setIsLoading(false);
      };

      getPostsState();
    }
  }, []);

  return (
    <>
      {children}
      <LoadingOverlay visible={isLoading} />
    </>
  );
};
