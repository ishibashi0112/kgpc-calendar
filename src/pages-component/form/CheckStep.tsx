import "dayjs/locale/ja";

import {
  Alert,
  Badge,
  Card,
  Group,
  Stack,
  Table,
  Textarea,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";
import dayjs from "dayjs";
import React, { FC } from "react";

import { useFormContext } from "./context/formContext";

type Props = {
  StepUpButton: JSX.Element;
};

export const CheckStep: FC<Props> = (props) => {
  const form = useFormContext();
  return (
    <div>
      <Alert
        className="my-3 flex justify-center"
        color="dark"
        icon={<IconAlertCircle />}
      >
        以下の内容で登録してもよろしいでしょうか？
      </Alert>
      <Stack>
        <Group position="center"></Group>
        <Card withBorder>
          <Table fontSize="sm" highlightOnHover>
            <tbody>
              <tr>
                <td align="right">日付</td>
                <td>
                  {dayjs(form.values.date).locale("ja").format("YY/M/D(dd)")}
                </td>
              </tr>
              <tr>
                <td align="right">件名</td>
                <td>{form.values.title}</td>
              </tr>
              <tr>
                <td align="right">添付資料</td>
                <td>{form.values.file ? form.values.file.name : "なし"}</td>
              </tr>
              <tr className="">
                <td align="right">内容</td>
                <td>
                  <Textarea
                    variant="unstyled"
                    defaultValue={form.values.description}
                    autosize
                    readOnly
                  />
                </td>
              </tr>
              {form.values.processes.map((process, index) => (
                <React.Fragment key={index}>
                  <tr className="border-solid border-t-2 border-x-0 border-b-[1px]">
                    <td align="right">
                      <span className="flex justify-between items-center">
                        <Badge radius="sm" color="dark">{`工程${
                          index + 1
                        }`}</Badge>
                        工程名
                      </span>
                    </td>
                    <td>{process.title}</td>
                  </tr>
                  <tr>
                    <td align="right">備考</td>
                    <td>
                      <Textarea
                        variant="unstyled"
                        defaultValue={process.description}
                        autosize
                        readOnly
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="" align="right">
                      担当者
                    </td>
                    <td>
                      {process.users.map((user, index) => (
                        <div key={index} className="inline mr-2">
                          {user}
                        </div>
                      ))}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </Card>

        {/* <Group className="" position="center">
          <Popover position="bottom-end">
            <Popover.Target>
              <ActionIcon variant="outline">
                <IconStackPop size={16} />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
              <ProcessTimeLine
                processes={form.values.processes}
                processNum={form.values.processes.length}
              />
            </Popover.Dropdown>
          </Popover>
        </Group> */}

        {props.StepUpButton}
      </Stack>
    </div>
  );
};
