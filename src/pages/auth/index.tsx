import { Center, Container, Flex, Skeleton } from "@mantine/core";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { SignIn } from "src/pages-component/auth/SignIn";
import { SignUp } from "src/pages-component/auth/SignUp";

const Auth: NextPage = () => {
  const router = useRouter();
  const [display, setDisplay] = useState(false);
  const isSignIn = router.query.authType === "signin";

  useEffect(() => {
    if (router.isReady) {
      setDisplay(true);
    }
  }, [router.isReady]);

  return (
    <Container className="h-screen" size="xs">
      <Center className="h-[600px] ">
        <Skeleton visible={!display} radius="md">
          {isSignIn ? <SignIn /> : <SignUp />}
        </Skeleton>
      </Center>
      <Flex className="h-[calc(100%-600px)] pb-2" align="end" justify="center">
        <small>Copyright @ 2022 yuki ishibashi</small>
      </Flex>
    </Container>
  );
};

export default Auth;
