import { useRouter } from "next/router";
import { getPostById } from "src/lib/firebase/firestore";
import { formatPost } from "src/lib/utils/function";
import { PostUser } from "src/type/types";
import useSWRImmutable from "swr/immutable";

const fetcher = async (url: string) => {
  const postId = url.split("/")[-1];
  const post = await getPostById(postId);
  const dateToStringInPost = formatPost(post);

  return dateToStringInPost;
};

export const usePost = () => {
  const router = useRouter();
  const postId = router.query.id;

  const { data, isLoading, error } = useSWRImmutable<PostUser<string>, Error>(
    postId ? `/post/${postId}` : null,
    fetcher
  );

  return { post: data, isLoading, isError: error };
};
