import { Popover } from "@mantine/core";
import React, { FC } from "react";
import { PostUser } from "src/type/types";

import { ProcessTimeLine } from "./ProcessTimeLine";
import { StateIcon } from "./StateIcon";

type Props = {
  post: PostUser<string>;
  withCompleteButton?: boolean;
};

export const PostStateIcon: FC<Props> = ({ post }) => {
  const processNum = post.processes.reduce((prev, current) => {
    return current.isCompleted ? prev + 1 : prev;
  }, 0);

  return (
    <Popover
      width={400}
      position="bottom-start"
      withArrow
      arrowOffset={10}
      arrowSize={10}
    >
      <Popover.Target>
        <StateIcon post={post} pointer />
      </Popover.Target>
      <Popover.Dropdown>
        <ProcessTimeLine
          processes={post.processes}
          processNum={processNum}
          withCompleteButton
          post={post}
        />
      </Popover.Dropdown>
    </Popover>
  );
};
