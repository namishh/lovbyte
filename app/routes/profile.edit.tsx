import type { MetaFunction, LoaderFunctionArgs, } from "@remix-run/node";
import type { LinksFunction, ActionFunctionArgs, } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  useLoaderData,
} from "@remix-run/react";

import { getUserAllDetails, updateUser } from "~/utils/session.server";

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  return json({
    user: await getUserAllDetails(request)
  });
};


export const action = async ({
  request,
}: ActionFunctionArgs) => {
  const form = await request.formData();
  const pfp = form.get("pfp")
  const name = form.get("name")
  const pronouns = form.get("pronouns")
  const bio = form.get("bio")
  const tech = form.get("tech") as String
  await updateUser(request, {
    pfp, name, pronouns, bio, tech: tech.split("/")
  })
  return redirect("/profile?edited=true")
}

export const meta: MetaFunction = () => {
  return [
    { title: "Love Byte" },
    { name: "description", content: "find your dream programmer" },
  ];
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <div className="flex text-white justify-center items-center">
        <div className="px-8 py-2 md:w-2/3 w-full lg:w-1/2 " style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
          <h1 className="text-white text-4xl">Edit <span className="text-emerald-400">Profile.</span></h1>
          <form className="mt-4" method="post" encType="multipart/form-data">
            <div className="flex flex-col gap-3"> <label htmlFor="username-input" className="text-white">Link To Profile Pic</label>
              <input
                type="text"
                id="pfp-input"
                name="pfp"
                defaultValue={data.user?.pfp}
                className="p-3 bg-neutral-900 rounded-xl focus:bg-neutral-800 focus:outline-none text-white"
              />
            </div>
            <div className="flex mt-4 flex-col gap-3"> <label htmlFor="username-input" className="text-white">Display Name</label>
              <input
                type="text"
                id="name-input"
                name="name"
                defaultValue={data.user?.name}
                className="p-3 bg-neutral-900 rounded-xl focus:bg-neutral-800 focus:outline-none text-white"
              />
            </div>
            <div className="flex mt-4 flex-col gap-3"> <label htmlFor="username-input" className="text-white">Pronouns</label>
              <input
                type="text"
                id="pronouns-input"
                name="pronouns"
                defaultValue={data.user?.pronouns}
                className="p-3 bg-neutral-900 rounded-xl focus:bg-neutral-800 focus:outline-none text-white"
              />
            </div>
            <div className="flex mt-4 flex-col gap-3"> <label htmlFor="username-input" className="text-white">Bio</label>
              <textarea
                id="bio-input"
                name="bio"
                rows={10}
                defaultValue={data.user?.bio}
                className="p-3 bg-neutral-900 rounded-xl focus:bg-neutral-800 focus:outline-none text-white"
              />
            </div>
            <div className="flex mt-4 flex-col gap-3"> <label htmlFor="username-input" className="text-white">Technologies (separate them with /)</label>
              <input
                type="text"
                id="tech-input"
                name="tech"
                defaultValue={data.user?.tech.join("/")}
                className="p-3 bg-neutral-900 rounded-xl focus:bg-neutral-800 focus:outline-none text-white"
              />
            </div>
            <button type="submit" className="button bg-emerald-400 inline-block self-start px-10 py-2 text-black mt-8 rounded-xl">
              Submit
            </button>

          </form>
        </div>
      </div>
    </>
  );
}
