import { Timestamp } from "firebase/firestore";

import { TransformedProcessValues } from "./formType";

export type Processes<dateType extends Date | Timestamp | string = Date> = Omit<
  TransformedProcessValues,
  "updatedAt"
> & {
  updatedAt: dateType;
};

export type Post<dateType extends Date | Timestamp | string = Date> = {
  id: string;
  date: dateType;
  title: string;
  file: string | null;
  description: string;
  isCompleted: boolean;
  userId: string;
  processes: Processes<dateType>[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  type: "発注" | "部品";
};

export type PostUser<dateType extends Date | Timestamp | string = Date> = Omit<
  Post<dateType>,
  "userId"
> & { user: User };
