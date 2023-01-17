import "dayjs/locale/ja";

import {
  ActionIcon,
  Alert,
  Button,
  Card,
  CloseButton,
  FileInput,
  Group,
  LoadingOverlay,
  MultiSelect,
  Popover,
  Space,
  Stack,
  Text,
  Textarea,
  TextInput,
  Timeline,
  Title,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import {
  IconAlertCircle,
  IconCalendar,
  IconCircleCheck,
  IconPlus,
  IconStackPop,
  IconUserPlus,
} from "@tabler/icons";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { FC, useState } from "react";
import { updatePost } from "src/lib/firebase/firestore";
import { fileUpload } from "src/lib/firebase/storage";
import { state } from "src/lib/store/valtio";
import { FormValues } from "src/type/formType";
import { PostUser, User } from "src/type/types";
import { useSnapshot } from "valtio";

import { initialProcessData, transformValues } from "./FormBody";
import { formSchema, transformedEditFormSchema } from "./schema/zodSchema";
import { SelectItem } from "./SecondStep";

type Props = {
  users: User[];
  post: PostUser<string>;
};

export const EditFormBody: FC<Props> = ({ users, post }) => {
  const { push } = useRouter();
  const { user } = useSnapshot(state);
  const [isLoading, setIsLoading] = useState(false);

  const usersSelectData = users.map((user) => {
    return {
      value: user.name,
      label: user.name,
      type: user.type,
    };
  });

  const formatedProcesses = post.processes.map((process) => {
    const newUsers = process.users.map((user) => user.name);
    return {
      ...process,
      updatedAt: dayjs(process.updatedAt).toDate(),
      users: newUsers,
    };
  });

  const form = useForm<FormValues<string>>({
    validate: zodResolver(formSchema),
    validateInputOnBlur: true,
    initialValues: {
      date: dayjs(post.date).toDate(),
      title: post.title,
      file: post.file,
      description: post.description,
      processes: formatedProcesses,
    },
  });

  const handleSubmit = async (values: typeof form.values): Promise<void> => {
    setIsLoading(true);
    console.log(123);

    if (!user) return;
    //formvalueの整形
    const transformedValues = transformValues(users, values);

    try {
      //zod parse
      const parsed = transformedEditFormSchema.parse(transformedValues);

      // ファイルアップロード処理
      let filePath = null;
      if (parsed.file instanceof File) {
        filePath = `${dayjs().format("YYYYMMDDhhmmss")}_${parsed.file.name}`;
        await fileUpload(parsed.file, filePath);
      }

      const postData = {
        ...parsed,
        isCompleted: false,
        userId: user.id,
        file: filePath,
      };
      console.log(postData);
      // firestore post送信
      await updatePost(post.id, postData);
      alert("予定の更新が完了しました。");

      await push("/");
    } catch (error) {
      console.log(error);
      alert("errorが発生しました。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-3  pb-10">
      <Title className="mb-5" order={5}>
        予定編集
      </Title>

      <Alert
        className="my-3 flex justify-center"
        color="gray"
        icon={<IconAlertCircle />}
      >
        以下の内容で登録してもよろしいでしょうか？
      </Alert>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Group position="center">
            <Text fz="sm">基本情報</Text>
          </Group>
          <Card className="py-3 overflow-visible" shadow="xs" withBorder>
            <Stack spacing={5}>
              <Group position="center">
                <Text className="min-w-[100px]" align="end">
                  日付
                </Text>

                <DatePicker
                  className="flex-grow "
                  locale="ja"
                  firstDayOfWeek="sunday"
                  inputFormat="YYYY/MM/DD"
                  labelFormat="YYYY/MM"
                  icon={<IconCalendar size={16} />}
                  {...form.getInputProps("date")}
                />
              </Group>

              <Group position="center">
                <Text className="min-w-[100px]" align="end">
                  件名
                </Text>

                <TextInput
                  className="flex-grow "
                  {...form.getInputProps("title")}
                />
              </Group>

              <Group>
                <Text className="min-w-[100px]" align="end">
                  添付資料
                </Text>
                {form.values.file ? (
                  <div className="flex-grow ">{form.values.file}</div>
                ) : (
                  <FileInput className="flex-grow " />
                )}
              </Group>

              <Group>
                <Text className="min-w-[100px]" align="end">
                  内容
                </Text>

                <Textarea
                  classNames={{ root: "flex-grow ", input: "min-h-[150px]" }}
                  autosize
                  {...form.getInputProps("description")}
                />
              </Group>
            </Stack>
          </Card>

          <Group position="center">
            <Text fz="sm">工程情報</Text>

            <Popover position="bottom-end">
              <Popover.Target>
                <ActionIcon variant="outline">
                  <IconStackPop size={16} />
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown>
                <Group position="center">
                  <Timeline
                    active={form.values.processes.length}
                    bulletSize={18}
                    lineWidth={4}
                  >
                    {form.values.processes.map((process, index) => (
                      <Timeline.Item key={index} title={process.title}>
                        <Text size="sm">
                          備考：
                          {process.description
                            ? process.description
                            : "特になし"}
                        </Text>
                        <Text size="xs" mt={4}>
                          担当者：
                          {process.users.map((user) => user)}
                        </Text>
                      </Timeline.Item>
                    ))}
                    <Timeline.Item title="完了"></Timeline.Item>
                  </Timeline>
                </Group>
              </Popover.Dropdown>
            </Popover>
          </Group>

          {form.values.processes.map((process, index) => (
            <Card
              className="overflow-visible"
              shadow="xs"
              key={index}
              withBorder
            >
              <Group position="apart">
                <Text fz="sm">{`工程${index + 1}`}</Text>

                {form.values.processes.length > 1 && (
                  <CloseButton
                    className="active:translate-y-0"
                    onClick={() => form.removeListItem("processes", index)}
                  />
                )}
              </Group>

              <Space h={10} />

              <Stack spacing={5}>
                <Group>
                  <Text className="min-w-[100px]" align="end">
                    工程名
                  </Text>

                  <TextInput
                    className="flex-grow "
                    {...form.getInputProps(`processes.${index}.title`)}
                  />
                </Group>

                <Group>
                  <Text className="min-w-[100px]" align="end">
                    備考
                  </Text>

                  <TextInput
                    className="flex-grow "
                    {...form.getInputProps(`processes.${index}.description`)}
                  />
                </Group>

                <Group>
                  <Text className="min-w-[100px]" align="end">
                    担当者
                  </Text>

                  <MultiSelect
                    className="flex-grow "
                    data={usersSelectData}
                    itemComponent={SelectItem}
                    classNames={{ label: "text-xs" }}
                    placeholder="Pick all you like"
                    withAsterisk
                    searchable
                    nothingFound="Nothing found"
                    icon={<IconUserPlus size={12} />}
                    {...form.getInputProps(`processes.${index}.users`)}
                  />
                </Group>
              </Stack>
            </Card>
          ))}
        </Stack>

        <Space h={10} />

        <Group position="right">
          <Button
            size="xs"
            variant="subtle"
            onClick={() => form.insertListItem("processes", initialProcessData)}
            leftIcon={<IconPlus size={14} />}
          >
            工程追加
          </Button>
        </Group>

        {Object.keys(form.errors).length ? (
          <Group position="center">
            <Text fz="sm" color="red">
              {`${Object.keys(form.errors).length}件のエラーがあります。`}
            </Text>
          </Group>
        ) : null}

        <Space h={30} />

        <Group position="center">
          <Button
            color="green"
            rightIcon={<IconCircleCheck size={16} />}
            type="submit"
            loading={isLoading}
            loaderPosition="center"
          >
            保存する
          </Button>
        </Group>
      </form>

      <LoadingOverlay visible={isLoading} />
    </div>
  );
};
