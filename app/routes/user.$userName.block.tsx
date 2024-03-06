import type { LoaderFunctionArgs } from "@remix-run/node"
import { blockPerson } from "~/utils/users.server"
import { redirect } from "@remix-run/node"

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const user = await blockPerson(request, params.userName)
  return redirect(`/user/${params.userName}`)
}
