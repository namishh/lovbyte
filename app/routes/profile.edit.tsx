import type { MetaFunction, LoaderFunctionArgs, } from "@remix-run/node";
import type { ActionFunctionArgs, } from "@remix-run/node";
import { badRequest } from "~/utils/request.server";
import { json, redirect } from "@remix-run/node";
import {
  useLoaderData, useActionData
} from "@remix-run/react";

import { getUserAllDetails, updateUser } from "~/utils/session.server";

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  return json({
    user: await getUserAllDetails(request)
  });
};


const validateBio = (bio: string) => {
  if (bio.length > 200) {
    return "Bio cannot be more than 200 characters"
  }
}

const validateName = (name: string) => {
  if (name.length >= 30) {
    return "Name cannot be more than 30 characters"
  }
}

const validatePronouns = (name: string) => {
  if (name.length >= 20) {
    return "Pronouns cannot be more than 20 characters."
  }
}

export const action = async ({
  request,
}: ActionFunctionArgs) => {
  const form = await request.formData();
  const pfp = form.get("pfp")
  const name = form.get("name") as string
  const pronouns = form.get("pronouns") as string
  const bio = form.get("bio") as string
  const twitter = form.get("twitter")
  const github = form.get("github")
  const personalSite = form.get("personalsite")
  const tech = form.get("tech") as String


  const fields = { bio, name, pronouns };
  const fieldErrors = {
    bio: validateBio(bio),
    name: validateName(name),
    pronouns: validatePronouns(pronouns)
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  await updateUser(request, {
    pfp, name, pronouns, bio, tech: tech.split("/"), twitter, github, personalSite
  })
  return redirect("/profile")
}

export const meta: MetaFunction = () => {
  return [
    { title: "Love Byte" },
    { name: "description", content: "find your dream programmer" },
  ];
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  return (
    <>
      <div className="flex text-white justify-center items-center">
        <div className="px-8  md:py-0 py-2  md:w-2/3 w-full lg:w-1/2 " style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
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
              {actionData?.fieldErrors?.name ? (
                <p
                  className="text-red-300"
                  role="alert"
                  id="password-error"
                >
                  {actionData.fieldErrors.name}
                </p>
              ) : null}
            </div>
            <div className="flex mt-4 flex-col gap-3"> <label htmlFor="username-input" className="text-white">Pronouns</label>
              <input
                type="text"
                id="pronouns-input"
                name="pronouns"
                defaultValue={data.user?.pronouns}
                className="p-3 bg-neutral-900 rounded-xl focus:bg-neutral-800 focus:outline-none text-white"
              />
              {actionData?.fieldErrors?.pronouns ? (
                <p
                  className="text-red-300"
                  role="alert"
                  id="password-error"
                >
                  {actionData.fieldErrors.pronouns}
                </p>
              ) : null}
            </div>
            <div className="flex mt-4 flex-col gap-3"> <label htmlFor="username-input" className="text-white">Bio</label>
              <textarea
                id="bio-input"
                name="bio"
                rows={10}
                defaultValue={data.user?.bio}
                className="p-3 bg-neutral-900 rounded-xl focus:bg-neutral-800 focus:outline-none text-white"
              />
              {actionData?.fieldErrors?.bio ? (
                <p
                  className="text-red-300"
                  role="alert"
                  id="password-error"
                >
                  {actionData.fieldErrors.bio}
                </p>
              ) : null}
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
            <div className="flex mt-4 flex-col gap-3"> <label htmlFor="username-input" className="text-white">Twitter Username</label>
              <input
                type="text"
                id="tech-input"
                name="twitter"
                defaultValue={data.user?.twitter}
                className="p-3 bg-neutral-900 rounded-xl focus:bg-neutral-800 focus:outline-none text-white"
              />
            </div>
            <div className="flex mt-4 flex-col gap-3"> <label htmlFor="username-input" className="text-white">Github Username</label>
              <input
                type="text"
                id="tech-input"
                name="github"
                defaultValue={data.user?.github}
                className="p-3 bg-neutral-900 rounded-xl focus:bg-neutral-800 focus:outline-none text-white"
              />
            </div>
            <div className="flex mt-4 flex-col gap-3"> <label htmlFor="username-input" className="text-white">Link To Personal Site</label>
              <input
                type="text"
                id="tech-input"
                name="personalsite"
                defaultValue={data.user?.personalSite}
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
