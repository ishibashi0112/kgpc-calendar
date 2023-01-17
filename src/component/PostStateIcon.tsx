import { Group, Popover, Space, Text } from "@mantine/core";
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
    <Popover width={400} position="bottom-start">
      <Popover.Target>
        <StateIcon post={post} pointer />
      </Popover.Target>
      <Popover.Dropdown>
        <Group noWrap>
          <StateIcon post={post} />
          <Text lineClamp={1}>{post.title}</Text>
        </Group>

        <Space h="md" />

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
