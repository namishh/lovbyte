import { db } from "./db.server";
import { getUserId, logout } from "./session.server";

export async function getProjects(request: Request) {
  const userId = await getUserId(request)

  if (!userId) {
    throw await logout(request);
  }

  const projects = await db.project.findMany({
    select: { name: true, image: true, description: true, url: true },
    where: { userId },
  });

  return projects
}
