import "dayjs/locale/ja";

import {
  Autocomplete,
  Button,
  Card,
  CloseButton,
  Group,
  MultiSelect,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconUserPlus } from "@tabler/icons";
import React, { FC, forwardRef } from "react";
import { Form } from "src/type/formType";
import { User } from "src/type/types";

import { initialProcessData } from "./FormBody";

type Props = {
  users: User[];
  form: Form;
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

export const SecondStep: FC<Props> = ({ users, form }) => {
  const usersSelectData = users.map((user) => {
    return {
      value: user.name,
      label: user.name,
      type: user.type,
    };
  });

  return (
    <Stack>
      {form.values.processes.map((_, index) => (
        <Card className="overflow-visible" key={index}>
          <Group position="apart">
            <Text fz="xs" mb={5}>{`工程${index + 1}`}</Text>

            {form.values.processes.length > 1 && (
              <CloseButton
                className="active:translate-y-0"
                onClick={() => form.removeListItem("processes", index)}
              />
            )}
          </Group>
          <Stack spacing={5}>
            <Autocomplete
              data={autoCompleteData}
              classNames={{ label: "text-xs" }}
              label="タイトル"
              placeholder="工程のタイトル"
              withAsterisk
              {...form.getInputProps(`processes.${index}.title`)}
            />

            <TextInput
              classNames={{ label: "text-xs" }}
              label="備考"
              placeholder="特記事項等"
              {...form.getInputProps(`processes.${index}.description`)}
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
              {...form.getInputProps(`processes.${index}.users`)}
            />
          </Stack>
        </Card>
      ))}
      <Group position="right">
        <Button
          size="xs"
          variant="subtle"
          onClick={() => form.insertListItem("processes", initialProcessData)}
        >
          工程追加
        </Button>
      </Group>
    </Stack>
  );
};
