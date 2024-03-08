import { fetchUser } from "~/utils/users.server";
import type { LoaderFunctionArgs, } from "@remix-run/node";
import { redirect, useLoaderData, Link } from "@remix-run/react";
import { getUserBlockedFriends, getUserId } from "~/utils/session.server";
import { getAllMatched } from "~/utils/users.server";
import { db } from "~/utils/db.server";
import { ArrowUpRight, UserMinus, Prohibit } from "phosphor-react";

export const loader = async ({
  request
}: LoaderFunctionArgs) => {
  const user = await getUserId(request)
  if (!user) {
    return redirect("/")
  }
  const people = await getAllMatched(request)
  return { people }
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="flex text-white p-8 justify-center items-center">
      <div className="px-0 md:px-4 lg:px-8 md:py-0 py-2 md:w-2/3 w-full lg:w-1/2" style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
        <h1 className="text-3xl text-bright font-bold">Matched</h1>
        <h1 className="text-2xl text-white mt-4 font-light">Click on them to chat with them!</h1>
        <div className="flex flex-col mt-8 gap-4">
          {data.people?.map((i, j) => {
            return <div className="flex gap-4 flex-wrapped items-center justify-between" key={j}>
              <a href={`/chat/${i?.user.username}`} className="flex flex-wrapped items-center gap-4">
                <img className="w-8 h-8 rounded-full border-[1px] border-white" src={i?.user.pfp} />
                <p className="text-xl text-white">{i?.user.name}</p>
              </a>
              <div className="flex gap-2 items-center">
                <Link to={`/user/${i?.user.username}`}>
                  <ArrowUpRight size={22} className="text-gray-300" />
                </Link>
                <Link to={`/user/${i?.user.username}/add`}>
                  <UserMinus size={20} className="text-pink-300" />
                </Link>
                <Link to={`/user/${i?.user.username}/block`}>
                  <Prohibit size={20} className="text-red-300" />
                </Link>
              </div>
            </div>
          })}
        </div>
      </div>
    </div>
  );
}

