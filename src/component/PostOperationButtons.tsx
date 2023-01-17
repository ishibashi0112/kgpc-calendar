import { ActionIcon, Button, Group, Tooltip } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons";
import Link from "next/link";
import React, { FC } from "react";
import { state } from "src/lib/store/valtio";
import { PostUser } from "src/type/types";
import { useSnapshot } from "valtio";

type Props = {
  post: PostUser<string>;
  IconOnly?: boolean;
  modalOpen: (post: PostUser<string>) => void;
};

export const PostOperationButtons: FC<Props> = ({
  post,
  IconOnly = false,
  modalOpen,
}) => {
  const { user } = useSnapshot(state);

  const isProcessing = post.processes.some((process) => process.isCompleted);

  if (!user) return <></>;

  if (user.id !== post.user.id) return <></>;

  return (
    <Tooltip
      label="処理の途中で変更を加えることはできません。"
      position="top-end"
      openDelay={500}
      disabled={!isProcessing}
    >
      {IconOnly ? (
        <Group spacing={4} noWrap>
          <Tooltip label="編集" openDelay={500}>
            <ActionIcon
              disabled={isProcessing}
              component={Link}
              href={`/editForm?id=${post.id}`}
            >
              <IconPencil size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="削除" openDelay={500}>
            <ActionIcon
              color="red"
              onClick={() => modalOpen(post as PostUser<string>)}
              disabled={isProcessing}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      ) : (
        <Group position="right">
          <Button
            variant="light"
            color="gray"
            leftIcon={<IconPencil size={16} />}
            disabled={isProcessing}
            component={Link}
            href={`/editForm?id=${post.id}`}
          >
            編集
          </Button>
          <Button
            variant="light"
            color="red"
            leftIcon={<IconTrash size={16} />}
            onClick={() => modalOpen(post as PostUser<string>)}
            disabled={isProcessing}
          >
            削除
          </Button>
        </Group>
      )}
    </Tooltip>
  );
};
