"use server";

import { AdminGetSpecificRequest } from "@/app/data/admin/AdminGetSpecificRequest";
import RequestChangeClient from "./_components/RequestChangeClient";

type Params = Promise<{ requestId: string }>;

export default async function RequestDetailsPage({
  params,
}: {
  params: Params;
}) {
  const { requestId } = await params;
  const data = await AdminGetSpecificRequest(requestId);

  if (!data) {
  return <div>Request not found</div>;
}


  return <RequestChangeClient data={data} />;
}
