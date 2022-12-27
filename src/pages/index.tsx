import "dayjs/locale/ja";

import dayjs from "dayjs";
import { GetServerSideProps, NextPage } from "next";
import React from "react";
import { getPosts, PostUser } from "src/lib/firebase/firestore";
import { state } from "src/lib/store/valtio";
import { IndexBody } from "src/pages-component/Index/IndexBody";
import { Layout } from "src/pages-Layout/Layout";

type Props = {
  posts: PostUser<string>[];
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const posts = await getPosts();
    const dateToStringInPosts = posts.map((post) => {
      return { ...post, date: dayjs(post.date).format("YYYY-MM-DD") };
    });

    return {
      props: {
        posts: dateToStringInPosts,
      },
    };
  } catch (error) {
    console.log(error);
    return { props: { posts: [] } };
  }
};

const Home: NextPage<Props> = ({ posts }) => {
  state.posts = posts;
  return (
    <Layout>
      <IndexBody posts={posts} />
    </Layout>
  );
};

export default Home;
