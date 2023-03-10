import "dayjs/locale/ja";

import {
  Button,
  Card,
  FileInput,
  Group,
  LoadingOverlay,
  Space,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { zodResolver } from "@mantine/form";
import { IconCalendar, IconFile } from "@tabler/icons";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { FC, useCallback, useState } from "react";
import { MainButton } from "src/component/MainButton";
import { updatePost } from "src/lib/firebase/firestore";
import { deleteFile } from "src/lib/firebase/storage";
import { usePosts } from "src/lib/hook/swr/usePosts";
import { useUsers } from "src/lib/hook/swr/useUsers";
import { state } from "src/lib/store/valtio";
import { PostUser } from "src/type/types";
import { useSnapshot } from "valtio";

import { EditFormProvider, useEditForm } from "./context/formContext";
import { fileUpload, initialProcessData, transformValues } from "./FormBody";
import { ProcessesInputCard } from "./ProcessInputCard";
import { editFormSchema, transformedEditFormSchema } from "./schema/zodSchema";

type Props = {
  post: PostUser<string>;
};

export const EditFormBody: FC<Props> = (props) => {
  const { push } = useRouter();
  const { user } = useSnapshot(state);
  const { mutate: postsMutate } = usePosts();
  const { users } = useUsers();
  const [isLoading, setIsLoading] = useState(false);

  const formatedProcesses = props.post.processes.map((process) => {
    const newUsers = process.users.map((user) => user.name);
    return {
      ...process,
      updatedAt: dayjs(process.updatedAt).toDate(),
      users: newUsers,
    };
  });

  const form = useEditForm({
    initialValues: {
      date: dayjs(props.post.date).toDate(),
      title: props.post.title,
      prevFile: props.post.file ? props.post.file.name : "",
      updatedFile: null,
      description: props.post.description,
      processes: formatedProcesses,
    },
    validate: zodResolver(editFormSchema),
    validateInputOnBlur: true,
  });

  const handleSubmit = useCallback(
    async (values: typeof form.values): Promise<void> => {
      setIsLoading(true);

      try {
        if (!user)
          throw new Error("???????????????????????????????????????????????????????????????");
        if (!users) throw new Error("?????????????????????????????????????????????????????????");

        //formvalue?????????
        const transformedValues = transformValues(users, values);

        //zod parse
        const parsed = transformedEditFormSchema.parse(transformedValues);

        // ????????????????????????
        if (props.post.file && parsed.updatedFile) {
          console.log("koko");
          await deleteFile(props.post.file.path);
        }
        console.log(123);

        // // ????????????????????????????????????
        const file = await fileUpload(parsed.updatedFile);

        const { updatedFile, prevFile, ...excludedFileValues } = parsed;

        const postData = {
          ...excludedFileValues,
          createdAt: dayjs(props.post.createdAt).toDate(),
          isCompleted: false,
          userId: user.id,
          file: file ? file : props.post.file,
        };
        console.log(postData);
        // firestore post??????
        await updatePost(props.post.id, postData);
        await postsMutate();
        alert("???????????????????????????????????????");

        await push("/");
      } catch (error) {
        console.log(error);
        alert("error????????????????????????");
      } finally {
        setIsLoading(false);
      }
    },
    [user, users, props]
  );

  return (
    <div>
      <Title className="mb-5" order={5}>
        ????????????
      </Title>

      <EditFormProvider form={form}>
        <Card>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <DatePicker
                label="??????"
                withAsterisk
                locale="ja"
                firstDayOfWeek="sunday"
                inputFormat="YYYY/MM/DD"
                labelFormat="YYYY/MM"
                icon={<IconCalendar size={18} />}
                {...form.getInputProps("date")}
              />
              <TextInput
                label="??????"
                withAsterisk
                {...form.getInputProps("title")}
              />

              <Textarea
                label="??????"
                placeholder="???????????????????????????????????????????????????"
                autosize
                withAsterisk
                {...form.getInputProps("description")}
              />

              <FileInput
                classNames={{ description: "text-black" }}
                label="????????????"
                description={
                  form.values.prevFile ? `??????${form.values.prevFile}` : null
                }
                placeholder=".pdf .xlsx "
                icon={<IconFile size={18} />}
                accept="application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                {...form.getInputProps("updatedFile")}
              />

              <div>
                <Text fz="sm" mb={1}>
                  ????????????
                </Text>

                <Stack>
                  {form.values.processes.map((process, index) => (
                    <ProcessesInputCard
                      key={index}
                      process={process}
                      index={index}
                    />
                  ))}
                </Stack>

                <Space h={5} />

                <Group position="right">
                  <Button
                    size="xs"
                    variant="light"
                    color="dark"
                    onClick={() =>
                      form.insertListItem("processes", initialProcessData)
                    }
                  >
                    ????????????
                  </Button>
                </Group>
              </div>

              {Object.keys(form.errors).length ? (
                <Group position="center">
                  <Text fz="sm" color="red">
                    {`${Object.keys(form.errors).length}?????????????????????????????????`}
                  </Text>
                </Group>
              ) : null}

              <MainButton fullWidth type="submit">
                ????????????
              </MainButton>
            </Stack>
          </form>
        </Card>
      </EditFormProvider>

      <LoadingOverlay visible={isLoading} />
    </div>
  );
};
