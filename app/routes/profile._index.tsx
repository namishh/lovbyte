import { useState } from "react"
import type { LoaderFunctionArgs, } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  useLoaderData,
} from "@remix-run/react";

import { getUserAllDetails } from "~/utils/session.server";

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  return json({
    user: await getUserAllDetails(request)
  });
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}


export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="flex text-white justify-center items-center">
      <div className="p-8 md:w-2/3 w-full lg:w-1/2 " style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
        <div className="flex px-4 justify-between items-end">
          <div className="flex gap-4 items-end">
            <h1 className="text-4xl">{data.user?.name}</h1>
            <h1 className="text-2xl text-gray-500">@{data.user?.username}</h1>
          </div>
          <Link to="/profile/edit" className="text-lg text-emerald-400">Edit</Link>
        </div>
        <div className="px-12 py-[1px] bg-neutral-800 my-4"></div>
        <div className="mt-4 px-4 flex gap-4">
          <h2 className="text-xl text-gray-500">Email - </h2>
          <div className="">{data.user?.email ? data.user?.email : "No bio set."}</div>
        </div>
        <div className="mt-4 px-4 flex gap-4">
          <h2 className="text-xl text-gray-500">Date Of Birth - </h2>
          <div className="">{formatDate(data.user?.dob)}</div>
        </div>
        <div className="mt-4 px-4">
          <h2 className="text-xl text-gray-500">About Me.</h2>
          <div className="my-2">{data.user?.bio ? data.user?.bio : "No bio set."}</div>
        </div>
      </div>
    </div>
  );
}

