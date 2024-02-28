import type { LoaderFunctionArgs, } from "@remix-run/node";

import { redirect } from "@remix-run/node";
import { getUser } from "~/utils/session.server";

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const user = await getUser(request)
  if (user) {
    return redirect("/users")
  } else {
    return redirect("/auth/signin")
  }
};


