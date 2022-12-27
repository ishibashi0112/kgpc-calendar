import { ThemeIcon } from "@mantine/core";
import { IconCircleCheck, IconDotsCircleHorizontal } from "@tabler/icons";
import React, { FC } from "react";
import { PostUser } from "src/lib/firebase/firestore";

type Props = {
  post: PostUser<string>;
};

export const PostStateIcon: FC<Props> = ({ post }) => {
  return (
    <ThemeIcon
      color={post.isCompleted ? "teal" : "yellow"}
      size={24}
      radius="xl"
    >
      {post.isCompleted ? (
        <IconCircleCheck size={16} />
      ) : (
        <IconDotsCircleHorizontal size={16} />
      )}
    </ThemeIcon>
  );
};
