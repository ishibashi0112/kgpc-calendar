import "dayjs/locale/ja";

import { Alert, Stack } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons";
import React, { FC } from "react";
import { useSnapshot } from "src/lib/hook/useSnapShot";
import { PostUser } from "src/type/types";

import { ListHeader } from "./ListHeader";
import { PostList } from "./PostList";

export const ScheduleList: FC = () => {
  const { selectedDatePosts } = useSnapshot();

  return (
    <div className="flex-1 p-3">
      <ListHeader />

      {selectedDatePosts.length ? (
        <Stack>
          {selectedDatePosts.map((post) => (
            <PostList key={post.id} post={post as PostUser<string>} />
          ))}
        </Stack>
      ) : (
        <Alert color="gray" icon={<IconInfoCircle size={18} />}>
          予定はありません。
        </Alert>
      )}
    </div>
  );
};
