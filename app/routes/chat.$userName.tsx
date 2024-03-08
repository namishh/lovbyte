import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { redirect } from "@remix-run/node";
import { getRoomId } from "~/utils/room.server";
import { getUser, getUserAllDetails, getUserId } from "~/utils/session.server";
import { useEventSource } from "remix-utils/sse/react";
import { getAllMatched, getIdByName } from "~/utils/users.server";
import { useState, useEffect, useRef } from "react";
import { useLoaderData } from "@remix-run/react";
import { Form } from "@remix-run/react";
import { emitter } from "~/utils/emitter";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const userd = await getUserAllDetails(request)
  const userId = await getUserId(request)
  const message = formData.get("message") as string;
  const rooomid = formData.get("room") as string;
  console.log(message, rooomid)
  const msg = await db.message.create({
    data: {
      room: rooomid,
      content: message,
      sender: userd?.name as string,
      pfp: userd?.pfp as string,
      senderId: userId as string,
    }
  })
  emitter.emit("message", `${JSON.stringify(msg)}\n\n`);
  return json(null, { status: 201 });
}


export const loader = async ({
  request, params
}: LoaderFunctionArgs) => {
  const user = await getUser(request)
  if (!user) {
    return redirect("/auth/signin")
  }
  const userd = await getUserAllDetails(request)
  const other = await getIdByName(String(params.userName))
  const room = await getRoomId(request, String(other?.id))
  console.log(room)
  if (!room) {
    return redirect("/chat")
  }

  const messages = await db.message.findMany({
    select: {
      id: true,
      content: true,
      sender: true,
      pfp: true,
      senderId: true,
    },
    where: {
      room: room.id
    },
    orderBy: {
      timestamp: "asc",
    },
  });
  const matched = await getAllMatched(request)

  return { messages, matched, room, userd }
};

export default function Chat() {
  const data = useLoaderData<typeof loader>();
  const [messages, setMessages] = useState(data.messages)
  const [dummy, setdummy] = useState('')

  const currentComments = useEventSource("/chat/subscribe", {
    event: "message",
  });


  const messageEndRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const parsedComments = JSON.parse(currentComments as string);
    if (parsedComments !== null) {
      setMessages((prev) => [...prev, parsedComments]);
    }
    console.log(messages)
  }, [currentComments]);


  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  return <div className="flex text-white justify-center items-center">
    <div className="px-0 md:px-4 lg:px-8 md:py-0 py-2 w-full " style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>

      <div className="p-6 flex-grow max-h-[80vh] w-full overflow-y-auto py-8">
        <div className="flex flex-col gap-4 w-full">

          {messages.map((message, index) => (
            <div key={index} className={`flex-col flex gap-4 ${data.userd?.id == message.senderId ? 'self-end' : 'self-start'}`}>
              <div className={`flex gap-3  items-center justify-center ${data.userd?.id == message.senderId ? 'flex-row-reverse' : 'flex-row'}`}>
                <img src={message.pfp} alt="" className="w-10 h-10 rounded-full" />

                <div className={`rounded-lg ${data.userd?.id == message.senderId ? 'bg-emerald-600' : 'bg-neutral-900'} py-[0.3rem] px-4 shadow-md self-end`}>
                  {message.content}
                </div>
              </div>
              <p className={`font-light ${data.userd?.id == message.senderId ? 'self-end' : 'self-start'} text-sm text-gray-600`}>
                {message.sender}
              </p>
            </div>
          ))}

          <div ref={messageEndRef}></div>
        </div>
      </div>
      <Form method="POST" onSubmit={(e) => { setdummy('') }} className="p-6 fixed bottom-0 left-0 w-full bg-[#0c0c0c]">
        <div className="flex">
          <input
            type="hidden"
            name="room"
            defaultValue={data.room.id}
          />
          <input
            type="text"
            name="message"
            value={dummy}
            onChange={(e) => setdummy(e.target.value)}
            autoComplete="new-password"
            placeholder="Type your mesage..."
            className="flex-grow py-2 px-4 outline-none bg-[#0c0c0c]"
          />
          <button
            type="submit"
            className="bg-emerald-400 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg"
          >
            Send
          </button>
        </div>
      </Form>

    </div>
  </div >
} 
