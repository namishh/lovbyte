import type { MetaFunction, LoaderFunctionArgs, } from "@remix-run/node";
import { useState } from "react"
import { json } from "@remix-run/node";
import {
  Link,
  useLoaderData,
} from "@remix-run/react";

import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  return json({
    userListItems: await db.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, username: true },
      take: 5,
    }),
    user: await getUser(request)
  });
};


export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="p-8" style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1 className="text-xl text-white">All Users</h1>
      {data.userListItems.map(({ id, name, username }) => (
        <li key={id}>
          <Link className="text-white" to={username}>{name}</Link>
        </li>
      ))}
    </div>
  );
}
