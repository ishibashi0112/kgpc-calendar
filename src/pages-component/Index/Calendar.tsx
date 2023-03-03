import "dayjs/locale/ja";

import { Card, Indicator } from "@mantine/core";
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
    <Card shadow="xs">
      <MantineCalendar
        size="lg"
        labelFormat="YYYY/MM"
        locale="ja"
        firstDayOfWeek="sunday"
        value={selectedDate}
        onChange={handleOnchange}
        renderDay={dayViewRender}
        dayStyle={(date, modifiers) =>
          modifiers.selected
            ? {
                backgroundColor: "#5C5F66",
              }
            : date.getDay() === 6
            ? { color: "#339AF0" }
            : {}
        }
      />
    </Card>
  );
};
