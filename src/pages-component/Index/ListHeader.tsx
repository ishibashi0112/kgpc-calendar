import { Group, Text } from "@mantine/core";
import dayjs from "dayjs";
import React, { FC } from "react";
import { MainButton } from "src/component/MainButton";
import { useSnapshot } from "src/lib/hook/useSnapShot";

export const ListHeader: FC = () => {
  const { selectedDate } = useSnapshot();
  return (
    <Group className="mb-5" position="apart" align="self-start">
      <Text>
        <Text span fw="bold">
          {dayjs(selectedDate).locale("ja").format("YY年M月D日(dd)")}
        </Text>
        の予定
      </Text>
      <Group spacing={0}>
        <MainButton size="sm" isLink href="/form">
          予定を追加
        </MainButton>
      </Group>
    </Group>
  );
};
