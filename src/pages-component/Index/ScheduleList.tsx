import "dayjs/locale/ja";

import { Button, Group, Stack, Text } from "@mantine/core";
import dayjs from "dayjs";
import Link from "next/link";
import React, { FC } from "react";
import { PostUser } from "src/lib/firebase/firestore";
import { state } from "src/lib/store/valtio";
import { useSnapshot } from "valtio";

import { PostList } from "./PostList";

type Props = {
  posts: PostUser<string>[];
};

export const ScheduleList: FC<Props> = ({ posts }) => {
  const snap = useSnapshot(state);
  const selectedDatePosts = posts.filter(
    (post) => dayjs(snap.selectedDate).format("YYYY-MM-DD") === post.date
  );

  return (
    <div className="flex-1 p-3">
      <Group className="mb-5" align="center">
        <Text>{`${dayjs(snap.selectedDate).format("YY年M月D日")}の予定`}</Text>
        <Button
          className="ml-5"
          compact
          size="xs"
          component={Link}
          href={`/form?date=${dayjs(snap.selectedDate).format("YYYY-MM-DD")}`}
        >
          予定を追加
        </Button>
      </Group>

      <Stack>
        {selectedDatePosts.map((post) => (
          <PostList key={post.id} post={post} />
        ))}
      </Stack>
    </div>
  );
};
