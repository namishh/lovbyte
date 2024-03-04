import type { LinksFunction, ActionFunctionArgs, } from "@remix-run/node";
import { Link, useSearchParams, useActionData } from "@remix-run/react";
import { login, createUserSession, updateUserPassword, } from "~/utils/session.server";

import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";
import type { LoaderFunctionArgs, } from "@remix-run/node";

import { redirect } from "@remix-run/node";
import { getUser } from "~/utils/session.server";

import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Change Your Password" },
    { name: "description", content: "Welcome to lovbyte!" },
  ];
};

function validatePassword(password: string) {
  if (password.length < 6) {
    return "Passwords must be at least 6 characters long";
  }
}

function validateconfirm(p: string, c: string) {
  console.log(p, c)
  if (p !== c) {
    return "Passwords do not match"
  }
}

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const user = await getUser(request)
  if (!user) {
    return redirect("/user")
  }
  return null
};

export const action = async ({
  request,
}: ActionFunctionArgs) => {
  const form = await request.formData();
  const password = form.get("password");
  const conf = form.get("conf") as string;
  if (
    typeof password !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Form not submitted correctly.",
    });
  }

  const fields = { password, conf };
  const fieldErrors = {
    password: validatePassword(password),
    conf: validateconfirm(password, conf)
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  await updateUserPassword(request, password);
  return redirect("/profile")
}


export default function ProfileChangePassword() {
  const [searchParams] = useSearchParams();

  const actionData = useActionData<typeof action>();

  return (
    <div className="flex justify-center items-center p-2 md:p-4 lg:p-24">
      <div className="container w-full md:w-1/2 lg:w-1/3 p-8 rounded-xl bg-neutral-900">
        <h1 className="text-4xl mb-4 text-white font-bold">Reset Password<span className="text-emerald-400">.</span></h1>
        <form className="flex flex-col gap-6" method="post">
          <input
            type="hidden"
            name="redirectTo"
            value={
              searchParams.get("redirectTo") ?? undefined
            }
          />
          <div className="flex flex-col gap-3">
            <label htmlFor="password-input" className="text-white">Password</label>

            <input
              id="password-input"
              defaultValue={actionData?.fields?.password}
              name="password"
              className="p-3 bg-neutral-800 rounded-xl focus:bg-neutral-700 focus:outline-none text-white"
              type="password"
            />
            {actionData?.fieldErrors?.password ? (
              <p
                className="text-red-300"
                role="alert"
                id="password-error"
              >
                {actionData.fieldErrors.password}
              </p>
            ) : null}

          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="conf-input" className="text-white">Confirm Password</label>
            <input
              type="password"
              id="conf-input"
              name="conf"
              className="p-3 bg-neutral-800 rounded-xl focus:bg-neutral-700 focus:outline-none text-white"
            />
            {actionData?.fieldErrors?.conf ? (
              <p
                className="text-red-300"
                role="alert"
                id="password-error"
              >
                {actionData.fieldErrors.conf}
              </p>
            ) : null}
          </div>
          <button type="submit" className="button bg-emerald-400 inline-block self-start px-10 py-3 rounded-xl">
            Submit
          </button>
        </form>
      </div >
    </div >
  );
}


