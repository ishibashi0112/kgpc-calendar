import "dayjs/locale/ja";

import { GetServerSideProps, NextPage } from "next";
import React from "react";
import { getUsers } from "src/lib/firebase/firestore";
import { FormBody } from "src/pages-component/form/FormBody";
import { Layout } from "src/pages-Layout/Layout";
import { User } from "src/type/types";

type Props = {
  users: User[];
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const users = await getUsers();

    return {
      props: { users },
    };
  } catch (error) {
    return { props: { users: [], date: ctx.query.date } };
  }
};

const Form: NextPage<Props> = (props) => {
  return (
    <Layout>
      <FormBody {...props} />
    </Layout>
  );
};

export default Form;
