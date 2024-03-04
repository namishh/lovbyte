import type { MetaFunction, LoaderFunctionArgs, } from "@remix-run/node";
import { useState } from "react"
import { json } from "@remix-run/node";
import {
  Link,
  Outlet,
  useLoaderData,
} from "@remix-run/react";

import { getUser } from "~/utils/session.server";
import { ChatText, Heart, Palette, UserCircle } from "@phosphor-icons/react";

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
    <div className="min-h-screen w-full bg-neutral-950 bg-dot-white/[0.2] relative ">
      <div className="absolute pointer-events-none inset-0 -z-[10] flex items-center justify-center bg-neutral-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]">
      </div>
      <div className="z-[100]">
        <div className="z-[100] sticky top-0 p-4 md:p-8 lg:px-16 w-full md:flex md:items-center md:justify-between">
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
      <div className="flex z-[10] min-h-[33rem] md:min-h-[45rem] justify-center items-center">
        <div className="px-8 md:-2/3 w-full lg:w-1/2 mb-4" style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
          <h1 className="text-2xl text-gray-300">Find the <span className="text-emerald-400">{'< /'} one {' >'}</span>  that completes <span className="text-emerald-400">{'<'} you {'>'}</span></h1>
          <h1 className="mt-6 font-black text-white text-3xl md:text-5xl">Your perfect programmer is just a <span className="text-emerald-400">click</span> away.</h1>
          <div className="mt-4 ml-1 text-gray-300">Lovbyte is an online dating platform made for programmers by programmers. {data.user?.id ? 'Start finding your match made in heaven or make changes to your profile.' : 'Make an account today, customize your profile and find the one for you.'}</div>
          <div className="flex mt-6 flex-wrap gap-4">
            <Link className="text-black py-2 px-6 rounded-full bg-emerald-400" to={data.user?.id ? 'users' : 'auth/signup'}>{data.user?.id ? 'Find Now' : 'Sign Up'}</Link>
            <Link className="text-white py-2 px-6 rounded-full bg-neutral-900" to="https://github.com/chadcat7/lovbyte">Source Code</Link>
          </div>
        </div>
      </div>
      <div className="flex bg-[#0f0f0f] justify-center mt-8 md:mt-24  w-full items-center flex-col py-4 md:py-16 px-2 md:px-8">
        <div className="flex justify-center  w-full lg:w-1/2 items-center flex-col">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-200 text-center">Lots of <span className="text-emerald-400">Features.</span></h1>
          <div className="flex justify-center w-full flex-wrap items-center mt-6">
            <div className="p-4 w-full md:w-1/2">
              <div className="w-full h-full bg-neutral-900 shadow-[0_3px_10px_rgb(0,0,0,0.2)]  p-6 rounded-xl">
                <div className="flex justify-between items-center">
                  <UserCircle size={48} weight="thin" className="text-emerald-400" />
                  <p className="text-emerald-400 text-xl font-light">PROFILE</p>
                </div>
                <p className="text-gray-200 font-light mt-2">Profiles with extensive customization options tailored for programmers with projects, tech stack. Also you can keep gifs as pfps.</p>
              </div>
            </div>
            <div className="p-4 w-full md:w-1/2">
              <div className="w-full h-full bg-neutral-900 shadow-[0_3px_10px_rgb(0,0,0,0.2)]  p-6 rounded-xl">
                <div className="flex justify-between items-center">
                  <Heart size={48} weight="thin" className="text-emerald-400" />
                  <p className="text-emerald-400 text-lg md:text-xl font-light">MEET NEW PEOPLE</p>
                </div>
                <p className="text-gray-200 font-light mt-2">Here, you will meet tons of new and different people and connect with them to start your magical love journey.</p>
              </div>
            </div>
            <div className="p-4 w-full md:w-1/2">
              <div className="w-full h-full bg-neutral-900 shadow-[0_3px_10px_rgb(0,0,0,0.2)]  p-6 rounded-xl">
                <div className="flex justify-between items-center">
                  <ChatText size={48} weight="thin" className="text-emerald-400" />
                  <p className="text-emerald-400 text-lg md:text-xl font-light">CHAT</p>
                </div>
                <p className="text-gray-200 font-light mt-2">Like someone? Well take it forward while chatting on out website only. The chatrooms should be functional atleast 10% of the time</p>
              </div>
            </div>
            <div className="p-4 w-full md:w-1/2">
              <div className="w-full h-full bg-neutral-900 shadow-[0_3px_10px_rgb(0,0,0,0.2)]  p-6 rounded-xl">
                <div className="flex justify-between items-center">
                  <Palette size={48} weight="thin" className="text-emerald-400" />
                  <p className="text-emerald-400 text-lg md:text-xl font-light">NICE UI</p>
                </div>
                <p className="text-gray-200 font-light mt-2">The user interface is sleek and minimalist and is designed keeping the comfort and the expeirence of you, the user.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div className="flex flex-col z-[10]  justify-center items-center  py-4 md:py-16 px-2 md:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-200 text-center">For Devs, <span className="text-emerald-400"> By Devs.</span></h1>
        <div className="imgdiv mt-12 flex justify-center  md:w-2/3 w-full lg:w-1/3">
          <img src="/pfp1.webp" className="h-16 md:h-24 hover:z-[100] transition w-16 md:w-24 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-full" alt="" />
          <img src="/pfp2.webp" className="h-16 md:h-24 hover:z-[100] transition -ml-4 md:-ml-8 w-16 md:w-24 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-full" alt="" />
          <img src="/pfp5.webp" className="h-16 md:h-24 hover:z-[100] transition -ml-4 md:-ml-8 w-16 md:w-24 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-full" alt="" />
        </div>
        <p className="mt-12 w-full lg:w-1/3 px-4 md:px-0 md:w-2/3 text-gray-200 text-lg">Yes this is joke, mainly run by <a href="https://nam.is-a.dev" className="text-emerald-400 underline">me (chadcat7).</a> This is not the next billion dollar startup, rather a project that started as a joke among my friends. But I would like to thank my friends <a href="https://arjunaditya.vercel.app" className="text-emerald-400 underline">nermal</a> and <a href="https://lineararray.nekoweb.org" className="text-emerald-400 underline">linear</a> for the idea</p>
      </div>
      <div className="footer p-4 text-gray-200 bg-[#0f0f0f] text-center">
        Made With ️❤️
      </div>
    </div>
  );
}
