import "dayjs/locale/ja";

import { Flex } from "@mantine/core";
import React, { FC, useState } from "react";
import { Post } from "src/lib/firebase/firestore";
import { Calendar } from "src/pages-component/Index/Calendar";

import { ScheduleList } from "./ScheduleList";

export type Props = {
  posts: Post[];
};

export const IndexBody: FC<Props> = ({ posts }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  return (
    <Flex className="p-3">
      <Calendar
        posts={posts}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <ScheduleList posts={posts} selectedDate={selectedDate} />
    </Flex>
  );
};
