import "dayjs/locale/ja";

import { Group, Indicator, Space, Switch } from "@mantine/core";
import { Calendar as MantineCalendar } from "@mantine/dates";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { FC, ReactNode, useCallback } from "react";
import { usePosts } from "src/lib/hook/swr/usePosts";
import {
  setSelectedDate,
  setSelectedDatePosts,
  state,
} from "src/lib/store/valtio";
import { useSnapshot } from "valtio";

export const Calendar: FC = () => {
  const { selectedDate } = useSnapshot(state);
  const { pathname, push } = useRouter();
  const { posts } = usePosts();

  const handleOnchange = useCallback(
    async (value: Date | null) => {
      if (pathname !== "/") {
        await push("/");
      }
      setSelectedDate(value);
      setSelectedDatePosts(posts, value);
    },
    [pathname, posts]
  );

  const dayViewRender = useCallback(
    (date: Date): ReactNode => {
      const day = date.getDate();
      const calendarDateStr = dayjs(date).format("YYYY-MM-DD");

      const postsInDate = posts
        ? posts.filter((post) => {
            return calendarDateStr === dayjs(post.date).format("YYYY-MM-DD");
          })
        : [];

      return (
        <Indicator
          color="red"
          label={postsInDate.length.toString()}
          size={20}
          offset={10}
          disabled={!postsInDate.length}
        >
          <div>{day}</div>
        </Indicator>
      );
    },
    [posts]
  );

  return (
    <div>
      <MantineCalendar
        size="lg"
        labelFormat="YYYY/MM"
        locale="ja"
        firstDayOfWeek="sunday"
        value={selectedDate}
        onChange={handleOnchange}
        renderDay={dayViewRender}
      />

      <Space h="xs" />

      <Group position="right">
        <Switch labelPosition="left" label="関係のある予定のみ表示" />
      </Group>
    </div>
  );
};
