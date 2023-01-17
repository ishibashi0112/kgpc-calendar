import { Group, Space, Text, Textarea } from "@mantine/core";
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
      <div className="flex-1 p-3">
        <ListHeader />
        <div>post情報が取得できませんでした。</div>
      </div>
    );

  return (
    <div className="flex-1 p-3">
      <ListHeader />

      <PostList post={post} />

      <Group position="right">
        <Text fz="xs">{`作成日: ${22 / 12 / 25}`}</Text>
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
    </div>
  );
};
