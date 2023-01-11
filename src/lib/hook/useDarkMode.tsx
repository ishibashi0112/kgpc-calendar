import { ColorScheme, Switch as MantineSwitch } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import React, { ReactNode, useMemo } from "react";

type useDarkModeReturnType = {
  isDark: boolean;
  Switch: ReactNode;
  colorScheme: ColorScheme;
  setColorScheme: (
    val: ColorScheme | ((prevState: ColorScheme) => ColorScheme)
  ) => void;
};

export const useDarkMode = (): useDarkModeReturnType => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "dark",
    getInitialValueInEffect: true,
  });

  const isDark = colorScheme === "dark";

  const switchComponent = useMemo(
    () => (
      <MantineSwitch
        checked={isDark}
        color={isDark ? "gray" : "dark"}
        onLabel={<SunIcon color="yellow" />}
        offLabel={<MoonIcon color="blue" />}
        onChange={() => setColorScheme(isDark ? "light" : "dark")}
      />
    ),
    [isDark] // eslint-disable-line
  );

  return {
    isDark,
    Switch: switchComponent,
    colorScheme,
    setColorScheme,
  };
};
