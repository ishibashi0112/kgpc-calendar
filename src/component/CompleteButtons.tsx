import { Button, Center, Text } from "@mantine/core";
import { IconCheck } from "@tabler/icons";
import dayjs from "dayjs";
import React, { FC, useCallback, useState } from "react";
import { updatePost } from "src/lib/firebase/firestore";
import { state } from "src/lib/store/valtio";
import { PostUser, Processes, User } from "src/type/types";
import { useSnapshot } from "valtio";

type Props = {
  post: PostUser<string>;
  process: Processes<string>;
  index: number;
  processNum: number;
};

export const CompleteButtons: FC<Props> = ({
  post,
  process,
  processNum,
  index,
}) => {
  const { user } = useSnapshot(state);
  const [isLoading, setIsLoading] = useState(false);

  const isShowCompleteButton = useCallback(
    (processUsers: Omit<User, "email">[]): boolean => {
      if (!user) return false;

      const isTargetUser = processUsers.some(
        (processUser) => processUser.id === user.id
      );

      const isBeforeToday =
        dayjs(post.date).format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");

      return isBeforeToday && isTargetUser;
    },
    [post, user]
  );

  const handleClick = useCallback(
    async (postId: string) => {
      const isLastProcess = post.processes.length - processNum === 1;

      const updateProcessesData = post.processes.map((process, index) => {
        if (processNum === index) {
          return { ...process, isCompleted: true, updatedAt: new Date() };
        }
        return { ...process, updatedAt: dayjs(process.updatedAt).toDate() };
      });

      const updatePostData = {
        isCompleted: isLastProcess,
        processes: updateProcessesData,
      };

      try {
        setIsLoading(true);
        await updatePost(postId, updatePostData);

        alert("更新が完了しました。");
      } catch (error) {
        alert("更新が失敗しました。");
      } finally {
        setIsLoading(false);
      }
    },
    [processNum]
  );

  if (process.isCompleted)
    return (
      <div className="flex flex-col justify-center">
        <Center>
          <IconCheck className="flex" />
        </Center>

        <Text fz="xs">{`${dayjs(process.updatedAt).format("HH:mm")} 完`}</Text>
      </div>
    );

  if (isShowCompleteButton(process.users)) {
    return (
      <Button
        color="green"
        radius="xl"
        disabled={processNum < index}
        onClick={() => handleClick(post.id)}
        loaderPosition="center"
        loading={isLoading && processNum === index}
      >
        完了
      </Button>
    );
  }

  return <></>;
};
