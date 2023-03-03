import {
  Anchor,
  Badge,
  Card,
  Group,
  Loader,
  Space,
  Stack,
  Tabs,
  Text,
} from "@mantine/core";
import dayjs from "dayjs";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import React from "react";
import { PostOperationButtons } from "src/component/PostOperationButtons";
import { getPostsByUserId } from "src/lib/firebase/server/firestore";
import { useDeleteModal } from "src/lib/hook/useDeleteModal";
import { useSnapshot } from "src/lib/hook/useSnapShot";
import { formatPosts } from "src/lib/utils/function";
import { Layout } from "src/pages-Layout/Layout";
import { PostUser } from "src/type/types";

type Props = {
  posts: PostUser<string>[];
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const userId = ctx.query.id as string;
  console.log("userId", userId);

  try {
    const posts = await getPostsByUserId(userId);
    console.log("posts", posts);

    const dateToStringPosts = formatPosts(posts);

    return { props: { posts: dateToStringPosts } };
  } catch (error) {
    console.log(error);

    return { props: { posts: [] } };
  }
};

const User: NextPage<Props> = (props) => {
  const { modalOpen, ModalComponent } = useDeleteModal();
  const { user } = useSnapshot();

  if (!user) {
    return (
      <Group position="center" mt={10}>
        <Loader />
      </Group>
    );
  }

  return (
    <Layout size="sm">
      <div className="p-2">
        <div className="flex-1">
          <Group>
            <Text fz="lg" fw="bold">
              {user?.name}
            </Text>
            <Badge>{user?.type}</Badge>
          </Group>

          <Text>{user?.email}</Text>
        </div>

        <Space h={20} />

        <Tabs defaultValue="予定">
          <Tabs.List>
            <Tabs.Tab value="予定">予定</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="予定" pt="xs">
            <Space h="xs" />

            <Stack spacing={8}>
              {props.posts.map((post) => (
                <Card
                  key={post.id}
                  className="overflow-visible"
                  shadow="xs"
                  p="sm"
                >
                  <Group>
                    <Text fz="xs" underline>
                      {`予定日: ${dayjs(post.date)
                        .locale("ja")
                        .format("YY年M月D日(dd)")}`}
                    </Text>
                    <Text fz="xs" color="dimmed">
                      {`最終更新: ${dayjs(post.createdAt)
                        .locale("ja")
                        .format("YY/M/D/(dd)")}`}
                    </Text>
                  </Group>

                  <Group className="flex-1" position="apart" noWrap>
                    <Group spacing={5}>
                      {/* <StateIcon post={post as PostUser<string>} /> */}

                      <Anchor
                        className="flex-1"
                        variant="text"
                        component={Link}
                        href={`/post/${post.id}`}
                        lineClamp={1}
                      >
                        {post.title}
                      </Anchor>
                    </Group>

                    <PostOperationButtons
                      post={post as PostUser<string>}
                      modalOpen={modalOpen}
                      IconOnly
                    />
                  </Group>
                </Card>
              ))}
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </div>

      {ModalComponent}
    </Layout>
  );
};

export default User;
