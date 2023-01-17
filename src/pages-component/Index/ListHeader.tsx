import { Button, Group, Menu, Text, Tooltip } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons";
import dayjs from "dayjs";
import Link from "next/link";
import React, { FC } from "react";
import { useSnapshot } from "src/lib/hook/useSnapShot";

export const ListHeader: FC = () => {
  const { selectedDate } = useSnapshot();
  return (
    <Group className="mb-5" position="apart" align="self-start">
      <Text>
        <Text span underline>
          {dayjs(selectedDate).locale("ja").format("YY年M月D日(dd)")}
        </Text>
        の予定
      </Text>
      <div>
        <Button
          className="rounded-none rounded-l-md pl-3 pr-1"
          size="sm"
          component={Link}
          href={`/form?date=${dayjs(selectedDate).format("YYYY-MM-DD")}`}
        >
          予定を追加
        </Button>
        <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            <Tooltip label="過去の履歴から引用" openDelay={400}>
              <Button className="rounded-none rounded-r-md pl-1 pr-2">
                <IconChevronDown size={12} />
              </Button>
            </Tooltip>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>履歴</Menu.Label>
            <Menu.Divider />
            <Menu.Label>直近の履歴 2件</Menu.Label>
            <Menu.Item>
              <div>test</div>
            </Menu.Item>
            <Menu.Item>
              <div>test</div>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Label>それ以前の履歴 5件</Menu.Label>
            <Menu.Item>
              <div>test</div>
            </Menu.Item>
            <Menu.Item>
              <div>test</div>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </Group>
  );
};
