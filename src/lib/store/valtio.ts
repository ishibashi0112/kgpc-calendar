import { proxy } from "valtio";

import { getUser, PostUser, User } from "../firebase/firestore";

type Proxy = {
  user: User | null;
  posts: PostUser<string>[];
  selectedDate: Date | null;
};

export const state = proxy<Proxy>({
  user: null,
  posts: [],
  selectedDate: new Date(),
});

export const setUserState = async (userId: string) => {
  try {
    const user = await getUser(userId);
    state.user = user;
  } catch (error) {
    console.log(error);
    alert("user情報取得に失敗しました");
  }
};
