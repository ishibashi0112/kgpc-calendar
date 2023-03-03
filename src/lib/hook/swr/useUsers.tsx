import { getUsers } from "src/lib/firebase/firestore";
import useSWRImmutable from "swr/immutable";

const fetcher = async (url: string) => {
  const users = await getUsers();

  return users;
};

export const useUsers = () => {
  const { data, isLoading, error } = useSWRImmutable("/users", fetcher);

  return { users: data, isLoading, isError: error };
};
