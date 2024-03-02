import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  json, redirect,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createFileUploadHandler as createFileUploadHandler,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { useSearchParams, useLoaderData, Form } from "@remix-run/react";
import { getUserAllDetails, updateUser, } from "~/utils/session.server";

import fs from 'fs';
import { useState } from "react";


export const meta: MetaFunction = () => {
  return [
    { title: "Change Your Avatar" },
    { name: "description", content: "Welcome to lovbyte!" },
  ];
}
export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const user = await getUserAllDetails(request)
  if (!user) {
    return redirect("/auth/signin")
  }
  return user
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await getUserAllDetails(request)
  const uploadHandler = composeUploadHandlers(
    createFileUploadHandler({
      directory: "public/uploads",
      maxPartSize: 100000,
      file: () => {
        const filePath = `public/uploads/${user?.id}.jpg`;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // Delete the existing file
        }
        return `${user?.id}.jpg`;
      }
    }),
    createMemoryUploadHandler(),
  );
  const formData = await parseMultipartFormData(request, uploadHandler);
  const url = process.env.NODE_ENV == "development" ? 'http://localhost:3000' : 'https://lovbyte.vercel.app'
  if (user?.pfp !== `${url}/uploads/${user?.id}.jpg`) {
    await updateUser(request, {
      pfp: `${url}/uploads/${user?.id}.jpg`
    })
    return redirect("/profile")
  }
  const image = formData.get("img");
  if (!image || typeof image === "string") {
    return json({ error: "something wrong", imgSrc: null });
  }
  return redirect("/profile")
};



export default function Login() {
  const [searchParams] = useSearchParams();
  const data = useLoaderData<typeof loader>();
  const [image, setImage] = useState(data.pfp)

  const handleChange = (e: any) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <div className="flex justify-center items-center px-2 md:px-4 lg:px-24">
      <div className="container w-full md:w-1/2 lg:w-1/3 p-8 rounded-xl bg-neutral-900">
        <div className="flex gap-4 mb-8 items-center">
          <img src={data.pfp} className="h-12 w-12 rounded-full" />
          <h1 className="text-4xl text-white font-bold">Change Avatar<span className="text-emerald-400">.</span></h1>
        </div>
        <Form className="flex flex-col gap-6" method="post" encType="multipart/form-data">
          <input
            type="hidden"
            name="redirectTo"
            value={
              searchParams.get("redirectTo") ?? undefined
            }
          />
          <div className="flex flex-col gap-3">
            <input
              id="image-input"
              name="image"
              className="file:border-none file:focus:border-none file:px-4 file:py-2 file:bg-neutral-800 file:rounded-xl file:focus:bg-neutral-700 file:focus:outline-none file:text-white"
              type="file"
              onChange={handleChange}
              accept="image/*"
            />
          </div>
          <img src={image} className="max-h-64 max-w-64 rounded-2xl" />
          <button type="submit" className="button text-emerald-400 bg-neutral-800 inline-block self-start px-10 py-3 rounded-xl">
            Change My Avatar
          </button>
        </Form>
      </div >
    </div >
  );
}


