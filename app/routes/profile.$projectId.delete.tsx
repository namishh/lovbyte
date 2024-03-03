import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { deleteProject } from "~/utils/project.server";

export const loader = async ({
  params, request
}: LoaderFunctionArgs) => {
  await deleteProject(request, params.projectId)
  return redirect('/profile');
};
