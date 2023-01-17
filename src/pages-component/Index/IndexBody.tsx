import "dayjs/locale/ja";

import { Flex } from "@mantine/core";
import React, { FC } from "react";
import { Calendar } from "src/pages-component/Index/Calendar";

import { ScheduleList } from "./ScheduleList";

export const IndexBody: FC = () => {
  return (
    <Flex className="py-3">
      <Calendar />

      <ScheduleList />
    </Flex>
  );
};
