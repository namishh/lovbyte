import {
  createCookieSessionStorage,
  redirect,
} from "@remix-run/node";

import bcrypt from "bcryptjs";
import { db } from "./db.server";

type RegisterForm = {
  password: string;
  email: string;
  username: string;
  date: string;
  month: string;
  year: string;
};

type LoginForm = {
  password: string;
  email: string;
};

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "lovbyte_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function createUserSession(
  userId: string,
  redirectTo: string
) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    return null;
  }
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([
      ["redirectTo", redirectTo],
    ]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}


export async function getUserAllDetails(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }

  const user = await db.user.findUnique({
    select: { passwordHash: false, id: true, email: true, twitter: true, github: true, interests: true, tech: true, pronouns: true, name: true, username: true, bio: true, dob: true, pfp: true, personalSite: true },
    where: { id: userId },
  });

  if (!user) {
    throw await logout(request);
  }

  return user;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }

  const user = await db.user.findUnique({
    select: { id: true, email: true },
    where: { id: userId },
  });

  if (!user) {
    throw await logout(request);
  }

  return user;
}

export async function updateUser(request: Request, newData: any) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }
  const updatedUser = await db.user.update({
    where: { id: userId }, // Specify which user to update using the unique identifier
    data: newData, // Provide the new data to update
  });

  return updatedUser
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/auth/signin", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

export async function login({
  password,
  email,
}: LoginForm) {
  const user = await db.user.findUnique({
    where: { email },
  });
  if (!user) {
    return null;
  }

  const isCorrectPassword = await bcrypt.compare(
    password,
    user.passwordHash
  );
  if (!isCorrectPassword) {
    return null;
  }

  return { id: user.id, email };
}

export async function register({
  password,
  username,
  email,
  date,
  month,
  year
}: RegisterForm) {

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: {
      passwordHash, username, email, name: username, bio: "", github: "", twitter: "", interests: [], pronouns: "they/them", projects: {}, pfp: "https://api.dicebear.com/7.x/lorelei/png", tech: [], personalSite: "",
      dob: new Date(Number(year), Number(month) - 1, Number(date))
    },
  });
  return { id: user.id, username };
}


