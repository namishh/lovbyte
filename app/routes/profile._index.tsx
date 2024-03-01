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
      <div className="px-8 md:py-0 py-2 md:w-2/3 w-full lg:w-1/2 " style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
        <div className="flex px-4 flex-col flex-wrap md:flex-row justify-between items-start gap-8 md:items-end">
          <div className="flex gap-4  flex-wrap items-end">
            <img src={data.user?.pfp} alt="" className="h-24 w-24 bg-neutral-800 border-2 border-white rounded-full" />
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
        <h1 className="text-3xl mx-6">Projects</h1>
      </div>
    </div>
  );
}

