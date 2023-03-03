import {
  Anchor,
  Card,
  Group,
  Loader,
  LoadingOverlay,
  PasswordInput,
  Space,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, useCallback, useEffect, useState } from "react";
import { MainButton } from "src/component/MainButton";
import { auth } from "src/lib/firebase/firebase";
import { signIn } from "src/lib/firebase/firebaseAuth";
import { SignInValues } from "src/type/types";
import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "emailを入力してください。" })
    .email("emailの形式に合っておりません。"),
  password: z.string().min(1, { message: "パスワードを入力してください。" }),
});

export const SignIn: FC = () => {
  const { push } = useRouter();
  const [isloading, setIsLoadaing] = useState(false);
  const [isSignInError, setIsSignInError] = useState(false);
  const [isSignInCompleted, setIsSignInCompleted] = useState(false);
  const form = useForm<SignInValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodResolver(signInSchema),
  });

  const handleSubmit = useCallback(
    async (values: typeof form.values) => {
      try {
        setIsLoadaing(true);
        await signIn(values);
        setIsSignInCompleted(true);
        await push("/");
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
        <TextInput
          label="email"
          type="email"
          {...form.getInputProps("email")}
        />
        <PasswordInput label="パスワード" {...form.getInputProps("password")} />

        <Space h={20} />

        <MainButton type="submit">ログイン</MainButton>
      </form>
      <Group position="right">
        <Anchor
          className="hover:underline"
          variant="text"
          component={Link}
          href="/auth?authType=signup"
        >
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
