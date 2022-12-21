import "dayjs/locale/ja";

import { Indicator } from "@mantine/core";
import { Calendar as MantineCalendar } from "@mantine/dates";
import dayjs from "dayjs";
import React, { FC, ReactNode, useCallback } from "react";
import { Post } from "src/lib/firebase/firestore";

type Props = {
  posts: Post[];
  selectedDate: Date | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>;
};

export const Calendar: FC<Props> = ({
  posts,
  selectedDate,
  setSelectedDate,
}) => {
  const dayViewRender = useCallback(
    (date: Date): ReactNode => {
      const day = date.getDate();
      const calendarDateStr = dayjs(date).format("YYYY-MM-DD");

      const postsInDate = posts.filter((post) => {
        const postDateStr = dayjs(post.date).format("YYYY-MM-DD");
        return calendarDateStr === postDateStr;
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
        onChange={setSelectedDate}
        renderDay={dayViewRender}
      />
    </div>
  );
};
