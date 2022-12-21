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
import { useForm } from "@mantine/form";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, useCallback, useState } from "react";
import { auth } from "src/lib/firebase/firebase";
import { signUp, SignUpValues } from "src/lib/firebase/firebaseAuth";

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
      type: "発注",
    },
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "emailの値が正しくありません",
      password: (value, values) =>
        !(value.length >= 6)
          ? "パスワードは6文字以上でなければいけません"
          : value !== values.confirmPassword
          ? "確認用のパスワード入力値と一致していません"
          : null,
    },
  });

  const handleSubmit = useCallback(
    async (values: typeof form.values) => {
      try {
        setIsLoadaing(true);
        await signUp(values);
        setIsSignInCompleted(true);
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
        <TextInput label="email" required {...form.getInputProps("email")} />
        <PasswordInput
          label="password"
          required
          {...form.getInputProps("password")}
        />
        <PasswordInput
          label="confirm password"
          required
          {...form.getInputProps("confirmPassword")}
        />
        <TextInput label="名前" required {...form.getInputProps("name")} />
        <Select
          label="所属"
          data={["発注", "部品"]}
          required
          {...form.getInputProps("type")}
        />
        <Button className="mt-5" type="submit">
          登録
        </Button>
      </form>
      <Group position="right">
        <Anchor component={Link} href="/auth?authType=signin">
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
