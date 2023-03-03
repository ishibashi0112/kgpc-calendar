import { GetServerSideProps, NextPage } from "next";
import React from "react";
import { getPostById } from "src/lib/firebase/server/firestore";
import { formatPost } from "src/lib/utils/function";
import { PostIdBody } from "src/pages-component/post/PostIdBody";
import { Layout } from "src/pages-Layout/Layout";
import { PostUser } from "src/type/types";
import { SWRConfig } from "swr";

type Props = {
  fallback: Record<string, PostUser<string>>;
};

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  const postId = ctx.params.id as string;
  try {
    const post = await getPostById(postId);
    const dateToStringPost = formatPost(post);

    return { props: { fallback: { [`/post/${postId}`]: dateToStringPost } } };
  } catch (error) {
    console.log(error);

    return { props: { fallback: { [`/post/${postId}`]: {} } } };
  }
};

const PostId: NextPage<Props> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <Layout size="lg">
        <PostIdBody />
      </Layout>
    </SWRConfig>
  );
};

export default PostId;
