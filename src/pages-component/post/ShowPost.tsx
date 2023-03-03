import { Card, Group, Space, Text, Textarea } from "@mantine/core";
import dayjs from "dayjs";
import React, { FC } from "react";
import { PostOperationButtons } from "src/component/PostOperationButtons";
import { usePost } from "src/lib/hook/swr/usePost";
import { useDeleteModal } from "src/lib/hook/useDeleteModal";
import { ListHeader } from "src/pages-component/Index/ListHeader";
import { PostList } from "src/pages-component/Index/PostList";

export const ShowPost: FC = () => {
  const { modalOpen, ModalComponent } = useDeleteModal();

  const { post } = usePost();

  if (!post)
    return (
      <Card className="flex-1 min-h-[500px] overflow-visible" shadow="xs">
        <ListHeader />
        <div>post情報が取得できませんでした。</div>
      </Card>
    );

  return (
    <Card className="flex-1 min-h-[500px] overflow-visible" shadow="xs">
      <ListHeader />

      <PostList post={post} />

      <Group position="right">
        <Text fz="xs">{`作成日: ${dayjs(post.createdAt)
          .locale("ja")
          .format("YY年M月D日(dd)")}`}</Text>
      </Group>

      <Space h="xs" />

      <PostOperationButtons post={post} modalOpen={modalOpen} />

      <Space h="xs" />

      <Textarea
        classNames={{ input: "min-h-[300px]" }}
        defaultValue={post.description}
        readOnly
        variant="filled"
      />

      {ModalComponent}
    </Card>
  );
};
