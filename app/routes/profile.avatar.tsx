import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, UploadHandler } from "@remix-run/node";
import {
  redirect,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { useSearchParams, useLoaderData, Form, useActionData } from "@remix-run/react";
import { getUserAllDetails, updateUser, } from "~/utils/session.server";

import { useState } from "react";
import { uploadImage } from "~/utils/image.server";
import { badRequest } from "~/utils/request.server";


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
  const clonedData = request.clone()

  const fields = {}
  const form = await clonedData.formData();
  const i = form.get("img")

  if (i.size > 256000) {
    return badRequest({
      fieldErrors: null,
      fields,
      formError: `File Size Too Big. Should be <256KB`,
    });
  }
  const uploadHandler: UploadHandler = composeUploadHandlers(
    async ({ name, data }) => {
      if (name !== "img") {
        return undefined;
      }
      const uploadedImage = await uploadImage(data);
      return uploadedImage.secure_url;
    },
    createMemoryUploadHandler(),
  );

  const formData = await parseMultipartFormData(request, uploadHandler);
  let a = formData.get("img")
  if (!a) {
    return badRequest({
      fieldErrors: null,
      fields,
      formError: `There was a error changing your pfp`,
    });
  }
  await updateUser(request, {
    pfp: a
  })
  return redirect("/profile")
};



export default function ProfileAvatar() {
  const [searchParams] = useSearchParams();
  const actionData = useActionData<typeof action>();
  const data = useLoaderData<typeof loader>();
  const [image, setImage] = useState(data.pfp)

  const handleChange = (e: any) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <div className="flex justify-center items-center px-2 md:px-4 lg:px-24">
      <div className="container w-full md:w-1/2 lg:w-1/3 p-8 rounded-xl bg-neutral-900">
        <div className="flex gap-4 mb-8 items-center">
          <img src={data.pfp} className="h-12 w-12 rounded-full object-cover" />
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
              name="img"
              className="file:border-none file:focus:border-none file:px-4 file:py-2 file:bg-neutral-800 file:rounded-xl file:focus:bg-neutral-700 file:focus:outline-none file:text-white"
              type="file"
              onChange={handleChange}
              accept="image/*"
              required={true}
            />
          </div>
          {actionData?.formError ? (
            <div id="my-3">
              <p
                className="text-red-300"
                role="alert"
              >
                {actionData.formError}
              </p>
            </div>
          ) : null}
          <img src={image} className="max-h-64 object-cover max-w-64 rounded-2xl" />
          <button type="submit" className="button text-emerald-400 bg-neutral-800 inline-block self-start px-10 py-3 rounded-xl">
            Change My Avatar
          </button>
        </Form>
      </div >
    </div >
  );
}

