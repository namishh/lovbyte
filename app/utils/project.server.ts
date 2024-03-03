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

export async function singleProject(request: Request, name: string) {
  const userId = await getUserId(request)

  if (!userId) {
    throw await logout(request);
  }

  const project = await db.project.findFirst({
    select: { name: true, image: true, description: true, url: true },
    where: { userId, name: name },
  });

  return project
}

export async function updateProject(request: Request, name: string, newData: any) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }
  const project = await db.project.findFirst({
    where: { userId, name }
  })
  if (project?.userId !== userId) {
    return null
  }
  const updatedUser = await db.project.update({
    where: { userId: userId, name: name, id: project.id },
    data: newData,
  });

  return updatedUser
}


export async function deleteProject(request: Request, name: string) {
  const userId = await getUserId(request)
  const project = await db.project.findFirst({
    where: { userId, name }
  })
  if (project?.userId !== userId) {
    return null
  }
  if (!userId) {
    return null
  }
  const del = await db.project.delete({
    where: { userId, name, id: project.id }
  })

  return del
}
