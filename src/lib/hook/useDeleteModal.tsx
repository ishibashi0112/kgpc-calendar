import { Button, Group, Modal, Space, Stack, Text } from "@mantine/core";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { deletePost } from "src/lib/firebase/firestore";
import { PostUser } from "src/type/types";

import { deleteFile } from "../firebase/storage";

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
        await deleteFile(modalState.post.file);
      }

      await deletePost(modalState.post.id);
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
      opened={modalState.opened}
      onClose={() => SetModalState((prev) => ({ ...prev, opened: false }))}
      closeOnClickOutside={!modalState.isLoading}
      title="削除"
    >
      <Text>こちらの予定を削除してもよろしいでしょうか？</Text>

      <Space h={10} />

      <Stack spacing={2}>
        <Text fz="sm">
          {dayjs(modalState.post.date).locale("ja").format("YY年M月D日(dd)")}
        </Text>
        <Text>{modalState.post.title}</Text>
      </Stack>

      <Space h={30} />

      <Group position="right">
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
