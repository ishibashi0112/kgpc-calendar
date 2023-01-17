import { ThemeIcon } from "@mantine/core";
import {
  IconCircleCaretRight,
  IconCircleCheck,
  IconDotsCircleHorizontal,
} from "@tabler/icons";
import React, { forwardRef } from "react";
import { PostUser } from "src/type/types";

export const StateIcon = forwardRef<
  HTMLDivElement,
  { post: PostUser<string>; pointer?: boolean }
>(({ post, pointer = false, ...otherProps }, ref) => {
  const processNum = post.processes.reduce((prev, current) => {
    return current.isCompleted ? prev + 1 : prev;
  }, 0);
  return (
    <div ref={ref} {...otherProps}>
      <ThemeIcon
        className={`${pointer ? "cursor-pointer" : ""}`}
        color={post.isCompleted ? "teal" : processNum > 0 ? "yellow" : "gray"}
        size={24}
        radius="xl"
      >
        {post.isCompleted ? (
          <IconCircleCheck size={16} />
        ) : processNum > 0 ? (
          <IconCircleCaretRight size={16} />
        ) : (
          <IconDotsCircleHorizontal size={16} />
        )}
      </ThemeIcon>
    </div>
  );
});

StateIcon.displayName = "StateIcon";
