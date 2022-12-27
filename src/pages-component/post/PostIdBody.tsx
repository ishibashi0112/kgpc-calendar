import { Flex } from "@mantine/core";
import React, { FC } from "react";
import { PostUser } from "src/lib/firebase/firestore";
import { Calendar } from "src/pages-component/Index/Calendar";

import { ShowPost } from "./ShowPost";

type Props = {
  post: PostUser<string>;
};

export const PostIdBody: FC<Props> = ({ post }) => {
  return (
    <Flex className="p-3">
      <Calendar />

      <ShowPost post={post} />
    </Flex>
  );
};
