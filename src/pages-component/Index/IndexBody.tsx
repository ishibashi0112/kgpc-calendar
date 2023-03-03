import "dayjs/locale/ja";

import { Group } from "@mantine/core";
import React, { FC } from "react";
import { Calendar } from "src/pages-component/Index/Calendar";

import { ScheduleList } from "./ScheduleList";

export const IndexBody: FC = () => {
  return (
    <Group align="start">
      <Calendar />

      <ScheduleList />
    </Group>
  );
};
