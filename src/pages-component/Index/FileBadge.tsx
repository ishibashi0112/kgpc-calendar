import "dayjs/locale/ja";

import { Badge, BadgeVariant, Loader, Menu, Text } from "@mantine/core";
import { IconDownload, IconFileDots } from "@tabler/icons";
import React, { FC, useEffect, useState } from "react";
import { PostUser } from "src/lib/firebase/firestore";
import { fileDownload } from "src/lib/firebase/storage";

export const FileBadge: FC<{ post: PostUser<string> }> = ({ post }) => {
  const [file, setFile] = useState("");

  const badgeProps = {
    className: "cursor-pointer px-1",
    variant: "outline" as BadgeVariant,
    color: post.file ? "blue" : "gray",
    leftSection: (
      <div className="flex items-center">
        <IconFileDots size={16} />
      </div>
    ),
  };

  useEffect(() => {
    if (post.file) {
      const getUrl = async () => {
        if (!post.file) {
          return;
        }
        const fileURL = await fileDownload(post.file);
        setFile(fileURL);
      };
      getUrl();
    }
  }, []);

  if (!post.file) {
    return <Badge {...badgeProps}>添付無し</Badge>;
  }

  return (
    <Menu withArrow>
      <Menu.Target>
        <Badge {...badgeProps}>添付有り</Badge>
      </Menu.Target>
      <Menu.Dropdown>
        {file ? (
          <>
            <Menu.Item
              icon={<IconDownload size={14} />}
              component="a"
              href={file}
              download
            >
              <Text fz="xs">ファイルを開く</Text>
            </Menu.Item>
            <Menu.Item
              icon={<IconDownload size={14} />}
              component="a"
              href={file}
              download
            >
              <Text fz="xs">ダウンロード</Text>
            </Menu.Item>
          </>
        ) : (
          <Loader size="xs" />
        )}
      </Menu.Dropdown>
    </Menu>
  );
};
