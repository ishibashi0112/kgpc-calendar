import "dayjs/locale/ja";

import {
  ActionIcon,
  Autocomplete,
  Badge,
  Card,
  Collapse,
  Divider,
  Group,
  MultiSelect,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconChevronDown, IconTrash, IconUserPlus } from "@tabler/icons";
import { useRouter } from "next/router";
import React, { FC, forwardRef, useCallback, useState } from "react";
import { useUsers } from "src/lib/hook/swr/useUsers";
import { Processes } from "src/type/types";

import { useEditFormContext, useFormContext } from "./context/formContext";

type Props = {
  index: number;
  process: Omit<Processes, "users"> & { users: string[] };
};

interface SelectItemProps extends React.ComponentPropsWithoutRef<"div"> {
  label: string;
  type: "発注" | "部品";
}
const autoCompleteData = ["着荷・検収", "事務所棚入"];

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  function SelectItem({ label, type, ...othersProps }: SelectItemProps, ref) {
    return (
      <div ref={ref} {...othersProps}>
        <Text size="xs" color="dimmed">
          {type}
        </Text>
        <Text>{label}</Text>
      </div>
    );
  }
);

export const ProcessesInputCard: FC<Props> = (props) => {
  const matches = useMediaQuery("(min-width: 576px)", true, {
    getInitialValueInEffect: false,
  });

  const { pathname } = useRouter();
  const form =
    pathname === "/form"
      ? (useFormContext() as any)
      : (useEditFormContext() as any);
  const [opened, setOpened] = useState(false);
  const { users, isError } = useUsers();

  const hasError = useCallback((): boolean => {
    const regexPattern = new RegExp(`processes.${props.index}`);
    return Object.keys(form.errors).some((errorKey) =>
      regexPattern.test(errorKey)
    );
  }, [form.errors]);

  if (isError || !users) {
    return <></>;
  }

  const isRemoveable = form.values.processes.length > 1;
  const usersSelectData = users.map((user) => {
    return {
      value: user.name,
      label: user.name,
      type: user.type,
    };
  });

  return (
    <Card
      className="overflow-visible "
      sx={(theme) => ({
        borderColor: hasError() ? theme.colors.red[5] : "",
      })}
      key={props.index}
      withBorder
      p={0}
    >
      <div className="relative">
        <UnstyledButton
          className="w-full p-3"
          sx={(theme) => ({
            "&:hover": {
              backgroundColor:
                theme.colorScheme === "dark" ? theme.colors.dark[5] : "",
            },
          })}
          onClick={() => setOpened((o) => !o)}
        >
          <Group position="apart" align="center" noWrap>
            <Group spacing="xs">
              <Text fz="sm" weight="bold">{`工程${props.index + 1}`}</Text>

              <Divider orientation="vertical" />

              {props.process.title ? (
                <Text fz="xs" fw="bold" underline>
                  {props.process.title}
                </Text>
              ) : (
                <Text fz="xs" color="dimmed">
                  タイトル
                </Text>
              )}

              <Divider orientation="vertical" />

              {props.process.users.length ? (
                <Group spacing={2}>
                  {props.process.users.map((userName, index) => (
                    <Badge
                      size="xs"
                      variant="light"
                      color="dark"
                      radius="sm"
                      key={index}
                    >
                      {userName}
                    </Badge>
                  ))}
                </Group>
              ) : (
                <Text fz="xs" color="dimmed">
                  担当者
                </Text>
              )}

              {matches ? (
                <>
                  <Divider orientation="vertical" />

                  {props.process.description ? (
                    <Text fz="xs">{props.process.description}</Text>
                  ) : (
                    <Text fz="xs" color="dimmed">
                      備考
                    </Text>
                  )}
                </>
              ) : null}
            </Group>

            <Group>
              <IconChevronDown
                className={isRemoveable ? "mr-10" : ""}
                size={18}
              />
            </Group>
          </Group>
        </UnstyledButton>
        {isRemoveable && (
          <ActionIcon
            className="active:translate-y-0 "
            size="sm"
            style={{
              transform: "translateY(-50%)",
              position: "absolute",
              top: "50%",
              right: "12px",
            }}
            variant="light"
            color="red"
            onClick={() => form.removeListItem("processes", props.index)}
          >
            <IconTrash size={15} />
          </ActionIcon>
        )}
      </div>

      <Collapse in={opened}>
        <Stack px={12} pb={12} spacing={5}>
          <Autocomplete
            data={autoCompleteData}
            classNames={{ label: "text-xs" }}
            label="タイトル"
            placeholder="工程のタイトル"
            withAsterisk
            {...form.getInputProps(`processes.${props.index}.title`)}
          />
          <TextInput
            classNames={{ label: "text-xs" }}
            label="備考"
            placeholder="特記事項等"
            {...form.getInputProps(`processes.${props.index}.description`)}
          />
          <MultiSelect
            data={usersSelectData}
            itemComponent={SelectItem}
            classNames={{ label: "text-xs" }}
            label="担当者"
            placeholder="Pick all you like"
            withAsterisk
            searchable
            nothingFound="Nothing found"
            icon={<IconUserPlus size={12} />}
            {...form.getInputProps(`processes.${props.index}.users`)}
          />
        </Stack>
      </Collapse>
    </Card>
  );
};
