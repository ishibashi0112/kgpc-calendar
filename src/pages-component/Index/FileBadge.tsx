import "dayjs/locale/ja";

import { Badge, Loader, Menu, Modal } from "@mantine/core";
import { IconFileDots, IconFileExport } from "@tabler/icons";
import React, { FC, useCallback, useState } from "react";
import { fileDownload } from "src/lib/firebase/storage";
import { PostUser } from "src/type/types";

export const FileBadge: FC<{ post: PostUser<string> }> = ({ post }) => {
  const badgeProps = {
    className: "cursor-pointer px-1",
    variant: post.file ? "filled" : "light",
    color: post.file ? "dark" : "gray",
    leftSection: post.file ? (
      <div className="flex items-center">
        <IconFileDots size={16} />
      </div>
    ) : null,
  } as const;

  const [isLoading, setIsLoading] = useState(false);
  const [opened, setOpend] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handleOnOpen = useCallback(
    async (filePath: string | undefined): Promise<void> => {
      if (!filePath) return;

      try {
        setIsLoading(true);
        const url = await fileDownload(filePath);
        setFileUrl(url);
      } catch (error) {
        alert("添付ファイルを取得できませんでした。");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  if (!post.file) {
    return <Badge {...badgeProps}>添付無し</Badge>;
  }

  return (
    <>
      <Menu
        withArrow
        position="bottom-end"
        onOpen={() => handleOnOpen(post.file?.path)}
      >
        <Menu.Target>
          <Badge {...badgeProps}>添付有り</Badge>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            icon={<IconFileExport size={16} />}
            onClick={() => setOpend(true)}
          >
            {post.file.name}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <Modal
        opened={opened}
        fullScreen
        padding="xs"
        onClose={() => setOpend(false)}
      >
        {isLoading ? (
          <Loader size="sm" />
        ) : fileUrl ? (
          <iframe src={fileUrl} width="100%" height="800px"></iframe>
        ) : (
          "添付ファイルを取得できませんでした。"
        )}
      </Modal>
    </>
  );
};
