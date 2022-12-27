import "dayjs/locale/ja";

import { Flex } from "@mantine/core";
import React, { FC } from "react";
import { PostUser } from "src/lib/firebase/firestore";
import { Calendar } from "src/pages-component/Index/Calendar";

import { ScheduleList } from "./ScheduleList";

export type Props = {
  posts: PostUser<string>[];
};

export const IndexBody: FC<Props> = ({ posts }) => {
  return (
    <Flex className="p-3">
      <Calendar />

      <ScheduleList posts={posts} />
    </Flex>
  );
};
