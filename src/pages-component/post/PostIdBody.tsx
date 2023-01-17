import { Flex } from "@mantine/core";
import React, { FC } from "react";
import { Calendar } from "src/pages-component/Index/Calendar";

import { ShowPost } from "./ShowPost";

export const PostIdBody: FC = () => {
  return (
    <Flex className="p-3">
      <Calendar />

      <ShowPost />
    </Flex>
  );
};
