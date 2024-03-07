import type { ActionFunctionArgs, } from "@remix-run/node";
import { Link, useSearchParams, useActionData } from "@remix-run/react";
import { login, createUserSession, } from "~/utils/session.server";
import { badRequest } from "~/utils/request.server";
import type { LoaderFunctionArgs, } from "@remix-run/node";

import { redirect } from "@remix-run/node";
import { getUser } from "~/utils/session.server";

import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Sign In" },
    { name: "description", content: "Welcome to lovbyte!" },
  ];
};

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const user = await getUser(request)
  if (user) {
    return redirect("/user")
  }
  return null
};

export const action = async ({
  request,
}: ActionFunctionArgs) => {
  const form = await request.formData();
  const password = form.get("password");
  const email = form.get("email") as string;
  if (
    typeof password !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Form not submitted correctly.",
    });
  }

  const fields = { password, email };

  const user = await login({ email, password });
  if (!user) {
    return badRequest({
      fieldErrors: null,
      fields,
      formError: "Username/Password combination is incorrect",
    });
  }
  return createUserSession(user.id, "/user");
}


export default function AuthSignIn() {
  const [searchParams] = useSearchParams();

  const actionData = useActionData<typeof action>();

  return (
    <div className="flex justify-center items-center p-2 py-4 md:p-16 lg:p-24">
      <div className="container w-full md:w-1/2 lg:w-1/3 p-8 rounded-xl bg-neutral-900">
        <h1 className="text-4xl mb-4 text-white font-bold">Sign In<span className="text-emerald-400">.</span></h1>
        <form className="flex flex-col gap-6" method="post">
          <input
            type="hidden"
            name="redirectTo"
            value={
              searchParams.get("redirectTo") ?? undefined
            }
          />
          <div className="flex flex-col gap-3">
            <label htmlFor="email-input" className="text-white">Email</label>
            <input
              type="email"
              defaultValue={actionData?.fields?.email}
              id="email-input"
              name="email"
              className="p-3 bg-neutral-800 rounded-xl focus:bg-neutral-700 focus:outline-none text-white"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="password-input" className="text-white">Password</label>
            <input
              id="password-input"
              defaultValue={actionData?.fields?.password}
              name="password"
              className="p-3 bg-neutral-800 rounded-xl focus:bg-neutral-700 focus:outline-none text-white"
              type="password"
            />

          </div>
          <div id="form-error-message">
            {actionData?.formError ? (
              <p
                className="text-red-300"
                role="alert"
              >
                {actionData.formError}
              </p>
            ) : null}
          </div>
          <button type="submit" className="button bg-emerald-400 inline-block self-start px-10 py-3 rounded-xl">
            Submit
          </button>
          <Link to="/auth/signup" className="cursor-pointer mt-2 underline text-emerald-400">Or, Make a new account</Link>
        </form>
      </div >
    </div >
  );
}

