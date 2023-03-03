import "dayjs/locale/ja";

import {
  Button,
  Card,
  FileInput,
  Group,
  Space,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useMediaQuery } from "@mantine/hooks";
import { IconCalendar, IconFile } from "@tabler/icons";
import React, { FC } from "react";

import { useFormContext } from "./context/formContext";
import { initialProcessData } from "./FormBody";
import { InputCompletionButton } from "./InputCompletionButton";
import { ProcessesInputCard } from "./ProcessInputCard";

type Props = {
  StepUpButton: JSX.Element;
};

export const InputStep: FC<Props> = (props) => {
  const form = useFormContext();

  const matches = useMediaQuery("(min-width: 576px)", true, {
    getInitialValueInEffect: false,
  });

  return (
    <Card shadow="xs">
      <Stack>
        <Group noWrap={matches}>
          <InputCompletionButton menuType="template" />
          <InputCompletionButton menuType="history" />
        </Group>

        <DatePicker
          label="日付"
          withAsterisk
          locale="ja"
          firstDayOfWeek="sunday"
          inputFormat="YYYY/MM/DD"
          labelFormat="YYYY/MM"
          icon={<IconCalendar size={18} />}
          {...form.getInputProps("date")}
        />
        <TextInput label="件名" withAsterisk {...form.getInputProps("title")} />

        <Textarea
          label="内容"
          placeholder="依頼内容を簡潔に入力してください。"
          autosize
          withAsterisk
          {...form.getInputProps("description")}
        />

        <FileInput
          label="添付資料"
          placeholder=".pdf .xlsx "
          icon={<IconFile size={18} />}
          accept="application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          {...form.getInputProps("file")}
        />

        <div>
          <Text fz="sm" mb={1}>
            工程情報
          </Text>
          <Stack>
            {form.values.processes.map((process, index) => (
              <ProcessesInputCard key={index} process={process} index={index} />
            ))}
          </Stack>

          <Space h={5} />

          <Group position="right">
            <Button
              size="xs"
              variant="light"
              color="dark"
              onClick={() =>
                form.insertListItem("processes", initialProcessData)
              }
            >
              工程追加
            </Button>
          </Group>
        </div>

        {props.StepUpButton}
      </Stack>
    </Card>
  );
};
