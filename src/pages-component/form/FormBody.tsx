import "dayjs/locale/ja";

import {
  Button,
  Group,
  LoadingOverlay,
  Space,
  Stepper,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { zodResolver } from "@mantine/form";
import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconCheck,
  IconCircleCheck,
  IconShieldCheck,
} from "@tabler/icons";
import dayjs from "dayjs";
import Link from "next/link";
import React, { FC, useCallback, useState } from "react";
import { MainButton } from "src/component/MainButton";
import { createPost } from "src/lib/firebase/firestore";
import { fileUpload as firestorageFileUpload } from "src/lib/firebase/storage";
import { usePosts } from "src/lib/hook/swr/usePosts";
import { useUsers } from "src/lib/hook/swr/useUsers";
import { useSnapshot } from "src/lib/hook/useSnapShot";
import {
  EditFormValues,
  FormValues,
  TransformedEditFormValues,
  TransformedFormValues,
} from "src/type/formType";
import { FileData, User } from "src/type/types";

import { CheckStep } from "./CheckStep";
import { FormProvider, useForm } from "./context/formContext";
import { InputStep } from "./InputStep";
import { formSchema, transformedSchema } from "./schema/zodSchema";

export const fileUpload = async (
  fileValue: File | null
): Promise<FileData | null> => {
  if (!fileValue) return null;

  const filePath = `${dayjs().format("YYYYMMDDhhmmss")}_${fileValue.name}`;
  const uploadResult = await firestorageFileUpload(fileValue, filePath);

  return {
    path: uploadResult.metadata.fullPath,
    name: fileValue.name,
  };
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
  values: FormValues | EditFormValues
): TransformedFormValues | TransformedEditFormValues => {
  const newProcesses = values.processes.map((process) => {
    const newUsers = process.users.map((userName) => {
      const targetUser = users.filter((user) => user.name === userName);

      const { email, ...newUser } = targetUser[0];
      return newUser;
    });

    return { ...process, users: newUsers };
  });

  const newValues = { ...values, processes: newProcesses };

  return newValues;
};

export const FormBody: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [active, setActive] = useState(0);
  const { user } = useSnapshot();
  const { mutate } = usePosts();
  const { users } = useUsers();

  const form = useForm({
    validate: zodResolver(formSchema),
    initialValues: {
      date: dayjs().toDate(),
      title: "",
      file: null,
      description: "",
      processes: [initialProcessData],
    },
  });

  const validateAndNext = useCallback((): void => {
    if (form.validate().hasErrors) return;

    setActive((current) => current + 1);
  }, [form]);

  const submitPost = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    try {
      if (!user) throw new Error("ログインユーザー情報が取得できていません。");
      if (!users) throw new Error("ユーザー一覧情報が取得できていません。");

      //formvalueの整形
      const transformedValues = transformValues(users, form.values);

      //zod parse
      const parsed = transformedSchema.parse(transformedValues);

      // ファイルアップロード処理
      const file = await fileUpload(parsed.file);

      //postデータの整形
      const postData = {
        ...parsed,
        createdAt: dayjs().toDate(),
        isCompleted: false,
        userId: user.id,
        file,
      };
      // firestore post送信
      await createPost(postData);
      await mutate();

      alert("予定の作成が完了しました。");
      setActive((current) => current + 1);
    } catch (error) {
      console.log(error);
      alert("errorが発生しました。");
    } finally {
      setIsLoading(false);
    }
  }, [user, users, form]);

  const handleNextStep = useCallback(async (): Promise<void> => {
    if (!active) {
      validateAndNext();
    } else {
      await submitPost();
    }
  }, [form, active]);

  const StepUpButton =
    active < 2 ? (
      <Group className="mt-5" position="center">
        <MainButton
          fullWidth
          leftIcon={active > 0 ? <IconCircleCheck size={16} /> : null}
          rightIcon={!active ? <IconArrowForwardUp size={16} /> : null}
          onClick={handleNextStep}
        >
          {!active ? "確認画面へ" : "確定する"}
        </MainButton>

        {active > 0 && (
          <Button
            variant="default"
            fullWidth
            leftIcon={<IconArrowBackUp size={16} />}
            onClick={() => setActive((current) => current - 1)}
          >
            入力画面へ戻る
          </Button>
        )}

        <LoadingOverlay visible={isLoading} />
      </Group>
    ) : (
      <></>
    );

  return (
    <div className="  pb-10">
      <Title className="mb-5" order={5}>
        予定作成
      </Title>

      <FormProvider form={form}>
        <Stepper
          classNames={{ step: "pointer-events-none" }}
          size="sm"
          color="gray"
          active={active}
          onStepClick={setActive}
          breakpoint={0}
        >
          <Stepper.Step label="入力">
            <InputStep StepUpButton={StepUpButton} />
          </Stepper.Step>

          <Stepper.Step label="確認" icon={<IconShieldCheck size={18} />}>
            <CheckStep StepUpButton={StepUpButton} />
          </Stepper.Step>
          <Stepper.Completed>
            <Group position="center">
              <ThemeIcon
                variant="outline"
                color="green"
                radius={9999}
                size={100}
              >
                <IconCheck size={50} stroke={5} />
              </ThemeIcon>
            </Group>

            <Space h={30} />

            <Group position="center">
              <Title order={2}>登録が完了しました。</Title>
            </Group>

            <Space h={20} />

            <Group position="center">
              <Button color="dark" component={Link} href="/form">
                続けて登録する
              </Button>
              <Button color="dark" component={Link} href="/">
                トップに戻る
              </Button>
            </Group>
          </Stepper.Completed>
        </Stepper>
      </FormProvider>
    </div>
  );
};
