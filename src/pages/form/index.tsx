import "dayjs/locale/ja";

import { Button, FileInput, Textarea, TextInput, Title } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import { GetServerSideProps, NextPage } from "next";
import React, { useCallback, useState } from "react";
import { auth } from "src/lib/firebase/firebase";
import { createPost } from "src/lib/firebase/firestore";
import { Layout } from "src/pages-Layout/Layout";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return { props: { date: ctx.query.date } };
};

type Props = {
  date: string;
};

type FormValues = {
  date: Date;
  title: string;
  file: File | null;
  description: string;
};

const Form: NextPage<Props> = ({ date }) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormValues>({
    initialValues: {
      date: dayjs(date).toDate(),
      title: "",
      file: null,
      description: "",
    },
  });
  const currentUserId = auth.currentUser?.uid;

  const handleSubmit = useCallback(
    async (values: typeof form.values) => {
      setIsLoading(true);

      if (!currentUserId) {
        return;
      }
      try {
        const data = { ...values, isCompleted: false, userId: currentUserId };
        await createPost(data);
      } catch (error) {
        console.log(error);
        alert("予定登録でエラーが発生しました");
      } finally {
        setIsLoading(false);
      }
    },
    [currentUserId]
  );

  return (
    <Layout>
      <div className="p-3">
        <Title className="mb-5" order={4}>
          予定作成
        </Title>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.onSubmit(handleSubmit)}
        >
          <DatePicker
            label="日付"
            locale="ja"
            firstDayOfWeek="sunday"
            inputFormat="YYYY/MM/DD"
            labelFormat="YYYY/MM"
            {...form.getInputProps("date")}
          />
          <TextInput label="件名" {...form.getInputProps("title")} />
          <FileInput label="添付資料" {...form.getInputProps("file")} />
          <Textarea
            classNames={{ input: "min-h-[200px]" }}
            label="内容"
            {...form.getInputProps("description")}
          />
          <Button
            className="block w-full mt-5"
            type="submit"
            loading={isLoading}
          >
            予定を作成
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default Form;
