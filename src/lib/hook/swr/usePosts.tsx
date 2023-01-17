import { getPosts } from "src/lib/firebase/firestore";
import { formatPosts } from "src/lib/utils/function";
import useSWRImmutable from "swr/immutable";

const fetcher = async (url: string) => {
  const posts = await getPosts();
  const dateToStringInPosts = formatPosts(posts);
  console.log(dateToStringInPosts);

  return dateToStringInPosts;
};

export const usePosts = () => {
  const { data, isLoading, error } = useSWRImmutable("/posts", fetcher);

  return { posts: data, isLoading, isError: error };
};
