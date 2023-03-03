import { Button, Group, Modal, Space, Stack, Text } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { deletePost } from "src/lib/firebase/firestore";
import { PostUser } from "src/type/types";

import { deleteFile } from "../firebase/storage";
import { usePosts } from "./swr/usePosts";

type ModalState = {
  isLoading: boolean;
  opened: boolean;
  post: PostUser<string> | null;
};

type UseDeleteModalType = () => {
  modalOpen: (post: PostUser<string>) => void;
  ModalComponent: JSX.Element;
};

export const useDeleteModal: UseDeleteModalType = () => {
  const { push } = useRouter();
  const { mutate } = usePosts();
  const [modalState, SetModalState] = useState<ModalState>({
    isLoading: false,
    opened: false,
    post: null,
  });

  const modalOpen = useCallback((post: PostUser<string>): void => {
    SetModalState((prev) => ({
      ...prev,
      opened: true,
      post,
    }));
  }, []);

  const handleRemove = useCallback(async (): Promise<void> => {
    if (!modalState.post) return;

    try {
      SetModalState((prev) => ({ ...prev, isLoading: true }));

      if (modalState.post.file) {
        await deleteFile(modalState.post.file.path);
      }

      await deletePost(modalState.post.id);
      await mutate();
      alert("削除しました");
      SetModalState((prev) => ({ ...prev, opened: false }));
      await push("/");
    } catch (error) {
      console.log(error);

      alert("削除でエラーが発生しました");
    } finally {
      SetModalState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [modalState]);

  const ModalComponent = modalState.post ? (
    <Modal
      classNames={{ body: "text-sm" }}
      opened={modalState.opened}
      onClose={() => SetModalState((prev) => ({ ...prev, opened: false }))}
      closeOnClickOutside={!modalState.isLoading}
      withCloseButton={false}
      title={
        <Group position="center" spacing={5}>
          <IconAlertTriangle size={18} />
          <Text>予定を削除しますか？</Text>
        </Group>
      }
    >
      <Stack spacing={2}>
        <Text fz="sm">
          {dayjs(modalState.post.date).locale("ja").format("YY年M月D日(dd)")}
          <Text fz="sm">{modalState.post.title}</Text>
        </Text>
      </Stack>

      <Space h={30} />

      <Group position="right">
        <Button
          variant="default"
          onClick={() => SetModalState((prev) => ({ ...prev, opened: false }))}
          loading={modalState.isLoading}
          loaderPosition="center"
        >
          閉じる
        </Button>
        <Button
          color="red"
          onClick={() => handleRemove()}
          loading={modalState.isLoading}
          loaderPosition="center"
        >
          削除
        </Button>
      </Group>
    </Modal>
  ) : (
    <></>
  );

  return { modalOpen, ModalComponent };
};
