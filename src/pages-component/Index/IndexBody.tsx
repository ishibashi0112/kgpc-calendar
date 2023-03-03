import "dayjs/locale/ja";

import { Grid } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React, { FC } from "react";
import { Calendar } from "src/pages-component/Index/Calendar";

import { ScheduleList } from "./ScheduleList";

export const IndexBody: FC = () => {
  const matches = useMediaQuery("(min-width: 890px)", true, {
    getInitialValueInEffect: false,
  });

  return (
    <Grid columns={2}>
      <Grid.Col span="content">
        <Calendar />
      </Grid.Col>

      <Grid.Col span={matches ? "auto" : 2}>
        <ScheduleList />
      </Grid.Col>
    </Grid>
  );
};
