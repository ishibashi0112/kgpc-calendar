import { Group } from "@mantine/core";
import React, { FC } from "react";
import { Calendar } from "src/pages-component/Index/Calendar";

import { ShowPost } from "./ShowPost";

export const PostIdBody: FC = () => {
  return (
    <Group align="start">
      <Calendar />

      <ShowPost />
    </Group>
  );
};
