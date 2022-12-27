import "dayjs/locale/ja";

import { Indicator } from "@mantine/core";
import { Calendar as MantineCalendar } from "@mantine/dates";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { FC, ReactNode, useCallback } from "react";
import { state } from "src/lib/store/valtio";
import { useSnapshot } from "valtio";

export const Calendar: FC = () => {
  const snap = useSnapshot(state);
  const { pathname, push } = useRouter();

  const handleOnchange = useCallback(
    async (value: Date | null) => {
      if (pathname !== "/") {
        await push("/");
      }
      state.selectedDate = value;
    },
    [pathname]
  );

  const dayViewRender = useCallback(
    (date: Date): ReactNode => {
      const day = date.getDate();
      const calendarDateStr = dayjs(date).format("YYYY-MM-DD");

      const postsInDate = snap.posts.filter((post) => {
        return calendarDateStr === post.date;
      });

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
    [snap.posts]
  );

  return (
    <div>
      <MantineCalendar
        size="lg"
        labelFormat="YYYY/MM"
        locale="ja"
        firstDayOfWeek="sunday"
        value={snap.selectedDate}
        onChange={handleOnchange}
        renderDay={dayViewRender}
      />
    </div>
  );
};
