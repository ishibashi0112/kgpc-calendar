import "dayjs/locale/ja";

import { GetServerSideProps, NextPage } from "next";
import React from "react";
import { getPosts } from "src/lib/firebase/firestore";
import { formatPosts } from "src/lib/utils/function";
import { IndexBody } from "src/pages-component/Index/IndexBody";
import { Layout } from "src/pages-Layout/Layout";
import { PostUser } from "src/type/types";
import { SWRConfig } from "swr";

type Props = {
  fallback: { "/posts": PostUser<string>[] };
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const posts = await getPosts();
    const dateToStringInPosts = formatPosts(posts);

    return {
      props: {
        fallback: {
          "/posts": dateToStringInPosts,
        },
      },
    };
  } catch (error) {
    console.log(error);
    return { props: {} };
  }
};

const Home: NextPage<Props> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <Layout>
        <IndexBody />
      </Layout>
    </SWRConfig>
  );
};

export default Home;
