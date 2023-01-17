import "dayjs/locale/ja";

import { FileInput, Stack, Textarea, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons";
import React, { FC } from "react";
import { Form } from "src/type/formType";

type Props = {
  form: Form;
};

export const FirstStep: FC<Props> = ({ form }) => {
  return (
    <Stack>
      <DatePicker
        label="日付"
        withAsterisk
        locale="ja"
        firstDayOfWeek="sunday"
        inputFormat="YYYY/MM/DD"
        labelFormat="YYYY/MM"
        icon={<IconCalendar size={16} />}
        {...form.getInputProps("date")}
      />
      <TextInput label="件名" withAsterisk {...form.getInputProps("title")} />
      <FileInput label="添付資料" {...form.getInputProps("file")} />
      <Textarea
        classNames={{ input: "min-h-[200px]" }}
        label="内容"
        withAsterisk
        {...form.getInputProps("description")}
      />
    </Stack>
  );
};
