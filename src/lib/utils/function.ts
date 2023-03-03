import dayjs from "dayjs";
import { PostUser, Processes } from "src/type/types";

const dateToString = (date: Date): string => {
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
};

export const formatProcesses = (
  processes: Processes<Date>[]
): Processes<string>[] => {
  return processes.map((process) => ({
    ...process,
    updatedAt: dateToString(process.updatedAt),
  }));
};

export const formatPost = (post: PostUser<Date>): PostUser<string> => {
  return {
    ...post,
    createdAt: dateToString(post.createdAt),
    date: dateToString(post.date),
    processes: formatProcesses(post.processes),
  };
};

export const formatPosts = (posts: PostUser<Date>[]): PostUser<string>[] => {
  const dateToStringInPosts = posts.map((post) => {
    const dateToStringInPost = formatPost(post);
    return dateToStringInPost;
  });
  return dateToStringInPosts;
};
