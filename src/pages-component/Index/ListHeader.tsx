import { Button, Group, Text } from "@mantine/core";
import dayjs from "dayjs";
import Link from "next/link";
import React, { FC } from "react";
import { state } from "src/lib/store/valtio";
import { useSnapshot } from "valtio";

export const ListHeader: FC = () => {
  const snap = useSnapshot(state);
  return (
    <Group className="mb-5" align="self-start">
      <Text>{`${dayjs(snap.selectedDate).format("YY年M月D日")}の予定`}</Text>
      <Button
        className="ml-5"
        compact
        size="xs"
        component={Link}
        href={`/form?date=${dayjs(snap.selectedDate).format("YYYY-MM-DD")}`}
      >
        予定を追加
      </Button>
    </Group>
  );
};
