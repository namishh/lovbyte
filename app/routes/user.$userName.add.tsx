import type { LoaderFunctionArgs } from "@remix-run/node"
import { likePerson } from "~/utils/users.server"
import { redirect } from "@remix-run/node"

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const user = await likePerson(request, params.userName)
  return redirect(`/user/${params.userName}`)
}


