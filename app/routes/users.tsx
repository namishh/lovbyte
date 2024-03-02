import type { MetaFunction, LoaderFunctionArgs, } from "@remix-run/node";
import { useState } from "react"
import { json } from "@remix-run/node";
import {
  Link,
  Outlet,
  useLoaderData,
} from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { getUser } from "~/utils/session.server";

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const user = await getUser(request)
  if (!user) {
    return redirect("/auth/signin")
  }
  return json({
    user: await getUser(request)
  });
};


export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Users() {
  const data = useLoaderData<typeof loader>();
  const [open, setOpen] = useState(false)
  return (
    <div>
      <div className="z-50 sticky top-0 p-4 md:p-8 lg:px-16 w-full md:flex md:items-center md:justify-between">
        <div className="flex items-center justify-between">
          <a className="flex cursor-pointer items-center" href="/">
            <span className="text-2xl cursor-pointer antialiased font-bold  text-white">lovbyte</span>
            <span className="text-2xl cursor-pointer antialiased font-bold  text-emerald-400">.</span>
          </a>
          <span onClick={() => setOpen(!open)} className="toggler cursor-pointer self-center">
            <div className="flex gap-[0.4rem] md:hidden flex-col">
              <div className="div bg-emerald-400 w-8 h-[0.5px]"></div>
              <div className="div bg-emerald-400 w-6 h-[0.5px]"></div>
              <div className="div bg-emerald-400 w-4 h-[0.5px]"></div>
            </div>
          </span>
        </div>
        <ul className={`md:flex md:items-center ml-0 z-[-1] md:z-auto navlist list-none ${open ? '' : 'hidden'}  sm:visible transition-all duration-400 md-static ms:absolute `}>
          <li className="mx-0 my-6 md:my-0 md:mx-4" ><Link to="/users" className="text-xl hover:!text-emerald-400 cursor-pointer  font-medium !text-white"  >/users</Link></li>
          {data.user ? <li className="mx-0 my-6 md:my-0 md:mx-4" ><Link to="/profile" className="text-xl hover:!text-emerald-400 cursor-pointer font-medium !text-white" >/profile</Link></li> :
            <li className="mx-0 my-6 md:my-0 md:mx-4" ><Link to="/auth/signin" className="text-xl hover:!text-emerald-400 cursor-pointer font-medium !text-white" >/signin</Link></li>
          }
          {data.user ? <li className="mx-0 my-6 md:my-0 md:mx-4" ><form method="post" action="/auth/signout"><button type="submit" className="text-xl hover:!text-emerald-400 cursor-pointer font-medium !text-white" >/signout</button></form></li> :
            <li className="mx-0 my-6 md:my-0 md:mx-4" ><Link to="/auth/signup" className="text-xl hover:!text-emerald-400 cursor-pointer font-medium !text-white" >/signup</Link></li>
          }
        </ul>
      </div>
      <Outlet />
    </div>
  );
}
