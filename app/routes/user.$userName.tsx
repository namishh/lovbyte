import { fetchUser } from "~/utils/users.server";
import type { LoaderFunctionArgs, } from "@remix-run/node";
import { redirect, useLoaderData, Link } from "@remix-run/react";
import { ArrowRight, Prohibit, Heart } from "phosphor-react";
import { getUserBlockedFriends } from "~/utils/session.server";


export const loader = async ({
  params, request
}: LoaderFunctionArgs) => {
  const user = await fetchUser(request, String(params.userName))
  const fb = await getUserBlockedFriends(request)
  if (!user) {
    return redirect("/")
  }
  return { user: user.user, projects: user.projects, blocked: fb?.blocked.includes(params.userName), liked: fb?.liked.includes(params.userName) }
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
    <div className="flex text-white p-8 justify-center items-center">
      <div className="px-0 md:px-4 lg:px-8 md:py-0 py-2 md:w-2/3 w-full lg:w-1/2" style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
        <div className="flex justify-between flex-wrap gap-4  items-center w-full">
          <div className="div flex flex-wrap gap-4 flex-col md:flex-row items-start md:items-center">
            <img src={data.user?.pfp} alt="" className="h-24 object-cover w-24 border-2 border-white rounded-full" />
            <div className="flex flex-col gap-[0]">
              <h1 className="text-3xl text-white">{data.user?.name}</h1>
              <h1 className="text-md text-gray-300">@{data.user?.username} | {data.user.pronouns} | {formatDate(data.user?.dob)}</h1>
            </div>
          </div>
          <div className="flex gap-3">
            <Link className={`${data.liked ? "bg-pink-300 text-neutral-950" : "text-pink-300 bg-neutral-900"} p-3 rounded-xl`} to="add"><Heart size={26} /></Link>
            <Link className={`${data.blocked ? "bg-red-300 text-neutral-950" : "text-red-300 bg-neutral-900"} p-3 rounded-xl`} to="block"><Prohibit size={26} /></Link>
            <Link className="text-emerald-300 p-3 bg-neutral-900 rounded-xl" to="/user"><ArrowRight size={26} /></Link>
          </div>
        </div>
        <p className="mt-6 mx-4 whitespace-pre-wrap">{data.user.bio ? data.user.bio : 'No Bio'}</p>
        <div className="px-8 mt-6 py-[0.1rem] bg-neutral-900"></div>
        <div className="mt-6 px-4">
          <h2 className="text-2xl text-white">Socials</h2>
          <div className="my-2 ">{(data.user?.personalSite || data.user?.github || data.user?.twitter) ? (
            <div>
              {data.user?.personalSite && <div className="flex my-2 flex-wrap gap-4">
                <p className="text-white">Personal Site: </p>
                <a className="text-emerald-400" href={`${data.user?.personalSite}`}>{data.user.personalSite}</a>
              </div>
              }
              {data.user?.github && <div className="flex my-2 flex-wrap gap-4">
                <p className="text-white">Github: </p>
                <a className="text-emerald-400" href={`https://github.com/${data.user?.github}`}>{data.user?.github}</a>
              </div>
              }
              {data.user?.twitter && <div className="flex my-2 flex-wrap gap-4">
                <p className="text-white">Twitter: </p>
                <a className="text-emerald-400" href={`https://twitter.com/${data.user?.twitter}`}>@{data.user?.twitter}</a>
              </div>
              }
            </div>
          ) : "No Social Given"}</div>
        </div>
        <div className="mt-6 mx-4">
          <h1 className="text-2xl text-white">Tech</h1>
          <div className="my-2">{data.user?.tech[0] ? (
            <div className="flex flex-wrap gap-4">
              {data.user.tech?.map((i, j) => {
                return <div className="px-6 py-2 rounded-xl bg-neutral-900" key={j}>{i}</div>
              })}
            </div>
          ) : "No tech stack set."}</div>
        </div>
        <div className="mt-6">
          <h1 className="text-2xl text-white mx-4">Showcase</h1>
          {data.projects.length > 0 ? <div className="flex mt-4 flex-wrap mx-4">
            {data.projects.map((i, j) => <a key={j} href={`${i.url ? i.url : '#'}`} className="md:w-1/2 w-full h-48 py-2 md:p-2"> <div className="w-full p-4 relative rounded-xl h-full" style={{ background: `linear-gradient(to right, #0f0f0fee, #0f0f0fdd), url(${i.image})`, backgroundSize: `cover`, }}><div className="flex-col items-end flex justify-end h-full">
              <p className="text-xl">{i.name}</p>
              <p className="text-md text-gray-300">{i.description}</p>
            </div></div></a>)}
          </div> :
            <div className="flex h-128 mt-4 p-16 justify-center items-center">
              <p className="text-md text-gray-500">No projects</p>
            </div>
          }

        </div>
      </div>
    </div>
  );
}
