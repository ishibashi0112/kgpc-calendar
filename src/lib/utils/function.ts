import dayjs from "dayjs";
import { PostUser } from "src/type/types";

export const formatPost = (post: PostUser<Date>): PostUser<string> => {
  const dateToStringInProcesses = post.processes.map((process) => ({
    ...process,
    updatedAt: dayjs(process.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
  }));
  return {
    ...post,
    date: dayjs(post.date).format("YYYY-MM-DD HH:mm:ss"),
    processes: dateToStringInProcesses,
  };
};

export const formatPosts = (posts: PostUser<Date>[]): PostUser<string>[] => {
  const dateToStringInPosts = posts.map((post) => {
    const dateToStringInPost = formatPost(post);
    return dateToStringInPost;
  });
  return dateToStringInPosts;
};
