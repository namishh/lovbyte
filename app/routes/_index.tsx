import type { MetaFunction, LoaderFunctionArgs, } from "@remix-run/node";
import { useState } from "react"
import { json } from "@remix-run/node";
import {
  Link,
  Outlet,
  useLoaderData,
} from "@remix-run/react";

import { getUser } from "~/utils/session.server";

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  return json({
    user: await getUser(request)
  });
};

export const meta: MetaFunction = () => {
  return [
    { title: "Love Byte" },
    { name: "description", content: "find your dream programmer" },
  ];
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const [open, setOpen] = useState(false)
  return (
    <>
      <div>
        <div className="z-50 sticky top-0 p-4 md:p-8 lg:px-16 w-full md:flex md:items-center md:justify-between">
          <div className="flex items-center justify-between">
            <a className="flex cursor-pointer items-center" href="/">
              <span className="text-2xl cursor-pointer antialiased font-bold  text-gray-200">lov<span className="text-white">byte</span></span>
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
      </div>
      <div className="flex justify-center items-center">
        <div className="px-4 md:px-8 lg:px-12 py-2 md:py-8 lg:py-12  md:w-2/3 w-full lg:w-1/2" style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-200">Find The <span className="text-white">One</span>, <span className="text-emerald-400 font-bold"><span>{'< '}</span> For You <span>{'/'}</span> {'>'}.</span></h1>
          <div className="px-12 py-[1px] bg-neutral-800 my-8"></div>
          <p className="text-xl mt-3 md:mt-6 leading-[2.4rem] text-gray-200">Welcome to <span className="text-emerald-400">lovbyte</span>, where programming meets cupid. Your place to find the perfect programming date. Share your projects, social links and your tech stack to win over the hearts of others.</p>
          <h1 className="text-2xl md:text-3xl mt-4 font-bold text-gray-200">Blazingly <span className="line-through	text-emerald-400"> Stupid </span></h1>
          <div className="mt-4 flex flex-wrap justicenter">
            <div className="card py-2 md:px-2 w-full md:w-1/3">
              <div className="w-full h-full p-4 bg-neutral-900 rounded-2xl flex-col flex">
                <p className="text-xl font-bold text-emerald-400">Extensive Profile</p>
                <p className="text-gray-200">Profiles with many options (tech stack, projects, etc).</p>
              </div>
            </div>
            <div className="card py-2 md:px-2 w-full md:w-1/3">
              <div className="w-full h-full p-4 bg-neutral-900 rounded-2xl flex-col flex">
                <p className="text-xl font-bold text-emerald-400">Meet New People</p>
                <p className="text-gray-200">Explore different people with their tech stack / interests.</p>
              </div>
            </div>
            <div className="card md:px-2 py-2 w-full md:w-1/3">
              <div className="w-full h-full p-4 bg-neutral-900 rounded-2xl flex-col flex">
                <p className="text-xl font-bold text-emerald-400">Chat with them!</p>
                <p className="text-gray-200">Functional chatrooms that work 20% of the time.</p>
              </div>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl mt-6 font-bold text-gray-200">For Developers<span className="text-emerald-400"> By </span> Devlopers</h1>
          <p className="text-xl mt-3 md:mt-6 leading-[2.4rem] text-gray-200">Yes. This is a joke site mostly made for learning typescript, remix and prisma. It is opensourced and you can contribute to it <a href="https://github.com/chadcat7/lovbyte" className="text-emerald-400 underline">here.</a> Currently its only developed by me and sometimes tested by my friend <a href="https://lineararray.nekoweb.org/" className="text-emerald-400 underline">lineararary.</a>Also shoutout to <a href="arjunaditya.vercel.app" className="text-emerald-400 underline">nermal</a> for the orignal idea.</p>
        </div>
      </div>
    </>
  );
}
