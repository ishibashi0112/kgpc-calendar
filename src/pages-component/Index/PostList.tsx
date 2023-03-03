import "dayjs/locale/ja";

import { Anchor, Badge, Group, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
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
  const matches = useMediaQuery("(min-width: 890px)", true, {
    getInitialValueInEffect: false,
  });

  return (
    <Group
      key={post.id}
      position="apart"
      align="center"
      noWrap={matches}
      spacing={matches ? "sm" : 5}
    >
      <Group spacing="sm">
        <PostStateIcon post={post} />
        {pathname === "/" ? (
          <Anchor
            className="flex-1 hover:underline"
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

      <Group spacing="sm" noWrap position="right">
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
        >{`${post.user.firstName}`}</Badge>
      </Group>
    </Group>
  );
};
