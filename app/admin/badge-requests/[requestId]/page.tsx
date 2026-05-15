"use server";

import { AdminGetSpecificRequest } from "@/app/data/admin/AdminGetSpecificRequest";
import RequestChangeClient from "./_components/RequestChangeClient";
import { requireAdminCompleteProfile } from "@/lib/requireAdminCompleteProfile";

type Params = Promise<{ requestId: string }>;

export default async function RequestDetailsPage({
  params,
}: {
  params: Params;
}) {
  await requireAdminCompleteProfile()
  const { requestId } = await params;
  const data = await AdminGetSpecificRequest(requestId);

  if (!data) {
  return <div>Request not found</div>;
}


  return <RequestChangeClient data={data} />;
}
