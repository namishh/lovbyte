import type { LoaderFunctionArgs, } from "@remix-run/node";

import { redirect } from "@remix-run/node";
import { getRoomId } from "~/utils/room.server";
import { getUser } from "~/utils/session.server";
import { getIdByName } from "~/utils/users.server";

export const loader = async ({
  request, params
}: LoaderFunctionArgs) => {
  const user = await getUser(request)
  if (!user) {
    return redirect("/auth/signin")
  }
  const other = await getIdByName(String(params.userName))
  const room = await getRoomId(request, String(other?.id))
  if (!room) {
    return redirect("/chat")
  }

  return "hi"
};

export default function Chat() {
  return <div className="chat">
    Hi
  </div>
} 
