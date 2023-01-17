import "dayjs/locale/ja";

import {
  ActionIcon,
  Alert,
  Button,
  Card,
  Group,
  LoadingOverlay,
  Popover,
  Stack,
  Stepper,
  Table,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import {
  IconAlertCircle,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconCircleCheck,
  IconShieldCheck,
  IconStackPop,
} from "@tabler/icons";
import dayjs from "dayjs";
import React, { FC, useCallback, useState } from "react";
import { ProcessTimeLine } from "src/component/ProcessTimeLine";
import { createPost } from "src/lib/firebase/firestore";
import { fileUpload } from "src/lib/firebase/storage";
import { useSnapshot } from "src/lib/hook/useSnapShot";
import {
  FormValues,
  TransformedEditFormValues,
  TransformedFormValues,
} from "src/type/formType";
import { User } from "src/type/types";
import { useSWRConfig } from "swr";

import { FirstStep } from "./FirstStep";
import { formSchema, transformedSchema } from "./schema/zodSchema";
import { SecondStep } from "./SecondStep";

type Props = {
  users: User[];
};

export const initialProcessData = {
  title: "",
  description: "",
  isCompleted: false,
  updatedAt: dayjs().toDate(),
  users: [],
};

export const transformValues = (
  users: User[],
  values: FormValues | FormValues<string>
): TransformedFormValues | TransformedEditFormValues => {
  const newProcesses = values.processes.map((process) => {
    const newUsers = process.users.map((userName) => {
      const targetUser = users.filter((user) => user.name === userName);
      const { email, ...newuser } = targetUser[0];
      return newuser;
    });

    return { ...process, users: newUsers };
  });

  const newValues = { ...values, processes: newProcesses };

  return newValues;
};

export const FormBody: FC<Props> = ({ users }) => {
  const { user } = useSnapshot();
  const [isLoading, setIsLoading] = useState(false);
  const [active, setActive] = useState(0);
  const { mutate } = useSWRConfig();

  const form = useForm<FormValues>({
    validate: zodResolver(formSchema),
    initialValues: {
      date: dayjs().toDate(),
      title: "",
      file: null,
      description: "",
      processes: [initialProcessData],
    },
  });

  const nextButtonText = !active
    ? "工程入力へ"
    : active === 1
    ? "確認画面へ"
    : "確定";

  const validateAndNext = useCallback(
    (active: 0 | 1): void => {
      //基本情報formのバリデーションチェック
      if (!active) {
        const targetForms = ["date", "title", "description", "file"];
        const errorsArray = targetForms.map(
          (formName) => form.validateField(formName).hasError
        );

        if (errorsArray.includes(true)) return;

        //工程情報form 〃
      } else {
        if (form.validate().hasErrors) return;
      }

      setActive((current) => current + 1);
    },
    [form]
  );

  const submitPost = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    if (!user) return;
    //formvalueの整形
    const transformedValues = transformValues(users, form.values);

    try {
      //zod parse
      const parsed = transformedSchema.parse(transformedValues);

      // ファイルアップロード処理
      let filePath = null;
      if (parsed.file) {
        filePath = `${dayjs().format("YYYYMMDDhhmmss")}_${parsed.file.name}`;
        await fileUpload(parsed.file, filePath);
      }

      //postデータの整形
      const postData = {
        ...parsed,
        isCompleted: false,
        userId: user.id,
        file: filePath,
      };
      // firestore post送信
      await createPost(postData);
      await mutate("/posts");
      alert("予定の作成が完了しました。");
      setActive((current) => current + 1);
    } catch (error) {
      console.log(error);
      alert("errorが発生しました。");
    } finally {
      setIsLoading(false);
    }
  }, [user, form]);

  const handleNextStep = useCallback(async (): Promise<void> => {
    switch (active) {
      case 0:
        validateAndNext(0);
        break;
      case 1:
        validateAndNext(1);
        break;
      case 2:
        await submitPost();
        break;
    }
  }, [form, active]);

  return (
    <div className="p-3  pb-10">
      <Title className="mb-5" order={5}>
        予定作成
      </Title>

      <Stepper
        classNames={{ step: "pointer-events-none" }}
        size="sm"
        active={active}
        onStepClick={setActive}
        breakpoint="sm"
      >
        <Stepper.Step
          label="入力①"
          description={<Text fz="xs">基本情報を入力</Text>}
        >
          <FirstStep form={form} />
        </Stepper.Step>

        <Stepper.Step
          label="入力②"
          description={<Text fz="xs">工程情報を入力</Text>}
        >
          <SecondStep users={users} form={form} />
        </Stepper.Step>

        <Stepper.Step
          label="確認"
          icon={<IconShieldCheck size={18} />}
          description={<Text fz="xs">入力値の最終確認。</Text>}
        >
          <Alert
            className="my-3 flex justify-center"
            color="gray"
            icon={<IconAlertCircle />}
          >
            以下の内容で登録してもよろしいでしょうか？
          </Alert>
          <Stack>
            <Group className="" position="center">
              <Text>基本情報</Text>
            </Group>
            <Card className="py-3 " withBorder>
              <Table fontSize="md" horizontalSpacing="xl">
                <tbody>
                  <tr>
                    <td align="right">日付</td>
                    <td>
                      {dayjs(form.values.date)
                        .locale("ja")
                        .format("YY/M/D(dd)")}
                    </td>
                  </tr>
                  <tr>
                    <td align="right">件名</td>
                    <td>
                      <TextInput
                        variant="unstyled"
                        defaultValue={form.values.title}
                        readOnly
                      />
                    </td>
                  </tr>
                  <tr>
                    <td align="right">添付資料</td>
                    <td>{form.values.file ? form.values.file.name : "なし"}</td>
                  </tr>
                  <tr className="">
                    <td align="right">内容</td>
                    <td>
                      <Textarea
                        classNames={{ input: "min-h-[150px]" }}
                        variant="unstyled"
                        defaultValue={form.values.description}
                        autosize
                        readOnly
                      />
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card>

            <Group className="" position="center">
              <Text>工程情報</Text>

              <Popover position="bottom-end">
                <Popover.Target>
                  <ActionIcon variant="outline">
                    <IconStackPop size={16} />
                  </ActionIcon>
                </Popover.Target>
                <Popover.Dropdown>
                  <ProcessTimeLine
                    processes={form.values.processes}
                    processNum={form.values.processes.length}
                  />
                </Popover.Dropdown>
              </Popover>
            </Group>

            {form.values.processes.map((process, index) => (
              <Card key={index} withBorder>
                <Group className="mb-5" position="center">
                  <Text>{`工程${index + 1}`}</Text>
                </Group>
                <Table fontSize="md" horizontalSpacing="xl">
                  <tbody>
                    <tr>
                      <td align="right">工程名</td>
                      <td>
                        <TextInput
                          variant="unstyled"
                          defaultValue={process.title}
                          readOnly
                        />
                      </td>
                    </tr>
                    <tr>
                      <td align="right">備考</td>
                      <td>
                        <TextInput
                          variant="unstyled"
                          defaultValue={process.description}
                          readOnly
                        />
                      </td>
                    </tr>
                    <tr>
                      <td align="right">担当者</td>
                      <td>
                        {process.users.map((user, index) => (
                          <div key={index} className="inline mr-2">
                            {user}
                          </div>
                        ))}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card>
            ))}
          </Stack>
        </Stepper.Step>
        <Stepper.Completed>完了しました。</Stepper.Completed>
      </Stepper>

      {active < 3 ? (
        <Group className="mt-10" position="center">
          {active > 0 && (
            <Button
              variant="default"
              leftIcon={<IconArrowBackUp size={16} />}
              onClick={() => setActive((current) => current - 1)}
            >
              前へ戻る
            </Button>
          )}
          <Button
            color={active === 2 ? "green" : "blue"}
            rightIcon={
              active === 2 ? (
                <IconCircleCheck size={16} />
              ) : (
                <IconArrowForwardUp size={16} />
              )
            }
            onClick={handleNextStep}
          >
            {nextButtonText}
          </Button>
        </Group>
      ) : null}

      <LoadingOverlay visible={isLoading} />
    </div>
  );
};
