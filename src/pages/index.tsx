import "dayjs/locale/ja";

import { GetServerSideProps, NextPage } from "next";
import React from "react";
import { getPosts, Post } from "src/lib/firebase/firestore";
import { IndexBody } from "src/pages-component/Index/IndexBody";
import { Layout } from "src/pages-Layout/Layout";

type Props = {
  posts: Post[];
};

export const getServerSideProps: GetServerSideProps = async () => {
  const posts = await getPosts();
  return {
    props: {
      posts,
    },
  };
};

const Home: NextPage<Props> = ({ posts }) => {
  return (
    <Layout>
      <IndexBody posts={posts} />
    </Layout>
  );
};

export default Home;
