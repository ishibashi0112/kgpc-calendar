import "dayjs/locale/ja";

import { GetServerSideProps, NextPage } from "next";
import React from "react";
import { getUsers } from "src/lib/firebase/server/firestore";
import { FormBody } from "src/pages-component/form/FormBody";
import { Layout } from "src/pages-Layout/Layout";
import { User } from "src/type/types";
import { SWRConfig } from "swr";

type Props = {
  fallback: { users: User[] };
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const users = await getUsers();

    return {
      props: { fallback: { users } },
    };
  } catch (error) {
    return { props: { fallback: { users: [] } } };
  }
};

const Form: NextPage<Props> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <Layout size="md">
        <FormBody />
      </Layout>
    </SWRConfig>
  );
};

export default Form;
