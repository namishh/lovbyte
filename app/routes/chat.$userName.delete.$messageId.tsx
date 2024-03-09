import type { LoaderFunctionArgs } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { redirect } from "@remix-run/node";
import { getRoomId } from "~/utils/room.server";
import { getUser } from "~/utils/session.server";
import { emitter } from "~/utils/emitter";
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
  console.log(room)
  if (!room) {
    return redirect("/chat")
  }

  const del = await db.message.delete({
    where: { id: params.messageId }
  });

  emitter.emit("message", `${JSON.stringify(del)}\n\n`);
  return redirect(`/chat/${params.userName}`)
};

