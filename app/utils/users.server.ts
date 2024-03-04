import { redirect } from "@remix-run/node";
import { db } from "./db.server";
import { getUserBlockedFriends, getUserId } from "./session.server";

export const getRandomUser = async (request: Request) => {
  const userId = await getUserId(request);
  const ids = await getUserBlockedFriends(request)
  if (typeof userId !== "string") {
    return redirect("/");
  }
  // @ts-expect-error
  const userIdsToExclude = [userId, ...ids?.liked, ...ids?.blocked, ...ids?.matched]
  const randomUser = await db.$runCommandRaw({
    "aggregate": "User",
    "cursor": {},
    "pipeline": [
      { "$match": { "_id": { "$nin": userIdsToExclude } } },
      { "$sample": { "size": 1 } }
    ]
  });
  // @ts-expect-error
  return randomUser.cursor.firstBatch[0];
}

export async function fetchUser(request: Request, name: string) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }

  const user = await db.user.findUnique({
    select: { twitter: true, id: true, github: true, tech: true, pronouns: true, name: true, username: true, bio: true, dob: true, pfp: true, personalSite: true },
    where: { username: name },
  });


  const projects = await db.project.findMany({
    select: { name: true, image: true, description: true, url: true },
    where: { userId: user?.id },
  });

  if (!user) {
    return null
  }
  if (user.id == userId) {
    return null
  }

  return { user: { ...user, id: '' }, projects };
}
