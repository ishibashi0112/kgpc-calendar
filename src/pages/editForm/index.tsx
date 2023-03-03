import "dayjs/locale/ja";

import { GetServerSideProps, NextPage } from "next";
import React from "react";
import { getPostById, getUsers } from "src/lib/firebase/server/firestore";
import { formatPost } from "src/lib/utils/function";
import { EditFormBody } from "src/pages-component/form/EditFormBody ";
import { Layout } from "src/pages-Layout/Layout";
import { PostUser, User } from "src/type/types";
import { SWRConfig } from "swr";

type Props = {
  fallback: {
    users: User[];
  };
  post: PostUser<string>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const postid = ctx.query.id as string;

  try {
    const users = await getUsers();
    const post = await getPostById(postid);
    const formatedPost = formatPost(post);

    return {
      props: {
        fallback: {
          users,
        },
        post: formatedPost,
      },
    };
  } catch (error) {
    return { props: { fallback: { users: [] }, post: null } };
  }
};

const EditForm: NextPage<Props> = ({ fallback, post }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <Layout size="md">
        <EditFormBody post={post} />
      </Layout>
    </SWRConfig>
  );
};

export default EditForm;
