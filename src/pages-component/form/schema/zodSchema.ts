import dayjs from "dayjs";
import { z } from "zod";

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.union([z.literal("発注"), z.literal("部品")]),
});

const processSchema = z.object({
  title: z.string().min(1, { message: "値を入力してください。" }),
  description: z.string(),
  isCompleted: z.boolean(),
  updatedAt: z.date(),
  users: z.string().array(),
});

export const formSchema = z.object({
  date: z.date().min(dayjs().subtract(1, "d").toDate(), {
    message: "過去の予定は登録できません。",
  }),
  title: z.string().min(1, { message: "値を入力してください。" }),
  file: z.custom<File>().nullable(),
  description: z.string().min(1, { message: "値を入力してください。" }),
  processes: processSchema.array(),
});

export const editFormSchema = formSchema.omit({ file: true }).merge(
  z.object({
    prevFile: z.string(),
    updatedFile: z.custom<File>().nullable(),
  })
);

export const transformedProcessSchema = processSchema.merge(
  z.object({ users: userSchema.array() })
);

export const transformedSchema = formSchema.merge(
  z.object({ processes: transformedProcessSchema.array() })
);

export const transformedEditFormSchema = editFormSchema.merge(
  z.object({
    processes: transformedProcessSchema.array(),
  })
);
