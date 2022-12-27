import { Group, Text, Textarea } from "@mantine/core";
import React, { FC } from "react";
import { PostUser } from "src/lib/firebase/firestore";
import { PostList } from "src/pages-component/Index/PostList";

import { ListHeader } from "../Index/ListHeader";

type Props = {
  post: PostUser<string>;
};

export const ShowPost: FC<Props> = ({ post }) => {
  return (
    <div className="flex-1 p-3">
      <ListHeader />

      <PostList post={post} />

      <Group position="right">
        <Text fz="xs">作成日: 22/12/25</Text>
      </Group>

      <Textarea
        classNames={{ root: "mt-3", input: "min-h-[300px]" }}
        defaultValue={post.description}
        readOnly
        variant="filled"
      />
    </div>
  );
};
