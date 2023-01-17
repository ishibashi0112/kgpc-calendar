import dayjs from "dayjs";
import { PostUser, User } from "src/type/types";
import { proxy } from "valtio";

import { getUserById } from "../firebase/firestore";

type Proxy = {
  user: User | null;
  post: PostUser<string> | null;
  selectedDate: Date | null;
  selectedDatePosts: PostUser<string>[];
};

export const state = proxy<Proxy>({
  user: null,
  post: null,
  selectedDate: new Date(),
  selectedDatePosts: [],
});

export const setUserState = async (userId: string) => {
  try {
    const user = await getUserById(userId);
    state.user = user;
  } catch (error) {
    console.log(error);
    alert("user情報取得に失敗しました");
  }
};

export const setSelectedDate = (date: Date | null) => {
  state.selectedDate = date;
};

export const setSelectedDatePosts = (
  posts: PostUser<string>[] | undefined,
  date: Date | null
): void => {
  if (!posts) {
    state.selectedDatePosts = [];
    return;
  }

  const selectedDatePosts = posts.filter(
    (post) =>
      dayjs(date).format("YYYY-MM-DD") === dayjs(post.date).format("YYYY-MM-DD")
  );
  state.selectedDatePosts = selectedDatePosts;
  return;
};
