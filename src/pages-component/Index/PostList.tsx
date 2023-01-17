import "dayjs/locale/ja";

import { Anchor, Badge, Group, Text } from "@mantine/core";
import { IconUser } from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC } from "react";
import { PostStateIcon } from "src/component/PostStateIcon";
import { PostUser } from "src/type/types";

import { FileBadge } from "./FileBadge";

type Props = {
  post: PostUser<string>;
};

export const PostList: FC<Props> = ({ post }) => {
  const { pathname } = useRouter();

  return (
    <Group key={post.id} position="apart" align="center" noWrap>
      <Group spacing="sm">
        <PostStateIcon post={post} />
        {pathname === "/" ? (
          <Anchor
            className="flex-1"
            variant="text"
            component={Link}
            href={`/post/${post.id}`}
            lineClamp={1}
          >
            {post.title}
          </Anchor>
        ) : (
          <Text className="max-w-[450px] flex-1" lineClamp={1}>
            {post.title}
          </Text>
        )}
      </Group>

      <Group spacing="sm" noWrap>
        <FileBadge post={post} />

        <Badge
          classNames={{ root: "pl-0", leftSection: "mx-1" }}
          variant="filled"
          color="gray"
          title="作成者"
          leftSection={
            <Group position="center">
              <IconUser size={14} />
            </Group>
          }
        >{`${post.user.name.slice(0, 3)}`}</Badge>
      </Group>
    </Group>
  );
};
