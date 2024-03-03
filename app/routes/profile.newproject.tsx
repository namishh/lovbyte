import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, UploadHandler } from "@remix-run/node";
import { badRequest } from "~/utils/request.server";
import { db } from "~/utils/db.server";
import {
  redirect,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createFileUploadHandler as createFileUploadHandler,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { useSearchParams, useLoaderData, Form, useActionData } from "@remix-run/react";
import { getUserAllDetails, } from "~/utils/session.server";
import fs from 'fs';
import { useState } from "react";
import { uploadImage } from "~/utils/image.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Add new project" },
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

const validateName = (name: string) => {
  if (name.length >= 15 || name.length == 0) {
    return "Name cannot be empty more than 15 characters"
  }
}

const validateURL = (name: string) => {
  if (name.length >= 50) {
    return "URL cannot be more than 50 characters"
  }
}

const validateDesc = (name: string) => {
  if (name.length >= 40 || name.length == 0) {
    return "Desciption cannot be empty or more than 40 characters"
  }
}



export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await getUserAllDetails(request)
  const clonedData = request.clone()

  const form = await clonedData.formData();
  const name = form.get("name") as string
  const i = form.get("img")
  const description = form.get("description") as string
  const url = form.get("url") as string


  const fields = { description, name, url };
  const fieldErrors = {
    description: validateDesc(description),
    name: validateName(name),
    url: validateURL(url),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  const projectExists = await db.project.findFirst({
    where: { name },
  });
  if (projectExists) {
    return badRequest({
      fieldErrors: null,
      fields,
      formError: `You already have a project with this name.`,
    });
  }

  if (i.size > 5000000) {
    return badRequest({
      fieldErrors: null,
      fields,
      formError: `File Size Too Big. Should be <5MB`,
    });
  }
  const uploadHandler: UploadHandler = composeUploadHandlers(
    async ({ name, data }) => {
      if (name !== "img") {
        return undefined;
      }
      if (!i.size) {
        return '/projects/default.jpg'
      }
      const uploadedImage = await uploadImage(data);
      return uploadedImage.secure_url;
    },
    createMemoryUploadHandler(),
  );

  const imageData = await parseMultipartFormData(request, uploadHandler);
  let image = imageData.get("img");
  await db.project.create({
    data: { name, url: url.startsWith("https://") ? url : "https://" + url, userId: user?.id, description, image },
  });
  return redirect("/profile")
};

export default function Login() {
  const [searchParams] = useSearchParams();
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [image, setImage] = useState('/projects/default.jpg')

  const handleChange = (e: any) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <div className="flex justify-center items-center px-2 md:px-4 lg:px-24">
      <div className="container w-full md:w-1/2  p-8 rounded-xl bg-neutral-900">
        <div className="flex gap-4 mb-8 items-center">
          <h1 className="text-4xl text-white font-bold">Add New Project<span className="text-emerald-400">.</span></h1>
        </div>
        <Form className="flex flex-col gap-6" method="post" encType="multipart/form-data">
          <input
            type="hidden"
            name="redirectTo"
            value={
              searchParams.get("redirectTo") ?? undefined
            }
          />
          <div className="flex flex-col gap-3"> <label htmlFor="username-input" className="text-white">Project Name</label>
            <input
              type="text"
              id="name-input"
              name="name"
              className="p-3 bg-neutral-800 transition rounded-xl focus:bg-neutral-700 focus:outline-none text-white"
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
          <div className="flex flex-col gap-3 mt-4"> <label htmlFor="username-input" className="text-white">Small Description</label>
            <input
              type="text"
              id="name-input"
              name="description"
              className="p-3 bg-neutral-800 transition rounded-xl focus:bg-neutral-700 focus:outline-none text-white"
            />
            {actionData?.fieldErrors?.description ? (
              <p
                className="text-red-300"
                role="alert"
                id="password-error"
              >
                {actionData.fieldErrors.description}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-3 mt-4"> <label htmlFor="username-input" className="text-white">URL</label>
            <input
              type="text"
              id="name-input"
              name="url"
              className="p-3 bg-neutral-800 transition rounded-xl focus:bg-neutral-700 focus:outline-none text-white"
            />
            {actionData?.fieldErrors?.url ? (
              <p
                className="text-red-300"
                role="alert"
                id="password-error"
              >
                {actionData.fieldErrors.url}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-3">
            <input
              id="image-input"
              name="img"
              className="file:border-none file:focus:border-none file:px-4 file:py-2 file:bg-neutral-800 file:rounded-xl file:focus:bg-neutral-700 file:focus:outline-none file:text-white"
              type="file"
              onChange={handleChange}
              accept="image/jpg, image/jpeg, image/png*"
            />
          </div>
          <img src={image} className="object-cover max-w-128 rounded-2xl" />
          <div className="flex flex-col gap-3">
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
          <button type="submit" className="button text-emerald-400 bg-neutral-800 inline-block self-start px-10 py-3 rounded-xl">
            Add Project
          </button>
        </Form>
      </div >
    </div >
  );
}

