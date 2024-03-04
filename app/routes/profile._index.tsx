import type { LoaderFunctionArgs, } from "@remix-run/node";
import { json } from "@remix-run/node";
import { PencilSimple, TrashSimple } from "phosphor-react";
import {
  Link,
  useLoaderData,
} from "@remix-run/react";
import { getProjects } from "~/utils/project.server";

import { getUserAllDetails } from "~/utils/session.server";

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  return json({
    user: await getUserAllDetails(request),
    projects: await getProjects(request)
  });
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}


export default function ProfileIndex() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="flex text-white justify-center items-center">
      <div className="px-0 md:px-4 lg:px-8 md:py-0 py-2 md:w-2/3 w-full lg:w-1/2 " style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
        <div className="flex px-4 flex-col flex-wrap md:flex-row justify-between items-start gap-8 md:items-end">
          <div className="flex gap-4  flex-wrap items-end">
            <Link to="avatar" className="relative group border-2 border-white rounded-full">
              <div className="absolute w-full h-full  bg-neutral-800 rounded-full transition flex justify-center items-center opacity-0 group-hover:opacity-80">
                <p className="text-sm">CHANGE</p>
              </div>
              <img src={data.user?.pfp} alt="" className="h-16 object-cover w-16 md:h-24 md:w-24 bg-neutral-800 rounded-full" />
            </Link>
            <div className="flex flex-col">
              <h1 className="text-3xl">{data.user?.name}</h1>
              <h1 className="text-xl text-gray-500">@{data.user?.username} | {data.user?.pronouns}</h1>
            </div>
          </div>
          <div className="flex gap-4 ml-4 flex-wrap">
            <Link to="/profile/changepassword" className="text-lg text-emerald-400">Change Password</Link>
            <Link to="/profile/edit" className="text-lg text-emerald-400">Edit</Link>
          </div>
        </div>
        <div className="px-12 py-[1px] bg-neutral-800 my-8"></div>
        <div className="mt-4 px-4 flex gap-4">
          <h2 className="text-xl text-gray-500">Email - </h2>
          <p className="whitespace-pre-wrap">{data.user?.email}</p>
        </div>
        <div className="mt-4 px-4 flex gap-4">
          <h2 className="text-xl text-gray-500">Date Of Birth - </h2>
          <div className="">{formatDate(String(data.user?.dob))}</div>
        </div>
        <div className="mt-4 px-4">
          <h2 className="text-xl text-gray-500">About Me.</h2>
          <div className="my-2 whitespace-pre-wrap">{data.user?.bio ? data.user?.bio : "No bio set."}</div>
        </div>
        <div className="mt-4 px-4">
          <h2 className="text-xl text-gray-500">Socials.</h2>
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
        <div className="mt-4 px-4">
          <h2 className="text-xl text-gray-500">Technologies.</h2>
          <div className="my-2">{data.user?.tech[0] ? (
            <div className="flex flex-wrap gap-4">
              {data.user.tech?.map((i, j) => {
                return <div className="px-6 py-2 rounded-xl bg-neutral-900" key={j}>{i}</div>
              })}
            </div>
          ) : "No tech stack set."}</div>
        </div>
        <div className="px-12 py-[1px] bg-neutral-800 my-8"></div>
        <div className="flex justify-between mx-6 items-end">
          <h1 className="text-3xl">Projects</h1>
          <Link to="newproject" className="text-lg text-emerald-400">New</Link>
        </div>
        {data.projects.length > 0 ? <div className="flex mt-4 flex-wrap mx-4">
          {data.projects.map((i, j) => <a key={j} href={`${i.url ? i.url : '#'}`} className="md:w-1/2 w-full h-48 md:p-2"> <div className="w-full p-4 relative rounded-xl h-full" style={{ background: `linear-gradient(to right, #0f0f0fee, #0f0f0fdd), url(${i.image})`, backgroundSize: `cover`, }}><div className="flex-col items-end flex justify-end h-full">
            <p className="text-xl">{i.name}</p>
            <p className="text-md text-gray-300">{i.description}</p>
            <div className="absolute top-[0] left-0 p-3 flex gap-2">
              <Link to={`${i.name}/edit`}><PencilSimple size={20} className="text-emerald-400" /></Link>
              <Link to={`${i.name}/delete`}><TrashSimple size={20} className="text-red-300" /></Link>
            </div>
          </div></div></a>)}
        </div> :
          <div className="flex h-128 mt-4 p-16 justify-center items-center">
            <p className="text-md text-gray-500">No projects</p>
          </div>
        }
      </div>
    </div>
  );
}

