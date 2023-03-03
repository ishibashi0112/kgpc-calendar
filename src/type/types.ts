import { Timestamp } from "firebase/firestore";
import { signInSchema } from "src/pages-component/auth/SignIn";
import { signUpSchema } from "src/pages-component/auth/SignUp";
import { z } from "zod";

import { TransformedProcessValues } from "./formType";

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;

export type Processes<dateType extends Date | Timestamp | string = Date> = Omit<
  TransformedProcessValues,
  "updatedAt"
> & {
  updatedAt: dateType;
};

export type FileData = {
  path: string;
  name: string;
};

export type Post<dateType extends Date | Timestamp | string = Date> = {
  id: string;
  createdAt: dateType;
  date: dateType;
  title: string;
  file: FileData | null;
  description: string;
  isCompleted: boolean;
  userId: string;
  processes: Processes<dateType>[];
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  type: "発注" | "部品";
};

export type PostUser<dateType extends Date | Timestamp | string = Date> = Omit<
  Post<dateType>,
  "userId"
> & { user: User };
