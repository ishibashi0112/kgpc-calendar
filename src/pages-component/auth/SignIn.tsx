import {
  Anchor,
  Button,
  Card,
  Group,
  Loader,
  LoadingOverlay,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";
import React, { FC, useCallback, useEffect, useState } from "react";
import { auth } from "src/lib/firebase/firebase";
import { signIn, SignInData } from "src/lib/firebase/firebaseAuth";

export const SignIn: FC = () => {
  const [isloading, setIsLoadaing] = useState(false);
  const [isSignInError, setIsSignInError] = useState(false);
  const [isSignInCompleted, setIsSignInCompleted] = useState(false);
  const form = useForm<SignInData>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "emailの値が正しくありません",
      password: (value) =>
        !(value.length >= 6)
          ? "パスワードは6文字以上でなければいけません"
          : null,
    },
  });

  const handleSubmit = useCallback(
    async (values: typeof form.values) => {
      try {
        setIsLoadaing(true);
        await signIn(values);
        setIsSignInCompleted(true);
      } catch (error: any) {
        const errorMessage = error.message;
        if (errorMessage.includes("auth/user-not-found")) {
          setIsSignInError(true);
        }
        setIsLoadaing(false);
      }
    },
    [form, auth]
  );

  useEffect(() => {
    if (isSignInError) {
      setIsSignInError(false);
    }
  }, [form.values]);

  return (
    <Card className="w-full" withBorder radius="md">
      <Title className="mb-5 flex justify-center" order={5}>
        ログイン画面
      </Title>
      {isSignInError && (
        <Group position="center">
          <Text color="red">emailまたはpasswordに誤りがあります。</Text>
        </Group>
      )}
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
        <Button className="mt-5" type="submit">
          ログイン
        </Button>
      </form>
      <Group position="right">
        <Anchor component={Link} href="/auth?authType=signup">
          新規登録はこちら
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
