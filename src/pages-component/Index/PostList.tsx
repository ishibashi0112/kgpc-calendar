import "dayjs/locale/ja";

import { Avatar, Badge, Group, Text } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC } from "react";
import { PostStateIcon } from "src/component/postStateIcon";
import { PostUser } from "src/lib/firebase/firestore";

import { FileBadge } from "./FileBadge";

type Props = {
  post: PostUser<string>;
};

export const PostList: FC<Props> = ({ post }) => {
  const { pathname } = useRouter();
  return (
    <Group key={post.id} position="apart" align="center">
      <Group spacing="sm">
        <PostStateIcon post={post} />
        {pathname === "/" ? (
          <Link className="block" href={`/post/${post.id}`}>
            {post.title}
          </Link>
        ) : (
          <Text>{post.title}</Text>
        )}
      </Group>

      <Group spacing="sm">
        <FileBadge post={post} />

        <Badge
          className="pl-0"
          variant="filled"
          color="gray"
          leftSection={<Avatar alt="Avatar for badge" size={24} />}
        >{`${post.user.name.slice(0, 3)}`}</Badge>
      </Group>
    </Group>
  );
};
