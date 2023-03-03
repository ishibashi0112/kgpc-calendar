import "dayjs/locale/ja";

import { Avatar, Group } from "@mantine/core";
import React, { FC } from "react";
import { signOut } from "src/lib/firebase/firebaseAuth";
import { useDarkMode } from "src/lib/hook/useDarkMode";

const handleSignOut = async () => {
  try {
    await signOut();
    alert("signoutします");
  } catch (error) {
    alert(error);
  }
};

export const TitleWithLogo: FC = () => {
  const { isDark } = useDarkMode();

  return (
    <Group spacing="sm">
      <Avatar
        className="border-solid border-[0.5px]"
        src={`${isDark ? "/dark_logo.png" : "/logo.png"}`}
        alt="no image here"
        size="sm"
      />
      Parts Scheduler
    </Group>
  );
};
