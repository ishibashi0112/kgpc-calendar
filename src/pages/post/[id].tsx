import { Title } from "@mantine/core";
import dayjs from "dayjs";
import { GetServerSideProps, NextPage } from "next";
import React from "react";
import { getPost, Post } from "src/lib/firebase/firestore";
import { Layout } from "src/pages-Layout/Layout";

type Props = {
  post: Post;
};

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  try {
    const post = await getPost(ctx.params.id);
    return { props: { post } };
  } catch (error) {
    console.log(error);

    return { props: {} };
  }
};

const PostId: NextPage<Props> = ({ post }) => {
  return (
    <Layout>
      <div className="p-3">
        <Title className="mb-5" order={4}>
          {`${dayjs(post.date).format("YY年MM月DD日")}　${post.title}`}
        </Title>
      </div>
    </Layout>
  );
};

export default PostId;
