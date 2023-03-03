import "dayjs/locale/ja";

import { Button, Loader, Menu, Text } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons";
import dayjs from "dayjs";
import React, { FC, useCallback } from "react";
import { usePosts } from "src/lib/hook/swr/usePosts";
import { useSnapshot } from "src/lib/hook/useSnapShot";
import { PostUser } from "src/type/types";

import { useFormContext } from "./context/formContext";

type Props = {
  menuType: "template" | "history";
};

const TemplateData = [
  {
    id: 1,
    templateName: "海外Uオーダー",
    values: {
      title: "海外Uオーダー 事務所棚入れ",
      description: "",
      processes: [
        {
          title: "着荷・検収",
          description: "",
          isCompleted: false,
          updatedAt: dayjs().toDate(),
          users: ["片岡治", "竹内結子"],
        },
        {
          title: "事務所棚入",
          description: "",
          isCompleted: false,
          updatedAt: dayjs().toDate(),
          users: ["片岡治", "竹内結子"],
        },
      ],
    },
  },
];

export const InputCompletionButton: FC<Props> = (props) => {
  return (
    <Menu shadow="md" width="target" withArrow>
      <Menu.Target>
        <Button
          variant="filled"
          fullWidth
          color="dark"
          rightIcon={<IconChevronDown size={18} />}
        >
          {props.menuType === "template"
            ? "テンプレートから選ぶ"
            : "履歴から選ぶ"}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {props.menuType === "template" ? (
          <TemplateMenuItems />
        ) : (
          <HistoryMenuItems />
        )}
      </Menu.Dropdown>
    </Menu>
  );
};

const TemplateMenuItems: FC = () => {
  const { setValues } = useFormContext();
  return (
    <>
      {TemplateData.map((data) => (
        <Menu.Item
          key={data.id}
          onClick={() => {
            setValues(data.values);
          }}
        >
          {data.templateName}
        </Menu.Item>
      ))}
    </>
  );
};

const HistoryMenuItems: FC = () => {
  const { setValues } = useFormContext();
  const { posts, isError, isLoading } = usePosts();
  const { user } = useSnapshot();

  const getPostsByUserId = useCallback(
    (posts: PostUser<string>[]): PostUser<string>[] =>
      posts.filter((post) => post.user.id === user?.id),
    []
  );

  const handleCompletion = useCallback((post: PostUser<string>) => {
    setValues((prev) => {
      const processes = post.processes.map((process) => {
        const userNames = process.users.map((user) => user.name);
        return { ...process, updatedAt: dayjs().toDate(), users: userNames };
      });
      return {
        ...prev,
        title: post.title,
        description: post.description,
        processes,
      };
    });
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !posts) {
    return <></>;
  }

  return (
    <>
      {getPostsByUserId(posts).map((post) => (
        <Menu.Item key={post.id} onClick={() => handleCompletion(post)}>
          <Text color="dimmed" fz="xs">
            {dayjs(post.date).format("YY/M/D")}
          </Text>
          <Text>{post.title}</Text>
        </Menu.Item>
      ))}
    </>
  );
};
