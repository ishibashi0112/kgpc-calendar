import "dayjs/locale/ja";

import { Alert, Card, Divider, Space, Stack } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons";
import React, { FC } from "react";
import { useSnapshot } from "src/lib/hook/useSnapShot";
import { PostUser } from "src/type/types";

import { ListHeader } from "./ListHeader";
import { PostList } from "./PostList";

export const ScheduleList: FC = () => {
  const { selectedDatePosts } = useSnapshot();

  const unCompletedPosts = selectedDatePosts.filter(
    (post) => !post.isCompleted
  );
  const completedPosts = selectedDatePosts.filter((post) => post.isCompleted);

  if (!selectedDatePosts.length) {
    return (
      <Card className="flex-1 min-h-[500px] overflow-visible" shadow="xs">
        <ListHeader />
        <Alert color="gray" icon={<IconInfoCircle size={18} />}>
          予定はありません。
        </Alert>
      </Card>
    );
  }

  return (
    <Card className="min-h-[500px] overflow-visible" shadow="xs">
      <ListHeader />

      {completedPosts.length ? <Divider my="xs" label="未完" /> : null}

      <Stack>
        {unCompletedPosts.map((post) => (
          <PostList key={post.id} post={post as PostUser<string>} />
        ))}
      </Stack>

      {completedPosts.length ? (
        <>
          <Space h={20} />
          <Divider my="xs" label="完了" />
          <Stack>
            {completedPosts.map((post) => (
              <PostList key={post.id} post={post as PostUser<string>} />
            ))}
          </Stack>
        </>
      ) : null}
    </Card>
  );
};
