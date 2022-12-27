import dayjs from "dayjs";
import { GetServerSideProps, NextPage } from "next";
import React from "react";
import { getPost, PostUser } from "src/lib/firebase/firestore";
import { PostIdBody } from "src/pages-component/post/PostIdBody";
import { Layout } from "src/pages-Layout/Layout";

type Props = {
  post: PostUser<string>;
};

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  try {
    const post = await getPost(ctx.params.id);

    const dateToStringPost = {
      ...post,
      date: dayjs(post.date).format("YY年MM月DD日"),
    };

    return { props: { post: dateToStringPost } };
  } catch (error) {
    console.log(error);

    return { props: { post: {} } };
  }
};

const PostId: NextPage<Props> = ({ post }) => {
  return (
    <Layout>
      <PostIdBody post={post} />
    </Layout>
  );
};

export default PostId;
