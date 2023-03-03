import {
  Anchor,
  Button,
  Card,
  Group,
  Loader,
  LoadingOverlay,
  PasswordInput,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, useCallback, useState } from "react";
import { auth } from "src/lib/firebase/firebase";
import { signUp } from "src/lib/firebase/firebaseAuth";
import { SignUpValues } from "src/type/types";
import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "emailを入力してください。" })
      .email("emailの形式に合っておりません。"),
    password: z.string().min(1, { message: "パスワードを入力してください。" }),
    confirmPassword: z
      .string()
      .min(1, { message: "確認用パスワードを入力してください。" }),
    firstName: z.string().min(1, { message: "氏を入力してください。" }),
    lastName: z.string().min(1, { message: "名を入力してください。" }),
    type: z.union([z.literal("発注"), z.literal("部品")]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません。",
    path: ["confirmPassword"],
  })
  .transform((data) => ({ ...data, name: data.firstName + data.lastName }));

export const SignUp: FC = () => {
  const { push } = useRouter();
  const [isloading, setIsLoadaing] = useState(false);
  const [isSignInCompleted, setIsSignInCompleted] = useState(false);
  const form = useForm<SignUpValues>({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      firstName: "",
      lastName: "",
      type: "発注",
    },
    validate: zodResolver(signUpSchema),
  });

  const handleSubmit = useCallback(
    async (values: typeof form.values) => {
      try {
        setIsLoadaing(true);

        const parsedValues = signUpSchema.parse(values);

        await signUp(parsedValues);
        setIsSignInCompleted(true);
        await push("/");
      } catch (error) {
        console.log(error);
        setIsLoadaing(false);
      }
    },
    [form, auth]
  );
  return (
    <Card className="w-full" withBorder radius="md">
      <Title className="mb-5 flex justify-center" order={5}>
        ユーザー新規登録
      </Title>
      <form
        className="flex flex-col gap-3"
        onSubmit={form.onSubmit(handleSubmit)}
      >
        <TextInput
          label="email"
          type="email"
          {...form.getInputProps("email")}
        />
        <PasswordInput label="パスワード" {...form.getInputProps("password")} />
        <PasswordInput
          label="パスワード確認用"
          {...form.getInputProps("confirmPassword")}
        />
        <Group>
          <TextInput
            label="氏"
            placeholder="山田"
            {...form.getInputProps("firstName")}
          />
          <TextInput
            label="名"
            placeholder="太郎"
            {...form.getInputProps("lastName")}
          />
        </Group>

        <Select
          label="所属"
          data={["発注", "部品"]}
          {...form.getInputProps("type")}
        />
        <Button className="mt-5" type="submit" color="dark">
          登録
        </Button>
      </form>
      <Group position="right">
        <Anchor
          className="hover:underline"
          variant="text"
          component={Link}
          href="/auth?authType=signin"
        >
          ログインはこちら
        </Anchor>
      </Group>

      <LoadingOverlay
        visible={isloading}
        overlayBlur={2}
        loader={
          <div>
            {isSignInCompleted ? (
              <Text>ログインに成功しました。リダイレクトされます</Text>
            ) : (
              <Loader />
            )}
          </div>
        }
      />
    </Card>
  );
};
