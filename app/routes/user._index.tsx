import type { LoaderFunctionArgs, } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getRandomUser } from "~/utils/users.server";

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const user = await getRandomUser(request)
  return redirect(`/user/${user.username}`)
};
