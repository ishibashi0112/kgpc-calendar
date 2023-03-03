import {
  Anchor,
  Avatar,
  Badge,
  Card,
  Group,
  Space,
  Stack,
  Tabs,
  Text,
} from "@mantine/core";
import { IconLogout } from "@tabler/icons";
import dayjs from "dayjs";
import { NextPage } from "next";
import Link from "next/link";
import React from "react";
import { MainButton } from "src/component/MainButton";
import { PostOperationButtons } from "src/component/PostOperationButtons";
import { StateIcon } from "src/component/StateIcon";
import { signOut } from "src/lib/firebase/firebaseAuth";
import { usePosts } from "src/lib/hook/swr/usePosts";
import { useDeleteModal } from "src/lib/hook/useDeleteModal";
import { useSnapshot } from "src/lib/hook/useSnapShot";
import { Layout } from "src/pages-Layout/Layout";
import { PostUser } from "src/type/types";

type Props = {
  fallback: Record<string, PostUser<string>>;
};

// export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
//   const postId = ctx.params.id as string;
//   try {
//     const post = await getPostById(postId);
//     const dateToStringPost = formatPost(post);

//     return { props: { fallback: { [`/post/${postId}`]: dateToStringPost } } };
//   } catch (error) {
//     console.log(error);

//     return { props: { fallback: { [`/post/${postId}`]: {} } } };
//   }
// };

const User: NextPage<Props> = ({ fallback }) => {
  const { modalOpen, ModalComponent } = useDeleteModal();
  const { user } = useSnapshot();
  const { posts, isLoading } = usePosts();

  if (isLoading) {
    return <>Loading...</>;
  }

  const currentUserPosts = posts
    ? posts.filter((post) => post.user.id === user?.id)
    : [];

  const handleSignOut = async () => {
    try {
      const result = window.confirm("ログアウトしますか？");
      if (result) {
        await signOut();
      }
    } catch (error) {
      alert(error);
    }
  };
  return (
    <Layout size="sm">
      <div className="p-2">
        <Group spacing="xl">
          <Avatar className="block" size="xl" color="dark" radius={9999}>
            {user?.firstName}
          </Avatar>
          <div className="flex-1">
            <Group position="apart">
              <Group>
                <Text fz="lg" fw="bold">
                  {user?.name}
                </Text>
                <Badge>{user?.type}</Badge>
              </Group>
              <MainButton
                size="xs"
                leftIcon={<IconLogout size={16} />}
                onClick={handleSignOut}
              >
                ログアウト
              </MainButton>
            </Group>

            <Text>{user?.email}</Text>
          </div>
        </Group>

        <Space h={20} />

        <Tabs color="dark" defaultValue="予定">
          <Tabs.List>
            <Tabs.Tab value="予定">予定</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="予定" pt="xs">
            <Space h="xs" />

            <Stack spacing={8}>
              {currentUserPosts.map((post) => (
                <Card
                  key={post.id}
                  className="overflow-visible"
                  shadow="xs"
                  p="sm"
                >
                  <Group>
                    <Text fz="xs">
                      {dayjs(post.date).locale("ja").format("YY年M月D日(dd)")}
                    </Text>
                    <Group className="flex-1" position="apart" noWrap>
                      <Group spacing={5}>
                        <StateIcon post={post as PostUser<string>} />

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
                  </Group>
                </Card>
              ))}
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </div>
    </Layout>
    // </SWRConfig>
  );
};

export default User;
