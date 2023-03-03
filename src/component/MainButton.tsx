import {
  Button as MaintineButton,
  ButtonProps as MantineButtonProps,
  ButtonVariant,
  MantineTheme,
} from "@mantine/core";
import Link from "next/link";
import React, { FC, ReactNode } from "react";

type ButtonProps = Omit<MantineButtonProps, "variant" | "color"> & {
  children: ReactNode | string;
  onClick?: () => void;
};

type NomalButtonProps = ButtonProps & { isLink?: false };

type LinkButtonProps = ButtonProps & { isLink: true; href: string };

type Props = NomalButtonProps | LinkButtonProps;

const baseProperty = {
  className:
    "transition hover:transition active:transition border border-solid",
  color: "dark",
  variant: "filled" as ButtonVariant,
} as const;

const sx = (theme: MantineTheme) => ({
  backgroundColor: theme.colorScheme === "dark" ? theme.colors.gray[4] : "",
  borderColor: theme.colorScheme === "dark" ? theme.colors.gray[4] : "black",
  color: theme.colorScheme === "dark" ? "black" : "white",

  "&:hover": {
    backgroundColor: theme.colorScheme === "dark" ? "black" : "white",
    color: theme.colorScheme === "dark" ? "white" : "black",
  },
  "&:active": {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.gray[7]
        : theme.colors.gray[3],
  },
});

export const MainButton: FC<Props> = (props) => {
  const { children, isLink, ...buttonProps } = props;

  if (isLink) {
    return (
      <MaintineButton
        sx={sx}
        {...baseProperty}
        {...buttonProps}
        component={Link}
        href={props.href}
      >
        {children}
      </MaintineButton>
    );
  }

  return (
    <MaintineButton sx={sx} {...baseProperty} {...buttonProps}>
      {children}
    </MaintineButton>
  );
};
