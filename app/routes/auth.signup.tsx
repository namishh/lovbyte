import type { LinksFunction, ActionFunctionArgs, } from "@remix-run/node";
import { Link, useSearchParams, useActionData } from "@remix-run/react";
import { createUserSession, register } from "~/utils/session.server";

import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";

import type { LoaderFunctionArgs, } from "@remix-run/node";

import { redirect } from "@remix-run/node";
import { getUser } from "~/utils/session.server";

import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Sign Up" },
    { name: "description", content: "Welcome to lovbyte!" },
  ];
};

function validateUsername(username: string) {
  if (username.length < 4) {
    return "Usernames must be at least 4 characters long";
  }
}

function validatePassword(password: string) {
  if (password.length < 6) {
    return "Passwords must be at least 6 characters long";
  }
}


export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const user = await getUser(request)
  if (user) {
    return redirect("/users")
  }
  return null
};

export const action = async ({
  request,
}: ActionFunctionArgs) => {
  const form = await request.formData();
  const password = form.get("password");
  const email = form.get("email") as string;
  const username = form.get("username");

  if (
    typeof password !== "string" ||
    typeof username !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Form not submitted correctly.",
    });
  }

  const fields = { password, username, email };
  const fieldErrors = {
    password: validatePassword(password),
    username: validateUsername(username),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  const userExists = await db.user.findFirst({
    where: { email: String(email) },
  });
  const userExists2 = await db.user.findFirst({
    where: { username },
  });
  if (userExists) {
    return badRequest({
      fieldErrors: null,
      fields,
      formError: `User with email ${email} already exists`,
    });
  } else if (userExists2) {
    return badRequest({
      fieldErrors: null,
      fields,
      formError: `User with username ${username} already exists`,
    });
  } else {
    const user = await register({ username, password, email });
    console.log({ user });
    if (!user) {
      return badRequest({
        fieldErrors: null,
        fields,
        formError:
          "Something went wrong trying to create a new user.",
      });
    }
    return createUserSession(user.id, "/users");

  }
}


export default function Login() {
  const [searchParams] = useSearchParams();

  const actionData = useActionData<typeof action>();

  return (
    <div className="flex justify-center items-center p-4 md:p-16 lg:p-24">
      <div className="container w-full md:w-1/2 lg:w-1/3 p-8 rounded-xl bg-neutral-900">
        <h1 className="text-4xl mb-4 text-white font-bold">Sign Up<span className="text-emerald-400">.</span></h1>
        <form className="flex flex-col gap-6" method="post">
          <input
            type="hidden"
            name="redirectTo"
            value={
              searchParams.get("redirectTo") ?? undefined
            }
          />
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3"> <label htmlFor="username-input" className="text-white">Username</label>
              <input
                type="text"
                id="username-input"
                name="username"
                defaultValue={actionData?.fields?.username}
                className="p-3 bg-neutral-800 rounded-xl focus:bg-neutral-700 focus:outline-none text-white"
              />
            </div>
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
            {actionData?.fieldErrors?.password ? (
              <p
                className="text-red-300"
                role="alert"
                id="password-error"
              >
                {actionData.fieldErrors.password}
              </p>
            ) : null}
            <div id="my-3">
              {actionData?.formError ? (
                <p
                  className="text-red-300"
                  role="alert"
                >
                  {actionData.formError}
                </p>
              ) : null}
            </div>

          </div>
          <button type="submit" className="button bg-emerald-400 inline-block self-start px-10 py-3 rounded-xl">
            Submit
          </button>
          <Link to="/signin" className="cursor-pointer mt-2 underline text-emerald-400">Already have an account?</Link>
        </form>
      </div >
    </div >
  );
}

