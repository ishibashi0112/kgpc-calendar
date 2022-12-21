import "dayjs/locale/ja";

import { Badge, Button, Group, List, Text, ThemeIcon } from "@mantine/core";
import { IconCircleCheck, IconFileDots } from "@tabler/icons";
import dayjs from "dayjs";
import Link from "next/link";
import React, { FC } from "react";
import { Post } from "src/lib/firebase/firestore";

type Props = {
  posts: Post[];
  selectedDate: Date | null;
};

export const ScheduleList: FC<Props> = ({ posts, selectedDate }) => {
  const selectedDatePosts = posts.filter(
    (post) =>
      dayjs(selectedDate).format("YYYY-MM-DD") ===
      dayjs(post.date).format("YYYY-MM-DD")
  );

  return (
    <div className="flex-1 p-3">
      <Group className="mb-5" align="self-start">
        <Text>{`${dayjs(selectedDate).format("YY年M月D日")}の予定`}</Text>
        <Button
          className="ml-5"
          compact
          size="xs"
          component={Link}
          href={`/form?date=${dayjs(selectedDate).format("YYYY-MM-DD")}`}
        >
          予定を追加
        </Button>
      </Group>

      <List
        spacing="lg"
        size="sm"
        center
        icon={
          <ThemeIcon color="teal" size={24} radius="xl">
            <IconCircleCheck size={16} />
          </ThemeIcon>
        }
      >
        {selectedDatePosts.map((post) => (
          <List.Item key={post.id}>
            <Group>
              <Link href={`/post/${post.id}`}>{post.title}</Link>
              <Badge
                className="cursor-pointer"
                variant="outline"
                color="dark"
                leftSection={
                  <div className="flex items-center">
                    <IconFileDots size={16} />
                  </div>
                }
              >
                添付無し
              </Badge>
              <Badge variant="outline">作成：石橋</Badge>
            </Group>
          </List.Item>
        ))}
      </List>
    </div>
  );
};
