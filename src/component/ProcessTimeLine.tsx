import { Badge, Group, Space, Text, Timeline } from "@mantine/core";
import React, { FC } from "react";
import { PostUser, Processes, User } from "src/type/types";

import { CompleteButtons } from "./CompleteButtons";

type Props = {
  processes:
    | Processes<string>[]
    | (Omit<Processes<Date>, "users"> & { users: string[] })[];
  processNum: number;
  withCompleteButton?: boolean;
  post?: PostUser<string>;
};

export const ProcessTimeLine: FC<Props> = (props) => {
  return (
    <Timeline active={props.processNum}>
      {props.processes.map((process, index) => (
        <Timeline.Item key={index} title={process.title}>
          <Group position="apart">
            <div>
              <Group mt={2} align="center" spacing={1}>
                <Text size="xs">担当者：</Text>
                {process.users.map(
                  (
                    user:
                      | Omit<User, "email" | "firstName" | "lastName">
                      | string
                  ) =>
                    typeof user === "string" ? (
                      <div key={user}>
                        <Badge color="gray" size="sm" variant="filled">
                          {user.slice(0, 2)}
                        </Badge>

                        <Space w={3} />
                      </div>
                    ) : (
                      <div key={user.id}>
                        <Badge color="gray" size="sm" variant="filled">
                          {user.name.slice(0, 2)}
                        </Badge>

                        <Space w={3} />
                      </div>
                    )
                )}
              </Group>

              {process.description ? (
                <Text w={200} size="xs">
                  ※{process.description}
                </Text>
              ) : null}
            </div>

            {props.withCompleteButton && props.post ? (
              <CompleteButtons
                post={props.post}
                processNum={props.processNum}
                index={index}
                process={process as Processes<string>}
              />
            ) : null}
          </Group>
        </Timeline.Item>
      ))}

      <Timeline.Item title="完了"></Timeline.Item>
    </Timeline>
  );
};
